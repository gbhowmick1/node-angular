const express = require('express');
const cors = require('cors');
const path = require('path');
const mongoose = require('mongoose');

const postsRoutes = require('./routes/posts');
const userRoutes = require('./routes/user');

const app = express();

const url =
'mongodb+srv://goutam123:goutam123@goutambhowmick.pew7f.mongodb.net/node-angular?retryWrites=true&w=majority';


mongoose
  .connect(url, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex: true,
  })
  .then(() => {
    console.log('Connected to Database');
  })
  .catch(() => {
    console.log('connection failed!');
  });
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use('/images', express.static(path.join(__dirname, 'images')));
// app.use('/', express.static(path.join(__dirname, './angular')));

// app.get("/", (req,res)=>{
//   res.send("Hello...")
// })
app.use(cors()); 

app.use('/api/posts', postsRoutes);
app.use('/api/user', userRoutes);




// app.use((req, res, next) => {
//   res.sendFile(path.join(__dirname, 'angular', 'index.html'));
// });

module.exports = app;





