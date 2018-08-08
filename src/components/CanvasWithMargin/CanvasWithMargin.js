import React from 'react';
import getContentContainerStyle from './getContentContainerStyle';
import getSVGDimensions from './getSVGDimensions';
import PropTypes, { string, number, object, element, array, bool, func } from 'prop-types';

const CanvasWithMargin = ( {
  children,
  contentContainerBackgroundRectClassName,
  contentContainerGroupClassName,
  height,
  margin,
  renderContentContainerBackground,
  width,
  ...rest
} ) => (
  <svg
    { ...rest }
    { ...getSVGDimensions( {
      height,
      margin,
      width
    } ) }
  >
    <g
      className={ contentContainerGroupClassName }
      style={ getContentContainerStyle( { margin } ) }
    >
      { !!contentContainerBackgroundRectClassName && (
        <rect
          className={ contentContainerBackgroundRectClassName }
          height={ height }
          width={ width }
          x={ 0 }
          y={ 0 }
        />
      ) }
      { children }
    </g>
  </svg>
);

CanvasWithMargin.propTypes = {
  children: PropTypes.oneOfType( [element, array] ),
  contentContainerBackgroundRectClassName: string,
  contentContainerGroupClassName: string,
  renderContentContainerBackground: bool,
  height: number,
  margin: PropTypes.oneOfType( [object, number] ),
  width: number
};

export default CanvasWithMargin;