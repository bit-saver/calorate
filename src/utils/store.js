import { createStore, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import reducers from '../reducers';
import { composeWithDevTools } from 'redux-devtools-extension/logOnlyInProduction';
import { loadState, saveState } from '../utils/storage';
import throttle from 'lodash.throttle';

// Get stored state from session storage
const persistedState = loadState();

/*
Add redux dev tools: https://github.com/zalmoxisus/redux-devtools-extension
To use redux dev tools, ensure that you have added the applicable browser extension
Using logOnlyInProduction loads full featured version for development and the
restricted one for production based on process.env.NODE_ENV which is set in webpack
*/
const composeEnhancers = composeWithDevTools( {} );

// Create store passing in  any persisted state
const store = createStore( reducers, persistedState, composeEnhancers( applyMiddleware( thunk ) ) );

/*
Use subscribe store method to update state on every state change.
Use throttle to ensure we are not writing to storage more than every second
as stringify is expensive operation
*/
store.subscribe( throttle( () => {
  saveState( store.getState() );
}, 1000 ) );

export default store;
