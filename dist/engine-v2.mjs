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
 battery:{name:'АККУМУЛЯТОР',desc:'Тяжёлый источник питания. Пока не нужен для этой вылазки.',weight:12,condition:62,type:'supply',rarity:'ОБЫЧНЫЙ'}
};
export const CONTAINERS=[{id:'cabinet',name:'МЕДИЦИНСКИЙ ШКАФ',x:1065,y:435,inside:true,items:{radio:1,bandage:2,flashlight:1}},{id:'bag',name:'ЗАБЫТЫЙ РЮКЗАК',x:748,y:302,inside:true,items:{backpack:1,water:2,food:1}},{id:'toolbox',name:'ЯЩИК У СКОРОЙ',x:444,y:630,inside:false,items:{pliers:1,tape:2}}];
// Coordinates describe floor and object feet in the same space as clinic-v2.webp.
// The eight-point footprint keeps the player's feet out of walls, including corners.
export const NAV_OUT=[[64,0,300,940],[235,630,610,752],[540,700,1440,770],[894,667,967,723]];
export const NAV_IN=[[625,239,1015,354],[774,325,918,532],[625,381,749,532],[738,440,794,512],[909,440,959,490],[950,294,1133,532],[1130,457,1177,502],[1169,296,1406,532],[1010,232,1050,265],[1040,211,1290,265]];
// Furniture silhouettes are rendered separately; only their footprint blocks movement.
export const OBSTACLES=[
 {id:'ambulance',inside:false,rect:[148,442,463,622]},
 {id:'stretcher',inside:false,rect:[403,540,504,590]},
 {id:'bench-out',inside:false,rect:[650,651,801,688]},
 {id:'bin',inside:false,rect:[989,671,1030,701]},
 {id:'pine-left',inside:false,rect:[574,681,624,716]},
 {id:'pine-right',inside:false,rect:[1250,677,1290,707]},
 {id:'waiting-seat',inside:true,rect:[670,229,806,257]},
 {id:'side-seats',inside:true,rect:[626,280,675,356]},
 {id:'coffee-table',inside:true,rect:[712,316,775,337]},
 {id:'hall-chair',inside:true,rect:[873,381,913,429]},
 {id:'reception',inside:true,rect:[699,483,841,532]},
 {id:'reception-desk',inside:true,rect:[627,438,660,482]},
 {id:'cabinet',inside:true,rect:[1028,405,1094,432]},
 {id:'fridge',inside:true,rect:[950,389,983,419]},
 {id:'medical-chair',inside:true,rect:[951,497,1008,531]},
 {id:'sink',inside:true,rect:[1105,499,1134,531]},
 {id:'stool',inside:true,rect:[1073,512,1102,531]},
 {id:'operating-table',inside:true,rect:[1241,432,1345,486]},
 {id:'instrument-table',inside:true,rect:[1175,498,1245,532]},
 {id:'surgery-sink',inside:true,rect:[1171,391,1214,426]},
 {id:'office-desk',inside:true,rect:[1136,212,1273,238]},
 {id:'office-chair',inside:true,rect:[1206,239,1244,256]}
];
const insideRect=(x,y,r)=>x>=r[0]&&x<=r[2]&&y>=r[1]&&y<=r[3];
function floorAt(x,y,inside){return (inside?NAV_IN:NAV_OUT).some(r=>insideRect(x,y,r))&&!OBSTACLES.some(o=>o.inside===inside&&insideRect(x,y,o.rect));}
export function walkable(x,y,inside){const radius=7;return [[0,0],[radius,0],[-radius,0],[0,radius],[0,-radius],[5,5],[-5,5],[5,-5],[-5,-5]].every(([dx,dy])=>floorAt(x+dx,y+dy,inside));}
// Keep existing inventories and mission progress when tighter geometry invalidates an old position.
export function repairPosition(s){if(walkable(s.x,s.y,s.inside))return s;let best=null,dist=Infinity;for(const r of s.inside?NAV_IN:NAV_OUT)for(let y=r[1]+8;y<r[3];y+=4)for(let x=r[0]+8;x<r[2];x+=4){const d=(s.x-x)**2+(s.y-y)**2;if(d<dist&&walkable(x,y,s.inside)){best={x,y};dist=d;}}if(best)Object.assign(s,best);return s;}
export function createState(){return {version:2,x:923,y:724,direction:'north',inside:false,health:83,water:53,food:67,inventory:{bandage:1,water:1,flashlight:1},remaining:Object.fromEntries(CONTAINERS.map(c=>[c.id,{...c.items}])),backpack:false,completed:false,visited:false,elapsed:0};}
export function capacity(s){return s.backpack?30:18;}
export function weight(s){return Math.round(Object.entries(s.inventory).reduce((sum,[id,n])=>sum+(ITEMS[id]?.weight||0)*n,0)*100)/100;}
export function move(s,dx,dy,dt){if(!Number.isFinite(dt)||dt<=0)return false;dt=Math.min(dt,.05);const len=Math.hypot(dx,dy);if(len<.08)return false;dx/=Math.max(1,len);dy/=Math.max(1,len);s.direction=Math.abs(dx)>Math.abs(dy)?(dx>0?'east':'west'):(dy>0?'south':'north');const before=[s.x,s.y],speed=104;const nx=s.x+dx*speed*dt,ny=s.y+dy*speed*dt;if(walkable(nx,s.y,s.inside))s.x=nx;if(walkable(s.x,ny,s.inside))s.y=ny;return Math.hypot(s.x-before[0],s.y-before[1])>.01;}
export function nearby(s){if(!s.completed&&!s.inside&&Math.hypot(s.x-854,s.y-755)<35&&s.inventory.radio)return {id:'exit',name:'ВЕРНУТЬСЯ С РАЦИЕЙ',x:854,y:755};const door=s.inside?{id:'leave',name:'ВЫЙТИ ВО ДВОР',x:876,y:515}:{id:'enter',name:'ВОЙТИ В ПОЛИКЛИНИКУ',x:929,y:686};if(Math.hypot(s.x-door.x,s.y-door.y)<65)return door;return CONTAINERS.filter(c=>c.inside===s.inside&&Object.keys(s.remaining[c.id]).length).find(c=>Math.hypot(s.x-c.x,s.y-c.y)<66)??null;}
export function portal(s,id){if(id==='enter'){s.inside=true;s.visited=true;s.x=868;s.y=500;s.direction='north';return true;}if(id==='leave'){s.inside=false;s.x=929;s.y=704;s.direction='south';return true;}return false;}
export function take(s,containerId,item){const c=s.remaining[containerId];if(!c?.[item]||!ITEMS[item])return {ok:false,reason:'Предмет уже забран.'};if(weight(s)+ITEMS[item].weight>capacity(s))return {ok:false,reason:'Рюкзак слишком тяжёлый.'};if(!s.inventory[item]&&Object.keys(s.inventory).length>=24)return {ok:false,reason:'В рюкзаке нет места.'};s.inventory[item]=(s.inventory[item]||0)+1;if(--c[item]===0)delete c[item];return {ok:true};}
export function use(s,item){if(!s.inventory[item])return false;if(item==='backpack'){s.backpack=true;return true;}const stat={bandage:['health',15],water:['water',30],food:['food',25]}[item];if(!stat||s[stat[0]]>=100)return false;s[stat[0]]=Math.min(100,s[stat[0]]+stat[1]);if(--s.inventory[item]===0)delete s.inventory[item];return true;}
export function complete(s){if(s.inside||!s.inventory.radio||Math.hypot(s.x-854,s.y-755)>=65)return false;s.completed=true;return true;}
export function validState(s){if(!s||s.version!==2||!['north','south','east','west'].includes(s.direction)||typeof s.inside!=='boolean'||typeof s.backpack!=='boolean'||typeof s.completed!=='boolean'||!Number.isFinite(s.x)||!Number.isFinite(s.y)||!walkable(s.x,s.y,s.inside))return false;for(const stat of ['health','water','food'])if(!Number.isFinite(s[stat])||s[stat]<0||s[stat]>100)return false;if(!Number.isFinite(s.elapsed)||s.elapsed<0||typeof s.visited!=='boolean')return false;const validItems=v=>v&&typeof v==='object'&&!Array.isArray(v)&&Object.entries(v).every(([id,n])=>ITEMS[id]&&Number.isInteger(n)&&n>0&&n<=99);if(!validItems(s.inventory)||!s.remaining)return false;return CONTAINERS.every(c=>validItems(s.remaining[c.id])&&Object.entries(s.remaining[c.id]).every(([id,n])=>c.items[id]>=n));}
