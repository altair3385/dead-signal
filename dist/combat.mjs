import {walkable,move,WORLD} from './engine-v2.mjs?v=6';
export const MAGAZINE=8;
export function createCombat(){return {ammo:8,reloading:0,cooldown:0,angle:-Math.PI/2,weapon:'pm',tracers:[],flash:0,hit:0,kills:0,clock:0,noise:0,enemies:[{id:1,location:'clinic',x:1120,y:738,inside:false,hp:90,awake:false,attack:0,hurt:0},{id:2,location:'clinic',x:690,y:736,inside:false,hp:90,awake:false,attack:0,hurt:0},{id:3,location:'clinic',x:830,y:289,inside:true,hp:90,awake:false,attack:0,hurt:0},{id:4,location:'garages',x:1060,y:440,inside:false,hp:90,awake:false,attack:0,hurt:0},{id:5,location:'garages',x:700,y:420,inside:false,hp:90,awake:false,attack:0,hurt:0},{id:6,location:'garages',x:330,y:430,inside:false,hp:90,awake:false,attack:0,hurt:0}]};}
export function reload(c){if(c.weapon!=='pm'||c.reloading>0||c.ammo===MAGAZINE)return false;c.reloading=1.15;return true;}
export function lineClear(x,y,tx,ty,inside,location='clinic',room=null){const distance=Math.hypot(tx-x,ty-y),n=Math.ceil(distance/3);for(let i=1;i<=n;i++)if(!walkable(x+(tx-x)*i/n,y+(ty-y)*i/n,inside,location,room))return false;return true;}
const angleDiff=(a,b)=>Math.atan2(Math.sin(a-b),Math.cos(a-b));
export function aimAngle(s,c,x,y){let angle=Math.atan2(y,x),best=.16;
 for(const e of c.enemies){if(e.hp<=0||e.inside!==s.inside||(e.location||'clinic')!==(s.location||'clinic'))continue;const dx=e.x-s.x,dy=e.y-s.y;if(Math.hypot(dx,dy)>320||!lineClear(s.x,s.y,e.x,e.y,s.inside,s.location,s.room))continue;const diff=Math.abs(angleDiff(Math.atan2(dy,dx),angle));if(diff<best){best=diff;angle=Math.atan2(dy,dx);}}
 c.angle=angle;s.direction=Math.abs(Math.cos(angle))>Math.abs(Math.sin(angle))?(Math.cos(angle)>0?'east':'west'):(Math.sin(angle)>0?'south':'north');return angle;
}
export function fire(s,c){if(s.health<=0||c.cooldown>0||c.reloading>0)return null;
 const melee=c.weapon==='crowbar';if(!melee&&c.ammo<=0){reload(c);return null;}
 if(!melee)c.ammo--;c.cooldown=melee?.52:.26;c.flash=melee?.16:.07;c.noise=melee?0:2.5;
 const range=melee?50:350,dx=Math.cos(c.angle),dy=Math.sin(c.angle);let distance=range;
 for(let d=3;d<=range;d+=3)if(!walkable(s.x+dx*d,s.y+dy*d,s.inside,s.location,s.room)){distance=d;break;}
 let target=null,best=distance;for(const e of c.enemies){if(e.hp<=0||e.inside!==s.inside||(e.location||'clinic')!==(s.location||'clinic'))continue;const ex=e.x-s.x,ey=e.y-s.y,along=ex*dx+ey*dy,across=Math.abs(ex*dy-ey*dx);if(along>0&&along<best&&across<(melee?28:14)){target=e;best=along;}}
 if(target){target.hp=Math.max(0,target.hp-(melee?45:50));target.hurt=.18;target.awake=true;c.hit=.2;if(!target.hp)c.kills++;}
 if(!melee){c.tracers.push({x:s.x,y:s.y,tx:s.x+dx*best,ty:s.y+dy*best,life:.09});for(const e of c.enemies)if(e.inside===s.inside&&(e.location||'clinic')===(s.location||'clinic')&&Math.hypot(e.x-s.x,e.y-s.y)<550)e.awake=true;}
 return {melee,hit:!!target,kill:target?.hp===0};
}
// Cached floor graph; a shared distance field lets enemies find doors rather than walk into walls.
const STEP=8,COLS=Math.ceil(WORLD.width/STEP),ROWS=Math.ceil(WORLD.height/STEP),graphs=new Map();
function graph(inside,location,room){const key=(location||'clinic')+':'+inside+':'+room;if(graphs.has(key))return graphs.get(key);const mask=new Uint8Array(COLS*ROWS);for(let y=0;y<ROWS;y++)for(let x=0;x<COLS;x++)mask[y*COLS+x]=walkable(x*STEP,y*STEP,inside,location,room)?1:0;graphs.set(key,mask);return mask;}
let field=null,fieldInside=null,fieldAt=-10,fieldPlayer=-1,fieldCombat=null;
function distanceField(s,c){const px=Math.round(s.x/STEP),py=Math.round(s.y/STEP),key=py*COLS+px;if(field&&fieldCombat===c&&fieldInside===(s.location||'clinic')+':'+s.inside+':'+s.room&&c.clock-fieldAt>=0&&c.clock-fieldAt<.45)return field;const mask=graph(s.inside,s.location,s.room);let root=key;if(!mask[root]){let best=Infinity;for(let y=py-3;y<=py+3;y++)for(let x=px-3;x<=px+3;x++){const idx=y*COLS+x,d=(x-px)**2+(y-py)**2;if(x>=0&&x<COLS&&y>=0&&y<ROWS&&mask[idx]&&d<best){root=idx;best=d;}}}
 const dist=new Int32Array(mask.length).fill(-1),queue=new Int32Array(mask.length);let head=0,tail=1;queue[0]=root;dist[root]=0;while(head<tail){const idx=queue[head++],x=idx%COLS,y=Math.floor(idx/COLS);for(const n of [x>0?idx-1:-1,x+1<COLS?idx+1:-1,y>0?idx-COLS:-1,y+1<ROWS?idx+COLS:-1])if(n>=0&&mask[n]&&dist[n]<0){dist[n]=dist[idx]+1;queue[tail++]=n;}}
 field=dist;fieldCombat=c;fieldInside=(s.location||'clinic')+':'+s.inside+':'+s.room;fieldPlayer=key;fieldAt=c.clock;return dist;
}
export function tickCombat(s,c,dt){dt=Math.max(0,Math.min(.05,dt));c.clock+=dt;c.cooldown=Math.max(0,c.cooldown-dt);c.flash=Math.max(0,c.flash-dt);c.hit=Math.max(0,c.hit-dt);c.noise=Math.max(0,c.noise-dt);if(c.reloading>0){c.reloading=Math.max(0,c.reloading-dt);if(c.reloading===0)c.ammo=MAGAZINE;}
 c.tracers=c.tracers.filter(b=>(b.life-=dt)>0);if(s.health<=0)return;
 let distances=null;
 for(const e of c.enemies){e.hurt=Math.max(0,e.hurt-dt);e.attack=Math.max(0,e.attack-dt);if(e.hp<=0||e.inside!==s.inside||(e.location||'clinic')!==(s.location||'clinic'))continue;let dx=s.x-e.x,dy=s.y-e.y,d=Math.hypot(dx,dy);const visible=d<190&&lineClear(e.x,e.y,s.x,s.y,e.inside,s.location,s.room);if(visible)e.awake=true;if(!e.awake)continue;
 if(d<24){if(!e.attack){s.health=Math.max(0,s.health-9);e.attack=1.1;}continue;}
 if(!lineClear(e.x,e.y,s.x,s.y,e.inside,s.location,s.room)){distances??=distanceField(s,c);const gx=Math.round(e.x/STEP),gy=Math.round(e.y/STEP);let next=null,best=Infinity;for(let y=gy-1;y<=gy+1;y++)for(let x=gx-1;x<=gx+1;x++){if(x<0||x>=COLS||y<0||y>=ROWS||(x===gx&&y===gy))continue;const value=distances[y*COLS+x];if(value<0||value>=best||!lineClear(e.x,e.y,x*STEP,y*STEP,e.inside,s.location,s.room))continue;best=value;next={x:x*STEP,y:y*STEP};}if(!next)continue;dx=next.x-e.x;dy=next.y-e.y;}
 const oldX=e.x,oldY=e.y;move(e,dx,dy,dt*.36);e.moving=Math.hypot(e.x-oldX,e.y-oldY)>.01;e.phase=(e.phase||0)+(e.moving?dt:0);
 }
}
export function restoreCombat(saved){const fresh=createCombat();if(!saved||typeof saved!=='object')return fresh;if(Number.isInteger(saved.ammo)&&saved.ammo>=0&&saved.ammo<=8)fresh.ammo=saved.ammo;if(saved.weapon==='crowbar')fresh.weapon='crowbar';if(Array.isArray(saved.enemies))for(const e of fresh.enemies){const old=saved.enemies.find(v=>v.id===e.id);if(old&&Number.isFinite(old.hp)&&old.hp>=0&&old.hp<=90&&Number.isFinite(old.x)&&Number.isFinite(old.y)&&walkable(old.x,old.y,e.inside,e.location)){e.hp=old.hp;e.x=old.x;e.y=old.y;e.awake=old.awake===true;}}fresh.kills=fresh.enemies.filter(e=>e.hp===0).length;return fresh;}
