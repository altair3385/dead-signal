import assert from 'node:assert/strict';
import {createState,move,portal,nearby,walkable} from '../dist/engine-v2.mjs';
import {createCombat,fire,reload,tickCombat,lineClear,restoreCombat} from '../dist/combat.mjs';
const s=createState(),c=createCombat();c.enemies=[];c.angle=0;
for(let magazine=0;magazine<4;magazine++){
 for(let n=8;n>0;n--){assert.ok(fire(s,c));assert.equal(c.ammo,n-1);for(let k=0;k<6;k++)tickCombat(s,c,.05);}
 assert.equal(fire(s,c),null);assert.ok(c.reloading>0);for(let k=0;k<24;k++)tickCombat(s,c,.05);assert.equal(c.ammo,8);
}
// Actual movement through the cabinet doorway, then return by the same path.
const route=createState();portal(route,'enter');function go(x,y){for(let i=0;i<600&&Math.hypot(route.x-x,route.y-y)>1;i++)assert.ok(move(route,(x-route.x)/Math.max(1,Math.hypot(x-route.x,y-route.y)),(y-route.y)/Math.max(1,Math.hypot(x-route.x,y-route.y)),.016),'route blocked toward '+x+','+y);assert.ok(Math.hypot(route.x-x,route.y-y)<=1);}
go(868,455);go(1020,455);go(1065,455);assert.equal(nearby(route)?.id,'cabinet');go(1020,455);go(868,455);go(868,500);assert.equal(nearby(route)?.id,'leave');
const targetState={...createState(),x:1060,y:455,inside:true},shoot=createCombat();shoot.enemies=[{id:1,x:1060,y:480,inside:true,hp:90,awake:false,attack:0,hurt:0}];shoot.angle=Math.PI/2;assert.equal(fire(targetState,shoot)?.hit,true);for(let k=0;k<6;k++)tickCombat(targetState,shoot,.05);assert.equal(fire(targetState,shoot)?.kill,true);assert.equal(shoot.kills,1);
// The solid cabinet blocks both line of sight and bullets.
const wall=createCombat();wall.enemies=[{id:1,x:1058,y:310,inside:true,hp:90,awake:false,attack:0,hurt:0}];wall.angle=-Math.PI/2;assert.equal(lineClear(1058,455,1058,310,true),false);assert.equal(fire({...targetState,x:1058},wall)?.hit,false);assert.equal(wall.enemies[0].hp,90);
const melee=createCombat();melee.weapon='crowbar';melee.enemies=[{id:1,x:1060,y:480,inside:true,hp:90,awake:false,attack:0,hurt:0}];melee.angle=Math.PI/2;const ammo=melee.ammo;assert.ok(fire(targetState,melee)?.hit);assert.equal(melee.ammo,ammo);
const bite=createCombat();bite.enemies=[{id:1,x:s.x+10,y:s.y,inside:false,hp:90,awake:true,attack:0,hurt:0}];s.health=9;tickCombat(s,bite,.05);assert.equal(s.health,0);assert.equal(fire(s,bite),null);
const fresh=createCombat();for(const e of fresh.enemies)assert.ok(walkable(e.x,e.y,e.inside),'invalid enemy spawn');const restored=restoreCombat({ammo:0,enemies:fresh.enemies.map(e=>({...e,hp:0}))});assert.equal(restored.kills,3);assert.equal(restored.ammo,0);
console.log('PASS: 32 shots / four reloads with unlimited reserve, exact cabinet doorway round trip, damage, kill, wall blocking, crowbar, downed state, spawn validity, persistence.');
const hunted={...createState(),inside:true,x:1065,y:455},hunter=createCombat();hunter.enemies=[{id:1,x:830,y:289,inside:true,hp:90,awake:true,attack:0,hurt:0}];for(let n=0;n<900&&hunted.health>0;n++){tickCombat(hunted,hunter,.05);assert.ok(walkable(hunter.enemies[0].x,hunter.enemies[0].y,true),'enemy entered furniture or wall');}assert.ok(hunted.health<83,'infected failed to find the cabinet doorway');console.log('PASS: infected navigates from waiting room through cabinet doorway and attacks without crossing obstacles.');
