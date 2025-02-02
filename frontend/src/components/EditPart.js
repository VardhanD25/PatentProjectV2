import React, { useState } from 'react';

const EditPart = ({ part, onSave, onClose }) => {
  const [newPartCode, setNewPartCode] = useState(part.partCode);
  const [newPartName, setNewPartName] = useState(part.partName);
  const [error, setError] = useState(null);

  const handleSave = async () => {
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
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg z-60">
        <h2 className="text-xl font-semibold mb-4">Edit Part</h2>
        {error && <div className="text-red-600 mb-4">{error}</div>}
        <div className="mb-4">
          <label className="block text-gray-700">New Part Code</label>
          <input
            type="text"
            value={newPartCode}
            onChange={(e) => setNewPartCode(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700">New Part Name</label>
          <input
            type="text"
            value={newPartName}
            onChange={(e) => setNewPartName(e.target.value)}
            className="w-full p-2 border border-gray-300 rounded mt-1"
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-300 rounded mr-2"
          >
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditPart;