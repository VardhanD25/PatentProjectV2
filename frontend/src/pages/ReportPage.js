// src/pages/ReportPage.jsx
import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
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
    notes,
  } = location.state.reportData;

  const reportRef = useRef();
  const navigate = useNavigate();

  const [selectedFields, setSelectedFields] = useState({
    basicInfo: true,
    measurements: true,
    chemicalComposition: true,
    masterDetails: true,
    notes: true
  });

  const handleFieldToggle = (field) => {
    setSelectedFields(prev => ({
      ...prev,
      [field]: !prev[field]
    }));
  };

  const handleGoToHome = () => {
    navigate('/');
  };

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
              <h2 className="text-4xl font-bold text-[#163d64] mb-8 text-center">Report Preview</h2>

              <div className="space-y-8">
                {/* Field Selection */}
                <div className="bg-white/50 border border-[#163d64]/20 rounded-xl p-6">
                  <h3 className="text-xl font-semibold text-[#163d64] mb-4">Select Sections for Download</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                    {Object.entries(selectedFields).map(([field, isSelected]) => (
                      <div key={field} className="flex items-center space-x-3">
                        <input
                          type="checkbox"
                          id={field}
                          checked={isSelected}
                          onChange={() => handleFieldToggle(field)}
                          className="w-5 h-5 rounded border-[#163d64]/20 text-[#fa4516] focus:ring-[#fa4516] transition-colors duration-300"
                        />
                        <label htmlFor={field} className="text-sm font-medium text-[#163d64] select-none cursor-pointer">
                          {field.split(/(?=[A-Z])/).join(' ')}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#163d64]">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[#163d64]/70">Date</p>
                      <p className="text-[#163d64]">{date}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[#163d64]/70">Part Code</p>
                      <p className="text-[#163d64]">{partCode}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[#163d64]/70">Part Name</p>
                      <p className="text-[#163d64]">{partName}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[#163d64]/70">Theoretical Density</p>
                      <p className="text-[#163d64]">{density}</p>
                    </div>
                  </div>
                </div>

                {/* Measurements */}
                <div className="space-y-4">
                  <h3 className="text-xl font-semibold text-[#163d64]">Measurements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[#163d64]/70">Mass in Air</p>
                      <p className="text-[#163d64]">{massInAir}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[#163d64]/70">Mass in Fluid</p>
                      <p className="text-[#163d64]">{massInFluid}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[#163d64]/70">Fluid Density</p>
                      <p className="text-[#163d64]">{fluidDensity}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[#163d64]/70">Item Density</p>
                      <p className="text-[#163d64]">{densityOfItem}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-sm font-medium text-[#163d64]/70">Compactness Ratio</p>
                      <p className="text-[#163d64]">{compactnessRatio}</p>
                    </div>
                  </div>
                </div>

                {/* Chemical Composition */}
                {chemicalComposition && Object.keys(chemicalComposition).length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-[#163d64]">Chemical Composition</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {Object.entries(chemicalComposition).map(([element, percentage]) => (
                        <div key={element} className="bg-white/50 border border-[#163d64]/20 rounded-xl p-4">
                          <p className="text-sm font-medium text-[#163d64]/70">{element}</p>
                          <p className="text-[#163d64] font-medium">{percentage}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {notes && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-[#163d64]">Notes</h3>
                    <p className="text-[#163d64]">{notes}</p>
                  </div>
                )}

                {/* Master Details */}
                {masterExists === 'yes' && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-[#163d64]">Master Sample Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-[#163d64]/70">Master Sample has Attachment</p>
                        <p className="text-[#163d64]">{masterAttachmentExists ? 'Yes' : 'No'}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-sm font-medium text-[#163d64]/70">Density of Master Sample</p>
                        <p className="text-[#163d64]">{densityOfMasterSample}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
                  <button
                    onClick={handleGoToHome}
                    className="px-6 py-3 border-2 border-[#163d64] text-[#163d64] font-semibold rounded-xl hover:bg-[#163d64] hover:text-white transition-all duration-300"
                  >
                    Go to Home
                  </button>
                  <button
                    onClick={handlePrintReport}
                    className="px-6 py-3 bg-[#fa4516] text-white font-semibold rounded-xl hover:bg-[#fa4516]/90 transition-all duration-300"
                  >
                    Download PDF
                  </button>
                </div>
              </div>
            </div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default ReportPage;
