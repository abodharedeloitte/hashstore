import express from "express";
const router = express.Router();
import { userRouter } from "./userRouting";
import { itemRouter } from "./itemsRouting";
import { transactionRouter } from "./transaction";

router.use('/user', userRouter);
router.use('/items', itemRouter);
router.use('/transaction', transactionRouter);

export default router;