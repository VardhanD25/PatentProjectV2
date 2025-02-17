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

  const captureWeight = async (setWeight) => {
    if (window.electron) {
      const newWeight = await window.electron.captureWeight();
      setWeight(newWeight);
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

        <main className="flex-grow mt-[120px] mb-[80px] flex items-center justify-center p-6">
          <div className="max-w-7xl w-full">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-slate-200">
              <h2 className="text-3xl font-bold text-[#163d64] mb-10 text-center">
                Second Entry
              </h2>
              
              <form className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  <div className="space-y-3">
                    <label className="text-3xl font-semibold text-[#163d64]/80">Mass of Fluid (grams)</label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={massOfFluid}
                        onChange={handleMassOfFluidChange}
                        className="w-full px-4 py-4 text-2xl rounded-xl bg-white border border-[#163d64]/10 text-[#163d64] focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-200"
                        placeholder="Enter mass of fluid"
                        min="0"
                        step="0.1"
                      />
                      <button
                        type="button"
                        onClick={() => captureWeight(onMassOfFluidChange)}
                        className="ml-2 px-2 py-1 rounded bg-[#fa4516] text-white hover:bg-[#fa4516]/90 transition-all duration-300"
                      >
                        C
                      </button>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-3xl font-semibold text-[#163d64]/80">Volume of Fluid (cm³)</label>
                    <div className="flex items-center">
                      <input
                        type="number"
                        value={volumeOfFluid}
                        onChange={handleVolumeOfFluidChange}
                        className="w-full px-4 py-4 text-2xl rounded-2xl bg-white border border-[#163d64]/10 text-[#163d64] focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-200"
                        placeholder="Enter volume of fluid"
                        min="0"
                        step="0.1"
                      />
                    </div>
                  </div>

                  <div className="space-y-3">
                    <label className="text-3xl font-semibold text-[#163d64]/80">Density of Fluid (g/cm³)</label>
                    <input
                      type="text"
                      value={densityOfFluid}
                      readOnly
                      className="w-full px-4 py-4 text-2xl rounded-xl bg-[#fff0f0] border border-[#163d64]/10 text-[#163d64]/75 cursor-not-allowed"
                      placeholder="Density of fluid will be calculated"
                    />
                  </div>
                </div>

                {(attachmentExists === "yes" || masterAttachmentExists === "yes") && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-3">
                      <label className="text-3xl font-semibold text-[#163d64]/80">Attachment Mass in Air (g)</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={attachmentMassAir}
                          onChange={handleAttachmentMassAirChange}
                          className="w-full px-4 py-4 text-2xl rounded-xl bg-white border border-[#163d64]/10 text-[#163d64] focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-200"
                          placeholder="Enter attachment mass in air"
                          min="0"
                          step="0.1"
                        />
                        <button
                          type="button"
                          onClick={() => captureWeight(onAttachmentMassAirChange)}
                          className="ml-2 px-2 py-1 rounded bg-[#fa4516] text-white hover:bg-[#fa4516]/90 transition-all duration-300"
                        >
                          C
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-3xl font-semibold text-[#163d64]/80">Attachment Mass in Fluid (g)</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={attachmentMassFluid}
                          onChange={handleAttachmentMassFluidChange}
                          className="w-full px-4 py-4 text-2xl rounded-xl bg-white border border-[#163d64]/10 text-[#163d64] focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-200"
                          placeholder="Enter attachment mass in fluid"
                          min="0"
                          step="0.1"
                        />
                        <button
                          type="button"
                          onClick={() => captureWeight(onAttachmentMassFluidChange)}
                          className="ml-2 px-2 py-1 rounded bg-[#fa4516] text-white hover:bg-[#fa4516]/90 transition-all duration-300"
                        >
                          C
                        </button>
                      </div>
                    </div>
                  </div>
                )}

                {masterExists === 'yes' && (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <label className="text-3xl font-semibold text-[#163d64]/80">Master Sample Mass in Air (g)</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={masterSampleMassAir}
                          onChange={handleMasterSampleMassAirChange}
                          className="w-full px-4 py-4 text-2xl rounded-xl bg-white border border-[#163d64]/10 text-[#163d64] focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-200"
                          placeholder="Enter master sample mass in air"
                          min="0"
                          step="0.1"
                        />
                        <button
                          type="button"
                          onClick={() => captureWeight(onMasterSampleMassAirChange)}
                          className="ml-2 px-2 py-1 rounded bg-[#fa4516] text-white hover:bg-[#fa4516]/90 transition-all duration-300"
                        >
                          C
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-3xl font-semibold text-[#163d64]/80">Master Sample Mass in Fluid (g)</label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={masterSampleMassFluid}
                          onChange={handleMasterSampleMassFluidChange}
                          className="w-full px-4 py-4 text-2xl rounded-xl bg-white border border-[#163d64]/10 text-[#163d64] focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-200"
                          placeholder="Enter master sample mass in fluid"
                          min="0"
                          step="0.1"
                        />
                        <button
                          type="button"
                          onClick={() => captureWeight(onMasterSampleMassFluidChange)}
                          className="ml-2 px-2 py-1 rounded bg-[#fa4516] text-white hover:bg-[#fa4516]/90 transition-all duration-300"
                        >
                          C
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-3xl font-semibold text-[#163d64]/80">Master Sample Density (g/cm³)</label>
                      <input
                        type="text"
                        value={densityMasterSample}
                        readOnly
                        className="w-full px-4 py-4 text-2xl rounded-xl bg-[#fff0f0] border border-[#163d64]/10 text-[#163d64]/75 cursor-not-allowed"
                        placeholder="Density will be calculated"
                      />
                    </div>
                  </div>
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