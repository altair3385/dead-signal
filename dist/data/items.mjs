// Item catalogue. Content only: no scene, UI or save logic here.
// A stack key is either a plain id (catalogue defaults) or `id@tier@condition` for a rolled copy.
export const RARITY=[
 {id:'common',name:'ОБЫЧНЫЙ',color:'#9da98c',value:1},
 {id:'quality',name:'КАЧЕСТВЕННЫЙ',color:'#8fb06a',value:1.6},
 {id:'rare',name:'РЕДКИЙ',color:'#76a8b4',value:2.6},
 {id:'elite',name:'ЭЛИТНЫЙ',color:'#a38bc0',value:4},
 {id:'unique',name:'УНИКАЛЬНЫЙ',color:'#d0a85c',value:6},
 {id:'relic',name:'РЕЛИКТОВЫЙ',color:'#c46a55',value:9}
];
export const TIER=Object.fromEntries(RARITY.map((r,i)=>[r.id,{...r,rank:i}]));
// Realistic properties only; rarity and condition stay separate parameters.
export const ITEMS={
 backpack:{name:'ПОЛЕВОЙ РЮКЗАК',desc:'Прочный армейский рюкзак. Увеличивает переносимый вес до 30 кг.',weight:1.3,condition:82,type:'equip',tier:'quality',value:30,props:{Вместимость:'30 кг',Шум:'низкий'}},
 bandage:{name:'БИНТ',desc:'Чистый перевязочный материал. Восстанавливает 15 здоровья.',weight:.1,type:'consume',tier:'common',value:4,category:'med'},
 water:{name:'ПИТЬЕВАЯ ВОДА',desc:'Запечатанная бутылка. Восстанавливает 30 жажды.',weight:.5,type:'consume',tier:'common',value:3,category:'food'},
 food:{name:'ТУШЁНКА',desc:'Консервы ещё пригодны в пищу. Восстанавливают 25 сытости.',weight:.35,type:'consume',tier:'common',value:4,category:'food'},
 medkit:{name:'АПТЕЧКА',desc:'Армейская аптечка: жгут, бинты, обезболивающее. Восстанавливает 45 здоровья.',weight:.6,type:'consume',tier:'rare',value:18,category:'med',icon:'medkit'},
 flashlight:{name:'ФОНАРЬ',desc:'Карманный фонарь. В этом прототипе хранится как предмет.',weight:.25,condition:74,type:'supply',tier:'common',value:8,props:{Надёжность:'средняя',Шум:'нет'}},
 radio:{name:'ПОЛЕВАЯ РАЦИЯ',desc:'Армейская портативная рация. Сквозь помехи слышен чей-то голос. Донеси её к воротам.',weight:.8,condition:91,type:'quest',tier:'rare',value:40},
 pliers:{name:'ПАССАТИЖИ',desc:'Инструмент. Мастерская использует его при ремонте.',weight:.3,condition:68,type:'supply',tier:'common',value:7,props:{Ремонтопригодность:'высокая'}},
 tape:{name:'АРМИРОВАННЫЙ СКОТЧ',desc:'Расходник мастерской: ремонт снаряжения.',weight:.2,type:'supply',tier:'common',value:5,category:'resource'},
 scrap:{name:'МЕТАЛЛОЛОМ',desc:'Обрезки жести и арматуры. Нужен для улучшений убежища.',weight:1,type:'supply',tier:'common',value:3,category:'resource',icon:'scrap'},
 parts:{name:'ДЕТАЛИ',desc:'Болты, пружины, шестерни. Нужны мастерской и для улучшений.',weight:.3,type:'supply',tier:'common',value:6,category:'resource',icon:'parts'},
 jacket:{name:'КУРТКА С КАПЮШОНОМ',desc:'Потёртая куртка. Уже надета на персонажа.',weight:1.4,condition:77,type:'clothes',tier:'common',value:12,props:{Защита:'от холода'}},
 vest:{name:'РАЗГРУЗКА',desc:'Подсумки для снаряжения. Уже надета на персонажа.',weight:.9,condition:80,type:'clothes',tier:'common',value:14},
 boots:{name:'БОТИНКИ',desc:'Высокие походные ботинки. Уже надеты на персонажа.',weight:1.2,condition:73,type:'clothes',tier:'common',value:10},
 battery:{name:'АККУМУЛЯТОР',desc:'Автомобильный аккумулятор. Тяжёлый, но для убежища — источник света и связи.',weight:12,condition:62,type:'supply',tier:'quality',value:35}
};
export function makeKey(id,tier,condition){const d=ITEMS[id];if(!d)return null;if(tier===d.tier&&(d.condition===undefined||condition===d.condition))return id;return d.condition===undefined?id+'@'+tier:id+'@'+tier+'@'+condition;}
export function parseKey(key){if(typeof key!=='string')return null;const [id,tier,cond]=key.split('@');const d=ITEMS[id];if(!d)return null;if(tier===undefined)return {id,tier:d.tier,condition:d.condition};if(!TIER[tier])return null;if(d.condition===undefined){if(cond!==undefined)return null;return {id,tier,condition:undefined};}const c=Number(cond);if(!Number.isInteger(c)||c<1||c>100||String(c)!==cond)return null;return {id,tier,condition:c};}
export function itemDef(key){const p=parseKey(key);if(!p)return null;const d=ITEMS[p.id];const tier=TIER[p.tier];return {...d,key,id:p.id,tier:p.tier,rarity:tier.name,rarityColor:tier.color,condition:p.condition,icon:d.icon||p.id,value:Math.round(d.value*tier.value*(p.condition?.4+.6*p.condition/100:1))};}
export const baseId=key=>parseKey(key)?.id??null;
