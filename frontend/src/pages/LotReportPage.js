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
    compactnessRatio: true,
    porosity: true
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
    densityType,
    chemicalComposition = {},
    attachmentExists,
    partMassAirArray: massInAir = [],
    partMassFluidArray: massInFluid = [],
    densityOfFluid: fluidDensity = '',
    densityOfMasterSample: densityOfItem = '',
    compactnessRatioArray: compactnessRatio = [],
    porosityArray = [],
    masterExists,
    masterAttachmentExists,
    standardAlloyReference ,
    standardAlloyName,
    itemNumbers = [],
    optionalReport = true,
  } = location.state || {};

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
    reportContent.style.padding = '15px';
    reportContent.style.backgroundColor = '#fff';
    reportContent.style.fontFamily = 'monospace';
  
    let content = `
      <h1 style="font-size: 35px; text-align: center; margin-bottom: 20px; color: #163d64; font-family: sans-serif;">Lot Compactness Evaluation</h1>
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
          <h2 style="font-size: 25px; margin-bottom: 10px; color: #000; font-family: sans-serif; text-align: center;">Measurements</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px">
            <tr style="background-color: #f3f4f6">
              <th style="border: 1px solid #000; padding: 8px; font-size: 20px; color: #000; font-family: sans-serif; text-align: center;">Item Number</th>
              <th style="border: 1px solid #000; padding: 8px; font-size: 20px; color: #000; font-family: sans-serif; text-align: center;">Mass in Air (g)</th>
              <th style="border: 1px solid #000; padding: 8px; font-size: 20px; color: #000; font-family: sans-serif; text-align: center;">Mass in Fluid (g)</th>
              <th style="border: 1px solid #000; padding: 8px; font-size: 20px; color: #000; font-family: sans-serif; text-align: center;">Density (g/cm³)</th>
              ${selectedFields.compactnessRatio?`<th style="border: 1px solid #000; padding: 8px; font-size: 20px; color: #000; font-family: sans-serif; text-align: center;">Compactness Ratio</th>`:''}
              ${selectedFields.porosity ? `<th style="border: 1px solid #000; padding: 8px; font-size: 20px; color: #000; font-family: sans-serif; text-align: center;">Porosity Index</th>` : ''}
            </tr>
            ${massInAir.map((_, index) => `
              <tr>
                <td style="border: 1px solid #000; padding: 8px; font-size: 20px; color: #000; font-family: monospace; text-align: center;">${itemNumbers[index]}</td>
                <td style="border: 1px solid #000; padding: 8px; font-size: 20px; color: #000; font-family: monospace; text-align: center;">${massInAir[index]}</td>
                <td style="border: 1px solid #000; padding: 8px; font-size: 20px; color: #000; font-family: monospace; text-align: center;">${massInFluid[index]}</td>
                <td style="border: 1px solid #000; padding: 8px; font-size: 20px; color: #000; font-family: monospace; text-align: center;">${((massInAir[index] * fluidDensity) / (massInAir[index] - massInFluid[index])).toFixed(2)}</td>
                ${selectedFields.compactnessRatio?`<td style="border: 1px solid #000; padding: 8px; font-size: 20px; font-family: monospace; text-align: center; ${
                  compactnessRatio[index] > 100 
                    ? 'background-color: rgb(217, 226, 102); color:rgb(61, 31, 4);' 
                    : 'color: #163d64; background-color: #fff0f0;'
                }">${compactnessRatio[index]}%</td>`:''}
                ${selectedFields.porosity ? `<td style="border: 1px solid #000; padding: 8px; font-size: 20px; color: #000; font-family: monospace; text-align: center; ${
                  porosityArray[index] < 0 
                    ? 'background-color:rgb(217, 226, 102); color:rgb(61, 31, 4);' 
                    : 'color: #163d64; background-color: #fff0f0;'
                }">${porosityArray[index]==='0.00'?'Reference':`${porosityArray[index]}`}</td>` : ''}
              </tr>
            `).join('')}
          </table>
        </div>
      `;
    }
  
    if (densityType === 'calculated' && selectedFields.chemicalComposition && chemicalComposition && Object.keys(chemicalComposition).length > 0) {
      content += `
        <div style="margin-bottom: 15px">
          <h2 style="font-size: 25px; margin-bottom: 10px; color: #000; font-family: sans-serif;">Chemical Composition</h2>
          <table style="width: 100%; border-collapse: collapse; margin-bottom: 10px">
            <tr style="background-color: #f3f4f6">
              <th style="border: 1px solid #000; padding: 8px; font-size: 20px; color: #000; font-family: sans-serif; text-align: center;">Element</th>
              <th style="border: 1px solid #000; padding: 8px; font-size: 20px; color: #000; font-family: sans-serif; text-align: center;">Percentage</th>
            </tr>
            ${Object.entries(chemicalComposition).map(([element, percentage]) => `
              <tr>
                <td style="border: 1px solid #000; padding: 8px; font-size: 20px; color: #000; font-family: sans-serif; text-align: center;">${element}</td>
                <td style="border: 1px solid #000; padding: 8px; font-size: 20px; color: #000; font-family: monospace; text-align: center;">${percentage}%</td>
              </tr>
            `).join('')}
          </table>
        </div>
      `;
    }
  
    if (densityType !== 'calculated' && selectedFields.standardAlloy && standardAlloyName) {
      content += `
        <div style="margin-bottom: 20px">
          <h2 style="font-size: 30px; margin-bottom: 10px">Standard Alloy Information</h2>
          <p style="font-size: 27px"><strong>Name:</strong> ${standardAlloyName}</p>
          <p style="font-size: 27px"><strong>Reference:</strong> ${standardAlloyReference}</p>
        </div>
      `;
    }
  
    if (selectedFields.masterDetails && masterExists) {
      content += `
        <div style="margin-bottom: 15px">
          <h2 style="font-size: 25px; margin-bottom: 10px; color: #000; font-family: sans-serif;">Master Sample Details</h2>
          <p style="font-size: 27px; margin-bottom: 5px; font-family: monospace;"><strong>Density of Master Sample:</strong> ${densityOfItem === '0' ? '-' : `${densityOfItem}`}</p>
          <p style="font-size: 27px; margin-bottom: 5px; font-family: monospace;"><strong>Attachment:</strong> ${masterAttachmentExists === "yes" ? 'Yes' : 'No'}</p>
        </div>
      `;
    }
  
    reportContent.innerHTML = content;
  
    html2pdf().from(reportContent).set({
      margin: [10, 10, 10, 10],
      filename: `${partCode}_lot_report.pdf`,
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
          children: [new TextRun({ text: "Lot Compactness Evaluation", bold: true, size: 35 })],
          spacing: { after: 400 },
          alignment: AlignmentType.CENTER
        })
      );
  
      // Basic Information
      if (selectedFields.basicInfo) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "Basic Information", bold: true, size: 30, color: "#163d64" })],
            spacing: { before: 400, after: 200 },
            alignment: AlignmentType.CENTER
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Date: ", bold: true }),
              new TextRun(date || 'N/A')
            ],
            alignment: AlignmentType.CENTER
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
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Attachment: ", bold: true }),
              new TextRun(attachmentExists === "yes" ? 'Yes' : 'No')
            ]
          }),
          ...(standardAlloyName && standardAlloyReference ? [
            new Paragraph({
              children: [
                new TextRun({ text: "Standard Alloy: ", bold: true }),
                new TextRun(`${standardAlloyName} (${standardAlloyReference})`)
              ]
            })
          ] : []),
          new Paragraph({ text: '', spacing: { after: 200 } }) // Spacing
        );
      }
  
      // Measurements
      if (selectedFields.measurements) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "Measurements", bold: true, size: 25 })],
            spacing: { before: 400, after: 200 }
          })
        );
  
        const headers = [
          "Item Number",
          "Mass in Air (g)",
          "Mass in Fluid (g)",
          "Density (g/cm³)",
          ...(selectedFields.compactnessRatio ? ["Compactness Ratio"] : []),
          ...(selectedFields.porosity ? ["Porosity Index"] : [])
        ];
  
        const table = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: headers.map(header => 
                new TableCell({
                  children: [new Paragraph({ 
                    children: [new TextRun({ text: header, bold: true })],
                    alignment: AlignmentType.CENTER
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
            ...massInAir.map((_, index) => {
              const density = ((massInAir[index] * fluidDensity) / (massInAir[index] - massInFluid[index])).toFixed(2);
              return new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph({ 
                      text: itemNumbers[index] || '',
                      alignment: AlignmentType.CENTER
                    })],
                    borders: { top: BorderStyle.SINGLE, bottom: BorderStyle.SINGLE, left: BorderStyle.SINGLE, right: BorderStyle.SINGLE }
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      text: massInAir[index].toString(),
                      alignment: AlignmentType.CENTER
                    })],
                    borders: { top: BorderStyle.SINGLE, bottom: BorderStyle.SINGLE, left: BorderStyle.SINGLE, right: BorderStyle.SINGLE }
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      text: massInFluid[index].toString(),
                      alignment: AlignmentType.CENTER
                    })],
                    borders: { top: BorderStyle.SINGLE, bottom: BorderStyle.SINGLE, left: BorderStyle.SINGLE, right: BorderStyle.SINGLE }
                  }),
                  new TableCell({
                    children: [new Paragraph({ 
                      text: density,
                      alignment: AlignmentType.CENTER
                    })],
                    borders: { top: BorderStyle.SINGLE, bottom: BorderStyle.SINGLE, left: BorderStyle.SINGLE, right: BorderStyle.SINGLE }
                  }),
                  ...(selectedFields.compactnessRatio ? [
                    new TableCell({
                      children: [new Paragraph({ 
                        text: `${compactnessRatio[index].toString()}%`,
                        alignment: AlignmentType.CENTER
                      })],
                      borders: { top: BorderStyle.SINGLE, bottom: BorderStyle.SINGLE, left: BorderStyle.SINGLE, right: BorderStyle.SINGLE }
                    })
                  ] : []),
                  ...(selectedFields.porosity ? [
                    new TableCell({
                      children: [new Paragraph({ 
                        text: porosityArray[index] === '0.00' ? 'Reference' : porosityArray[index].toString(),
                        alignment: AlignmentType.CENTER
                      })],
                      borders: { top: BorderStyle.SINGLE, bottom: BorderStyle.SINGLE, left: BorderStyle.SINGLE, right: BorderStyle.SINGLE }
                    })
                  ] : [])
                ]
              });
            })
          ]
        });
  
        children.push(table);
      }
  
      // Chemical Composition
      if (densityType === 'calculated' && selectedFields.chemicalComposition && Object.keys(chemicalComposition).length > 0) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "Chemical Composition", bold: true, size: 25 })],
            spacing: { before: 400, after: 200 }
          })
        );
  
        const compositionTable = new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph("Element")], borders: { top: BorderStyle.SINGLE, bottom: BorderStyle.SINGLE, left: BorderStyle.SINGLE, right: BorderStyle.SINGLE } }),
                new TableCell({ children: [new Paragraph("Percentage")], borders: { top: BorderStyle.SINGLE, bottom: BorderStyle.SINGLE, left: BorderStyle.SINGLE, right: BorderStyle.SINGLE } })
              ]
            }),
            ...Object.entries(chemicalComposition).map(([element, percentage]) => 
              new TableRow({
                children: [
                  new TableCell({ children: [new Paragraph(element)], borders: { top: BorderStyle.SINGLE, bottom: BorderStyle.SINGLE, left: BorderStyle.SINGLE, right: BorderStyle.SINGLE } }),
                  new TableCell({ children: [new Paragraph(`${percentage}%`)], borders: { top: BorderStyle.SINGLE, bottom: BorderStyle.SINGLE, left: BorderStyle.SINGLE, right: BorderStyle.SINGLE } })
                ]
              })
            )
          ]
        });
  
        children.push(compositionTable);
      }
  
      // Master Sample Details
      if (selectedFields.masterDetails && masterExists) {
        children.push(
          new Paragraph({
            children: [new TextRun({ text: "Master Sample Details", bold: true, size: 25 })],
            spacing: { before: 400, after: 200 }
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Density of Master Sample: ", bold: true }),
              new TextRun(densityOfItem === '0' ? '-' : densityOfItem)
            ]
          }),
          new Paragraph({
            children: [
              new TextRun({ text: "Attachment: ", bold: true }),
              new TextRun(masterAttachmentExists === "yes" ? 'Yes' : 'No')
            ]
          })
        );
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
          ['Attachment', attachmentExists === "yes" ? 'Yes' : 'No'],
          ...(standardAlloyName && standardAlloyReference ? [['Standard Alloy', `${standardAlloyName} (${standardAlloyReference})`]] : []),
          ['', '']
        );
      }
  
      // Add Measurements
      if (selectedFields.measurements) {
        const headers = [
          'Item Number',
          'Mass in Air (g)',
          'Mass in Fluid (g)',
          'Density (g/cm³)',
          ...(selectedFields.compactnessRatio ? ['Compactness Ratio'] : []),
          ...(selectedFields.porosity ? ['Porosity Index'] : [])
        ];
  
        data.push(
          ['Measurements', ...Array(headers.length - 1).fill('')],
          headers,
          ...massInAir.map((_, index) => {
            const density = ((massInAir[index] * fluidDensity) / (massInAir[index] - massInFluid[index])).toFixed(2);
            return [
              itemNumbers[index] || '',
              massInAir[index],
              massInFluid[index],
              density,
              ...(selectedFields.compactnessRatio ? [compactnessRatio[index]] : []),
              ...(selectedFields.porosity ? [porosityArray[index] === '0.00' ? 'Reference' : porosityArray[index]] : [])
            ];
          })
        );
      }
  
      // Add Chemical Composition
      if (densityType === 'calculated' && selectedFields.chemicalComposition && Object.keys(chemicalComposition).length > 0) {
        data.push(
          ['Chemical Composition', ''],
          ['Element', 'Percentage'],
          ...Object.entries(chemicalComposition).map(([element, percentage]) => [element, percentage]),
          ['', '']
        );
      }
  
      // Add Master Sample Details
      if (selectedFields.masterDetails && masterExists) {
        data.push(
          ['Master Sample Details', ''],
          ['Density of Master Sample', densityOfItem === '0' ? '-' : densityOfItem],
          ['Attachment', masterAttachmentExists === "yes" ? 'Yes' : 'No'],
          ['', '']
        );
      }
  
      const ws = XLSX.utils.aoa_to_sheet(data);
  
      // Set column widths
      ws['!cols'] = [{ wch: 20 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }, { wch: 15 }];
  
      XLSX.utils.book_append_sheet(wb, ws, 'Lot Report');
  
      const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
      saveAs(new Blob([excelBuffer]), `${partCode}_lot_report.xlsx`);
    } catch (error) {
      console.error('Error generating Excel file:', error);
      alert('Error generating Excel file. Please try again.');
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-white font-quicksand relative">
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
              <div className="bg-white/50 border border-[#163d64]/20 rounded-xl p-6">
                <h3 className="text-3xl font-semibold text-black mb-6">Select Sections for Download</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {Object.keys(selectedFields).map((field) => (
                    <label 
                      key={field} 
                      className="flex items-center space-x-4 cursor-pointer group"
                    >
                      <input
                        type="checkbox"
                        checked={selectedFields[field]}
                        onChange={() => handleFieldToggle(field)}
                        className="w-6 h-6 rounded border-2 border-[#163d64]/20 text-[#fa4516] focus:ring-[#fa4516] cursor-pointer"
                      />
                      <span className="text-2xl font-semibold text-black group-hover:text-[#fa4516] transition-colors">
                        {formatFieldName(field)}
                      </span>
                    </label>
                  ))}
                </div>
              </div>
  
              {/* Report Preview */}
              <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-lg p-8 border border-slate-200 space-y-10">
                {/* Basic Information */}
                {selectedFields.basicInfo && (
                  <div className="space-y-6">
                  <h2 className="text-3xl font-semibold text-black">Basic Information</h2>
                  <div className="grid grid-cols-2 gap-8">
                    <div className="p-6 rounded-xl bg-[#163d64]/5">
                      <p className="text-2xl text-black mb-2">Date</p>
                      <p className="text-3xl text-black font-medium">{date}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-[#163d64]/5">
                      <p className="text-2xl text-black mb-2">Part Code</p>
                      <p className="text-3xl text-black font-medium">{partCode}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-[#163d64]/5">
                      <p className="text-2xl text-black mb-2">Part Name</p>
                      <p className="text-3xl text-black font-medium">{partName}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-[#163d64]/5">
                      <p className="text-2xl text-black mb-2">Theoretical Density</p>
                      <p className="text-3xl text-black font-medium">{density}</p>
                    </div>
                    <div className="p-6 rounded-xl bg-[#163d64]/5">
                      <p className="text-2xl text-black mb-2">Attachment</p>
                      <p className="text-3xl text-black font-medium">{attachmentExists==="yes" ? 'Yes' : 'No'}</p>
                    </div>
                    {standardAlloyName && standardAlloyReference && (
                      <div className="p-6 rounded-xl bg-[#163d64]/5">
                        <p className="text-2xl text-black mb-2">Standard Alloy</p>
                        <p className="text-3xl text-black font-medium">{`${standardAlloyName} (${standardAlloyReference})`}</p>
                      </div>
                    )}
                  </div>
                </div>
                )}
  
                {/* Measurements Table */}
                {selectedFields.measurements && (
                  <div className="space-y-6">
                    <h2 className="text-3xl font-semibold text-black">Measurements</h2>
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                      <table className="w-full">
                        <thead>
                          <tr>
                            <th className="py-4 px-6 text-left bg-[#163d64] text-white text-2xl font-medium rounded-tl-xl">Item Number</th>
                            <th className="py-4 px-6 text-left bg-[#163d64] text-white text-2xl font-medium">Mass in Air (g)</th>
                            <th className="py-4 px-6 text-left bg-[#163d64] text-white text-2xl font-medium">Mass in Fluid (g)</th>
                            <th className="py-4 px-6 text-left bg-[#163d64] text-white text-2xl font-medium">Density (g/cm³)</th>
                            <th className="py-4 px-6 text-left bg-[#163d64] text-white text-2xl font-medium">Compactness Ratio</th>
                            <th className="py-4 px-6 text-left bg-[#163d64] text-white text-2xl font-medium rounded-tr-xl">Porosity Index</th>
                          </tr>
                        </thead>
                        <tbody>
  {massInAir.map((_, index) => (
    <tr key={index} className="border-b border-[#163d64]/10 hover:bg-[#163d64]/5 transition-colors">
      <td className="py-4 px-6 font-mono text-3xl text-[#163d64]">{itemNumbers[index] || ''}</td>
      <td className="py-4 px-6 font-mono text-3xl text-[#163d64]">{massInAir[index]}</td>
      <td className="py-4 px-6 font-mono text-3xl text-[#163d64]">{massInFluid[index]}</td>
      <td className="py-4 px-6 font-mono text-3xl text-[#163d64]">
        {((massInAir[index] * fluidDensity) / (massInAir[index] - massInFluid[index])).toFixed(2)}
      </td>
      <td className={`py-4 px-6 font-mono text-3xl ${
        compactnessRatio[index] > 100 
          ? 'bg-yellow-100/90 text-amber-900' 
          : 'text-[#163d64] bg-[#fff0f0]'
      }`}>
        {compactnessRatio[index]}%
      </td>
      <td className={`py-4 px-6 font-mono text-3xl ${
        porosityArray[index] < 0 
          ? 'bg-yellow-100/90 text-amber-900' 
          : 'text-[#163d64] bg-[#fff0f0]'
      }`}>{porosityArray[index]==='0.00'?'Reference':`${porosityArray[index]}`}</td>
    </tr>
  ))}
</tbody>
                      </table>
                    </div>
                  </div>
                )}
  
                {/* Chemical Composition */}
{densityType === 'calculated' && chemicalComposition && Object.keys(chemicalComposition).length > 0 && (
  <div className="space-y-6">
    <h2 className="text-3xl font-semibold text-black">Chemical Composition</h2>
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
      {Object.entries(chemicalComposition).map(([element, percentage]) => (
        <div key={element} className="p-6 rounded-xl bg-[#163d64]/5">
          <p className="text-2xl text-black mb-2">{element}</p>
          <p className="font-mono text-3xl text-black font-medium">{percentage}%</p>
        </div>
      ))}
    </div>
  </div>
)}
  
                {/* Standard Alloy Information */}
{densityType !== 'calculated' && selectedFields.standardAlloy && standardAlloyName && (
  <div className="space-y-6">
    <h2 className="text-3xl font-semibold text-black">Standard Alloy Information</h2>
    <div className="grid grid-cols-2 gap-8">
      <div className="p-6 rounded-xl bg-[#163d64]/5">
        <p className="text-2xl text-black mb-2">Name</p>
        <p className="text-3xl text-black font-medium">{standardAlloyName}</p>
      </div>
      <div className="p-6 rounded-xl bg-[#163d64]/5">
        <p className="text-2xl text-[#163d64]/70 mb-2">Reference</p>
        <p className="text-3xl text-[#163d64] font-medium">{standardAlloyReference}</p>
      </div>
    </div>
  </div>
)}
  
                {/* Master Sample Details */}
{selectedFields.masterDetails && masterExists && (
  <div className="space-y-6">
    <h2 className="text-3xl font-semibold text-black">Master Sample Details</h2>
    <div className="grid grid-cols-2 gap-8">
      <div className="p-6 rounded-xl bg-[#163d64]/5">
        <p className="text-2xl text-black mb-2">Density of Master Sample</p>
        <p className="text-3xl text-black font-medium">{densityOfItem ==='0'?'-':`${densityOfItem}`}</p>
      </div>
      <div className="p-6 rounded-xl bg-[#163d64]/5">
        <p className="text-2xl text-black mb-2">Attachment</p>
        <p className="text-3xl text-black font-medium">{masterAttachmentExists === "yes" ? 'Yes' : 'No'}</p>
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
