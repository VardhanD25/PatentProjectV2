const express = require('express');
const { addElement, getElements, getElementSymbols, deleteElement } = require('../controllers/elementController');

const router = express.Router();

router.post('/', addElement);
router.get('/', getElements);
router.get('/symbols', getElementSymbols);
router.delete('/:id', deleteElement);

module.exports = router;