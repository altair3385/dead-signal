import {garageFloor,garageRoom,GATE} from './garage-scene.mjs?v=9';
import {ITEMS,itemDef,parseKey} from './data/items.mjs?v=9';
import {SPOTS} from './data/locations.mjs?v=9';
import {createWorld,validWorld,nextSeed,noteSortie,PLAYABLE} from './world.mjs?v=9';
import {rollLocation} from './loot.mjs?v=9';
import {newRun,noteFound,summarize} from './sortie.mjs?v=9';
import {createShelterState,validShelter,returnHeal,stashSlots} from './shelter.mjs?v=9';
export {ITEMS,itemDef};
// Loot spots double as containers; `items` is the scripted first sortie, later sorties are rolled.
export const CONTAINERS=SPOTS.map(c=>({...c,items:c.first||{}}));
export const WORLD={width:1672,height:940};
// Coordinates describe floor and object feet in the same space as clinic-v2.webp.
// The eight-point footprint keeps the player's feet out of walls, including corners.
export const NAV_OUT=[[64,0,300,940],[235,630,610,752],[540,700,1440,770],[894,667,967,723]];
export const NAV_IN=[[625,239,1015,354],[774,325,918,532],[625,381,749,532],[738,440,794,512],[909,432,970,492],[950,294,1133,532],[1130,457,1177,502],[1169,296,1406,532],[1010,232,1050,265],[1040,211,1290,265]];
// Solid art bounds: no floor is permitted anywhere on a drawn object, including its top.
export const OBSTACLES=[
 {id:'ambulance',inside:false,rect:[148,382,466,622]},
 {id:'stretcher',inside:false,rect:[403,505,504,592]},
 {id:'bench-out',inside:false,rect:[650,623,804,688]},
 {id:'bin',inside:false,rect:[989,641,1031,703]},
 {id:'pine-left',inside:false,rect:[548,573,645,716]},
 {id:'pine-right',inside:false,rect:[1221,558,1325,708]},
 {id:'waiting-seat',inside:true,rect:[670,191,807,258]},
 {id:'side-seats',inside:true,rect:[626,254,676,359]},
 {id:'coffee-table',inside:true,rect:[712,293,775,339]},
 {id:'hall-chair',inside:true,rect:[873,330,916,430]},
 {id:'reception',inside:true,rect:[699,459,841,532]},
 {id:'reception-desk',inside:true,rect:[626,405,662,482]},
 {id:'cabinet',inside:true,rect:[1028,338,1095,433]},
 {id:'fridge',inside:true,rect:[948,330,985,421]},
 {id:'medical-chair',inside:true,rect:[950,480,1009,531]},
 {id:'sink',inside:true,rect:[1104,431,1135,531]},
 {id:'stool',inside:true,rect:[1073,496,1103,531]},
 {id:'operating-table',inside:true,rect:[1237,397,1348,486]},
 {id:'instrument-table',inside:true,rect:[1175,461,1248,532]},
 {id:'surgery-sink',inside:true,rect:[1171,370,1215,427]},
 {id:'office-desk',inside:true,rect:[1134,177,1275,238]},
 {id:'office-chair',inside:true,rect:[1205,211,1245,256]}
];
const insideRect=(x,y,r)=>x>=r[0]&&x<=r[2]&&y>=r[1]&&y<=r[3];
function floorAt(x,y,inside){return (inside?NAV_IN:NAV_OUT).some(r=>insideRect(x,y,r))&&!OBSTACLES.some(o=>o.inside===inside&&insideRect(x,y,o.rect));}
export function walkable(x,y,inside,location='clinic',room=null){const radius=7;return [[0,0],[radius,0],[-radius,0],[0,radius],[0,-radius],[5,5],[-5,5],[5,-5],[-5,-5]].every(([dx,dy])=>location==='garages'?garageFloor(x+dx,y+dy):floorAt(x+dx,y+dy,inside));}
// Keep existing inventories and mission progress when tighter geometry invalidates an old position.
export function repairPosition(s){if(s.location==='garages'){s.inside=false;if(!walkable(s.x,s.y,false,'garages')){s.x=SORTIE_START.garages.x;s.y=SORTIE_START.garages.y;}s.room=garageRoom(s.x,s.y);return s;}if(walkable(s.x,s.y,s.inside,s.location,s.room))return s;let best=null,dist=Infinity;for(const r of s.inside?NAV_IN:NAV_OUT)for(let y=r[1]+8;y<r[3];y+=4)for(let x=r[0]+8;x<r[2];x+=4){const d=(s.x-x)**2+(s.y-y)**2;if(d<dist&&walkable(x,y,s.inside)){best={x,y};dist=d;}}if(best)Object.assign(s,best);return s;}
export function createState(){return {version:2,location:'clinic',room:null,garageCompleted:false,x:923,y:724,direction:'north',inside:false,health:83,water:53,food:67,inventory:{bandage:1,water:1,flashlight:1},remaining:Object.fromEntries(CONTAINERS.map(c=>[c.id,{...c.items}])),backpack:false,backpackKey:null,completed:false,visited:false,elapsed:0,stash:{},atShelter:false,sorties:0,world:createWorld(),shelter:createShelterState(),run:{location:'clinic',startedAt:0,health:83,found:{}},lastRun:null};}
const PACK_BONUS={common:-2,quality:0,rare:2,elite:4,unique:6,relic:8};
export function capacity(s){return s.backpack?30+(PACK_BONUS[parseKey(s.backpackKey||'backpack')?.tier]??0):18;}
export function weight(s){return Math.round(Object.entries(s.inventory).reduce((sum,[id,n])=>sum+(itemDef(id)?.weight||0)*n,0)*100)/100;}
export function move(s,dx,dy,dt){if(!Number.isFinite(dt)||dt<=0)return false;dt=Math.min(dt,.05);const len=Math.hypot(dx,dy);if(len<.08)return false;dx/=Math.max(1,len);dy/=Math.max(1,len);s.direction=Math.abs(dx)>Math.abs(dy)?(dx>0?'east':'west'):(dy>0?'south':'north');const before=[s.x,s.y],speed=104;const nx=s.x+dx*speed*dt,ny=s.y+dy*speed*dt;if(walkable(nx,s.y,s.inside,s.location,s.room))s.x=nx;if(walkable(s.x,ny,s.inside,s.location,s.room))s.y=ny;if(s.location==='garages')s.room=garageRoom(s.x,s.y);return Math.hypot(s.x-before[0],s.y-before[1])>.01;}
// Garages: nothing is offered through a wall; the hero must see the spot he stands next to.
function inSight(s,tx,ty){const d=Math.hypot(tx-s.x,ty-s.y),n=Math.ceil(d/4);for(let i=1;i<=n;i++)if(!walkable(s.x+(tx-s.x)*i/n,s.y+(ty-s.y)*i/n,s.inside,s.location,s.room))return false;return true;}
export function nearby(s){if(s.location==='garages'){if(!s.garageCompleted&&s.inventory.battery&&Math.hypot(s.x-GATE.x,s.y-GATE.y)<GATE.r)return {id:'exit',name:'ВЕРНУТЬСЯ С АККУМУЛЯТОРОМ',x:GATE.x,y:GATE.y};if(atShelterExit(s))return {id:'extract',name:'ВЕРНУТЬСЯ В УБЕЖИЩЕ',x:GATE.x,y:GATE.y};return CONTAINERS.filter(c=>c.location==='garages'&&(c.room||null)===(s.room||null)&&Object.keys(s.remaining[c.id]||{}).length&&Math.hypot(s.x-c.x,s.y-c.y)<55&&inSight(s,c.x,c.y)).sort((a,b)=>Math.hypot(s.x-a.x,s.y-a.y)-Math.hypot(s.x-b.x,s.y-b.y))[0]??null;}if(!s.completed&&!s.inside&&Math.hypot(s.x-854,s.y-755)<35&&s.inventory.radio)return {id:'exit',name:'ВЕРНУТЬСЯ С РАЦИЕЙ',x:854,y:755};if(atShelterExit(s))return {id:'extract',name:'ВЕРНУТЬСЯ В УБЕЖИЩЕ',x:854,y:755};const door=s.inside?{id:'leave',name:'ВЫЙТИ ВО ДВОР',x:876,y:515}:{id:'enter',name:'ВОЙТИ В ПОЛИКЛИНИКУ',x:929,y:686};if(Math.hypot(s.x-door.x,s.y-door.y)<65)return door;return CONTAINERS.filter(c=>c.location==='clinic'&&c.inside===s.inside&&Object.keys(s.remaining[c.id]).length).find(c=>Math.hypot(s.x-c.x,s.y-c.y)<66)??null;}
export function portal(s,id){if(s.location==='garages')return false;if(id==='enter'){s.inside=true;s.visited=true;s.x=868;s.y=500;s.direction='north';return true;}if(id==='leave'){s.inside=false;s.x=929;s.y=704;s.direction='south';return true;}return false;}
const kg=n=>String(Math.round(n*10)/10).replace('.',',');
const overweight=(s,id)=>'Рюкзак слишком тяжёлый: '+kg(weight(s))+' + '+kg(itemDef(id).weight)+' кг больше '+capacity(s)+' кг.';
export function take(s,containerId,item){const c=s.remaining[containerId];if(!c?.[item]||!itemDef(item))return {ok:false,reason:'Предмет уже забран.'};if(weight(s)+itemDef(item).weight>capacity(s))return {ok:false,reason:overweight(s,item)};if(!s.inventory[item]&&Object.keys(s.inventory).length>=24)return {ok:false,reason:'В рюкзаке нет места.'};s.inventory[item]=(s.inventory[item]||0)+1;if(--c[item]===0)delete c[item];noteFound(s,item);return {ok:true};}
export function use(s,item){if(!s.inventory[item])return false;const base=parseKey(item)?.id;if(base==='backpack'){if(s.backpack)return false;s.backpack=true;s.backpackKey=item;return true;}const stat={bandage:['health',15],medkit:['health',45],water:['water',30],food:['food',25]}[base];if(!stat||s[stat[0]]>=100)return false;s[stat[0]]=Math.min(100,s[stat[0]]+stat[1]);if(--s.inventory[item]===0)delete s.inventory[item];return true;}
export function complete(s){if(s.location==='garages'){if(!s.inventory.battery||Math.hypot(s.x-GATE.x,s.y-GATE.y)>60)return false;s.garageCompleted=true;return true;}if(s.inside||!s.inventory.radio||Math.hypot(s.x-854,s.y-755)>=65)return false;s.completed=true;return true;}
export function validState(s){if(!s||s.version!==2||(s.location!==undefined&&!['clinic','garages'].includes(s.location))||!['north','south','east','west'].includes(s.direction)||typeof s.inside!=='boolean'||typeof s.backpack!=='boolean'||typeof s.completed!=='boolean'||!Number.isFinite(s.x)||!Number.isFinite(s.y)||!walkable(s.x,s.y,s.inside,s.location,s.room))return false;for(const stat of ['health','water','food'])if(!Number.isFinite(s[stat])||s[stat]<0||s[stat]>100)return false;if(!Number.isFinite(s.elapsed)||s.elapsed<0||typeof s.visited!=='boolean')return false;const validItems=v=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.entries(v).every(([id,n])=>itemDef(id)&&Number.isInteger(n)&&n>0&&n<=99);if(!validItems(s.inventory)||!s.remaining)return false;if(s.stash!==undefined&&!validItems(s.stash))return false;if(s.atShelter!==undefined&&typeof s.atShelter!=='boolean')return false;if(s.sorties!==undefined&&!(Number.isInteger(s.sorties)&&s.sorties>=0))return false;if(s.world!==undefined&&!validWorld(s.world))return false;if(s.shelter!==undefined&&!validShelter(s.shelter))return false;if(s.backpackKey!=null&&!(s.backpack&&parseKey(s.backpackKey)?.id==='backpack'))return false;return CONTAINERS.every(c=>validItems(s.remaining[c.id]));}

