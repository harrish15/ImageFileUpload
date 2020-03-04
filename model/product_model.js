const mongoose = require("mongoose");
const joi = require("@hapi/joi");

let productSchema = new mongoose.Schema({
  name: { type: String, required: true, minlength: 3, maxlength: 30 },
  description: { type: String, required: true, minlength: 3, maxlength: 200 },
  price: { type: Number, required: true, min: 1 }
});

let productModel = mongoose.model("product", productSchema);

function ValidationError(message) {
  let Schema = joi.object().keys({
    name: joi
      .string()
      .required()
      .min(3)
      .max(30),
    description: joi
      .string()
      .required()
      .min(3)
      .max(200),
    price: joi
      .number()
      .required()
      .min(1)
  });
  return Schema.validate(message);
}

module.exports = { productModel, ValidationError };
