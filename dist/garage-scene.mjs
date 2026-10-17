// Every placed object's bounds are shared by rendering and collision.
export const GARAGES=[
 {id:'26',x:140,y:85,w:300,h:210}, {id:'28',x:475,y:85,w:300,h:210},
 {id:'30',x:810,y:85,w:300,h:210},{id:'32',x:1145,y:85,w:300,h:210},
 {id:'34',x:140,y:530,w:300,h:210},{id:'36',x:1155,y:560,w:300,h:210}
];
export const PROPS=[{id:'van',kind:0,x:1210,y:365,w:170,h:116},{id:'spares',kind:2,x:465,y:435,w:78,h:64},{id:'hut',kind:3,x:1340,y:770,w:110,h:95},
 ...[[75,80],[1545,95],[75,360],[1545,420],[75,700],[1535,700]].map(([x,y],i)=>({id:'tree'+i,kind:1,x,y:y-80,w:92,h:135}))];
const inRect=(x,y,r)=>x>=r[0]&&x<=r[2]&&y>=r[1]&&y<=r[3];
export function garageFloor(x,y,inside,room){if(inside){const b=GARAGES.find(g=>g.id===room);return !!b&&inRect(x,y,[b.x+30,b.y+100,b.x+b.w-30,b.y+b.h-15]);}
 if(!inRect(x,y,[65,55,1605,888]))return false;
 // Fence is solid except the open entrance between its two posts.
 if(y>854&&(x<755||x>925))return false;
 if(GARAGES.some(b=>inRect(x,y,[b.x,b.y,b.x+b.w,b.y+b.h])))return false;
 return !PROPS.some(p=>inRect(x,y,[p.x,p.y,p.x+p.w,p.y+p.h]));}
export function garageTarget(s){if(s.inside){const b=GARAGES.find(g=>g.id===s.room);if(!b)return null;if(Math.hypot(s.x-(b.x+b.w/2),s.y-(b.y+b.h-22))<37)return {id:'garage-leave',name:'ВЫЙТИ ИЗ ГАРАЖА',x:b.x+b.w/2,y:b.y+b.h-22};return null;}
 if(!s.garageCompleted&&s.inventory.battery&&Math.hypot(s.x-840,s.y-850)<48)return {id:'exit',name:'ВЕРНУТЬСЯ С АККУМУЛЯТОРОМ',x:840,y:850};
 const b=GARAGES.find(g=>Math.hypot(s.x-(g.x+g.w/2),s.y-(g.y+g.h+22))<55);return b?{id:'garage-enter-'+b.id,name:'ГАРАЖ № '+b.id,x:b.x+b.w/2,y:b.y+b.h+22}:null;}
export function garagePortal(s,id){if(id.startsWith('garage-enter-')){const b=GARAGES.find(g=>g.id===id.slice(13));if(!b)return false;s.inside=true;s.room=b.id;s.x=b.x+b.w/2;s.y=b.y+b.h-30;s.direction='north';return true;}if(id==='garage-leave'){const b=GARAGES.find(g=>g.id===s.room);if(!b)return false;s.x=b.x+b.w/2;s.y=b.y+b.h+22;s.inside=false;s.room=null;s.direction='south';return true;}return false;}
export function garageDrawables(assets,s){return [...GARAGES.map(b=>({type:'building',...b,depth:b.y+b.h,img:s.inside&&s.room===b.id?assets.garageInterior:assets.garageBuilding})),...PROPS.map(p=>({type:'prop',...p,depth:p.y+p.h,img:assets.garageProps}))];}
// Generated asset bounds are supplied separately; cropping occurs only at draw time.
export const ART={building:[102,88,1314,852],interior:[107,98,1561,685],props:[[140,60,620,485],[989,0,340,565],[185,645,520,315],[930,550,470,450]]};
export function drawGarageObject(ctx,o){ctx.save();ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';if(o.type==='building'){const bounds=o.img._crop||[0,0,o.img.width,o.img.height];ctx.drawImage(o.img,...bounds,o.x,o.y,o.w,o.h);ctx.fillStyle='#c8c0a0';ctx.font='bold 16px monospace';ctx.textAlign='center';ctx.fillText(o.id,o.x+o.w/2,o.y+o.h-28);ctx.restore();return;}
 const crop=ART.props[o.kind];if(crop)ctx.drawImage(o.img,...crop,o.x,o.y,o.w,o.h);ctx.restore();}
export function drawGarageGround(ctx,assets){ctx.imageSmoothingEnabled=true;ctx.imageSmoothingQuality='high';const tile=640;for(let y=0;y<940;y+=tile)for(let x=0;x<1672;x+=tile)ctx.drawImage(assets.garageGround,x,y,tile,tile);
 ctx.fillStyle='#242b2948';ctx.fillRect(0,0,1672,940);ctx.strokeStyle='#434b4560';ctx.lineWidth=120;ctx.lineCap='round';ctx.beginPath();ctx.moveTo(840,850);ctx.lineTo(840,400);ctx.moveTo(270,360);ctx.lineTo(1370,360);ctx.stroke();
 // Simple structural fence geometry is also the physical boundary, not painted into the tile.
 ctx.strokeStyle='#1b211d';ctx.lineWidth=4;ctx.beginPath();ctx.moveTo(66,855);ctx.lineTo(755,855);ctx.moveTo(925,855);ctx.lineTo(1605,855);ctx.stroke();ctx.lineWidth=1;ctx.strokeStyle='#5c6255';for(let x=70;x<1605;x+=24){if(x>755&&x<925)continue;ctx.beginPath();ctx.moveTo(x,817);ctx.lineTo(x,860);ctx.stroke();}ctx.beginPath();ctx.moveTo(66,822);ctx.lineTo(755,822);ctx.moveTo(925,822);ctx.lineTo(1605,822);ctx.stroke();
 ctx.fillStyle='#b4b89a';ctx.font='11px monospace';ctx.textAlign='center';ctx.fillText('ВЫХОД',840,875);}