export function migrateState(s){if(!s||s.version!==2)return s;s.location??='clinic';s.room??=null;s.garageCompleted??=false;s.stash??={};s.atShelter??=false;s.sorties??=0;s.world??=createWorld();s.shelter??=createShelterState();s.backpackKey??=s.backpack?'backpack':null;if(s.run===undefined)s.run=s.atShelter?null:newRun(s,s.location||'clinic');s.lastRun??=null;if(s.remaining)for(const c of CONTAINERS)s.remaining[c.id]??={};if(s.remaining)for(const c of CONTAINERS)if(c.location==='garages'&&!s.remaining[c.id])s.remaining[c.id]={...c.items};if(s.positions?.garages)Object.assign(s.positions.garages,{inside:false,room:null});return repairPosition(s);}
export function switchLocation(s,location){if(!['clinic','garages'].includes(location))return false;s.positions??={};s.positions[s.location||'clinic']={x:s.x,y:s.y,inside:s.inside,room:s.room};s.location=location;const target=s.positions[location]||(location==='garages'?{...SORTIE_START.garages,inside:false,room:null}:{x:923,y:724,inside:false,room:null});Object.assign(s,target);repairPosition(s);return true;}

// Shelter loop: the stash lives in the save, outside any location; loot is not restocked between sorties.
export const SHELTER_EXITS={clinic:{x:854,y:755,r:35},garages:{x:GATE.x,y:GATE.y,r:GATE.r}};
export const SORTIE_START={clinic:{x:923,y:724},garages:{x:960,y:800}};
export const SORTIE_LOCATIONS=['clinic','garages'];
export function atShelterExit(s){const e=SHELTER_EXITS[s.location||'clinic'];return !!e&&!s.inside&&Math.hypot(s.x-e.x,s.y-e.y)<e.r;}
const stashLocked=(s,id)=>s.backpack&&id===(s.backpackKey||'backpack')&&s.inventory[id]===1;
export function stashItem(s,id){if(!s.inventory[id])return {ok:false,reason:'Этого предмета нет в рюкзаке.'};if(stashLocked(s,id))return {ok:false,reason:'Полевой рюкзак надет на персонажа.'};s.stash??={};if((s.stash[id]||0)>=99||(!s.stash[id]&&Object.keys(s.stash).length>=stashSlots(s)))return {ok:false,reason:'На складе нет места. Улучши склад.'};s.stash[id]=(s.stash[id]||0)+1;if(--s.inventory[id]===0)delete s.inventory[id];return {ok:true};}
export function withdrawItem(s,id){if(!s.stash?.[id]||!itemDef(id))return {ok:false,reason:'Этого предмета нет на складе.'};if(weight(s)+itemDef(id).weight>capacity(s))return {ok:false,reason:'Рюкзак слишком тяжёлый.'};if(!s.inventory[id]&&Object.keys(s.inventory).length>=24)return {ok:false,reason:'В рюкзаке нет места.'};if((s.inventory[id]||0)>=99)return {ok:false,reason:'В рюкзаке нет места.'};s.inventory[id]=(s.inventory[id]||0)+1;if(--s.stash[id]===0)delete s.stash[id];return {ok:true};}
export function stashAll(s){let moved=0;for(const [id,n] of Object.entries({...s.inventory}))for(let k=0;k<n;k++){if(!stashItem(s,id).ok)break;moved++;}return moved;}
export function returnToShelter(s,{kills=0}={}){if(s.atShelter||!atShelterExit(s))return false;s.lastRun=summarize(s,'extracted',{kills});s.run=null;s.atShelter=true;s.sorties=(s.sorties||0)+1;s.lastRun.healed=returnHeal(s);return true;}
// Defeat on a sortie: the backpack and everything in it stay where the character fell.
export function failSortie(s,{kills=0}={}){if(s.atShelter)return false;const lost={...s.inventory};s.lastRun=summarize(s,'lost',{kills,lost});s.inventory={};s.backpack=false;s.backpackKey=null;s.health=35;s.run=null;s.atShelter=true;s.sorties=(s.sorties||0)+1;return true;}
export function startSortie(s,location){if(!s.atShelter||!SORTIE_LOCATIONS.includes(location))return false;s.world??=createWorld();noteSortie(s.world,location);rollLocation(s,location,nextSeed(s.world));switchLocation(s,location);s.run=newRun(s,location);Object.assign(s,SORTIE_START[location],{inside:false,room:null,direction:'north',atShelter:false});s.positions[location]={...SORTIE_START[location],inside:false,room:null};return true;}
