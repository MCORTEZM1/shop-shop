import React, { useEffect } from 'react';
import { UPDATE_CATEGORIES, UPDATE_CURRENT_CATEGORY } from '../../utils/actions';
import { useQuery } from '@apollo/client';
import { QUERY_CATEGORIES } from '../../utils/queries';
import { useStoreContext } from '../../utils/GlobalState';
import { idbPromise } from '../../utils/helpers';

function CategoryMenu() {
  // on component use, immediately call useStoreContext Hook to retrieve the current state and dispatch from GSO
  const [state, dispatch] = useStoreContext();
  // we only need 'categories' from global state, so we destructure it from state. 
  const { categories } = state;
  //  need to take this data and use the dispatch method to set globals state
  const { loading, data: categoryData } = useQuery(QUERY_CATEGORIES);

  // useEffect triggers when useQuery data is returned and UE recognizes that category data is no longer undefined.
  useEffect(() => {
    // if categoryData exists or has changed from teh response of useQuery, then run dispatch()
    if (categoryData) {
      // execute our dispatch function with our action object indicating the type of caction and the data to set our state for categories to.
      dispatch({
        // runs dispatch setting out category data to the global state.
        type: UPDATE_CATEGORIES,
        categories: categoryData.categories
      });

      // also post useQuery data to indexedDB
      categoryData.categories.forEach(category => {
        idbPromise('categories', 'put', category);
      });
    }
    else if (!loading) {
      idbPromise('categories', 'get').then(categories => {
        dispatch({
          type: UPDATE_CATEGORIES,
          categories: categories
        });
      });
    }
    // function is dependent on the loading state, so we include it in this array.
  }, [categoryData, loading, dispatch]);

  // update click handler to update global state instead of using the function we recieve as a prop from Home component.
  const handleClick = id => {
    dispatch({
      type: UPDATE_CURRENT_CATEGORY,
      currentCategory: id
    });
  };

  return (
    <div>
      <h2>Choose a Category:</h2>
      {categories.map(item => (
        <button
          key={item._id}
          onClick={() => {
            handleClick(item._id);
          }}
        >
          {item.name}
        </button>
      ))}
    </div>
  );
}

export default CategoryMenu;
