const Vendor = require('../model/Vendor');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { response } = require('express');
require('dotenv').config();

const secretKey = process.env.WhatIsYourName;



const vendorRegister = async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log(" Register request:", req.body);

        if (!username || !email || !password) {
            return res.status(400).json({ error: "All fields are required" });
        }

        const existingVendor = await Vendor.findOne({ email });
        if (existingVendor) {
            return res.status(400).json({ error: "Email already taken" });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const newVendor = new Vendor({ username, email, password: hashedPassword });
        await newVendor.save();

        console.log("✅ Vendor registered:", newVendor.email);
        res.status(201).json({ message: "Vendor registered successfully" });

    } catch (error) {
        console.error(" Registration error:", error.message);
        res.status(500).json({ error: "Internal server error", details: error.message });
    }
};






const vendorLogin = async (req, res) => {
    try {
        console.log(" Incoming login request");
        const { email, password } = req.body;
        console.log(" Body received:", req.body);

        if (!email || !password) {
            console.log(" Missing email or password");
            return res.status(400).json({ error: "Email and password are required" });
        }

        const emailToSearch = email.trim().toLowerCase();
        console.log(" Searching for vendor with email:", emailToSearch);

        const vendor = await Vendor.findOne({ email: emailToSearch });
        console.log(" Vendor lookup result:", vendor);

        if (!vendor) {
            console.log(" No vendor found for email:", emailToSearch);
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const isMatch = await bcrypt.compare(password, vendor.password);
        console.log(" Password match result:", isMatch);

        if (!isMatch) {
            return res.status(401).json({ error: "Invalid email or password" });
        }

        const secretKey = process.env.WhatIsYourName;
        console.log("🔑 JWT secret key exists:", !!secretKey);

        if (!secretKey) {
            return res.status(500).json({ error: "Server configuration error: missing JWT_SECRET" });
        }

        const token = jwt.sign({ vendorid: vendor._id }, secretKey, { expiresIn: "1h" });

        console.log("✅ Login successful for:", emailToSearch);
        return res.status(200).json({
            success: "Login successful",
            token,
            vendorId: vendor._id
        });

    } catch (error) {
        console.error(" Uncaught Login Error:", error.message);
        console.error(" Stack Trace:", error.stack);
        return res.status(500).json({ error: "Internal server error", message: error.message });
    }
};




const getALLVendors = async (req, res) => {
    try {
        const vendors = await Vendor.find().populate('firm');
        res.status(200).json({ vendors });
    } catch (error) {
        console.error(" Fetching vendors error:", error.message, error.stack);
        res.status(500).json({ error: "Internal server error" });
    }
};

const getVendorById = async(req,res)=>{
    const vendorId = req.params.id;
    try{
          const vendor = await Vendor.findById(vendorId).populate('firm');
          if(!vendor){
            return res.status(404).json({error:"vendor not found"})
          }

          const vendorFirmId = vendor.firm[0]._id
          response.status(200).json({vendorId,vendorFirmId})
          console.log( vendorFirmId)
    }catch(error){
        console.error(" Fetching vendors error:", error.message, error.stack);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = { vendorRegister, vendorLogin, getALLVendors ,getVendorById};

