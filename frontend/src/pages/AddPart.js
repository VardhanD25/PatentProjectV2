import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import { motion } from 'framer-motion';
import CustomDropdown from '../components/CustomDropdown';

const AddPart = () => {
  const [partCode, setPartCode] = useState('');
  const [partName, setPartName] = useState('');
  const [composition, setComposition] = useState([{ symbol: '', percentage: 0 }]);
  const [errorMessage, setErrorMessage] = useState('');
  const [existingPartCodes, setExistingPartCodes] = useState([]);
  const [userId, setUserId] = useState('');
  const [elementSymbols, setElementSymbols] = useState([]);
  const [selectedSymbols, setSelectedSymbols] = useState(new Set());
  const [standardAlloys, setStandardAlloys] = useState([]);
  const [selectedStandardAlloy, setSelectedStandardAlloy] = useState('');
  const navigate = useNavigate();

  const getEmailFromLocalStorage = () => {
    const user = localStorage.getItem('user');
    if (user) {
      const userData = JSON.parse(user);
      return userData.email;
    }
    return null;
  };

  const email = getEmailFromLocalStorage();

  // Fetch user ID based on email
  useEffect(() => {
    const fetchUserId = async () => {
      if (email) {
        try {
          const response = await fetch(`http://localhost:4000/user/user-id/${email}`);
          const data = await response.json();
          setUserId(data.userId);
        } catch (error) {
          console.error('Error fetching user ID:', error);
        }
      }
    };

    fetchUserId();
  }, [email]);

  // Fetch existing part codes for the user
  useEffect(() => {
    const fetchPartCodes = async () => {
      if (userId) {
        try {
          const response = await fetch(`http://localhost:4000/parts/part-codes/${userId}`);
          const data = await response.json();
          setExistingPartCodes(data.partCodes);
        } catch (error) {
          console.error('Error fetching part codes:', error);
        }
      }
    };

    fetchPartCodes();
  }, [userId]);

  // Fetch element symbols for the dropdown
  useEffect(() => {
    const fetchElementSymbols = async () => {
      try {
        const response = await fetch('http://localhost:4000/elements/symbols');
        const data = await response.json();
        setElementSymbols(data.symbols);
      } catch (error) {
        console.error('Error fetching element symbols:', error);
      }
    };

    fetchElementSymbols();
  }, []);

  // Fetch standard alloys for the dropdown
  useEffect(() => {
    const fetchStandardAlloys = async () => {
      try {
        const response = await fetch('http://localhost:4000/standardAlloy/');
        const data = await response.json();
        setStandardAlloys(data.alloys);
      } catch (error) {
        console.error('Error fetching standard alloys:', error);
      }
    };

    fetchStandardAlloys();
  }, []);

  const handleAddElement = () => {
    setComposition([...composition, { symbol: '', percentage: 0 }]);
  };

  const handleRemoveElement = (index) => {
    const newComposition = [...composition];
    const removedSymbol = newComposition[index].symbol;
    newComposition.splice(index, 1);
    setComposition(newComposition);

    if (removedSymbol) {
      setSelectedSymbols((prevSymbols) => {
        const updatedSymbols = new Set(prevSymbols);
        updatedSymbols.delete(removedSymbol);
        return updatedSymbols;
      });
    }
  };

  const handleCompositionChange = (index, field, value) => {
    const newComposition = [...composition];
    const oldSymbol = newComposition[index].symbol;

    if (field === 'symbol') {
      if (oldSymbol && oldSymbol !== value) {
        setSelectedSymbols((prevSymbols) => {
          const updatedSymbols = new Set(prevSymbols);
          updatedSymbols.delete(oldSymbol);
          return updatedSymbols;
        });
      }

      if (value && !selectedSymbols.has(value)) {
        setSelectedSymbols((prevSymbols) => new Set(prevSymbols.add(value)));
      }
    }

    newComposition[index][field] = field === 'percentage' ? parseFloat(value) || 0 : value;

    if (field === 'percentage') {
      const totalPercentage = newComposition.reduce((sum, el, i) => sum + (i === 0 ? 0 : parseFloat(el.percentage || 0)), 0);
      newComposition[0].percentage = Math.max(0, 100 - totalPercentage); // Adjust the first element
    }

    setComposition(newComposition);
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    setErrorMessage(''); // Clear any previous error messages

    // Validation: Ensure part code is unique
    if (existingPartCodes.includes(partCode)) {
      setErrorMessage('Part code already exists. Please enter a unique part code.');
      return;
    }

    // Validation: Ensure all elements in composition have a symbol
    const hasUnselectedSymbols = composition.some((el) => !el.symbol);
    if (hasUnselectedSymbols) {
      setErrorMessage('All elements must have a selected symbol.');
      return;
    }

    // Validation: Ensure total composition percentages add up to 100
    const totalPercentage = composition.reduce((sum, el) => sum + (el.percentage || 0), 0);
    if (totalPercentage - 100 > 0.01) {
      setErrorMessage('Total composition percentage must equal 100%.');
      return;
    }

    // Proceed with submission
    try {
      const response = await fetch('http://localhost:4000/parts/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          partCode,
          partName,
          userId,
          standardAlloyId: selectedStandardAlloy || undefined,
          composition: composition.length > 0 ? composition : undefined,
        }),
      });

      if (response.ok) {
        // Reset form fields after successful submission
        setPartCode('');
        setPartName('');
        setComposition([{ symbol: '', percentage: 0 }]);
        setSelectedSymbols(new Set());
        setSelectedStandardAlloy('');
        setErrorMessage('');
        alert('Part created successfully!');
        navigate('/userinput');
      } else {
        const errorData = await response.json();
        setErrorMessage(errorData.message || 'An error occurred.');
      }
    } catch (error) {
      console.error(error);
      setErrorMessage('Internal server error.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-quicksand text-slate-200">
      {/* Background with Grid */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="fixed inset-0 bg-gradient-to-r from-slate-950/0 via-slate-100/5 to-slate-950/0"
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Main Content */}
        <main className="flex-grow p-8 mt-[140px] mb-[80px]">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-4xl mx-auto"
          >
            {/* Form Card */}
            <div className="relative">
              {/* Decorative glow effect */}
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-100/10 to-slate-400/10 rounded-2xl blur-lg" />
              
              <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
                <h2 className="text-3xl font-bold text-slate-200 mb-8 text-center">Add Part</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  {/* Part Code Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Part Code</label>
                    <input
                      type="text"
                      value={partCode}
                      onChange={(e) => setPartCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-colors duration-300"
                      required
                      placeholder="Enter unique part code"
                    />
                  </div>

                  {/* Part Name Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Part Name</label>
                    <input
                      type="text"
                      value={partName}
                      onChange={(e) => setPartName(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 placeholder-slate-400 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-colors duration-300"
                      required
                      placeholder="Enter part name"
                    />
                  </div>

                  {/* Standard Alloy Selection */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">Select Standard Alloy</label>
                    <CustomDropdown
                      label="Select Standard Alloy"
                      value={selectedStandardAlloy}
                      onChange={(e) => setSelectedStandardAlloy(e.target.value)}
                      options={standardAlloys.map(alloy => ({
                        value: alloy._id,
                        label: `${alloy.name}${alloy.country ? ` (${alloy.country})` : ''}`
                      }))}
                      placeholder="Select Standard Alloy"
                    />
                  </div>

                  {/* Composition */}
                  <div className="space-y-4">
                    <label className="text-sm font-medium text-slate-300">Composition</label>
                    {composition.map((element, index) => (
                      <div key={index} className="space-y-4 p-4 bg-slate-800/30 rounded-lg border border-slate-700/50">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <CustomDropdown
                              value={element.symbol}
                              onChange={(e) => handleCompositionChange(index, 'symbol', e.target.value)}
                              options={elementSymbols
                                .filter((symbol) => !selectedSymbols.has(symbol) || symbol === element.symbol)
                                .map(symbol => ({ value: symbol, label: symbol }))}
                              placeholder="Select Symbol"
                              required
                            />
                          </div>
                          <div className="space-y-2">
                            <input
                              type="number"
                              step="0.01"
                              value={element.percentage}
                              onChange={(e) => handleCompositionChange(index, 'percentage', e.target.value)}
                              className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-colors duration-300"
                              placeholder="Percentage"
                              min="0"
                              max="100"
                              required
                            />
                          </div>
                        </div>
                        
                        {index > 0 && (
                          <motion.button
                            type="button"
                            onClick={() => handleRemoveElement(index)}
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="px-4 py-2 bg-red-500/20 text-red-400 rounded-lg hover:bg-red-500/30 transition-colors duration-300"
                          >
                            Remove Element
                          </motion.button>
                        )}
                      </div>
                    ))}
                    
                    <motion.button
                      type="button"
                      onClick={handleAddElement}
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full px-4 py-2 bg-slate-700/50 text-slate-200 rounded-lg hover:bg-slate-700/70 transition-colors duration-300"
                    >
                      Add Element
                    </motion.button>
                  </div>

                  {/* Error Message */}
                  {errorMessage && (
                    <motion.div
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-400 text-sm text-center bg-red-500/10 py-2 rounded-lg"
                    >
                      {errorMessage}
                    </motion.div>
                  )}

                  {/* Submit Button */}
                  <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="w-full px-6 py-3 bg-slate-200 text-slate-900 rounded-lg font-semibold hover:bg-white transition-all duration-300"
                  >
                    Add Part
                  </motion.button>
                </form>
              </div>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AddPart;