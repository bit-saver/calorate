import React from 'react';
import { Route, Switch, Redirect } from 'react-router-dom';
import HomePage from './components/Pages/HomePage';
import Header from './components/Header';
import './App.css';

const App = () => (
  <div>
    <Header />
    <div className="ui container">
      <Switch>
        <Route path="/" exact component={ HomePage } />
        <Redirect to="/" />
      </Switch>
    </div>
  </div>
);

export default App;
