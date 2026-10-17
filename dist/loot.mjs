// Loot generation per sortie: several potential spots, only part of them active,
// deeper spots roll better, repeated farming of one location pays less.
import {ITEMS,RARITY,makeKey} from './data/items.mjs?v=8';
import {SPOTS,TABLES} from './data/locations.mjs?v=8';
import {locationInfo} from './world.mjs?v=8';
export function rng(seed){let a=seed>>>0;return ()=>{a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return ((t^t>>>14)>>>0)/4294967296;};}
function pick(r,table){const total=table.reduce((s,[,w])=>s+w,0);let x=r()*total;for(const [id,w] of table)if((x-=w)<0)return id;return table[table.length-1][0];}
export function tierWeights(depth,risk,depletion){const luck=Math.max(0,depth*1.2+risk*.5-depletion*.9);return [120-depth*20+depletion*10,30+luck*10,6+luck*5,1.5+luck*2,.3+luck*.7,.05+luck*.2].map(w=>Math.max(.02,w));}
export function rollTier(r,depth,risk,depletion){const w=tierWeights(depth,risk,depletion);let x=r()*w.reduce((a,b)=>a+b,0);for(let i=0;i<w.length;i++)if((x-=w[i])<0)return RARITY[i].id;return 'common';}
// Condition is independent of rarity: a rare find can be badly worn.
export const rollCondition=r=>15+Math.floor(r()*81);
export function rollSpot(spot,r,risk,depletion){const out={};const count=Math.max(1,spot.depth+Math.floor(r()*2)-(depletion>=2?1:0));for(let i=0;i<count;i++){const id=pick(r,TABLES[spot.table]);const key=ITEMS[id].condition===undefined?id:makeKey(id,rollTier(r,spot.depth,risk,depletion),rollCondition(r));out[key]=(out[key]||0)+1;}return out;}
const owns=(s,id)=>[s.inventory,s.stash||{}].some(v=>Object.keys(v).some(k=>k.split('@')[0]===id));
export function rollLocation(s,location,seed){const r=rng(seed),info=locationInfo(location),depletion=s.world?.locations?.[location]?.depletion||0;const spots=SPOTS.filter(c=>c.location===location);
 const share=Math.max(.3,Math.min(.75,.75-.15*depletion)),optional=spots.filter(c=>!c.quest).map(c=>({c,k:r()})).sort((a,b)=>a.k-b.k),active=new Set(optional.slice(0,Math.max(1,Math.round(optional.length*share))).map(o=>o.c.id));
 for(const c of spots){const questOpen=c.quest&&!s[info.quest.flag]&&!owns(s,c.quest);s.remaining[c.id]={...(questOpen?{[c.quest]:1}:{}),...(active.has(c.id)||questOpen?rollSpot(c,r,info.risk,depletion):{})};}
 return s.remaining;}
