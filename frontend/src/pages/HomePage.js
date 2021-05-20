import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import {Row, Col } from 'react-bootstrap'
import Dress from '../components/DressComponent'
import Loader from '../components/Loader'
import Message from '../components/Message'
import { listDresses } from '../redux/actions/dressActions'
import Paginat from '../components/Paginat'
import DressCarousel from '../components/DressCarousel'
import Meta from '../components/Meta'
import { Link } from 'react-router-dom'


const HomePage = ({ match }) => {

    const keyword = match.params.keyword
    
    const pageNumber = match.params.pageNumber

    const dispatch = useDispatch()
    const dressList = useSelector(state => state.dressList)
    const { loading, error, habdresses, page, pages} = dressList
    useEffect(() => {
        dispatch(listDresses(keyword, pageNumber))
    }, [dispatch, keyword, pageNumber])

    return (
        <article>
        <Meta />
        {!keyword ? <DressCarousel /> 
            : <Link to='/' className='btn-btn-light'>
            Go Back
            </Link>}
        <h2>Habesha Dresses</h2>
            { loading ? 
                <Loader /> : 
            error ? 
                <Message variant="danger">{error}</Message> : 
                <article>
                    <Row>
                        {habdresses.map(habdress => (
                            <Col key={habdress._id} sm={12} md={6} lg={4} xl={3}>
                                <Dress habdress={habdress} />
                            </Col>
                        ))}
                    </Row>
                    <Paginat 
                        page={page} 
                        pages={pages} 
                        keyword={keyword ? keyword: ''} />
                </article>
            }
        </article>
    )
}

export default HomePage
