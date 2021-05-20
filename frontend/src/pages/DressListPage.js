import React, { useEffect } from 'react'
import { LinkContainer } from 'react-router-bootstrap'
import { Table, Button, Row, Col } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import * as ActionTypes from '../redux/constants/ActionTypes'
import Message from '../components/Message'
import Loader from '../components/Loader'
import { createHabdress, deleteDress, listDresses } from '../redux/actions/dressActions'
import Paginat from '../components/Paginat'

const DressListPage = ({ history, match }) => {
    const pageNumber = match.params.pageNumber || 1

    const dispatch = useDispatch()

    const dressList = useSelector((state) => state.dressList)
    const { loading, error, habdresses, page, pages } = dressList

    const dressDelete = useSelector((state) => state.dressDelete)
    const { loading: loadingDelete, error: errorDelete, success: successDelete } = dressDelete

    const addhabdress = useSelector((state) => state.addhabdress)
    const { habdress: addedHabdress, loading: loadingAdd, error: errorAdd, success: successAdd } = addhabdress

    const userLogin = useSelector((state) => state.userLogin)
    const { userInfo } = userLogin


    useEffect(() => {
        dispatch({ type: ActionTypes.DRESS_ADD_RESET})
        if (!userInfo || !userInfo.isAdmin) {
            history.push('/login')
        }

        if(successAdd) {
            history.push(`/admin/habdress/${addedHabdress._id}/edit`)
        } else {
            dispatch(listDresses('', pageNumber))
        }
    }, [dispatch, history, userInfo, successDelete, successAdd, addedHabdress, pageNumber])

    const deleteHandler = (id) => {
        if (window.confirm('Are you sure')) {
        dispatch(deleteDress(id))
        }
    }

    const createHabdressHandler = () => {
        dispatch(createHabdress())
    }
    return (
        <article>
            <Row className='align-items-center'>
                <Col>
                    <h1>Dresses</h1>
                </Col>
                <Col className='text-right'>
                    <Button className='my-4' onClick={createHabdressHandler}>
                        <i className='fa fa-plus' /> Add Dress
                    </Button>
                </Col>
            </Row>
            {loadingDelete && <Loader />}
            {errorDelete && <Message>{errorDelete}</Message>}
            {loadingAdd && <Loader />}
            {errorAdd && <Message>{errorAdd}</Message>}
            {loading ? (
                <Loader />
                ) : error ? (
                <Message variant='danger'>{error}</Message>
                ) : (
                    <article>
                        <Table striped bordered hover responsive className='table-sm'>
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>NAME</th>
                                    <th>PRICE</th>
                                    <th>BRAND</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>
                                {habdresses.map((habdress) => (
                                    <tr key={habdress._id}>
                                        <td>{habdress._id}</td>
                                        <td>{habdress.name}</td>
                                        <td>
                                            ${habdress.price}
                                        </td>
                                        <td>
                                            {habdress.brand}
                                        </td>
                                        <td>
                                        <LinkContainer to={`/admin/habdress/${habdress._id}/edit`}>
                                            <Button variant='light' className='btn-sm'>
                                                <i className='fas fa-edit' />
                                            </Button>
                                        </LinkContainer>
                                        <Button
                                            variant='danger'
                                            className='btn-sm'
                                            onClick={() => deleteHandler(habdress._id)}
                                        >
                                        <i className='fa fa-trash' />
                                        </Button>
                                    </td>
                                </tr>
                            ))}
                            </tbody>
                        </Table>
                        <Paginat 
                            page={page}
                            pages={pages}
                            isAdmin={true}
                        />
                    </article>
            )}
        </article>
    )
}

export default DressListPage