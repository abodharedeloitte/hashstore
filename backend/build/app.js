"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const cors_1 = __importDefault(require("cors"));
const routing_1 = __importDefault(require("./routing/routing"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const db_connection = `mongodb://localhost:27017/hashstore`;
async function connectionMongoDB(db_connection) {
    try {
        await mongoose_1.default.connect(db_connection);
        console.log("Connected to DB");
    }
    catch (error) {
        console.log("Error while connection with db", error);
    }
}
connectionMongoDB(db_connection);
const port = 8484;
const app = (0, express_1.default)();
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cors_1.default)());
app.use((0, cookie_parser_1.default)());
app.use('/hashstore', routing_1.default);
app.listen(port, () => {
    console.log(`server started on port ${port}`);
});
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
