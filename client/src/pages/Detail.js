import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { useQuery } from '@apollo/client';

import { QUERY_PRODUCTS } from '../utils/queries';
import { useStoreContext } from '../utils/GlobalState';
import { 
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  ADD_TO_CART,
  UPDATE_PRODUCTS, 
} from '../utils/actions';

import Cart from '../components/Cart';
import spinner from '../assets/spinner.gif';
import { idbPromise } from '../utils/helpers';

// What we'll change here is that we want to display that item's data from the global state instead of from the useQuery() response
function Detail() {
  // get global state and dispatch
  const [state, dispatch] = useStoreContext();
  // get id from use params
  const { id } = useParams();

  // we are saving the state locally here, since we do not need this data anywhere else except for in 
  // this instance on this 1 component. Form data [login/signup] is also not saved to global state, since we only need it there.
  const [currentProduct, setCurrentProduct] = useState({});

  const { loading, data } = useQuery(QUERY_PRODUCTS);

  const { products, cart } = state;

  // It first checks to see if there's data in our global state's products array. 
  // If there is, we use it to figure out which product is the current one that we want to display.
  useEffect(() => {
    // It does this finding the one with the matching _id value that we grabbed from the useParams() Hook. 
    // But what happens if we don't have any products in our global state object? Then you wouldn't have any products saved in global state just yet
// already in global sore
    if (products.length) {
      // if we don't, we'll use the product data that we returned from the useQuery() Hook to set the product data to the global state object. 
      setCurrentProduct(products.find((product) => product._id === id));
    }
// retrieved from server
    else if (data) { 
      dispatch({ 
        type: UPDATE_PRODUCTS,
        products: data.products
      });
      // when we make a server request, we also put the data in indexedDB.
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    }
    // get cache from idb 
    else if (!loading) {
      idbPromise('products', 'get').then((indexedProducts) => {
        dispatch({
          type: UPDATE_PRODUCTS, 
          products: indexedProducts
        });
      });
    }
     // dependency array, is set up to accept products from state, or data from the useQuery() Hook
     // the Hook's functionality is dependent on them to work and only runs when it detects a new value/change
  }, [products, data, loading, dispatch, id]);

  const addToCart = () => {
    const itemInCart = cart.find((cartItem) => cartItem._id === id);

    if (itemInCart) {
      // if an item is already in the cart, update quantity instead of creating new addition
      dispatch({
        type: UPDATE_CART_QUANTITY,
        _id: id,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
      // if we're updating the quantity, use existing item data and increment the purchaseQuantity by one in indexedDb
      idbPromise('cart', 'put', {
        ...itemInCart,
        purchaseQuantity: parseInt(itemInCart.purchaseQuantity) + 1
      });
    }
    else {
      // if an item is being added to the cart for the first time [or no duplicate];
      dispatch({
        type: ADD_TO_CART,
        product: { ...currentProduct, purchaseQuantity: 1}
      });
      // if prduct isn't in the cart yet, add it to the current shopping cart in indexedDB
      idbPromise('cart', 'put', { ...currentProduct, purchaseQuantity: 1 });
    }
  }

  const removeFromCart = () => {
    dispatch({
      type: REMOVE_FROM_CART,
      _id: currentProduct._id
    });

    // upon removal from cart, delete the item from indexedDB using the 'currentProduct._id' to locate what to remove
    idbPromise('cart', 'delete', { ...currentProduct });
  }

  return (
    <>
      {currentProduct ? (
        <div className="container my-1">
          <Link to="/">??? Back to Products</Link>

          <h2>{currentProduct.name}</h2>

          <p>{currentProduct.description}</p>

          <p>
            <strong>Price:</strong>${currentProduct.price}{' '}
            <button onClick={addToCart}>Add to Cart</button>
            <button
              disabled={!cart.find(p => p._id === currentProduct._id)}
              onClick={removeFromCart}
            >
              Remove from Cart
            </button>
          </p>

          <img
            src={`/images/${currentProduct.image}`}
            alt={currentProduct.name}
          />
        </div>
      ) : null}
      {loading ? <img src={spinner} alt="loading" /> : null}
      <Cart />
    </>
  );
}

export default Detail;
