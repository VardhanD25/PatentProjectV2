// src/components/SecondEntry.jsx
import React, { useEffect } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';

function SecondEntry({ 
  attachmentExists, 
  masterExists, 
  masterAttachmentExists,
  attachmentMassAir,
  attachmentMassFluid,
  masterSampleMassAir,
  masterSampleMassFluid,
  densityMasterSample,
  onAttachmentMassAirChange, 
  onAttachmentMassFluidChange,
  onMasterSampleMassAirChange,
  onMasterSampleMassFluidChange,
  onDensityMasterSampleChange,
  massOfFluid,
  volumeOfFluid,
  densityOfFluid,
  onMassOfFluidChange,
  onVolumeOfFluidChange,
  onDensityOfFluidChange,
 
}) {
  const navigate = useNavigate();

  useEffect(() => {
    if (massOfFluid && volumeOfFluid && volumeOfFluid !== '0') {
      const density = (massOfFluid / volumeOfFluid).toFixed(2);
      onDensityOfFluidChange(density);
    } else {
      onDensityOfFluidChange('');
    }
  }, [massOfFluid, volumeOfFluid, onDensityOfFluidChange]);

  useEffect(() => {
    if (masterExists === 'yes') {
      const fetchDensityOfMasterSample = async () => {
        if (masterSampleMassAir && masterSampleMassFluid) {
          try {
            const response = await fetch(`http://localhost:4000/parts/master-sample-density?masterSampleMassAir=${masterSampleMassAir}&attachmentMassAir=${attachmentMassAir}&masterSampleMassFluid=${masterSampleMassFluid}&attachmentMassFluid=${attachmentMassFluid}&densityOfFluid=${densityOfFluid}&masterAttachmentExists=${masterAttachmentExists}`);
            const data = await response.json();
            onDensityMasterSampleChange(data.density || '0');
          } catch (error) {
            console.error('Error fetching master sample density:', error);
            onDensityMasterSampleChange('0');
          }
        }
      };
  
      fetchDensityOfMasterSample();
    } else {
      onDensityMasterSampleChange('0');
    }
  }, [masterExists, masterSampleMassAir, masterSampleMassFluid, masterAttachmentExists, attachmentMassAir, attachmentMassFluid, densityOfFluid, onDensityMasterSampleChange]);

  const handleMassOfFluidChange = (event) => {
    const value = event.target.value;
    onMassOfFluidChange(value);
  };

  const handleVolumeOfFluidChange = (event) => {
    const value = event.target.value;
    onVolumeOfFluidChange(value);
  };

  const handleAttachmentMassAirChange = (event) => {
    const value = event.target.value;
    onAttachmentMassAirChange(value);
  };

  const handleAttachmentMassFluidChange = (event) => {
    const value = event.target.value;
    onAttachmentMassFluidChange(value);
  };

  const handleMasterSampleMassAirChange = (event) => {
    const value = event.target.value;
    onMasterSampleMassAirChange(value);
  };

  const handleMasterSampleMassFluidChange = (event) => {
    const value = event.target.value;
    onMasterSampleMassFluidChange(value);
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-950 font-quicksand text-slate-200">
      {/* Background with Grid */}
      <div className="fixed inset-0 bg-gradient-to-b from-slate-950 to-slate-900">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <motion.div
          animate={{
            opacity: [0.3, 0.5, 0.3],
            scale: [1, 1.1, 1],
          }}
          transition={{ duration: 8, repeat: Infinity }}
          className="fixed inset-0 bg-gradient-to-r from-slate-950/0 via-slate-100/5 to-slate-950/0"
        />
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />

        {/* Main Content with Side Navigation */}
        <main className="flex-grow flex items-center justify-center p-8 mt-[140px] mb-[100px]">
          

          {/* Form Content */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="w-full max-w-2xl"
          >
            <div className="relative">
              <div className="absolute -inset-1 bg-gradient-to-r from-slate-100/10 to-slate-400/10 rounded-2xl blur-lg" />
              
              <div className="relative bg-slate-900/50 backdrop-blur-xl rounded-2xl border border-slate-700/50 p-8">
                <h2 className="text-3xl font-bold text-slate-200 mb-8 text-center">Second Entry Screen</h2>
                
                <form className="space-y-6">
                  {/* Mass of Fluid Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Mass of Fluid (grams)
                    </label>
                    <input
                      type="number"
                      value={massOfFluid}
                      onChange={handleMassOfFluidChange}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-colors duration-300"
                      placeholder="Enter mass of fluid"
                      min="0"
                      step="any"
                    />
                  </div>

                  {/* Volume of Fluid Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Volume of Fluid (cm³)
                    </label>
                    <input
                      type="number"
                      value={volumeOfFluid}
                      onChange={handleVolumeOfFluidChange}
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-colors duration-300"
                      placeholder="Enter volume of fluid"
                      min="0"
                      step="any"
                    />
                  </div>

                  {/* Density of Fluid Field */}
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-slate-300">
                      Density of Fluid (grams/cm³)
                    </label>
                    <input
                      type="text"
                      value={densityOfFluid}
                      readOnly
                      className="w-full px-4 py-3 rounded-lg bg-slate-800/30 border border-slate-700/50 text-slate-400 cursor-not-allowed"
                      placeholder="Density of fluid will be calculated"
                    />
                  </div>

                  {/* Conditional Fields for Attachments */}
                  {(attachmentExists === "yes" || masterAttachmentExists === "yes") && (
                    <>
                      {/* Attachment Mass in Air Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">
                          Attachment Mass in Air (grams)
                        </label>
                        <input
                          type="number"
                          value={attachmentMassAir}
                          onChange={handleAttachmentMassAirChange}
                          className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-colors duration-300"
                          placeholder="Enter attachment mass in air"
                          min="0"
                          step="any"
                        />
                      </div>

                      {/* Attachment Mass in Fluid Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">
                          Attachment Mass in Fluid (grams)
                        </label>
                        <input
                          type="number"
                          value={attachmentMassFluid}
                          onChange={handleAttachmentMassFluidChange}
                          className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-colors duration-300"
                          placeholder="Enter attachment mass in fluid"
                          min="0"
                          step="any"
                        />
                      </div>
                    </>
                  )}

                  {/* Conditional Fields for Master Sample */}
                  {masterExists === 'yes' && (
                    <>
                      {/* Master Sample Mass in Air Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">
                          Master Sample Mass in Air (grams)
                        </label>
                        <input
                          type="number"
                          value={masterSampleMassAir}
                          onChange={handleMasterSampleMassAirChange}
                          className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-colors duration-300"
                          placeholder="Enter master sample mass in air"
                          min="0"
                          step="any"
                        />
                      </div>

                      {/* Master Sample Mass in Fluid Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">
                          Master Sample Mass in Fluid (grams)
                        </label>
                        <input
                          type="number"
                          value={masterSampleMassFluid}
                          onChange={handleMasterSampleMassFluidChange}
                          className="w-full px-4 py-3 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-200 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600 transition-colors duration-300"
                          placeholder="Enter master sample mass in fluid"
                          min="0"
                          step="any"
                        />
                      </div>

                      {/* Density of Master Sample Field */}
                      <div className="space-y-2">
                        <label className="text-sm font-medium text-slate-300">
                          Density of Master Sample (grams/cm³)
                        </label>
                        <input
                          type="text"
                          value={densityMasterSample}
                          readOnly
                          className="w-full px-4 py-3 rounded-lg bg-slate-800/30 border border-slate-700/50 text-slate-400 cursor-not-allowed"
                          placeholder="Density of master sample will be calculated"
                        />
                      </div>
                    </>
                  )}
                </form>
              </div>
            </div>
          </motion.div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default SecondEntry;
