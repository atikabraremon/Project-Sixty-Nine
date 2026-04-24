import mongoose from "mongoose";
import "dotenv/config";
import dotenv from "dotenv";
import bcrypt from "bcrypt";
import dns from "node:dns/promises";
import User from "../models/user.model.js";

dns.setServers(["1.1.1.1", "8.8.8.8"]);

const seedSuperAdmin = async () => {
  try {
    // 1. Database Connection
    await mongoose.connect(`${process.env.MONGODB_URI}/${process.env.DB_NAME}`);
    console.log("📦 Connected to MongoDB for seeding...");

    // 2. Check if Super Admin already exists
    const adminExists = await User.findOne({ role: "super-admin" });

    if (adminExists) {
      console.log("ℹ️  Super Admin already exists. Skipping seed.");
      process.exit(0); // Success exit
    }

    // 4. Create Super Admin
    const superAdmin = new User({
      fullName: "Super Admin",
      username: "root",
      email: "root@exmaple.com",
      password: "123456",
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
