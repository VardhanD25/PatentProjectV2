const express = require('express')

const{
    addPart,
    calculateDensity,
    getAllPartCodesForUser,
    getPartName,
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
}=require('../controllers/partController')

const router=express.Router()



router.post('/',addPart)
router.get('/calculateDensity/:partCode', calculateDensity);
router.get('/specified-density/:partCode', findSpecifiedDensity);
router.get('/part-codes/:userId', getAllPartCodesForUser);
router.get('/part-name/:partCode', getPartName);
router.get('/master-sample-density', calculateMasterSampleDensity);
router.get('/calculate-part-density', calculatePartDensity);
router.get('/compactness-ratio',calculateCompactnessRatio);
router.patch('/updatepart',updatePart)
router.get('/calculate-porosity', calculatePorosity);
router.get('/user/:userId/parts', getAllPartsForUser);
// Add this new route
router.patch('/:partCode/standardAlloy', updateStandardAlloy);
// Update the delete route to match the frontend call
router.delete('/delete/:partCode', deletePart);  // Change this line
router.get('/:partCode',fetchPart)

module.exports = router