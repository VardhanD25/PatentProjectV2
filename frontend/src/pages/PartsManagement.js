import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function PartsManagement() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedParts, setExpandedParts] = useState(new Set());

  // Get user from localStorage and extract email
  const user = JSON.parse(localStorage.getItem('user'));
  const email = user?.email;
  const [userId, setUserId] = useState('');

  const toggleComposition = (partCode) => {
    setExpandedParts(prev => {
      const newSet = new Set(prev);
      if (newSet.has(partCode)) {
        newSet.delete(partCode);
      } else {
        newSet.add(partCode);
      }
      return newSet;
    });
  };

  // First, fetch userId using email
  useEffect(() => {
    const fetchUserId = async () => {
      if (!email) {
        console.error('No email found in localStorage');
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        console.log('Fetching userId for email:', email);
        const response = await fetch(`http://localhost:4000/user/user-id/${email}`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch userId');
        }

        console.log('Fetched userId:', data.userId);
        setUserId(data.userId);
      } catch (error) {
        console.error('Error fetching user ID:', error);
        setError(`Error fetching user ID: ${error.message}`);
        setLoading(false);
      }
    };

    fetchUserId();
  }, [email]);

  // Then, fetch parts using userId
  useEffect(() => {
    const fetchParts = async () => {
      if (!userId) {
        console.log('No userId available yet');
        return;
      }
      
      try {
        console.log('Fetching parts for userId:', userId);
        const response = await fetch(`http://localhost:4000/parts/user/${userId}/parts`);
        const data = await response.json();
        
        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch parts');
        }

        console.log('Fetched parts with standard alloys:', data.parts);
        setParts(data.parts || []);
      } catch (error) {
        console.error('Error fetching parts:', error);
        setError(`Error fetching parts: ${error.message}`);
      } finally {
        setLoading(false);
      }
    };

    if (userId) {
      fetchParts();
    }
  }, [userId]);

  const handleDelete = async (partCode) => {
    if (!window.confirm('Are you sure you want to delete this part?')) {
      return;
    }

    try {
      console.log('Deleting part:', partCode);
      const response = await fetch(`http://localhost:4000/parts/${partCode}`, {
        method: 'DELETE'
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete part');
      }

      console.log('Part deleted successfully');
      setParts(parts.filter(part => part.partCode !== partCode));
    } catch (error) {
      console.error('Error deleting part:', error);
      setError(`Error deleting part: ${error.message}`);
    }
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
          <h1 className="text-3xl font-bold text-slate-200 mb-8">Parts Management</h1>

          {loading && (
            <div className="text-slate-200 text-center py-8">Loading parts...</div>
          )}

          {error && (
            <div className="text-red-400 bg-red-900/20 border border-red-900/50 rounded-lg p-4 mb-6">
              {error}
            </div>
          )}

          {!loading && !error && parts.length === 0 && (
            <div className="text-slate-200 text-center py-8">No parts found for this user.</div>
          )}

          <div className="grid gap-6">
            {parts.map(part => (
              <motion.div
                key={part.partCode}
                className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-6"
                whileHover={{ scale: 1.01 }}
              >
                <div className="flex justify-between items-start">
                  <div className="flex-grow">
                    <h2 className="text-xl font-semibold text-slate-200">{part.partName}</h2>
                    <p className="text-slate-400">Code: {part.partCode}</p>
                    
                    {part.standardAlloyId ? (
                      <p className="text-slate-400">
                        Standard Alloy: {part.standardAlloyId.name || 'N/A'} 
                        {part.standardAlloyId.country ? ` (${part.standardAlloyId.country})` : ''}
                      </p>
                    ) : (
                      <div className="mt-2">
                        <button
                          onClick={() => toggleComposition(part.partCode)}
                          className="text-blue-400 hover:text-blue-300 flex items-center gap-2"
                        >
                          {expandedParts.has(part.partCode) ? 'Hide' : 'Show'} Composition
                          <svg 
                            className={`w-4 h-4 transform transition-transform ${expandedParts.has(part.partCode) ? 'rotate-180' : ''}`} 
                            fill="none" 
                            stroke="currentColor" 
                            viewBox="0 0 24 24"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                          </svg>
                        </button>
                        
                        {expandedParts.has(part.partCode) && (
                          <ul className="list-disc list-inside mt-2">
                            {part.composition?.map((comp, index) => (
                              <li key={index} className="text-slate-300">
                                {comp.element?.symbol || 'N/A'}: {comp.percentage}%
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    )}
                  </div>

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => handleDelete(part.partCode)}
                    className="px-4 py-2 rounded-lg bg-red-500/20 text-red-300 hover:bg-red-500/30"
                  >
                    Delete
                  </motion.button>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default PartsManagement;