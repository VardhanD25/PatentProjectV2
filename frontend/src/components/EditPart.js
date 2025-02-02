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
      <div className="bg-white/80 p-8 rounded-2xl shadow-lg w-full max-w-md mx-4">
        <h2 className="text-3xl font-bold mb-6 text-[#163d64]">Edit Part</h2>
        
        <div className="space-y-4">
          {error && (
            <p className="text-red-600 text-sm text-center bg-red-50 py-2 rounded-xl">{error}</p>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#163d64]">New Part Code</label>
            <input
              type="text"
              value={newPartCode}
              onChange={(e) => setNewPartCode(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] placeholder-[#163d64]/50 focus:outline-none focus:border-[#163d64] focus:ring-1 focus:ring-[#163d64] transition-colors duration-300"
              placeholder="Enter new part code"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#163d64]">New Part Name</label>
            <input
              type="text"
              value={newPartName}
              onChange={(e) => setNewPartName(e.target.value)}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] placeholder-[#163d64]/50 focus:outline-none focus:border-[#163d64] focus:ring-1 focus:ring-[#163d64] transition-colors duration-300"
              placeholder="Enter new part name"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-3 border-2 border-[#163d64] text-[#163d64] font-semibold rounded-xl hover:bg-[#163d64] hover:text-white transition-all duration-300"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={loading}
              className="px-6 py-3 bg-[#fa4516] text-white font-semibold rounded-xl hover:bg-[#fa4516]/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EditPart;