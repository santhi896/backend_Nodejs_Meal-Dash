


const express = require('express');
const router = express.Router();
const { addFirm } = require('../controllers/FirmControllers');
const verifyToken = require('../middlewares/verifyToken');
const FirmControllers = require('../controllers/FirmControllers');

router.post('/add-firm', verifyToken, ...addFirm);

router.get('/uploads/:imageName',(req,res)=>{
    const imageName = req.params.imageName;
    res.headersSent('content-Type','image/jpeg');
    res.sendFile(Path.join(__dirname,'..','uploads',imageName));
});

router.delete('/:firmId',FirmControllers.deleteFirmById);


module.exports = router;


