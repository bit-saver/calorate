import { LOAD_STATS_SUCCESS, LOAD_STATS_PENDING, LOAD_STATS_FAILED } from './types';
import axios from 'axios';
import { hideLoading, showLoading } from 'react-redux-loading-bar';
import sortBy from 'lodash.sortby';

export const loadStats = interval => async ( dispatch ) => {
  dispatch( { type: LOAD_STATS_PENDING, payload: null } );
  dispatch( showLoading() );

  let url = `${process.env.REACT_APP_PUBLIC_API}/stats`;
  if ( interval ) url += `?${interval}`;

  // fetch stats from API
  let data = [];
  try {
    data = await axios.get( url ).then( response => response.data );
    data = sortBy( data, ['dateTime'] );
  } catch ( err ) {
    console.error( err );
    dispatch( hideLoading() );
    return dispatch( {
      type: LOAD_STATS_FAILED
    } );
  }

  dispatch( hideLoading() );
  return dispatch( {
    type: LOAD_STATS_SUCCESS,
    payload: data || []
  } );
};
