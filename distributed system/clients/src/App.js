import React, { useEffect, useState, Component, Alert } from "react";
import { Route, BrowserRouter as Router, Routes, Navigate, Outlet } from "react-router-dom";
import Home from "./pages/Home";
import Chat from "./pages/Distribute";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import { auth, db } from "./services/firebase";
import './styles.css';
import Distribute from "./pages/Distribute";
import MasterUser from "./pages/MasterUser";
import ClientUser1 from "./pages/ClientUser1";
import ClientUser2 from "./pages/ClientUser2";
import { ButtonGroup, Button, Modal } from 'react-bootstrap';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';

function PrivateRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Outlet
      {...rest}
      render={props =>
        authenticated === true ? (
          <Component {...props} />
        ) : (
            <Navigate
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          )
      }
    />
  );
}

function PublicRoute({ component: Component, authenticated, ...rest }) {
  return (
    <Outlet
      {...rest}
      render={props =>
        authenticated === false ? (
          <Component {...props} />
            ) : (
          <Navigate to="/chat" />
          )
      }
    />
  );
}

class App extends Component {
  constructor() {
    super();
    this.state = {
      authenticated: true,
      loading: true
    };
  }

  componentDidMount() {
    // auth.onAuthStateChanged(user => {
    //   if (user) {
        this.setState({
          authenticated: true,
          loading: false
        });
      // } else {
      //   this.setState({
      //     authenticated: false,
      //     loading: false
      //   });
      // }
    // });
  }

  render() {
    return this.state.loading === true ? (
      <div className="spinner-border text-success" role="status">
        <span className="sr-only">Loading...</span>
      </div>
    ) : (
        <Router>
          <Routes>
            <Route exact path="/" element={<Home/>} />
            <Route
              path="/chat"
              authenticated={this.state.authenticated}
              component={Chat}
              element={<PrivateRoute/>}
            />
            <Route
              path="/signup"
              authenticated={this.state.authenticated}
              component={Signup}
              element={<PrivateRoute/>}
            />
            <Route
              path="/login"
              authenticated={this.state.authenticated}
              component={Login}
              element={<PrivateRoute/>}
            />
			<Route
              path="/master"
              authenticated={this.state.authenticated}
              component={MasterUser}
              element={<PrivateRoute/>}
            />
			<Route
              path="/client1"
              authenticated={this.state.authenticated}
              component={ClientUser1}
              element={<PrivateRoute/>}
            />
			<Route
              path="/client2"
              authenticated={this.state.authenticated}
              component={ClientUser2}
              element={<PrivateRoute/>}
            />
          </Routes>
        </Router>
      );
  }
}

export default App;
