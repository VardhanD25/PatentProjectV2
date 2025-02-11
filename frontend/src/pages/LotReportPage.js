import React, { useRef, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import html2pdf from 'html2pdf.js';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, BorderStyle } from 'docx';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function LotReportPage() {
  const location = useLocation();
  const navigate = useNavigate();
  
  
  const [selectedFields, setSelectedFields] = useState({
    basicInfo: true,
    measurements: true,
    chemicalComposition: true,
    standardAlloy: true,
    masterDetails: true,
  });

  
  console.log('Location State:', location.state);
  console.log('item numbers:', location.state?.serialNumbers);

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

  // Generate or use passed item numbers
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
                <th style="border: 1px solid #163d64; padding: 8px; color: white">Item Number</th>
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
  // word download sathi template tyyar keliye info is just printed in that specific format
  const handleDownloadWord = async () => {
    try {
      const children = [];

      // Title
      children.push(
        new Paragraph({
          children: [new TextRun({ text: "Lot Report", bold: true, size: 32 })],
          spacing: { after: 400 },
          alignment: AlignmentType.CENTER
        })
      );

      // Basic Information
      if (selectedFields.basicInfo) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "Basic Information", bold: true, size: 24 })],
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Date: ", bold: true }),
              new TextRun(date || 'N/A')
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Part Code: ", bold: true }),
              new TextRun(partCode || 'N/A')
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Part Name: ", bold: true }),
              new TextRun(partName || 'N/A')
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Theoretical Density: ", bold: true }),
              new TextRun(density || 'N/A')
            ],
            spacing: { after: 200 }
          })
        );
      }

      // Measurements
      if (selectedFields.measurements) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "Measurements", bold: true, size: 24 })],
            spacing: { before: 400, after: 200 }
          })
        );

        const table = new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          rows: [
            new TableRow({
              children: [
                "item number",
                "Mass in Air (g)",
                "Mass in Fluid (g)",
                "Compactness Ratio",
                "Porosity"
              ].map(header => 
                new TableCell({
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: header, bold: true })]
                  })],
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1 },
                    bottom: { style: BorderStyle.SINGLE, size: 1 },
                    left: { style: BorderStyle.SINGLE, size: 1 },
                    right: { style: BorderStyle.SINGLE, size: 1 },
                  }
                })
              )
            }),
            ...massInAir.map((_, index) => 
              new TableRow({
                children: [
                  serialNumbers[index].toString().padStart(6, '0'),
                  massInAir[index].toString(),
                  massInFluid[index].toString(),
                  compactnessRatio[index].toString(),
                  porosityArray[index].toString()
                ].map(cell => 
                  new TableCell({
                    children: [new Paragraph(cell)],
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1 },
                      bottom: { style: BorderStyle.SINGLE, size: 1 },
                      left: { style: BorderStyle.SINGLE, size: 1 },
                      right: { style: BorderStyle.SINGLE, size: 1 },
                    }
                  })
                )
              })
            )
          ]
        });

        children.push(table);
      }

      // Chemical Composition
      if (selectedFields.chemicalComposition && Object.keys(chemicalComposition).length > 0) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "Chemical Composition", bold: true, size: 24 })],
            spacing: { before: 400, after: 200 }
          })
        );

        const compositionTable = new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Element", bold: true })] })],
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1 },
                    bottom: { style: BorderStyle.SINGLE, size: 1 },
                    left: { style: BorderStyle.SINGLE, size: 1 },
                    right: { style: BorderStyle.SINGLE, size: 1 },
                  }
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "Percentage", bold: true })] })],
                  borders: {
                    top: { style: BorderStyle.SINGLE, size: 1 },
                    bottom: { style: BorderStyle.SINGLE, size: 1 },
                    left: { style: BorderStyle.SINGLE, size: 1 },
                    right: { style: BorderStyle.SINGLE, size: 1 },
                  }
                })
              ]
            }),
            ...Object.entries(chemicalComposition).map(([element, percentage]) => 
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph(element)],
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1 },
                      bottom: { style: BorderStyle.SINGLE, size: 1 },
                      left: { style: BorderStyle.SINGLE, size: 1 },
                      right: { style: BorderStyle.SINGLE, size: 1 },
                    }
                  }),
                  new TableCell({
                    children: [new Paragraph(`${percentage}%`)],
                    borders: {
                      top: { style: BorderStyle.SINGLE, size: 1 },
                      bottom: { style: BorderStyle.SINGLE, size: 1 },
                      left: { style: BorderStyle.SINGLE, size: 1 },
                      right: { style: BorderStyle.SINGLE, size: 1 },
                    }
                  })
                ]
              })
            )
          ]
        });

        children.push(compositionTable);
      }

      const doc = new Document({
        sections: [{
          properties: {},
          children: children
        }]
      });

      const blob = await Packer.toBlob(doc);
      saveAs(blob, `${partCode}_lot_report.docx`);

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
          ['Measurements', '', '', '', ''],
          ['item number', 'Mass in Air (g)', 'Mass in Fluid (g)', 'Compactness Ratio', 'Porosity'],
          ...massInAir.map((_, index) => [
            serialNumbers[index].toString().padStart(6, '0'),
            massInAir[index],
            massInFluid[index],
            compactnessRatio[index],
            porosityArray[index]
          ]),
          ['', ''] // Empty row for spacing
        );
      }

      // Add Chemical Composition
      if (selectedFields.chemicalComposition && Object.keys(chemicalComposition).length > 0) {
        data.push(
          ['Chemical Composition', ''],
          ['Element', 'Percentage'],
          ...Object.entries(chemicalComposition).map(([element, percentage]) => [element, percentage]),
          ['', ''] // Empty row for spacing
        );
      }

      const ws = XLSX.utils.aoa_to_sheet(data);
      
      // Set column widths
      ws['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];

      XLSX.utils.book_append_sheet(wb, ws, 'Lot Report');
      
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([excelBuffer]), `${partCode}_lot_report.xlsx`);
    } catch (error) {
      console.error('Error generating Excel file:', error);
      alert('Error generating Excel file. Please try again.');
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
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-8"
            >
              <h1 className="text-4xl font-bold text-[#163d64] text-center mb-12">
                Lot Report Preview
              </h1>

              {/* Field Selection */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-slate-200">
                <h2 className="text-2xl font-semibold text-[#163d64] mb-6">Select Fields for Report</h2>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
                  {Object.entries(selectedFields).map(([field, isSelected]) => (
                    <div key={field} className="flex items-center gap-3">
                      <input
                        type="checkbox"
                        id={field}
                        checked={isSelected}
                        onChange={() => handleFieldToggle(field)}
                        className="w-6 h-6 rounded-lg border-2 border-[#163d64]/20 text-[#fa4516] focus:ring-[#fa4516]/20 transition-colors"
                      />
                      <label 
                        htmlFor={field} 
                        className="text-lg text-[#163d64] select-none cursor-pointer hover:text-[#fa4516] transition-colors"
                      >
                        {formatFieldName(field)}
                      </label>
                    </div>
                  ))}
                </div>
              </div>

              {/* Report Preview */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-slate-200 space-y-10">
                {/* Basic Information */}
                {selectedFields.basicInfo && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-[#163d64]">Basic Information</h2>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="p-6 rounded-xl bg-[#163d64]/5">
                        <p className="text-lg text-[#163d64]/70 mb-2">Date</p>
                        <p className="text-xl text-[#163d64] font-medium">{date}</p>
                      </div>
                      <div className="p-6 rounded-xl bg-[#163d64]/5">
                        <p className="text-lg text-[#163d64]/70 mb-2">Part Code</p>
                        <p className="text-xl text-[#163d64] font-medium">{partCode}</p>
                      </div>
                      <div className="p-6 rounded-xl bg-[#163d64]/5">
                        <p className="text-lg text-[#163d64]/70 mb-2">Part Name</p>
                        <p className="text-xl text-[#163d64] font-medium">{partName}</p>
                      </div>
                      <div className="p-6 rounded-xl bg-[#163d64]/5">
                        <p className="text-lg text-[#163d64]/70 mb-2">Theoretical Density</p>
                        <p className="text-xl text-[#163d64] font-medium">{density}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Measurements Table */}
                {selectedFields.measurements && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-[#163d64]">Measurements</h2>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="py-4 px-6 text-left bg-[#163d64] text-white text-lg font-medium rounded-tl-xl">item number</th>
                            <th className="py-4 px-6 text-left bg-[#163d64] text-white text-lg font-medium">Mass in Air (g)</th>
                            <th className="py-4 px-6 text-left bg-[#163d64] text-white text-lg font-medium">Mass in Fluid (g)</th>
                            <th className="py-4 px-6 text-left bg-[#163d64] text-white text-lg font-medium">Compactness Ratio</th>
                            <th className="py-4 px-6 text-left bg-[#163d64] text-white text-lg font-medium rounded-tr-xl">Porosity</th>
                          </tr>
                        </thead>
                        <tbody>
                          {massInAir.map((_, index) => (
                            <tr key={index} className="border-b border-[#163d64]/10 hover:bg-[#163d64]/5 transition-colors">
                              <td className="py-4 px-6 font-mono text-lg text-[#163d64]">
                                {serialNumbers[index].toString().padStart(6, '0')}
                              </td>
                              <td className="py-4 px-6 text-lg text-[#163d64]">{massInAir[index]}</td>
                              <td className="py-4 px-6 text-lg text-[#163d64]">{massInFluid[index]}</td>
                              <td className="py-4 px-6 text-lg text-[#163d64] bg-[#fff0f0]">{compactnessRatio[index]}</td>
                              <td className="py-4 px-6 text-lg text-[#163d64] bg-[#fff0f0]">{porosityArray[index]}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* Chemical Composition */}
                {selectedFields.chemicalComposition && Object.keys(chemicalComposition).length > 0 && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-[#163d64]">Chemical Composition</h2>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                      {Object.entries(chemicalComposition).map(([element, percentage]) => (
                        <div key={element} className="p-6 rounded-xl bg-[#163d64]/5">
                          <p className="text-lg text-[#163d64]/70 mb-2">{element}</p>
                          <p className="text-xl text-[#163d64] font-medium">{percentage}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Standard Alloy Information */}
                {selectedFields.standardAlloy && standardAlloyName && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-[#163d64]">Standard Alloy Information</h2>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="p-6 rounded-xl bg-[#163d64]/5">
                        <p className="text-lg text-[#163d64]/70 mb-2">Name</p>
                        <p className="text-xl text-[#163d64] font-medium">{standardAlloyName}</p>
                      </div>
                      <div className="p-6 rounded-xl bg-[#163d64]/5">
                        <p className="text-lg text-[#163d64]/70 mb-2">Country</p>
                        <p className="text-xl text-[#163d64] font-medium">{standardAlloyCountry}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Master Sample Details */}
                {selectedFields.masterDetails && masterExists && (
                  <div className="space-y-6">
                    <h2 className="text-2xl font-semibold text-[#163d64]">Master Sample Details</h2>
                    <div className="grid grid-cols-2 gap-8">
                      <div className="p-6 rounded-xl bg-[#163d64]/5">
                        <p className="text-lg text-[#163d64]/70 mb-2">Density of Master Sample</p>
                        <p className="text-xl text-[#163d64] font-medium">{densityOfItem}</p>
                      </div>
                      <div className="p-6 rounded-xl bg-[#163d64]/5">
                        <p className="text-lg text-[#163d64]/70 mb-2">Master Attachment</p>
                        <p className="text-xl text-[#163d64] font-medium">{masterAttachmentExists ? 'Yes' : 'No'}</p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap justify-end gap-4">
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => navigate(-1)}
                  className="px-8 py-4 border-2 border-[#163d64] text-[#163d64] font-semibold rounded-xl hover:bg-[#163d64] hover:text-white transition-all duration-300"
                >
                  Back
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadReport}
                  className="px-8 py-4 bg-[#fa4516] text-white font-semibold rounded-xl hover:bg-[#fa4516]/90 transition-all duration-300"
                >
                  Download PDF
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadWord}
                  className="px-8 py-4 bg-[#163d64] text-white font-semibold rounded-xl hover:bg-[#163d64]/90 transition-all duration-300"
                >
                  Download Word
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleDownloadExcel}
                  className="px-8 py-4 bg-[#4CAF50] text-white font-semibold rounded-xl hover:bg-[#4CAF50]/90 transition-all duration-300"
                >
                  Download Excel
                </motion.button>
              </div>
            </motion.div>
          </div>
        </main>

        <Footer />
      </div>
    </div>
  );
}

export default LotReportPage;
