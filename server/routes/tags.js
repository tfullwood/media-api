const express = require('express')

//import locals
var tagCtrl = require('../controllers/tags')
var { Tag } = require('../models/tags')

const router = express.Router()

router.get('/', tagCtrl.getTags)

router.get('/:id', tagCtrl.getTag)

router.post('/', tagCtrl.createTag)

router.put('/', tagCtrl.updateTag)

router.delete('/', tagCtrl.deleteTag)

module.exports = router
