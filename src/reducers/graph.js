import { DATE_CHANGE } from '../actions/types';

const INITIAL_STATE = {
  dateFrom: null,
  dateTo: null
};

export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case DATE_CHANGE:
      return {
        ...state
      };

    default: return state;
  }
}