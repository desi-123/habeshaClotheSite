import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Form, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import FormContainer from '../components/FormContainer'
import { login } from '../redux/actions/userActions'
import Message from '../components/Message'
import Loader from '../components/Loader'

const LoginPage = ({ location, history }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')

    const dispatch = useDispatch()

    const userLogin = useSelector((state) => state.userLogin)
    const { loading, error, userInfo } = userLogin

    const redirect = location.search ? location.search.split('=')[1] : '/'

    useEffect(() => {
        if(userInfo) {
            history.push(redirect)
        }
    }, [history, userInfo, redirect])

    const submitHandler = (e) => {
        e.preventDefault()
        dispatch(login(email, password))
    }
    return (
        <FormContainer>
        <h2>Sign In</h2>
        { error && <Message variant='danger'>{error}</Message> }
        { loading &&  <Loader /> }
        <Form onSubmit={submitHandler}>
            <Form.Group controlId='email'>
                <Form.Label>Email</Form.Label>
                <Form.Control
                    type='email'
                    placeholder='Enter your email'
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                >
                </Form.Control>
            </Form.Group>
            <Form.Group controlId='password'>
            <Form.Label>Password</Form.Label>
                <Form.Control
                    type='password'
                    placeholder='Enter your password'
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                >
                </Form.Control>
            </Form.Group>
            <Button
                className='btn-outline-info btn-block'
                type='submit'
            >
                Sign In
            </Button>
        </Form>
        <Row className='py-3'>
            <Col>
                New Customer?{' '}
                <Link to={redirect ? `/register?redirect=${redirect}` : '/register'}>
                Register
                </Link>
            </Col>
        </Row>
        </FormContainer>
    )
}

export default LoginPage
