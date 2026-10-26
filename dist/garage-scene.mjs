// «Последний свет»: compact garage yard. Every object's collision box is shared by movement, bullets and enemies.
// Two rows of closed boxes; only № 28 is open and entered on foot through its gate (no teleport).
export const ROOM='28';
export const GARAGES=[
 {id:'24',x:236,y:56,w:320,h:224},{id:'26',x:566,y:56,w:320,h:224,flip:true},{id:'28',x:896,y:56,w:320,h:224,open:true},{id:'30',x:1226,y:56,w:320,h:224,flip:true,dark:.18},
 {id:'32',x:196,y:470,w:320,h:224,dark:.12},{id:'34',x:526,y:470,w:320,h:224,flip:true},{id:'36',x:1076,y:470,w:320,h:224,dark:.1}
];
// draw: art rectangle; solid: footprint at ground level. Tall art can overlap the hero and fades when he is behind it.
export const PROPS=[
 {id:'van',kind:0,x:610,y:316,w:190,h:130,solid:[622,358,795,440]},
 {id:'cache',kind:2,x:1440,y:292,w:122,h:76,solid:[1446,318,1556,366]},
 {id:'hut',kind:3,x:1452,y:700,w:122,h:106,solid:[1458,736,1565,800]},
 ...[[100,80],[1545,40],[1540,300],[40,640],[700,760]].map(([x,y],i)=>({id:'tree'+i,kind:1,x,y,w:92,h:135,tall:true,solid:[x+38,y+112,x+54,y+130]}))
];
export const GATE={x:960,y:858,r:48,left:880,right:1040,fence:855};
const inRect=(x,y,r)=>x>=r[0]&&x<=r[2]&&y>=r[1]&&y<=r[3];
const box=b=>[b.x,b.y,b.x+b.w,b.y+b.h];
const OPEN=GARAGES.find(g=>g.open);
// Inside № 28: concrete floor behind the bench line, plus the open gate in the front wall.
export const ROOM_FLOOR=[OPEN.x+28,OPEN.y+148,OPEN.x+292,OPEN.y+216],DOORWAY=[OPEN.x+104,OPEN.y+210,OPEN.x+218,OPEN.y+232];
export function garageRoom(x,y){return inRect(x,y,box(OPEN))?ROOM:null;}
export function garageFloor(x,y){
 if(inRect(x,y,box(OPEN)))return inRect(x,y,ROOM_FLOOR)||inRect(x,y,DOORWAY);
 if(!inRect(x,y,[65,56,1605,888]))return false;
 // The fence is solid except the open south gate between its posts.
 if(y>GATE.fence-1&&(x<GATE.left||x>GATE.right))return false;
 if(GARAGES.some(b=>inRect(x,y,box(b))))return false;
 return !PROPS.some(p=>inRect(x,y,p.solid));}
// Kept for old saves and callers: there are no portals in this yard any more.
export function garageTarget(){return null;}
export function garagePortal(){return false;}
export function garageDrawables(assets,s){return [
 ...GARAGES.filter(b=>!(b.open&&s.room===ROOM)).map(b=>({type:'building',...b,depth:b.y+b.h,img:assets.garageBuilding,interior:b.open?assets.garageInterior:null})),
 ...(s.room===ROOM?[{type:'front-wall',...OPEN,depth:OPEN.y+OPEN.h,img:assets.garageBuilding}]:[]),
 ...PROPS.map(p=>({type:'prop',...p,depth:p.solid[3],img:assets.garageProps}))];}
// Generated asset bounds; cropping happens only at draw time.
export const ART={building:[102,88,1314,852],interior:[107,98,1561,685],props:[[140,60,620,485],[989,0,340,565],[185,645,520,315],[930,550,470,450]],
 door:[500,655,525,270],leaf:[[505,655,260,270],[765,655,260,270]],bench:[690,110,430,280],lamp:[755,630],brick:[[102,880,398,45],[1025,880,391,45]]};
const sx=320/ART.building[2],sy=224/ART.building[3];
function drawBuilding(ctx,o,img){const [cx,cy,cw,ch]=ART.building;ctx.save();if(o.flip){ctx.translate(o.x*2+o.w,0);ctx.scale(-1,1);}ctx.drawImage(img,cx,cy,cw,ch,o.x,o.y,o.w,o.h);
 // Lamps over closed boxes are dead; the only warm light in the yard is over № 28.
 const lx=o.x+(ART.lamp[0]-cx)*sx,ly=o.y+(ART.lamp[1]-cy)*sy;
 if(!o.open){const g=ctx.createRadialGradient(lx,ly,0,lx,ly,15);g.addColorStop(0,'rgba(30,32,29,.95)');g.addColorStop(.45,'rgba(30,32,29,.7)');g.addColorStop(1,'rgba(30,32,29,0)');ctx.fillStyle=g;ctx.fillRect(lx-15,ly-15,30,30);}
 if(o.dark){ctx.globalAlpha=o.dark;ctx.globalCompositeOperation='multiply';ctx.fillStyle='#4a5048';ctx.fillRect(o.x,o.y,o.w,o.h);}
 ctx.restore();}
