var P=["#5B4BC4","#0F7A5E","#B36A08","#A8385C","#1F5FA8","#8A3E12"];
var PL=["#DDD9F7","#CFEBE0","#F8E4C2","#F6D8E2","#D9E6F7","#F4DFD0"];
var DN=["M","D","W","D","V","Z","Z"];
var MN=["januari","februari","maart","april","mei","juni","juli","augustus","september","oktober","november","december"];
var KEY="planner_v1";

function native(){
 return !!(window.Capacitor&&window.Capacitor.isNativePlatform&&window.Capacitor.isNativePlatform());
}

var mem=null;
var store={
 save:function(d){
  try{localStorage.setItem(KEY,JSON.stringify(d))}catch(e){mem=JSON.stringify(d)}},
 load:function(){
  try{var v=localStorage.getItem(KEY);if(v)return JSON.parse(v)}catch(e){}
  try{return mem?JSON.parse(mem):null}catch(e){return null}},
 wipe:function(){try{localStorage.removeItem(KEY)}catch(e){}mem=null}
};

var cal={
 available:function(){return native()},
 permission:function(){return Promise.resolve(false)},
 list:function(){
  return Promise.resolve([
   {id:"demo-1",name:"Gedeeld gezin"},
   {id:"demo-2",name:"Persoonlijk"},
   {id:"demo-3",name:"Feestdagen"}])},
 read:function(a,b){return Promise.resolve([])},
 write:function(c,t,d){console.log("cal write",c,t,d);return Promise.resolve()},
 remove:function(c,t,d){console.log("cal remove",c,t,d);return Promise.resolve()},
 fmtTitle:function(s,p){return s+" - "+p},
 parseTitle:function(t){var i=t.lastIndexOf(" - ");return i<0?null:{subject:t.slice(0,i),person:t.slice(i+3)}}
};

var notify={
 permission:function(){return Promise.resolve(false)},
 daily:function(h,b){return Promise.resolve(false)},
 cancel:function(){return Promise.resolve(true)}
};

var today=new Date();today.setHours(12,0,0,0);
function iso(d){
 var x=new Date(d);
 return x.getFullYear()+"-"+String(x.getMonth()+1).padStart(2,"0")+"-"+String(x.getDate()).padStart(2,"0");
}
var TD=iso(today);
function fmt(d){var x=new Date(d+"T12:00");return x.getDate()+" "+MN[x.getMonth()]}
function plus(n){return iso(new Date(+today+n*864e5))}

function fresh(){
 return {v:1,step:0,people:[],nudge:"08:00",subjects:[],asg:{},tasks:[],lists:[],dismissed:[]};
}
var D=store.load()||fresh();
var U={tab:"home",filt:null,sheet:null,md:"none",d1:"",d2:"",tt:"",cur:null,brush:null,
 pivot:"subject",painted:false,focus:0,
 mo:{y:today.getFullYear(),m:today.getMonth()},
 sel:null,pend:"",editl:null,pd:null,cals:[],act:null};
if(D.subjects.length&&U.cur===null)U.cur=D.subjects[0].id;

var el=document.getElementById("app");
function esc(s){
 return String(s).replace(/[<>&"]/g,function(c){
  return {"<":"&lt;",">":"&gt;","&":"&amp;",'"':"&quot;"}[c]});
}
function save(){store.save(D)}
function sub(){
 var f=null;
 for(var i=0;i<D.subjects.length;i++)if(D.subjects[i].id===U.cur)f=D.subjects[i];
 return f||D.subjects[0];
}
