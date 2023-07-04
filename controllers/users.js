const User = require('../models/user');
const { ERROR_CODE_NOT_FOUND, ERROR_CODE_INTERNAL_SERVER_ERROR, ERROR_CODE_BAD_REQUEST } = require('../utils/errors');

const getUsers = async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (err) {
    res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Не удалось получить пользователей' });
  }
};

const getUser = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) {
      res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Пользователь по указанному id не найден' });
      return;
    }
    res.send(user);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные' });
    } else {
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Не удалось найти пользователя' });
    }
  }
};

const createUser = async (req, res) => {
  try {
    const { name, about, avatar } = req.body;
    const user = await User.create({ name, about, avatar });
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_BAD_REQUEST).send({ message: 'Переданы некорректные данные при создании пользователя' });
    } else {
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Не удалось создать пользователя' });
    }
  }
};

const updateUser = async (req, res) => {
  try {
    const { name, about } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { name, about },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_BAD_REQUEST).json({ message: 'Переданы некорректные данные при обновлении профиля' });
    } else {
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Не удалось обновить данные' });
    }
  }
};

const updateAvatar = async (req, res) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    res.send(user);
  } catch (err) {
    if (err.name === 'ValidationError') {
      res.status(ERROR_CODE_BAD_REQUEST).json({ message: 'Переданы некорректные данные при обновлении аватара' });
    } else {
      res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Не удалось обновить данные' });
    }
  }
};

module.exports = {
  getUsers,
  getUser,
  createUser,
  updateUser,
  updateAvatar,
};
