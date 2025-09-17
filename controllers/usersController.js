import asyncHandler from "express-async-handler";
import User from "../models/userModel.js";

export const getUsers = asyncHandler(async (req, res) => {
  const users = await User.find({}).select("-password");
  res.status(200).json({
    success: true,
    message: "Successfully get users",
    users,
  });
});

export const createUsers = asyncHandler(async (req, res) => {
  const { name, email, password, role, addresses } = req.body;

  const excitingUser = await User.findOne({ email });
  if (excitingUser) {
    res.status(400);
    throw new Error("User already exist, please login");
  }

  const user = await User.create({
    name,
    email,
    password,
    role,
    addresses: addresses || [],
  });

  if (user) {
    // await Cart.create({ userId: user._id, items: [] });
    res.status(200).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      role: user.role,
      addresses: user.addresses,
    });
  } else {
    res.status(400);
    throw new Error("Invalid user data");
  }
});

export const getUserById = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id).select("-password");

  if (user) {
    res.json(user);
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const updateUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  user.name = req.body.name || user.name;

  if (req.body.password) {
    user.password = req.body.password;
  }

  if (req.body.role) {
    user.role = req.body.role;
  }

  user.addresses = req.body.addresses || user.addresses;

  const updatedUser = await user.save();

  res.status(200).json({
    _id: updatedUser._id,
    name: updatedUser.name,
    password: updatedUser.password,
    avatar: updatedUser.avatar,
    role: updatedUser.role,
    addresses: updatedUser.addresses,
  });
});

export const deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (user) {
    await user.deleteOne();
    res.status(200).json({ message: "User account deleted" });
  } else {
    res.status(404);
    throw new Error("User not found");
  }
});

export const addAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user._id.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You are not authorized to add address to this user");
  }

  const { street, city, country, postalCode, isDefault } = req.body;

  if (!street || !city || !country || !postalCode) {
    res.status(400);
    throw new Error("Please provide all required fields");
  }

  if (isDefault) {
    user.addresses.forEach((address) => (address.isDefault = false));
  }

  if (user.addresses.lenth === 0) {
    user.addresses.push({
      street,
      city,
      country,
      postalCode,
      isDefault: true,
    });
  } else {
    user.addresses.push({
      street,
      city,
      country,
      postalCode,
      isDefault: isDefault || false,
    });
  }

  await user.save();

  res.status(201).json({
    success: true,
    message: "Address added successfully",
    addresses: user.addresses,
  });
});

export const updateAddresses = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user._id.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You are not authorized to add address to this user");
  }

  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  const { street, city, country, postalCode, isDefault } = req.body;
  if (street) address.street = street;
  if (city) address.city = city;
  if (country) address.country = country;
  if (postalCode) address.postalCode = postalCode;

  if (isDefault) {
    user.addresses.forEach((address) => (address.isDefault = false));
  }

  await user.save();

  res.status(201).json({
    success: true,
    message: "Address updated successfully",
    addresses: user.addresses,
  });
});

export const deleteAddress = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error("User not found");
  }

  if (user._id.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error("You are not authorized to add address to this user");
  }

  const address = user.addresses.id(req.params.addressId);

  if (!address) {
    res.status(404);
    throw new Error("Address not found");
  }

  const wasDefault = address.isDefault;
  user.addresses.pull(req.params.addressId);

  if (wasDefault && user.addressess.length > 0) {
    user.addresses[0].isDefault = true;
  }

  await user.save();

  res.status(201).json({
    success: true,
    message: "Address deleteds successfully",
    addresses: user.addresses,
  });
});
