import React, { useState } from 'react';
import { motion } from 'framer-motion';

const EditStandardAlloy = ({ alloy, onClose, onSave }) => {
  const [formData, setFormData] = useState({
    country: alloy.country,
    name: alloy.name,
    density: alloy.density,
    reference: alloy.reference,
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
    setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:4000/standardAlloy/${alloy._id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to update standard alloy');
      }

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
        <h2 className="text-4xl font-bold text-black mb-8">Edit Standard Alloy</h2>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="text-red-600 text-2xl text-center bg-red-50 py-4 px-6 rounded-xl">{error}</p>
          )}

          <div className="space-y-4">
            <label className="text-2xl font-medium text-black">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-6 py-4 rounded-xl bg-white border border-[#163d64]/20 text-2xl text-black placeholder-black/50 focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-colors duration-300"
              placeholder="Enter country name"
            />
          </div>

          <div className="space-y-4">
            <label className="text-2xl font-medium text-black">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-6 py-4 rounded-xl bg-white border border-[#163d64]/20 text-2xl text-black placeholder-black/50 focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-colors duration-300"
              placeholder="Enter alloy name"
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
            />
          </div>

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
              {loading ? 'Saving...' : 'Save Changes'}
            </motion.button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStandardAlloy;