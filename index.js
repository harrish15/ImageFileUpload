const express = require("express");
const app = express();
const mongoose = require("mongoose");
const product = require("./api/product_api");
let morgan = require("morgan");

let port = process.env.Port || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(morgan("tiny"));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Methods",
    "GET,HEAD,OPTIONS,POST,PUT,PATCH,DELETE"
  );
  res.header(
    "Access-Control-Allow-Headers",
    "Origin,X-Requested-With,Content-Type,x-auth-token,Accept,x-client-key, x-client-token, x-client-secret, Authorization"
  );
  next();
});

mongoose
  .connect("mongodb://localhost/product", { useNewUrlParser: true })
  .then(() => console.log("connected to database"))
  .catch(err => console.log("something went wrong", err));

app.listen(port, () => console.log(`server working on port number: ${port}`));

app.use("/api/", product);
