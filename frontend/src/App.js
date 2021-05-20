import React from 'react'
import { BrowserRouter as Router, Route } from 'react-router-dom'
import { Container } from 'react-bootstrap'
import Footer from './components/Footer'
import Header from './components/Header'
import HomePage from './pages/HomePage'
import DressPage from './pages/DressPage'
import CartPage from './pages/CartPage'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ProfilePage from './pages/ProfilePage'
import ShippingPage from './pages/ShippingPage'
import PaymentPage from './pages/PaymentPage'
import PlaceOrderPage from './pages/PlaceOrderPage'
import OrderPage from './pages/OrderPage'
import UserListPage from './pages/UserListPage'
import UserEditePage from './pages/UserEditePage'
import DressListPage from './pages/DressListPage'
import DressEditPage from './pages/DressEditPage'
import OrderListPage from './pages/OrderListPage'

const App = () => {
  return (
    <Router>
      <Header />
      <main>
        <Container>
          <Route exact path="/" component={HomePage} />
          <Route exact path="/search/:keyword" component={HomePage} />
          <Route exact path="/page/:pageNumber" component={HomePage} />
          <Route exact path="/search/:keyword/page/:pageNumber" component={HomePage} />
          <Route path="/habdress/:id" component={DressPage} />
          <Route path="/cart/:id?" component={CartPage} />
          <Route path="/login" component={LoginPage} />
          <Route path="/register" component={RegisterPage} />
          <Route path="/profile" component={ProfilePage} />
          <Route path="/shipping" component={ShippingPage} />
          <Route path="/payment" component={PaymentPage} />
          <Route path="/placeorder" component={PlaceOrderPage} />
          <Route path="/order/:id" component={OrderPage} />

          <Route path="/admin/userlist" component={UserListPage} />
          <Route path="/admin/user/:id/edit" component={UserEditePage} />
          <Route exact path="/admin/dresslist/" component={DressListPage} />
          <Route exact path="/admin/dresslist/:pageNumber" component={DressListPage} />
          <Route path="/admin/habdress/:id/edit" component={DressEditPage} />
          <Route path="/admin/orderlist" component={OrderListPage} />
        </Container>
      </main>
      <Footer />
    </Router>
  )
}

export default App
