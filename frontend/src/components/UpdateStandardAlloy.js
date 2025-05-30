import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

function UpdateStandardAlloy({ partCode, onClose, onSave }) {
  const [standardAlloys, setStandardAlloys] = useState([]);
  const [selectedAlloy, setSelectedAlloy] = useState('');
  const [currentAlloy, setCurrentAlloy] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch part details with populated standardAlloyId
        const partResponse = await fetch(`http://localhost:4000/parts/${partCode}`);
        const partData = await partResponse.json();

        // If part has a standardAlloyId, it will already be populated
        if (partData.part && partData.part.standardAlloyId) {
          setCurrentAlloy(partData.part.standardAlloyId);
        }

        // Fetch all available standard alloys
        const alloysResponse = await fetch('http://localhost:4000/standardAlloy/');
        const alloysData = await alloysResponse.json();
        setStandardAlloys(alloysData.alloys);
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load data');
      }
    };

    if (partCode) {
      fetchData();
    }
  }, [partCode]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!selectedAlloy) {
      setError('Please select an alloy');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:4000/parts/${partCode}/standardAlloy`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          standardAlloyId: selectedAlloy
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update standard alloy');
      }

      const data = await response.json();
      
      if (data.part) {
        setCurrentAlloy(data.part.standardAlloyId);
        onSave(true); // Pass true to indicate successful update
      }
    } catch (error) {
      console.error('Error updating standard alloy:', error);
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-[#163d64]/10 max-w-7xl w-full">
      <div className="space-y-6">
        <h2 className="text-4xl font-bold text-black mb-6">Update Standard Alloy</h2>

        <div className="grid grid-cols-2 gap-8">
          {/* Current Standard Alloy Display */}
          <div className="space-y-4">
            <h3 className="text-3xl font-semibold text-black">Current Standard Alloy</h3>
            {currentAlloy ? (
              <div className="bg-[#163d64]/5 rounded-xl p-6 border border-[#163d64]/10">
                <p className="text-2xl text-black">
                  {currentAlloy.name}
                  {currentAlloy.reference && ` (${currentAlloy.reference})`}
                </p>
                {currentAlloy.density && (
                  <p className="text-2xl text-black/70 mt-3">
                    Density: {currentAlloy.density} g/cm³
                  </p>
                )}
              </div>
            ) : (
              <p className="text-2xl text-black/70">No standard alloy currently assigned</p>
            )}
          </div>

          {/* Select New Standard Alloy */}
          <div className="space-y-4">
            <label className="text-3xl font-semibold text-black">
              Select New Standard Alloy
            </label>
            <select
              value={selectedAlloy}
              onChange={(e) => {
                setSelectedAlloy(e.target.value);
                setError('');
              }}
              className="w-full px-6 py-4 rounded-xl bg-white border border-[#163d64]/10 text-2xl text-black focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-300"
            >
              <option value="">Select Standard Alloy</option>
              {standardAlloys
                .filter(alloy => alloy._id !== currentAlloy?._id)
                .map(alloy => (
                  <option key={alloy._id} value={alloy._id}>
                    {`${alloy.name}${alloy.reference ? ` (${alloy.reference})` : ''}${alloy.density ? ` - ${alloy.density} g/cm³` : ''}`}
                  </option>
                ))}
            </select>
          </div>
        </div>

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="p-6 bg-red-50 border border-red-200 rounded-xl"
          >
            <p className="text-red-600 text-2xl">{error}</p>
          </motion.div>
        )}

        <div className="flex justify-end gap-4 mt-6">
          <motion.button
            type="button"
            onClick={onClose}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 text-2xl rounded-xl border-2 border-[#163d64] text-[#163d64] font-medium hover:bg-[#163d64] hover:text-white transition-all duration-300"
          >
            Cancel
          </motion.button>
          <motion.button
            type="submit"
            disabled={loading || !selectedAlloy || selectedAlloy === currentAlloy?._id}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="px-8 py-4 text-2xl bg-[#fa4516] text-white font-medium rounded-xl hover:bg-[#fa4516]/90 
              transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Updating...' : 'Update'}
          </motion.button>
        </div>
      </div>
    </form>
  );
}

export default UpdateStandardAlloy;