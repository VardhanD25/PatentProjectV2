// src/components/FirstEntry.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import UpdatePart from './UpdatePart';
import UpdateStandardAlloy from './UpdateStandardAlloy';

function FirstEntry({
  partCodes,
  onPartCodeChange,
  partName,
  selectedDate,
  onDateChange,
  singleOrLot,
  onSingleOrLotChange,
  densityType,
  onDensityTypeChange,
  theoreticalDensity,
  attachmentExists,
  onAttachmentExistsChange,
  masterExists,
  onMasterExistsChange,
  masterAttachmentExists,
  onMasterAttachmentExistsChange,
  selectedPartCode,
  onTheoreticalDensityChange
}) {
  const [date, setDate] = useState(selectedDate);
  const [partCode, setPartCode] = useState(selectedPartCode || '');
  const [pieceOrLot, setPieceOrLot] = useState(singleOrLot);
  const [density, setDensity] = useState(densityType);
  const [attachment, setAttachment] = useState(attachmentExists);
  const [master, setMaster] = useState(masterExists);
  const [masterAttachment, setMasterAttachment] = useState(masterAttachmentExists);
  const navigate = useNavigate();
  const [showUpdatePanel, setShowUpdatePanel] = useState(false);
  const [showStandardAlloyPanel, setShowStandardAlloyPanel] = useState(false);


  useEffect(() => {
    setDate(selectedDate);
  }, [selectedDate]);

  useEffect(() => {
    setPieceOrLot(singleOrLot);
  }, [singleOrLot]);

  useEffect(() => {
    setDensity(densityType);
  }, [densityType]);

  useEffect(() => {
    setAttachment(attachmentExists);
  }, [attachmentExists]);

  useEffect(() => {
    setMaster(masterExists);
  }, [masterExists]);

  useEffect(() => {
    setMasterAttachment(masterAttachmentExists);
  }, [masterAttachmentExists]);

  useEffect(() => {
    const fetchSpecifiedDensity = async () => {
      if (density === 'specified' && partCode) {
        try {
          const response = await fetch(`http://localhost:4000/parts/specified-density/${partCode}`);
          const data = await response.json();
          if (data.formattedDensity && data.formattedDensity !== '-1') {
            onDensityTypeChange('specified'); // Ensure density type is set to specified
            // Update theoretical density in parent component
            if (typeof onTheoreticalDensityChange === 'function') {
              onTheoreticalDensityChange(data.formattedDensity);
            }
          }
        } catch (error) {
          console.error('Error fetching specified density:', error);
        }
      }
    };

    fetchSpecifiedDensity();
    
  }, [partCode, density, showStandardAlloyPanel]); // Add showStandardAlloyPanel as dependency

  const handlePartCodeChange = (event) => {
    const code = event.target.value;
    setPartCode(code);
    onPartCodeChange(event);
  };

  const handleDateChange = (event) => {
    const selectedDate = event.target.value;
    setDate(selectedDate);
    onDateChange(selectedDate);
  };

  const handleSingleOrLotChange = (event) => {
    const value = event.target.value;
    setPieceOrLot(value);
    onSingleOrLotChange(value);
  };

  const handleDensityTypeChange = (event) => {
    const value = event.target.value;
    setDensity(value);
    onDensityTypeChange(value);
  };

  const handleAttachmentChange = (event) => {
    const value = event.target.value;
    setAttachment(value);
    onAttachmentExistsChange(value);
  };

  const handleMasterChange = (event) => {
    const value = event.target.value;
    setMaster(value);
    onMasterExistsChange(value);
    if (value === 'no') {
      setMasterAttachment(''); // Clear master attachment field if master sample does not exist
      onMasterAttachmentExistsChange(''); // Ensure the state is updated
    }
  };

  const handleMasterAttachmentChange = (event) => {
    const value = event.target.value;
    setMasterAttachment(value);
    onMasterAttachmentExistsChange(value);
  };

  const handleViewComposition = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowUpdatePanel(true);
  };

  const handleShowStandardAlloy = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setShowStandardAlloyPanel(true);
  };

  const handleRefreshDensity = async (e) => {
    e.preventDefault();
    if (selectedPartCode && densityType === 'calculated') {
      try {
        const response = await fetch(`http://localhost:4000/parts/calculateDensity/${selectedPartCode}`);
        const data = await response.json();
        if (data.formattedDensity) {
          onTheoreticalDensityChange(data.formattedDensity);
        }
      } catch (error) {
        console.error('Error fetching theoretical density:', error);
      }
    }
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-[#163d64]/10">
              <h2 className="text-5xl font-bold text-[#163d64] mb-8 text-center">
                First Entry
              </h2>

              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#163d64]/80">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    className="w-full px-6 py-4 rounded-xl bg-white border border-[#163d64]/10 text-[#163d64] focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#163d64]/80">Part Code</label>
                  <select
                    value={partCode}
                    onChange={handlePartCodeChange}
                    className="w-full px-6 py-4 rounded-xl bg-white border border-[#163d64]/10 text-[#163d64] focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-300"
                    required
                  >
                    <option value="">Select part code</option>
                    {partCodes.map(code => (
                      <option key={code} value={code}>{code}</option>
                    ))}
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#163d64]/80">Part Name</label>
                  <input
                    type="text"
                    value={partName}
                    readOnly
                    className="w-full px-6 py-4 rounded-xl bg-white/50 border border-[#163d64]/10 text-[#163d64]/50 cursor-not-allowed"
                    placeholder="Part name will be autofilled"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#163d64]/80">Single Piece or Lot</label>
                  <select
                    value={pieceOrLot}
                    onChange={handleSingleOrLotChange}
                    className="w-full px-6 py-4 rounded-xl bg-white border border-[#163d64]/10 text-[#163d64] focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-300"
                    required
                  >
                    <option value="">Select option</option>
                    <option value="single">Single Piece</option>
                    <option value="lot">Lot</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#163d64]/80">Calculated Density or Specified Density</label>
                  <select
                    value={density}
                    onChange={handleDensityTypeChange}
                    className="w-full px-6 py-4 rounded-xl bg-white border border-[#163d64]/10 text-[#163d64] focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-300"
                    required
                  >
                    <option value="">Select option</option>
                    <option value="calculated">Calculated Density</option>
                    <option value="specified">Specified Density</option>
                  </select>

                  {density === 'calculated' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-4"
                    >
                      <motion.button
                        onClick={handleViewComposition}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-6 py-4 bg-[#fa4516] text-white font-semibold rounded-xl hover:bg-[#fa4516]/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        View Part Composition
                      </motion.button>
                    </motion.div>
                  )}

                  {density === 'specified' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-4"
                    >
                      <motion.button
                        onClick={handleShowStandardAlloy}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full px-6 py-4 bg-[#fa4516] text-white font-semibold rounded-xl hover:bg-[#fa4516]/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                      >
                        {showStandardAlloyPanel ? 'Hide' : 'Show'} Standard Alloy
                      </motion.button>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#163d64]/80">Theoretical Density</label>
                  <div className="flex items-center space-x-2">
                    <input
                      type="text"
                      value={theoreticalDensity}
                      readOnly
                      className="flex-1 px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64]/75 cursor-not-allowed opacity-75"
                      placeholder="Theoretical density will be autofilled"
                    />
                    <motion.button
                      onClick={handleRefreshDensity}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="p-2 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] hover:bg-[#163d64]/20 hover:text-[#163d64] transition-all duration-300"
                    >
                      <svg 
                        className="w-5 h-5" 
                        fill="none" 
                        viewBox="0 0 24 24" 
                        stroke="currentColor"
                      >
                        <path 
                          strokeLinecap="round" 
                          strokeLinejoin="round" 
                          strokeWidth={2} 
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
                        />
                      </svg>
                    </motion.button>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#163d64]/80">Does the part have attachments?</label>
                  <select
                    value={attachment}
                    onChange={handleAttachmentChange}
                    className="w-full px-6 py-4 rounded-xl bg-white border border-[#163d64]/10 text-[#163d64] focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-300"
                    required
                  >
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold text-[#163d64]/80">Does the master sample exist?</label>
                  <select
                    value={master}
                    onChange={handleMasterChange}
                    className="w-full px-6 py-4 rounded-xl bg-white border border-[#163d64]/10 text-[#163d64] focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-300"
                    required
                  >
                    <option value="">Select option</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                </div>

                {master === 'yes' && (
                  <div className="space-y-2">
                    <label className="text-sm font-semibold text-[#163d64]/80">Does the master sample have attachments?</label>
                    <select
                      value={masterAttachment}
                      onChange={handleMasterAttachmentChange}
                      className="w-full px-6 py-4 rounded-xl bg-white border border-[#163d64]/10 text-[#163d64] focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-300"
                      required
                    >
                      <option value="">Select option</option>
                      <option value="yes">Yes</option>
                      <option value="no">No</option>
                    </select>
                  </div>
                )}
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>

      {showUpdatePanel && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowUpdatePanel(false);
            }
          }}
        >
          <div 
            className="min-h-screen flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
              onClick={(e) => e.stopPropagation()}
            >
              <UpdatePart
                selectedPartCode={partCode}
                onSave={() => setShowUpdatePanel(false)}
                onClose={() => setShowUpdatePanel(false)}
              />
            </motion.div>
          </div>
        </motion.div>
      )}

      {showStandardAlloyPanel && (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 overflow-y-auto"
          onClick={(e) => {
            if (e.target === e.currentTarget) {
              setShowStandardAlloyPanel(false);
            }
          }}
        >
          <div 
            className="min-h-screen flex items-center justify-center p-4"
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              transition={{ type: "spring", duration: 0.5 }}
            >
              <UpdateStandardAlloy
                partCode={partCode}
                onClose={() => setShowStandardAlloyPanel(false)}
                onSave={(newDensity) => {
                  setShowStandardAlloyPanel(false);
                  if (newDensity && typeof onTheoreticalDensityChange === 'function') {
                    onTheoreticalDensityChange(newDensity);
                  }
                }}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </div>
  );
}

export default FirstEntry;