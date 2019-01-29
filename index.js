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

const TraceModel = mongoose.model("Trace", {
  timeStamp: Number,
  drugId: String,
  command: String,
  changeInfo: String
});

// Add a new drug to stock
app.post("/create", async (req, res) => {
  const drugDb = await DrugModel.findOne({ name: req.body.name });
  if (drugDb) {
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

  const drug = await newDrug.save();

  let drugResponse = {};
  drugResponse.id = drug.id;
  drugResponse.name = drug.name;
  drugResponse.quantity = drug.quantity;

  logEvent(drug.id, "CREATE", JSON.stringify(req.body));

  //JSON.stringify(drugAdded, ['id','name','quantity']);
  res.status(201).json(drugResponse);
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
      logEvent(drug.id, "ADD QTY", `Add ${req.body.quantity} of ${drug.name}`);
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
        logEvent(
          drug.id,
          "REMOVE QTY",
          `Remove ${req.body.quantity} of ${drug.name}`
        );

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
      const previousName = drug.name;
      drug.name = req.body.name;
      await drug.save();
      logEvent(
        drug.id,
        "RENAME",
        `Rename drug ${previousName} by ${drug.name}`
      );
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
      const idDeleted = drug._id;
      const nameDeleted = drug.name;
      drug.remove();
      logEvent(idDeleted, "DELETE", `Delete drug ${drug.name}`);

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

app.get("/history", async (req, res) => {
  const lastEvents = await TraceModel.find()
    .limit(10)
    .sort({ timeStamp: "descending" });
  res.json(lastEvents);
});

const logEvent = (id, action, info) => {
  var tsInMilli = new Date().getTime();
  console.log(`${tsInMilli} : ${id} : ${action} : ${info}`);

  const trace = new TraceModel({
    timeStamp: tsInMilli,
    drugId: id,
    command: action,
    changeInfo: info
  });

  trace.save();
};

// All others routes
app.all("*", function(req, res) {
  sendError(res, "Page not found!", 404);
});

app.listen(3000, () => {
  console.log("<>-(*(*(*(*- Drugs Stock Server started... -*)*)*)*)-<>");
});
