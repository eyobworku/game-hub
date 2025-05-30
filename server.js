const express = require("express");
const dotenv = require("dotenv");
const colors = require("colors");
const connectDB = require("./config/db");
const errorHandler = require("./middleware/error");
const cors = require("cors");
const socketIo = require("socket.io");
const http = require("http");
const { initGame, disconnectPlayer } = require("./utils/gameLogic");

//Load env vars
dotenv.config({ path: "./config/config.env" });

connectDB();

//Route files
const users = require("./routes/users");

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:5173", // Allow requests from this origin
    methods: ["GET", "POST"], // Allow only specified methods
    credentials: true, // Allow sending cookies along with requests
  },
});

initGame(io);
app.use(cors());

//Body parser
app.use(express.json());

app.use("/api/v1/users", users);

//Error Handler
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

server.listen(
  PORT,
  console.log(
    `Server running in ${process.env.NODE_ENV} mode on port ${PORT}`.yellow.bold
  )
);

//Handle unhandled promise rejections
process.on("unhandledRejection", (err, promise) => {
  console.log(`Error: ${err.message}`.red);
  //Close server & exit process
  server.close(() => process.exit(1));
});
