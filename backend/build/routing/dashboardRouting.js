"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.itemRouter = void 0;
const express_1 = __importDefault(require("express"));
const itemRouter = express_1.default.Router();
exports.itemRouter = itemRouter;
const model_1 = require("../module/model");
const userRouting_1 = require("./userRouting");
itemRouter.post('/addItem', async (req, res) => {
    try {
        let { category, name, desc, price, quantity } = req.body;
        const item_id = (0, userRouting_1.generateRandomId)();
        let item = await model_1.itemModel.insertMany({ item_id: item_id, category: category, name: name, desc: desc, price, quantity: quantity, status: true, added_date: new Date(), updated_date: new Date() });
        console.log(item);
        res.json({ status: 200, message: "Item added successfully", result: item });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Failed to add item" });
    }
});
itemRouter.get('/getAllItems', async (req, res) => {
    try {
        let data = await model_1.itemModel.find();
        res.json({ status: 200, message: "Successfully load data", result: data });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Item loading Failed" });
    }
});
itemRouter.get('/getItemById', async (req, res) => {
    try {
        let { item_id } = req.body;
        const data = await model_1.itemModel.findOne({ item_id: item_id }).lean();
        if (!data) {
            res.json({ status: 200, message: "No item found", result: data });
            return;
        }
        res.json({ status: 200, message: "Successfully load data", result: data });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "No item found" });
    }
});
itemRouter.get('/getItemByCategory', async (req, res) => {
    try {
        let { category } = req.body;
        const data = await model_1.itemModel.findOne({ category: category }).lean();
        if (!data) {
            res.json({ status: 200, message: "No item found", result: data });
            return;
        }
        res.json({ status: 200, message: "Successfully load data", result: data });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "No item found" });
    }
});
itemRouter.post('/updateItemById', async (req, res) => {
    try {
        let { item_id, category, name, desc, price, quantity } = req.body;
        const data = await model_1.itemModel.findOne({ item_id: item_id });
        if (!data) {
            res.json({ status: 200, message: "No item found", result: data });
            return;
        }
        if (data) {
            if (category) {
                data['category'] = category;
            }
            if (name) {
                data['name'] = name;
            }
            if (desc) {
                data['desc'] = desc;
            }
            if (price) {
                data['price'] = price;
            }
            if (quantity) {
                data['quantity'] = quantity;
            }
            await data.save();
            res.json({ status: 200, message: "Successfully update data", result: data });
        }
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "No item found" });
    }
});
itemRouter.delete('/deleteItemById', async (req, res) => {
    try {
        let { item_id } = req.body;
        const data = await model_1.itemModel.findOne({ item_id: item_id }).lean();
        if (!data) {
            res.json({ status: 200, message: "No item found", result: data });
            return;
        }
        if (data) {
            await model_1.itemModel.deleteOne({ item_id: item_id });
            res.json({ status: 200, message: "Successfully delete data" });
        }
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "No item found" });
    }
});
