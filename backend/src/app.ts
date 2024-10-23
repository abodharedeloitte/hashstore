import express from "express";
import mongoose from "mongoose";
import cors from 'cors';
import router from "./routing/routing";
import cookieParser from "cookie-parser";


const db_connection = `mongodb://localhost:27017/hashstore`;

async function connectionMongoDB(db_connection: string) {
    try {
        await mongoose.connect(db_connection);
        console.log("Connected to DB");
    }
    catch (error) {
        console.log("Error while connection with db", error)
    }
}

connectionMongoDB(db_connection);

const port = 8484;
const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cors());
app.use(cookieParser());
app.use('/hashstore', router);

app.listen(port, () => {
    console.log(`server started on port ${port}`)
})


// const express = require("express");
// const app = express();
// const http = require("http").Server(app);
// const routes = require("./routes/routing");
// const cors = require("cors");

// const port = 3000;

// app.use(cors());
// app.use("/", routes);

// http.listen(port, () => {
//     console.log("Server is listening to port 3000.");
// });