const mongoose = require('mongoose');
const Grid = require('gridfs-stream');

const url = 'mongodb+srv://goutam123:goutam123@goutambhowmick.pew7f.mongodb.net/node-angular?retryWrites=true&w=majority';

//Create mongo connection
const conn = mongoose.createConnection(url,{
  useNewUrlParser: true,
  useUnifiedTopology: true,
  useCreateIndex: true,
});
//Init gfs
let gfs;
conn.once('open', ()=> {
  //Init stream
  gfs = Grid(conn.db, mongoose.mongo);
  gfs.collection('uploads');
 })

 module.exports = (req, res, next) => {
   gfs.files.find().toArray((err,files) => {
     console.log(files)
     next();
     //res.send({files: files});
     
 })
}