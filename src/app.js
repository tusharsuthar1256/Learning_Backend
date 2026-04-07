import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";

const app = express();

const allowedOrigins = [
     process.env.CORS_ORIGIN,
     'http://localhost:5173',
     'http://localhost:3000'
].filter(Boolean);

app.use(cors({
     origin: function (origin, callback) {
          // Allow requests with no origin (mobile apps, curl, etc.)
          if (!origin) return callback(null, true);
          if (allowedOrigins.includes(origin) || process.env.CORS_ORIGIN === '*') {
               return callback(null, true);
          }
          return callback(new Error('Not allowed by CORS'));
     },
     credentials: true
}))

app.use(express.json({limit:"16kb"}));
app.use(express.urlencoded({extended:true,limit:"16kb"}));
app.use(express.static("public"));
app.use(cookieParser());

//Routes

import userRouter from './routes/user.route.js';
import playlistRouter from "./routes/playlist.route.js";
import likesRouter from "./routes/like.route.js";
import tweetRouter from "./routes/tweet.route.js";
import videoRouter from "./routes/video.route.js";
import subscriptionRouter from "./routes/subscription.route.js";
import commentRouter from "./routes/comment.route.js";

app.use("/api/v1/users",userRouter)
app.use("/api/v1/playlist",playlistRouter)
app.use("/api/v1/like",likesRouter)
app.use("/api/v1/tweets",tweetRouter)
app.use("/api/v1/videos",videoRouter)
app.use("/api/v1/subscriptions",subscriptionRouter)
app.use("/api/v1/comments",commentRouter)

export { app }



