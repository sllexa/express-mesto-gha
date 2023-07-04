const express = require('express');
const mongoose = require('mongoose');
const routes = require('./routes/routes');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

app.use(express.json());
app.use((req, res, next) => {
  req.user = {
    _id: '6496ce56694cf3596b1535a1',
  };

  next();
});

app.use(routes);
async function start() {
  try {
    await mongoose.connect(MONGO_URL, { useNewUrlParser: true });
    app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
}

start();
