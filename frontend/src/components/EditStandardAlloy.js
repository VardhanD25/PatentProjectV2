import React, { useState } from 'react';


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
      <div className="bg-white/80 p-8 rounded-2xl shadow-lg w-full max-w-md mx-4">
        <h2 className="text-3xl font-bold mb-6 text-[#163d64]">Edit Standard Alloy</h2>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <p className="text-red-600 text-sm text-center bg-red-50 py-2 rounded-xl">{error}</p>
          )}

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#163d64]">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] placeholder-[#163d64]/50 focus:outline-none focus:border-[#163d64] focus:ring-1 focus:ring-[#163d64] transition-colors duration-300"
              placeholder="Enter country name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#163d64]">Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] placeholder-[#163d64]/50 focus:outline-none focus:border-[#163d64] focus:ring-1 focus:ring-[#163d64] transition-colors duration-300"
              placeholder="Enter alloy name"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#163d64]">Density (g/cm³)</label>
            <input
              type="number"
              name="density"
              value={formData.density}
              onChange={handleChange}
              step="0.001"
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] placeholder-[#163d64]/50 focus:outline-none focus:border-[#163d64] focus:ring-1 focus:ring-[#163d64] transition-colors duration-300"
              placeholder="Enter density"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium text-[#163d64]">Reference</label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] placeholder-[#163d64]/50 focus:outline-none focus:border-[#163d64] focus:ring-1 focus:ring-[#163d64] transition-colors duration-300"
              placeholder="Enter reference"
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
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-[#fa4516] text-white font-semibold rounded-xl hover:bg-[#fa4516]/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
            >
              {loading ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditStandardAlloy;