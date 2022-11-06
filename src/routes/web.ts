import { Router } from "express";
import IndexController from "../controllers/index.controller";

const router = Router();
/** Set up your web routes here */
router.get("/", IndexController.index);
router.get("/about", IndexController.about);

export default router;