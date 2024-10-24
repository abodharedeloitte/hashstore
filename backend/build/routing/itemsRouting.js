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
const jwtAuth_1 = require("../middleware/jwtAuth");
itemRouter.post('/addItem', jwtAuth_1.cookieJWTAuth, async (req, res) => {
    try {
        let { category, name, desc, price, quantity, img, user_id, type } = req.body.data;
        const item_id = (0, userRouting_1.generateRandomId)();
        let item = await model_1.itemModel.insertMany({ item_id: item_id, user_id: user_id, type: type, category: category, name: name, desc: desc, price, quantity: quantity, status: true, added_date: new Date(), updated_date: new Date(), img: img });
        res.json({ status: 200, message: "Item added successfully", result: item });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Failed to add item" });
    }
});
itemRouter.get('/getAllItems', async (req, res) => {
    try {
        let data = await model_1.itemModel.find({ status: true, type: 'sell' });
        res.json({ status: 200, message: "Successfully load sell data", result: data });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Item loading Failed" });
    }
});
itemRouter.get('/accessAllTradeItems', async (req, res) => {
    try {
        let data = await model_1.itemModel.find({ status: true, type: 'trade' });
        res.json({ status: 200, message: "Successfully load trade data", result: data });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Item loading Failed" });
    }
});
itemRouter.get('/getItemById', jwtAuth_1.cookieJWTAuth, async (req, res) => {
    try {
        let { item_id } = req.body;
        const data = await model_1.itemModel.findOne({ item_id: item_id, status: true }).lean();
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
itemRouter.get('/getItemByCategory', jwtAuth_1.cookieJWTAuth, async (req, res) => {
    try {
        let { category } = req.body;
        const data = await model_1.itemModel.findOne({ category: category, status: true }).lean();
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
itemRouter.post('/updateItemById', jwtAuth_1.cookieJWTAuth, async (req, res) => {
    try {
        let { item_id, category, name, desc, price, quantity, img } = req.body.data;
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
            if (img) {
                data['img'] = img;
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
itemRouter.post('/deleteItemById', jwtAuth_1.cookieJWTAuth, async (req, res) => {
    try {
        let item_id = req.body.data;
        const data = await model_1.itemModel.findOne({ item_id: item_id }).lean();
        if (!data) {
            res.json({ status: 200, message: "No item found", result: data });
            return;
        }
        if (data) {
            await model_1.itemModel.updateOne({ item_id: item_id }, { $set: { status: false } });
            res.json({ status: 200, message: "Successfully delete data" });
        }
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Error while item found" });
    }
});
itemRouter.get('/filterData', jwtAuth_1.cookieJWTAuth, async (req, res) => {
    try {
        let { search, category, sort } = req.body;
        let condition = {};
        if (search !== 'All') {
            condition.name = { $regex: search, $options: 'i' };
        }
        if (category !== 'All') {
            condition.category = category;
        }
        let sortOrder = sort === 'asc' ? 1 : -1;
        const items = await model_1.itemModel.find(condition).sort({ name: sortOrder });
        res.json({ status: 200, message: "Successfully filter data", result: items });
    }
    catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Error while filtering item" });
    }
});
