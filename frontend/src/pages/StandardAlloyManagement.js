import React, { useState, useEffect } from 'react';
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
      const response = await fetch('http://localhost:4000/standardAlloy');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch standard alloys');
      }

      setAlloys(data.alloys || []);
    } catch (error) {
      setError(`Error fetching standard alloys: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlloys();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this standard alloy?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/standardAlloy/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete standard alloy');
      }

      fetchAlloys();
    } catch (error) {
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

  const handleAdd = () => {
    fetchAlloys();
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
            <div className="flex justify-between items-center mb-8">
              <h1 className="text-3xl font-bold text-[#163d64]">Standard Alloy Management</h1>
              <button
                onClick={() => setAddingAlloy(true)}
                className="px-6 py-3 bg-[#fa4516] text-white font-semibold rounded-xl hover:bg-[#fa4516]/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
              >
                Add Standard Alloy
              </button>
            </div>

            {loading && (
              <div className="text-center py-8 text-[#163d64]">Loading standard alloys...</div>
            )}

            {error && (
              <div className="text-red-600 bg-red-50 rounded-xl p-4 mb-6 text-center">
                {error}
              </div>
            )}

            {!loading && !error && alloys.length === 0 && (
              <div className="text-center py-8 text-[#163d64]">No standard alloys found.</div>
            )}

            <div className="grid grid-cols-2 gap-4">
              {alloys.map(alloy => (
                alloy && (
                  <div
                    key={alloy._id}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-slate-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <h2 className="text-3xl font-semibold text-[#163d64]">{alloy.name}</h2>
                        <p className="text-[#163d64]/70">Country: {alloy.country}</p>
                        <p className="text-[#163d64]/70">Density: {alloy.density}</p>
                        <p className="text-[#163d64]/70">Reference: {alloy.reference}</p>
                      </div>

                      <div className="flex gap-2">
                        <button
                          onClick={() => handleEdit(alloy._id)}
                          className="px-4 py-2 rounded-xl bg-[#163d64]/10 text-[#163d64] hover:bg-[#163d64]/20 transition-colors duration-300"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDelete(alloy._id)}
                          className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-300"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
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
    </div>
  );
}

export default StandardAlloyManagement;