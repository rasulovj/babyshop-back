import asyncHandler from "express-async-handler";
import Product from "../models/productModel.js";
import clodinary from "../config/cloudinary.js";

export const createProduct = asyncHandler(async (req, res) => {
  const {
    name,
    description,
    price,
    category,
    brand,
    image,
    discountPercentage,
    stock,
  } = req.body;

  const productExists = await Product.findOne({ name });
  if (productExists) {
    res.status(400);
    throw new Error("Product with this name already exists");
  }

  //upload image to cl

  const product = await Product.create({
    name,
    description,
    price,
    category,
    brand,
    discountPercentage: discountPercentage || 0,
    stock: stock || 0,
    image: "",
  });

  if (product) {
    res.status(201).json(product);
  } else {
    res.status(400);
    throw new Error("Could not create this project");
  }
});