// № 28 from the yard: the gate leaves stand open, the lit bench shows through.
function drawOpenGate(ctx,o,img,interior){const [cx,cy]=ART.building,[dx,dy,dw,dh]=ART.door;const x=o.x+(dx-cx)*sx,y=o.y+(dy-cy)*sy,w=dw*sx,h=dh*sy;
 ctx.drawImage(interior,...ART.bench,x,y,w,h);const g=ctx.createLinearGradient(0,y,0,y+h);g.addColorStop(0,'rgba(10,9,7,.55)');g.addColorStop(.6,'rgba(10,9,7,.1)');g.addColorStop(1,'rgba(10,9,7,.35)');ctx.fillStyle=g;ctx.fillRect(x,y,w,h);
 const leafW=w*.24;ctx.drawImage(img,...ART.leaf[0],x-leafW,y+1,leafW,h);ctx.drawImage(img,...ART.leaf[1],x+w,y+1,leafW,h);
 ctx.fillStyle='rgba(8,8,6,.35)';ctx.fillRect(x-leafW,y+1,1.5,h);ctx.fillRect(x+w+leafW-1.5,y+1,1.5,h);}
export function drawGarageObject(ctx,o,hero){ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';
 if(o.type==='building'){drawBuilding(ctx,o,o.img);if(o.open&&o.interior)drawOpenGate(ctx,o,o.img,o.interior);ctx.fillStyle=o.open?'#e2d2a8':'#a9a588';ctx.font='bold 13px monospace';ctx.textAlign='center';ctx.fillText(o.id,o.open?o.x+56:o.x+o.w/2,o.y+(o.open?176:o.h-26));ctx.restore();return;}
 if(o.type==='front-wall'){const [cx,cy]=ART.building;for(const [i,b] of ART.brick.entries()){const x=o.x+(b[0]-cx)*sx;ctx.drawImage(o.img,...b,x,o.y+o.h-9,b[2]*sx,9);}ctx.restore();return;}
 const crop=ART.props[o.kind];
 // A tall object fades while the hero stands behind it, so it never hides him.
 if(o.tall&&hero&&hero.y<o.depth&&hero.y>o.y&&hero.x>o.x-6&&hero.x<o.x+o.w+6)ctx.globalAlpha=.42;
 if(crop)ctx.drawImage(o.img,...crop,o.x,o.y,o.w,o.h);ctx.restore();}
// Inside № 28 the roof is gone: back slope stays as a cut, the room art is the floor.
export function drawGarageRoom(ctx,assets){const o=OPEN,[cx,cy,cw]=ART.building,[ix,iy,iw,ih]=ART.interior;ctx.save();ctx.imageSmoothingEnabled=true;
 ctx.drawImage(assets.garageBuilding,cx,cy,cw,84/sy,o.x,o.y,o.w,84);ctx.drawImage(assets.garageInterior,ix,iy,iw,ih,o.x,o.y+84,o.w,140);
 const g=ctx.createRadialGradient(o.x+163,o.y+120,4,o.x+163,o.y+150,120);g.addColorStop(0,'rgba(255,196,120,.16)');g.addColorStop(1,'rgba(255,196,120,0)');ctx.fillStyle=g;ctx.fillRect(o.x,o.y+60,o.w,170);ctx.restore();}
