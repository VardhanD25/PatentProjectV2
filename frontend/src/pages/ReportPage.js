// src/pages/ReportPage.jsx
import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle } from 'docx';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
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
    notes,
    porosity,
  } = location.state.reportData;

  const reportRef = useRef();
  const navigate = useNavigate();

  const [selectedFields, setSelectedFields] = useState({
    basicInfo: true,
    measurements: true,
    chemicalComposition: true,
    masterDetails: true,
    compactnessRatio: true,
    ...(porosity && porosity !== 'N/A' ? { porosity: true } : {})
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
        </div>
      `;
    }

    if (selectedFields.compactnessRatio) {
      content += `
        <div style="margin-bottom: 20px">
          <h2 style="font-size: 20px; margin-bottom: 10px">Compactness Ratio</h2>
          <p><strong>Compactness Ratio:</strong> ${compactnessRatio}</p>
        </div>
      `;
    }

    if (selectedFields.porosity && porosity && porosity !== 'N/A') {
      content += `
        <div style="margin-bottom: 20px">
          <h2 style="font-size: 20px; margin-bottom: 10px">Porosity</h2>
          <p><strong>Porosity:</strong> ${porosity}</p>
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
  // word download sathi template tyyar keliye info is just printed in that specific format
  const handleDownloadWord = async () => {
    try {
      const doc = new Document({
        sections: [{
          properties: {},
          children: [
            new Paragraph({
              children: [
                new TextRun({
                  text: "Report",
                  bold: true,
                  size: 32,
                }),
              ],
              spacing: { after: 400 },
            }),

            // Basic Information
            ...(selectedFields.basicInfo ? [
              new Paragraph({
                children: [new TextRun({ text: "Basic Information", bold: true, size: 28 })],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Date: ", bold: true }),
                  new TextRun(date),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Part Code: ", bold: true }),
                  new TextRun(partCode),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Part Name: ", bold: true }),
                  new TextRun(partName),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Theoretical Density: ", bold: true }),
                  new TextRun(density),
                ],
                spacing: { after: 200 },
              }),
            ] : []),

            // Measurements
            ...(selectedFields.measurements ? [
              new Paragraph({
                children: [new TextRun({ text: "Measurements", bold: true, size: 28 })],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Mass in Air: ", bold: true }),
                  new TextRun(massInAir),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Mass in Fluid: ", bold: true }),
                  new TextRun(massInFluid),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Fluid Density: ", bold: true }),
                  new TextRun(fluidDensity),
                ],
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Item Density: ", bold: true }),
                  new TextRun(densityOfItem),
                ],
                spacing: { after: 200 },
              }),
            ] : []),

            // Chemical Composition
            ...(selectedFields.chemicalComposition && Object.keys(chemicalComposition).length > 0 ? [
              new Paragraph({
                children: [new TextRun({ text: "Chemical Composition", bold: true, size: 28 })],
                spacing: { after: 200 },
              }),
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph("Element")],
                        borders: {
                          top: { style: BorderStyle.SINGLE, size: 1 },
                          bottom: { style: BorderStyle.SINGLE, size: 1 },
                          left: { style: BorderStyle.SINGLE, size: 1 },
                          right: { style: BorderStyle.SINGLE, size: 1 },
                        },
                      }),
                      new TableCell({
                        children: [new Paragraph("Weight %")],
                        borders: {
                          top: { style: BorderStyle.SINGLE, size: 1 },
                          bottom: { style: BorderStyle.SINGLE, size: 1 },
                          left: { style: BorderStyle.SINGLE, size: 1 },
                          right: { style: BorderStyle.SINGLE, size: 1 },
                        },
                      }),
                    ],
                  }),
                  ...Object.entries(chemicalComposition).map(([element, weight]) =>
                    new TableRow({
                      children: [
                        new TableCell({
                          children: [new Paragraph(element)],
                          borders: {
                            top: { style: BorderStyle.SINGLE, size: 1 },
                            bottom: { style: BorderStyle.SINGLE, size: 1 },
                            left: { style: BorderStyle.SINGLE, size: 1 },
                            right: { style: BorderStyle.SINGLE, size: 1 },
                          },
                        }),
                        new TableCell({
                          children: [new Paragraph(weight)],
                          borders: {
                            top: { style: BorderStyle.SINGLE, size: 1 },
                            bottom: { style: BorderStyle.SINGLE, size: 1 },
                            left: { style: BorderStyle.SINGLE, size: 1 },
                            right: { style: BorderStyle.SINGLE, size: 1 },
                          },
                        }),
                      ],
                    })
                  ),
                ],
              }),
            ] : []),
          ],
        }],
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${partCode}_report.docx`);
    } catch (error) {
      console.error('Error generating Word document:', error);
      alert('Error generating Word document. Please try again.');
    }
  };
  // excel download sathi template tyyar keliye info is just printed in that specific format
  const handleDownloadExcel = () => {
    try {
      
      const wb = XLSX.utils.book_new();
      const data = [];

      // Add Basic Information
      if (selectedFields.basicInfo) {
        data.push(
          ['Basic Information', ''],
          ['Date', date],
          ['Part Code', partCode],
          ['Part Name', partName],
          ['Theoretical Density', density],
          ['', ''] // Empty row for spacing
        );
      }

      // Add Measurements
      if (selectedFields.measurements) {
        data.push(
          ['Measurements', ''],
          ['Mass in Air', massInAir],
          ['Mass in Fluid', massInFluid],
          ['Fluid Density', fluidDensity],
          ['Item Density', densityOfItem],
          ['', ''] // Empty row for spacing
        );
      }

      // Add Compactness Ratio
      if (selectedFields.compactnessRatio) {
        data.push(
          ['Compactness Ratio', ''],
          ['Value', compactnessRatio],
          ['', ''] // Empty row for spacing
        );
      }

      // Add Porosity
      if (selectedFields.porosity && porosity && porosity !== 'N/A') {
        data.push(
          ['Porosity', ''],
          ['Value', porosity],
          ['', ''] 
        );
      }

      // Add Chemical Composition
      if (selectedFields.chemicalComposition && Object.keys(chemicalComposition).length > 0) {
        data.push(
          ['Chemical Composition', ''],
          ['Element', 'Weight %'],
          ...Object.entries(chemicalComposition).map(([element, weight]) => [element, weight]),
          ['', ''] // space add keli adhi gichmid hoat hoti
        );
      }

      // Add Notes
      if (selectedFields.notes && notes) {
        data.push(
          ['Notes', ''],
          ['Content', notes],
          ['', ''] 
        );
      }

      // Add Master Details
      if (selectedFields.masterDetails && masterExists === 'yes') {
        data.push(
          ['Master Sample Details', ''],
          ['Has Attachment', masterAttachmentExists ? 'Yes' : 'No'],
          ['Density of Master Sample', densityOfMasterSample],
          ['', ''] // Empty row for spacing
        );
      }

      
      const ws = XLSX.utils.aoa_to_sheet(data);

      // Set column widths
      const colWidths = [{ wch: 30 }, { wch: 20 }];
      ws['!cols'] = colWidths;

      // Add styling
      for (let i = 0; i < data.length; i++) {
        const cell = XLSX.utils.encode_cell({ r: i, c: 0 });
        if (!ws[cell]) continue;
        
        if (data[i][0].includes('Information') || 
            data[i][0] === 'Measurements' || 
            data[i][0] === 'Chemical Composition' ||
            data[i][0] === 'Master Sample Details') {
          ws[cell].s = {
            font: { bold: true, color: { rgb: "163D64" }, sz: 14 },
            fill: { fgColor: { rgb: "F3F4F6" } }
          };
        }
      }

      
      XLSX.utils.book_append_sheet(wb, ws, 'Report');

      
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      const blob = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      saveAs(blob, `${partCode}_report.xlsx`);

    } catch (error) {
      console.error('Error generating Excel file:', error);
      alert('Error generating Excel file. Please try again.');
    }
  };

  const formatFieldName = (fieldName) => {
    return fieldName
      .split(/(?=[A-Z])/)
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
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
              <h2 className="text-4xl font-bold text-[#163d64] mb-10 text-center">Report Preview</h2>

              <div className="space-y-8">
                {/* Field Selection */}
                <div className="bg-white/50 border border-[#163d64]/20 rounded-xl p-6">
                  <h3 className="text-3xl font-semibold text-[#163d64] mb-6">Select Sections for Download</h3>
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
                        <label htmlFor={field} className="text-xl font-medium text-[#163d64] select-none cursor-pointer">
                          {formatFieldName(field)}
                        </label>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-3xl font-semibold text-[#163d64]">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-xl font-medium text-[#163d64]/70">Date</p>
                      <p className="text-2xl text-[#163d64]">{date}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-medium text-[#163d64]/70">Part Code</p>
                      <p className="text-2xl text-[#163d64]">{partCode}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-medium text-[#163d64]/70">Part Name</p>
                      <p className="text-2xl text-[#163d64]">{partName}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-medium text-[#163d64]/70">Theoretical Density</p>
                      <p className="text-2xl text-[#163d64]">{density}</p>
                    </div>
                  </div>
                </div>

                {/* Measurements */}
                <div className="space-y-4">
                  <h3 className="text-3xl font-semibold text-[#163d64]">Measurements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-xl font-medium text-[#163d64]/70">Mass in Air</p>
                      <p className="text-2xl text-[#163d64]">{massInAir}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-medium text-[#163d64]/70">Mass in Fluid</p>
                      <p className="text-2xl text-[#163d64]">{massInFluid}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-medium text-[#163d64]/70">Fluid Density</p>
                      <p className="text-2xl text-[#163d64]">{fluidDensity}</p>
                    </div>
                    <div className="space-y-2">
                      <p className="text-xl font-medium text-[#163d64]/70">Item Density</p>
                      <p className="text-2xl text-[#163d64]">{densityOfItem}</p>
                    </div>
                  </div>
                </div>

                {/* Compactness Ratio */}
                <div className="space-y-4">
                  <h3 className="text-3xl font-semibold text-[#163d64]">Compactness Ratio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <p className="text-xl font-medium text-[#163d64]/70">Compactness Ratio</p>
                      <p className="text-2xl text-[#163d64]">{compactnessRatio}</p>
                    </div>
                  </div>
                </div>

                {/* Porosity */}
                {porosity && porosity !== 'N/A' && (
                  <div className="space-y-4">
                    <h3 className="text-3xl font-semibold text-[#163d64]">Porosity</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-xl font-medium text-[#163d64]/70">Porosity</p>
                        <p className="text-2xl text-[#163d64]">{porosity}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chemical Composition */}
                {chemicalComposition && Object.keys(chemicalComposition).length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-3xl font-semibold text-[#163d64]">Chemical Composition</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {Object.entries(chemicalComposition).map(([element, percentage]) => (
                        <div key={element} className="bg-white/50 border border-[#163d64]/20 rounded-xl p-4">
                          <p className="text-xl font-medium text-[#163d64]/70">{element}</p>
                          <p className="text-2xl text-[#163d64] font-medium">{percentage}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {notes && (
                  <div className="space-y-4">
                    <h3 className="text-3xl font-semibold text-[#163d64]">Notes</h3>
                    <p className="text-2xl text-[#163d64]">{notes}</p>
                  </div>
                )}

                {/* Master Details */}
                {masterExists === 'yes' && (
                  <div className="space-y-4">
                    <h3 className="text-3xl font-semibold text-[#163d64]">Master Sample Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                        <p className="text-xl font-medium text-[#163d64]/70">Master Sample has Attachment</p>
                        <p className="text-2xl text-[#163d64]">{masterAttachmentExists ? 'Yes' : 'No'}</p>
                      </div>
                      <div className="space-y-2">
                        <p className="text-xl font-medium text-[#163d64]/70">Density of Master Sample</p>
                        <p className="text-2xl text-[#163d64]">{densityOfMasterSample}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                  <button
                    onClick={handleGoToHome}
                    className="px-8 py-4 border-2 border-[#163d64] text-[#163d64] font-semibold rounded-xl hover:bg-[#163d64] hover:text-white transition-all duration-300"
                  >
                    Go to Home
                  </button>
                  <button
                    onClick={handlePrintReport}
                    className="px-8 py-4 bg-[#fa4516] text-white font-semibold rounded-xl hover:bg-[#fa4516]/90 transition-all duration-300"
                  >
                    Download PDF
                  </button>
                  <button
                    onClick={handleDownloadWord}
                    className="px-8 py-4 bg-[#163d64] text-white font-semibold rounded-xl hover:bg-[#163d64]/90 transition-all duration-300"
                  >
                    Download Word
                  </button>
                  <button
                    onClick={handleDownloadExcel}
                    className="px-8 py-4 bg-[#4CAF50] text-white font-semibold rounded-xl hover:bg-[#4CAF50]/90 transition-all duration-300"
                  >
                    Download Excel
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
