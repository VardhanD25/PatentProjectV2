import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import EditPart from '../components/EditPart';

function PartsManagement() {
  const [parts, setParts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedParts, setExpandedParts] = useState(new Set());
  const [editingPart, setEditingPart] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));
  const email = user?.email;
  const [userId, setUserId] = useState('');

  const toggleComposition = (partCode) => {
    setExpandedParts((prev) => {
      const newSet = new Set(prev);
      if (newSet.has(partCode)) {
        newSet.delete(partCode);
      } else {
        newSet.add(partCode);
      }
      return newSet;
    });
  };

  useEffect(() => {
    const fetchUserId = async () => {
      if (!email) {
        setError('User not logged in');
        setLoading(false);
        return;
      }

      try {
        const response = await fetch(`http://localhost:4000/user/user-id/${email}`);
        const data = await response.json();

        if (!response.ok) {
          throw new Error(data.message || 'Failed to fetch userId');
        }

        setUserId(data.userId);
      } catch (error) {
        setError(`Error fetching user ID: ${error.message}`);
        setLoading(false);
      }
    };

    fetchUserId();
  }, [email]);

  const fetchParts = async () => {
    if (!userId) return;

    try {
      const response = await fetch(`http://localhost:4000/parts/user/${userId}/parts`);
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch parts');
      }

      setParts(data.parts || []);
    } catch (error) {
      setError(`Error fetching parts: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchParts();
  }, [userId]);

  const handleDelete = async (partCode) => {
    if (!window.confirm('Are you sure you want to delete this part?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/parts/delete/${partCode}`, {
        method: 'DELETE',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete part');
      }

      setParts(parts.filter((part) => part.partCode !== partCode));
    } catch (error) {
      setError(`Error deleting part: ${error.message}`);
    }
  };

  const handleEdit = (part) => {
    setEditingPart(part);
  };

  const handleSave = async (updatedPart) => {
    await fetchParts(); // Re-fetch parts after saving
    setEditingPart(null);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-quicksand text-[#163d64] relative">
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#163d640a_1px,transparent_1px),linear-gradient(to_bottom,#163d640a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="fixed inset-0 bg-gradient-to-b from-white via-[#163d64]/5 to-white"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        <main className="flex-grow p-8 mt-[80px] mb-[80px]">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-[#163d64] mb-8 text-center">Parts Management</h1>

            {loading && (
              <div className="text-center py-8 text-[#163d64]">Loading parts...</div>
            )}

            {error && (
              <div className="text-red-600 bg-red-50 rounded-xl p-4 mb-6 text-center">
                {error}
              </div>
            )}

            {!loading && !error && parts.length === 0 && (
              <div className="text-center py-8 text-[#163d64]">No parts found for this user.</div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {parts.map((part) => (
                <div
                  key={part.partCode}
                  className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-slate-200"
                >
                  <div className="flex justify-between items-start">
                    <div className="flex-grow">
                      <h2 className="text-3xl font-semibold text-[#163d64]">{part.partName}</h2>
                      <p className="text-[#163d64]/70">Code: {part.partCode}</p>

                      {part.standardAlloyId ? (
                        <p className="text-[#163d64]/70">
                          Standard Alloy: {part.standardAlloyId.name || 'N/A'}
                          {part.standardAlloyId.country ? ` (${part.standardAlloyId.country})` : ''}
                        </p>
                      ) : (
                        <div className="mt-2">
                          <button
                            onClick={() => toggleComposition(part.partCode)}
                            className="text-[#fa4516] hover:text-[#fa4516]/80 flex items-center gap-2"
                          >
                            {expandedParts.has(part.partCode) ? 'Hide' : 'Show'} Composition
                            <svg
                              className={`w-4 h-4 transform transition-transform ${
                                expandedParts.has(part.partCode) ? 'rotate-180' : ''
                              }`}
                              fill="none"
                              stroke="currentColor"
                              viewBox="0 0 24 24"
                            >
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                            </svg>
                          </button>

                          {expandedParts.has(part.partCode) && (
                            <ul className="list-disc list-inside mt-2 space-y-1">
                              {part.composition?.map((comp, index) => (
                                <li key={index} className="text-[#163d64]">
                                  {comp.element?.symbol || 'N/A'}: {comp.percentage}%
                                </li>
                              ))}
                            </ul>
                          )}
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col space-y-2">
                      <button
                        onClick={() => handleEdit(part)}
                        className="px-4 py-2 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition-colors duration-300"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(part.partCode)}
                        className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {editingPart && (
        <EditPart
          part={editingPart}
          onSave={handleSave}
          onClose={() => setEditingPart(null)}
        />
      )}
    </div>
  );
}

export default PartsManagement;