import {
    UPDATE_PRODUCTS,
    UPDATE_CATEGORIES,
    UPDATE_CURRENT_CATEGORY
} from '../utils/actions';
import { reducer } from '../utils/reducers';

// create a sample of what our global state will look like

const intialState = {
    // empty array of products
    products: [],
    // a single category thats in a list
    categories: [{ name: 'Food' }],
    // a currentCategory which refers to the indexof the categories array
    currentCategory: '1',
};


// test for updating product list
test('UPDATE_PRODUCTS', () => {
    let newState = reducer(intialState, {
        type: UPDATE_PRODUCTS,
        products: [{}, {}]
    });

    expect(newState.products.length).toBe(2);
    expect(intialState.products.length).toBe(0);
});

test('UPDATE_CATEGORIES', () => {
    let newState = reducer(intialState, {
        type: UPDATE_CATEGORIES,
        categories: [{}, {}]
    });

    expect(newState.categories.length).toBe(2);
    expect(intialState.categories.length).toBe(1);
});

test('UPDATE_CURRENT_CATEGORY', () => {
    let newState = reducer(intialState, {
        type: UPDATE_CURRENT_CATEGORY,
        currentCategory: "2"
    });

    expect(newState.currentCategory).toBe("2");
    expect(intialState.currentCategory).toBe("1");
});
