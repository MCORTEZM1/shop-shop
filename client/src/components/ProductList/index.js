import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import ProductItem from '../ProductItem';
import { QUERY_PRODUCTS } from '../../utils/queries';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_PRODUCTS } from '../../utils/actions';
import { idbPromise } from '../../utils/helpers';
import spinner from '../../assets/spinner.gif';

function ProductList() {
  // immediately retrieve current globals state aand dispatch
  const [state, dispatch] = useStoreContext();
  // destructure current category data to use in filterProducts
  const { currentCategory } = state;
  // query for data
  const { loading, data } = useQuery(QUERY_PRODUCTS);
  // once there is data, call dipatch to change current state
  useEffect(() => {
    if (data) {
      // instructs our reducer function that its the updateproducts action and it should save the array of product data to our global store
      // once this is done, useStoreContext() triggers again, giving us the product data needed to display
      dispatch({
        type: UPDATE_PRODUCTS,
        products: data.products
      });

      // also take each product and save it to indexedDB
      data.products.forEach((product) => {
        idbPromise('products', 'put', product);
      });
    }
    // check if `loading` is undefined in `useQuery()` Hook, meaning we lost connection.
    else if (!loading) {
      // since we're offline, get all of the data from the `products` store
      idbPromise('products', 'get').then((products) => {
        // use retrieved data to set global state for offline browsing
        dispatch({
          type: UPDATE_PRODUCTS,
          products: products
        });
      });
    }
  }, [data, loading, dispatch]);

  function filterProducts() {
    if (!currentCategory) {
      return state.products;
    }

    return state.products.filter(
      (product) => product.category._id === currentCategory
    );
  }

  return (
    <div className="my-2">
      <h2>Our Products:</h2>
      {/* update to state.products.length, since we are now retrieving from state object */}
      {state.products.length ? (
        <div className="flex-row">
          {filterProducts().map((product) => (
            <ProductItem
              key={product._id}
              _id={product._id}
              image={product.image}
              name={product.name}
              price={product.price}
              quantity={product.quantity}
            />
          ))}
        </div>
      ) : (
        <h3>You haven't added any products yet!</h3>
      )}
      {loading ? <img src={spinner} alt="loading" /> : null}
    </div>
  );
}

export default ProductList;
