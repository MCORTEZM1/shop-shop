import React, { useEffect } from 'react';
import { useQuery } from '@apollo/client';
import ProductItem from '../ProductItem';
import { QUERY_PRODUCTS } from '../../utils/queries';
import { useStoreContext } from '../../utils/GlobalState';
import { UPDATE_PRODUCTS } from '../../utils/actions';
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
    }
  }, [data, dispatch]);

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
