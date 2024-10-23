"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const router = express_1.default.Router();
const userRouting_1 = require("./userRouting");
const itemsRouting_1 = require("./itemsRouting");
const transaction_1 = require("./transaction");
router.use('/user', userRouting_1.userRouter);
router.use('/items', itemsRouting_1.itemRouter);
router.use('/transaction', transaction_1.transactionRouter);
exports.default = router;
