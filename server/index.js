const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const userRoutes = require('./routes/User');
const authRoute = require('./routes/Auth');
const taskRoutes = require('./routes/Task');
const cors = require('cors');

const app = express();

mongoose.connect('mongodb://localhost/myapp', {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(()=>{
    console.log("connected successfully");
})
.catch((err)=>{
    console.log("failed to connect", err);
})

app.use(bodyParser.json());

app.use(cors({
  origin: ['http://localhost:3000']
}));

app.use('/users', userRoutes);
app.use("/auth", authRoute);
app.use("/tasks", taskRoutes);
app.listen(process.env.PORT || 4000, () => console.log('Server started'));
