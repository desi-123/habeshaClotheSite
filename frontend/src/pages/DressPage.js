import React, { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
import * as ActionTypes from '../redux/constants/ActionTypes'
import Loader from '../components/Loader'
import Message from '../components/Message'
import Rating from '../components/RatingComponent'
import Meta from '../components/Meta'
import { createDresstReview, listDressDetails } from '../redux/actions/dressActions'



const DressPage = ({ history, match }) => {
    const [quantity, setQuantity] = useState(0)
    const [rating, setRating] = useState(0)
    const [comment, setComment] = useState('')

    const dispatch = useDispatch()

    const dressDetails = useSelector(state => state.dressDetails)
    const { loading, error, habdress} = dressDetails

    const userLogin = useSelector(state => state.userLogin)
    const { userInfo } = userLogin


    const dressReviewCreate = useSelector(state => state.dressReviewCreate)
    const { 
        success: successDressReview, 
        loading: loadingDressReview,
        error: errorDressReview, 
    } = dressReviewCreate

    useEffect(() => {
        if (successDressReview) {
            alert('Review Submitted!')
            setRating(0)
            setComment('')
            dispatch({ type: ActionTypes.DRESS_CREATE_REVIEW_RESET })
        }
        dispatch(listDressDetails(match.params.id))
    }, [dispatch, match, successDressReview])

    const addToCartHandler = () => {
        history.push(`/cart/${match.params.id}? quantity=${quantity}`)
    }

    const submitReviewHandler = (e) => {
        e.preventDefault()
        dispatch(
            createDresstReview(match.params.id), {
                rating,
                comment,
            }
        )
    }
    return (
        <article>
            <Link className="btn btn-warning my-3" to="/">
                Go HomePage
            </Link>
            { loading ? 
                <Loader /> 
                : 
                error ? 
                <Message variant="danger">{error}</Message> : (
                    <article>
                    <Meta title={habdress.name} />
                        <Row>
                            <Col md={6}>
                                <Image src={habdress.image} alt={habdress.name} fluid />
                            </Col>
                            <Col md={3}>
                                <ListGroup>
                                    <ListGroup.Item>
                                        <h3>{habdress.name}</h3>
                                    </ListGroup.Item>
                                    <Rating 
                                        value={habdress.rating}
                                        text={`${habdress.numReviews} reviews`}
                                    />
                                    <ListGroup.Item>
                                        Price: ${habdress.price}
                                    </ListGroup.Item>
                                    <ListGroup.Item>
                                        Description: ${habdress.description}
                                    </ListGroup.Item>
                                </ListGroup>
                            </Col>
                            <Col md={3}>
                                <Card>
                                    <ListGroup variant="flush">
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Price:</Col>
                                                <Col>${habdress.price}</Col>
                                            </Row>
                                        </ListGroup.Item>
                                        <ListGroup.Item>
                                            <Row>
                                                <Col>Status:</Col>
                                                <Col>$ {habdress.countInStock > 0 ? "In Stock" : "Out of In Stock"}
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>

                                        {habdress.countInStock > 0 && (
                                            <ListGroup.Item>
                                                <Row>
                                                    <Col>No. Quantity</Col>
                                                    <Col>
                                                        <Form.Control as='select' value={quantity} onChange={(e) => setQuantity(e.target.value)}>
                                                        {[...Array(habdress.countInStock).keys()].map(x => (
                                                            <option key={x + 1} value={x + 1}>
                                                            {x + 1}
                                                            </option>
                                                        ))}
                                                        </Form.Control>
                                                    </Col>
                                                </Row>
                                            </ListGroup.Item>
                                        )}
                                        <ListGroup.Item>
                                            <Button onClick={addToCartHandler} className="btn-block" type="button" disabled={habdress.countInStock === 0}>
                                                Add To Cart
                                            </Button>
                                        </ListGroup.Item>
                                    </ListGroup>
                                </Card>
                            </Col>
                        </Row>
                        <Row>
                            <Col md={6}>
                                <h2>Reviews</h2>
                                {habdress.reviews.length === 0 && <Message>No Reviews</Message>}
                                <ListGroup variant='flush'>
                                {habdress.reviews.map((review) => (
                                    <ListGroup.Item key={review._id}>
                                    <strong>{review.name}</strong>
                                    <Rating value={review.rating} />
                                    <p>{review.createdAt.substring(0, 10)}</p>
                                    <p>{review.comment}</p>
                                    </ListGroup.Item>
                                ))}
                                <ListGroup.Item>
                                    <h2>Write a Customer Review</h2>
                                    {successDressReview && (
                                    <Message variant='success'>
                                        Review submitted successfully
                                    </Message>
                                    )}
                                    {loadingDressReview && <Loader />}
                                    {errorDressReview && (
                                    <Message variant='danger'>{errorDressReview}</Message>
                                    )}
                                    {userInfo ? (
                                    <Form onSubmit={submitReviewHandler}>
                                        <Form.Group controlId='rating'>
                                        <Form.Label>Rating</Form.Label>
                                        <Form.Control
                                            as='select'
                                            value={rating}
                                            onChange={(e) => setRating(e.target.value)}
                                        >
                                            <option value=''>Select...</option>
                                            <option value='1'>1 - Poor</option>
                                            <option value='2'>2 - Fair</option>
                                            <option value='3'>3 - Good</option>
                                            <option value='4'>4 - Very Good</option>
                                            <option value='5'>5 - Excellent</option>
                                        </Form.Control>
                                        </Form.Group>
                                        <Form.Group controlId='comment'>
                                        <Form.Label>Comment</Form.Label>
                                        <Form.Control
                                            as='textarea'
                                            row='3'
                                            value={comment}
                                            onChange={(e) => setComment(e.target.value)}
                                        ></Form.Control>
                                        </Form.Group>
                                        <Button
                                        disabled={loadingDressReview}
                                        type='submit'
                                        variant='primary'
                                        >
                                        Submit
                                        </Button>
                                    </Form>
                                    ) : (
                                    <Message>
                                        Please <Link to='/login'>sign in</Link> to write a review{' '}
                                    </Message>
                                    )}
                                </ListGroup.Item>
                                </ListGroup>
                            </Col>
                        </Row>
                    </article>
                )}
        </article>
    )
}

export default DressPage
