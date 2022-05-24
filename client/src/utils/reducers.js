import { useReducer } from 'react';
import { 
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY
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
        default:
            return state;
    }
};

// this will be used to help intialize our global state object and then provide us with the functionality
// for updating the state by automatically running it thought our custome reducer function. [more indepth useState Hook]
export function useProductReducer(initialState) {
    return useReducer(reducer, initialState);
}