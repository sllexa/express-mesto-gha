const Card = require('../models/card');
const { ERROR_CODE_BAD_REQUEST, ERROR_CODE_NOT_FOUND, ERROR_CODE_INTERNAL_SERVER_ERROR } = require('../utils/errors');

const getCards = async (req, res) => {
  try {
    const cards = await Card.find({});
    res.send(cards);
  } catch (err) {
    res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Не удалось получить карточки' });
  }
};

const createCard = async (req, res) => {
  try {
    const { name, link } = req.body;
    const owner = req.user._id;

    const card = await Card.create({ name, link, owner });
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE_BAD_REQUEST).json({ message: 'Переданы некорректные данные для создания карточки' });
      return;
    }
    res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Не удалось создать карточку' });
  }
};

const deleteCard = async (req, res) => {
  try {
    const { cardId } = req.params;

    const card = await Card.findByIdAndRemove(cardId);
    res.send(card);
  } catch (err) {
    res.status(ERROR_CODE_NOT_FOUND).send({ message: 'Карточки с указанным ID не существует' });
  }
};

const likeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    );
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE_BAD_REQUEST).json({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      return;
    }
    res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Не удалось изменить карточку' });
  }
};

const dislikeCard = async (req, res) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    );
    res.send(card);
  } catch (err) {
    if (err.name === 'CastError') {
      res.status(ERROR_CODE_BAD_REQUEST).json({ message: 'Переданы некорректные данные для постановки/снятии лайка' });
      return;
    }
    res.status(ERROR_CODE_INTERNAL_SERVER_ERROR).send({ message: 'Не удалось изменить карточку' });
  }
};

module.exports = {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
};
