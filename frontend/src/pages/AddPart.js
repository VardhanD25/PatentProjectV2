import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

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
    <div className="min-h-screen flex flex-col bg-white font-quicksand text-[#163d64] relative">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#163d640a_1px,transparent_1px),linear-gradient(to_bottom,#163d640a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="fixed inset-0 bg-gradient-to-b from-white via-[#163d64]/5 to-white"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow p-8 mt-[80px] mb-[80px]">
          <div className="max-w-4xl mx-auto">
            <div className="relative">
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-slate-200">
                <h2 className="text-4xl font-bold text-[#163d64] mb-8 text-center">Add Part</h2>
                
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#163d64]">Part Code</label>
                    <input
                      type="text"
                      value={partCode}
                      onChange={(e) => setPartCode(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] placeholder-[#163d64]/50 focus:outline-none focus:border-[#163d64] focus:ring-1 focus:ring-[#163d64] transition-colors duration-300"
                      required
                      placeholder="Enter unique part code"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#163d64]">Part Name</label>
                    <input
                      type="text"
                      value={partName}
                      onChange={(e) => setPartName(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] placeholder-[#163d64]/50 focus:outline-none focus:border-[#163d64] focus:ring-1 focus:ring-[#163d64] transition-colors duration-300"
                      required
                      placeholder="Enter part name"
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-sm font-medium text-[#163d64]">Select Standard Alloy</label>
                    <select
                      value={selectedStandardAlloy}
                      onChange={(e) => setSelectedStandardAlloy(e.target.value)}
                      className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] focus:outline-none focus:border-[#163d64] focus:ring-1 focus:ring-[#163d64] transition-colors duration-300"
                    >
                      <option value="">Select Standard Alloy</option>
                      {standardAlloys.map(alloy => (
                        <option key={alloy._id} value={alloy._id}>
                          {alloy.name}{alloy.country ? ` (${alloy.country})` : ''}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-4">
                    <label className="text-sm font-medium text-[#163d64]">Composition</label>
                    {composition.map((element, index) => (
                      <div key={index} className="space-y-4 p-4 bg-white rounded-xl border border-[#163d64]/20">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div className="space-y-2">
                            <select
                              value={element.symbol}
                              onChange={(e) => handleCompositionChange(index, 'symbol', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] focus:outline-none focus:border-[#163d64] focus:ring-1 focus:ring-[#163d64] transition-colors duration-300"
                              required
                            >
                              <option value="">Select Symbol</option>
                              {elementSymbols
                                .filter((symbol) => !selectedSymbols.has(symbol) || symbol === element.symbol)
                                .map(symbol => (
                                  <option key={symbol} value={symbol}>{symbol}</option>
                                ))
                              }
                            </select>
                          </div>
                          <div className="space-y-2">
                            <input
                              type="number"
                              step="0.01"
                              value={element.percentage}
                              onChange={(e) => handleCompositionChange(index, 'percentage', e.target.value)}
                              className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] focus:outline-none focus:border-[#163d64] focus:ring-1 focus:ring-[#163d64] transition-colors duration-300"
                              placeholder="Percentage"
                              min="0"
                              max="100"
                              required
                            />
                          </div>
                        </div>
                        
                        {index > 0 && (
                          <button
                            type="button"
                            onClick={() => handleRemoveElement(index)}
                            className="px-4 py-2 bg-red-50 text-red-600 rounded-xl hover:bg-red-100 transition-colors duration-300"
                          >
                            Remove Element
                          </button>
                        )}
                      </div>
                    ))}
                    
                    <button
                      type="button"
                      onClick={handleAddElement}
                      className="w-full px-4 py-2 border-2 border-[#163d64] text-[#163d64] font-semibold rounded-xl hover:bg-[#163d64] hover:text-white transition-all duration-300"
                    >
                      Add Element
                    </button>
                  </div>

                  {errorMessage && (
                    <div className="text-red-600 text-sm text-center bg-red-50 py-2 rounded-xl">
                      {errorMessage}
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full px-8 py-4 bg-[#fa4516] text-white font-semibold rounded-xl hover:bg-[#fa4516]/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
                  >
                    Add Part
                  </button>
                </form>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default AddPart;