import React from 'react';
import './App.scss';
import { Router, Redirect, Route, Switch  } from "react-router";
import { Home } from './components/home/home';
import { Meeting } from './components/meeting/meeting';
import { createBrowserHistory } from "history";

function App() {
  const history = createBrowserHistory();

  return (
    <div className="app">
      <Router history={history}>
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
