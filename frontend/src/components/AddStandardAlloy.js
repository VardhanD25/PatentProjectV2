import React, { useState } from 'react';
import { motion } from 'framer-motion';

const AddStandardAlloy = ({ onClose, onSave }) => {
  const [formData, setFormData] = useState({
    country: '',
    name: '',
    density: '',
    reference: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    const densityNum = parseFloat(formData.density);
    if (isNaN(densityNum)) {
      setError('Density must be a valid number');
      setLoading(false);
      return;
    }

    try {
      const response = await fetch('http://localhost:4000/standardAlloy', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...formData,
          density: densityNum
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to add standard alloy');
      }

      setSuccess('Standard alloy added successfully!');
      setFormData({
        country: '',
        name: '',
        density: '',
        reference: ''
      });
      onSave(data.alloy);
      onClose();
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex justify-center items-center z-50">
      <div className="bg-white/80 p-8 rounded-2xl shadow-lg w-full max-w-3xl mx-4">
        <h2 className="text-4xl font-bold text-black mb-8">Add New Standard Alloy</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-4">
            <label className="text-2xl font-medium text-black">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-6 py-4 rounded-xl bg-white border border-[#163d64]/20 text-2xl text-black placeholder-black/50 focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-colors duration-300"
              placeholder="Enter country name"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="text-2xl font-medium text-black">Alloy Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-6 py-4 rounded-xl bg-white border border-[#163d64]/20 text-2xl text-black placeholder-black/50 focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-colors duration-300"
              placeholder="Enter alloy name"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="text-2xl font-medium text-black">Density (g/cm³)</label>
            <input
              type="number"
              name="density"
              value={formData.density}
              onChange={handleChange}
              step="0.001"
              className="w-full px-6 py-4 rounded-xl bg-white border border-[#163d64]/20 text-2xl text-black placeholder-black/50 focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-colors duration-300"
              placeholder="Enter density"
              required
            />
          </div>

          <div className="space-y-4">
            <label className="text-2xl font-medium text-black">Reference</label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              className="w-full px-6 py-4 rounded-xl bg-white border border-[#163d64]/20 text-2xl text-black placeholder-black/50 focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-colors duration-300"
              placeholder="Enter reference"
              required
            />
          </div>
          
          {error && (
            <p className="text-red-600 text-2xl text-center bg-red-50 py-4 px-6 rounded-xl">{error}</p>
          )}
          {success && (
            <p className="text-green-600 text-2xl text-center bg-green-50 py-4 px-6 rounded-xl">{success}</p>
          )}
          
          <div className="flex justify-end gap-4 pt-8">
            <motion.button
              type="button"
              onClick={onClose}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 text-2xl border-2 border-[#163d64] text-[#163d64] font-medium rounded-xl hover:bg-[#163d64] hover:text-white transition-all duration-300"
            >
              Cancel
            </motion.button>
            <motion.button
              type="submit"
              disabled={loading}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="px-8 py-4 text-2xl bg-[#fa4516] text-white font-medium rounded-xl hover:bg-[#fa4516]/90 transition-all duration-300 shadow-lg hover:shadow-xl disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? 'Adding...' : 'Add Alloy'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStandardAlloy;