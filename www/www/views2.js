function todo(){
 var names=[];
 for(var i=0;i<D.lists.length;i++)
  if(names.indexOf(D.lists[i].name)<0)names.push(D.lists[i].name);
 for(var i=0;i<D.tasks.length;i++)
  if(D.tasks[i].ev&&names.indexOf(D.tasks[i].ev)<0)names.push(D.tasks[i].ev);

 var b='<div style="padding:16px 0 4px"><h1 style="font-size:22px">Lijst</h1></div>'+
  '<div style="margin-bottom:6px"><button class="chip '+(!U.filt?"on":"")+'" style="'+
  (!U.filt?"background:#16181D;color:#fff":"")+'" data-a="f" data-v="">Alles</button>';
 for(var i=0;i<names.length;i++)
  b+='<button class="chip '+(U.filt===names[i]?"on":"")+'" style="'+
   (U.filt===names[i]?"background:#16181D;color:#fff":"")+'" data-a="f" data-v="'+
   esc(names[i])+'">'+esc(names[i])+'</button>';
 b+='<button class="chip" data-a="newl" style="border-style:dashed;color:#62646B">+ Lijst</button></div>';

 var cl=null;
 for(var i=0;i<D.lists.length;i++)if(D.lists[i].name===U.filt)cl=D.lists[i];
 if(cl){
  if(cl.d1)b+='<button class="note" data-a="editl" data-v="'+esc(cl.name)+'">'+
   (cl.d2?fmt(cl.d1)+" tot "+fmt(cl.d2):fmt(cl.d1))+' - wijzigen</button>';
  else b+='<button class="sugg" data-a="editl" data-v="'+esc(cl.name)+
   '">Nog geen dag gekozen - inplannen?</button>';
 }

 var l=D.tasks.filter(function(t){return !U.filt||t.ev===U.filt});
 b+='<div class="card">';
 if(!l.length)b+='<div class="muted" style="padding:6px 0">Nog niets hier. Tik op + om iets toe te voegen.</div>';
 for(var i=0;i<l.length;i++)if(!l[i].done)b+=tk(l[i]);
 for(var i=0;i<l.length;i++)if(l[i].done)b+=tk(l[i]);
 b+='</div>';
 if(cl)b+='<button class="btn ghost" data-a="dell" data-v="'+esc(cl.name)+'">Lijst verwijderen</button>';
 return b;
}

function tk(t){
 var meta="";
 if(!t.done){
  var bits=[];
  if(t.due)bits.push(t.due===TD?"vandaag":fmt(t.due));
  if(!U.filt&&t.ev)bits.push(esc(t.ev));
  if(bits.length)meta='<div class="muted" style="font-size:13px">'+bits.join(" - ")+'</div>';
 }
 return '<div class="tk"><button class="box '+(t.done?"on":"")+'" data-a="tog" data-v="'+t.id+
  '" aria-label="klaar"></button><button data-a="open" data-v="'+t.id+'" style="flex:1">'+
  '<div class="'+(t.done?"done":"")+'">'+esc(t.t)+'</div>'+meta+'</button></div>';
}

function plan(){
 if(!D.subjects.length)
  return '<div style="padding:20px 0"><h1 style="font-size:22px">Plannen</h1>'+
   '<p class="sub">Nog niets om te plannen. Maak iets dat terugkomt en iemand nodig heeft.</p>'+
   '<button class="btn" data-a="picks">Iets toevoegen</button></div>';
 var s=sub();
 var b='<div style="padding:16px 0 10px"><div class="seg">'+
  '<button data-a="pv" data-v="subject" class="'+(U.pivot==="subject"?"on":"")+'">Per taak</button>'+
  '<button data-a="pv" data-v="person" class="'+(U.pivot==="person"?"on":"")+'">Per persoon</button>'+
  '</div></div>';

 var chips="";
 for(var i=0;i<D.people.length;i++)
  chips+='<button class="chip '+(U.brush===i?"on":"")+'" style="'+
   (U.brush===i?"background:"+P[i%6]+";color:#fff;":"")+'" data-a="br" data-v="'+i+'">'+
   esc(D.people[i])+'</button>';

 if(U.pivot==="subject"){
  b+='<button class="card" style="display:flex;justify-content:space-between;align-items:center;width:100%;padding:14px 16px" data-a="picks">'+
   '<span style="font-weight:600">'+esc(s.name)+'</span><span class="muted">'+
   (s.scope==="week"?"weekdagen":s.scope==="all"?"elke dag":"vrij")+'</span></button>';
  b+='<div>'+chips+'<button class="chip '+(U.brush===-1?"on":"")+'" style="'+
   (U.brush===-1?"background:#16181D;color:#fff":"")+'" data-a="br" data-v="-1">Wissen</button></div>';
  var h=U.brush===null?"Kies iemand, of tik meteen een dag":
        U.brush===-1?"Tik dagen om te wissen":"Tik dagen voor "+esc(D.people[U.brush]);
  b+='<div class="hint">'+h+'</div>';
 }else{
  b+='<div>'+chips+'</div><div class="hint">Alles van '+
   esc(D.people[U.brush]||"")+' - alleen bekijken</div>';
 }
 return b+calGrid(s);
}

