function pop(h,noClose){
 return '<div class="pop" '+(noClose?"":'data-a="close"')+'><div class="sheet" data-stop>'+h+'</div></div>';
}

function whenBlock(){
 var b='<div style="margin-top:14px"><h2>Wanneer</h2><div class="seg">'+
  '<button data-a="md" data-v="none" class="'+(U.md==="none"?"on":"")+'">Geen</button>'+
  '<button data-a="md" data-v="day" class="'+(U.md==="day"?"on":"")+'">Dag</button>'+
  '<button data-a="md" data-v="per" class="'+(U.md==="per"?"on":"")+'">Periode</button></div>';
 if(U.md!=="none")b+='<input type="date" id="d1" value="'+(U.d1||TD)+'">';
 if(U.md==="per")b+='<div style="height:8px"></div><input type="date" id="d2" value="'+(U.d2||"")+'">';
 return b+'</div>';
}

function sheet(){
 if(U.sheet==="new")
  return pop('<h2>Nieuwe taak'+(U.filt?" - "+esc(U.filt):"")+'</h2>'+
   '<input type="text" id="tt" placeholder="Wat moet er gebeuren?" value="'+esc(U.tt)+'" autocomplete="off">'+
   whenBlock()+'<button class="btn" data-a="save">Bewaren</button>'+
   '<button class="btn ghost" data-a="close">Annuleren</button>');

 if(U.sheet==="newl")
  return pop('<h2>'+(U.editl?"Lijst wijzigen":"Nieuwe lijst")+'</h2>'+
   '<input type="text" id="tt" placeholder="Waarvoor is deze lijst?" value="'+esc(U.tt)+'" autocomplete="off">'+
   whenBlock()+'<button class="btn" data-a="savel">'+(U.editl?"Bewaren":"Lijst maken")+'</button>'+
   '<button class="btn ghost" data-a="close">Annuleren</button>');

 if(U.sheet==="task")
  return pop('<h2>Taak</h2><input type="text" id="tt" value="'+esc(U.tt)+'" autocomplete="off">'+
   whenBlock()+'<button class="btn" data-a="savet">Bewaren</button>'+
   '<button class="btn warn" data-a="delt">Verwijderen</button>'+
   '<button class="btn ghost" data-a="close">Annuleren</button>');

 if(U.sheet==="picks"){
  var h='<h2>Wat plan je?</h2>';
  for(var i=0;i<D.subjects.length;i++)
   h+='<button class="row" data-a="sel" data-v="'+D.subjects[i].id+'"><span>'+esc(D.subjects[i].name)+
      '</span><span class="muted">'+(D.subjects[i].scope==="week"?"weekdagen":
      D.subjects[i].scope==="all"?"elke dag":"vrij")+'</span></button>';
  return pop(h+'<div style="height:16px"></div>'+
   '<input type="text" id="ns" placeholder="Iets anders" autocomplete="off">'+
   '<button class="btn" data-a="mk2">Toevoegen</button>'+
   '<button class="btn ghost" data-a="close">Sluiten</button>');
 }

 if(U.sheet==="scope")
  return pop('<h2>'+esc(U.pend)+'</h2><p class="sub">Welke dagen hebben iemand nodig? '+
   'Dat bepaalt wanneer de app een gat laat zien.</p>'+
   '<button class="btn" data-a="sc" data-v="week">Weekdagen</button>'+
   '<button class="btn" data-a="sc" data-v="all">Elke dag</button>'+
   '<button class="btn soft" data-a="sc" data-v="none">Geen vaste dagen</button>',1);

 if(U.sheet==="who"){
  var h='<h2>'+fmt(U.pd)+'</h2><p class="sub">Wie doet dit?</p>';
  if(!D.people.length)h+='<p class="muted">Voeg eerst iemand toe bij Meer.</p>';
  for(var i=0;i<D.people.length;i++)
   h+='<button class="btn" style="background:'+P[i%6]+'" data-a="pick" data-v="'+i+'">'+
      esc(D.people[i])+'</button>';
  return pop(h+'<button class="btn ghost" data-a="close">Annuleren</button>');
 }

 if(U.sheet==="conf")
  return pop('<h2>Zeker?</h2><p class="sub">'+esc(U.pend)+'</p>'+
   '<button class="btn warn" data-a="yes">Ja, verwijderen</button>'+
   '<button class="btn ghost" data-a="close">Nee</button>',1);

 return "";
}

