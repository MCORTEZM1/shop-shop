// createContext will be used to instantiate the new Context object. Used to create the container to hould our GS data and functionality
// useContext Hook that will allow us to use the state created from teh createContext function.
import React, { createContext, useContext } from 'react';
import { useProductReducer } from './reducers';

// create new context object
const StoreContext = createContext();

// context object comes with 2 components: Provider and Consumer
// Provider is a special type of React component that we wrap our app in so it can make the state data thats passed into it as a prop available to all other components. We used ApolloProvider to make GQL requests
// Consumer is our means of grabbing and using the data that the Provider holds for us.
const { Provider } = StoreContext;


// value prop opens us up to pass in more data for state if we need to.
// ...props is to handle any other props the user may need [we'll use props.children]
const StoreProvider = ({ value = [], ...props }) => {
    // instantiate Global State. 
    const [state, dispatch] = useProductReducer({
        products: [],
        categories: [],
        currentCategory: ''
    });

    // confirm that it works
    console.log(state);
    // since useProductReducer is wrapped in useReducer Hook, it will always return state / dispatch
    // state is the most up to date version of our global state object
    // dispatch is the method we execute to update our state.
    // if props wasnt returned in Provider component, nothing would render!
    return <Provider value={[state, dispatch]} {...props} />
};

// our own custom react Hook to recieve [state, dispatch] data our storeProvider provider manages.
// i.e. any component that has access to our StoreProvider component can use any data in our global state container or update it.
const useStoreContext = () => {
    return useContext(StoreContext);
};

export { StoreProvider, useStoreContext};