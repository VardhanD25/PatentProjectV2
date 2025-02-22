import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EditPart = ({ part, onSave, onClose }) => {
  const [newPartCode, setNewPartCode] = useState(part.partCode);
  const [newPartName, setNewPartName] = useState(part.partName);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSave = async () => {
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/parts/update-part-fields`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ partCode: part.partCode, newPartCode, newPartName }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update part');
      }

      onSave(data.part);
    } catch (error) {
      setError(`Error updating part: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white/80 p-8 rounded-2xl shadow-lg w-full max-w-3xl mx-4">
        <h2 className="text-4xl font-bold text-black mb-8">Edit Part</h2>
        
        <div className="space-y-6">
          {error && (
            <p className="text-red-600 text-2xl text-center bg-red-50 py-4 px-6 rounded-xl">{error}</p>
          )}

          <div className="space-y-4">
            <label className="text-2xl font-medium text-black">New Part Code</label>
            <input
              type="text"
              value={newPartCode}
              onChange={(e) => setNewPartCode(e.target.value)}
              className="w-full px-6 py-4 rounded-xl bg-white border border-[#163d64]/20 text-2xl text-black placeholder-black/50 focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-colors duration-300"
              placeholder="Enter new part code"
            />
          </div>

          <div className="space-y-4">
            <label className="text-2xl font-medium text-black">New Part Name</label>
            <input
              type="text"
              value={newPartName}
              onChange={(e) => setNewPartName(e.target.value)}
              className="w-full px-6 py-4 rounded-xl bg-white border border-[#163d64]/20 text-2xl text-black placeholder-black/50 focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-colors duration-300"
              placeholder="Enter new part name"
            />
          </div>

          <div className="flex justify-end gap-4 pt-8">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={onClose}
              className="px-8 py-4 text-2xl border-2 border-[#163d64] text-[#163d64] font-medium rounded-xl hover:bg-[#163d64] hover:text-white transition-all duration-300"
            >
              Cancel
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleSave}
              disabled={loading}
              className="px-8 py-4 text-2xl bg-[#fa4516] text-white font-medium rounded-xl hover:bg-[#fa4516]/90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPart;