const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");

const mongoUrl = "mongodb://localhost:27017/wanderLust";
async function main() {
  await mongoose.connect(mongoUrl);
}

main()
  .then(() => {
    console.log("Connected to DB");
  })
  .catch((err) => {
    console.error(err);
  });

const initDB = async () => {
  await Listing.deleteMany({});
  initData.data=initData.data.map((obj)=>({...obj,owner: "664cce6f897f85ddbd667ac6"}));
  await Listing.insertMany(initData.data);
  console.log("data was initialized");
};

initDB();
