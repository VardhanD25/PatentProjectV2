const express = require('express')

const {addStandardAlloy, getAllStandardAlloys, getStandardAlloy,updateStandardAlloy,deleteStandardAlloy}=require('../controllers/standardAlloyController');


const router = express.Router()

router.post('/',addStandardAlloy)
router.get('/',getAllStandardAlloys)
router.get('/:standardAlloyId',getStandardAlloy)
router.put('/:id',updateStandardAlloy)
router.delete('/:id',deleteStandardAlloy)


module.exports = router