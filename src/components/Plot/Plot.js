import React, { Component } from 'react';
import CanvasWithMargin from '../CanvasWithMargin';
import { array, number, func, object } from 'prop-types';
import { extent as d3ArrayExtent } from 'd3-array';
import {
  scaleLinear as d3ScaleLinear,
  scaleTime as d3ScaleTime
} from 'd3-scale';
import { line as d3Line } from 'd3-shape';
import {
  axisBottom as d3AxisBottom,
  axisLeft as d3AxisLeft
} from 'd3-axis';
import { select as d3Select } from 'd3-selection';
import sortBy from 'lodash.sortby';

import './Plot.css';
import moment from 'moment';

class Plot extends Component { // eslint-disable-line
  constructor( props ) {
    super( props );
    console.log( 'constructing with props', props );
  }

  shouldComponentUpdate( nextProps, nextState ) {
    const update = ( this.props.data !== nextProps.data && nextProps.data )
      || !this.props.dateFrom.isSame( nextProps.dateFrom )
      || !this.props.dateTo.isSame( nextProps.dateTo );
    if ( update ) console.log( 'plot needs to update' );
    return update;
  }

  render() {
    console.log( 'Plot: render called' );
    if ( !this.props.data ) return '';
    const filteredData = sortBy( this.props.data.filter( datum =>
      moment( datum.dateTime ).isBetween( this.props.dateFrom, this.props.dateTo, null, '[]' ) ), ['dateTime'] );
    console.log( filteredData );
    // Since this is "time series" visualization, our x axis should have a time scale.
    // Our x domain will be the extent ([min, max]) of x values (Dates) in our data set.
    // Our x range will be from x=0 to x=width.
    const xDomain = d3ArrayExtent( filteredData, this.props.selectX );
    console.log( 'xDomain', xDomain );
    const xScale = d3ScaleTime()
      .domain( xDomain )
      .range( [0, this.props.width] );

    // Add an axis for our x scale which has half as many ticks as there are rows in the data set.
    const xAxis = d3AxisBottom()
      .scale( xScale )
      .ticks( filteredData.length / 2 );

    // Our y axis should just have a linear scale.
    // Our y domain will be the extent of y values (numbers) in our data set.
    const yDomain = d3ArrayExtent( this.props.data, this.props.selectY );
    console.log( 'yDomain', yDomain );
    const yScale = d3ScaleLinear()
      .domain( yDomain )
      .range( [this.props.height, 0] );

    // Add an axis for our y scale that has 3 ticks
    const yAxis = d3AxisLeft()
      .scale( yScale )
      .ticks( 30 );

    // These two functions select the scaled x and y values (respectively) of our data.
    const selectScaledX = datum => xScale( this.props.selectX( datum ) );
    const selectScaledY = datum => yScale( this.props.selectY( datum ) );

    // Create a d3Line factory for our scales.
    const sparkLine = d3Line()
      .x( selectScaledX )
      .y( selectScaledY );

    // Create a line path of for our data.
    const linePath = sparkLine( filteredData );

    const circlePoints = filteredData.map( datum => ( {
      x: selectScaledX( datum ),
      y: selectScaledY( datum )
    } ) );

    return (
      <CanvasWithMargin
        className="container"
        height={ this.props.height }
        width={ this.props.width }
        margin={ this.props.margin }
      >
        <g
          className="xAxis"
          ref={ node => d3Select( node ).call( xAxis ) }
          style={ {
            transform: `translateY(${this.props.height}px)`
          } }
        />
        <g className="yAxis" ref={ node => d3Select( node ).call( yAxis ) } />
        <g className="line">
          <path d={ linePath } />
        </g>
        <g className="scatter">
          { circlePoints.map( circlePoint => (
            <circle
              cx={ circlePoint.x }
              cy={ circlePoint.y }
              key={ `${circlePoint.x},${circlePoint.y}` }
              r={ 4 }
            />
          ) ) }
        </g>
      </CanvasWithMargin>
    );
  }
}

// const mapStateToProps = state => ( {
//   data: state.data // eslint-disable-line prefer-destructuring
// } );

Plot.propTypes = {
  dateFrom: object,
  dateTo: object,
  data: array,
  height: number,
  width: number,
  margin: number,
  selectX: func,
  selectY: func
};

export default Plot;
