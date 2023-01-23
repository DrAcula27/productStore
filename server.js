// SETUP
const express = require("express");

const mongoose = require("mongoose");

require("dotenv").config();

const Product = require("./models/product");

const app = express();

app.use(express.json());

app.use(express.urlencoded({ extended: true }));

app.use(express.static("public"));

let connectionString = `mongodb+srv://${process.env.MONGOUSERNAME}:${process.env.MONGOPASSWORD}@mongosetupcluster.muoiuud.mongodb.net/Store?retryWrites=true&w=majority`;

mongoose.set("strictQuery", false);

mongoose.connect(connectionString, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

mongoose.connection.once("open", () => {
  console.log("connected to mongo");
});

// ROUTES
// '/create_product' -> use information from req.body to make a new Product in the collection
app.post("/create_product", async (req, res) => {
  const {
    nameString: name,
    descriptionString: description,
    imageURLString: imageURL,
    priceNumber: price,
    inventoryNumber: inventory,
    isInStockBoolean: isInStock,
  } = req.body;

  let returnedValue = await Product.create({
    name,
    description,
    imageURL,
    price,
    inventory,
    isInStock,
  });

  console.log(returnedValue);

  if (returnedValue) {
    console.log("upload complete");
  }

  res.send(returnedValue);
});

// '/get_products' ->  responds with all Products in the collection
app.get("/get_products", async (req, res) => {
  let response = await Product.find({});

  console.log(response);

  res.json(response);
});

// '/get_specific_product/:product_id' -> responds with one specific Product from the collection
app.get("/get_specific_product/:product_id", async (req, res) => {
  let productToShow = req.params.product_id;

  let regex = new RegExp(["^", productToShow, "$"].join(""), "i");

  let productRes = await Product.find({ name: regex });

  res.json(productRes);
});

// '/update_product' -> use information from req.body to update the specific product
app.post("/update_product", async (req, res) => {
  let response = await Product.findByIdAndUpdate(
    req.body.id,
    { name: req.body.newName },
    { new: true }
  );
  console.log("response from collection", response);
  res.json(response);
});

// '/delete_product' -> delete a product using its id
app.delete("/delete_product", async (req, res) => {
  // frontend: fetch(`http://localhost:5000/delete_product/?idOfProduct=${id}`)
  let productID = req.query.idOfProduct;

  let productResponse = await Product.delete({ _id: productID });

  console.log(`${productResponse}`);

  res.send({ data: `deleted ${productResponse.name}.` });
});

// PORT -> tell server where to listen
app.listen(5000, () => {
  console.log(`Server is Listening on port 5000`);
});
