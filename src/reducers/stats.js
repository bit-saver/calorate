import { LOAD_STATS_SUCCESS, LOAD_STATS_PENDING, LOAD_STATS_FAILED } from '../actions/types';

const INITIAL_STATE = {
  error: false,
  data: {
    weight: [],
    fat: [],
    calories: []
  },
  loading: false
};

export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case LOAD_STATS_PENDING:
      return {
        ...state,
        loading: true
      };

    case LOAD_STATS_FAILED:
      return {
        ...state,
        ...INITIAL_STATE,
        error: true,
        loading: false
      };

    case LOAD_STATS_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
        data: action.payload
      };

    default: return state;
  }
}