import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';

import Home from './containers/home';
import Market from './containers/market';
import LoginPage from './containers/login-page';
import SignUpPage from './containers/sign-up-page';
import Logout from './components/logout';

import TopNav from './components/top-nav';


// React-router v4
import {
  BrowserRouter as Router,
  Route,
  Link,
  Switch
} from 'react-router-dom'




// the Switch sends routes down the line, and will default to the last one (NoMatch)
// Pull the <ul> nav out to a <Nav /> component, and App will serve as the base
class App extends Component {

  render() {
    return (
      <Router>
        <div className="App">
          <TopNav />

          <Switch>
            <Route exact path="/" component={Home}/>
            <Route exact path="/market" component={Market}/>
            <Route exact path="/logout" component={Logout}/>
            <Route exact path="/login" component={LoginPage}/>
            <Route exact path="/signup" component={SignUpPage}/>
            <Route component={Home}/>
          </Switch>
        </div>
      </Router>
    );
  }
}
export default App;




const About = () => (
  <div>
    <h2>About</h2>
  </div>
)

const Topics = ({ match }) => (
  <div>
    <h2>Topics</h2>
    <ul>
      <li>
        <Link to={`${match.url}/rendering`}>
          Rendering with React
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/components`}>
          Components
        </Link>
      </li>
      <li>
        <Link to={`${match.url}/props-v-state`}>
          Props v. State
        </Link>
      </li>
    </ul>

    <Route path={`${match.url}/:topicId`} component={Topic}/>
    <Route exact path={match.url} render={() => (
      <h3>Please select a topic.</h3>
    )}/>
  </div>
)

const Topic = ({ match }) => (
  <div>
    <h3>{match.params.topicId}</h3>
  </div>
)

const NoMatch = ({ location }) => (
  <div>
    <h3>No match for <code>{location.pathname}</code></h3>
  </div>
)