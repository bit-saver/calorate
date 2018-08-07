import { DATE_CHANGE } from './types';

export const loadGraph = ( state ) => async ( dispatch ) => {
  console.log( 'loadGraph', state );
  return dispatch( {
    type: DATE_CHANGE,
    payload: {
      ...state
    }
  } );
};