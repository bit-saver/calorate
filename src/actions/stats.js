import { LOAD_STATS_SUCCESS, LOAD_STATS_PENDING, LOAD_STATS_FAILED } from './types';

export const loadStats = () => async ( dispatch ) => {
  dispatch( { type: LOAD_STATS_PENDING } );

  // fetch stats from API

  return dispatch( {
    type: LOAD_STATS_SUCCESS,
    payload: null
  } );
};