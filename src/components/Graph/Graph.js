import React, { Component } from 'react';
import { array, shape, func, bool } from 'prop-types';
import { connect } from 'react-redux';
import * as actions from '../../actions';
import './Graph.css';
import { Button, Loader } from 'semantic-ui-react';
import Plot from '../Plot/Plot';
import moment from 'moment';

class Graph extends Component {
  constructor( props ) {
    super( props );
    const now = moment();
    this.holdTimer = null;
    this.state = {
      dateFrom: now.clone().subtract( 1, 'month' ) ,
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
    console.log( this.state.dateFrom.toString(), nextState.dateFrom.toString() );
    return this.props.stats.loading !== nextProps.stats.loading
      || this.props.stats.error !== nextProps.stats.error
      || this.props.stats.data.length !== nextProps.stats.data.length
      || !this.state.dateFrom.isSame( nextState.dateFrom )
      || !this.state.dateTo.isSame( nextState.dateTo );
  }

  reset = ( e ) => {
    e.preventDefault();
    this.setState( {
      dateFrom: moment().subtract( 1, 'month' ),
      dateTo: moment()
    } );
  };

  holdAction = callback => ( e ) => {
    e.preventDefault();
    if ( this.holdTimer ) clearTimeout( this.holdTimer );
    this.holdTimer = true;
    callback();
    setTimeout( () => {
      if ( this.holdTimer === true ) {
        this.holdTimer = setInterval( () => {
          callback();
        }, 10 );
      }
    }, 500 );
  };

  releaseAction = ( e ) => {
    e.preventDefault();
    if ( this.holdTimer ) clearTimeout( this.holdTimer );
    this.holdTimer = null;
  };

  next = unit => () => {
    const { dateFrom, dateTo } = this.state;
    this.setState( {
      dateFrom: dateFrom.clone().add( 1, unit ),
      dateTo: dateTo.clone().add( 1, unit )
    } );
  };

  prev = unit => () => {
    const { dateFrom, dateTo } = this.state;
    this.setState( {
      dateFrom: dateFrom.clone().subtract( 1, unit ),
      dateTo: dateTo.clone().subtract( 1, unit )
    } );
  };

  render() {
    console.log( 'Graph: render called' );
    const { dateFrom, dateTo } = this.state;

    return (
      <div className="graph">
        <div className="canvas">
          { this.props.stats.loading && (
            <Loader active />
          ) }
          { !this.props.stats.loading && this.props.stats.data && (
            <Plot
              dateFrom={ dateFrom }
              dateTo={ dateTo }
              data={ this.props.stats.data }
              height={ 600 }
              width={ 800 }
              margin={ 25 }
              selectX={ datum => new Date( datum.dateTime ) }
              selectY={ datum => datum.fat }
            />
          ) }
        </div>
        <div className="controls">
          <Button color="blue" onMouseDown={ this.holdAction( this.prev( 'month' ) ) } onMouseUp={ this.releaseAction }>
            Prev Month
          </Button>
          &nbsp;
          <Button.Group>
            <Button
              color="green"
              onMouseDown={ this.holdAction( this.prev( 'day' ) ) }
              onMouseUp={ this.releaseAction }
            >
              Prev Day
            </Button>
            &nbsp;
            <Button color="red" basic onClick={ this.reset }>Reset</Button>
            &nbsp;
            <Button
              color="green"
              onMouseDown={ this.holdAction( this.next( 'day' ) ) }
              onMouseUp={ this.releaseAction }
            >
              Next Day
            </Button>
          </Button.Group>
          &nbsp;
          &nbsp;
          <Button color="blue" onMouseDown={ this.holdAction( this.next( 'month' ) ) } onMouseUp={ this.releaseAction }>
            Next Month
          </Button>
          <br />
          <br />
          <Button onClick={ this.props.loadStats }>Reload</Button>
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
