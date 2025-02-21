import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

function SinglePieceEntry({ 
  partMassAir,
  partMassFluid,
  partDensity,
  compactnessRatio,
  porosity,
  onPartMassAirChange,
  onPartMassFluidChange,
  onSubmit,
  validateEntry,
  date,
  selectedPartCode,
  partName,
  theoreticalDensity,
  densityType,
  attachmentExists,
  masterExists,
  masterAttachmentExists,
  densityOfFluid,
  densityOfMasterSample
}) {
  
  const [showResults, setShowResults] = useState(false);
  const [composition, setComposition] = useState([]);
  const [standardAlloyId, setStandardAlloyId] = useState('');
  const [standardAlloyName, setStandardAlloyName] = useState('');
  const [standardAlloyCountry, setStandardAlloyCountry] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [artificialLoading, setArtificialLoading] = useState(true);

  const navigate = useNavigate();

  const handlePartMassAirChange = (event) => {
    onPartMassAirChange(event.target.value);
  };

  const handlePartMassFluidChange = (event) => {
    onPartMassFluidChange(event.target.value);
  };

  const captureWeight = async (setWeight) => {
    if (window.electron) {
      const newWeight = await window.electron.captureWeight();
      setWeight(newWeight);
    }
  };

  useEffect(() => {
    // Add artificial loading delay
    setTimeout(() => {
      setArtificialLoading(false);
    }, 1500);
  }, []);

  useEffect(() => {
    const fetchPart = async () => {
      try {
        const response = await fetch(`http://localhost:4000/parts/${selectedPartCode}`);
        const data = await response.json();

        if (response.ok) {
          if (data.part.standardAlloyId) {
            setStandardAlloyId(data.part.standardAlloyId);
          } else {
            setStandardAlloyId('');
          }

          const fetchedComposition = data.part.composition || [];
          setComposition(fetchedComposition.map(item => ({
            ...item,
            element: item.element || { symbol: '' }
          })));
        } else {
          setError(data.message || 'Error fetching part response');
        }
      } catch (error) {
        setError('Error fetching part');
      } finally {
        setLoading(false);
      }
    };

    fetchPart();
  }, [selectedPartCode]);

  useEffect(() => {
    const fetchStandardAlloy = async () => {
      if (standardAlloyId) {
        console.log('Standard Alloy ID:', standardAlloyId);

        setLoading(true);
        try {
          const response = await fetch(`http://localhost:4000/standardAlloy/${standardAlloyId._id}`);
          const data = await response.json();

          if (response.ok) {
            setStandardAlloyCountry(data.alloy.country);
            setStandardAlloyName(data.alloy.name);
          } else {
            setError(data.message || 'Error fetching standard alloy response');
          }
        } catch (error) {
          setError('Error fetching standard alloy');
        } finally {
          setLoading(false);
        }
      }
    };

    fetchStandardAlloy();
  }, [standardAlloyId]);

  const handleFormSubmit = () => {
    const validation = validateEntry();
    if (!validation.isValid) {
      alert(validation.message);
      return;
    }
    onSubmit();
    setShowResults(true);
  };

  const handleToggleForm = () => {
    setShowResults(!showResults);
  };

  const handleShowReport = () => {
    const reportData = {
      date,
      partCode: selectedPartCode,
      partName,
      theoreticalDensity,
      densityType,
      attachmentExists,
      masterExists,
      masterAttachmentExists,
      densityOfMasterSample,
      chemicalComposition: composition.reduce((acc, item) => {
        acc[item.element.symbol] = item.percentage;
        return acc;
      }, {}),
      attachmentExists,
      massInAir: partMassAir,
      massInFluid: partMassFluid,
      fluidDensity: densityOfFluid,
      densityOfItem: partDensity,
      compactnessRatio,
      porosity,
      standardAlloyCountry,
      standardAlloyName,
      optionalReport: true,
      notes: '',
    };

    navigate('/reportpage', { state: { reportData } });
  };

  if (selectedPartCode === 'Select part code' || !partName || !date) {
    return (
      <div className="min-h-screen flex flex-col bg-white font-quicksand text-[#163d64] relative">
        <Navbar />
        <div className="flex-grow flex justify-center items-center p-8">
          <p className="text-center text-[#163d64]">Please fill in the required fields in the previous steps to enter data on this screen.</p>
        </div>
        <Footer />
      </div>
    );
  }

  if (loading || artificialLoading) {
    return (
      <div className="min-h-screen flex flex-col bg-white font-quicksand text-[#163d64] relative">
        <Navbar />
        <div className="flex-grow flex justify-center items-center p-8">
          <p className="text-center text-[#163d64]">Loading...</p>
        </div>
        <Footer />
      </div>
    );
  }

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
              <h2 className="text-4xl font-bold text-[#163d64] mb-10 text-center">
                Single Piece Entry
              </h2>

              {showResults ? (
                <div className="space-y-8">
                  <h3 className="text-3xl font-semibold text-[#163d64] text-center">Results</h3>
                  
                  <div className="bg-white/50 border border-[#163d64]/20 rounded-xl p-8 space-y-4">
                    <p className="text-[#163d64] text-3xl">
                      <span className="font-medium">Compactness Ratio:</span> {compactnessRatio}%
                    </p>
                    
                    {masterExists === 'yes' ? (
                      <p className="text-[#163d64] text-3xl">
                        <span className="font-medium">Porosity Index:</span> {porosity}%
                      </p>
                    ) : (
                      <p className="text-[#fa4516] text-3xl">
                        <span className="font-medium text-[#163d64]">Porosity Index (For specified alloy density):</span> Cannot be calculated (No master sample)
                      </p>
                    )}
                  </div>

                  <div className="flex flex-col sm:flex-row gap-4 justify-center">
                    {compactnessRatio !== 'Incorrect input, compactness ratio cannot be greater than 100!' && (
                      <button
                        onClick={handleShowReport}
                        className="px-6 py-3 bg-[#fa4516] text-white font-semibold rounded-xl hover:bg-[#fa4516]/90 transition-all duration-200 shadow-sm hover:shadow-md"
                      >
                        Show Report
                      </button>
                    )}
                  </div>

                  {compactnessRatio !== 'Incorrect input, compactness ratio cannot be greater than 100!' && (
                    <p className="text-[#fa4516] text-xl text-center">
                      Verify entries before generating report, values cannot be edited later.
                    </p>
                  )}
                </div>
              ) : (
                <form className="space-y-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="space-y-3">
                      <label className="text-3xl font-semibold text-[#163d64]/80">
                        Part Mass in Air (g)
                      </label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={partMassAir}
                          onChange={handlePartMassAirChange}
                          className="w-full px-4 py-5 text-2xl rounded-xl bg-white border border-[#163d64]/10 text-[#163d64] focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] hover:border-[#fa4516]/50 transition-all duration-300"
                          placeholder="Enter part mass in air"
                          min="0"
                          step="any"
                        />
                        <button
                          type="button"
                          onClick={() => captureWeight(onPartMassAirChange)}
                          className="ml-2 px-5 py-5 rounded-xl bg-[#fa4516] text-white hover:bg-[#fa4516]/90 transition-all duration-300"
                        >
                          C
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-3xl font-semibold text-[#163d64]/80">
                        Part Mass in Fluid (g)
                      </label>
                      <div className="flex items-center">
                        <input
                          type="number"
                          value={partMassFluid}
                          onChange={handlePartMassFluidChange}
                          className="w-full px-4 py-5 text-2xl rounded-xl bg-white border border-[#163d64]/10 text-[#163d64] focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] hover:border-[#fa4516]/50 transition-all duration-300"
                          placeholder="Enter part mass in fluid"
                          min="0"
                          step="any"
                        />
                        <button
                          type="button"
                          onClick={() => captureWeight(onPartMassFluidChange)}
                          className="ml-2 px-5 py-5 rounded-xl bg-[#fa4516] text-white hover:bg-[#fa4516]/90 transition-all duration-300"
                        >
                          C
                        </button>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <label className="text-3xl font-semibold text-[#163d64]/80">
                        Part Density (g/cm³)
                      </label>
                      <input
                        type="text"
                        value={partDensity}
                        readOnly
                        className="w-full px-4 py-4 text-2xl rounded-xl bg-[#fff0f0] border border-[#163d64]/10 text-[#163d64]/75 cursor-not-allowed"
                        placeholder="Part density will be calculated"
                      />
                    </div>
                  </div>

                  <div className="flex justify-center pt-4">
                    <button
                      type="button"
                      onClick={handleFormSubmit}
                      className="px-8 py-4 bg-[#fa4516] text-white font-semibold rounded-xl hover:bg-[#fa4516]/90 transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 transform"
                    >
                      Submit
                    </button>
                  </div>
                </form>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default SinglePieceEntry;