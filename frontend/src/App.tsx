import React from "react";
import { useState, useEffect } from "react";
import { Switch, Route, Link } from "react-router-dom";

import Login from "./components/Login";
import Register from "./components/Register";
import Home from "./components/Home";
import Profile from "./components/Profile";
import NftMint from "./components/NftMint";
import Wallet from "./components/Wallet";
import Gallery from "./components/Gallery";
import * as AuthService from "./services/auth.service";
import { IUserWithToken } from "./types/user";
import EventBus from "./common/EventBus";

import "./App.css";
import "bootstrap/dist/css/bootstrap.min.css";
import settings from "./config/settings";

const App: React.FC = () => {
  const [currentUser, setCurrentUser] = useState<IUserWithToken>();

  useEffect(() => {
    const user = AuthService.getCurrentUser();

    user && setCurrentUser(user);

    EventBus.on("logout", logOut);

    return () => {
      EventBus.remove("logout", logOut);
    };
  }, []);

  const logOut = () => {
    AuthService.logout();
    setCurrentUser(undefined);
    window.location.href = "/login";
  };

  return (
    <div>
      <nav className="navbar navbar-expand navbar-dark bg-dark">
        <Link to={"/"} className="navbar-brand">
          NFT mint
        </Link>
        <div className="navbar-nav mr-auto">
          {settings.NAV_LINKS.map(
            (link) =>
              (link.public || currentUser) && (
                <li key={`nav-link-${link.label}`} className="nav-item">
                  <Link to={link.path} className="nav-link">
                    {link.label}
                  </Link>
                </li>
              )
          )}
        </div>

        {currentUser ? (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/profile"} className="nav-link">
                {currentUser.user.email}
              </Link>
            </li>
            <li className="nav-item">
              <a href="/login" className="nav-link" onClick={logOut}>
                LogOut
              </a>
            </li>
          </div>
        ) : (
          <div className="navbar-nav ml-auto">
            <li className="nav-item">
              <Link to={"/login"} className="nav-link">
                Login
              </Link>
            </li>

            <li className="nav-item">
              <Link to={"/register"} className="nav-link">
                Sign Up
              </Link>
            </li>
          </div>
        )}
      </nav>

      <div className="container mt-3">
        <Switch>
          <Route exact path={["/", "/home"]} component={Home} />
          <Route exact path="/login" component={Login} />
          <Route exact path="/register" component={Register} />
          {currentUser && (
            <>
              <Route exact path="/profile" component={Profile} />
              <Route path="/wallet" component={Wallet} />
              <Route path="/mint" component={NftMint} />
              <Route path="/gallery" component={Gallery} />
            </>
          )}
        </Switch>
      </div>
    </div>
  );
};

export default App;
