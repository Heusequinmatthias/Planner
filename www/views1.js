function r(){el.innerHTML=D.step<99?setup():main();bind()}

function setup(){
 if(D.step===0){
  var lst="";
  if(D.people.length){
   lst='<div class="card">';
   for(var i=0;i<D.people.length;i++)
    lst+='<div class="row"><span>'+esc(D.people[i])+'</span><button class="muted" data-a="rmp" data-v="'+i+'">verwijderen</button></div>';
   lst+='</div>';
  }
  return '<div class="wrap"><div style="height:12vh"></div>'+
   '<h1>Wie plant er mee?</h1>'+
   '<p class="sub">Iedereen aan wie je dagen kan toewijzen. Oma telt mee. Een tandarts niet.</p>'+
   lst+
   '<input type="text" id="nm" placeholder="Naam" autocomplete="off">'+
   '<button class="btn soft" data-a="addp">Toevoegen</button>'+
   '<button class="btn" data-a="s1">Verder</button></div>';
 }
 if(D.step===1)
  return '<div class="wrap"><div style="height:14vh"></div>'+
   '<h1>Wanneer mag de app iets laten weten?</h1>'+
   '<p class="sub">Een moment per dag.</p>'+
   '<input type="time" id="tm" value="'+D.nudge+'">'+
   '<button class="btn" data-a="s2">Verder</button></div>';
 if(D.step===2){
  var c="";
  for(var i=0;i<U.cals.length;i++)
   c+='<button class="row" data-a="wc" data-v="'+esc(U.cals[i].id)+'"><span>'+esc(U.cals[i].name)+
      '</span><span class="muted">'+(D.writeCal===U.cals[i].id?"schrijven":"kies")+'</span></button>';
  if(!c)c='<div class="muted">Geen agendas gevonden.</div>';
  return '<div class="wrap"><div style="height:8vh"></div>'+
   '<h1>Agenda</h1>'+
   '<p class="sub">De app zet hier zijn eigen afspraken in, zodat je partner ze ziet.</p>'+
   '<div class="card">'+c+'</div>'+
   (cal.available()?"":'<p class="muted">Browserversie - de agenda is gesimuleerd.</p>')+
   '<button class="btn" data-a="s3">Verder</button></div>';
 }
 var sug="",ex=["Kinderen ophalen","Koken","Hond uitlaten"];
 for(var i=0;i<ex.length;i++)sug+='<button class="chip" data-a="pre" data-v="'+ex[i]+'">'+ex[i]+'</button>';
 return '<div class="wrap"><div style="height:8vh"></div>'+
  '<h1>Wat wil je inplannen?</h1>'+
  '<p class="sub">Iets dat terugkomt en iemand nodig heeft.</p>'+
  '<input type="text" id="sj" placeholder="" autocomplete="off">'+
  '<div style="margin-top:12px">'+sug+'</div>'+
  '<button class="btn" data-a="mk">Verder</button>'+
  '<button class="btn ghost" data-a="skip">Overslaan</button></div>';
}

function main(){
 var b='<div class="wrap">';
 b+=U.tab==="home"?home():U.tab==="todo"?todo():U.tab==="plan"?plan():settings();
 b+='</div>';
 if(U.tab==="home"||U.tab==="todo")b+='<button class="fab" data-a="new">+</button>';
 b+='<div class="tabs">'+
  '<div class="tab '+(U.tab==="home"?"on":"")+'" data-a="t" data-v="home"><i>&#9673;</i>Vandaag</div>'+
  '<div class="tab '+(U.tab==="todo"?"on":"")+'" data-a="t" data-v="todo"><i>&#9776;</i>Lijst</div>'+
  '<div class="tab '+(U.tab==="plan"?"on":"")+'" data-a="t" data-v="plan"><i>&#9638;</i>Plannen</div>'+
  '<div class="tab '+(U.tab==="set"?"on":"")+'" data-a="t" data-v="set"><i>&#9881;</i>Meer</div></div>';
 if(U.sheet)b+=sheet();
 return b;
}

function home(){
 var open=D.tasks.filter(function(t){return !t.done});
 var dated=open.filter(function(t){return t.due&&t.due<=TD})
   .sort(function(a,b){return a.due<b.due?-1:1});
 var f=dated[0]||open.filter(function(t){return !t.due})[0]||null;
 var tom=open.filter(function(t){return t.due===plus(1)}).length;
 var b='<div style="padding:20px 0 6px"><div class="muted">Nu</div>';
 if(f) b+='<button class="focus" data-a="open" data-v="'+f.id+'">'+esc(f.t)+'</button>'+
   '<div class="muted">'+(f.due?(f.due<TD?"stond op "+fmt(f.due):"vandaag"):"geen datum")+'</div>';
 else b+='<div class="focus">Niets open</div><div class="muted">Rustige dag</div>';
 b+='</div>';

 var as=[];
 for(var i=0;i<D.subjects.length;i++){
  var s=D.subjects[i],p=(D.asg[s.id]||{})[TD];
  if(p!=null&&D.people[p])as.push(s.name+" - "+D.people[p]);
 }
 var rest=dated.slice(1,4);
 if(as.length||rest.length){
  b+='<div class="card">';
  for(var i=0;i<as.length;i++)
   b+='<div class="row"><span>'+esc(as[i])+'</span><span class="muted">vandaag</span></div>';
  for(var i=0;i<rest.length;i++)
   b+='<button class="row" data-a="open" data-v="'+rest[i].id+'"><span>'+esc(rest[i].t)+
      '</span><span class="muted">'+(rest[i].due===TD?"vandaag":fmt(rest[i].due))+'</span></button>';
  b+='</div>';
 }

 var pl=null;
 for(var i=0;i<D.lists.length;i++){
  var l=D.lists[i];
  if(!l.d1||l.d1<TD||l.d1>plus(6))continue;
  if(D.dismissed.indexOf(l.name)>=0)continue;
  var has=D.tasks.some(function(t){return t.ev===l.name&&!t.done});
  if(!has){pl=l;break}
 }
 if(pl)b+='<div class="sugg">'+esc(pl.name)+' op '+fmt(pl.d1)+' - nog geen taken.'+
  '<div style="margin-top:10px"><button class="chip" data-a="prep" data-v="'+esc(pl.name)+'">Toevoegen</button>'+
  '<button class="chip" data-a="dis" data-v="'+esc(pl.name)+'">Niet nodig</button></div></div>';

 var g=nextGap();
 if(g)b+='<button class="note" data-a="gogap" data-v="'+g.id+'">'+esc(g.name)+': '+g.n+
   ' '+(g.n===1?"dag":"dagen")+' open deze maand</button>';
 if(tom)b+='<button class="row" data-a="t" data-v="todo"><span class="muted">'+tom+
   ' morgen</span><span class="muted">&rsaquo;</span></button>';
 if(!f&&!as.length&&!D.tasks.length)
  b+='<div class="muted" style="padding:10px 0">Tik op + om je eerste taak toe te voegen.</div>';
 return b;
}

function nextGap(){
 for(var i=0;i<D.subjects.length;i++){
  var n=countGaps(D.subjects[i],today.getFullYear(),today.getMonth());
  if(n)return {id:D.subjects[i].id,name:D.subjects[i].name,n:n};
 }
 return null;
}
function countGaps(s,y,m){
 if(!s||s.scope==="none")return 0;
 var dim=new Date(y,m+1,0).getDate(),n=0;
 for(var d=1;d<=dim;d++){
  var dt=iso(new Date(y,m,d,12));
  if(dt<TD)continue;
  var wd=(new Date(y,m,d).getDay()+6)%7;
  var need=s.scope==="week"?wd<5:true;
  if(need&&(D.asg[s.id]||{})[dt]==null)n++;
 }
 return n;
}
