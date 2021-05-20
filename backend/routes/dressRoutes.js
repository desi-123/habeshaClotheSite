const express = require('express')
const { protect, admin } = require('../middleware/authMiddleware')
const { getDresses, getDressById, deleteHabdress, updateHabdress, createHabdress, createHabdressReview, getTopHabdress } = require('../controllers/dressController')

const router = express.Router()


router
    .route('/')
    .get(getDresses)
    .post(protect, admin, createHabdress)

router
    .route('/:id/reviews')
    .post(protect, createHabdressReview)

router
    .get('/top', getTopHabdress)
router
    .route('/:id')
    .get(getDressById)
    .delete(protect, admin, deleteHabdress)
    .put(protect, admin, updateHabdress)


module.exports = router