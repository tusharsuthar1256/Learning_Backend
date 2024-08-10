// require('dotenv').config()
import dotenv from "dotenv";
import connectDB from "./db/index.js";
import { app } from "./app.js";

dotenv.config({
     path: "./env"
});


connectDB()
.then(() => {
     app.on("error", (error) => {
          console.log("App Error Occured : ",error);
          throw error;
     })
     
     app.listen(process.env.PORT || 8000,() => {
          console.log("Server is runing on port no : ", process.env.PORT);
          
     })
})
.catch((err) => {
     console.log("MongoDB connect failed : ",err);
     
})



// import express from "expresss";
// const app = express();
// ( async () => {
//      try {
//          await mongoose.connect(`${process.env.MONGODB_URL}/${DB_NAME}`); 
//          app.on("error", (error) => {
//               console.log("Error occured", error);
//               throw error;
              
//          })
//          app.listen(process.env.PORT, () => {
//               console.log("My app runing on port no ", process.env.PORT);
              
//          })
//      } catch (error) {
//           console.error(error);
//           throw error;
          
//      }
// } )()