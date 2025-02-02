import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function LotReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const reportRef = useRef();
  
  const [selectedFields, setSelectedFields] = useState({
    basicInfo: true,
    measurements: true,
    chemicalComposition: true,
    standardAlloy: true,
    masterDetails: true,
  });

  // Add console.log to debug the data
  console.log('Location State:', location.state);
  console.log('Serial Numbers:', location.state?.serialNumbers);

  if (!location.state) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-[#163d64] mb-4">No Data Available</h2>
          <button
            onClick={() => navigate(-1)}
            className="px-8 py-4 rounded-xl bg-[#fa4516] text-white font-semibold hover:bg-[#fa4516]/90 transition-all duration-300"
          >
            Go Back
          </button>
        </div>
      </div>
    );
  }

  // Destructure with explicit default for serialNumbers
  const {
    date = '',
    selectedPartCode: partCode = '',
    partName = '',
    theoreticalDensity: density = '',
    chemicalComposition = {},
    partAttachments,
    partMassAirArray: massInAir = [],
    partMassFluidArray: massInFluid = [],
    densityOfFluid: fluidDensity = '',
    densityOfMasterSample: densityOfItem = '',
    compactnessRatioArray: compactnessRatio = [],
    porosityArray = [],
    masterExists = false,
    masterAttachmentExists = false,
    standardAlloyCountry = '',
    standardAlloyName = '',
    serialNumbers: passedSerialNumbers,
    optionalReport = true,
  } = location.state || {};

  // Generate or use passed serial numbers
  const serialNumbers = passedSerialNumbers || massInAir.map((_, index) => {
    const lastUsedNumberKey = `lastSerialNumber_${partCode}_${date}`;
    const lastUsedNumber = parseInt(localStorage.getItem(lastUsedNumberKey)) || 100000;
    return lastUsedNumber + index;
  });

  const handleFieldToggle = (field) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  
  const formatFieldName = (fieldName) => {
    return fieldName
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  };

  const handleDownloadReport = () => {
    const reportContent = document.createElement('div');
    reportContent.style.padding = '20px';
    reportContent.style.color = '#163d64';
    reportContent.style.backgroundColor = '#fff';

    let content = '';
    
    if (selectedFields.basicInfo) {
      content += `
        <div style="margin-bottom: 20px">
          <h2 style="color: #163d64; font-size: 20px; margin-bottom: 10px">Basic Information</h2>
          <p><strong>Date:</strong> ${date}</p>
          <p><strong>Part Code:</strong> ${partCode}</p>
          <p><strong>Part Name:</strong> ${partName}</p>
          <p><strong>Theoretical Density:</strong> ${density}</p>
        </div>
      `;
    }

    if (selectedFields.measurements) {
      content += `
        <div style="margin-bottom: 20px">
          <h2 style="color: #163d64; font-size: 20px; margin-bottom: 10px">Measurements</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px">
            <thead>
              <tr style="background-color: #163d64">
                <th style="border: 1px solid #163d64; padding: 8px; color: white">Serial Number</th>
                <th style="border: 1px solid #163d64; padding: 8px; color: white">Mass in Air (g)</th>
                <th style="border: 1px solid #163d64; padding: 8px; color: white">Mass in Fluid (g)</th>
                <th style="border: 1px solid #163d64; padding: 8px; color: white">Compactness Ratio</th>
                <th style="border: 1px solid #163d64; padding: 8px; color: white">Porosity</th>
              </tr>
            </thead>
            <tbody>
              ${massInAir.map((_, index) => {
                return `
                  <tr>
                    <td style="border: 1px solid #163d64; padding: 8px; font-family: monospace">${serialNumbers[index].toString().padStart(6, '0')}</td>
                    <td style="border: 1px solid #163d64; padding: 8px">${massInAir[index]}</td>
                    <td style="border: 1px solid #163d64; padding: 8px">${massInFluid[index]}</td>
                    <td style="border: 1px solid #163d64; padding: 8px">${compactnessRatio[index]}</td>
                    <td style="border: 1px solid #163d64; padding: 8px">${porosityArray[index]}</td>
                  </tr>
                `;
              }).join('')}
            </tbody>
          </table>
        </div>
      `;
    }

    if (selectedFields.chemicalComposition && chemicalComposition) {
      content += `
        <div style="margin-bottom: 20px">
          <h2 style="font-size: 20px; margin-bottom: 10px">Chemical Composition</h2>
          <div style="display: grid; grid-template-columns: repeat(2, 1fr); gap: 10px">
            ${Object.entries(chemicalComposition).map(([element, percentage]) => `
              <div style="padding: 8px; border: 1px solid #000">
                <strong>${element}:</strong> ${percentage}%
              </div>
            `).join('')}
          </div>
        </div>
      `;
    }

    if (selectedFields.standardAlloy && standardAlloyName) {
      content += `
        <div style="margin-bottom: 20px">
          <h2 style="font-size: 20px; margin-bottom: 10px">Standard Alloy Information</h2>
          <p><strong>Name:</strong> ${standardAlloyName}</p>
          <p><strong>Country:</strong> ${standardAlloyCountry}</p>
        </div>
      `;
    }

    if (selectedFields.masterDetails && masterExists) {
      content += `
        <div style="margin-bottom: 20px">
          <h2 style="font-size: 20px; margin-bottom: 10px">Master Sample Details</h2>
          <p><strong>Density of Master Sample:</strong> ${densityOfItem}</p>
          <p><strong>Master Attachment:</strong> ${masterAttachmentExists ? 'Yes' : 'No'}</p>
        </div>
      `;
    }

    reportContent.innerHTML = content;
    
    html2pdf().from(reportContent).set({
      margin: [10, 10, 10, 10],
      filename: `${partCode}_report.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    }).save();
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <main className="container mx-auto px-4 py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-8"
        >
          <h1 className="text-3xl font-bold text-[#163d64] text-center mb-12">
            Lot Report Preview
          </h1>

          {/* Field Selection */}
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <h2 className="text-xl font-semibold text-[#163d64] mb-4">Select Fields for Report</h2>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
              {Object.entries(selectedFields).map(([field, isSelected]) => (
                <div key={field} className="flex items-center gap-2">
                  <input
                    type="checkbox"
                    id={field}
                    checked={isSelected}
                    onChange={() => handleFieldToggle(field)}
                    className="w-5 h-5 rounded border-[#163d64]/10 text-[#fa4516] focus:ring-[#fa4516]/20"
                  />
                  <label 
                    htmlFor={field} 
                    className="text-[#163d64] select-none cursor-pointer"
                  >
                    {formatFieldName(field)}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Report Preview - Only show selected sections */}
          <div className="bg-white rounded-xl shadow-lg p-8 space-y-8">
            {/* Basic Information */}
            {selectedFields.basicInfo && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#163d64]">Basic Information</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-[#163d64]/60">Date</p>
                    <p className="text-[#163d64] font-medium">{date}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#163d64]/60">Part Code</p>
                    <p className="text-[#163d64] font-medium">{partCode}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#163d64]/60">Part Name</p>
                    <p className="text-[#163d64] font-medium">{partName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#163d64]/60">Theoretical Density</p>
                    <p className="text-[#163d64] font-medium">{density}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Measurements Table */}
            {selectedFields.measurements && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#163d64]">Measurements</h2>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr>
                        <th className="py-3 px-4 text-left bg-[#163d64] text-white font-medium rounded-tl-lg">Serial Number</th>
                        <th className="py-3 px-4 text-left bg-[#163d64] text-white font-medium">Mass in Air (g)</th>
                        <th className="py-3 px-4 text-left bg-[#163d64] text-white font-medium">Mass in Fluid (g)</th>
                        <th className="py-3 px-4 text-left bg-[#163d64] text-white font-medium">Compactness Ratio</th>
                        <th className="py-3 px-4 text-left bg-[#163d64] text-white font-medium rounded-tr-lg">Porosity</th>
                      </tr>
                    </thead>
                    <tbody>
                      {massInAir.map((_, index) => (
                        <tr key={index} className="border-b border-[#163d64]/10 hover:bg-gray-50">
                          <td className="py-3 px-4 font-mono text-[#163d64]">
                            {serialNumbers[index].toString().padStart(6, '0')}
                          </td>
                          <td className="py-3 px-4 text-[#163d64]">{massInAir[index]}</td>
                          <td className="py-3 px-4 text-[#163d64]">{massInFluid[index]}</td>
                          <td className="py-3 px-4 text-[#163d64]">{compactnessRatio[index]}</td>
                          <td className="py-3 px-4 text-[#163d64]">{porosityArray[index]}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Chemical Composition */}
            {selectedFields.chemicalComposition && Object.keys(chemicalComposition).length > 0 && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#163d64]">Chemical Composition</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(chemicalComposition).map(([element, percentage]) => (
                    <div key={element} className="p-4 rounded-lg bg-gray-50 border border-[#163d64]/10">
                      <p className="text-sm text-[#163d64]/60">{element}</p>
                      <p className="text-[#163d64] font-medium">{percentage}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Standard Alloy Information */}
            {selectedFields.standardAlloy && standardAlloyName && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#163d64]">Standard Alloy Information</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-[#163d64]/60">Name</p>
                    <p className="text-[#163d64] font-medium">{standardAlloyName}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#163d64]/60">Country</p>
                    <p className="text-[#163d64] font-medium">{standardAlloyCountry}</p>
                  </div>
                </div>
              </div>
            )}

            {/* Master Sample Details */}
            {selectedFields.masterDetails && masterExists && (
              <div className="space-y-4">
                <h2 className="text-xl font-semibold text-[#163d64]">Master Sample Details</h2>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <p className="text-sm text-[#163d64]/60">Density of Master Sample</p>
                    <p className="text-[#163d64] font-medium">{densityOfItem}</p>
                  </div>
                  <div>
                    <p className="text-sm text-[#163d64]/60">Master Attachment</p>
                    <p className="text-[#163d64] font-medium">{masterAttachmentExists ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => navigate(-1)}
              className="px-8 py-4 rounded-xl bg-white/80 backdrop-blur-sm border border-[#163d64]/10 text-[#163d64] hover:bg-[#163d64] hover:text-white transition-all duration-300 font-semibold shadow-lg hover:shadow-xl"
            >
              Back
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleDownloadReport}
              className="px-8 py-4 rounded-xl bg-[#fa4516] text-white font-semibold hover:bg-[#fa4516]/90 transition-all duration-300 shadow-lg hover:shadow-xl"
            >
              Download Report
            </motion.button>
          </div>
        </motion.div>
      </main>

      <Footer />
    </div>
  );
}

export default LotReportPage;
