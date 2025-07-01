const path = require('path');
const fs = require('fs');
const multer = require('multer');
const Product = require("../model/product"); 
const Firm = require('../model/Firm');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

// Multer setup
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });



const mongoose = require('mongoose');

const addProduct = async (req, res) => {
    try {
        console.log(" Request body:", req.body);
        console.log(" File uploaded:", req.file);
        console.log(" Firm ID:", req.params.firmId);

        const { productName, price, category, bestseller, description } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const firmId = req.params.firmId;

        if (!mongoose.Types.ObjectId.isValid(firmId)) {
            return res.status(400).json({ error: "Invalid firm ID format" });
        }

        // Find firm
        const firm = await Firm.findById(firmId);
        if (!firm) {
            return res.status(404).json({ error: "No firm found" });
        }

        // Create product
        const newProduct = new Product({
            productName,
            price,
            category,
            bestseller,
            description,
            image,
            firm: firm._id
        });

        const savedProduct = await newProduct.save();

        if (!firm.products) firm.products = []; 
        firm.products.push(savedProduct._id);
        await firm.save();

        console.log("✅ Product saved:", savedProduct);
        res.status(200).json(savedProduct);

    } catch (error) {
        console.error(" Error adding product:", error.message);
        console.error(" Stack Trace:", error.stack);
        res.status(500).json({ error: "Internal server error", message: error.message });
    }
};


const getProductByFirm = async(req,res)=>{
    try{
        const firmId = req .params.firmId;
        const firm = await Firm.findById(firmId);

        if(!firm){
            return res.status(404).json({error:"No firm found"});
        }
        const restaurantName = firm.firmName
        const products = await Product.find({firm:firmId});

        res.status(200).json({restaurantName ,products});
    }catch(error){
              console.error(" Error adding product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

const deleteProductById = async(req,res)=>{
    try{
         const productId = req.params.productId;

         const deletedProduct = await Product.findByIdAndDelete(productId);

         if(!deletedProduct){
            return res.status(404).json({error:"No product found"})
         }
    }catch(error){
           console.error(" Error adding product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    addProduct: [upload.single('image'), addProduct],getProductByFirm,deleteProductById
};
