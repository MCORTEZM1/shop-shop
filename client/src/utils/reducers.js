import { useReducer } from 'react';
import { 
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY,
    ADD_TO_CART,
    ADD_MULTIPLE_TO_CART,
    UPDATE_CART_QUANTITY,
    REMOVE_FROM_CART, 
    CLEAR_CART, 
    TOGGLE_CART
} from './actions';

export const reducer = (state, action) => {
    switch (action.type) {
        // if action type is the value of 'UPDATE_PRODUCTS', return a new state object with an updated products array
        case UPDATE_PRODUCTS:
            return {
                ...state,
                products: [...action.products],
            };
        // if action type is the value of 'UPDATE_CATEGORIES', return a new state object with an updated categories array
        case UPDATE_CATEGORIES:
            return {
                ...state,
                categories: [...action.categories],
            }
        case UPDATE_CURRENT_CATEGORY:
            return {
                ...state,
                currentCategory: action.currentCategory
            };
        // if it's none of these actions, do not update the state at all and keep things the same! 
        case ADD_TO_CART: 
            return {
                ...state,
                cartOpen: true,
                cart: [...state.cart, action.product]
            };
        case ADD_MULTIPLE_TO_CART:
            return {
                ...state,
                // take current cart state, and spread out new products in array to the current state.
                cart: [...state.cart, ...action.products],
            };
        case REMOVE_FROM_CART: 
            // filter out products that have the action id into a newState as to not directly alter the state due to immutability.
            let newState = state.cart.filter(product => {
                return product._id !== action._id;
            });

            return {
                ...state, 
                // cart is open as long as there are products in the cart.
                cartOpen: newState.length > 0,
                cart: newState
            };
        case UPDATE_CART_QUANTITY: 
            return { 
                ...state,
                cartOpen: true,
                // map a new array for cart, so that state.cart is not altered directly. 
                cart: state.cart.map(product => {
                    if (action._id === product._id) {
                        product.purchaseQuantity = action.purchaseQuantity;
                    }
                    return product;
                })
            };
        case CLEAR_CART: 
            return {
                ...state,
                cartOpen: false,
                cart: []
            };
        case TOGGLE_CART: 
            return { 
                ...state, 
                cartOpen: !state.cartOpen
            }
        default:
            return state;
    }
};

// this will be used to help intialize our global state object and then provide us with the functionality
// for updating the state by automatically running it thought our custome reducer function. [more indepth useState Hook]
export function useProductReducer(initialState) {
    return useReducer(reducer, initialState);
}