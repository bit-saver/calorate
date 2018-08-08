import { LOAD_STATS_SUCCESS, LOAD_STATS_PENDING, LOAD_STATS_FAILED } from './types';
import axios from 'axios';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import sortBy from 'lodash.sortby';

export const loadStats = () => async ( dispatch ) => {
  dispatch( showLoading() );
  dispatch( { type: LOAD_STATS_PENDING, payload: null } );

  // fetch stats from API
  let data = [];
  try {
    data = await axios.get( `${process.env.REACT_APP_PUBLIC_API}/stats` ).then( response => response.data );
    data = sortBy( data, ['dateTime'] );
  } catch ( err ) {
    dispatch( hideLoading() );
    return dispatch( {
      type: LOAD_STATS_FAILED
    } );
  }

  return dispatch( {
    type: LOAD_STATS_SUCCESS,
    payload: data || []
  } );
};