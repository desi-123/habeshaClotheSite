import React, { useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Carousel, Image } from 'react-bootstrap'
import { useDispatch, useSelector } from 'react-redux'
import Loader from './Loader'
import Message from './Message'
import { listTopDress } from '../redux/actions/dressActions'

const DressCarousel = () => {
    const dispatch = useDispatch()

    const dressTopRated = useSelector((state) => state.dressTopRated)
    const { loading, error, habdresses } = dressTopRated

    useEffect(() => {
        dispatch(listTopDress())
    }, [dispatch])
    return loading ? (
        <Loader />
        ) : error ? (
        <Message variant='danger'>{error}</Message>
        ) : (
        <Carousel pause='hover' className='bg-warning'>
            {habdresses.map((habdress) => (
            <Carousel.Item key={habdress._id}>
                <Link to={`/habdress/${habdress._id}`}>
                <Image src={habdress.image} alt={habdress.name} fluid />
                <Carousel.Caption className='carousel-caption'>
                    <h2>
                    {habdress.name} (${habdress.price})
                    </h2>
                </Carousel.Caption>
                </Link>
            </Carousel.Item>
            ))}
        </Carousel>
    )
}

export default DressCarousel
