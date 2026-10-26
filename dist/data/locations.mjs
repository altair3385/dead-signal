// Region and location content. Four layers: Russia → region → sector → local scene.
// Only one region is active; future points are listed so the map shows them honestly as unavailable.
export const REGION={id:'oblast-1',name:'ПРИГОРОДНЫЙ РАЙОН',country:'РОССИЯ'};
export const LOCATIONS=[
 {id:'clinic',name:'РАЙОННАЯ ПОЛИКЛИНИКА',short:'ПОЛИКЛИНИКА',sector:'07',kind:'малый город',risk:2,playable:true,map:{x:58,y:38},hint:'Медицина и припасы. Глубже — кабинеты и операционная.',quest:{flag:'completed',item:'radio',text:'Рация в медицинском шкафу'}},
 {id:'garages',name:'ГАРАЖНЫЙ КООПЕРАТИВ',short:'ГАРАЖИ',sector:'09',kind:'окраина',risk:1,playable:true,map:{x:34,y:62},hint:'Инструменты, детали, металлолом. Открыт только № 28 — над ним горит лампа.',quest:{flag:'garageCompleted',item:'battery',text:'Аккумулятор в гараже № 28'},entry:{x:960,y:820}},
 {id:'yard',name:'ДВОР ПАНЕЛЕК',short:'ПАНЕЛЬКИ',sector:'04',kind:'крупный город',risk:3,playable:false,map:{x:78,y:20}},
 {id:'station',name:'Ж/Д СТАНЦИЯ',short:'СТАНЦИЯ',sector:'11',kind:'малый город',risk:2,playable:false,map:{x:70,y:72}},
 {id:'village',name:'ДЕРЕВНЯ',short:'ДЕРЕВНЯ',sector:'15',kind:'деревня',risk:1,playable:false,map:{x:18,y:30}},
 {id:'checkpoint',name:'ЛЕСНОЙ БЛОКПОСТ',short:'БЛОКПОСТ',sector:'18',kind:'лес',risk:2,playable:false,map:{x:14,y:80}}
];
export const SHELTER_POINT={x:44,y:48};
// Loot spots: depth 1 near the entrance, 3 at the far end. A quest item stays put until delivered.
export const SPOTS=[
 {id:'cabinet',location:'clinic',name:'МЕДИЦИНСКИЙ ШКАФ',x:1065,y:435,inside:true,depth:3,table:'medical',first:{radio:1,bandage:2,flashlight:1},quest:'radio'},
 {id:'bag',location:'clinic',name:'ЗАБЫТЫЙ РЮКЗАК',x:748,y:302,inside:true,depth:2,table:'civil',first:{backpack:1,water:2,food:1}},
 {id:'toolbox',location:'clinic',name:'ЯЩИК У СКОРОЙ',x:444,y:630,inside:false,depth:1,table:'tools',first:{pliers:1,tape:2}},
 {id:'ambulance',location:'clinic',name:'САЛОН СКОРОЙ',x:330,y:650,inside:false,depth:1,table:'medical'},
 {id:'reception',location:'clinic',name:'РЕГИСТРАТУРА',x:730,y:470,inside:true,depth:2,table:'civil'},
 {id:'office',location:'clinic',name:'СТОЛ ГЛАВВРАЧА',x:1205,y:252,inside:true,depth:3,table:'medical'},
 {id:'procedure',location:'clinic',name:'ПРОЦЕДУРНОЕ КРЕСЛО',x:980,y:505,inside:true,depth:3,table:'medical'},
 // Garages «Последний свет»: gate (depth I) → yard and van (II) → № 28 and the guarded cache (III). Points are where the hero stands.
 {id:'garage-battery',location:'garages',room:'28',name:'ВЕРСТАК · ГАРАЖ № 28',x:1059,y:212,inside:false,depth:3,table:'tools',first:{battery:1,pliers:1,tape:2},quest:'battery'},
 {id:'garage-shelf',location:'garages',room:'28',name:'СТЕЛЛАЖ · ГАРАЖ № 28',x:1158,y:214,inside:false,depth:3,table:'tools',first:{parts:1,water:1}},
 {id:'garage-crates',location:'garages',name:'ЯЩИКИ У ГЛУХОГО № 30',x:1500,y:384,inside:false,depth:3,table:'tools',always:true,first:{medkit:1,parts:2,flashlight:1}},
 {id:'garage-van',location:'garages',name:'КУЗОВ ФУРГОНА',x:812,y:410,inside:false,depth:2,table:'tools',first:{water:2,food:1,scrap:1}},
 {id:'garage-hut',location:'garages',name:'СТОРОЖКА',x:1480,y:818,inside:false,depth:1,table:'civil',first:{bandage:2,food:1}},
];
// Weighted tables: [id, weight]. Gear rolls rarity and condition; consumables keep catalogue defaults.
export const TABLES={
 medical:[['bandage',6],['medkit',2],['water',3],['food',2],['flashlight',1],['tape',1]],
 civil:[['water',5],['food',5],['bandage',3],['flashlight',2],['backpack',1],['tape',2],['scrap',2]],
 tools:[['scrap',6],['parts',5],['tape',4],['pliers',2],['flashlight',1],['backpack',1],['water',1]]
};
