const Element = require('../models/elementModel');
const elementController = require('../controllers/elementController');

const initializeDatabase = async () => {
  const elementsData = [
    { name: "Aluminium", symbol: "Al", atomicNumber: 13, density: 2.7 },
    { name: "Silicon", symbol: "Si", atomicNumber: 14, density: 2.33 },
    { name: "Manganese", symbol: "Mn", atomicNumber: 25, density: 7.44 },
    { name: "Magnesium", symbol: "Mg", atomicNumber: 12, density: 1.74 },
    { name: "Iron", symbol: "Fe", atomicNumber: 26, density: 7.87 },
    { name: "Copper", symbol: "Cu", atomicNumber: 29, density: 8.92 },
    { name: "Zinc", symbol: "Zn", atomicNumber: 30, density: 7.14 },
    { name: "Nickel", symbol: "Ni", atomicNumber: 28, density: 8.91 },
    { name: "Lead", symbol: "Pb", atomicNumber: 82, density: 11.34 },
    { name: "Titanium", symbol: "Ti", atomicNumber: 22, density: 4.51 },
    { name: "Tin", symbol: "Sn", atomicNumber: 50, density: 7.29 },
    { name: "Chromium", symbol: "Cr", atomicNumber: 24, density: 7.14 },
    { name: "Hydrogen", symbol: "H", atomicNumber: 1, density: 0.07 },
  ];

  try {
    // Check if the elements collection is already populated
    const count = await Element.countDocuments();
    if (count > 0) {
      console.log('Elements collection already populated.');
      return;
    }

    // Add elements one by one using the controller
    for (const elementData of elementsData) {
      const req = { body: elementData }; // Mock request object
      const res = {
        status: (code) => ({
          json: (data) => console.log(`Element added with status ${code}:`, data),
        }),
      };
      await elementController.addElement(req, res);
    }

    console.log('Elements collection initialized successfully.');
  } catch (error) {
    console.error('Error initializing elements collection:', error);
  }
};

module.exports = initializeDatabase;
