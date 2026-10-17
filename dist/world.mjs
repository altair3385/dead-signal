// World layers: region → sector → local scene. Per-location state drives anti-farm depletion.
import {REGION,LOCATIONS,SPOTS} from './data/locations.mjs?v=8';
export const PLAYABLE=LOCATIONS.filter(l=>l.playable).map(l=>l.id);
export const locationInfo=id=>LOCATIONS.find(l=>l.id===id)||null;
export function createWorld(){return {region:REGION.id,seed:20261017,locations:Object.fromEntries(PLAYABLE.map(id=>[id,{visits:0,depletion:0}]))};}
export function validWorld(w){return !!w&&typeof w==='object'&&Number.isInteger(w.seed)&&w.locations&&typeof w.locations==='object'&&Object.values(w.locations).every(l=>l&&Number.isInteger(l.visits)&&l.visits>=0&&Number.isFinite(l.depletion)&&l.depletion>=0&&l.depletion<=4);}
export function nextSeed(w){w.seed=(Math.imul(w.seed,1103515245)+12345)>>>0;return w.seed;}
// Going back to the same place again pays less; time spent elsewhere lets it recover.
export function noteSortie(w,location){for(const id of PLAYABLE){w.locations[id]??={visits:0,depletion:0};const l=w.locations[id];if(id===location){l.visits++;l.depletion=Math.min(4,l.depletion+1);}else l.depletion=Math.max(0,l.depletion-.5);}}
// Depth of the local zone: the depth of the nearest loot spot in the same room context.
export function depthAt(location,x,y,inside,room){let best=null,d=Infinity;for(const s of SPOTS)if(s.location===location&&s.inside===inside&&(!s.room||!inside||s.room===room)){const k=Math.hypot(s.x-x,s.y-y);if(k<d){d=k;best=s;}}return best?.depth??1;}
