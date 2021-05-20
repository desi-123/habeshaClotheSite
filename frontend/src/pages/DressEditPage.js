import React, { useState, useEffect } from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom'
import { Form, Button } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import * as ActionTypes from '../redux/constants/ActionTypes'
import FormContainer from '../components/FormContainer'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { listDressDetails, updateDress } from '../redux/actions/dressActions'

const DressEditPage = ({ match, history }) => {
    const habdressId = match.params.id

    const [name, setName] = useState('')
    const [price, setPrice] = useState(0)
    const [image, setImage] = useState('')
    const [brand, setBrand] = useState('')
    const [countInStock, setCountInStock] = useState(0)
    const [description, setDescription] = useState('')
    const [uploading, setUploading] = useState(false)

    const dispatch = useDispatch()

    const dressDetails = useSelector((state) => state.dressDetails)
    const { loading, error, habdress } = dressDetails

    const dressUpdate = useSelector((state) => state.dressUpdate)
    const { loading: loadingUpdate, 
            error: errorUpdate, 
            success: successUpdate 
        } = dressUpdate

    useEffect(() => {
        if (successUpdate) {
            dispatch({type: ActionTypes.DRESS_UPDATE_RESET})
            history.push('/admin/dresslist')
        } else {
            if (!habdress.name || habdress._id !== habdressId) {
                dispatch(listDressDetails(habdressId))
            } else {
                setName(habdress.name)
                setPrice(habdress.price)
                setImage(habdress.image)
                setBrand(habdress.brand)
                setCountInStock(habdress.countInStock)
                setDescription(habdress.description)
            }
        }
    }, [dispatch, history, habdressId, habdress, successUpdate])

    const uploadFileHandler = async (e) => {
        const file = e.target.files[0]
        const formData = new FormData()
        formData.append('image', file)
        setUploading(true)
    
        try {
            const config = {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            }

            const { data } = await axios.post('/api/upload', formData, config)

            setImage(data)
            setUploading(false)
        } catch (error) {
            console.error(error)
            setUploading(false)
        }
    }

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(
            updateDress({
            _id: habdressId,
            name,
            price,
            image,
            brand,
            description,
            countInStock
        }))
    }
    return (
        <article>
            <Link to='/admin/dresslist' className='btn btn-light my-4'>
                Go Back
            </Link>
            <FormContainer>
            <h2>Edit Dress</h2>
            {loadingUpdate && <Loader />}
            {errorUpdate && <Message variant='danger'>{errorUpdate}</Message>}
                { loading ? (
                    <Loader />
                    ) : error ? (
                        <Message variant='danger'>{error}</Message>
                        ) : (
                    <Form onSubmit={submitHandler}>
                        <Form.Group controlId='name'>
                            <Form.Label>Name</Form.Label>
                            <Form.Control
                                type='name'
                                placeholder='Enter your name'
                                value={name}
                                onChange={(e) => setName(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='price'>
                        <Form.Label>Price</Form.Label>
                            <Form.Control
                                type='number'
                                placeholder='Enter your price'
                                value={price}
                                onChange={(e) => setPrice(e.target.value)}
                            >
                            </Form.Control>
                        </Form.Group>
                        <Form.Group controlId='image'>
                        <Form.Label>Image</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter image url'
                                value={image}
                                onChange={(e) => setImage(e.target.value)}
                            >
                            </Form.Control>
                            <Form.File 
                                id='image-file'
                                label='Choose File'
                                custom
                                onChange={uploadFileHandler}
                            >
                            </Form.File>
                            {uploading && <Loader />}
                        </Form.Group>
                        <Form.Group controlId='brand'>
                        <Form.Label>Brand</Form.Label>
                            <Form.Control
                                type='text'
                                placeholder='Enter brand'
                                value={brand}
                                onChange={(e) => setBrand(e.target.value)}
                            >
                            </Form.Control>
                            <Form.Group controlId='countInStock'>
                            <Form.Label>Count In Stock</Form.Label>
                                <Form.Control
                                    type='number'
                                    placeholder='Enter countInStock'
                                    value={countInStock}
                                    onChange={(e) => setCountInStock(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                            <Form.Group controlId='description'>
                            <Form.Label>Description</Form.Label>
                                <Form.Control
                                    type='text'
                                    placeholder='Enter Description'
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                >
                                </Form.Control>
                            </Form.Group>
                        </Form.Group>
                        <Button
                            variant='info'
                            type='submit'
                        >
                            Update
                        </Button>
                    </Form>
                )}
            </FormContainer>
        </article>
    )
}

export default DressEditPage
