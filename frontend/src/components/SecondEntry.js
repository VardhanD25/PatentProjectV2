// src/components/SecondEntry.jsx
import React, { useEffect } from 'react';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
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
              <h2 className="text-4xl font-bold text-[#163d64] mb-8 text-center">Second Entry</h2>
              
              <form className="space-y-6">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#163d64]">Mass of Fluid (grams)</label>
                  <input
                    type="number"
                    value={massOfFluid}
                    onChange={handleMassOfFluidChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] placeholder-[#163d64]/50 focus:outline-none focus:border-[#163d64] focus:ring-1 focus:ring-[#163d64] transition-colors duration-300"
                    placeholder="Enter mass of fluid"
                    min="0"
                    step="any"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#163d64]">Volume of Fluid (cm³)</label>
                  <input
                    type="number"
                    value={volumeOfFluid}
                    onChange={handleVolumeOfFluidChange}
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] placeholder-[#163d64]/50 focus:outline-none focus:border-[#163d64] focus:ring-1 focus:ring-[#163d64] transition-colors duration-300"
                    placeholder="Enter volume of fluid"
                    min="0"
                    step="any"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-[#163d64]">Density of Fluid (grams/cm³)</label>
                  <input
                    type="text"
                    value={densityOfFluid}
                    readOnly
                    className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64]/70 cursor-not-allowed"
                    placeholder="Density of fluid will be calculated"
                  />
                </div>

                {(attachmentExists === "yes" || masterAttachmentExists === "yes") && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#163d64]">Attachment Mass in Air (grams)</label>
                      <input
                        type="number"
                        value={attachmentMassAir}
                        onChange={handleAttachmentMassAirChange}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] placeholder-[#163d64]/50 focus:outline-none focus:border-[#163d64] focus:ring-1 focus:ring-[#163d64] transition-colors duration-300"
                        placeholder="Enter attachment mass in air"
                        min="0"
                        step="any"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#163d64]">Attachment Mass in Fluid (grams)</label>
                      <input
                        type="number"
                        value={attachmentMassFluid}
                        onChange={handleAttachmentMassFluidChange}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] placeholder-[#163d64]/50 focus:outline-none focus:border-[#163d64] focus:ring-1 focus:ring-[#163d64] transition-colors duration-300"
                        placeholder="Enter attachment mass in fluid"
                        min="0"
                        step="any"
                      />
                    </div>
                  </>
                )}

                {masterExists === 'yes' && (
                  <>
                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#163d64]">Master Sample Mass in Air (grams)</label>
                      <input
                        type="number"
                        value={masterSampleMassAir}
                        onChange={handleMasterSampleMassAirChange}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] placeholder-[#163d64]/50 focus:outline-none focus:border-[#163d64] focus:ring-1 focus:ring-[#163d64] transition-colors duration-300"
                        placeholder="Enter master sample mass in air"
                        min="0"
                        step="any"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#163d64]">Master Sample Mass in Fluid (grams)</label>
                      <input
                        type="number"
                        value={masterSampleMassFluid}
                        onChange={handleMasterSampleMassFluidChange}
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64] placeholder-[#163d64]/50 focus:outline-none focus:border-[#163d64] focus:ring-1 focus:ring-[#163d64] transition-colors duration-300"
                        placeholder="Enter master sample mass in fluid"
                        min="0"
                        step="any"
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-sm font-medium text-[#163d64]">Density of Master Sample (grams/cm³)</label>
                      <input
                        type="text"
                        value={densityMasterSample}
                        readOnly
                        className="w-full px-4 py-3 rounded-xl bg-white border border-[#163d64]/20 text-[#163d64]/70 cursor-not-allowed"
                        placeholder="Density of master sample will be calculated"
                      />
                    </div>
                  </>
                )}
              </form>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default SecondEntry;
