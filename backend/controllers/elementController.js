const Element = require('../models/elementModel');
const mongoose = require('mongoose');

const addElement = async (req, res) => {
  const { name, symbol, atomicNumber, density } = req.body;

  let emptyFields = [];

  if (!name) {
    emptyFields.push('name');
  }
  if (!symbol) {
    emptyFields.push('symbol');
  }
  if (!atomicNumber) {
    emptyFields.push('atomicNumber');
  }
  if (!density) {
    emptyFields.push('density');
  }
  try {
    const elementData = { name, symbol, atomicNumber, density };

    const element = await Element.create(elementData);
    res.status(200).json(element);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const getElements = async (req, res) => {
  try {
    const elements = await Element.find({});
    res.status(200).json(elements);
  } catch (error) {
    console.error('Error fetching elements:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getElementSymbols = async (req, res) => {
  try {
    const elements = await Element.find({}, { symbol: 1, _id: 0 });
    const symbols = elements.map(element => element.symbol);
    res.status(200).json({ symbols });
  } catch (error) {
    console.error('Error fetching element symbols:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const deleteElement = async (req, res) => {
  const { id } = req.params;

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(404).json({ error: 'No such element' });
  }

  const element = await Element.findByIdAndDelete(id);

  if (!element) {
    return res.status(404).json({ error: 'No such element' });
  }

  res.status(200).json({ message: 'Element deleted successfully' });
};

module.exports = {
  addElement,
  getElements,
  getElementSymbols,
  deleteElement
};