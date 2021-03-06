import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Homepage from './pages/Homepage/Homepage';
import More from './pages/More/More';
import Photog_login from './pages/Photog_login/Photog_login';
import Dashboard from './pages/Dashboard/Dashboard';
import MediaCard from './pages/Card/Card';
import About from './pages/About/About';

function App() {
  return (
    <div className="App">
      {/* <a href='/'><h1>Grapher Mart</h1></a>
      <hr/> */}
      {/* <br/><br/> */}
      <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Homepage}/>
        <Route path='/more' component={More}/>
        <Route path='/photog_login' component={Photog_login}/>
        <Route path='/dashboard' component={Dashboard}/>
        <Route path='/customer' component={MediaCard}/>
        <Route path='/about:data?' component={About}/>
        <Redirect to="/"/>
      </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
