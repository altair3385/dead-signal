import assert from 'node:assert/strict';
import {createState,move,walkable,repairPosition,portal,nearby,complete} from '../dist/engine-v2.mjs';
import {FOREGROUND,drawForeground} from '../dist/scene-depth.mjs';
// Furniture and vehicle footprints must stop the feet from every approach.
for(const [x,y,inside,dx,dy] of [[744,347,true,0,-1],[1060,450,true,0,-1],[840,324,true,-1,0],[230,647,false,0,-1]]){
 const s={...createState(),x,y,inside};assert.ok(walkable(x,y,inside));
 for(let i=0;i<90;i++)move(s,dx,dy,.05);
 assert.ok(walkable(s.x,s.y,inside));
 if(dx<0)assert.ok(s.x>775);else if(inside)assert.ok(s.y>y-25);else assert.ok(s.y>622);
}
// Existing saved loot survives relocation from a newly blocked table.
const old={...createState(),inside:true,x:744,y:326,inventory:{radio:1,water:2},completed:true};
repairPosition(old);assert.ok(walkable(old.x,old.y,true));assert.deepEqual(old.inventory,{radio:1,water:2});assert.ok(old.completed);
// A real movement path, rather than direct coordinate teleporting, reaches the open gate.
const s=createState();s.inventory.radio=1;for(let i=0;i<14;i++)move(s,-1,0,.05);for(let i=0;i<6;i++)move(s,0,1,.05);assert.equal(nearby(s)?.id,'exit');assert.ok(complete(s));
// Occlusion must change when crossing from behind an object to in front.
function layers(x,y){let count=0;const ctx=new Proxy({drawImage(){count++}},{get:(o,k)=>o[k]??(()=>{})});drawForeground(ctx,{},x,y,48);return count;}
assert.ok(layers(1058,390)>0);assert.equal(layers(1058,450),0);
assert.ok(FOREGROUND.length>15);
console.log('PASS: furniture/vehicle collisions, save relocation without item loss, gate route, foreground depth.');
// Regression for walking on cabinet/table tops: every painted solid rectangle
// must reject feet throughout its surface, not merely at its bottom edge.
const {OBSTACLES}=await import('../dist/engine-v2.mjs');
for(const o of OBSTACLES){const [left,top,right,bottom]=o.rect;for(let y=top;y<=bottom;y+=5)for(let x=left;x<=right;x+=5)assert.equal(walkable(x,y,o.inside),false,`${o.id} allows feet on its art at ${x},${y}`);}
assert.equal(walkable(1058,390,true),false,'cabinet top was walkable in 0.3');
assert.equal(walkable(743,303,true),false,'table top was walkable in 0.3');
assert.equal(walkable(250,416,false),false,'ambulance roof was walkable in 0.3');
console.log('PASS: full furniture/vehicle art is solid, including tops missed in 0.3.');
