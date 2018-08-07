import getMarginObject from './getMarginObject';
import { object } from 'prop-types';

const getContentContainerStyle = ( margin ) => {
  const marginObject = getMarginObject( margin );

  return {
    transform: `translate(${marginObject.left}px, ${marginObject.top}px)`
  };
};

getContentContainerStyle.propTypes = {
  margin: object
};

export default getContentContainerStyle;
