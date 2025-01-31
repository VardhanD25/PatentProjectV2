import React, { useState } from 'react';

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

    // Validate density is a number
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-bold mb-4">Add New Standard Alloy</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-gray-700">Country</label>
            <input
              type="text"
              name="country"
              value={formData.country}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter country name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Alloy Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter alloy name"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Density (g/cm³)</label>
            <input
              type="number"
              name="density"
              value={formData.density}
              onChange={handleChange}
              step="0.001"
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter density"
              required
            />
          </div>
          <div className="mb-4">
            <label className="block text-gray-700">Reference</label>
            <input
              type="text"
              name="reference"
              value={formData.reference}
              onChange={handleChange}
              className="w-full px-3 py-2 border rounded-lg"
              placeholder="Enter reference"
              required
            />
          </div>
          {error && (
            <p className="text-red-500 text-sm">{error}</p>
          )}
          {success && (
            <p className="text-green-500 text-sm">{success}</p>
          )}
          <div className="flex justify-end gap-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-500 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-lg"
              disabled={loading}
            >
              {loading ? 'Adding...' : 'Add'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddStandardAlloy;