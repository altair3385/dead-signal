// One sortie from leaving the shelter to coming back (or not).
import {itemDef} from './data/items.mjs?v=8';
export function newRun(s,location){return {location,startedAt:s.elapsed||0,health:s.health,found:{}};}
export function noteFound(s,key){if(s.run)s.run.found[key]=(s.run.found[key]||0)+1;}
export function summarize(s,outcome,{kills=0,lost={}}={}){const run=s.run||newRun(s,s.location||'clinic');const carried={};for(const [k,n] of Object.entries(run.found)){const m=Math.min(n,s.inventory[k]||0);if(m)carried[k]=m;}
 return {location:run.location,outcome,carried:outcome==='extracted'?carried:{},lost,kills,damage:Math.max(0,Math.round(run.health-s.health)),seconds:Math.max(0,Math.round((s.elapsed||0)-run.startedAt)),value:Object.entries(outcome==='extracted'?carried:lost).reduce((a,[k,n])=>a+(itemDef(k)?.value||0)*n,0),seen:false};}
