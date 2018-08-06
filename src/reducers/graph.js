import { LOAD_GRAPH_SUCCESS, LOAD_GRAPH_PENDING, LOAD_GRAPH_FAILED } from '../actions/types';
import moment from 'moment';

const INITIAL_STATE = {
  dateFrom: null,
  dateTo: null,
  loading: false,
  error: false
};

export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case LOAD_GRAPH_PENDING:
      return {
        ...state,
        loading: true
      };

    case LOAD_GRAPH_FAILED:
      return {
        ...state,
        ...INITIAL_STATE,
        error: true,
        loading: false
      };

    case LOAD_GRAPH_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false
      };

    default: return state;
  }
}