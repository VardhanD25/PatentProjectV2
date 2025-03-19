import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

const UpdatePart = ({ selectedPartCode, onSave, onClose }) => {
  const [part, setPart] = useState(null);
  const [composition, setComposition] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [totalPercentage, setTotalPercentage] = useState(0);

  useEffect(() => {
    const fetchPart = async () => {
      try {
        const response = await fetch(`http://localhost:4000/parts/${selectedPartCode}`);
        const data = await response.json();

        if (response.ok) {
          setPart(data.part);
          const initialComposition = data.part.composition.map(item => ({
            ...item,
            element: {
              symbol: item.element.symbol || ''
            }
          })) || [];
          setComposition(initialComposition);
          calculateTotalPercentage(initialComposition);
        } else {
          setError(data.message || 'Error fetching part data');
        }
      } catch (error) {
        setError('Error connecting to server');
      } finally {
        setLoading(false);
      }
    };

    fetchPart();
  }, [selectedPartCode]);

  const calculateTotalPercentage = (updatedComposition) => {
    const total = updatedComposition.reduce((sum, item) => 
      sum + (parseFloat(item.percentage) || 0), 0);
    setTotalPercentage(parseFloat(total.toFixed(2)));
  };

  const handleCompositionChange = (index, field, value) => {
    const newComposition = [...composition];
  
    if (field === 'elementSymbol') {
      newComposition[index] = {
        ...newComposition[index],
        element: {
          ...newComposition[index].element,
          symbol: value,
        },
      };
      setComposition(newComposition);
    } else if (field === 'percentage') {
      const newPercentage = value === '' ? '' : parseFloat(value); // Allow empty input
      if (newPercentage < 0 || newPercentage > 100) {
        return; // Prevent invalid percentages
      }
  
      newComposition[index] = {
        ...newComposition[index],
        percentage: value, // Temporarily store raw input
      };
  
      const totalPercentage = newComposition.reduce(
        (sum, el, i) => sum + (i === 0 ? 0 : parseFloat(el.percentage || 0)),
        0
      );
  
      newComposition[0] = {
        ...newComposition[0],
        percentage: Math.max(0, 100 - totalPercentage).toFixed(2), // Format base element
      };
  
      setComposition(newComposition);
      calculateTotalPercentage(newComposition);
    }
  };

  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();

    // Validation: Ensure total composition percentages add up to 100
    if (Math.abs(totalPercentage - 100) > 0.01) {
      alert('Total composition percentage must equal 100%.');
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/parts/updatePart", {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          partCode: selectedPartCode, 
          composition: composition.map(item => ({
            ...item,
            percentage: parseFloat(item.percentage).toFixed(2)
          }))
        }),
      });

      if (response.ok) {
        onSave();
      } else {
        const errorData = await response.json();
        alert(errorData.message || 'Error updating part');
      }
    } catch (error) {
      alert('Error connecting to server');
    }
  };

  return (
    <>
      {/* Dark overlay */}
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[150]" onClick={onClose} />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center z-[200]"> {/* Increased z-index significantly */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.2 }}
          className="bg-white rounded-2xl shadow-xl max-w-[98%] w-[1800px] mx-4 overflow-hidden h-[95vh] flex flex-col"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="p-6 border-b border-[#163d64]/10">
            <div className="flex justify-between items-center">
              <h2 className="text-4xl font-bold text-black">Update Part Composition</h2>
              <button
                onClick={onClose}
                className="text-black/60 hover:text-black transition-colors duration-300"
              >
                <svg className="w-8 h-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>

          <div className="flex-1 overflow-hidden flex flex-col">
            <div className="p-6 overflow-y-auto flex-1">
              {loading ? (
                <div className="flex justify-center items-center py-6">
                  <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#fa4516]"></div>
                </div>
              ) : error ? (
                <div className="text-red-500 text-center py-4 bg-red-50 rounded-xl text-2xl">
                  {error}
                </div>
              ) : !part ? (
                <div className="text-black/60 text-center py-4 text-2xl">
                  No part found
                </div>
              ) : (
                <div className="space-y-6">
                  <h3 className="text-3xl font-medium text-black">
                    {part.partName}
                  </h3>
                  
                  {/* Scrollable list container */}
                  <div className="border border-[#163d64]/10 rounded-xl overflow-hidden">
                    {/* Header row */}
                    <div className="grid grid-cols-2 gap-4 p-4 bg-[#163d64]/5 border-b border-[#163d64]/10">
                      <div className="text-2xl font-semibold text-black">Element Symbol</div>
                      <div className="text-2xl font-semibold text-black">Percentage</div>
                    </div>
                    
                    {/* Scrollable content */}
                    <div className="overflow-y-auto">
    {composition.map((item, index) => (
      <div
        key={index}
        className="grid grid-cols-2 gap-4 p-4 border-b border-[#163d64]/10 hover:bg-gray-50 transition-colors duration-200"
      >
        <div>
          <input
            type="text"
            value={item.element.symbol}
            onChange={(e) => handleCompositionChange(index, 'elementSymbol', e.target.value)}
            className="w-full px-4 py-3 rounded-lg bg-white border border-[#163d64]/10 text-2xl text-black focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-300"
            placeholder="Symbol"
          />
        </div>
        <div className="flex items-center space-x-2">
          <input
            type="number"
            value={item.percentage}
            onChange={(e) => handleCompositionChange(index, 'percentage', e.target.value)}
            onBlur={() => {
              const newComposition = [...composition];
              newComposition[index].percentage = parseFloat(newComposition[index].percentage || 0).toFixed(2); // Format on blur
              setComposition(newComposition);
            }}
            className="w-full px-4 py-3 rounded-lg bg-white border border-[#163d64]/10 text-2xl text-black focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-300"
            placeholder="Percentage"
            min="0"
            max="100"
            step="0.01"
          />
          <span className="text-2xl text-black/60">%</span>
        </div>
      </div>
    ))}
  </div>
                  </div>
                </div>
              )}
            </div>

            <div className="border-t border-[#163d64]/10 bg-white p-6">
              <div className={`text-center py-4 px-6 rounded-xl text-2xl mb-4 ${
                Math.abs(totalPercentage - 100) > 0.01
                  ? 'bg-red-50 text-red-500' 
                  : 'bg-green-50 text-green-500'
              }`}>
                Total percentage: {totalPercentage.toFixed(2)}% (must equal 100%)
              </div>

              <div className="flex justify-start gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={onClose}
                  className="px-8 py-4 text-2xl border-2 border-[#163d64] text-[#163d64] rounded-xl font-medium hover:bg-[#163d64] hover:text-white transition-all duration-300"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSave}
                  className="px-8 py-4 text-2xl bg-[#fa4516] text-white rounded-xl font-medium hover:bg-[#fa4516]/90 transition-all duration-300"
                >
                  Save Changes
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </>
  );
};

export default UpdatePart;