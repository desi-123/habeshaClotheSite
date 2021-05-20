import React from 'react'
import { Card } from 'react-bootstrap'
import { Link } from 'react-router-dom'
import Rating from './RatingComponent'

const Dress = ({ habdress }) => {
    return (
        <Card className="my-3 p-3 rounded">
            <Link to={`/habdress/${habdress._id}`}>
                <Card.Img src={habdress.image} variant="top" />
            </Link>
            <Card.Body>
                <Link to={`/habdress/${habdress._id}`}>
                <Card.Title>{habdress.name}</Card.Title>
                </Link>
                <Card.Text as="div">
                    <Rating 
                        value={habdress.rating}
                        text={`${habdress.numReviews} reviews`}
                        color="darkgreen"
                    />
                </Card.Text>
                    <Card.Text as="h3">${habdress.price}</Card.Text>
            </Card.Body>
        </Card>
    )
}

export default Dress
