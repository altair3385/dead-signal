// Shelter modules for the MVP: storage, medbay, workshop. Costs are paid from the stash.
export const MODULES=[
 {id:'storage',name:'СКЛАД',desc:'Хранит добычу между вылазками.',levels:[{level:1,effect:{slots:24}},{level:2,cost:{scrap:3,parts:1},effect:{slots:48}}]},
 {id:'medbay',name:'МЕДПУНКТ',desc:'Лечит между вылазками.',levels:[{level:1,effect:{bandageHeal:20,returnHeal:0}},{level:2,cost:{scrap:2,parts:1,bandage:2},effect:{bandageHeal:35,returnHeal:15}}]},
 {id:'workshop',name:'МАСТЕРСКАЯ',desc:'Чинит снаряжение и инструменты.',levels:[{level:1,effect:{repair:20,maxCondition:80}},{level:2,cost:{scrap:3,parts:2,tape:1},effect:{repair:35,maxCondition:95}}]}
];
export function createShelterState(){return {modules:Object.fromEntries(MODULES.map(m=>[m.id,1]))};}
