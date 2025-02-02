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
  const [serialNumbers, setSerialNumbers] = useState([]);

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

  // this is the serial number generator func
  const generateSerialNumbers = (count) => {
    
    const lastUsedNumberKey = `lastSerialNumber_${selectedPartCode}_${date}`;
    let lastUsedNumber = parseInt(localStorage.getItem(lastUsedNumberKey)) || 100000;

   
    const newSerialNumbers = [];
    for (let i = 0; i < count; i++) {
      newSerialNumbers.push(lastUsedNumber + i);
    }

   
    localStorage.setItem(lastUsedNumberKey, (lastUsedNumber + count).toString());

    return newSerialNumbers;
  };

  
  useEffect(() => {
    if (partMassAirArray.length > serialNumbers.length) {
     
      const newNumbers = generateSerialNumbers(partMassAirArray.length - serialNumbers.length);
      setSerialNumbers([...serialNumbers, ...newNumbers]);
    } else if (partMassAirArray.length < serialNumbers.length) {
     
      setSerialNumbers(serialNumbers.slice(0, partMassAirArray.length));
    }
  }, [partMassAirArray.length]);

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

    // Get the last used number from localStorage or start from 100000
    const lastUsedNumberKey = `lastSerialNumber_${selectedPartCode}_${date}`;
    let startNumber = parseInt(localStorage.getItem(lastUsedNumberKey)) || 100000;
    
    // Generate serial numbers starting from the current number
    const generatedSerialNumbers = partMassAirArray.map((_, index) => {
      return startNumber + index;
    });

    // Store the last used number for next time
    localStorage.setItem(lastUsedNumberKey, (startNumber + partMassAirArray.length).toString());

    setSerialNumbers(generatedSerialNumbers);
    setShowResults(true);
  };

  const handleShowReport = () => {
    navigate('/lotreportpage', {
      state: {
        date,
        selectedPartCode,
        partName,
        theoreticalDensity,
        chemicalComposition: composition.reduce((acc, item) => {
          acc[item.element.symbol] = item.percentage;
          return acc;
        }, {}),
        partMassAirArray,
        partMassFluidArray,
        densityOfFluid,
        densityOfMasterSample,
        compactnessRatioArray,
        porosityArray,
        masterExists,
        masterAttachmentExists,
        standardAlloyCountry,
        standardAlloyName,
        serialNumbers,
        optionalReport: true,
        notes: 'No additional notes.',
        attachmentExists,
        densityType
      }
    });
  };

  const handleGoBack = () => {
    setShowResults(false);
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-quicksand text-[#163d64] relative">
      {/* Background Pattern */}
      <div className="fixed inset-0">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#163d640a_1px,transparent_1px),linear-gradient(to_bottom,#163d640a_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        <div className="fixed inset-0 bg-gradient-to-b from-white via-[#163d64]/5 to-white"></div>
      </div>

      <div className="relative z-10 flex flex-col min-h-screen">
        <Navbar />
        
        <main className="flex-grow p-8 mt-[80px] mb-[80px]">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-[#163d64]/10">
              <h2 className="text-5xl font-bold text-[#163d64] mb-8 text-center">
                Lot Entry
              </h2>

              {validationMessage && (
                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-xl">
                  <p className="text-red-600">{validationMessage}</p>
                </div>
              )}

              {showResults ? (
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#163d64]/10">
                          <th className="py-4 px-6 text-left text-sm font-semibold text-white bg-[#163d64]">Serial Number</th>
                          <th className="py-4 px-6 text-left text-sm font-semibold text-white bg-[#163d64]">Mass in Air (g)</th>
                          <th className="py-4 px-6 text-left text-sm font-semibold text-white bg-[#163d64]">Mass in Fluid (g)</th>
                          <th className="py-4 px-6 text-left text-sm font-semibold text-white bg-[#163d64]">Density (g/cm³)</th>
                          <th className="py-4 px-6 text-left text-sm font-semibold text-white bg-[#163d64]">Compactness</th>
                          <th className="py-4 px-6 text-left text-sm font-semibold text-white bg-[#163d64]">Porosity</th>
                        </tr>
                      </thead>
                      <tbody>
                        {partMassAirArray.map((_, index) => (
                          <tr key={index} className="border-b border-[#163d64]/5 hover:bg-[#163d64]/5">
                            <td className="py-4 px-6 text-[#163d64] font-mono">
                              {serialNumbers[index]?.toString().padStart(6, '0')}
                            </td>
                            <td className="py-4 px-6 text-[#163d64]">{partMassAirArray[index]}</td>
                            <td className="py-4 px-6 text-[#163d64]">{partMassFluidArray[index]}</td>
                            <td className="py-4 px-6 text-[#163d64]">{partDensityArray[index]}</td>
                            <td className="py-4 px-6 text-[#163d64]">{compactnessRatioArray[index]}</td>
                            <td className="py-4 px-6 text-[#163d64]">
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

                  <div className="text-sm text-[#fa4516]/80 mt-4">
                    {masterExists === 'yes' ? (
                      <p>Porosity calculated using master sample as reference</p>
                    ) : (
                      <p>Porosity calculated using highest density part as reference</p>
                    )}
                  </div>

                  <div className="flex gap-4 justify-end pt-4">
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleShowReport}
                      className="px-8 py-4 bg-[#fa4516] text-white font-semibold rounded-xl hover:bg-[#fa4516]/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Show Report
                    </motion.button>
                  </div>
                </div>
              ) : (
                <div className="space-y-6">
                  <div className="overflow-x-auto">
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-[#163d64]/10">
                          <th className="py-4 px-6 text-left text-sm font-semibold text-[#163d64]/80">Serial Number</th>
                          <th className="py-4 px-6 text-left text-sm font-semibold text-[#163d64]/80">Mass in Air (g)</th>
                          <th className="py-4 px-6 text-left text-sm font-semibold text-[#163d64]/80">Mass in Fluid (g)</th>
                          <th className="py-4 px-6 text-left text-sm font-semibold text-[#163d64]/80">Density (g/cm³)</th>
                          <th className="py-4 px-6 text-left text-sm font-semibold text-[#163d64]/80">Actions</th>
                        </tr>
                      </thead>
                      <tbody>
                        {partMassAirArray.map((_, index) => (
                          <tr key={index} className="border-b border-[#163d64]/5">
                            <td className="py-4 px-6 text-[#163d64] font-mono">
                              {serialNumbers[index]?.toString().padStart(6, '0')}
                            </td>
                            <td className="py-4 px-6">
                              <input
                                type="number"
                                value={partMassAirArray[index]}
                                onChange={(e) => handlePartMassAirChange(index, e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-white border border-[#163d64]/10 text-[#163d64] focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-300"
                              />
                            </td>
                            <td className="py-4 px-6">
                              <input
                                type="number"
                                value={partMassFluidArray[index]}
                                onChange={(e) => handlePartMassFluidChange(index, e.target.value)}
                                className="w-full px-4 py-2 rounded-lg bg-white border border-[#163d64]/10 text-[#163d64] focus:outline-none focus:border-[#fa4516] focus:ring-1 focus:ring-[#fa4516] transition-all duration-300"
                              />
                            </td>
                            <td className="py-4 px-6 text-[#163d64]">{partDensityArray[index]}</td>
                            <td className="py-4 px-6">
                              <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                onClick={() => handleRemovePart(index)}
                                className="px-4 py-2 bg-red-500/10 text-red-500 rounded-lg hover:bg-red-500/20 transition-all duration-300"
                              >
                                Remove
                              </motion.button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="flex gap-4 justify-end">
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleAddPart}
                      className="px-8 py-4 border-2 border-[#163d64] text-[#163d64] font-semibold rounded-xl hover:bg-[#163d64] hover:text-white transition-all duration-300"
                    >
                      Add Part
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      onClick={handleFormSubmit}
                      className="px-8 py-4 bg-[#fa4516] text-white font-semibold rounded-xl hover:bg-[#fa4516]/90 transition-all duration-300 shadow-lg hover:shadow-xl"
                    >
                      Submit
                    </motion.button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default LotEntry;
