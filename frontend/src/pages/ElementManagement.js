import React, { useState, useEffect } from 'react';
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
      const response = await fetch('http://localhost:4000/elements');
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch elements');
      }

      setElements(data || []);
    } catch (error) {
      setError(`Error fetching elements: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchElements();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this element?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:4000/elements/${id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || 'Failed to delete element');
      }

      fetchElements();
    } catch (error) {
      setError(`Error deleting element: ${error.message}`);
    }
  };

  const handleAdd = () => {
    fetchElements();
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
              <h1 className="text-4xl font-bold text-[#163d64]">Element Management</h1>
              <button
                onClick={() => setAddingElement(true)}
                className="px-6 py-3 bg-[#fa4516] text-white font-semibold rounded-xl hover:bg-[#fa4516]/90 transition-all duration-300 shadow-lg hover:shadow-xl hover:-translate-y-0.5 transform"
              >
                Add Element
              </button>
            </div>

            {loading && (
              <div className="text-center py-8 text-[#163d64]">Loading elements...</div>
            )}

            {error && (
              <div className="text-red-600 bg-red-50 rounded-xl p-4 mb-6 text-center">
                {error}
              </div>
            )}

            {!loading && !error && elements.length === 0 && (
              <div className="text-center py-8 text-[#163d64]">No elements found.</div>
            )}

            <div className="space-y-4">
              {elements.map(element => (
                element && (
                  <div
                    key={element._id}
                    className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-6 border border-slate-200"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-grow">
                        <h2 className="text-xl font-semibold text-[#163d64]">{element.name}</h2>
                        <p className="text-[#163d64]/70">Symbol: {element.symbol}</p>
                        <p className="text-[#163d64]/70">Atomic Number: {element.atomicNumber}</p>
                        <p className="text-[#163d64]/70">Density: {element.density}</p>
                      </div>

                      <button
                        onClick={() => handleDelete(element._id)}
                        className="px-4 py-2 rounded-xl bg-red-50 text-red-600 hover:bg-red-100 transition-colors duration-300"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                )
              ))}
            </div>
          </div>
        </main>

        {addingElement && (
          <AddElement
            onClose={() => setAddingElement(false)}
            onSave={handleAdd}
          />
        )}

        <Footer />
      </div>
    </div>
  );
}

export default ElementManagement;