const http=require("http"),fs=require("fs"),path=require("path"),WebSocket=require("ws");
const PORT=process.env.PORT||3000,PASS=process.env.SENTRIX_PASSWORD||"demo123",clients=new Map();
const server=http.createServer((req,res)=>{let p=new URL(req.url,"http://localhost").pathname;if(p==="/")p="/index.html";const file=path.join(__dirname,p.replace(/^\/+/,""));if(!file.startsWith(__dirname)){res.writeHead(403);return res.end()}fs.readFile(file,(e,d)=>{if(e){res.writeHead(404);return res.end("Not found")}res.writeHead(200,{"Content-Type":file.endsWith(".html")?"text/html; charset=utf-8":"text/plain"});res.end(d)})});
const wss=new WebSocket.Server({server});
function send(ws,o){if(ws.readyState===1)ws.send(JSON.stringify(o))}
function roomClients(){return [...clients.values()]}
function roster(){const cams=roomClients().filter(c=>c.role==="camera").map(c=>({id:c.id,cameraId:c.cameraId}));roomClients().filter(c=>c.role==="monitor").forEach(c=>send(c.ws,{type:"roster",cameras:cams}))}
wss.on("connection",ws=>{const id=Math.random().toString(36).slice(2)+Date.now();let me=null;
ws.on("message",raw=>{let m;try{m=JSON.parse(raw)}catch{return}
if(m.type==="register"){if(m.password!==PASS||m.room!=="sentrix"||!["camera","monitor"].includes(m.role)){send(ws,{type:"error",message:"Incorrect password or invalid device"});return ws.close()}
if(m.role==="camera"&&!/^camera([1-9]|10)$/.test(m.cameraId||"")){send(ws,{type:"error",message:"Use camera1 to camera10"});return ws.close()}
me={id,ws,role:m.role,cameraId:m.cameraId};clients.set(id,me);send(ws,{type:"registered",id});roster();
if(me.role==="camera")roomClients().filter(c=>c.role==="monitor").forEach(c=>send(ws,{type:"monitor-ready",target:c.id}));
else roomClients().filter(c=>c.role==="camera").forEach(c=>send(c.ws,{type:"monitor-ready",target:id}));
return}
if(!me)return;
if(m.type==="signal"&&typeof m.target==="string"){const target=clients.get(m.target);if(target)send(target.ws,{type:"signal",from:id,payload:m.payload})}
if(m.type==="alert"&&me.role==="camera"){roomClients().filter(c=>c.role==="monitor").forEach(c=>send(c.ws,{type:"alert",cameraId:me.cameraId,message:String(m.message||"Motion detected").slice(0,180),time:Date.now()}))}
});
ws.on("close",()=>{if(me){clients.delete(id);roomClients().forEach(c=>send(c.ws,{type:"peer-left",id}));roster()}})});
server.listen(PORT,"0.0.0.0",()=>console.log("SENTRIX AI listening on "+PORT));
