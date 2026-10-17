// Storage boundary: the game talks to a backend, today localStorage, later a server account.
export function localBackend(key,storage=globalThis.localStorage){return {kind:'local',load(){const raw=storage.getItem(key);return raw?JSON.parse(raw):null;},save(data){storage.setItem(key,JSON.stringify(data));}};}
