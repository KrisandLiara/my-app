// App.js

import React from 'react';
import Header from './components/Header';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import './App.css';
import Home from './components/Home';
import Projects from './components/Projects';
import { Switch, Route } from 'react-router-dom';
import ChatLayout from './components/ChatLayout';


function App() {
  return (
    <div className="app-container">
      <Header className="header" />
      <Navbar className="navbar" />
      <div className="content-container">
        <Switch>
          <Route path="/home">
            <Home className="content" />
          </Route>
           <Route path="/chat">
            <ChatLayout className="content" />
           </Route>
          <Route path="/projects">
            <Projects className="content" />
          </Route>
          <Route>
            <div className="content">Page not found. Where could it be?</div>
          </Route>
        </Switch>
      </div>
      <Footer className="footer" />
    </div>
  );
}

export default App;
