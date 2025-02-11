import React, { useState,useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import Navbar from './Navbar';
import Footer from './Footer';

function LotEntry({
  partMassAirArray,
  partMassFluidArray,
  partDensityArray,
  compactnessRatioArray,
  porosityArray,
  onPartMassAirChange,
  onPartMassFluidChange,
  onAddPart,
  onRemovePart,
  onSubmit,
  validateLotEntry,
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
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [validationMessage, setValidationMessage] = useState('');
  const [composition, setComposition] = useState([]);
  const [standardAlloyId, setStandardAlloyId] = useState('');
  const [standardAlloyName, setStandardAlloyName] = useState('');
  const [standardAlloyCountry, setStandardAlloyCountry] = useState('');
  const navigate = useNavigate();

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
            element: item.element || { symbol: '' } // Ensure element is initialized
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
      if (standardAlloyId) { // Only fetch if standardAlloyId is available
        setLoading(true);
        try {
          const response = await fetch(`http://localhost:4000/standardAlloy/${standardAlloyId}`);
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

  const handlePartMassAirChange = (index, value) => {
    onPartMassAirChange(value, index);
  };

  const handlePartMassFluidChange = (index, value) => {
    onPartMassFluidChange(value, index);
  };

  const handleAddPart = () => {
    onAddPart();
  };

  const handleRemovePart = (index) => {
    onRemovePart(index);
  };

  const handleFormSubmit = () => {
    const validation = validateLotEntry();
    if (!validation.isValid) {
      setValidationMessage(validation.message);
      return;
    }
    onSubmit();
    setShowResults(true);
  };

  const handleShowReport = () => {
    navigate('/lotreportpage', {
      state: {
        partMassAirArray,
        partMassFluidArray,
        partDensityArray,
        compactnessRatioArray,
        porosityArray,
        date,
        selectedPartCode,
        partName,
        theoreticalDensity,
        densityType,
        attachmentExists,
        masterExists,
        masterAttachmentExists,
        densityOfFluid,
        densityOfMasterSample,
        chemicalComposition: composition.reduce((acc, item) => {
          acc[item.element.symbol] = item.percentage;
          return acc;
        }, {}),
        standardAlloyCountry,
      standardAlloyName,
      optionalReport: true,
      notes: 'No additional notes.'
      }
    });
  };

  const handleGoBack = () => {
    setShowResults(false);
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <h2 className="text-4xl font-bold text-[#163d64] mb-10 text-center">
                Lot Entry Screen
              </h2>
              
              {showResults ? (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-slate-200">
                  <h3 className="text-3xl font-semibold text-[#163d64] mb-6">Results</h3>
                  
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-[#163d64]/20">
                          <th className="py-4 px-6 text-left text-xl font-semibold">item Number</th>
                          <th className="py-4 px-6 text-left text-xl font-semibold">Mass in Air (g)</th>
                          <th className="py-4 px-6 text-left text-xl font-semibold">Mass in Fluid (g)</th>
                          <th className="py-4 px-6 text-left text-xl font-semibold">Density (g/cm³)</th>
                          <th className="py-4 px-6 text-left text-xl font-semibold">Compactness</th>
                          <th className="py-4 px-6 text-left text-xl font-semibold">Porosity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {partMassAirArray.map((_, index) => (
                          <tr key={index} className="border-b border-[#163d64]/10">
                            <td className="py-4 px-6 text-lg">{index + 1}</td>
                            <td className="py-4 px-6 text-lg">{partMassAirArray[index]}</td>
                            <td className="py-4 px-6 text-lg">{partMassFluidArray[index]}</td>
                            <td className="py-4 px-6 text-lg bg-[#fff0f0]">{partDensityArray[index]}</td>
                            <td className="py-4 px-6 text-lg bg-[#fff0f0]">{compactnessRatioArray[index]}</td>
                            <td className="py-4 px-6 text-lg bg-[#fff0f0]">
                              {masterExists === 'yes' ? (
                                `${porosityArray[index]}%`
                              ) : (
                                partDensityArray[index] === Math.max(...partDensityArray.map(d => parseFloat(d))).toString() ? (
                                  'Reference Part'
                                ) : (
                                  `${porosityArray[index]}%`
                                )
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="text-lg text-amber-500/80 mt-6">
                    {masterExists === 'yes' ? (
                      <p>Porosity calculated using master sample as reference</p>
                    ) : (
                      <p>Porosity calculated using highest density part as reference</p>
                    )}
                  </div>

                  <div className="flex gap-4 justify-end pt-8">
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleShowReport}
                      className="px-8 py-4 bg-[#fa4516] text-white font-semibold rounded-xl hover:bg-[#fa4516]/90 transition-all duration-300"
                    >
                      Show Report
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-slate-200">
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse">
                      <thead>
                        <tr className="border-b border-[#163d64]/20">
                          <th className="py-4 px-6 text-left text-xl font-semibold">Item Number</th>
                          <th className="py-4 px-6 text-left text-xl font-semibold">Mass in Air (g)</th>
                          <th className="py-4 px-6 text-left text-xl font-semibold">Mass in Fluid (g)</th>
                          <th className="py-4 px-6 text-left text-xl font-semibold">Density (g/cm³)</th>
                          <th className="py-4 px-6 text-left text-xl font-semibold">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {partMassAirArray.map((_, index) => (
                          <tr key={index} className="border-b border-[#163d64]/10">
                            <td className="py-4 px-6 text-lg">{index + 1}</td>
                            <td className="py-4 px-6">
                              <input
                                type="number"
                                value={partMassAirArray[index]}
                                onChange={(e) => handlePartMassAirChange(index, e.target.value)}
                                className="w-full px-4 py-3 text-lg rounded-lg border border-[#163d64]/20 focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-colors"
                              />
                            </td>
                            <td className="py-4 px-6">
                              <input
                                type="number"
                                value={partMassFluidArray[index]}
                                onChange={(e) => handlePartMassFluidChange(index, e.target.value)}
                                className="w-full px-4 py-3 text-lg rounded-lg border border-[#163d64]/20 focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-colors"
                              />
                            </td>
                            <td className="py-4 px-6 text-lg bg-[#fff0f0]">{partDensityArray[index]}</td>
                            <td className="py-4 px-6">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleRemovePart(index)}
                                className="px-6 py-2 bg-red-500/10 text-red-500 font-semibold rounded-lg hover:bg-red-500/20 transition-colors"
                              >
                                Remove
                              </motion.button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex gap-4 justify-end pt-8">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleAddPart}
                      className="px-8 py-4 border-2 border-[#163d64] text-[#163d64] font-semibold rounded-xl hover:bg-[#163d64] hover:text-white transition-all duration-300"
                    >
                      Add Part
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={handleFormSubmit}
                      className="px-8 py-4 bg-[#fa4516] text-white font-semibold rounded-xl hover:bg-[#fa4516]/90 transition-all duration-300"
                    >
                      Submit
                    </motion.button>
                  </div>
                </div>
              )}
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default LotEntry;
