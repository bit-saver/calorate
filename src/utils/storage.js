export const loadState = () => {
  try {
    const serializedState = sessionStorage.getItem( 'token' );
    if ( serializedState === null ) {
      // let reducers set state
      return undefined;
    }
    return JSON.parse( serializedState );
  } catch ( err ) {
    return undefined;
  }
};

export const saveState = ( state ) => {
  try {
    const serializedState = JSON.stringify( state );
    sessionStorage.setItem( 'token', serializedState );
  } catch ( err ) {
    // log errors
  }
};