function calGrid(s){
 var y=U.mo.y,m=U.mo.m;
 var lead=(new Date(y,m,1).getDay()+6)%7,dim=new Date(y,m+1,0).getDate();
 var b='<div class="card"><div style="display:flex;justify-content:space-between;align-items:center;margin-bottom:12px">'+
  '<button data-a="mv" data-v="-1" style="padding:6px 14px">&lsaquo;</button>'+
  '<span style="font-weight:600">'+MN[m]+' '+y+'</span>'+
  '<button data-a="mv" data-v="1" style="padding:6px 14px">&rsaquo;</button></div><div class="grid7">';
 for(var i=0;i<7;i++)b+='<div class="dh">'+DN[i]+'</div>';
 for(var i=0;i<lead;i++)b+='<div class="day pad"></div>';

 for(var d=1;d<=dim;d++){
  var dt=iso(new Date(y,m,d,12));
  var wd=(new Date(y,m,d).getDay()+6)%7;

  if(U.pivot==="person"){
   var b2=U.brush===null?0:U.brush;
   var mine=D.subjects.filter(function(x){return (D.asg[x.id]||{})[dt]===b2});
   var st=mine.length?"background:"+PL[b2%6]+";color:"+P[b2%6]+";font-weight:600":"";
   b+='<div class="day '+(dt===TD?"tdy":"")+'" style="'+st+'">'+d+
    (mine.length?'<div style="font-size:9px;line-height:1.1">'+esc(mine[0].name.slice(0,7))+
     (mine.length>1?"+":"")+'</div>':"")+'</div>';
   continue;
  }

  var p=(D.asg[s.id]||{})[dt];
  var need=s.scope==="week"?wd<5:s.scope==="all";
  var other=D.subjects.some(function(x){return x.id!==s.id&&(D.asg[x.id]||{})[dt]!=null})||
            D.lists.some(function(l){return l.d1===dt});
  var clash=p!=null&&D.subjects.some(function(x){return x.id!==s.id&&(D.asg[x.id]||{})[dt]===p});
  var gap=p==null&&need&&dt>=TD;
  var st=p!=null?"background:"+PL[p%6]+";color:"+P[p%6]+";font-weight:600":"";
  b+='<button class="day '+(gap?"gap":"")+' '+(clash?"clash":"")+' '+(dt===TD?"tdy":"")+
   '" style="'+st+'" data-a="pt" data-v="'+dt+'">'+d+
   (other?'<div class="dot"></div>':"")+'</button>';
 }
 b+='</div>';
 if(U.pivot==="subject"){
  var n=countGaps(s,y,m);
  b+='<div style="margin-top:14px;display:flex;justify-content:space-between;font-size:14px">'+
   '<span style="color:'+(n?"#A33A28":"#7A7B80")+'">'+(n?n+" open":"alles ingevuld")+'</span>'+
   '<span class="muted">stip = iets anders</span></div>';
 }
 return b+'</div>';
}

function settings(){
 var b='<div style="padding:16px 0"><h1 style="font-size:22px">Meer</h1></div>'+
  '<div class="card"><h2>Wie plant er mee</h2>';
 if(!D.people.length)b+='<div class="muted">Niemand</div>';
 for(var i=0;i<D.people.length;i++)
  b+='<div class="row"><span><span style="display:inline-block;width:11px;height:11px;border-radius:50%;background:'+
   P[i%6]+';margin-right:9px"></span>'+esc(D.people[i])+'</span>'+
   '<button class="muted" data-a="rmp2" data-v="'+i+'">verwijderen</button></div>';
 b+='<div style="height:12px"></div><input type="text" id="nm" placeholder="Naam toevoegen" autocomplete="off">'+
  '<button class="btn soft" data-a="addp2">Toevoegen</button></div>';

 b+='<div class="card"><h2>Wat gepland wordt</h2>';
 if(!D.subjects.length)b+='<div class="muted">Nog niets</div>';
 for(var i=0;i<D.subjects.length;i++){
  var s=D.subjects[i];
  b+='<div class="row"><span>'+esc(s.name)+'</span><span><span class="muted">'+
   (s.scope==="week"?"weekdagen":s.scope==="all"?"elke dag":"vrij")+'</span>'+
   '<button class="muted" data-a="rms" data-v="'+s.id+'" style="margin-left:12px">verwijderen</button></span></div>';
 }
 b+='</div>';

 b+='<div class="card"><h2>Melding</h2><input type="time" id="tm2" value="'+D.nudge+'">'+
  '<button class="btn soft" data-a="svt">Bewaren</button>'+
  '<p class="muted" style="margin-top:10px">Meldingen werken nog niet.</p></div>';

 b+='<div class="card"><h2>Gegevens</h2>'+
  '<button class="btn soft" data-a="exp">Exporteren</button>'+
  '<button class="btn soft" data-a="imp">Importeren</button>'+
  '<input type="file" id="fi" accept=".json" style="display:none">'+
  '<p class="muted" style="margin-top:10px">Zo deel of back-up je alles.</p></div>';

 return b+'<button class="btn ghost" data-a="wipe">Alles wissen</button>';
 }
