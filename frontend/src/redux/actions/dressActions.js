import axios from 'axios'
import * as ActionTypes from '../constants/ActionTypes'
import { logout } from './userActions'

export const listDresses = (keyword = '', pageNumber = '') => async (dispatch) => {
    try {
        dispatch({ type: ActionTypes.DRESS_LIST_REQUEST })

        const { data } = await axios.get(`/api/habdresses?keyword=${keyword}&pageNumber=${pageNumber}`)

        dispatch({ 
            type: ActionTypes.DRESS_LIST_SUCCESS,
            payload: data
        }, 1000)
    } catch (error) {
        dispatch({ 
            type: ActionTypes.DRESS_LIST_FAIL,
            payload: error
        })
    }
}

export const listDressDetails = (id) => async (dispatch) => {
    try {
        dispatch({ type: ActionTypes.DRESS_DETAILS_REQUEST })

        const { data } = await axios.get(`/api/habdresses/${id}`)

            dispatch({ 
                type: ActionTypes.DRESS_DETAILS_SUCCESS,
                payload: data
            }, 2000)
        } catch (error) {
            dispatch({ 
                type: ActionTypes.DRESS_DETAILS_FAIL,
                payload: 
                    error.response && error.response.data.message
                        ? error.response.data.message
                        : error.message,
            })
        }
    }

export const deleteDress = (id) => async (dispatch, getState) => {
    try {
        dispatch({
        type: ActionTypes.DRESS_DELETE_REQUEST,
    })

    const {
        userLogin: { userInfo },
    } = getState()

    const config = {
        headers: {
            Authorization: `Bearer ${userInfo.token}`,
        },
    }

    await axios.delete(`/api/habdresses/${id}`, config)

    dispatch({
        type: ActionTypes.DRESS_DELETE_SUCCESS,
    })

    } catch (error) {
        const message =
        error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        if (message === 'Not authorized, token failed') {
            dispatch(logout())
        }
        dispatch({
            type: ActionTypes.DRESS_DELETE_FAIL,
            payload: message,
        })
    }
}

export const createHabdress = () => async (dispatch, getState) => {
    try {
        dispatch({
        type: ActionTypes.DRESS_ADD_REQUEST,
    })

    const {
        userLogin: { userInfo },
    } = getState()

    const config = {
        headers: {
            Authorization: `Bearer ${userInfo.token}`,
        },
    }

    const { data } = await axios.post(`/api/habdresses`, {}, config)

    dispatch({
        type: ActionTypes.DRESS_ADD_SUCCESS,
        payload: data
    })
} catch (error) {
    const message =
        error.response && error.response.data.message
        ? error.response.data.message
        : error.message
    if (message === 'Not authorized, token failed') {
        dispatch(logout())
    }
    dispatch({
        type: ActionTypes.DRESS_ADD_FAIL,
        payload: message,
    })
    }
}

export const updateDress = (habdress) => async (dispatch, getState) => {
    try {
        dispatch({
        type: ActionTypes.DRESS_UPDATE_REQUEST,
    })

    const {
        userLogin: { userInfo },
    } = getState()

    const config = {
        'Content-Type': 'application/json',
        headers: {
            Authorization: `Bearer ${userInfo.token}`,
        },
    }

    const { data } = await axios.put(`/api/habdresses/${habdress._id}`, habdress, config)

    dispatch({
        type: ActionTypes.DRESS_UPDATE_SUCCESS,
        payload: data
    })

    } catch (error) {
        const message =
        error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        if (message === 'Not authorized, token failed') {
            dispatch(logout())
        }
        dispatch({
            type: ActionTypes.DRESS_UPDATE_FAIL,
            payload: message,
        })
    }
}

export const createDresstReview = (habdressId, review) => async (
    dispatch,
    getState
    ) => {
    try {
        dispatch({
            type: ActionTypes.DRESS_CREATE_REVIEW_REQUEST,
        })

        const {
        userLogin: { userInfo },
        } = getState()

        const config = {
        headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${userInfo.token}`,
        },
    }

        await axios.post(`/api/habdresses/${habdressId}/reviews`, review, config)

        dispatch({
            type: ActionTypes.DRESS_CREATE_REVIEW_SUCCESS,
        })
    } catch (error) {
        const message =
        error.response && error.response.data.message
            ? error.response.data.message
            : error.message
        if (message === 'Not authorized, token failed') {
        dispatch(logout())
        }
        dispatch({
        type: ActionTypes.DRESS_CREATE_REVIEW_FAIL,
        payload: message,
        })
    }
}

export const listTopDress = () => async (dispatch) => {
    try {
        dispatch({ type: ActionTypes.DRESS_TOP_REQUEST })

        const { data } = await axios.get(`/api/habdresses/top`)

        dispatch({
        type: ActionTypes.DRESS_TOP_SUCCESS,
        payload: data,
        })
    } catch (error) {
        dispatch({
        type: ActionTypes.DRESS_TOP_FAIL,
        payload:
            error.response && error.response.data.message
            ? error.response.data.message
            : error.message,
        })
    }
}



// cart action

export const addToCart = (id, quantity) => async (dispatch, getState) => {
    const { data } = await axios.get(`/api/habdresses/${id}`)

    dispatch({ 
        type: ActionTypes.CART_ADD_ITEM,
        payload: { 
            habdress: data._id,
            name: data.name,
            image: data.image,
            price: data.price,
            counterInStock: data.counterInStock,
            quantity,
        }
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const removeFromCart = (id) => (dispatch, getState) => {
    dispatch({
        type: ActionTypes.CART_REMOVE_ITEM,
        payload: id,
    })
    localStorage.setItem('cartItems', JSON.stringify(getState().cart.cartItems))
}

export const saveShippingAddress = (data) => (dispatch) => {
    dispatch({
        type: ActionTypes.CART_SAVE_SHIPPING_ADDRESS,
        payload: data,
    })
    localStorage.setItem('shippingAddress', JSON.stringify(data))
    }

export const savePaymentMethod = (data) => (dispatch) => {
    dispatch({
        type: ActionTypes.CART_SAVE_PAYMENT_METHOD,
        payload: data,
    })

    localStorage.setItem('paymentMethod', JSON.stringify(data))
    }


