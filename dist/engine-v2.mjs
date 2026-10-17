import {GARAGES,garageFloor,garageTarget,garagePortal} from './garage-scene.mjs?v=7';
export const WORLD={width:1672,height:940};
export const ITEMS={
 backpack:{name:'ПОЛЕВОЙ РЮКЗАК',desc:'Прочный армейский рюкзак. Увеличивает переносимый вес до 30 кг.',weight:1.3,condition:82,type:'equip',rarity:'НАДЁЖНЫЙ'},
 bandage:{name:'БИНТ',desc:'Чистый перевязочный материал. Восстанавливает 15 здоровья.',weight:.1,type:'consume',rarity:'ОБЫЧНЫЙ'},
 water:{name:'ПИТЬЕВАЯ ВОДА',desc:'Запечатанная бутылка. Восстанавливает 30 жажды.',weight:.5,type:'consume',rarity:'ОБЫЧНЫЙ'},
 food:{name:'ТУШЁНКА',desc:'Консервы ещё пригодны в пищу. Восстанавливают 25 сытости.',weight:.35,type:'consume',rarity:'ОБЫЧНЫЙ'},
 flashlight:{name:'ФОНАРЬ',desc:'Карманный фонарь. В этом прототипе хранится как предмет.',weight:.25,condition:74,type:'supply',rarity:'ОБЫЧНЫЙ'},
 radio:{name:'ПОЛЕВАЯ РАЦИЯ',desc:'Армейская портативная рация. Сквозь помехи слышен чей-то голос. Донеси её к воротам.',weight:.8,condition:91,type:'quest',rarity:'РЕДКИЙ ПРЕДМЕТ'},
 pliers:{name:'ПАССАТИЖИ',desc:'Универсальный инструмент для будущего ремонта снаряжения.',weight:.3,condition:68,type:'supply',rarity:'ОБЫЧНЫЙ'},
 tape:{name:'АРМИРОВАННЫЙ СКОТЧ',desc:'Полезный материал. Ремонт появится на следующем этапе.',weight:.2,type:'supply',rarity:'ОБЫЧНЫЙ'},
 jacket:{name:'КУРТКА С КАПЮШОНОМ',desc:'Потёртая куртка. Уже надета на персонажа.',weight:1.4,condition:77,type:'clothes',rarity:'ОБЫЧНЫЙ'},
 vest:{name:'РАЗГРУЗКА',desc:'Подсумки для снаряжения. Уже надета на персонажа.',weight:.9,condition:80,type:'clothes',rarity:'ОБЫЧНЫЙ'},
 boots:{name:'БОТИНКИ',desc:'Высокие походные ботинки. Уже надеты на персонажа.',weight:1.2,condition:73,type:'clothes',rarity:'ОБЫЧНЫЙ'},
 battery:{name:'АККУМУЛЯТОР',desc:'Аккумулятор из гаража № 28. Донеси к воротам кооператива.',weight:12,condition:62,type:'supply',rarity:'ОБЫЧНЫЙ'}
};
export const CONTAINERS=[{id:'cabinet',name:'МЕДИЦИНСКИЙ ШКАФ',x:1065,y:435,inside:true,items:{radio:1,bandage:2,flashlight:1}},{id:'bag',name:'ЗАБЫТЫЙ РЮКЗАК',x:748,y:302,inside:true,items:{backpack:1,water:2,food:1}},{id:'toolbox',name:'ЯЩИК У СКОРОЙ',x:444,y:630,inside:false,items:{pliers:1,tape:2}},{id:'garage-battery',name:'ВЕРСТАК · ГАРАЖ № 28',location:'garages',room:'28',x:625,y:190,inside:true,items:{battery:1,pliers:1,tape:2}},{id:'garage-food',name:'ПРИПАСЫ · ГАРАЖ № 30',location:'garages',room:'30',x:960,y:190,inside:true,items:{water:2,food:2,bandage:2}},{id:'garage-crates',name:'ЯЩИКИ У ПОКРЫШЕК',location:'garages',x:505,y:510,inside:false,items:{flashlight:1,tape:2}}];
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
export function walkable(x,y,inside,location='clinic',room=null){const radius=7;return [[0,0],[radius,0],[-radius,0],[0,radius],[0,-radius],[5,5],[-5,5],[5,-5],[-5,-5]].every(([dx,dy])=>location==='garages'?garageFloor(x+dx,y+dy,inside,room):floorAt(x+dx,y+dy,inside));}
// Keep existing inventories and mission progress when tighter geometry invalidates an old position.
export function repairPosition(s){if(s.location==='garages'){if(!walkable(s.x,s.y,s.inside,s.location,s.room)){s.x=840;s.y=820;s.inside=false;s.room=null;}return s;}if(walkable(s.x,s.y,s.inside,s.location,s.room))return s;let best=null,dist=Infinity;for(const r of s.inside?NAV_IN:NAV_OUT)for(let y=r[1]+8;y<r[3];y+=4)for(let x=r[0]+8;x<r[2];x+=4){const d=(s.x-x)**2+(s.y-y)**2;if(d<dist&&walkable(x,y,s.inside)){best={x,y};dist=d;}}if(best)Object.assign(s,best);return s;}
export function createState(){return {version:2,location:'clinic',room:null,garageCompleted:false,x:923,y:724,direction:'north',inside:false,health:83,water:53,food:67,inventory:{bandage:1,water:1,flashlight:1},remaining:Object.fromEntries(CONTAINERS.map(c=>[c.id,{...c.items}])),backpack:false,completed:false,visited:false,elapsed:0,stash:{},atShelter:false,sorties:0};}
export function capacity(s){return s.backpack?30:18;}
export function weight(s){return Math.round(Object.entries(s.inventory).reduce((sum,[id,n])=>sum+(ITEMS[id]?.weight||0)*n,0)*100)/100;}
export function move(s,dx,dy,dt){if(!Number.isFinite(dt)||dt<=0)return false;dt=Math.min(dt,.05);const len=Math.hypot(dx,dy);if(len<.08)return false;dx/=Math.max(1,len);dy/=Math.max(1,len);s.direction=Math.abs(dx)>Math.abs(dy)?(dx>0?'east':'west'):(dy>0?'south':'north');const before=[s.x,s.y],speed=104;const nx=s.x+dx*speed*dt,ny=s.y+dy*speed*dt;if(walkable(nx,s.y,s.inside,s.location,s.room))s.x=nx;if(walkable(s.x,ny,s.inside,s.location,s.room))s.y=ny;return Math.hypot(s.x-before[0],s.y-before[1])>.01;}
export function nearby(s){if(s.location==='garages'){const loot=CONTAINERS.filter(c=>c.location==='garages'&&c.inside===s.inside&&(!c.room||c.room===s.room)&&Object.keys(s.remaining[c.id]||{}).length).find(c=>Math.hypot(s.x-c.x,s.y-c.y)<55);const doorway=garageTarget(s);if(!s.inside&&!(!s.garageCompleted&&s.inventory.battery)&&atShelterExit(s))return {id:'extract',name:'ВЕРНУТЬСЯ В УБЕЖИЩЕ',x:840,y:850};return s.inside&&s.y>GARAGES.find(g=>g.id===s.room).y+GARAGES.find(g=>g.id===s.room).h-40?(doorway||loot):(loot||doorway);}if(!s.completed&&!s.inside&&Math.hypot(s.x-854,s.y-755)<35&&s.inventory.radio)return {id:'exit',name:'ВЕРНУТЬСЯ С РАЦИЕЙ',x:854,y:755};if(atShelterExit(s))return {id:'extract',name:'ВЕРНУТЬСЯ В УБЕЖИЩЕ',x:854,y:755};const door=s.inside?{id:'leave',name:'ВЫЙТИ ВО ДВОР',x:876,y:515}:{id:'enter',name:'ВОЙТИ В ПОЛИКЛИНИКУ',x:929,y:686};if(Math.hypot(s.x-door.x,s.y-door.y)<65)return door;return CONTAINERS.filter(c=>!c.location&&c.inside===s.inside&&Object.keys(s.remaining[c.id]).length).find(c=>Math.hypot(s.x-c.x,s.y-c.y)<66)??null;}
export function portal(s,id){if(s.location==='garages')return garagePortal(s,id);if(id==='enter'){s.inside=true;s.visited=true;s.x=868;s.y=500;s.direction='north';return true;}if(id==='leave'){s.inside=false;s.x=929;s.y=704;s.direction='south';return true;}return false;}
export function take(s,containerId,item){const c=s.remaining[containerId];if(!c?.[item]||!ITEMS[item])return {ok:false,reason:'Предмет уже забран.'};if(weight(s)+ITEMS[item].weight>capacity(s))return {ok:false,reason:'Рюкзак слишком тяжёлый.'};if(!s.inventory[item]&&Object.keys(s.inventory).length>=24)return {ok:false,reason:'В рюкзаке нет места.'};s.inventory[item]=(s.inventory[item]||0)+1;if(--c[item]===0)delete c[item];return {ok:true};}
export function use(s,item){if(!s.inventory[item])return false;if(item==='backpack'){s.backpack=true;return true;}const stat={bandage:['health',15],water:['water',30],food:['food',25]}[item];if(!stat||s[stat[0]]>=100)return false;s[stat[0]]=Math.min(100,s[stat[0]]+stat[1]);if(--s.inventory[item]===0)delete s.inventory[item];return true;}
export function complete(s){if(s.location==='garages'){if(s.inside||!s.inventory.battery||Math.hypot(s.x-840,s.y-850)>60)return false;s.garageCompleted=true;return true;}if(s.inside||!s.inventory.radio||Math.hypot(s.x-854,s.y-755)>=65)return false;s.completed=true;return true;}
export function validState(s){if(!s||s.version!==2||(s.location!==undefined&&!['clinic','garages'].includes(s.location))||!['north','south','east','west'].includes(s.direction)||typeof s.inside!=='boolean'||typeof s.backpack!=='boolean'||typeof s.completed!=='boolean'||!Number.isFinite(s.x)||!Number.isFinite(s.y)||!walkable(s.x,s.y,s.inside,s.location,s.room))return false;for(const stat of ['health','water','food'])if(!Number.isFinite(s[stat])||s[stat]<0||s[stat]>100)return false;if(!Number.isFinite(s.elapsed)||s.elapsed<0||typeof s.visited!=='boolean')return false;const validItems=v=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.entries(v).every(([id,n])=>ITEMS[id]&&Number.isInteger(n)&&n>0&&n<=99);if(!validItems(s.inventory)||!s.remaining)return false;if(s.stash!==undefined&&!validItems(s.stash))return false;if(s.atShelter!==undefined&&typeof s.atShelter!=='boolean')return false;if(s.sorties!==undefined&&!(Number.isInteger(s.sorties)&&s.sorties>=0))return false;return CONTAINERS.every(c=>validItems(s.remaining[c.id])&&Object.entries(s.remaining[c.id]).every(([id,n])=>c.items[id]>=n));}

