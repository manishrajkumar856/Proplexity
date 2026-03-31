import app from "./src/app.js";
import 'dotenv/config';
import { connectToDb } from "./src/config/db.js";
import http from 'http';
import { initSocket } from "./src/sockets/server.socket.js";

const httpServer = http.createServer(app);
initSocket(httpServer);

connectToDb();

httpServer.listen(3000, ()=>{
    console.log("Server running at port 3000....")
})