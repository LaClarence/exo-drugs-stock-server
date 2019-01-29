const express = require("express");
const app = express();

const bodyParser = require("body-parser");
app.use(bodyParser.json());

// Connection to mongodb
const mongoose = require("mongoose");
mongoose.connect(
  "mongodb://localhost/drugs-stock",
  { useNewUrlParser: true }
);

// Declare models/collections
const DrugModel = mongoose.model("Drug", {
  name: String,
  quantity: Number
});

// Add a new drug to stock
app.post("/create", async (req, res) => {
  const drug = await DrugModel.find({ name: req.body.name });
  if (drug) {
    return res.status(400).json({
      error: {
        message: "Drug already exists"
      }
    });
  }

  const newDrug = new DrugModel({
    name: req.body.name,
    quantity: req.body.quantity
  });

  const drugAdded = await newDrug.save();
  res.status(201).json(drugAdded);
});

// Drugs stock
app.get("/", async (req, res) => {
  const stock = await DrugModel.find();
  res.json(stock);
});

// Increase stock of the stock
app.post("/add", async (req, res) => {
  try {
    const drug = await DrugModel.findById(req.body.id);
    if (drug) {
      drug.quantity += req.body.quantity;
      await drug.save();
      return res.status(202).json({ message: "Quantity updated" });
    } else {
      return res
        .status(204)
        .json({ message: `No drug found with id :"${req.body.id}" ` });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Remove from stock
app.post("/remove", async (req, res) => {
  try {
    const drug = await DrugModel.findById(req.body.id);
    if (drug) {
      if (req.body.quantity > drug.quantity) {
        return res.status(400).json({
          error: {
            message: "Invalid quantity"
          }
        });
      } else {
        drug.quantity -= req.body.quantity;
        drug.save();
        return res.json({ message: "Quantity removed" });
      }
    } else {
      return res
        .status(204)
        .json({ message: `No drug found with id :"${req.body.id}" ` });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Get quantity drugs stock
app.get("/quantity", async (req, res) => {
  const drug = await DrugModel.findOne({ name: req.query.name });
  if (drug) {
    return res.json(drug);
  }
  return res
    .status(204)
    .json({ message: `No drug found with name :"${req.query.name}" ` });
});

// Change name of a drug
app.post("/rename", async (req, res) => {
  try {
    const drug = await DrugModel.findById(req.body.id);
    if (drug) {
      drug.name = req.body.name;
      await drug.save();
      return res.status(202).json({ message: "Name updated" });
    } else {
      return res
        .status(204)
        .json({ message: `No drug found with id :"${req.body.id}" ` });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// Delete a drug from stock
app.post("/delete", async (req, res) => {
  try {
    const drug = await DrugModel.findById(req.body.id);
    if (drug) {
      drug.remove();
      return res.json({ message: "Drug is deleted" });
    } else {
      return res
        .status(204)
        .json({ message: `No drug found with id :"${req.body.id}" ` });
    }
  } catch (error) {
    return res.status(400).json({ error: error.message });
  }
});

// All others routes
app.all("*", function(req, res) {
  sendError(res, "Page not found!", 404);
});

app.listen(3000, () => {
  console.log("<>-(*(*(*(*- Drugs Stock Server started... -*)*)*)*)-<>");
});
