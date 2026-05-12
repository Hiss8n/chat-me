import jwt from "jsonwebtoken";
import User from "../models/User.js";
import bcrypt from "bcryptjs";
import dotenv from "dotenv";
import cloudinary from "../utils/cloudinary.js";
dotenv.config({ quiet: true });

const generateToken = (userId) => {
  const token = jwt.sign({ userId }, process.env.JWT_SECRET, {
    expiresIn: "7d",
  });
  return token;
};

const register = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    if (!name || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    const existUser = await User.findOne({ email });
    if (existUser) {
      return res
        .status(400)
        .json({ message: "user with same email already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
    });

    await user.save();

    const token = await generateToken(user._id);

    res.status(201).json({
      message: "Registered successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
      },
    });
  } catch (error) {
    console.log("Internal server error", error);
  }
};

const login = async (req, res) => {
  const { email, password } = req.body;

 
  if (!email.trim() || !password.trim()) {
    return res.status(400).json({ message: "Invalid email or password" });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ message: "Not found,register to continue" });
    }
    const salt = await bcrypt.genSalt(10);

    const comparedPassword = await bcrypt.compare(password, user.password);
    console.log("me pass cred", comparedPassword);

    if (!comparedPassword) {
      return res.status(400).json({ message: "Invalid credentials entered" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      message: "login successfully",
      token,
      user: {
        _id: user._id,
        name: user.name,
      },
    });
  } catch (error) {
    console.log("Internal server error", error);
  }
};

const getUsersForSideBar = async (req, res) => {
  const userId = req.user;
 
  try {
    const users = await User.find({ _id: { $ne: userId } }).select("-password");

    if (!users) {
      return res.status(400).json({ message: "no users yet,add contacts" });
    }

    res.status(200).json(users);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "can not get users" });
  }
};

const getSingleUser = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await User.find({ _id: id }).select("-password");
    if (!user) {
      return res.status(400).json({ message: "no such user found!" });
    }

    res.status(200).json(user);
  } catch (error) {
    console.log(error);
  }
};

const uploadProfile = async (req, res) => {
  const { image } = req.body;

  const id = req.user;
  console.log("updating image");
  console.log(id);
  try {
    if (!id) {
      return res.status(400).json({ message: "You are not registered" });
    }

    const user = await User.findOne({ _id: id });
    if (!user) {
      return res.status(400).json({ message: "You are not signed up yet" });
    }

    let imageUrl;
    if (!image) {
      return res.status(400).json({ message: "please select an image" });
    }

    const profileImage = await cloudinary.uploader.upload(image);

    imageUrl = profileImage.secure_url;

    const updateUser = await User.findByIdAndUpdate(
      id,
      { profilePic: imageUrl },
      { new: true },
    );
    res.status(201).json(updateUser);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "error updating" });
  }
};

export { register, login, getUsersForSideBar, getSingleUser, uploadProfile };
