"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.transactionModel = exports.sellerModel = exports.itemModel = exports.userModel = void 0;
const mongoose_1 = __importDefault(require("mongoose"));
const usersSchema_1 = __importDefault(require("../schema/usersSchema"));
const itemsSchema_1 = __importDefault(require("../schema/itemsSchema"));
const sellerSchema_1 = __importDefault(require("../schema/sellerSchema"));
const transactionSchema_1 = __importDefault(require("../schema/transactionSchema"));
const userModel = mongoose_1.default.model('users', usersSchema_1.default);
exports.userModel = userModel;
const itemModel = mongoose_1.default.model('items', itemsSchema_1.default);
exports.itemModel = itemModel;
const sellerModel = mongoose_1.default.model('seller', sellerSchema_1.default);
exports.sellerModel = sellerModel;
const transactionModel = mongoose_1.default.model('transaction', transactionSchema_1.default);
exports.transactionModel = transactionModel;
