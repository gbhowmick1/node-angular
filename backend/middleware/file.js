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
//Create storage engine
const storage = new GridfsStorage({
  url:
    'mongodb+srv://goutam123:goutam123@goutambhowmick.pew7f.mongodb.net/node-angular?retryWrites=true&w=majority',
  file: (req, file) => {
    return new Promise((resolve, reject) => { 
      crypto.randomBytes(16, (err, buf) => {
        if (err) {
          console.log(err);
          return reject(err);
        }
        const filename = buf.toString('hex') + path.extname(file.originalname);
        const fileInfo = {
          filename: filename,
          bucketName: 'uploads',
        };
        resolve(fileInfo);
      });
    });
  },
});
const upload = multer({ storage });

module.exports = upload.single('image');
