import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Link } from 'react-router-dom'
import { Row, Col, Image, ListGroup, Card, Button, Form } from 'react-bootstrap'
//import Loader from '../components/Loader'
import Message from '../components/Message'
import { addToCart, removeFromCart } from '../redux/actions/dressActions'

const CartPage = ({ match, location, history }) => {
    const dressId = match.params.id
    const quantity = location.search ? Number(location.search.split('=')[1]) : 1

    const dispatch = useDispatch()

    const cart = useSelector((state) => state.cart)
    const { cartItems } = cart

    useEffect(() => {
        if (dressId) {
            dispatch(addToCart(dressId, quantity))
        }
    }, [dispatch, dressId, quantity])

    const removeFromCartHandler = (id) => {
        dispatch(removeFromCart(id))
    }

    const checkoutHandler = () => {
        history.push('/login?redirect=shipping')
        }

    return (
        <Row>
            <Col md={8}>
            <h2>Shopping Cart</h2>
            {cartItems.length === 0 ? (
                <Message>
                    Your cart is empty<Link to='/'> GO back</Link>
                </Message>
            ) : (
                <ListGroup variant='flush'>
                    {cartItems.map((item) => (
                        <ListGroup.Item key={item.habdress}>
                            <Row>
                                <Col md={2}>
                                    <Image src={item.image} alt={item.name} fluid rounded />
                                </Col>
                                <Col md={3}>
                                    <Link to={`/habdress/${item.habdress}`}>{item.name}</Link>
                                </Col>
                                <Col md={2}>${item.price}</Col>
                                <Col md={2}>
                                    <Form.Control
                                        as='select'
                                        value={item.quantity}
                                        onChange={(e) => 
                                        dispatch(
                                            addToCart(item.habdress, Number(e.target.value))
                                        )
                                        }
                                    >
                                    {[...Array(item.countInStock).keys()].map((x) => (
                                        <option key={x + 1} value={x + 1}>
                                        {x + 1}
                                        </option>
                                    ))}
                                    </Form.Control>
                                    <Col md={2}>
                                        <Button
                                        className='bg-danger'
                                        type='button'
                                        variant='warning'
                                        onClick={() => removeFromCartHandler(item.habdress)}
                                        >
                                        <i className='fa fa-trash' /> remove
                                        </Button>
                                    </Col>
                                </Col>
                            </Row>
                        </ListGroup.Item>
                    ))}
                </ListGroup>
            )}
            </Col>
            <Col md={4}>
                <Card>
                    <ListGroup variant='flush'>
                        <ListGroup.Item>
                            <h2 className='text-uppercase'>
                            Subtotal ({cartItems.reduce((acc, item) => acc + item.quantity, 0)})items
                            </h2>
                            $
                            {cartItems
                                .reduce((acc, item) => acc + item.quantity * item.price, 0)
                                .toFixed(2)
                            }
                        </ListGroup.Item>
                        <ListGroup.Item>
                            <Button
                                type='button'
                                className='btn-block'
                                disabled={cartItems.length === 0}
                                onClick={checkoutHandler}
                            >
                            Proceed to checkout
                            </Button>
                        </ListGroup.Item>
                    </ListGroup>
                </Card>
            </Col>
        </Row>
    )
}

export default CartPage
