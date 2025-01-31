import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import CustomDropdown from './CustomDropdown';

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
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Current Standard Alloy Display */}
      <div className="mb-4">
        <h3 className="text-sm font-medium text-slate-300 mb-2">Current Standard Alloy</h3>
        {currentAlloy ? (
          <div className="bg-slate-800/50 rounded-lg p-3 border border-slate-700/50">
            <p className="text-slate-200">
              {currentAlloy.name}
              {currentAlloy.country && ` (${currentAlloy.country})`}
            </p>
            {currentAlloy.density && (
              <p className="text-slate-400 text-sm mt-1">
                Density: {currentAlloy.density} g/cm³
              </p>
            )}
          </div>
        ) : (
          <p className="text-slate-400">No standard alloy currently assigned</p>
        )}
      </div>

      {/* Select New Standard Alloy */}
      <div className="space-y-2">
        
        <CustomDropdown
          label="Select New Standard Alloy"
          value={selectedAlloy}
          onChange={(e) => {
            setSelectedAlloy(e.target.value);
            setError('');
          }}
          options={standardAlloys
            .filter(alloy => alloy._id !== currentAlloy?._id)
            .map(alloy => ({
              value: alloy._id,
              label: `${alloy.name}${alloy.country ? ` (${alloy.country})` : ''}${alloy.density ? ` - ${alloy.density} g/cm³` : ''}`
            }))}
          placeholder="Select Standard Alloy"
        />
      </div>

      {error && (
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-red-400 text-sm bg-red-500/10 p-2 rounded"
        >
          {error}
        </motion.p>
      )}

      <div className="flex justify-end gap-4 mt-6">
        <motion.button
          type="button"
          onClick={onClose}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 rounded-lg bg-slate-800/50 text-slate-300 hover:bg-slate-800/70 transition-colors duration-300"
        >
          Cancel
        </motion.button>
        <motion.button
          type="submit"
          disabled={loading || !selectedAlloy || selectedAlloy === currentAlloy?._id}
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 
            transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Updating...' : 'Update'}
        </motion.button>
      </div>
    </form>
  );
}

export default UpdateStandardAlloy;