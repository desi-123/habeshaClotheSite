import React from 'react'
import { Container, Row, Col } from 'react-bootstrap'
const FormContainer = ({ children }) => {
    return (
        <Container>
            <Row className="jusstify-content-md-center">
                <Col md={6} sm={12}>
                    {children}
                </Col>
            </Row>
        </Container>
    )
}

export default FormContainer
