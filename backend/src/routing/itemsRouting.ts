import express from "express";
const itemRouter = express.Router();
import { itemModel } from "../module/model";
import { generateRandomId } from "./userRouting";

itemRouter.post('/addItem', async (req, res) => {
    try {
        let { category, name, desc, price, quantity, img } = req.body;
        const item_id = generateRandomId();
        let item = await itemModel.insertMany({ item_id: item_id, category: category, name: name, desc: desc, price, quantity: quantity, status: true, added_date: new Date(), updated_date: new Date(), img: img });
        res.json({ status: 200, message: "Item added successfully", result: item });
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Failed to add item" });
    }
})

itemRouter.get('/getAllItems', async (req, res) => {
    try {
        let data = await itemModel.find({ status: true });
        res.json({ status: 200, message: "Successfully load data", result: data });
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Item loading Failed" });
    }
})

itemRouter.get('/getItemById', async (req, res) => {
    try {
        let { item_id } = req.body;
        const data = await itemModel.findOne({ item_id: item_id, status: true }).lean();
        if (!data) {
            res.json({ status: 200, message: "No item found", result: data });
            return;
        }
        res.json({ status: 200, message: "Successfully load data", result: data });
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "No item found" });
    }
})

itemRouter.get('/getItemByCategory', async (req, res) => {
    try {
        let { category } = req.body;
        const data = await itemModel.findOne({ category: category, status: true }).lean();
        if (!data) {
            res.json({ status: 200, message: "No item found", result: data });
            return;
        }
        res.json({ status: 200, message: "Successfully load data", result: data });
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "No item found" });
    }
})

itemRouter.post('/updateItemById', async (req, res) => {
    try {
        let { item_id, category, name, desc, price, quantity, img } = req.body;
        const data = await itemModel.findOne({ item_id: item_id });
        if (!data) {
            res.json({ status: 200, message: "No item found", result: data });
            return;
        }
        if (data) {
            if (category) {
                data['category'] = category;
            } if (name) {
                data['name'] = name;
            } if (desc) {
                data['desc'] = desc;
            } if (price) {
                data['price'] = price;
            } if (quantity) {
                data['quantity'] = quantity;
            } if (img) {
                data['img'] = img
            }
            await data.save();
            res.json({ status: 200, message: "Successfully update data", result: data });
        }
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "No item found" });
    }
})

itemRouter.delete('/deleteItemById', async (req, res) => {
    try {
        let { item_id } = req.body;
        const data = await itemModel.findOne({ item_id: item_id }).lean();
        if (!data) {
            res.json({ status: 200, message: "No item found", result: data });
            return;
        }
        if (data) {
            await itemModel.updateOne({ item_id: item_id }, { $set: { status: false } });
            res.json({ status: 200, message: "Successfully delete data" });
        }
    } catch (error) {
        console.log(error);
        res.json({ status: 500, message: "Error while item found" });
    }
})


export { itemRouter };