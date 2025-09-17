import asyncHandler from "express-async-handler";
import Brand from "../models/brandModel.js";
import cloudinary from "../config/cloudinary.js";

// @desc Get all brands
// @route GET /api/brands
// @access Private

export const getBrands = asyncHandler(async (req, res) => {
  const brands = await Brand.find({});
  res.json(brands);
});

// @desc Get a brand by ID
// @route POST /api/brands
// @access Private/Admin

export const getBrandById = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);

  if (brand) {
    res.json(brand);
  } else {
    res.status(404);
    throw new Error("Brand not found");
  }
});

// @desc Create a brand
// @route POST /api/brands
// @access Private/Admin

export const createBrand = asyncHandler(async (req, res) => {
  const { name, image } = req.body;

  const brandExists = await Brand.findOne({ name });
  if (brandExists) {
    res.status(400);
    throw new Error("Brand with this name already exists");
  }

  let imageUrl = "";
  if (image) {
    const result = await cloudinary.uploader.upload(image, {
      folder: "admin-dashboard/brands",
    });
    imageUrl = result.secure_url;
  }

  const brand = await Brand.create({ name, image: imageUrl || undefined });

  if (brand) {
    res.status(201).json(brand);
  } else {
    res.status(400);
    throw new Error("Could not create this brand");
  }
});

export const updateBrand = asyncHandler(async (req, res) => {
  const { name, image } = req.body;

  const brand = await Brand.findById(req.params.id);

  if (brand) {
    brand.name = name || brand.name;

    if (image !== undefined) {
      if (image) {
        const result = await cloudinary.uploader.upload(image, {
          folder: "admin-dashboard/brands",
        });
        brand.image = result.secure_url;
      } else {
        brand.image = undefined;
      }
    }

    const updatedBrand = await brand.save();
    res.json(updatedBrand);
  } else {
    res.status(404);
    throw new Error("Brand not found");
  }
});

export const deleteBrand = asyncHandler(async (req, res) => {
  const brand = await Brand.findById(req.params.id);
  if (brand) {
    await brand.deleteOne();
    res.json({ message: "Brand removed" });
  } else {
    res.status(404);
    throw new Error("Brand not found");
  }
});
