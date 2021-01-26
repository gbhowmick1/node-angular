const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const postsRoutes = require("./routes/posts");

const app = express();
const url =
  "mongodb+srv://goutam123:goutam123@goutambhowmick.pew7f.mongodb.net/node-angular?retryWrites=true&w=majority";

mongoose
  .connect(url, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log("Connected to Database");
  })
  .catch(() => {
    console.log("connection failed!");
  });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use(cors());

app.use("/api/posts",postsRoutes);

module.exports = app;
