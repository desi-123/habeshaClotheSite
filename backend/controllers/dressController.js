const asyncHandler = require('express-async-handler')
const Habdress = require('../models/dressModel')

const getDresses = asyncHandler(async (req, res) => {
    const pageSize = 10
    const page = Number(req.query.pageNumber) || 1
    const keyword = req.query.keyword ? {
        name: {
            $regex: req.query.keyword,
            $options: 'i'
        }
    } : {}

    const count = await Habdress.countDocuments({ ...keyword })
    const habdresses = await Habdress.find({...keyword})
        .limit(pageSize)
        .skip(pageSize * (page - 1))

        res.json({ habdresses, page, pages: Math.ceil(count / pageSize) })
    })

const getDressById = asyncHandler(async (req, res) => {
    const habdress = await Habdress.findById(req.params.id)

    if (habdress) {
        res.json(habdress)
    } else{
        res.status(404)
        throw new Error('dress not found')
    }

    })

const deleteHabdress = asyncHandler(async (req, res) => {
    const habdress = await Habdress.findById(req.params.id)

    if (habdress) {
        await habdress.remove()
        res.json({message: 'removed'})
    } else{
        res.status(404)
        throw new Error('habdress not found')
    }

})

const createHabdress = asyncHandler(async (req, res) => {
    const habdress = new Habdress({
        name: "Sample name",
        price: 0,
        user: req.user._id,
        image: "/images/sample.jpg",
        brand: "Sample brand",
        countInStock: 0,
        numReviews: 0,
        description: "Sample description",
    })

    const createdHabdress = await habdress.save()
    res.status(201).json(createdHabdress)
})

const updateHabdress = asyncHandler(async (req, res) => {
    const {
        name,
        price,
        description,
        image,
        brand,
        countInStock,
    } = req.body

    const habdress = await Habdress.findById(req.params.id)

    if(habdress) {
        habdress.name = name
        habdress.price = price
        habdress.image = image
        habdress.brand = brand
        habdress.countInStock = countInStock
        habdress.description = description

        const updatedHabdress = await habdress.save()
        res.json(updatedHabdress)
    } else {
        res.status(404)
        throw new Error('dress not found')
    }

})

// @desc    Create new review
// @route   POST /api/habdresses/:id/reviews
// @access  Private
const createHabdressReview = asyncHandler(async (req, res) => {
    const { rating, comment } = req.body
    
    const habdress = await Habdress.findById(req.params.id)

    if (habdress) {
    const alreadyReviewed = habdress.reviews.find(
        (r) => r.user.toString() === req.user._id.toString()
    )

    if (alreadyReviewed) {
        res.status(400)
        throw new Error('habdress already reviewed')
    }

    const review = {
        name: req.user.name,
        rating: Number(rating),
        comment,
        user: req.user._id,
    }

    habdress.reviews.push(review)

    habdress.numReviews = habdress.reviews.length

    habdress.rating =
        habdress.reviews.reduce((acc, item) => item.rating + acc, 0) /
        habdress.reviews.length

    await habdress.save()
    res.status(201).json({ message: 'Review added' })
    } else {
    res.status(404)
    throw new Error('Dress not found')
    }
})

// @desc    Get top rated habdresses
// @route   GET /api/habdresses/top
// @access  Public
const getTopHabdress = asyncHandler(async (req, res) => {
    const habdresses = await Habdress.find({}).sort({ rating: -1 }).limit(5)

    res.json(habdresses)
})

module.exports = {
    getDresses, 
    getDressById, 
    deleteHabdress, 
    createHabdress, 
    updateHabdress,
    createHabdressReview,
    getTopHabdress
}