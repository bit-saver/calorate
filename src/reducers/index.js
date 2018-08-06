import { combineReducers } from 'redux';

import graphReducer from './graph';
import statsReducer from './stats';

export default combineReducers( {
  graph: graphReducer,
  stats: statsReducer
} );