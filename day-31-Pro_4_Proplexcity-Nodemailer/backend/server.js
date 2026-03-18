import app from "./src/app.js";
import 'dotenv/config';
import { connectToDb } from "./src/config/db.js";

connectToDb();

app.listen(3000, ()=>{
    console.log("Server running at port 3000....")
})