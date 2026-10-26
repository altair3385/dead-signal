import assert from 'node:assert/strict';
import {createState,switchLocation,walkable,move,nearby,portal,take,complete,validState,migrateState,repairPosition,startSortie,returnToShelter,CONTAINERS,SORTIE_START} from '../dist/engine-v2.mjs';
import {GARAGES,PROPS,ROOM_FLOOR,DOORWAY,GATE,garageRoom} from '../dist/garage-scene.mjs';
import {createCombat,fire,tickCombat,lineClear} from '../dist/combat.mjs';
import {rollLocation} from '../dist/loot.mjs';
// Breadth-first route on an 8-unit grid, optionally forbidden from a region, then walked with real move() calls.
function route(s,tx,ty,avoid=null){const step=8,start=[Math.round(s.x),Math.round(s.y)],queue=[start],parent=new Map([[start.join(','),null]]);let end=null;for(let i=0;i<queue.length;i++){const [x,y]=queue[i];if(Math.hypot(x-tx,y-ty)<step){end=[x,y];break;}for(const [dx,dy] of [[step,0],[-step,0],[0,step],[0,-step]]){const nx=x+dx,ny=y+dy,key=nx+','+ny;if(!parent.has(key)&&walkable(nx,ny,false,'garages')&&!(avoid&&avoid(nx,ny))){parent.set(key,[x,y]);queue.push([nx,ny]);}}}if(!end)return null;const path=[];for(let p=end;p;p=parent.get(p.join(',')))path.unshift(p);
 for(const [x,y] of path.slice(1)){for(let n=0;n<40&&Math.hypot(s.x-x,s.y-y)>.8;n++){const d=Math.hypot(x-s.x,y-s.y);move(s,(x-s.x)/Math.max(1,d),(y-s.y)/Math.max(1,d),.016);}assert.ok(Math.hypot(s.x-x,s.y-y)<1.5,'stuck at '+[s.x,s.y].map(Math.round));}return path;}
