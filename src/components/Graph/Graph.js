import React from 'react';
import './Graph.css';

class Graph extends React.Component {
  constructor( props ) {
    super( props );
    this.state = {
      view: 'gallery'
    };
  }

  componentDidMount() {
    if ( !this.props.search.response.hits ) {
      // No current search and no saved session results so execute default search
      this.props.createRequest();
    }
  }

  shouldComponentUpdate( nextProps, nextState ) {
    return this.props.search.response.hits !== nextProps.search.response.hits || this.state.view !== nextState.view;
  }

  render() {
    return (
      <div className="graph"/>
    );
  }
}

export default Graph;
