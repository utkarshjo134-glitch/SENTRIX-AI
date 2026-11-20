# SENTRIX AI — multi-device prototype

## Files
- `index.html`: responsive interface and camera/WebRTC client.
- `server.js`: Node.js website server and WebSocket signaling relay.
- `package.json`: dependencies and start command.

## Run
Install Node.js 18+. In this folder run:
```bash
npm install
npm start
```
Open http://localhost:3000 on the computer.

## Put it online
Deploy as a **Node.js web service** on a host that supports persistent WebSocket connections. Use `npm start` as the start command. Do NOT use static-only hosting. Open the resulting HTTPS URL on every device.

On each camera phone/tablet/laptop: choose Camera device, choose a unique camera1–camera10 name, password `demo123`, Connect, Start camera, and allow permission.
On the monitoring laptop: choose Monitor dashboard, password `demo123`, Connect.

## Important
- A single HTML file cannot relay cameras between devices. The included Node server is required.
- The public STUN server may not connect through every school/mobile network. For reliable connections, configure a TURN relay server in the `rtc` setting in index.html.
- Keep camera pages open and screens awake. Browser/mobile power-saving may pause video.
- Change the demo password by setting environment variable `SENTRIX_PASSWORD`.
- The motion notice only detects image changes. It does NOT identify bullying, fighting, weapons or dangerous behaviour. This is a school-project demo, not a real security system.
- Get permission before recording or streaming people; follow school rules and privacy laws.
