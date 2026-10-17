// Future network boundary. Offline today: no other players, nothing leaves the device.
// A server adapter will implement the same calls (sector presence, run reports, hidden-base signals).
export function offlineNetwork(){return {mode:'offline',presence:()=>({players:0}),reportRun:()=>Promise.resolve({accepted:false,reason:'offline'})};}
