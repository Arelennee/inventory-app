import { Router } from "express";
import upload from "../middleware/upload.js";
import {
  getProducts,
  createProduct,
  deleteProduct,
  updateProduct,
} from "../controllers/product.controller.js";
const router = Router();

router.get("/productos", getProducts);
router.post("/productos", upload.single("imagen"), createProduct);
router.put("/productos/:id", upload.single("imagen"), updateProduct);
router.delete("/productos/:id", deleteProduct);

export default router;
