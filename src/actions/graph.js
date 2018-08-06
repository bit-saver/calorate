import { LOAD_GRAPH_SUCCESS, LOAD_GRAPH_PENDING, LOAD_GRAPH_FAILED } from './types';

export const loadGraph = () => async ( dispatch ) => {
  dispatch( { type: LOAD_GRAPH_PENDING } );

  return dispatch( {
    type: LOAD_GRAPH_SUCCESS,
    payload: null
  } );
};