const express = require('express');
const mongoose = require('mongoose');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');
const handelError = require('./middlewares/handelError');
const routes = require('./routes/routes');

const { PORT = 3000, MONGO_URL = 'mongodb://127.0.0.1:27017/mestodb' } = process.env;
const app = express();

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // за 15 минут
  max: 100, // можно совершить максимум 100 запросов с одного IP
});

app.use(helmet());
app.use(limiter);
app.use(cookieParser());
app.use(express.json());
app.use(routes);
app.use(errors());
app.use(handelError);

async function start() {
  try {
    await mongoose.connect(MONGO_URL, { useNewUrlParser: true });
    app.listen(PORT, () => console.log(`App listening on port ${PORT}`));
  } catch (e) {
    console.log(e);
  }
}

start();
