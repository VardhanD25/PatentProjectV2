import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EditStandardAlloy from '../components/EditStandardAlloy';
import AddStandardAlloy from '../components/AddStandardAlloy';

function StandardAlloyManagement() {
  const [alloys, setAlloys] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingAlloy, setEditingAlloy] = useState(null);
  const [addingAlloy, setAddingAlloy] = useState(false);

  const fetchAlloys = async () => {
    try {
      console.log('Fetching all standard alloys');
      const response = await fetch('http://localhost:4000/standardAlloy');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch standard alloys');
      }

      console.log('Fetched standard alloys:', data.alloys);
      setAlloys(data.alloys || []);
    } catch (error) {
      console.error('Error fetching standard alloys:', error);
      setError(`Error fetching standard alloys: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all standard alloys on component mount
  useEffect(() => {
    fetchAlloys();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this standard alloy?')) {
      return;
    }

    try {
      console.log('Deleting standard alloy:', id);
      const response = await fetch(`http://localhost:4000/standardAlloy/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete standard alloy');
      }

      console.log('Standard alloy deleted successfully');
      fetchAlloys(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting standard alloy:', error);
      setError(`Error deleting standard alloy: ${error.message}`);
    }
  };

  const handleEdit = (id) => {
    const alloy = alloys.find(alloy => alloy && alloy._id === id);
    setEditingAlloy(alloy);
  };

  const handleSave = (updatedAlloy) => {
    setAlloys(alloys.map(alloy => (alloy._id === updatedAlloy._id ? updatedAlloy : alloy)));
  };

  const handleAdd = (newAlloy) => {
    fetchAlloys(); // Refresh the list after adding
  };

  return (
    <div className="min-h-screen bg-slate-900">
      <Navbar />

      <div className="absolute inset-0 bg-grid-slate-700/[0.05] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-900 pointer-events-none" />

      <main className="relative container mx-auto px-4 py-32">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <h1 className="text-3xl font-bold text-slate-200 mb-8">Standard Alloy Management</h1>

          {loading && (
            <div className="text-slate-200 text-center py-8">Loading standard alloys...</div>
          )}

          {error && (
            <div className="text-red-400 bg-red-900/20 border border-red-900/50 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {!loading && !error && alloys.length === 0 && (
            <div className="text-slate-200 text-center py-8">No standard alloys found.</div>
          )}

          <div className="flex justify-end mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAddingAlloy(true)}
              className="px-4 py-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30"
            >
              Add Standard Alloy
            </motion.button>
          </div>

          <div className="grid gap-6">
            {alloys.map(alloy => (
              alloy && (
                <motion.div
                  key={alloy._id}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <h2 className="text-xl font-semibold text-slate-200">{alloy.name}</h2>
                      <p className="text-slate-400">Country: {alloy.country}</p>
                      <p className="text-slate-400">Density: {alloy.density}</p>
                      <p className="text-slate-400">Reference: {alloy.reference}</p>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleEdit(alloy._id)}
                        className="px-4 py-2 rounded-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30"
                      >
                        Edit
                      </motion.button>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(alloy._id)}
                        className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
                      >
                        Delete
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              )
            ))}
          </div>
        </motion.div>
      </main>

      {editingAlloy && (
        <EditStandardAlloy
          alloy={editingAlloy}
          onClose={() => setEditingAlloy(null)}
          onSave={handleSave}
        />
      )}

      {addingAlloy && (
        <AddStandardAlloy
          onClose={() => setAddingAlloy(false)}
          onSave={handleAdd}
        />
      )}

      <Footer />
    </div>
  );
}

export default StandardAlloyManagement;