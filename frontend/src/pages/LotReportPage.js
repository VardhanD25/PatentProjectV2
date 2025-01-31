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

  const {
    date,
    selectedPartCode: partCode,
    partName,
    theoreticalDensity: density,
    chemicalComposition,
    partAttachments,
    partMassAirArray: massInAir,
    partMassFluidArray: massInFluid,
    densityOfFluid: fluidDensity,
    densityOfMasterSample: densityOfItem,
    compactnessRatioArray: compactnessRatio,
    porosityArray,
    masterExists,
    masterAttachmentExists,
    standardAlloyCountry,
    standardAlloyName,
    optionalReport = true,
  } = location.state;

  const handleFieldToggle = (field) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleDownloadReport = () => {
    const reportContent = document.createElement('div');
    reportContent.style.padding = '20px';
    reportContent.style.color = '#000';
    reportContent.style.backgroundColor = '#fff';

    let content = '';
    
    if (selectedFields.basicInfo) {
      content += `
        <div style="margin-bottom: 20px">
          <h2 style="font-size: 20px; margin-bottom: 10px">Basic Information</h2>
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
          <h2 style="font-size: 20px; margin-bottom: 10px">Measurements</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px">
            <thead>
              <tr style="background-color: #f3f4f6">
                <th style="border: 1px solid #000; padding: 8px">Serial Number</th>
                <th style="border: 1px solid #000; padding: 8px">Mass in Air (g)</th>
                <th style="border: 1px solid #000; padding: 8px">Mass in Fluid (g)</th>
                <th style="border: 1px solid #000; padding: 8px">Compactness Ratio</th>
                <th style="border: 1px solid #000; padding: 8px">Porosity</th>
              </tr>
            </thead>
            <tbody>
              ${massInAir.map((_, index) => `
                <tr>
                  <td style="border: 1px solid #000; padding: 8px">${index + 1}</td>
                  <td style="border: 1px solid #000; padding: 8px">${massInAir[index]}</td>
                  <td style="border: 1px solid #000; padding: 8px">${massInFluid[index]}</td>
                  <td style="border: 1px solid #000; padding: 8px">${compactnessRatio[index]}</td>
                  <td style="border: 1px solid #000; padding: 8px">${porosityArray[index]}</td>
                </tr>
              `).join('')}
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
    <div className="min-h-screen bg-slate-900 relative">
      <Navbar />
      
      {/* Grid Background */}
      <div className="absolute inset-0 bg-grid-slate-700/[0.05] bg-[size:3rem_3rem] pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-slate-900/90 to-slate-900 pointer-events-none" />
      
      <main className="container mx-auto px-4 py-24 relative">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="space-y-12"
        >
          <h2 className="text-3xl font-bold text-slate-200 text-center">
            Lot Report Preview
          </h2>

          {/* Field Selection */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8 shadow-xl">
            <h3 className="text-xl font-semibold text-slate-200 mb-6">Select Sections for Download</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {Object.entries(selectedFields).map(([field, isSelected]) => (
                <div key={field} className="flex items-center space-x-3">
                  <input
                    type="checkbox"
                    id={field}
                    checked={isSelected}
                    onChange={() => handleFieldToggle(field)}
                    className="w-5 h-5 rounded border-slate-700 bg-slate-800/50 text-slate-200 focus:ring-slate-600"
                  />
                  <label htmlFor={field} className="text-slate-200 select-none cursor-pointer">
                    {field.split(/(?=[A-Z])/).join(' ')}
                  </label>
                </div>
              ))}
            </div>
          </div>

          {/* Visible Report Preview */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8 shadow-xl space-y-8">
            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-200">Basic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-slate-400">Date:</p>
                  <p className="text-slate-200">{date}</p>
                </div>
                <div>
                  <p className="text-slate-400">Part Code:</p>
                  <p className="text-slate-200">{partCode}</p>
                </div>
                <div>
                  <p className="text-slate-400">Part Name:</p>
                  <p className="text-slate-200">{partName}</p>
                </div>
                <div>
                  <p className="text-slate-400">Theoretical Density:</p>
                  <p className="text-slate-200">{density}</p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="text-xl font-semibold text-slate-200">Measurements</h3>
              <div className="overflow-x-auto">
                <table className="w-full border-collapse">
                  <thead>
                    <tr className="border-b border-slate-700/50">
                      <th className="py-3 px-4 text-left text-slate-300">Serial Number</th>
                      <th className="py-3 px-4 text-left text-slate-300">Mass in Air (g)</th>
                      <th className="py-3 px-4 text-left text-slate-300">Mass in Fluid (g)</th>
                      <th className="py-3 px-4 text-left text-slate-300">Compactness Ratio</th>
                      <th className="py-3 px-4 text-left text-slate-300">Porosity</th>
                    </tr>
                  </thead>
                  <tbody>
                    {massInAir.map((_, index) => (
                      <tr key={index} className="border-b border-slate-700/30">
                        <td className="py-3 px-4 text-slate-200">{index + 1}</td>
                        <td className="py-3 px-4 text-slate-200">{massInAir[index]}</td>
                        <td className="py-3 px-4 text-slate-200">{massInFluid[index]}</td>
                        <td className="py-3 px-4 text-slate-200">{compactnessRatio[index]}</td>
                        <td className="py-3 px-4 text-slate-200">{porosityArray[index]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {chemicalComposition && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-200">Chemical Composition</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                  {Object.entries(chemicalComposition).map(([element, percentage]) => (
                    <div key={element} className="bg-slate-800/30 p-4 rounded-lg">
                      <p className="text-slate-400">{element}</p>
                      <p className="text-slate-200">{percentage}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {standardAlloyName && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-200">Standard Alloy Information</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400">Name:</p>
                    <p className="text-slate-200">{standardAlloyName}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Country:</p>
                    <p className="text-slate-200">{standardAlloyCountry}</p>
                  </div>
                </div>
              </div>
            )}

            {masterExists && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-200">Master Sample Details</h3>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-slate-400">Density of Master Sample:</p>
                    <p className="text-slate-200">{densityOfItem}</p>
                  </div>
                  <div>
                    <p className="text-slate-400">Master Attachment:</p>
                    <p className="text-slate-200">{masterAttachmentExists ? 'Yes' : 'No'}</p>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex justify-end gap-4">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => navigate(-1)}
              className="px-6 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all duration-300"
            >
              Back
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleDownloadReport}
              className="px-6 py-2 rounded-lg bg-slate-200 text-slate-900 hover:bg-white transition-all duration-300"
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
