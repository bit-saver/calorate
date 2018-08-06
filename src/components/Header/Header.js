import React from 'react';
import { withRouter, Link } from 'react-router-dom';
import { Header } from 'semantic-ui-react';
import { object } from 'prop-types';
import './Header.css';
import Nav from '../Nav';

const HeaderItem = ( props ) => {
  return (
    <section className="bar">
      <div className="ui container">
        <header>
          <Header as="h1">
            <Link to="/" className="title" target="_self">Calorate</Link>
          </Header>
        </header>
        <Nav />
      </div>
    </section>
  );
};

HeaderItem.propTypes = {
  location: object
};

export default withRouter( HeaderItem );
