import mongoose from "mongoose";
import { app } from "./app";

import dotenv from "dotenv";
dotenv.config();

const port = process.env.PORT || 3000;

const start = async ()=>{
    if(!process.env.SECRET_KEY){
        throw new Error('JWT env must be created')
    }
    if(!process.env.MONGO_URI){
      throw new Error('MONGO_URI env must be created')
    }
    try{
      await mongoose.connect(process.env.MONGO_URI);
      console.log('CONNECTED TO DATABASE')
    }catch(err){
      // internal server error
      console.log('this is mongo error', err);
    }
  }

app.listen(3000, () =>{
    console.log(`LISTENING ON PORT ${port}`);
});

start();