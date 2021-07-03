const Post = require('../models/post');

const mongoose = require('mongoose');
const path = require('path');
const multer = require('multer');
const crypto = require('crypto');
const GridfsStorage = require('multer-gridfs-storage');
const Grid = require('gridfs-stream');
//const methodOverride = require('method-override');

const url =
  'mongodb+srv://goutam123:goutam123@goutambhowmick.pew7f.mongodb.net/node-angular?retryWrites=true&w=majority';

const MIME_TYPE_MAP = {
  'image/png': 'png',
  'image/jpeg': 'jpg',
  'image/jpg': 'jpg',
};
//Create mongo connection
const conn = mongoose.createConnection(url, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
//Init gfs
let gfs;
conn.once('open', () => {
  //Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
});

exports.getImage = (req, res) => {
  gfs.files.findOne({ filename: req.params.filename }, (err, file) => {
    if (!file || file.length === 0) {
      return res.status(404).json({ err: 'No File Exists' });
    } else {
      // Check if is image
      if (
        file.contentType === 'image/jpeg' ||
        file.contentType === 'image/png'
      ) {
        // Read output to broswer
        const readstream = gfs.createReadStream(file.filename);
        readstream.pipe(res);
      } else {
        res.status(404).json({ err: 'Not and image' });
      }
    }
  });
};

exports.createPost = (req, res, next) => {
  
  const post = new Post({
    title: req.body.title,
    content: req.body.content,
    imagePath: req.file.filename,
    creator: req.userData.userId,
  });
  post
    .save()
    .then((createdPost) => {
      res.status(201).json({
        message: 'Post added successfully',
        post: {
          ...createdPost,
          id: createdPost._id,
        },
      });
    })
    .catch((error) => {
      res.status(500).json({ message: 'Creating a post failed !' });
    });
};

exports.updatePost = (req, res, next) => {
  const post = new Post({
    _id: req.body.id,
    title: req.body.title,
    content: req.body.content,
    imagePath: req.file.filename,
    creator: req.userData.userId,
  });

  Post.updateOne({ _id: req.params.id, creator: req.userData.userId }, post)
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Update Successful!' });
      } else {
        res.status(401).json({ message: 'User Not Authorized!' });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: "Couldn't update post!",
      });
    });
};

exports.getPosts = (req, res, next) => {
  const pageSize = +req.query.pagesize;
  const currentPage = +req.query.page;
  const postQuery = Post.find();
  let fetchedPosts;
  if (pageSize && currentPage) {
    postQuery.skip(pageSize * (currentPage - 1)).limit(pageSize);
  }
  postQuery
    .then((documents) => {
      fetchedPosts = documents;
      return Post.countDocuments();
    })
    .then((count) => {
      //console.log(this.files)
      res.status(200).json({
        message: 'Posts Fetched Successfully',
        posts: fetchedPosts,
        maxPosts: count,
        file: this.files,
      });
    })
    .catch((error) => {
      res.send(500).json({
        message: 'Fetching posts falied',
      });
    });
};

exports.getPost = (req, res, next) => {
  Post.findById(req.params.id)
    .then((post) => {
      if (post) {
        res.status(200).json(post);
      } else {
        res.status(404).json({ message: 'Post not found!' });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Fetching post failed ',
      });
    });
};

exports.deletePost = (req, res, next) => {
  Post.deleteOne({ _id: req.params.id, creator: req.userData.userId })
    .then((result) => {
      if (result.n > 0) {
        res.status(200).json({ message: 'Post Deleted Successfully' });
      } else {
        res.status(401).json({ message: 'Not Authorized ' });
      }
    })
    .catch((error) => {
      res.status(500).json({
        message: 'Deleting post failed',
      });
    });
};
