import * as ActionTypes from '../constants/ActionTypes'

    /* dress Reducers */

export const dressListReducer = (state = { habdresses: [] }, action) => {
    switch (action.type) {
        case ActionTypes.DRESS_LIST_REQUEST:
            return { loading: true, habdresses: [] }
        case ActionTypes.DRESS_LIST_SUCCESS:
            return { loading: false, 
                habdresses: action.payload.habdresses, 
                pages: action.payload.pages,
                page: action.payload.page
            }
        case ActionTypes.DRESS_LIST_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const dressDetailsReducer = (state = { habdress: { reviews: [] } }, action) => {
    switch (action.type) {
        case ActionTypes.DRESS_DETAILS_REQUEST:
            return { loading: true, ...state }
        case ActionTypes.DRESS_DETAILS_SUCCESS:
            return { loading: false, habdress: action.payload }
        case ActionTypes.DRESS_DETAILS_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const dressDeleteReducer = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.DRESS_DELETE_REQUEST:
            return { loading: true }
        case ActionTypes.DRESS_DELETE_SUCCESS:
            return { loading: false, success: true}
        case ActionTypes.DRESS_DELETE_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

export const dressAddReducer = (state = {}, action) => {
    switch (action.type) {
        case ActionTypes.DRESS_ADD_REQUEST:
            return { loading: true }
        case ActionTypes.DRESS_ADD_SUCCESS:
            return { loading: false, success: true, habdress: action.payload }
        case ActionTypes.DRESS_ADD_FAIL:
            return { loading: false, error: action.payload }
        case ActionTypes.DRESS_ADD_RESET:
            return {}
        default:
            return state
    }
}

export const dressUpdateReducer = (state = { habdress: {} }, action) => {
    switch (action.type) {
        case ActionTypes.DRESS_UPDATE_REQUEST:
            return { loading: true }
        case ActionTypes.DRESS_UPDATE_SUCCESS:
            return { loading: false, success: true, habdress: action.payload}
        case ActionTypes.DRESS_UPDATE_FAIL:
            return { loading: false, error: action.payload }
        case ActionTypes.DRESS_UPDATE_RESET:
            return { habdress: {} }
        default:
            return state
    }
}

export const dressReviewCreateReducer = (state = { }, action) => {
    switch (action.type) {
        case ActionTypes.DRESS_CREATE_REVIEW_REQUEST:
            return { loading: true }
        case ActionTypes.DRESS_CREATE_REVIEW_SUCCESS:
            return { loading: false, success: true,}
        case ActionTypes.DRESS_CREATE_REVIEW_FAIL:
            return { loading: false, error: action.payload }
        case ActionTypes.DRESS_CREATE_REVIEW_RESET:
            return {}
        default:
            return state
    }
}

export const dressTopRatedReducer = (state = { habdresses: [] }, action) => {
    switch (action.type) {
        case ActionTypes.DRESS_TOP_REQUEST:
            return { loading: true, habdresses: [] }
        case ActionTypes.DRESS_TOP_SUCCESS:
            return { loading: false, habdresses: action.payload,}
        case ActionTypes.DRESS_TOP_FAIL:
            return { loading: false, error: action.payload }
        default:
            return state
    }
}

    /* cartReducer */

export const cartReducer = (state = { cartItems: [], shippingAddress: {} }, action) => {
    switch (action.type) {
        case ActionTypes.CART_ADD_ITEM:
            const item = action.payload

            const existItem = state.cartItems.find((x) => x.habdress === item.habdress)

            if (existItem) {
                return {
                    ...state,
                    cartItems: state.cartItems.map((x) => x.habdress ? item : x),
                }
            } else {
                return {
                    ...state,
                    cartItems: [...state.cartItems, item],
                }
            }
        case ActionTypes.CART_REMOVE_ITEM:
            return {
                ...state,
                cartItems: state.cartItems.filter((x) => x.habdress !== action.payload),
            }
        case ActionTypes.CART_SAVE_SHIPPING_ADDRESS:
            return {
                ...state,
                shippingAddress: action.payload,
            }
        case ActionTypes.CART_SAVE_PAYMENT_METHOD:
            return {
                ...state,
                paymentMethod: action.payload,
            }
        case ActionTypes.CART_CLEAR_ITEMS:
            return {
                ...state,
                cartItems: [],
            }
        default:
            return state
    }
}