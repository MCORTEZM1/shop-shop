import React, { useEffect } from 'react';
import { useLazyQuery } from '@apollo/client';
import CartItem from '../CartItem';
import Auth from '../../utils/auth';
import './style.css';


// global store 
import { useStoreContext } from '../../utils/GlobalState';
import { TOGGLE_CART, ADD_MULTIPLE_TO_CART } from '../../utils/actions';
import { QUERY_CHECKOUT } from '../../utils/queries';
import { loadStripe } from '@stripe/stripe-js';

import { idbPromise } from '../../utils/helpers';

// test stripe API key included
const stripePromise = loadStripe('pk_test_TYooMQauvdEDq54NiTphI7jx')

const Cart = () => {
    const [state, dispatch] = useStoreContext();

    // add lazyQuery to query checkout- like regular useQuery, but doesnt render on component load, instead when called
    // data variable will contain the checkout session after the query is called with the getCheckout function.
    const [getCheckout, {data}] = useLazyQuery(QUERY_CHECKOUT);

    // check if there's anything in the state's cart property on load 
    useEffect(() => {
        async function getCart() {
            // get data for cart store
            const cart = await idbPromise('cart', 'get');
            // update global state. Add multiple, in case its an array of items coming in from indexedDB!
            dispatch({ type: ADD_MULTIPLE_TO_CART, products: [...cart] });
        };
        // we are checking to see if state.cart.length is 0, then we can retrive items from indexedDB, then save to global state
        if(!state.cart.length) {
            getCart();
        }
        // even if there is nothing in indexedDB: The Hook runs on load no matter what, 
        // but then it only runs again if any value in the dependency array has changed since the last time it ran.
    }, [state.cart.length, dispatch])

    useEffect(() => {
        if (data) {
            stripePromise.then((res) => {
                res.redirectToCheckout({ sessionId: data.checkout.session })
            })
        }
    }, [data])

    function toggleCart() {
        dispatch({ type: TOGGLE_CART });
    }

    function calculateTotal() {
        let sum = 0;
        state.cart.forEach(item => {
            sum += item.price * item.purchaseQuantity
        });

        return sum.toFixed(2);
    }

    function submitCheckout() {
        const productIds = [];

        state.cart.forEach((item) => {
            for (let i = 0; i < item.purchaseQuantity; i++) {
                productIds.push(item._id);
            }
        });

        getCheckout({
            variables: { products: productIds }
        });
    }

    if (!state.cartOpen) {
        return (
            <div className='cart-closed' onClick={toggleCart}>
                <span
                    role="img"
                    aria-label="trash">🛒</span>
            </div>
        );
    }

    return (
        <div className='cart'> 
            <div className='close' onClick={toggleCart}>[close]</div>
            <h2>Shopping Cart</h2>
            {state.cart.length ? (
                <div>
                {state.cart.map(item => (
                    <CartItem key={item._id} item={item} />
                ))}
                <div className='flex-row space-between'>
                    <strong>Total: ${calculateTotal()}</strong>
                    {
                        Auth.loggedIn() ? 
                            <button onClick={submitCheckout}>
                                Checkout
                            </button>
                            :
                            <span>(log in to check out)</span>
                    }
                </div>
            </div>
            ) : (
                <h3>
                    <span role="img" aria-label="shocked">
                        😱
                    </span>
                    You haven't added anything to your cart yet!
                </h3>
            )}
        </div>
    );
};


export default Cart;