export function migrateState(s){if(!s||s.version!==2)return s;s.location??='clinic';s.room??=null;s.garageCompleted??=false;s.stash??={};s.atShelter??=false;s.sorties??=0;if(s.remaining)for(const c of CONTAINERS)if(c.location==='garages'&&!s.remaining[c.id])s.remaining[c.id]={...c.items};return repairPosition(s);}
export function switchLocation(s,location){if(!['clinic','garages'].includes(location))return false;s.positions??={};s.positions[s.location||'clinic']={x:s.x,y:s.y,inside:s.inside,room:s.room};s.location=location;const target=s.positions[location]||(location==='garages'?{x:840,y:820,inside:false,room:null}:{x:923,y:724,inside:false,room:null});Object.assign(s,target);repairPosition(s);return true;}

// Shelter loop: the stash lives in the save, outside any location; loot is not restocked between sorties.
export const SHELTER_EXITS={clinic:{x:854,y:755,r:35},garages:{x:840,y:850,r:48}};
export const SORTIE_START={clinic:{x:923,y:724},garages:{x:840,y:790}};
export const SORTIE_LOCATIONS=['clinic','garages'];
export function atShelterExit(s){const e=SHELTER_EXITS[s.location||'clinic'];return !!e&&!s.inside&&Math.hypot(s.x-e.x,s.y-e.y)<e.r;}
const stashLocked=(s,id)=>id==='backpack'&&s.backpack&&s.inventory.backpack===1;
export function stashItem(s,id){if(!s.inventory[id])return {ok:false,reason:'Этого предмета нет в рюкзаке.'};if(stashLocked(s,id))return {ok:false,reason:'Полевой рюкзак надет на персонажа.'};s.stash??={};if((s.stash[id]||0)>=99)return {ok:false,reason:'На складе нет места для этого предмета.'};s.stash[id]=(s.stash[id]||0)+1;if(--s.inventory[id]===0)delete s.inventory[id];return {ok:true};}
export function withdrawItem(s,id){if(!s.stash?.[id]||!ITEMS[id])return {ok:false,reason:'Этого предмета нет на складе.'};if(weight(s)+ITEMS[id].weight>capacity(s))return {ok:false,reason:'Рюкзак слишком тяжёлый.'};if(!s.inventory[id]&&Object.keys(s.inventory).length>=24)return {ok:false,reason:'В рюкзаке нет места.'};if((s.inventory[id]||0)>=99)return {ok:false,reason:'В рюкзаке нет места.'};s.inventory[id]=(s.inventory[id]||0)+1;if(--s.stash[id]===0)delete s.stash[id];return {ok:true};}
export function stashAll(s){let moved=0;for(const [id,n] of Object.entries({...s.inventory}))for(let k=0;k<n;k++){if(!stashItem(s,id).ok)break;moved++;}return moved;}
export function returnToShelter(s){if(s.atShelter||!atShelterExit(s))return false;s.atShelter=true;s.sorties=(s.sorties||0)+1;return true;}
export function startSortie(s,location){if(!s.atShelter||!SORTIE_LOCATIONS.includes(location))return false;switchLocation(s,location);Object.assign(s,SORTIE_START[location],{inside:false,room:null,direction:'north',atShelter:false});s.positions[location]={...SORTIE_START[location],inside:false,room:null};return true;}
