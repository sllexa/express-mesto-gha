const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const errMongo = require('mongoose').Error;
const User = require('../models/user');
const { CREATE_CODE_SUCCESS } = require('../utils/constants');

const BadRequestError = require('../utils/errors/BadRequestError');
const ConflictError = require('../utils/errors/ConflictError');

const { NODE_ENV, JWT_SECRET = 'dev-secret' } = process.env;

const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    if (!email || !password) {
      throw new BadRequestError('Поля email и password обязательны.');
    }
    const hash = await bcrypt.hash(password, 10);
    await User.create({
      name, about, avatar, email, password: hash,
    });
    res.status(CREATE_CODE_SUCCESS).send({
      data: {
        name, about, avatar, email,
      },
      message: 'Пользователь успешно создан',
    });
  } catch (err) {
    if (err.code === 11000) {
      next(new ConflictError('Пользователь с данным email уже зарегистрирован'));
    } else if (err instanceof errMongo.ValidationError) {
      next(new BadRequestError('Переданы некорректные данные при создании пользователя'));
    } else {
      next(err);
    }
  }
};

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findUserByCredentials(email, password);
    const token = jwt.sign({ _id: user._id }, NODE_ENV === 'production' ? JWT_SECRET : 'dev-secret', { expiresIn: '7d' });
    res.cookie('token', token, { httpOnly: true, sameSite: true });
    res.send({ token });
  } catch (err) {
    if (err instanceof errMongo.ValidationError) {
      next(new BadRequestError('Переданы некорректные данные'));
    } else {
      next(err);
    }
  }
};

module.exports = { createUser, login };
