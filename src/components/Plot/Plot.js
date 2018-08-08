import React, { Component } from 'react';
import CanvasWithMargin from '../CanvasWithMargin';
import { array, number, func, object, string } from 'prop-types';
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
import d3tip from 'd3-tip';

import './Plot.css';
import moment from 'moment';

class Plot extends Component { // eslint-disable-line
  shouldComponentUpdate( nextProps, nextState ) {
    const update = ( this.props.data !== nextProps.data && nextProps.data )
      || !this.props.dateFrom.isSame( nextProps.dateFrom )
      || !this.props.dateTo.isSame( nextProps.dateTo )
      || this.props.graphType !== nextProps.graphType;
    if ( update ) console.log( 'plot needs to update' );
    return update;
  }

  addYearLabel = ( node ) => {
    d3Select( node ).selectAll( 'g.tick' ).nodes().forEach( ( e ) => {
      const d = d3Select( e ).selectAll( 'text' ).data()[0];
      const labels = d3Select( e ).selectAll( '.year-label' );
      if ( labels.nodes().length > 0 ) {
        d3Select( labels.nodes()[0] ).text( d.getFullYear() );
      } else {
        d3Select( e )
          .append( 'text' )
          .attr( 'class', 'year-label' )
          .attr( 'fill', '#000' )
          .attr( 'y', 9 )
          .attr( 'dy', '2em' )
          .text( d.getFullYear() );
      }
    } );
  };

  render() {
    console.log( 'Plot: render called' );
    if ( !this.props.data ) return '';
    const filteredData = this.props.data.filter( datum =>
      moment( datum.dateTime ).isBetween( this.props.dateFrom, this.props.dateTo, null, '[]' ) );

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
      .ticks( filteredData.length )
      .tickFormat( ( tick ) => {
        const mom = moment( tick );
        return `${mom.format( 'MMM D' )}`;
      } );

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
      orig: datum,
      x: selectScaledX( datum ),
      y: selectScaledY( datum )
    } ) );

    const tip = d3tip()
      .attr( 'class', 'd3-tip' )
      .html( ( d ) => {
        console.log( 'tip d', d );
        return 'test';
      } );

    return (
      <CanvasWithMargin
        className="container"
        height={ this.props.height }
        width={ this.props.width }
        margin={ this.props.margin }
        tip={ tip }
      >
        <g
          className="xAxis"
          ref={ ( node ) => {
            d3Select( node ).call( xAxis );
            this.addYearLabel( node );
            return node;
          } }
          style={ {
            transform: `translateY(${this.props.height}px)`
          } }
        />
        <g
          className="yAxis"
          ref={ node => d3Select( node ).call( yAxis ) }
        />
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
              onMouseOver={ tip.show }
              onFocus={ tip.show }
              onMouseOut={ tip.hide }
              onBlur={ tip.hide }
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
  graphType: string,
  height: number,
  width: number,
  margin: number,
  selectX: func,
  selectY: func
};

export default Plot;
