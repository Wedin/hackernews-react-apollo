import React, { Component } from "react";
import Header from "./Header";
import { Switch, Route, Redirect } from "react-router-dom";
import FeedLinkList from "./FeedLinkList";
import CreateLink from "./CreateLink";
import Login from "./Login";
import Search from "./Search";

class App extends Component {
  render() {
    return (
      <>
        <div className="center app">
          <Header />
          <div className="ph3 pv1 background-gray">
            <Switch>
              <Route exact path="/" render={() => <Redirect to="/new/1" />} />
              <Route exact path="/create" component={CreateLink} />
              <Route exact path="/login" component={Login} />
              <Route exact path="/search" component={Search} />
              <Route exact path="/top" component={FeedLinkList} />
              <Route exact path="/new/:page" component={FeedLinkList} />
            </Switch>
          </div>
        </div>
      </>
    );
  }
}

export default App;
