// Shelter modules: medbay heals, workshop repairs, upgrades are paid from the stash.
import {MODULES} from './data/shelter.mjs?v=8';
import {itemDef,parseKey,makeKey} from './data/items.mjs?v=8';
export {createShelterState,MODULES} from './data/shelter.mjs?v=8';
export const moduleLevel=(s,id)=>s.shelter?.modules?.[id]||1;
export const moduleEffect=(s,id)=>MODULES.find(m=>m.id===id).levels[moduleLevel(s,id)-1].effect;
export const nextLevel=(s,id)=>MODULES.find(m=>m.id===id).levels[moduleLevel(s,id)]||null;
export function validShelter(v){return !!v&&typeof v==='object'&&v.modules&&MODULES.every(m=>Number.isInteger(v.modules[m.id])&&v.modules[m.id]>=1&&v.modules[m.id]<=m.levels.length);}
const countBase=(bag,id)=>Object.entries(bag||{}).filter(([k])=>k.split('@')[0]===id).reduce((a,[,n])=>a+n,0);
function spend(bag,id,n){for(const k of Object.keys(bag).filter(k=>k.split('@')[0]===id)){while(n>0&&bag[k]>0){bag[k]--;n--;}if(!bag[k])delete bag[k];}}
export function canAfford(s,cost){return Object.entries(cost||{}).every(([id,n])=>countBase(s.stash,id)>=n);}
export function upgrade(s,id){const next=nextLevel(s,id);if(!next)return {ok:false,reason:'Модуль уже улучшен.'};if(!canAfford(s,next.cost))return {ok:false,reason:'На складе не хватает материалов.'};for(const [item,n] of Object.entries(next.cost))spend(s.stash,item,n);s.shelter.modules[id]=next.level;return {ok:true};}
export const stashSlots=s=>moduleEffect(s,'storage').slots;
// Medbay: one bandage or medkit from the stash or backpack, stronger with the upgrade.
export function treat(s){if(s.health>=100)return {ok:false,reason:'Персонаж здоров.'};for(const [id,base] of [['bandage',moduleEffect(s,'medbay').bandageHeal],['medkit',60]])for(const bag of [s.stash,s.inventory])if(countBase(bag,id)){spend(bag,id,1);s.health=Math.min(100,s.health+base);return {ok:true,item:id};}return {ok:false,reason:'Нет бинтов и аптечек.'};}
export function returnHeal(s){const h=moduleEffect(s,'medbay').returnHeal;if(h)s.health=Math.min(100,s.health+h);return h;}
// Workshop: restores condition of one item for tape (or parts), up to the module's limit.
export function repair(s,where,key){const bag=where==='stash'?s.stash:s.inventory,p=parseKey(key);if(!bag?.[key]||!p||p.condition===undefined)return {ok:false,reason:'Этот предмет нельзя чинить.'};const {repair:amount,maxCondition}=moduleEffect(s,'workshop');if(p.condition>=maxCondition)return {ok:false,reason:'Мастерская не починит лучше.'};const material=['tape','parts'].find(id=>countBase(s.stash,id)+countBase(s.inventory,id));if(!material)return {ok:false,reason:'Нужен скотч или детали.'};
 if(key===s.backpackKey&&bag===s.inventory&&bag[key]===1)return {ok:false,reason:'Сначала положи рюкзак на склад.'};
 spend(countBase(s.stash,material)?s.stash:s.inventory,material,1);const fixed=makeKey(p.id,p.tier,Math.min(maxCondition,p.condition+amount));if(!bag[key])return {ok:false,reason:'Предмет израсходован.'};bag[key]--;if(!bag[key])delete bag[key];bag[fixed]=(bag[fixed]||0)+1;return {ok:true,key:fixed,material};}
