import React from 'react';
import PropTypes from 'prop-types';
import { withFauxDOM } from 'react-faux-dom';
import styled from 'styled-components';
import * as d3 from 'd3';
import Tooltip from '../Tooltip';
import moment from 'moment';
import cloneDeep from 'lodash.clonedeep';

const {
  arrayOf, string, number, shape, func, array, object, any 
} = PropTypes;

const Wrapper = styled.div`
  position: relative;
  display: inline-block;
`;

class ScatterPlot extends React.Component {
  static propTypes = {
    data: arrayOf( shape( {
      dateTime: object,
      weight: number,
      fat: number,
      calories: number
    } ) ),
    xDomain: array,
    yDomain: array,
    selectY: func,
    width: number,
    height: number,
    title: string,
    radiusFactor: number,
    setHover: func,
    chart: any,
    connectFauxDOM: func,
    animateFauxDOM: func
  };

  state = {
    tooltip: null
  };

  componentDidMount() {
    this.renderD3( 'render' );
  }

  componentDidUpdate( prevProps, prevState ) {
    // do not compare props.chart as it gets updated in updateD3()
    if ( this.props.data.length > 0 && this.props.data[0].dateTime !== prevProps.data[0].dateTime ) {
      this.renderD3( 'update' );
    }
  }

  setTooltip = ( datum ) => {
    this.setState( () => ( {
      tooltip: datum && this.props.selectY( datum ) ? datum : null
    } ) );
  };

  computeTooltipProps = () => {
    const datum = this.state.tooltip;
    const dateTime = moment( datum.dateTime ).format( 'M/D/YY' );
    const hoveredData = {};
    if ( hoveredData ) {
      return {
        content: `${dateTime}: ${this.props.selectY( datum ).toFixed( 1 )}`,
        style: { top: this.y( this.props.selectY( datum ) ) + 5, left: this.x( datum.dateTime ) }
      };
    }
    return {
      style: { visibility: 'hidden' }
    };
  };

  renderD3 = ( mode ) => {
    console.log( 'ScatterPlot: renderD3', mode );
    if ( !this.props.data ) return '';
    const {
      width,
      height,
      xDomain,
      yDomain,
      title,
      radiusFactor,
      connectFauxDOM,
      animateFauxDOM
    } = this.props;

    const data = cloneDeep( this.props.data );

    // rendering mode
    const render = mode === 'render';
    const resize = mode === 'resize';

    // d3 helpers
    const margin = {
      top: 50,
      right: 30,
      bottom: 50,
      left: 30
    };

    const graphWidth = width - margin.left - margin.right;
    const graphHeight = height - margin.top - margin.bottom;
    console.log( 'xDomain', xDomain );
    const x = d3
      .scaleTime()
      .domain( xDomain )
      .rangeRound( [0, graphWidth] );
    this.x = x;

    const xAxis = d3
      .axisBottom()
      .scale( x )
      .ticks( d3.timeSundays.range )
      .tickFormat( ( tick ) => {
        const mom = moment( tick );
        return `${mom.format( 'M/D' )}`;
      } );

    const y = d3
      .scaleLinear()
      .domain( yDomain )
      .rangeRound( [graphHeight, 0] );
    this.y = y;
    const yAxis = d3
      .axisLeft()
      .scale( y )
      .ticks( 10 );

    const lineFunc = d3
      .line()
      .x( d => x( d.dateTime ) )
      .y( d => y( this.props.selectY( d ) ) );

    // create a faux div and store its virtual DOM in state.chart
    const faux = connectFauxDOM( 'div', 'chart' );

    let svg;
    if ( render ) {
      svg = d3
        .select( faux )
        .append( 'svg' )
        .attr( 'width', width )
        .attr( 'height', height )
        .append( 'g' )
        .attr( 'transform', `translate(${margin.left}, ${margin.top})` );

      svg
        .append( 'text' )
        .attr( 'class', 'label' )
        .attr( 'x', graphWidth / 2 )
        .attr( 'y', -20 )
        .style( 'text-anchor', 'middle' )
        .text( title );

      svg
        .append( 'path' )
        .datum( data )
        .attr( 'class', 'line' )
        .attr( 'd', lineFunc )
        .attr( 'stroke', '#29b6f6' )
        .attr( 'stroke-width', '100% / 2' )
        .attr( 'fill', 'transparent' );
    } else if ( resize ) {
      svg = d3
        .select( faux )
        .select( 'svg' )
        .attr( 'width', width )
        .attr( 'height', height )
        .select( 'g' )
        .attr( 'transform', `translate(${margin.left}, ${margin.top})` );
    } else {
      svg = d3
        .select( faux )
        .select( 'svg' )
        .select( 'g' );

      svg
        .select( 'path.line' )
        .datum( data )
        .attr( 'class', 'line' )
        .attr( 'd', lineFunc );

      svg.select( 'text.label' ).text( title );
    }

    svg.selectAll( '.dot' ).remove();
    const dots = svg.selectAll( '.dot' ).data( data );
    dots
      .enter()
      .append( 'circle' )
      .attr( 'class', 'dot' )
      .attr( 'r', radiusFactor )
      .attr( 'cx', d => x( d.dateTime ) )
      .attr( 'cy', d => y( this.props.selectY( d ) ) )
      .attr( 'fill', '#5c6bc0' )
      .attr( 'stroke', '#fafafa' )
      .attr( 'stroke-width', 2 )
      .on( 'mouseover', ( d ) => {
        clearTimeout( this.unsetHoverTimeout );
        this.setTooltip( d );
      } )
      .on( 'mouseout', ( d ) => {
        this.unsetHoverTimeout = setTimeout( () => {
          this.setTooltip( null );
        }, 200 );
      } )
      .merge( dots );

    dots.exit().remove();

    // dots
    //   .transition()
    //   .attr( 'r', d => d.n * radiusFactor )
    //   .attr( 'cy', d => y( d.y ) );
    //

    animateFauxDOM( 800 );

    if ( render ) {
      svg
        .append( 'g' )
        .attr( 'class', 'x axis' )
        .attr( 'transform', `translate(0, ${graphHeight})` )
        .call( xAxis );

      svg
        .append( 'g' )
        .attr( 'class', 'y axis' )
        .call( yAxis );
    } else if ( resize ) {
      svg
        .select( 'g.x.axis' )
        .attr( 'transform', `translate(0, ${graphHeight})` )
        .call( xAxis )
        .select( 'text' )
        .attr( 'x', graphWidth / 2 );
      svg.select( 'g.y.axis' ).call( yAxis );
    } else {
      svg.select( 'g.x.axis' ).call( xAxis );
      svg.select( 'g.y.axis' ).call( yAxis );
    }
  };

  render() {
    return (
      <Wrapper className="scatterplot">
        { this.props.chart }
        { this.state.tooltip && <Tooltip { ...this.computeTooltipProps() } /> }
      </Wrapper>
    );
  }
}

ScatterPlot.defaultProps = {
  chart: ''
};

export default withFauxDOM( ScatterPlot );
