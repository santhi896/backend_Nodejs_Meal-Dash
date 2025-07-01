const mongoose = require('mongoose');
const Firm = require('../model/Firm');
const Vendor = require('../model/Vendor');
const multer = require('multer');
const fs = require('fs');
const path = require('path');

const uploadsDir = path.join(__dirname, '..', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir);
}

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, uploadsDir);
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname) );
    }
});

const upload = multer({ storage: storage });



const addFirm = async (req, res) => {
    try {
        console.log(" Vendor ID from middleware:", req.vendorId);

        const vendor = await Vendor.findById(req.vendorId);
        if (!vendor) {
            return res.status(404).json({ error: "Vendor not found" });
        }

        if (vendor.firm && vendor.firm.length > 0) {
            return res.status(400).json({ message: "Vendor can have only one firm" });
        }

        const { firmName, area, category, region, offer } = req.body;
        const image = req.file ? req.file.filename : undefined;

        const firm = new Firm({
            firmName,
            area,
            category,
            region,
            offer,
            image,
            vendor: vendor._id
        });

        const savedFirm = await firm.save();

        vendor.firm.push(savedFirm._id);
        await vendor.save();

        console.log("✅ Firm created for vendor:", vendor.email);
        return res.status(200).json({ message: "Firm added successfully", firm: savedFirm });

    } catch (error) {
        console.error(" Add Firm Error:", error.message);
        return res.status(500).json({ error: "Internal server error" });
    }
};



const deleteFirmById = async(req,res)=>{
    try{
         const firmId = req.params.firmId;

         const deletedProduct = await Firm.findByIdAndDelete(firId);

         if(!deletedProduct){
            return res.status(404).json({error:"No product found"})
         }
    }catch(error){
           console.error(" Error adding product:", error);
        res.status(500).json({ error: "Internal server error" });
    }
}

module.exports = {
    addFirm: [upload.single('image'), addFirm],deleteFirmById
};
