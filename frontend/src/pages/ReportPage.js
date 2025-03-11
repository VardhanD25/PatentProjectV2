// src/pages/ReportPage.jsx
import React, { useState, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2pdf from 'html2pdf.js';
import { Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell, BorderStyle ,AlignmentType} from 'docx';
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
    densityType,
    chemicalComposition,
    attachmentExists,
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
    standardAlloyReference,
    standardAlloyName,
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
    reportContent.style.padding = '15px';
    reportContent.style.backgroundColor = '#fff';
    reportContent.style.fontFamily = 'monospace';
  
    let content = `
      <h1 style="font-size: 35px; text-align: center; margin-bottom: 20px; color: #163d64; font-family: sans-serif;">Compactness Evaluation</h1>
    `;
  
    if (selectedFields.basicInfo) {
      content += `
        <div style="margin-bottom: 20px; text-align: center;">
          <h2 style="color: #163d64; font-size: 30px; margin-bottom: 10px">Basic Information</h2>
          <p style="font-size: 27px"><strong>Date:</strong> ${date}</p>
          <p style="font-size: 27px"><strong>Part Code:</strong> ${partCode}</p>
          <p style="font-size: 27px"><strong>Part Name:</strong> ${partName}</p>
          <p style="font-size: 27px"><strong>Theoretical Density:</strong> ${density}</p>
          <p style="font-size: 27px"><strong>Attachment:</strong> ${attachmentExists === "yes" ? 'Yes' : 'No'}</p>
          ${standardAlloyName && standardAlloyReference ? `<p style="font-size: 27px"><strong>Standard Alloy:</strong> ${standardAlloyName} (${standardAlloyReference})</p>` : ''}
        </div>
      `;
    }
  
    if (selectedFields.measurements) {
      content += `
        <div style="margin-bottom: 15px">
          <h2 style="font-size: 25px; margin-bottom: 10px; color: #000; font-family: sans-serif;">Measurements</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px">
            <tr style="background-color: #f3f4f6">
              <th style="border: 1px solid #000; padding: 8px; font-size: 27px; color: #000; font-family: sans-serif;">Element</th>
              <th style="border: 1px solid #000; padding: 8px; font-size: 27px; color: #000; font-family: sans-serif;">Weight %</th>
            </tr>
            ${Object.entries(chemicalComposition).map(([element, weight]) => `
              <tr>
                <td style="border: 1px solid #000; padding: 8px; font-size: 27px; color: #000; font-family: monospace;">${element}</td>
                <td style="border: 1px solid #000; padding: 8px; font-size: 27px; color: #000; font-family: monospace;">${weight}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      `;
    }
  
    if (selectedFields.compactnessRatio) {
      content += `
        <div style="margin-bottom: 15px">
          <h2 style="font-size: 25px; margin-bottom: 10px; color: #000; font-family: sans-serif;">Compactness Ratio</h2>
          <p style="font-size: 27px; margin-bottom: 5px; font-family: monospace;"><strong>Compactness Ratio:</strong> ${compactnessRatio} %</p>
        </div>
      `;
    }
  
    if (selectedFields.porosity && porosity && porosity !== 'N/A') {
      content += `
        <div style="margin-bottom: 15px">
          <h2 style="font-size: 25px; margin-bottom: 10px; color: #000; font-family: sans-serif;">Porosity</h2>
          <p style="font-size: 27px; margin-bottom: 5px; font-family: monospace;"><strong>Porosity:</strong> ${porosity === '0.00' ? '-' : `${porosity}`}</p>
        </div>
      `;
    }
  
    if (densityType !== 'specified' && selectedFields.chemicalComposition && chemicalComposition && Object.keys(chemicalComposition).length > 0) {
      content += `
        <div style="margin-bottom: 15px">
          <h2 style="font-size: 25px; margin-bottom: 10px; color: #000; font-family: sans-serif;">Chemical Composition</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px">
            <tr style="background-color: #f3f4f6">
              <th style="border: 1px solid #000; padding: 8px; font-size: 27px; color: #000; font-family: sans-serif;">Element</th>
              <th style="border: 1px solid #000; padding: 8px; font-size: 27px; color: #000; font-family: sans-serif;">Weight %</th>
            </tr>
            ${Object.entries(chemicalComposition).map(([element, weight]) => `
              <tr>
                <td style="border: 1px solid #000; padding: 8px; font-size: 27px; color: #000; font-family: monospace;">${element}</td>
                <td style="border: 1px solid #000; padding: 8px; font-size: 27px; color: #000; font-family: monospace;">${weight}</td>
              </tr>
            `).join('')}
          </table>
        </div>
      `;
    }
  
    if (selectedFields.notes && notes) {
      content += `
        <div style="margin-bottom: 20px">
          <h2 style="font-size: 30px; margin-bottom: 15px">Notes</h2>
          <p style="font-size: 27px">${notes}</p>
        </div>
      `;
    }
  
    if (selectedFields.masterDetails && masterExists === 'yes') {
      content += `
        <div style="margin-bottom: 15px">
          <h2 style="font-size: 25px; margin-bottom: 10px; color: #000; font-family: sans-serif;">Master Sample Details</h2>
          <p style="font-size: 27px; margin-bottom: 5px; font-family: monospace;"><strong>Master Sample has Attachment:</strong> ${masterAttachmentExists ? 'Yes' : 'No'}</p>
          <p style="font-size: 27px; margin-bottom: 5px; font-family: monospace;"><strong>Density of Master Sample:</strong> ${densityOfMasterSample}</p>
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
                  text: "Compactness Evaluation",
                  bold: true,
                  size: 35,
                }),
              ],
              alignment: AlignmentType.CENTER,
              spacing: { after: 400 },
            }),
  
            // Basic Information
            ...(selectedFields.basicInfo ? [
              new Paragraph({
                children: [new TextRun({ text: "Basic Information", bold: true, size: 30 })],
                spacing: { after: 200 },
                alignment: AlignmentType.CENTER
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Date: ", bold: true }),
                  new TextRun(date),
                ],
                alignment: AlignmentType.CENTER
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Part Code: ", bold: true }),
                  new TextRun(partCode),
                ],
                alignment: AlignmentType.CENTER
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Part Name: ", bold: true }),
                  new TextRun(partName),
                ],
                alignment: AlignmentType.CENTER
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Theoretical Density: ", bold: true }),
                  new TextRun(density),
                ],
                alignment: AlignmentType.CENTER
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Attachment: ", bold: true }),
                  new TextRun(attachmentExists === "yes" ? 'Yes' : 'No'),
                ],
                alignment: AlignmentType.CENTER
              }),
              ...(standardAlloyName && standardAlloyReference ? [
                new Paragraph({
                  children: [
                    new TextRun({ text: "Standard Alloy: ", bold: true }),
                    new TextRun(`${standardAlloyName} (${standardAlloyReference})`),
                  ],
                  alignment: AlignmentType.CENTER
                }),
              ] : []),
            ] : []),
  
            // Measurements
            ...(selectedFields.measurements ? [
              new Paragraph({
                children: [new TextRun({ text: "Measurements", bold: true, size: 25 })],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Mass in Air: ", bold: true }),
                  new TextRun(massInAir),
                ],
                alignment: AlignmentType.CENTER
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Mass in Fluid: ", bold: true }),
                  new TextRun(massInFluid),
                ],
                alignment: AlignmentType.CENTER
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Fluid Density: ", bold: true }),
                  new TextRun(fluidDensity),
                ],
                alignment: AlignmentType.CENTER
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Item Density: ", bold: true }),
                  new TextRun(densityOfItem),
                ],
                alignment: AlignmentType.CENTER
              }),
            ] : []),
  
            // Compactness Ratio
            ...(selectedFields.compactnessRatio ? [
              new Paragraph({
                children: [new TextRun({ text: "Compactness Ratio", bold: true, size: 25 })],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Compactness Ratio: ", bold: true }),
                  new TextRun(`${compactnessRatio} %`),
                ],
                alignment: AlignmentType.CENTER
              }),
            ] : []),
  
            // Porosity
            ...(selectedFields.porosity && porosity && porosity !== 'N/A' ? [
              new Paragraph({
                children: [new TextRun({ text: "Porosity", bold: true, size: 25 })],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Porosity: ", bold: true }),
                  new TextRun(porosity === '0.00' ? '-' : `${porosity}`),
                ],
                alignment: AlignmentType.CENTER
              }),
            ] : []),
  
            // Chemical Composition
            ...(selectedFields.chemicalComposition && densityType==="calculated" && Object.keys(chemicalComposition).length > 0 ? [
              new Paragraph({
                children: [new TextRun({ text: "Chemical Composition", bold: true, size: 25 })],
                spacing: { after: 200 },
              }),
              new Table({
                rows: [
                  new TableRow({
                    children: [
                      new TableCell({
                        children: [new Paragraph({ 
                          text: "Element",
                          alignment: AlignmentType.CENTER
                        })],
                        borders: {
                          top: { style: BorderStyle.SINGLE, size: 1 },
                          bottom: { style: BorderStyle.SINGLE, size: 1 },
                          left: { style: BorderStyle.SINGLE, size: 1 },
                          right: { style: BorderStyle.SINGLE, size: 1 },
                        },
                      }),
                      new TableCell({
                        children: [new Paragraph({ 
                          text: "Weight %",
                          alignment: AlignmentType.CENTER
                        })],
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
                          children: [new Paragraph({ 
                            text: element,
                            alignment: AlignmentType.CENTER
                          })],
                          borders: {
                            top: { style: BorderStyle.SINGLE, size: 1 },
                            bottom: { style: BorderStyle.SINGLE, size: 1 },
                            left: { style: BorderStyle.SINGLE, size: 1 },
                            right: { style: BorderStyle.SINGLE, size: 1 },
                          },
                        }),
                        new TableCell({
                          children: [new Paragraph({ 
                            text: weight,
                            alignment: AlignmentType.CENTER
                          })],
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
  
            // Notes
            ...(selectedFields.notes && notes ? [
              new Paragraph({
                children: [new TextRun({ text: "Notes", bold: true, size: 30 })],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [new TextRun(notes)],
                alignment: AlignmentType.CENTER
              }),
            ] : []),
  
            // Master Sample Details
            ...(selectedFields.masterDetails && masterExists === 'yes' ? [
              new Paragraph({
                children: [new TextRun({ text: "Master Sample Details", bold: true, size: 25 })],
                spacing: { after: 200 },
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Master Sample has Attachment: ", bold: true }),
                  new TextRun(masterAttachmentExists ? 'Yes' : 'No'),
                ],
                alignment: AlignmentType.CENTER
              }),
              new Paragraph({
                children: [
                  new TextRun({ text: "Density of Master Sample: ", bold: true }),
                  new TextRun(densityOfMasterSample),
                ],
                alignment: AlignmentType.CENTER
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
          ['Attachment', attachmentExists === "yes" ? 'Yes' : 'No'],
          ...(standardAlloyName && standardAlloyReference ? [['Standard Alloy', `${standardAlloyName} (${standardAlloyReference})`]] : []),
          ['', '']
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
          ['', '']
        );
      }
  
      // Add Compactness Ratio
      if (selectedFields.compactnessRatio) {
        data.push(
          ['Compactness Ratio', ''],
          ['Value', compactnessRatio],
          ['', '']
        );
      }
  
      // Add Porosity
      if (selectedFields.porosity && porosity && porosity !== 'N/A') {
        data.push(
          ['Porosity', ''],
          ['Value', porosity === '0.00' ? '-' : `${porosity}`],
          ['', '']
        );
      }
  
      // Add Chemical Composition
      if (selectedFields.chemicalComposition && densityType==="calculated" && Object.keys(chemicalComposition).length > 0) {
        data.push(
          ['Chemical Composition', ''],
          ['Element', 'Weight %'],
          ...Object.entries(chemicalComposition).map(([element, weight]) => [element, weight]),
          ['', '']
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
          ['', '']
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
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <label className="flex items-center space-x-4 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedFields.basicInfo}
                        onChange={() => handleFieldToggle('basicInfo')}
                        className="w-6 h-6 rounded border-[#163d64]/20 text-[#fa4516] focus:ring-[#fa4516] cursor-pointer"
                      />
                      <span className="text-2xl font-semibold text-black group-hover:text-[#fa4516] transition-colors">
                        Basic Information
                      </span>
                    </label>

                    <label className="flex items-center space-x-4 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedFields.measurements}
                        onChange={() => handleFieldToggle('measurements')}
                        className="w-6 h-6 rounded border-[#163d64]/20 text-[#fa4516] focus:ring-[#fa4516] cursor-pointer"
                      />
                      <span className="text-2xl font-semibold text-black group-hover:text-[#fa4516] transition-colors">
                        Measurements
                      </span>
                    </label>

                    <label className="flex items-center space-x-4 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedFields.chemicalComposition}
                        onChange={() => handleFieldToggle('chemicalComposition')}
                        className="w-6 h-6 rounded border-[#163d64]/20 text-[#fa4516] focus:ring-[#fa4516] cursor-pointer"
                      />
                      <span className="text-2xl font-semibold text-black group-hover:text-[#fa4516] transition-colors">
                        Chemical Composition
                      </span>
                    </label>

                    <label className="flex items-center space-x-4 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedFields.masterDetails}
                        onChange={() => handleFieldToggle('masterDetails')}
                        className="w-6 h-6 rounded border-[#163d64]/20 text-[#fa4516] focus:ring-[#fa4516] cursor-pointer"
                      />
                      <span className="text-2xl font-semibold text-black group-hover:text-[#fa4516] transition-colors">
                        Master Details
                      </span>
                    </label>

                    <label className="flex items-center space-x-4 cursor-pointer group">
                      <input
                        type="checkbox"
                        checked={selectedFields.compactnessRatio}
                        onChange={() => handleFieldToggle('compactnessRatio')}
                        className="w-6 h-6 rounded border-[#163d64]/20 text-[#fa4516] focus:ring-[#fa4516] cursor-pointer"
                      />
                      <span className="text-2xl font-semibold text-black group-hover:text-[#fa4516] transition-colors">
                        Compactness Ratio
                      </span>
                    </label>

                    {porosity && porosity !== 'N/A' && (
                      <label className="flex items-center space-x-4 cursor-pointer group">
                        <input
                          type="checkbox"
                          checked={selectedFields.porosity}
                          onChange={() => handleFieldToggle('porosity')}
                          className="w-6 h-6 rounded border-[#163d64]/20 text-[#fa4516] focus:ring-[#fa4516] cursor-pointer"
                        />
                        <span className="text-2xl font-semibold text-black group-hover:text-[#fa4516] transition-colors">
                          Porosity
                        </span>
                      </label>
                    )}
                  </div>
                </div>

                {/* Basic Information */}
                <div className="space-y-6">
                  <h3 className="text-3xl font-semibold text-[#163d64]">Basic Information</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 rounded-xl bg-[#163d64]/5">
                      <p className="text-2xl text-[#163d64]/70 mb-2">Date</p>
                      <p className="text-3xl text-black font-medium">{date}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-[#163d64]/5">
                      <p className="text-2xl text-[#163d64]/70 mb-2">Part Code</p>
                      <p className="text-3xl text-black font-medium">{partCode}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-[#163d64]/5">
                      <p className="text-2xl text-[#163d64]/70 mb-2">Part Name</p>
                      <p className="text-3xl text-black font-medium">{partName}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-[#163d64]/5">
                      <p className="text-2xl text-[#163d64]/70 mb-2">Theoretical Density</p>
                      <p className="text-3xl text-black font-medium">{density}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-[#163d64]/5">
                      <p className="text-2xl text-[#163d64]/70 mb-2">Attachment</p>
                      <p className="text-3xl text-black font-medium">{attachmentExists==="yes"?'Yes':'No'}</p>
                    </div>

    {standardAlloyName && standardAlloyReference && (
      <div className="p-6 rounded-xl bg-[#163d64]/5">
        <p className="text-2xl text-[#163d64]/70 mb-2">Standard Alloy</p>
        <p className="text-3xl text-black font-medium">{`${standardAlloyName} (${standardAlloyReference})`}</p>
      </div>
    )}
  </div>
</div>

                {/* Measurements */}
                <div className="space-y-6">
                  <h3 className="text-3xl font-semibold text-[#163d64]">Measurements</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 rounded-xl bg-[#163d64]/5">
                      <p className="text-2xl text-[#163d64]/70 mb-2">Mass in Air</p>
                      <p className="text-3xl text-black font-medium">{massInAir}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-[#163d64]/5">
                      <p className="text-2xl text-[#163d64]/70 mb-2">Mass in Fluid</p>
                      <p className="text-3xl text-black font-medium">{massInFluid}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-[#163d64]/5">
                      <p className="text-2xl text-[#163d64]/70 mb-2">Fluid Density</p>
                      <p className="text-3xl text-black font-medium">{fluidDensity}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-[#163d64]/5">
                      <p className="text-2xl text-[#163d64]/70 mb-2">Item Density</p>
                      <p className="text-3xl text-black font-medium">{densityOfItem}</p>
                    </div>
                  </div>
                </div>
                {/* Compactness Ratio */}
                <div className="space-y-6">
                  <h3 className="text-3xl font-semibold text-[#163d64]">Compactness Ratio</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="p-6 rounded-xl bg-[#163d64]/5">
                      <p className="text-2xl text-[#163d64]/70 mb-2">Compactness Ratio</p>
                      <p className={`text-3xl font-medium ${compactnessRatio > 100 ? 'text-amber-900' : 'text-black'}`}>
                        {compactnessRatio}%
                      </p>
                    </div>
                  </div>
                </div>

                {/* Porosity */}
                {porosity && porosity !== 'N/A' && (
                  <div className="space-y-6">
                    <h3 className="text-3xl font-semibold text-[#163d64]">Porosity Index</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-6 rounded-xl bg-[#163d64]/5">
                        <p className="text-2xl text-[#163d64]/70 mb-2">Porosity Index</p>
                        <p className={`text-3xl font-medium ${porosity < 0 ? 'text-amber-900' : 'text-black'}`}>{porosity==='0.00'?'-':`${porosity}`}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Chemical Composition */}
                {densityType !== 'specified' && chemicalComposition && Object.keys(chemicalComposition).length > 0 && (
                  <div className="space-y-6">
                    <h3 className="text-3xl font-semibold text-[#163d64]">Chemical Composition</h3>
                    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                      {Object.entries(chemicalComposition).map(([element, percentage]) => (
                        <div key={element} className="p-6 rounded-xl bg-[#163d64]/5">
                          <p className="text-2xl text-[#163d64]/70 mb-2">{element}</p>
                          <p className="font-mono text-3xl text-black font-medium">{percentage}%</p>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notes */}
                {notes && (
                  <div className="space-y-6">
                    <h3 className="text-3xl font-semibold text-[#163d64]">Notes</h3>
                    <p className="text-2xl text-[#163d64]">{notes}</p>
                  </div>
                )}

                {/* Master Details */}
                {masterExists === 'yes' && (
                  <div className="space-y-6">
                    <h3 className="text-3xl font-semibold text-[#163d64]">Master Sample Details</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      <div className="p-6 rounded-xl bg-[#163d64]/5">
                        <p className="text-2xl text-[#163d64]/70 mb-2">Master Sample has Attachment</p>
                        <p className="text-3xl text-black font-medium">{masterAttachmentExists==="yes" ? 'Yes' : 'No'}</p>
                      </div>
                      <div className="p-6 rounded-xl bg-[#163d64]/5">
                        <p className="text-2xl text-[#163d64]/70 mb-2">Density of Master Sample</p>
                        <p className="text-3xl text-black font-medium">{densityOfMasterSample}</p>
                      </div>
                    </div>
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex flex-col sm:flex-row gap-4 justify-center pt-8">
                  <button
                    onClick={handleGoToHome}
                    className="px-8 py-4 text-xl border-2 border-[#163d64] text-[#163d64] font-semibold rounded-xl hover:bg-[#163d64] hover:text-white transition-all duration-300"
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
