// src/pages/ReportPage.jsx
import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function ReportPage() {
  const location = useLocation();
  const {
    date,
    partCode,
    partName,
    theoreticalDensity: density,
    chemicalComposition,
    partAttachments,
    massInAir,
    massInFluid,
    fluidDensity,
    densityOfItem,
    compactnessRatio,
    masterExists,
    masterAttachmentExists,
    densityOfMasterSample,
    optionalReport,
    standardAlloyCountry,
    standardAlloyName,
    notes: initialNotes,
  } = location.state.reportData; // Access the passed data

  const [notes, setNotes] = useState(initialNotes || ''); // Initialize state for notes
  const reportRef = useRef(); // Reference to the report div
  const navigate = useNavigate();

  // Add state for field selection
  const [selectedFields, setSelectedFields] = useState({
    basicInfo: true,
    measurements: true,
    chemicalComposition: true,
    masterDetails: true,
    
  });

  const handleFieldToggle = (field) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleNotesChange = (e) => {
    setNotes(e.target.value); // Update notes as user types
  };

  const handleGoToHome = () => {
    navigate('/');
  };

  // Function to handle printing the report as PDF
  const handlePrintReport = () => {
    const reportContent = document.createElement('div');
    reportContent.style.padding = '20px';
    reportContent.style.color = '#000';
    reportContent.style.backgroundColor = '#fff';

    let content = '';

    // Only add selected fields to the PDF
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
          <p><strong>Mass in Air:</strong> ${massInAir}</p>
          <p><strong>Mass in Fluid:</strong> ${massInFluid}</p>
          <p><strong>Fluid Density:</strong> ${fluidDensity}</p>
          <p><strong>Item Density:</strong> ${densityOfItem}</p>
          <p><strong>Compactness Ratio:</strong> ${compactnessRatio}</p>
        </div>
      `;
    }

    if (selectedFields.chemicalComposition && chemicalComposition && Object.keys(chemicalComposition).length > 0) {
      content += `
        <div style="margin-bottom: 20px">
          <h2 style="font-size: 20px; margin-bottom: 10px">Chemical Composition</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px">
            <tr style="background-color: #f3f4f6">
              <th style="border: 1px solid #000; padding: 8px">Element</th>
              <th style="border: 1px solid #000; padding: 8px">Weight %</th>
            </tr>
            ${Object.entries(chemicalComposition).map(([element, weight]) => `
              <tr>
                <td style="border: 1px solid #000; padding: 8px">${element}</td>
                <td style="border: 1px solid #000; padding: 8px">${weight}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      `;
    }

    if (selectedFields.notes && notes) {
      content += `
        <div style="margin-bottom: 20px">
          <h2 style="font-size: 20px; margin-bottom: 10px">Notes</h2>
          <p>${notes}</p>
        </div>
      `;
    }

    if (selectedFields.masterDetails && masterExists === 'yes') {
      content += `
        <div style="margin-bottom: 20px">
          <h2 style="font-size: 20px; margin-bottom: 10px">Master Sample Details</h2>
          <p><strong>Master Sample has Attachment:</strong> ${masterAttachmentExists ? 'Yes' : 'No'}</p>
          <p><strong>Density of Master Sample:</strong> ${densityOfMasterSample}</p>
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
            Report Preview
          </h2>

          {/* Field Selection */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8 shadow-xl">
            <h3 className="text-xl font-semibold text-slate-200 mb-6">Select Sections for Download</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
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

          {/* Report Preview - Always show all sections */}
          <div className="bg-slate-800/50 backdrop-blur-sm border border-slate-700/50 rounded-lg p-8 shadow-xl space-y-8">
           {/* Basic Information - Always visible */}
<div className="space-y-6">
  <h3 className="text-xl font-semibold text-slate-200">Basic Information</h3>
  <div className="space-y-4">
    <div className="flex items-center">
      <p className="text-slate-400 w-1/3">Date:</p>
      <p className="text-slate-200">{date}</p>
    </div>
    <div className="flex items-center">
      <p className="text-slate-400 w-1/3">Part Code:</p>
      <p className="text-slate-200">{partCode}</p>
    </div>
    <div className="flex items-center">
      <p className="text-slate-400 w-1/3">Part Name:</p>
      <p className="text-slate-200">{partName}</p>
    </div>
    <div className="flex items-center">
      <p className="text-slate-400 w-1/3">Theoretical Density:</p>
      <p className="text-slate-200">{density}</p>
    </div>
  </div>
</div>
           {/* Measurements - Always visible */}
<div className="space-y-6">
  <h3 className="text-xl font-semibold text-slate-200">Measurements</h3>
  <div className="space-y-4">
    <div className="flex items-center">
      <p className="text-slate-400 w-1/3">Mass in Air:</p>
      <p className="text-slate-200">{massInAir}</p>
    </div>
    <div className="flex items-center">
      <p className="text-slate-400 w-1/3">Mass in Fluid:</p>
      <p className="text-slate-200">{massInFluid}</p>
    </div>
    <div className="flex items-center">
      <p className="text-slate-400 w-1/3">Fluid Density:</p>
      <p className="text-slate-200">{fluidDensity}</p>
    </div>
    <div className="flex items-center">
      <p className="text-slate-400 w-1/3">Item Density:</p>
      <p className="text-slate-200">{densityOfItem}</p>
    </div>
    <div className="flex items-center">
      <p className="text-slate-400 w-1/3">Compactness Ratio:</p>
      <p className="text-slate-200">{compactnessRatio}</p>
    </div>
  </div>
</div>

            {/* Chemical Composition - Show if exists */}
            {chemicalComposition && Object.keys(chemicalComposition).length > 0 && (
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

            {/* Notes - Show if exists */}
            {notes && (
              <div className="space-y-6">
                <h3 className="text-xl font-semibold text-slate-200">Notes</h3>
                <textarea
                  value={notes}
                  onChange={handleNotesChange}
                  className="w-full px-4 py-3 rounded-lg bg-slate-800/30 border border-slate-700/50 text-slate-200 focus:outline-none focus:border-slate-600 focus:ring-1 focus:ring-slate-600"
                  rows="4"
                  placeholder="Add any notes here..."
                />
              </div>
            )}

            {/* Master Details - Show if exists */}
            {masterExists === 'yes' && (
  <div className="space-y-6">
    <h3 className="text-xl font-semibold text-slate-200">Master Sample Details</h3>
    <div className="space-y-4">
      <div className="flex items-center">
        <p className="text-slate-400 w-1/3">Master Sample has Attachment:</p>
        <p className="text-slate-200">{masterAttachmentExists ? 'Yes' : 'No'}</p>
      </div>
      <div className="flex items-center">
        <p className="text-slate-400 w-1/3">Density of Master Sample:</p>
        <p className="text-slate-200">{densityOfMasterSample}</p>
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
              onClick={() => navigate('/')}
              className="px-6 py-2 rounded-lg bg-slate-800/50 border border-slate-700/50 text-slate-300 hover:bg-slate-800/70 hover:text-white transition-all duration-300"
            >
              Back to Home
            </motion.button>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handlePrintReport}
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

export default ReportPage;
