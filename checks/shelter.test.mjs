import fs from 'node:fs';import vm from 'node:vm';import assert from 'node:assert/strict';import * as engine from '../dist/engine-v2.mjs';
import * as garageEngine from '../dist/garage-scene.mjs';
import * as combatEngine from '../dist/combat.mjs';
import {drawForeground} from '../dist/scene-depth.mjs';
const elements=new Map(),events={},storage=new Map();let raf;
const draw=new Proxy({},{get:(obj,k)=>obj[k]??(()=>{})});
function el(id){if(!elements.has(id))elements.set(id,{id,hidden:false,style:{},dataset:{},children:[],textContent:'',checked:false,value:'',disabled:false,open:false,className:'',setAttribute(){},append(x){this.children.push(x)},replaceChildren(){this.children=[]},addEventListener(k,f){this.events??={};this.events[k]=f},getContext:()=>draw,showModal(){this.open=true},close(){this.open=false;this.events?.close?.()},click(){this.onclick?.()},getBoundingClientRect:()=>({left:20,top:600,width:120,height:120}),setPointerCapture(){}});return elements.get(id);}
let generated=0;const context={...engine,...combatEngine,...garageEngine,drawForeground,Math,Number,JSON,Date,console,Image:class{set src(url){this.url=url;this.onload()}},localStorage:{getItem:k=>storage.get(k)||null,setItem:(k,v)=>storage.set(k,v)},window:{innerWidth:390,innerHeight:844,devicePixelRatio:1,confirm:()=>true,addEventListener:(k,f)=>events[k]=f},document:{getElementById:el,createElement:()=>el('node-'+(++generated)),querySelectorAll:()=>[],addEventListener(){}},requestAnimationFrame:f=>raf=f,location:{reload(){}}};vm.createContext(context);vm.runInContext(fs.readFileSync(new URL('../dist/game.js',import.meta.url),'utf8').replace(/^import[^\n]*\n/gm,''),context);await new Promise(r=>setTimeout(r,0));
// 0.7 shelter loop: walk to the gate, return, exchange with the stash, go out again.
const E=engine;
function walkTo(s,x,y,limit=40){for(let i=0;i<limit*60&&Math.hypot(s.x-x,s.y-y)>4;i++){const before=[s.x,s.y];E.move(s,x-s.x,y-s.y,1/60);if(Math.hypot(s.x-before[0],s.y-before[1])<.01)break;}return Math.hypot(s.x-x,s.y-y);}
let s=E.createState();
assert.equal(E.nearby(s)?.id==='extract',false,'no shelter prompt at the clinic start');
assert.ok(walkTo(s,854,752)<6,'walks from clinic start to the gate');
assert.equal(E.nearby(s).id,'extract');assert.equal(E.portal(s,'extract'),false);
s.inventory.radio=1;assert.equal(E.nearby(s).id,'exit','undelivered radio keeps the quest return first');delete s.inventory.radio;
assert.equal(E.returnToShelter(s),true);assert.equal(s.atShelter,true);assert.equal(s.sorties,1);assert.equal(E.returnToShelter(s),false,'cannot return twice');
const carried=JSON.stringify(s.inventory);assert.equal(E.stashAll(s),3);assert.deepEqual(s.inventory,{});assert.equal(JSON.stringify(s.stash),carried);
assert.equal(E.withdrawItem(s,'water').ok,true);assert.equal(s.inventory.water,1);assert.equal(s.stash.water,undefined);assert.equal(E.withdrawItem(s,'water').ok,false);
s.stash.battery=1;s.inventory.battery=1;assert.equal(E.withdrawItem(s,'battery').reason,'Рюкзак слишком тяжёлый.');assert.equal(s.stash.battery,1);delete s.inventory.battery;
s.inventory.backpack=1;s.backpack=true;assert.equal(E.stashItem(s,'backpack').ok,false,'equipped backpack stays on');assert.equal(E.stashAll(s),1);assert.deepEqual(s.inventory,{backpack:1});
assert.ok(E.validState(JSON.parse(JSON.stringify(s))));
// Second sortie into the garages: start away from the gate, walk back, nothing restocks or duplicates.
const remaining=JSON.stringify(s.remaining),stashBefore=JSON.stringify(s.stash);
assert.equal(E.startSortie(s,'nowhere'),false);assert.equal(E.startSortie(s,'garages'),true);assert.equal(s.atShelter,false);assert.equal(s.location,'garages');
assert.ok(E.walkable(s.x,s.y,false,'garages',null));assert.notEqual(E.nearby(s)?.id,'extract','spawn is not on the gate');assert.equal(E.startSortie(s,'clinic'),false,'one sortie at a time');
assert.ok(walkTo(s,840,846)<6,'walks from garage start to the south gate');assert.equal(E.nearby(s).id,'extract');assert.equal(E.returnToShelter(s),true);assert.equal(s.sorties,2);
assert.equal(JSON.stringify(s.remaining),remaining);assert.equal(JSON.stringify(s.stash),stashBefore);
E.startSortie(s,'clinic');assert.equal(s.location,'clinic');assert.equal(s.x,923);assert.equal(s.inside,false);
// Pre-0.7 saves gain an empty stash and stay valid.
const old=E.createState();delete old.stash;delete old.atShelter;delete old.sorties;const migrated=E.migrateState(JSON.parse(JSON.stringify(old)));assert.deepEqual(migrated.stash,{});assert.equal(migrated.atShelter,false);assert.ok(E.validState(migrated));
const bad=E.createState();bad.stash={battery:0};assert.equal(E.validState(bad),false);bad.stash={nothing:1};assert.equal(E.validState(bad),false);
console.log('PASS: walk to clinic and garage gates, return to shelter, stash/withdraw with weight limit, equipped backpack, no restock or duplication, second sortie, old-save migration.');
// UI: gate → shelter screen → stash → reload save → sortie.
el('new-game').click();vm.runInContext('state.x=854;state.y=752;updateHUD()',context);assert.equal(el('action-label').textContent,'В УБЕЖИЩЕ');el('action-button').click();
assert.equal(el('shelter').hidden,false);assert.equal(el('play').hidden,true);assert.equal(el('stash-all').disabled,false);el('stash-all').click();
const saved=JSON.parse(storage.get('dead-signal-v2'));assert.equal(saved.atShelter,true);assert.deepEqual(saved.inventory,{});assert.equal(saved.stash.water,1);assert.ok(engine.validState(saved));
assert.equal(el('shelter-move').textContent,'В РЮКЗАК');el('shelter-move').click();assert.equal(vm.runInContext('Object.values(state.inventory).reduce((a,b)=>a+b,0)',context),1);
el('shelter-menu').click();assert.equal(el('menu').hidden,false);assert.match(el('continue-info').textContent,/УБЕЖИЩЕ/);el('continue').click();assert.equal(el('shelter').hidden,false);
el('sortie-garages').click();assert.equal(el('play').hidden,false);assert.equal(vm.runInContext('state.location',context),'garages');assert.equal(vm.runInContext('combat.enemies.every(e=>e.hp===90)',context),true);for(let i=0;i<10;i++)raf(i*16.7);
console.log('PASS: shelter screen from the gate, stash all, save, withdraw, menu continue, sortie to garages. DOM/Canvas emulated; not visual browser QA.');
