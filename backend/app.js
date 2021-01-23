const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const Post = require("./models/post");

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

app.post("/api/posts", (req, res, next) => {
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
  });
  post.save().then((postData) => {
    res.status(201).json({
      postId: postData._id,
    });
  });
});

app.put("/api/posts/:id", (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
  });
  Post.updateOne({ _id: req.params.id }, post).then((result) => {
    res.status(200).json({ message: "Update Successful!" });
  });
});

app.get("/api/postsss", (req, res, next) => {
  Post.find().then((documents) => {
    // console.log("from app.js");
    // console.log(documents);
    res.status(200).json({
      message: "Posts Fetched Successfully",
      posts: documents,
    });
  });
});

app.delete("/api/posts/:id", (req, res, next) => {
  console.log(req.params.id);
  Post.deleteOne({ _id: req.params.id }).then((result) => {
    // console.log("post Deleted");
    res.status(200).json({ message: "Post deleted from app.js" });
  });
});

module.exports = app;
