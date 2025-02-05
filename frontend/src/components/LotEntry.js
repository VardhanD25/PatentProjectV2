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
    <div className="min-h-screen bg-white text-[#163d64] relative">
      <Navbar />
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-white text-[#163d64] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute inset-0 bg-white text-[#163d64] pointer-events-none" />
      
      <main className="container mx-auto px-4 py-32 relative ">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <h2 className="text-3xl font-bold text-[#163d64] text-center mb-12">
            Lot Entry Screen
          </h2>
          
          {showResults ? (
  <div className="bg-white-800/50 backdrop-blur-sm border border-white-700/50 rounded-lg p-8 space-y-6 shadow-xl">
    <h3 className="text-xl font-semibold text-[#163d64]">Results</h3>
    
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b border-white-700/50">
            <th className="py-3 px-4 text-left text-white-300 font-medium">Item Number</th>
            <th className="py-3 px-4 text-left text-white-300 font-medium">Mass in Air (g)</th>
            <th className="py-3 px-4 text-left text-white-300 font-medium">Mass in Fluid (g)</th>
            <th className="py-3 px-4 text-left text-white-300 font-medium">Density (g/cm³)</th>
            <th className="py-3 px-4 text-left text-white-300 font-medium">Compactness</th>
            <th className="py-3 px-4 text-left text-white-300 font-medium">Porosity Index</th>
          </tr>
        </thead>
        <tbody>
          {partMassAirArray.map((_, index) => (
            <tr key={index} className="border-b border-white-700/30">
              <td className="py-3 px-4 text-white-300">{index + 1}</td>
              <td className="py-3 px-4 text-white-300">{partMassAirArray[index]}</td>
              <td className="py-3 px-4 text-white-300">{partMassFluidArray[index]}</td>
              <td className="py-3 px-4 text-white-300">{partDensityArray[index]}</td>
              <td className="py-3 px-4 text-white-300">{compactnessRatioArray[index]}%</td>
              <td className="py-3 px-4 text-white-300">
                {masterExists === 'yes' ? (
                  `${porosityArray[index]}`
                ) : (
                  partDensityArray[index] === Math.max(...partDensityArray.map(d => parseFloat(d))).toString() ? (
                    'Reference Part'
                  ) : (
                    `${porosityArray[index]}`
                  )
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>

    {/* Add a note about porosity calculation method */}
    <div className="text-sm text-amber-500/80 mt-4">
      {masterExists === 'yes' ? (
        <p>Porosity calculated using master sample as reference</p>
      ) : (
        <p>Porosity calculated using highest density part as reference</p>
      )}
    </div>

    <div className="flex gap-4 justify-end pt-4">
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleGoBack}
        className="px-6 py-2 rounded-lg bg-white-800/50 border border-white-700/50 text-white-300 hover:bg-white-800/70 hover:text-white transition-all duration-300"
      >
        Edit Values
      </motion.button>
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        onClick={handleShowReport}
        className="px-6 py-2 rounded-lg bg-white-200 text-white-900 hover:bg-white transition-all duration-300"
      >
        Show Report
      </motion.button>
    </div>
  </div>
) : (
            <div className="space-y-6">
              {validationMessage && (
                <div className="bg-red-900/50 text-red-200 p-4 rounded-lg border border-red-500/50">
                  {validationMessage}
                </div>
              )}
              
              <div className="bg-white-800/50 backdrop-blur-sm border border-white-700/50 rounded-lg p-8 shadow-xl">
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="border-b border-white-700/50">
                        <th className="py-3 px-4 text-left text-white-300 font-medium">Item Number</th>
                        <th className="py-3 px-4 text-left text-white-300 font-medium">Mass in Air (g)</th>
                        <th className="py-3 px-4 text-left text-white-300 font-medium">Mass in Fluid (g)</th>
                        <th className="py-3 px-4 text-left text-white-300 font-medium">Density (g/cm³)</th>
                        <th className="py-3 px-4 text-left text-white-300 font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {partMassAirArray.map((_, index) => (
                        <tr key={index} className="border-b border-white-700/30">
                          <td className="py-3 px-4 text-white-300">{index + 1}</td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              value={partMassAirArray[index]}
                              onChange={(e) => handlePartMassAirChange(index, e.target.value)}
                              className="w-full px-4 py-2 rounded-lg bg-white-800/50 border border-white-700/50 text-white-200 focus:outline-none focus:border-white-600 focus:ring-1 focus:ring-white-600"
                            />
                          </td>
                          <td className="py-3 px-4">
                            <input
                              type="number"
                              value={partMassFluidArray[index]}
                              onChange={(e) => handlePartMassFluidChange(index, e.target.value)}
                              className="w-full px-4 py-2 rounded-lg bg-white-800/50 border border-white-700/50 text-white-200 focus:outline-none focus:border-white-600 focus:ring-1 focus:ring-white-600"
                            />
                          </td>
                          <td className="py-3 px-4 text-white-300">{partDensityArray[index]}</td>
                          <td className="py-3 px-4">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => handleRemovePart(index)}
                              className="px-4 py-1 rounded-lg bg-red-500/10 border border-red-500/30 text-red-400 hover:bg-red-500/20"
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
                    className="px-6 py-2 rounded-lg bg-white-800/50 border border-white-700/50 text-white-300 hover:bg-white-800/70 hover:text-white transition-all duration-300"
                  >
                    Add Part
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={handleFormSubmit}
                    className="px-6 py-2 rounded-lg bg-white-200 text-white-900 hover:bg-white transition-all duration-300"
                  >
                    Submit
                  </motion.button>
                </div>
              </div>
            </div>
          )}
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default LotEntry;
