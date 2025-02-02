// src/components/FirstEntry.jsx
import React, { useState, useEffect } from 'react';
import Navbar from '../components/Navbar'; 
import Footer from '../components/Footer'; 
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import UpdatePart from './UpdatePart';
import UpdateStandardAlloy from './UpdateStandardAlloy';
import CustomDropdown from './CustomDropdown';
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
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-slate-200">
              <h2 className="text-4xl font-bold text-[#163d64] mb-8 text-center">First Entry</h2>

              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#163d64]">Date</label>
                  <input
                    type="date"
                    value={date}
                    onChange={handleDateChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] focus:outline-none focus:border-[#163d64] focus:ring-1 focus:ring-[#163d64] transition-colors duration-300"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#163d64]">Part Code</label>
                  <CustomDropdown
                    value={partCode}
                    onChange={handlePartCodeChange}
                    options={partCodes.map(code => ({ value: code, label: code }))}
                    placeholder="Select part code"
                    required={true}
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#163d64]">Part Name</label>
                  <input
                    type="text"
                    value={partName}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64]/70 cursor-not-allowed"
                    placeholder="Part name will be autofilled"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#163d64]">Single Piece or Lot</label>
                  <CustomDropdown
                    label="Single Piece or Lot"
                    value={pieceOrLot}
                    onChange={handleSingleOrLotChange}
                    options={[
                      { value: "single", label: "Single Piece" },
                      { value: "lot", label: "Lot" }
                    ]}
                    placeholder="Select option"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#163d64]">Calculated Density or Specified Density</label>
                  <CustomDropdown
                    label="Calculated Density or Specified Density"
                    value={density}
                    onChange={handleDensityTypeChange}
                    options={[
                      { value: "calculated", label: "Calculated Density" },
                      { value: "specified", label: "Specified Density" }
                    ]}
                    placeholder="Select option"
                    required
                  />

                  {density === 'calculated' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-2"
                    >
                      <motion.button
                        onClick={handleViewComposition}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full group relative px-4 py-2.5 bg-white rounded-lg border border-slate-200 hover:bg-slate-200 transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-100/0 via-slate-100/5 to-slate-100/0 rounded-lg" />
                        <div className="flex items-center justify-center space-x-2">
                          <svg 
                            className="w-4 h-4 text-slate-300 group-hover:text-black transition-colors duration-300" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="text-slate-300 group-hover:text-black font-medium transition-colors duration-300">
                            View Part Composition
                          </span>
                        </div>
                      </motion.button>
                    </motion.div>
                  )}

                  {density === 'specified' && (
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="mt-2"
                    >
                      <motion.button
                        onClick={handleShowStandardAlloy}
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="w-full group relative px-4 py-2.5 bg-white rounded-lg border border-slate-200 hover:bg-slate-200 transition-all duration-300"
                      >
                        <div className="absolute inset-0 bg-gradient-to-r from-slate-100/0 via-slate-100/5 to-slate-100/0 rounded-lg" />
                        <div className="flex items-center justify-center space-x-2">
                          <svg 
                            className="w-4 h-4 text-slate-300 group-hover:text-black transition-colors duration-300" 
                            fill="none" 
                            viewBox="0 0 24 24" 
                            stroke="currentColor"
                          >
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                          </svg>
                          <span className="text-slate-300 group-hover:text-black font-medium transition-colors duration-300">
                            {showStandardAlloyPanel ? 'Hide' : 'Show'} Standard Alloy
                          </span>
                        </div>
                      </motion.button>
                    </motion.div>
                  )}
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#163d64]">Theoretical Density</label>
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
                  <label className="text-sm font-medium text-[#163d64]">Does the part have attachments?</label>
                  <CustomDropdown
                    label="Does the part have attachments?"
                    value={attachment}
                    onChange={handleAttachmentChange}
                    options={[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" }
                    ]}
                    placeholder="Select option"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#163d64]">Does the master sample exist?</label>
                  <CustomDropdown
                    label="Does the master sample exist?"
                    value={master}
                    onChange={handleMasterChange}
                    options={[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" }
                    ]}
                    placeholder="Select option"
                    required
                  />
                </div>

                {master === 'yes' && (
                  <CustomDropdown
                    label="Does the master sample have attachments?"
                    value={masterAttachment}
                    onChange={handleMasterAttachmentChange}
                    options={[
                      { value: "yes", label: "Yes" },
                      { value: "no", label: "No" }
                    ]}
                    placeholder="Select option"
                    required
                  />
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