function bind(){
 var ns=el.querySelectorAll("[data-a]");
 for(var i=0;i<ns.length;i++){
  (function(n){
   n.onclick=function(e){e.stopPropagation();act(n.getAttribute("data-a"),n.getAttribute("data-v"),n)};
  })(ns[i]);
 }
 var st=el.querySelectorAll("[data-stop]");
 for(var i=0;i<st.length;i++)st[i].onclick=function(e){e.stopPropagation()};
 var fi=el.querySelector("#fi");
 if(fi)fi.onchange=doImport;
 if(U.focus){
  var f=el.querySelector("#nm,#sj,#tt,#ns");
  if(f){f.focus();U.focus=0}
 }
}
function val(i){var x=el.querySelector(i);return x?x.value.trim():""}

function assign(s,dateISO,pi){
 var prev=D.asg[s.id][dateISO];
 D.asg[s.id][dateISO]=pi;
 if(cal.available()&&D.writeCal){
  if(prev!=null)cal.remove(D.writeCal,cal.fmtTitle(s.name,D.people[prev]),dateISO);
  cal.write(D.writeCal,cal.fmtTitle(s.name,D.people[pi]),dateISO);
 }
}
function unassign(s,dateISO){
 var prev=D.asg[s.id][dateISO];
 delete D.asg[s.id][dateISO];
 if(prev!=null&&cal.available()&&D.writeCal)
  cal.remove(D.writeCal,cal.fmtTitle(s.name,D.people[prev]),dateISO);
}

