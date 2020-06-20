import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
import 'bootswatch/dist/lux/bootstrap.min.css';import Navbar from "./components/navbar.component";
import CausesList from "./components/causes-list.component";

function App() {
  return (
    <Router>
      <div className="container">
        {/*<Navbar />*/}
        <br/>
        <Route path="/" exact component={CausesList}/>
      </div>
    </Router>
  );
}

export default App;
