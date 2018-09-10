import React, { Component } from 'react';
import { array, shape, func, bool } from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import './Graph.css';
import { Button, Icon, Loader } from 'semantic-ui-react';
import ScatterPlot from '../Charts/ScatterPlot';
import moment from 'moment';
import Repeatable from 'react-repeatable';
import * as d3 from 'd3';

class Graph extends Component {
  constructor() {
    super();
    const now = moment( 0, 'HH' );
    this.state = {
      dateFrom: now.clone().subtract( 8, 'weeks' ),
      dateTo: now,
      interval: 'week'
    };
  }

  componentDidMount() {
    if ( !this.props.stats ) {
      // No current search and no saved session results so execute default search
      this.props.loadStats( 'weekly' );
    }
  }

  shouldComponentUpdate( nextProps, nextState ) {
    return (
      this.props.stats.loading !== nextProps.stats.loading ||
      this.props.stats.error !== nextProps.stats.error ||
      this.props.stats.data.length !== nextProps.stats.data.length ||
      !this.state.dateFrom.isSame( nextState.dateFrom ) ||
      !this.state.dateTo.isSame( nextState.dateTo ) ||
      this.state.interval !== nextState.interval
    );
  }

  next = unit => () => {
    const n = unit === 'month' ? 7 : 1;
    const { dateFrom, dateTo } = this.state;
    const newDateTo = dateTo.clone().add( n, 'days' );

    this.setState( {
      dateFrom: dateFrom.clone().add( n, 'days' ),
      dateTo: newDateTo
    } );
  };

  prev = unit => () => {
    const n = unit === 'month' ? 7 : 1;
    const { dateFrom, dateTo } = this.state;
    this.setState( {
      dateFrom: dateFrom.clone().subtract( n, 'days' ),
      dateTo: dateTo.clone().subtract( n, 'days' )
    } );
  };

  reset = ( e ) => {
    e.preventDefault();
    this.setState( {
      dateFrom: moment( 0, 'HH' ).subtract( 30, 'days' ),
      dateTo: moment( 0, 'HH' )
    } );
  };

  reload = interval => ( e ) => {
    e.preventDefault();
    this.props.loadStats( interval );
  };

  render() {
    console.log( 'Graph: render called', this.state );
    const { dateFrom, dateTo, interval } = this.state;
    const { data } = this.props.stats;

    let year = dateFrom.format( 'YYYY' );
    if ( dateTo.format( 'YYYY' ) !== year ) year = `${year} - ${dateTo.format( 'YYYY' )}`;

    const filteredData = data.filter( datum =>
      moment( datum.dateTime ).isBetween( dateFrom, dateTo, null, '[]' ) );

    filteredData.map( ( datum ) => {
      datum.dateTime = moment( datum.dateTime ).toDate();
      return datum;
    } );

    const xDomain = [dateFrom.toDate(), dateTo.toDate()];
    const yDomainWeight = d3.extent( data, d => d.weight );
    const yDomainCalories = d3.extent( data, d => d.calories );
    const yDomainFat = d3.extent( data, d => d.fat );
    console.log( xDomain );
    if ( yDomainCalories[1] > 4000 ) yDomainCalories[1] = 4000;

    return (
      <div className="graph">
        { this.props.stats.loading && (
          <div className="canvas loading">
            <Loader inline active />
          </div>
        ) }
        { !this.props.stats.loading &&
          this.props.stats.data && (
            <div className="canvas">
              <ScatterPlot
                title={ `Weight ${year}` }
                data={ filteredData }
                xDomain={ xDomain }
                yDomain={ yDomainWeight }
                dateFrom={ dateFrom }
                dateTo={ dateTo }
                selectY={ datum => datum.weight }
                width={ 800 }
                height={ 400 }
                radiusFactor={ 5 }
              />
            </div>
          ) }
        { this.props.stats.loading && (
          <div className="canvas loading">
            <Loader inline active />
          </div>
        ) }
        { !this.props.stats.loading &&
          this.props.stats.data && (
            <div className="canvas">
              <ScatterPlot
                title={ `Calories ${year}` }
                xDomain={ xDomain }
                yDomain={ yDomainCalories }
                data={ filteredData }
                dateFrom={ dateFrom }
                dateTo={ dateTo }
                selectY={ datum => datum.calories }
                width={ 800 }
                height={ 400 }
                radiusFactor={ 5 }
              />
            </div>
          ) }
        { this.props.stats.loading && (
          <div className="canvas loading">
            <Loader inline active />
          </div>
        ) }
        { !this.props.stats.loading &&
          this.props.stats.data && (
            <div className="canvas">
              <ScatterPlot
                title={ `Fat ${year}` }
                data={ filteredData }
                xDomain={ xDomain }
                yDomain={ yDomainFat }
                dateFrom={ dateFrom }
                dateTo={ dateTo }
                selectY={ datum => datum.fat }
                width={ 800 }
                height={ 400 }
                radiusFactor={ 5 }
              />
            </div>
          ) }
        <div className="controls">
          <Repeatable
            style={ { display: 'inline' } }
            onPress={ this.prev( 'month' ) }
            onHold={ this.prev( 'month' ) }
          >
            <Button icon color="blue">
              <Icon name="fast backward" />
            </Button>
          </Repeatable>
          &nbsp; &nbsp;
          <Repeatable
            style={ { display: 'inline' } }
            onPress={ this.prev( 'day' ) }
            onHold={ this.prev( 'day' ) }
          >
            <Button icon color="green">
              <Icon name="step backward" />
            </Button>
          </Repeatable>
          &nbsp;
          <Button color="red" onClick={ this.reset }>
            Reset
          </Button>
          &nbsp;
          <Repeatable
            style={ { display: 'inline' } }
            onPress={ this.next( 'day' ) }
            onHold={ this.next( 'day' ) }
          >
            <Button icon color="green">
              <Icon name="step forward" />
            </Button>
          </Repeatable>
          &nbsp; &nbsp;
          <Repeatable
            style={ { display: 'inline' } }
            onPress={ this.next( 'month' ) }
            onHold={ this.next( 'month' ) }
          >
            <Button icon color="blue">
              <Icon name="fast forward" />
            </Button>
          </Repeatable>
          <br />
          <br />
          <Button onClick={ this.reload( 'weekly' ) }>Reload</Button>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => ( {
  stats: state.stats
} );

Graph.propTypes = {
  loadStats: func,
  stats: shape( {
    data: array,
    loading: bool
  } )
};

export default connect(
  mapStateToProps,
  actions
)( Graph );
