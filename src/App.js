import './App.css';
import { BrowserRouter, Route, Switch, Redirect } from 'react-router-dom';
import Homepage from './pages/Homepage/Homepage';
import More from './pages/More/More';
import Photog_login from './pages/Photog_login/Photog_login';
import db from './firebase';

function App() {
  return (
    <div className="App">
      <a href='/'><h1>Grapher Mart</h1></a>
      <hr/>
      <br/><br/>
      <BrowserRouter>
      <Switch>
        <Route exact path='/' component={Homepage}/>
        <Route path='/more' component={More}/>
        <Route path='/photog_login' component={Photog_login}/>
        <Redirect to="/"/>
      </Switch>
      </BrowserRouter>
    </div>
  );
}

export default App;