function act(a,v,n){
 if(U.sheet){
  if(el.querySelector("#tt"))U.tt=val("#tt");
  if(el.querySelector("#d1"))U.d1=val("#d1");
  if(el.querySelector("#d2"))U.d2=val("#d2");
 }

 if(a==="addp"||a==="addp2"){var x=val("#nm");if(x&&D.people.length<6){D.people.push(x);U.focus=1}}
 if(a==="rmp"||a==="rmp2")D.people.splice(+v,1);
 if(a==="s1"){if(!D.people.length)D.people=["Ik"];D.step=1}
 if(a==="s2"){D.nudge=val("#tm")||D.nudge;D.step=2;loadCals()}
 if(a==="wc")D.writeCal=v;
 if(a==="s3"){D.step=3;U.focus=1}
 if(a==="skip"){D.step=99;U.tab="home"}
 if(a==="pre"){var x=el.querySelector("#sj");if(x)x.value=v;return}
 if(a==="mk"){var x=val("#sj");if(!x)return;U.pend=x;U.sheet="scope";D.step=99;U.tab="plan"}
 if(a==="mk2"){var x=val("#ns");if(!x)return;U.pend=x;U.sheet="scope"}
 if(a==="sc"){
  var id=Date.now();
  D.subjects.push({id:id,name:U.pend,scope:v});
  D.asg[id]={};U.cur=id;U.sheet=null;U.brush=null;
 }
 if(a==="picks")U.sheet="picks";
 if(a==="sel"){U.cur=+v;U.sheet=null;U.brush=null}
 if(a==="rms"){
  var f=null;
  for(var i=0;i<D.subjects.length;i++)if(D.subjects[i].id===+v)f=D.subjects[i];
  U.pend="Verwijder "+(f?f.name:"");U.act=["rms",v];U.sheet="conf";
 }
 if(a==="br")U.brush=+v;
 if(a==="pv"){U.pivot=v;if(U.brush===null&&v==="person")U.brush=0}
 if(a==="mv"){
  var y=U.mo.y,m=U.mo.m+(+v);
  if(m<0){m=11;y--}if(m>11){m=0;y++}
  U.mo={y:y,m:m};
 }
 if(a==="gogap"){U.tab="plan";U.cur=+v;U.pivot="subject";U.brush=null}
 if(a==="pt"){
  var s=sub();if(!s)return;
  if(U.brush===-1)unassign(s,v);
  else if(U.brush===null){U.pd=v;U.sheet="who"}
  else{assign(s,v,U.brush);if(!U.painted){U.painted=true;n.className+=" anim"}}
 }
 if(a==="pick"){assign(sub(),U.pd,+v);U.brush=+v;U.sheet=null}

 if(a==="t"){U.tab=v;U.filt=null}
 if(a==="f")U.filt=v||null;
 if(a==="tog"){
  for(var i=0;i<D.tasks.length;i++)if(D.tasks[i].id===+v){
   D.tasks[i].done=!D.tasks[i].done;
   D.tasks[i].at=D.tasks[i].done?Date.now():null;
  }
 }
 if(a==="open"){
  for(var i=0;i<D.tasks.length;i++)if(D.tasks[i].id===+v){
   var t=D.tasks[i];
   U.sel=t.id;U.tt=t.t;U.d1=t.due||"";U.d2=t.end||"";
   U.md=t.end?"per":t.due?"day":"none";U.sheet="task";
  }
 }
 if(a==="new"){U.sheet="new";U.md="none";U.d1="";U.d2="";U.tt="";U.focus=1}
 if(a==="newl"){U.sheet="newl";U.editl=null;U.md="none";U.d1="";U.d2="";U.tt="";U.focus=1}
 if(a==="editl"){
  for(var i=0;i<D.lists.length;i++)if(D.lists[i].name===v){
   var l=D.lists[i];
   U.editl=v;U.tt=l.name;U.d1=l.d1||"";U.d2=l.d2||"";
   U.md=l.d2?"per":"day";U.sheet="newl";
  }
 }
 if(a==="md")U.md=v;
 if(a==="save"){
  if(U.tt)D.tasks.push({id:Date.now(),t:U.tt,ev:U.filt||null,
   due:U.md==="none"?null:(U.d1||TD),end:U.md==="per"?U.d2:null,done:false});
  U.sheet=null;
 }
 if(a==="savet"){
  for(var i=0;i<D.tasks.length;i++)if(D.tasks[i].id===U.sel&&U.tt){
   D.tasks[i].t=U.tt;
   D.tasks[i].due=U.md==="none"?null:(U.d1||TD);
   D.tasks[i].end=U.md==="per"?U.d2:null;
  }
  U.sheet=null;
 }
 if(a==="delt"){
  D.tasks=D.tasks.filter(function(x){return x.id!==U.sel});
  U.sheet=null;
 }
 if(a==="savel"){
  if(!U.tt)return;
  var d1=U.md==="none"?null:(U.d1||TD),d2=U.md==="per"?U.d2:null,found=null;
  for(var i=0;i<D.lists.length;i++)if(D.lists[i].name===U.editl)found=D.lists[i];
  if(found){
   for(var i=0;i<D.tasks.length;i++)if(D.tasks[i].ev===found.name)D.tasks[i].ev=U.tt;
   found.name=U.tt;found.d1=d1;found.d2=d2;
  }else D.lists.push({name:U.tt,d1:d1,d2:d2});
  U.filt=U.tt;U.tab="todo";U.editl=null;U.sheet=null;
 }
 if(a==="dell"){U.pend="Verwijder lijst "+v;U.act=["dell",v];U.sheet="conf"}
 if(a==="prep"){U.filt=v;U.tab="todo";U.sheet="new";U.md="none";U.d1="";U.d2="";U.tt="";U.focus=1}
 if(a==="dis")D.dismissed.push(v);
 if(a==="svt")D.nudge=val("#tm2")||D.nudge;
 if(a==="exp")doExport();
 if(a==="imp"){var x=el.querySelector("#fi");if(x)x.click();return}
 if(a==="wipe"){U.pend="Alle gegevens worden gewist.";U.act=["wipe"];U.sheet="conf"}
 if(a==="yes"){
  var k=U.act[0],x=U.act[1];
  if(k==="rms"){
   D.subjects=D.subjects.filter(function(s){return s.id!==+x});
   delete D.asg[+x];
   U.cur=D.subjects[0]?D.subjects[0].id:null;
  }
  if(k==="dell"){
   D.lists=D.lists.filter(function(l){return l.name!==x});
   for(var i=0;i<D.tasks.length;i++)if(D.tasks[i].ev===x)D.tasks[i].ev=null;
   U.filt=null;
  }
  if(k==="wipe"){store.wipe();D=fresh();U.tab="home";U.cur=null}
  U.sheet=null;
 }
 if(a==="close"){U.sheet=null;U.editl=null}
 save();r();
}

function doExport(){
 var b=new Blob([JSON.stringify(D,null,1)],{type:"application/json"});
 var u=URL.createObjectURL(b),a=document.createElement("a");
 a.href=u;a.download="planner-"+TD+".json";a.click();
 setTimeout(function(){URL.revokeObjectURL(u)},3000);
}
function doImport(e){
 var f=e.target.files[0];if(!f)return;
 var rd=new FileReader();
 rd.onload=function(){
  try{
   var d=JSON.parse(rd.result);
   if(!d||!d.people||!d.people.length&&d.people.length!==0)throw 0;
   D=Object.assign(fresh(),d);
   U.cur=D.subjects[0]?D.subjects[0].id:null;
   U.tab="home";save();r();
  }catch(x){alert("Dit bestand kon niet gelezen worden.")}
 };
 rd.readAsText(f);
}

function loadCals(){
 cal.list().then(function(c){U.cals=c;r()});
}
if(D.step>=2)loadCals();
r();