const fresh=()=>{const s=createState();s.atShelter=true;assert.ok(startSortie(s,'garages'));return s;};
const passage=(x,y)=>x>846&&x<1076&&y>470&&y<694;
const door=GARAGES.find(b=>b.id==='28'),bench=CONTAINERS.find(c=>c.id==='garage-battery');
// 1. Direct path: gate → central passage → yard → through the open gate of № 28 to the bench.
let s=fresh();assert.equal(s.x,SORTIE_START.garages.x);assert.ok(validState(s));assert.equal(s.room,null);
let path=route(s,bench.x,bench.y);assert.ok(path,'bench unreachable');assert.ok(path.some(([x,y])=>passage(x,y)),'direct route uses the passage');assert.equal(s.room,'28','walked inside without a portal');assert.equal(s.inside,false);
assert.equal(nearby(s)?.id,'garage-battery');assert.ok(take(s,'garage-battery','battery').ok);assert.equal(take(s,'garage-battery','battery').ok,false,'battery taken once');
// The yard returns: walk out of the doorway to the gate, deliver once.
path=route(s,GATE.x,GATE.y-6);assert.ok(path);assert.equal(s.room,null);assert.equal(nearby(s)?.id,'exit');assert.ok(complete(s));assert.ok(s.garageCompleted);assert.equal(nearby(s)?.id,'extract');assert.ok(returnToShelter(s));assert.equal(s.lastRun.carried.battery,1);
// 2. Both bypasses around the passage reach № 28, so the infected there can be avoided.
for(const side of ['west','east']){const b=fresh();const avoid=(x,y)=>passage(x,y)||(side==='west'?x>1076&&y>470:x<846&&y>470);assert.ok(route(b,door.x+160,door.y+240,avoid),side+' bypass blocked');}
// 3. Every loot spot is reachable on foot and offered only in sight.
for(const c of CONTAINERS.filter(c=>c.location==='garages')){const b=fresh();assert.ok(walkable(c.x,c.y,false,'garages'),c.id+' stand point inside an object');assert.ok(route(b,c.x,c.y),'unreachable '+c.id);b.remaining[c.id]={water:1};assert.equal(nearby(b)?.id,c.id);}
const peek=fresh();Object.assign(peek,{x:1059,y:300,room:null});peek.remaining['garage-battery']={battery:1};assert.notEqual(nearby(peek)?.id,'garage-battery','bench not offered through the wall');
// 4. Walls: roofs, closed boxes, № 28 front wall beside the doorway and props are solid; shots stop at walls.
for(const b of GARAGES.filter(b=>!b.open))assert.equal(walkable(b.x+b.w/2,b.y+b.h/2,false,'garages'),false,'closed box walkable '+b.id);
assert.equal(walkable(door.x+40,door.y+222,false,'garages'),false,'front wall beside the gate');assert.equal(walkable(door.x+160,door.y+60,false,'garages'),false,'back wall/roof');assert.ok(walkable((DOORWAY[0]+DOORWAY[2])/2,DOORWAY[3]-4,false,'garages'),'doorway open');
for(const p of PROPS)assert.equal(walkable((p.solid[0]+p.solid[2])/2,(p.solid[1]+p.solid[3])/2,false,'garages'),false,'prop walkable '+p.id);
assert.equal(lineClear(door.x+60,door.y+250,door.x+60,ROOM_FLOOR[1]+20,false,'garages'),false,'shot through front wall');assert.ok(lineClear(door.x+160,door.y+250,door.x+160,ROOM_FLOOR[1]+20,false,'garages'),'shot through doorway');
assert.equal(walkable(GATE.left-30,GATE.y,false,'garages'),false,'fence');assert.ok(walkable(GATE.x,GATE.y,false,'garages'));assert.equal(garageRoom(door.x+150,ROOM_FLOOR[1]+10),'28');
// 5. Combat: an infected in the passage is hit in the open, follows the hero through the doorway.
const shot={...createState(),location:'garages',inside:false,x:960,y:760},combat=createCombat();combat.enemies=combat.enemies.filter(e=>e.id===4);combat.angle=-Math.PI/2;assert.ok(fire(shot,combat).hit);
const chase={...createState(),location:'garages',inside:false,x:1059,y:220,room:'28'},c2=createCombat();c2.enemies=c2.enemies.filter(e=>e.id===4);c2.enemies[0].awake=true;c2.enemies[0].x=1060;c2.enemies[0].y=330;for(let k=0;k<200;k++)tickCombat(chase,c2,.05);assert.ok(Math.hypot(c2.enemies[0].x-chase.x,c2.enemies[0].y-chase.y)<40,'enemy reaches the hero inside № 28');
// 6. Old saves: inside an old (now closed) garage interior → yard start, inventory kept, old portal ids do nothing.
const old=createState();Object.assign(old,{location:'garages',inside:true,room:'26',x:716,y:200,inventory:{battery:1,tape:2}});migrateState(old);assert.ok(validState(old));assert.equal(old.inside,false);assert.deepEqual(old.inventory,{battery:1,tape:2});assert.equal(portal(old,'garage-enter-26'),false);
const legacy=createState();delete legacy.location;delete legacy.garageCompleted;for(const c of CONTAINERS.filter(c=>c.location==='garages'))delete legacy.remaining[c.id];migrateState(legacy);assert.ok(validState(legacy));assert.equal(legacy.location,'clinic');
const back=createState();switchLocation(back,'garages');assert.equal(back.x,SORTIE_START.garages.x);switchLocation(back,'clinic');assert.equal(back.x,923);
for(let seed=1;seed<60;seed++){const r=createState();r.world.locations.garages.depletion=4;rollLocation(r,'garages',seed);assert.ok(Object.keys(r.remaining['garage-crates']).length,'guarded cache is never empty');}
console.log('PASS: walk-in № 28 via passage and both bypasses, one-time battery, guarded cache always stocked, delivery and return, every spot reachable and in sight, solid walls/props/fence, doorway shots and chase, old garage saves.');
