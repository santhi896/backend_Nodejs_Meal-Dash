const express = require("express");

const dotEnv = require('dotenv')

const mongoose = require('mongoose')

const vendorRoutes = require('./routes/vendorRoutes')

const bodyParser  =  require('body-parser');

const firmRoutes = require('./routes/firmRoutes')

const productRoutes = require('./routes/productRoutes');

const cors = require('cors');

const path = require('path');

const app = express();

const PORT = process.env.PORT || 4000;

// dotEnv.config();

require('dotenv').config();

app.use(cors())


mongoose.connect(process.env.MONGO_URI)
.then(()=>console.log("mongodb connected succesfully"))
.catch((error)=>console.log(error))

app.use(bodyParser.json());

app.use('/vendor',vendorRoutes);

app.use('/firm',firmRoutes)

app.use('/product',productRoutes);

app.use('/uploads',express.static('uploads'));

app.use(cors())

// Basic route
app.use('/home', (req, res) => {
  res.send("<h1>Welcome to Swiggy</h1>");
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server started and running at http://localhost:${PORT}`);
});
