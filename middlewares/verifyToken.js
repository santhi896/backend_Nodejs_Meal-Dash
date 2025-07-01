

const Vendor = require('../model/Vendor');

const jwt =  require('jsonwebtoken');

const dotEnv =  require('dotenv')

dotEnv.config()

const secretKey = process.env.WhatIsYourName



const verifyToken = async (req, res, next) => {
    const token = req.headers.token;

    if (!token) {
        return res.status(401).json({ error: "Token is required" });
    }

    try {
        const decoded = jwt.verify(token, secretKey);

        if (!decoded.vendorid) {
            return res.status(401).json({ error: "Invalid token payload: vendorid missing" });
        }

        const vendor = await Vendor.findById(decoded.vendorid);
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        req.vendorId = vendor._id;
        next();
    } catch (error) {
        console.error("❌ Token verification failed:", error.message);
        return res.status(401).json({ error: "Invalid or expired token" });
    }
};

module.exports = verifyToken;

