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
    const total = updatedComposition.reduce((sum, item) => sum + (parseFloat(item.percentage) || 0), 0);
    setTotalPercentage(parseFloat(total.toFixed(2)));
  };

  const handleCompositionChange = (index, field, value) => {
    const updatedComposition = [...composition];
  
    if (field === 'elementSymbol') {
      updatedComposition[index] = {
        ...updatedComposition[index],
        element: {
          ...updatedComposition[index].element,
          symbol: value
        }
      };
    } else {
      updatedComposition[index] = { ...updatedComposition[index], [field]: value };
    }
  
    setComposition(updatedComposition);
  
    // Only calculate the total percentage if the field is 'percentage'
    if (field === 'percentage') {
      const updatedCompositionWithNumbers = updatedComposition.map(item => ({
        ...item,
        percentage: parseFloat(item.percentage) || 0
      }));
  
      const total = updatedCompositionWithNumbers.reduce((sum, item) => sum + item.percentage, 0);
      const baseElementIndex = updatedCompositionWithNumbers.findIndex(item => item.isBaseElement);
  
      if (baseElementIndex !== -1) {
        const otherElementsTotal = total - updatedCompositionWithNumbers[baseElementIndex].percentage;
        updatedCompositionWithNumbers[baseElementIndex].percentage = Math.max(0, 100 - otherElementsTotal);
      }
  
      setComposition(updatedCompositionWithNumbers);
      calculateTotalPercentage(updatedCompositionWithNumbers);
    }
  };
  const handleSave = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (Math.abs(totalPercentage - 100) > 0.01) {
      alert('Total percentage must equal 100% before saving.');
      return;
    }

    try {
      const response = await fetch("http://localhost:4000/parts/updatePart", {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partCode: selectedPartCode, composition }),
      });

      const data = await response.json();

      if (response.ok) {
        const densityResponse = await fetch(`http://localhost:4000/parts/calculateDensity/${selectedPartCode}`);
        const densityData = await densityResponse.json();
        
        if (densityResponse.ok) {
          alert('Part updated successfully!');
          onSave(densityData.formattedDensity);
        } else {
          alert('Part updated but failed to recalculate density');
        }
      } else {
        alert(data.message || 'Error updating part');
      }
    } catch (error) {
      alert('Error connecting to server');
    }
  };

  return (
    <div className="fixed inset-0 bg-white-900/90 backdrop-blur-sm flex items-center justify-center z-50" onClick={onClose}>
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        transition={{ duration: 0.2 }}
        className="bg-white rounded-2xl shadow-xl max-w-3xl w-full mx-4 overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
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

        <div className="p-6">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-[#fa4516]"></div>
            </div>
          ) : error ? (
            <div className="text-red-500 text-center py-8 bg-red-50 rounded-xl text-2xl">
              {error}
            </div>
          ) : !part ? (
            <div className="text-black/60 text-center py-8 text-2xl">
              No part found
            </div>
          ) : (
            <div className="space-y-6">
              <h3 className="text-3xl font-medium text-black">
                {part.partName}
              </h3>
              
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#163d64]/10">
                      <th className="text-left py-4 px-6 text-2xl font-medium text-black">Element Symbol</th>
                      <th className="text-left py-4 px-6 text-2xl font-medium text-black">Percentage</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#163d64]/10">
                    {composition.map((item, index) => (
                      <tr key={index}>
                        <td className="py-4 px-6">
                          <input
                            type="text"
                            value={item.element.symbol}
                            onChange={(e) => handleCompositionChange(index, 'elementSymbol', e.target.value)}
                            className="w-full px-6 py-3 rounded-lg bg-white border border-[#163d64]/10 text-black text-2xl focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-300"
                            placeholder="Symbol"
                          />
                        </td>
                        <td className="py-4 px-6">
                        <input
                          type="number"
                          value={item.percentage}
                          onChange={(e) => handleCompositionChange(index, 'percentage', e.target.value)}
                          className="w-full px-6 py-3 rounded-lg bg-white border border-[#163d64]/10 text-black text-2xl focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-300"
                          placeholder="Percentage"
                          min="0"
                          max="100"
                          step="0.01"
                        />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className={`text-center py-4 px-6 rounded-xl text-2xl ${
                Math.abs(totalPercentage - 100) > 0.01
                  ? 'bg-red-50 text-red-500' 
                  : 'bg-green-50 text-green-500'
              }`}>
                Total percentage: {totalPercentage.toFixed(2)}% (must equal 100%)
              </div>

              <div className="flex justify-end gap-4">
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
          )}
        </div>
      </motion.div>
    </div>
  );
};

export default UpdatePart;