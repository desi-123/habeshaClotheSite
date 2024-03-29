import React, { useState, useEffect } from 'react'
import { PayPalButton } from 'react-paypal-button-v2'
import axios from 'axios'
import * as ActionTypes from '../redux/constants/ActionTypes'
import { Link } from 'react-router-dom'
import { Button, Row, Col, ListGroup, Image, Card } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { deliverOrder, getOrderDetails, payOrder } from '../redux/actions/orderActions'

const OrderPage = ({ match, history }) => {
    const orderId = match.params.id

    const [sdkReady, setSdkReady] = useState(false)

    const dispatch = useDispatch()

    const orderDetails = useSelector(state => state.orderDetails)
    const { order, loading, error } = orderDetails

    const orderPay = useSelector((state) => state.orderPay)
    const { loading: loadingPay, success: successPay } = orderPay

    const orderDeliver = useSelector((state) => state.orderDeliver)
    const { loading: loadingDeliver, success: successDeliver  } = orderDeliver

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin

    if (!loading) {
        const addDecimals = (num) => {
            return (Math.round(num * 100) / 100).toFixed(2)
        }

        order.itemsPrice = addDecimals(
            order.orderItems.reduce((acc, item) => acc + item.price * item.quantity, 0)
        )
    }


useEffect(() => {
    if (!userInfo) {
        history.push('/login')
    }
    const addPayPalScript = async () => {
        const { data: clientId } = await axios.get('/api/config/paypal')
        const script = document.createElement('script')
        script.type = 'text/javascript'
        script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}`
        script.async = true
        script.onload = () => {
            setSdkReady(true)
        }
        document.body.appendChild(script)
    }
    if (!order || successPay || successDeliver) {
        dispatch({ type: ActionTypes.ORDER_PAY_RESET })
        dispatch({ type: ActionTypes.ORDER_DELIVER_RESET })
        dispatch(getOrderDetails(orderId))
    } else if (!order.isPaid) {
        if (!window.paypal) {
            addPayPalScript()
        } else {
            setSdkReady(true)
        }
    }
    // eslint-disable-next-line 
}, [dispatch, orderId, successPay, successDeliver, order])

const successPaymentHandler = (paymentResult) => {
    console.log(paymentResult)
    dispatch(payOrder(orderId, paymentResult))
}

const deliverHandler = () => {
    dispatch(deliverOrder(order))
}

    return (

        loading ? <Loader /> : error ? <Message variant='danger'>{error}</Message> : 
        <article>
            <h1>Order {order._id}</h1>
            <Row>
                <Col md={8}>
                    <ListGroup variant='info'>
                        <ListGroup.Item>
                            <h2>Shipping</h2>
                            <p><strong>Name: </strong> {order.user.name}</p>
                            <p><Link to={`mailto: ${order.user.email}`}></Link></p>
                            <p><strong>Email: </strong>{order.user.email}</p>
                            <p>
                                <strong>Address: </strong>
                                {order.shippingAddress.address}, {' '} 
                                {order.shippingAddress.city}, {' '} 
                                {order.shippingAddress.postalCode}, {' '} 
                                {order.shippingAddress.country}
                            </p>

                            {order.isDelivered ? (
                                <Message variant='sucess'>Delivered on {order.deliveredAt}</Message>
                            ) : ( 
                                <Message variant='danger'>Not Delivered</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Payment Method</h2>
                            <p>
                                <strong>Method: </strong>
                                {order.paymentMethod}
                            </p>
                            {order.isPaid ? (
                                <Message variant='sucess'>Paid on {order.paidAt}</Message>
                            ) : ( 
                                <Message variant='danger'>Not Paid</Message>
                            )}
                        </ListGroup.Item>

                        <ListGroup.Item>
                            <h2>Order Items</h2>
                            <strong>Method: </strong>
                            {order.orderItems.length === 0 ? <Message>Your order is empty</Message> : (
                                <ListGroup variant='info'>
                                    {order.orderItems.map((item, index) => (
                                        <ListGroup.Item key={index}>
                                            <Row>
                                                <Col md={3}>
                                                    <Image src={item.image} alt={item.name} fluid rounded />
                                                </Col>
                                                <Col>
                                                    <Link to={`/habdress/${item.habdress}`}>
                                                        {item.name}
                                                    </Link>
                                                </Col>
                                                <Col md={4}>
                                                    {item.quantity} x ${item.price} = ${item.quantity * item.price}
                                                </Col>
                                                <Col md={6}>
                                                    <Card>
                                                        <ListGroup variant='info'>
                                                            <ListGroup.Item>
                                                                <h2>Order Summary</h2>
                                                            </ListGroup.Item>
                                                            <ListGroup.Item>
                                                                <Row>
                                                                    <Col>Items</Col>
                                                                    <Col>${order.itemsPrice}</Col>
                                                                </Row>
                                                            </ListGroup.Item>

                                                            <ListGroup.Item>
                                                                <Row>
                                                                    <Col>Shipping</Col>
                                                                    <Col>${order.shippingPrice}</Col>
                                                                </Row>
                                                            </ListGroup.Item>

                                                        <ListGroup.Item>
                                                        <Row>
                                                            <Col>Tax</Col>
                                                            <Col>${order.taxPrice}</Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                    
                                                    <ListGroup.Item>
                                                        <Row>
                                                            <Col>Total</Col>
                                                            <Col>${order.totalPrice}</Col>
                                                        </Row>
                                                    </ListGroup.Item>
                                                        </ListGroup>
                                                    </Card>
                                                </Col>
                                            </Row>
                                        </ListGroup.Item>
                                    ))}
                                </ListGroup>
                            )}
                        </ListGroup.Item>

                        {!order.isPaid && (
                            <ListGroup.Item>
                                {loadingPay && <Loader />}
                                {!sdkReady ? <Loader /> : (
                                    <PayPalButton 
                                        amount={order.totalPrice}
                                        onSuccess={successPaymentHandler}
                                    />
                                )}
                            </ListGroup.Item>
                        )}

                        {loadingDeliver && <Loader />}
                        {userInfo &&
                            userInfo.isAdmin &&
                            order.isPaid &&
                            !order.isDelivered && (
                            <ListGroup.Item>
                                <Button
                                type='button'
                                className='btn btn-block'
                                onClick={deliverHandler}
                                >
                                Mark As Delivered
                                </Button>
                            </ListGroup.Item>
                            )}
                    </ListGroup>
                </Col>
            </Row>
        </article>
    )
}

export default OrderPage
