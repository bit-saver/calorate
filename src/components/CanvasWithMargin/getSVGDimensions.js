import getMarginObject from './getMarginObject';

const getSVGDimensions = ( { height, margin, width } ) => {
  const marginObject = getMarginObject( margin );
  const heightWithMargin = height + marginObject.top + marginObject.bottom;
  const widthWithMargin = width + marginObject.left + marginObject.right;

  return {
    height: heightWithMargin,
    width: widthWithMargin
  };
};

export default getSVGDimensions;