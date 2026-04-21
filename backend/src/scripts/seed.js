import mongoose from "mongoose";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import User from "../models/user.model.js";

dotenv.config();

const seedSuperAdmin = async () => {
  try {
    // 1. Database Connection
    await mongoose.connect(process.env.MONGO_URI);
    console.log("📦 Connected to MongoDB for seeding...");

    // 2. Check if Super Admin already exists
    const adminExists = await User.findOne({ role: "super-admin" });

    if (adminExists) {
      console.log("ℹ️  Super Admin already exists. Skipping seed.");
      process.exit(0); // Success exit
    }

    // 3. Hash Password (Securely)
    const hashedPassword = await bcrypt.hash("root", 14);

    // 4. Create Super Admin
    const superAdmin = new User({
      name: "Super Admin",
      username: "root",
      email: "root@9xporn.com",
      password: hashedPassword,
      role: "super-admin",
      isVerified: true,
    });

    await superAdmin.save();

    console.log("✅ Super Admin created successfully!");
    process.exit(0);
  } catch (error) {
    console.error("❌ Seeding failed:", error);
    process.exit(1); // Error exit
  }
};

seedSuperAdmin();
