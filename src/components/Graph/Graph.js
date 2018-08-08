import React, { Component } from 'react';
import { array, shape, func, bool } from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import './Graph.css';
import { Button, Icon, Loader } from 'semantic-ui-react';
import Plot from '../Plot/Plot';
import moment from 'moment';
import Repeatable from 'react-repeatable';


class Graph extends Component {
  constructor( props ) {
    super( props );
    const now = moment();
    this.holdTimer = null;
    this.state = {
      graphType: 'weight',
      dateFrom: now.clone().subtract( 30, 'days' ),
      dateTo: now
    };
  }

  componentDidMount() {
    if ( !this.props.stats ) {
      // No current search and no saved session results so execute default search
      this.props.loadStats();
    }
  }

  shouldComponentUpdate( nextProps, nextState ) {
    return this.props.stats.loading !== nextProps.stats.loading
      || this.props.stats.error !== nextProps.stats.error
      || this.props.stats.data.length !== nextProps.stats.data.length
      || !this.state.dateFrom.isSame( nextState.dateFrom )
      || !this.state.dateTo.isSame( nextState.dateTo )
      || this.state.graphType !== nextState.graphType;
  }

  holdAction = callback => ( e ) => {
    e.preventDefault();
    if ( this.holdTimer && this.holdTimer !== true ) clearTimeout( this.holdTimer );
    this.holdTimer = true;
    callback();
    setTimeout( () => {
      if ( this.holdTimer === true ) {
        this.holdTimer = setInterval( () => {
          callback();
        }, 10 );
      }
    }, 1000 );
  };

  releaseAction = ( e ) => {
    e.preventDefault();
    if ( this.holdTimer ) clearTimeout( this.holdTimer );
    this.holdTimer = null;
  };

  next = unit => () => {
    const n = ( unit === 'month' ? 30 : 1 );
    const { dateFrom, dateTo } = this.state;
    const newDateTo = dateTo.clone().add( n, 'days' );

    this.setState( {
      graphType: this.state.graphType,
      dateFrom: dateFrom.clone().add( n, 'days' ),
      dateTo: newDateTo
    } );
  };

  prev = unit => () => {
    const n = ( unit === 'month' ? 30 : 1 );
    const { dateFrom, dateTo } = this.state;
    this.setState( {
      graphType: this.state.graphType,
      dateFrom: dateFrom.clone().subtract( n, 'days' ),
      dateTo: dateTo.clone().subtract( n, 'days' )
    } );
  };

  setGraphType = graphType => ( e ) => {
    e.preventDefault();
    this.setState( {
      graphType,
      dateFrom: this.state.dateFrom,
      dateTo: this.state.dateTo
    } );
  };

  reset = ( e ) => {
    e.preventDefault();
    this.setState( {
      graphType: this.state.graphType,
      dateFrom: moment().subtract( 1, 'month' ),
      dateTo: moment()
    } );
  };

  render() {
    console.log( 'Graph: render called', this.state );
    const { graphType, dateFrom, dateTo } = this.state;
    return (
      <div className="graph">
        <div className="controls">
          <Button.Group>
            <Button active={ graphType === 'weight' } onClick={ this.setGraphType( 'weight' ) }>Weight</Button>
            <Button active={ graphType === 'fat' } onClick={ this.setGraphType( 'fat' ) }>Fat</Button>
            <Button active={ graphType === 'calories' } onClick={ this.setGraphType( 'calories' ) }>Calories</Button>
          </Button.Group>
        </div>
        <div className="canvas">
          { this.props.stats.loading && (
            <Loader active />
          ) }
        </div>
        <div className="canvas">
          { !this.props.stats.loading && this.props.stats.data && (
            <Plot
              dateFrom={ dateFrom }
              dateTo={ dateTo }
              data={ this.props.stats.data }
              graphType={ graphType }
              height={ 400 }
              width={ 800 }
              margin={ 25 }
              selectX={ datum => new Date( datum.dateTime ) }
              selectY={ datum => datum.weight }
            />
          ) }
        </div>
        <div className="canvas">
          { !this.props.stats.loading && this.props.stats.data && (
            <Plot
              dateFrom={ dateFrom }
              dateTo={ dateTo }
              data={ this.props.stats.data }
              graphType={ graphType }
              height={ 400 }
              width={ 800 }
              margin={ 25 }
              selectX={ datum => new Date( datum.dateTime ) }
              selectY={ datum => datum.calories }
            />
          ) }
        </div>
        <div className="canvas">
          { !this.props.stats.loading && this.props.stats.data && (
            <Plot
              dateFrom={ dateFrom }
              dateTo={ dateTo }
              data={ this.props.stats.data }
              graphType={ graphType }
              height={ 400 }
              width={ 800 }
              margin={ 25 }
              selectX={ datum => new Date( datum.dateTime ) }
              selectY={ datum => datum.fat }
            />
          ) }
        </div>
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
          &nbsp;
          <Button.Group icon>
            <Repeatable
              style={ { display: 'inline' } }
              onPress={ this.prev( 'day' ) }
              onHold={ this.prev( 'day' ) }
            >
              <Button color="green">
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
              <Button color="green">
                <Icon name="step forward" />
              </Button>
            </Repeatable>
          </Button.Group>
          &nbsp;
          &nbsp;
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
          <Button onClick={ this.props.loadStats }>
            Reload
          </Button>
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

export default connect( mapStateToProps, actions )( Graph );
