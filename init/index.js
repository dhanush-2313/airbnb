const mongoose = require("mongoose");
const initData = require("./data.js");
const Listing = require("../models/listing.js");
const User = require('../models/user.js'); // replace with the path to your User model
const dbUrl = process.env.ATLASDB_URL; // for cloud db

// const mongoUrl = "mongodb://localhost:27017/dbUrl";
async function main() {
  await mongoose.connect(dbUrl);
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
  let data = await initData(); // get the data from initData

  // Fetch all users
  const users = await User.find({});
  if (users.length === 0) {
    console.error('No users found');
    return;
  }

  // For each listing, assign a random user's _id to the owner field
  data = data.map((obj) => {
    const randomIndex = Math.floor(Math.random() * users.length);
    return { ...obj, owner: users[randomIndex]._id };
  });

  await Listing.insertMany(data);
};

initDB()
  .then(() => {
    console.log("Database was initialized");
  })
  .catch((err) => {
    console.error(err);
  });
