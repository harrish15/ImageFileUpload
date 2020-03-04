const express = require("express");
const router = express.Router();
const mongoose = require("mongoose");
const multer = require("multer");

let product = require("../model/product_model");

const storage = multer.diskStorage({
  destination: function(req, file, cb) {
    cb(null, "./uploads/");
  },
  filename: function(req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage });

router.post(
  "/addProduct",
  upload.single("productImage"),
  async (req, res, next) => {
    let { error } = product.ValidationError(req.body);
    if (error) {
      return res.status(401).send(error.details[0].message);
    }
    let name = await product.productModel.findOne({
      name: req.body.name
    });
    if (name) {
      return res.status(401).send({ message: "Product already exists" });
    }
    let data = new product.productModel({
      name: req.body.name,
      description: req.body.description,
      price: req.body.price
    });
    let items = await data.save();
    res.send({ message: "Product added successfully", data: items });
  }
);

router.put("/updateProduct/:id", async (req, res) => {
  let { error } = product.ProductValidationError(req.body);
  if (error) {
    return res.status(402).send(error.details[0].message);
  }
  let product = await product.productModel.findById({ _id: req.params.id });
  if (!product) {
    return res.status(401).send({ message: "Invalid Product Id" });
  }
  product.name = req.body.name;
  product.image = req.body.image;
  product.description = req.body.description;
  product.price = req.body.price;

  let items = await product.save();

  res.send({ message: "updated successful", data: items });
});

router.get("/allProducts", async (req, res) => {
  let product = await product.productModel.find({});
  res.send(product);
});

router.get("/findProductById/:id", async (req, res) => {
  let prod = await product.productModel.findById({ _id: req.params.id });
  if (!prod) {
    return res.status(401).send("Invalid product id");
  }
  res.send(prod);
});

router.delete("/deleteProductById/:id", async (req, res) => {
  let prod = await product.productModel.findById({ _id: req.params.id });
  if (!prod) {
    return res.status(401).send({ message: "Invalid id" });
  }
  let items = await product.productModel.findByIdAndRemove({
    _id: req.params.id
  });

  let rdata = await items.save();
  res.send({ message: "Removed the product sucessfully", data: rdata });
});

module.exports = router;
