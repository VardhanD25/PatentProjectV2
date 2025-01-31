import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AddElement from '../components/AddElement';

function ElementManagement() {
  const [elements, setElements] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [addingElement, setAddingElement] = useState(false);

  const fetchElements = async () => {
    try {
      console.log('Fetching all elements');
      const response = await fetch('http://localhost:4000/elements');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch elements');
      }

      console.log('Fetched elements:', data);
      setElements(data || []);
    } catch (error) {
      console.error('Error fetching elements:', error);
      setError(`Error fetching elements: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all elements on component mount
  useEffect(() => {
    fetchElements();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this element?')) {
      return;
    }

    try {
      console.log('Deleting element:', id);
      const response = await fetch(`http://localhost:4000/elements/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete element');
      }

      console.log('Element deleted successfully');
      fetchElements(); // Refresh the list after deletion
    } catch (error) {
      console.error('Error deleting element:', error);
      setError(`Error deleting element: ${error.message}`);
    }
  };

  const handleAdd = (newElement) => {
    fetchElements(); // Refresh the list after adding
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
          <h1 className="text-3xl font-bold text-slate-200 mb-8">Element Management</h1>

          {loading && (
            <div className="text-slate-200 text-center py-8">Loading elements...</div>
          )}

          {error && (
            <div className="text-red-400 bg-red-900/20 border border-red-900/50 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {!loading && !error && elements.length === 0 && (
            <div className="text-slate-200 text-center py-8">No elements found.</div>
          )}

          <div className="flex justify-end mb-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setAddingElement(true)}
              className="px-4 py-2 rounded-lg bg-green-500/20 text-green-300 hover:bg-green-500/30"
            >
              Add Element
            </motion.button>
          </div>

          <div className="grid gap-6">
            {elements.map(element => (
              element && (
                <motion.div
                  key={element._id}
                  className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6"
                  whileHover={{ scale: 1.01 }}
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <h2 className="text-xl font-semibold text-slate-200">{element.name}</h2>
                      <p className="text-slate-400">Symbol: {element.symbol}</p>
                      <p className="text-slate-400">Atomic Number: {element.atomicNumber}</p>
                      <p className="text-slate-400">Density: {element.density}</p>
                    </div>

                    <div className="flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={() => handleDelete(element._id)}
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

      {addingElement && (
        <AddElement
          onClose={() => setAddingElement(false)}
          onSave={handleAdd}
        />
      )}

      <Footer />
    </div>
  );
}

export default ElementManagement;