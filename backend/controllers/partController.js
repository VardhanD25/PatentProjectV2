const Part = require('../models/partModel');
const Element = require('../models/elementModel');
const StandardAlloy=require('../models/standardAlloyModel')
const mongoose = require('mongoose')

const findSpecifiedDensity = async (req, res) => {
  try {
    const { partCode } = req.params;

    // Fetch the part from the database using the part code
    const part = await Part.findOne({ partCode });

    if (!part) {
      return res.status(404).json({ message: 'Part not found.' });
    }

    // Check if the part has a standard alloy reference
    const standardAlloyId = part.standardAlloyId; // Assuming field name in Part schema is standardAlloyId

    if (!standardAlloyId) {
      return res.status(200).json({formattedDensity:'-1'});
    }

    // Fetch the standard alloy from the database using the standard alloy ID (string)
    const standardAlloy = await StandardAlloy.findById(standardAlloyId);

    if (!standardAlloy) {
      return res.status(404).json({formattedDensity:'-1'});
    }

    // Retrieve the density from the standard alloy
    const specifiedDensity = standardAlloy.density;

    // Format the density to three decimal places
    const formattedDensity = specifiedDensity.toFixed(3);
    
    res.status(200).json({ formattedDensity });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const addPart = async (req, res) => {
    try {
      const { partCode, partName, composition, userId, standardAlloyId } = req.body;
  
      // Log incoming request data
      console.log('Request Body:', { partCode, partName, composition, userId, standardAlloyId });
  
      // Validate request body
      if (!partCode || !partName || !userId) {
        return res.status(400).json({ message: 'Part code, part name, and userId are required.' });
      }
  
      let newPart = {
        partCode,
        userId,
        partName
      };
  
      if (standardAlloyId) {
        // Validate standard alloy ID
        const standardAlloy = await StandardAlloy.findById(standardAlloyId);
        if (!standardAlloy) {
          return res.status(400).json({ message: 'Standard alloy not found.' });
        }
        newPart.standardAlloyId = standardAlloyId;
      }
  
      if (composition && Array.isArray(composition) && composition.length > 0) {
        // Fetch elements from the database based on the provided symbols
        const elements = await Element.find({ symbol: { $in: composition.map(c => c.symbol) } });
  
        if (elements.length !== composition.length) {
          return res.status(400).json({ message: 'One or more elements not found.' });
        }
  
        // Create the composition array with references to element IDs and their percentages
        const partComposition = composition.map(c => {
          const element = elements.find(e => e.symbol === c.symbol);
          return { element: element._id, percentage: c.percentage };
        });
  
        newPart.composition = partComposition;
      }
  
      // Create the new part document
      const partDocument = new Part(newPart);
  
      // Save the part document to the database
      await partDocument.save();
  
      res.status(201).json({ message: 'Part created successfully!', part: partDocument });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

const fetchPart = async (req, res) => {
  try {
    const { partCode } = req.params;

    if (!partCode) {
      return res.status(400).json({ message: 'Part code is required.' });
    }

    // Fetch the part and populate standardAlloyId
    const part = await Part.findOne({ partCode })
      .populate({
        path: 'composition.element',
        select: 'symbol name'
      })
      .populate({
        path: 'standardAlloyId',
        select: 'name country density'
      });

    if (!part) {
      return res.status(404).json({ message: 'Part not found.' });
    }

    res.status(200).json({ part });
  } catch (error) {
    console.error('Error:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};

const getAllPartsForUser = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required.' });
    }

    const parts = await Part.find({ userId })
      .populate({
        path: 'composition.element',
        select: 'symbol name'
      })
      .populate({
        path: 'standardAlloyId',
        select: 'name country density' // Include all fields you need from StandardAlloy
      });

    // Log the parts to check the data
    console.log('Fetched parts with standard alloys:', JSON.stringify(parts, null, 2));

    res.status(200).json({ parts });
  } catch (error) {
    console.error('Error fetching parts:', error);
    res.status(500).json({ message: 'Internal server error.' });
  }
};



const updatePart = async (req, res) => {
    try {
      const { partCode, composition, standardAlloyId } = req.body;
  
      // Log incoming request data
      console.log('Request Body:', { partCode, composition, standardAlloyId });
  
      // Validate request body
      if (!partCode) {
        return res.status(400).json({ message: 'Part code is required.' });
      }
  
      // Fetch the part document from the database
      const part = await Part.findOne({ partCode });
      if (!part) {
        return res.status(404).json({ message: 'Part not found.' });
      }
  
      // Update standard alloy if provided
      if (standardAlloyId) {
        const standardAlloy = await StandardAlloy.findById(standardAlloyId);
        if (!standardAlloy) {
          return res.status(400).json({ message: 'Standard alloy not found.' });
        }
        part.standardAlloyId = standardAlloyId;
      }
  
      // Update composition if provided
      if (composition && Array.isArray(composition) && composition.length > 0) {
        // Extract symbols from the composition
        const symbols = composition.map(c => c.element?.symbol).filter(symbol => symbol);
  
        // Fetch elements from the database based on the provided symbols
        const elements = await Element.find({ symbol: { $in: symbols } });
  
        if (elements.length !== symbols.length) {
          return res.status(400).json({ message: 'One or more elements not found.' });
        }
  
        // Create the updated composition array with references to element IDs and their percentages
        const partComposition = composition.map(c => {
          const element = elements.find(e => e.symbol === c.element?.symbol);
          return { element: element._id, percentage: c.percentage };
        });
  
        part.composition = partComposition;
      }
  
      // Save the updated part document to the database
      await part.save();
  
      res.status(200).json({ message: 'Part updated successfully!', part });
    } catch (error) {
      console.error('Error:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };





  const getAllPartCodesForUser = async (req, res) => {
    try {
      const userId = req.params.userId;
  
      // Validate userId
      if (!userId) {
        return res.status(400).json({ message: 'User ID is required.' });
      }
  
      // Find all parts for the given userId
      const parts = await Part.find({ userId: userId });
  
      // Extract part codes from the parts
      const partCodes = parts.map(part => part.partCode);
  
      res.status(200).json({ partCodes });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

  const getPartName = async (req, res) => {
    try {
      const partCode = req.params.partCode;
  
      // Validate partCode
      if (!partCode) {
        return res.status(400).json({ message: 'Part code is required.' });
      }
  
      // Find the part by partCode
      const part = await Part.findOne({ partCode: partCode });
  
      // Check if the part exists
      if (!part) {
        return res.status(404).json({ message: 'Part not found.' });
      }
  
      // Return the part name
      res.status(200).json({ partName: part.partName });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };
  

  const calculateDensity = async (req, res) => {
    try {
      const { partCode } = req.params;
      console.log('Calculating density for partCode:', partCode); // Debug log

      // Fetch the part from the database using the part code
      const part = await Part.findOne({ partCode }).populate('composition.element');
      
      if (!part) {
        console.log('Part not found:', partCode);
        return res.status(404).json({ message: 'Part not found.' });
      }

      console.log('Part found:', part); // Debug log

      // Check if composition exists
      if (!part.composition || part.composition.length === 0) {
        console.log('No composition found for part');
        return res.status(400).json({ formattedDensity: '0' });
      }

      let totalVolume = 0;

      // Iterate through each element in the part's composition
      for (const comp of part.composition) {
        if (!comp.element || !comp.element.density || !comp.percentage) {
          console.log('Invalid composition entry:', comp);
          continue; // Skip invalid entries
        }

        const percentage = comp.percentage / 100;
        const density = comp.element.density;

        // Calculate the volume of the element in the part
        const volume = percentage / density;
        totalVolume += volume;
      }

      if (totalVolume <= 0) {
        return res.status(200).json({ formattedDensity: '0' });
      }

      // Calculate the specific density of the part
      const specificDensity = 1 / totalVolume;
      const formattedDensity = specificDensity.toFixed(3);
      
      console.log('Calculated density:', formattedDensity); // Debug log
      res.status(200).json({ formattedDensity });
    } catch (error) {
      console.error('Error in calculateDensity:', error);
      res.status(500).json({ 
        message: 'Internal server error.', 
        error: error.message,
        stack: error.stack 
      });
    }
  };

  const calculateMasterSampleDensity = async (req, res) => {
    try {
      const {
        masterSampleMassAir,
        attachmentMassAir=0,
        masterSampleMassFluid,
        attachmentMassFluid=0,
        densityOfFluid,
        masterAttachmentExists
      } = req.query;
  
      // Validate request parameters
      if (!masterSampleMassAir || !attachmentMassAir || !masterSampleMassFluid || !attachmentMassFluid || !densityOfFluid || masterAttachmentExists === undefined) {
        return res.status(400).json({ message: 'All parameters are required.' });
      }
  
      // console.log('masterAttachmentExists:', masterAttachmentExists);
      // console.log('Type of masterAttachmentExists:', typeof masterAttachmentExists.trim());
  
      // Parse parameters to float
      const masterMassAir = parseFloat(masterSampleMassAir);
      const attachmentMassAir1 = parseFloat(attachmentMassAir);
      const masterMassFluid = parseFloat(masterSampleMassFluid);
      const attachmentMassFluid1 = parseFloat(attachmentMassFluid);
      const densityOfFluid1 = parseFloat(densityOfFluid);
  
      //console.log('Parsed values:', { attachmentMassAir1, attachmentMassFluid1 });
  
      // Validate numerical values
      if (isNaN(masterMassAir) || isNaN(attachmentMassAir1) || isNaN(masterMassFluid) || isNaN(attachmentMassFluid1) || isNaN(densityOfFluid1)) {
        return res.status(400).json({ message: 'Invalid numerical values provided.' });
      }
  
      // Adjust attachment masses based on masterAttachmentExists
      let effectiveAttachmentMassAir = 0;
      let effectiveAttachmentMassFluid = 0;
  
      if (masterAttachmentExists.trim().toLowerCase() === 'yes') {
        effectiveAttachmentMassAir = attachmentMassAir1;
        effectiveAttachmentMassFluid = attachmentMassFluid1;
      } else {
        //console.log('masterAttachmentExists is not "yes", setting effectiveAttachmentMasses to 0.');
      }
  
      //console.log('Effective Attachment Masses:', { effectiveAttachmentMassAir, effectiveAttachmentMassFluid });
  
      // Calculate the density of the master sample
      const numerator = (masterMassAir - effectiveAttachmentMassAir) * densityOfFluid1;
      const denominator = (masterMassAir - effectiveAttachmentMassAir) - (masterMassFluid - effectiveAttachmentMassFluid);
  
      // Check for division by zero
      if (denominator === 0) {
        return res.status(400).json({ message: 'Division by zero error in density calculation.' });
      }
  
      const density = numerator / denominator;
      const formattedDensity = density.toFixed(2);
  
      res.status(200).json({ density: formattedDensity });
    } catch (error) {
      console.error('Error calculating master sample density:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };
  
  // controller.js or relevant file
  const calculatePartDensity = (req, res) => {
    try {
      // Extract query parameters
      const { 
        partMassAir, 
        partMassFluid, 
        attachmentMassAir = 0, 
        attachmentMassFluid = 0, 
        densityOfFluid,
        attachmentExists 
      } = req.query;
  
      // Validate parameters
      if (!partMassAir || !partMassFluid || !densityOfFluid) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
  
      // Convert parameters to numbers
      const partMassAirNum = parseFloat(partMassAir);
      const partMassFluidNum = parseFloat(partMassFluid);
      let attachmentMassAirNum = parseFloat(attachmentMassAir);
      let attachmentMassFluidNum = parseFloat(attachmentMassFluid);
      const densityOfFluidNum = parseFloat(densityOfFluid);
  
      // Check for valid numbers
      if (isNaN(partMassAirNum) || isNaN(partMassFluidNum) || isNaN(densityOfFluidNum)) {
        return res.status(400).json({ error: 'Invalid parameter values' });
      }
  
      // Adjust attachment masses if attachmentExists is "no"
      if (attachmentExists === "no") {
        attachmentMassAirNum = 0;
        attachmentMassFluidNum = 0;
      }
  
      // Calculate part density
      const effectivePartMassAir = partMassAirNum - attachmentMassAirNum;
      const effectivePartMassFluid = partMassFluidNum - attachmentMassFluidNum;
      
      // Check to prevent division by zero
      if (effectivePartMassAir === effectivePartMassFluid) {
        return res.status(400).json({ error: 'Division by zero error: effective masses are equal' });
      }
  
      const density = (effectivePartMassAir * densityOfFluidNum) / (effectivePartMassAir - effectivePartMassFluid);
  
      // Respond with the calculated density
      res.json({ density: density.toFixed(2) });
    } catch (error) {
      console.error('Error calculating part density:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  

  const calculateCompactnessRatio = (req, res) => {
    try {
      // Extract query parameters
      const { 
        partDensity,
        theoreticalDensity
      } = req.query;
  
      // Validate parameters
      if (!partDensity || !theoreticalDensity) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
  
      // Convert parameters to numbers
      const partDensityNum = parseFloat(partDensity);
      const theoreticalDensityNum = parseFloat(theoreticalDensity);
  
      // Check for valid numbers
      if (isNaN(partDensityNum) || isNaN(theoreticalDensityNum)) {
        return res.status(400).json({ error: 'Invalid parameter values' });
      }
      
      // Calculate compactness ratio
      const compactnessRatio = (partDensityNum * 100) / theoreticalDensityNum;
  
      // Check if compactness ratio is greater than 100
      if (compactnessRatio > 100) {
        return res.status(400).json({ error: 'Compactness ratio cannot be greater than 100' });
      }
  
      // Respond with the calculated compactness ratio
      res.json({ compactnessRatio: compactnessRatio.toFixed(1) });
    } catch (error) {
      console.error('Error calculating compactness ratio:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  const calculatePorosity = (req, res) => {
    try {
      // Extract query parameters
      const { 
        masterSampleDensity,
        partDensity
      } = req.query;
  
      // Validate parameters
      if (!masterSampleDensity || !partDensity) {
        return res.status(400).json({ error: 'Missing required parameters' });
      }
  
      // Convert parameters to numbers
      const masterSampleDensityNum = parseFloat(masterSampleDensity);
      const partDensityNum = parseFloat(partDensity);
  
      // Check for valid numbers
      if (isNaN(masterSampleDensityNum) || isNaN(partDensityNum)) {
        return res.status(400).json({ error: 'Invalid parameter values' });
      }
  
      // Check if master sample density is not zero to prevent division by zero
      if (masterSampleDensityNum === 0) {
        return res.status(400).json({ error: 'Master sample density cannot be zero' });
      }
  
      // Calculate porosity
      const porosity = ((masterSampleDensityNum - partDensityNum) / masterSampleDensityNum) * 100;
  
      // Respond with the calculated porosity
      res.json({ porosity: porosity.toFixed(2) });
    } catch (error) {
      console.error('Error calculating porosity:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };
  const deletePart = async (req, res) => {
    try {
      const { partCode } = req.params;
  
      // Validate partCode
      if (!partCode) {
        return res.status(400).json({ message: 'Part code is required.' });
      }
  
      // Find and delete the part
      const deletedPart = await Part.findOneAndDelete({ partCode });
  
      if (!deletedPart) {
        return res.status(404).json({ message: 'Part not found.' });
      }
  
      res.status(200).json({ message: 'Part deleted successfully', part: deletedPart });
    } catch (error) {
      console.error('Error deleting part:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };

  const updateStandardAlloy = async (req, res) => {
    try {
      const { partCode } = req.params;
      const { standardAlloyId } = req.body;
  
      // Validate inputs
      if (!partCode || !standardAlloyId) {
        return res.status(400).json({ message: 'Part code and standard alloy ID are required.' });
      }
  
      // Find the part
      const part = await Part.findOne({ partCode });
      if (!part) {
        return res.status(404).json({ message: 'Part not found.' });
      }
  
      // Update the standard alloy reference
      part.standardAlloyId = standardAlloyId;
      // Clear composition if it exists since we're switching to standard alloy
  
      await part.save();
  
      const updatedPart = await Part.findOne({ partCode })
        .populate('standardAlloyId');
  
      res.status(200).json({ 
        message: 'Standard alloy updated successfully', 
        part: updatedPart 
      });
    } catch (error) {
      console.error('Error updating standard alloy:', error);
      res.status(500).json({ message: 'Internal server error.' });
    }
  };
  
  module.exports={
    addPart,
    getAllPartCodesForUser,
    getPartName,
    calculateDensity,
    findSpecifiedDensity,
    calculateMasterSampleDensity,
    calculatePartDensity,
    calculateCompactnessRatio,
    updatePart,
    fetchPart,
    calculatePorosity,
    getAllPartsForUser,
    deletePart,
    updateStandardAlloy
  }