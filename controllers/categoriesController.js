import asyncHandler from "express-async-handler";
import Category from "../models/categoryModel.js";
import cloudinary from "../config/cloudinary.js";

// @desc Get all categories
// @route GET /api/categories
// @access Private

export const getCategories = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const perPage = parseInt(req.query.perPage) || 20;
  const sortOrder = req.query.sortOrder || "asc";

  if (page < 1 || perPage < 1) {
    res.status(400);
    throw new Error("Invalid pagination parameters");
  }
  if (!["asc", "desc"].includes(sortOrder)) {
    res.status(400);
    throw new Error("Sort must be 'asc' or 'desc'");
  }
  const skip = (page - 1) * perPage;
  const total = await Category.countDocuments();
  const sortValue = sortOrder === "asc" ? 1 : -1;
  const categories = await Category.find({})
    .skip(skip)
    .limit(perPage)
    .sort({ name: sortValue });

  const totalPages = Math.ceil(total / perPage);
  res.json({ categories, page, perPage, total, totalPages });
});

export const getCategoryById = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (category) {
    res.json(category);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

export const createCategory = asyncHandler(async (req, res) => {
  const { name, image, categoryType } = req.body;
  if (!name || typeof name !== "string") {
    res.status(400);
    throw new Error("Name is required and should be a string");
  }

  const valideCategoryTypes = ["Featured", "Hot categories", "Top categories"];
  if (categoryType && !valideCategoryTypes.includes(categoryType)) {
    res.status(400);
    throw new Error(
      `Category type must be one of the following: ${valideCategoryTypes.join(
        ", "
      )}`
    );
  }

  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error("category with this name already exists");
  }
  let imageUrl = "";
  if (image) {
    const result = await cloudinary.uploader.upload(image, {
      folder: "admin-dashboard/categories",
    });
    imageUrl = result.secure_url;
  }

  const category = await Category.create({
    name,
    image: imageUrl || undefined,
    categoryType,
  });

  if (category) {
    res.status(201).json(category);
  } else {
    res.status(400);
    throw new Error("Could not create this category");
  }
});

export const updateCategory = asyncHandler(async (req, res) => {
  const { name, image, categoryType } = req.body;

  const valideCategoryTypes = ["Featured", "Hot categories", "Top categories"];
  if (categoryType && !valideCategoryTypes.includes(categoryType)) {
    res.status(400);
    throw new Error(
      `Category type must be one of the following: ${valideCategoryTypes.join(
        ", "
      )}`
    );
  }
  const category = await Category.findById(req.params.id);
  if (category) {
    category.name = name || category.name;
    category.categoryType = categoryType || category.categoryType;

    if (image !== undefined) {
      if (image) {
        const result = await cloudinary.uploader.upload(image, {
          folder: "admin-dashboard/brands",
        });
        category.image = result.secure_url;
      } else {
        category.image = undefined;
      }
    }

    const updateCategory = await category.save();
    res.json(updateCategory);
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (category) {
    await category.deleteOne();
    res.json({ message: "Category removed" });
  } else {
    res.status(404);
    throw new Error("Category not found");
  }
});
