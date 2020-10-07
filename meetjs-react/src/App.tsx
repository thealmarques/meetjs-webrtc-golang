import React from 'react';
import './App.scss';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import { Home } from './components/home/home';
import { Meeting } from './components/meeting/meeting';

function App() {
  return (
    <div className="app">
      <Router>
        <Switch>
          <Route exact path="/meeting/*">
            <Meeting></Meeting>
          </Route>
          <Route exact path="/">
            <Home></Home>
          </Route>
          <Route path="*">
            <Redirect push={true} to='/'></Redirect>
          </Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