// Ground is painted once into an offscreen canvas: calmer texture, one wet main path, puddles grouped at the drain.
export const MARGIN=260;
export function paintGarageGround(g,assets){const W=1672,H=940,M=MARGIN;g.save();g.imageSmoothingEnabled=true;g.imageSmoothingQuality='high';
 const tile=1100;for(let y=-M;y<H+M;y+=tile)for(let x=-M;x<W+M;x+=tile)g.drawImage(assets.garageGround,x+M,y+M,tile,tile);
 g.fillStyle='rgba(36,42,39,.46)';g.fillRect(0,0,W+2*M,H+2*M);g.translate(M,M);
 // Outside the fence: darker, untended ground.
 g.fillStyle='rgba(12,16,13,.5)';g.fillRect(-M,-M,W+2*M,M+56);g.fillRect(-M,0,M+65,H+M);g.fillRect(1605,0,M+67,H+M);g.fillRect(65,888,1540,M+52);
 const blur=f=>{try{g.filter=f;}catch{}};
 // Main path: gate → central passage → yard in front of the upper row.
 blur('blur(10px)');g.strokeStyle='rgba(24,29,27,.5)';g.lineCap='round';g.lineJoin='round';g.lineWidth=150;g.beginPath();g.moveTo(960,920);g.lineTo(960,470);g.lineTo(960,375);g.moveTo(300,375);g.lineTo(1500,375);g.stroke();
 g.lineWidth=90;g.strokeStyle='rgba(30,36,34,.35)';g.beginPath();g.moveTo(140,780);g.lineTo(1540,780);g.moveTo(130,780);g.lineTo(130,380);g.moveTo(1500,780);g.lineTo(1500,380);g.stroke();
 // Puddles at the passage mouth and the drain.
 for(const [x,y,rx,ry] of [[935,742,60,22],[1002,452,46,16],[880,402,34,12],[1180,320,30,10]]){const p=g.createRadialGradient(x,y,2,x,y,rx);p.addColorStop(0,'rgba(132,146,150,.32)');p.addColorStop(.75,'rgba(92,104,108,.22)');p.addColorStop(1,'rgba(20,24,22,0)');g.fillStyle=p;g.beginPath();g.ellipse(x,y,rx,ry,0,0,Math.PI*2);g.fill();}
 blur('none');
 // Tyre tracks from the gate up the passage and out to the van.
 g.strokeStyle='rgba(16,19,17,.38)';g.lineWidth=3;for(const off of [-22,22]){g.beginPath();g.moveTo(960+off,900);g.bezierCurveTo(960+off,640,950+off,500,900+off*.6,430);g.bezierCurveTo(860,400+off*.4,820,395+off*.5,800,398+off*.6);g.stroke();}
 // Drain grate.
 g.fillStyle='#1a1f1c';g.fillRect(990,446,24,12);g.strokeStyle='#4e554d';g.lineWidth=1;for(let x=993;x<1012;x+=4){g.beginPath();g.moveTo(x,447);g.lineTo(x,457);g.stroke();}
 // Soft contact shadows under buildings and props: light comes from the overcast north.
 for(const b of GARAGES){const s=g.createLinearGradient(0,b.y+b.h-6,0,b.y+b.h+16);s.addColorStop(0,'rgba(6,8,7,.5)');s.addColorStop(1,'rgba(6,8,7,0)');g.fillStyle=s;g.fillRect(b.x+4,b.y+b.h-6,b.w-8,22);}
 for(const p of PROPS){const [x0,y0,x1,y1]=p.solid;g.fillStyle='rgba(6,8,7,.35)';g.beginPath();g.ellipse((x0+x1)/2,y1-2,(x1-x0)/2+6,7,0,0,Math.PI*2);g.fill();}
 // Warm spill from the lamp over № 28.
 const o=OPEN,w=g.createRadialGradient(o.x+161,o.y+232,6,o.x+161,o.y+240,110);w.addColorStop(0,'rgba(255,188,108,.22)');w.addColorStop(1,'rgba(255,188,108,0)');g.fillStyle=w;g.fillRect(o.x+40,o.y+210,240,140);
 // Fence: solid line with a gate gap, the physical boundary is the same line.
 g.strokeStyle='#1b211d';g.lineWidth=4;g.beginPath();g.moveTo(66,855);g.lineTo(GATE.left,855);g.moveTo(GATE.right,855);g.lineTo(1605,855);g.moveTo(65,56);g.lineTo(65,855);g.moveTo(1605,56);g.lineTo(1605,855);g.stroke();
 g.lineWidth=1;g.strokeStyle='#5c6255';for(let x=70;x<1605;x+=24){if(x>GATE.left-4&&x<GATE.right+4)continue;g.beginPath();g.moveTo(x,817);g.lineTo(x,860);g.stroke();}
 for(let y=70;y<855;y+=24)for(const x of [65,1605]){g.beginPath();g.moveTo(x-3,y);g.lineTo(x+3,y);g.stroke();}
 g.beginPath();g.moveTo(66,822);g.lineTo(GATE.left,822);g.moveTo(GATE.right,822);g.lineTo(1605,822);g.stroke();
 g.fillStyle='#2c312b';for(const x of [GATE.left-6,GATE.right-2]){g.fillRect(x,800,8,64);}g.fillStyle='#646b5d';for(const x of [GATE.left-6,GATE.right-2])g.fillRect(x,800,8,3);
 g.fillStyle='rgba(196,200,170,.55)';g.font='11px monospace';g.textAlign='center';g.fillText('ВЫХОД',GATE.x,880);g.restore();}
export function drawGarageGround(ctx,assets){if(assets.garageGroundCanvas)ctx.drawImage(assets.garageGroundCanvas,-MARGIN,-MARGIN);}
