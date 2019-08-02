import React from "react";
import { Link } from "react-router-dom";
import { withRouter } from "react-router";
import { getAuthToken, deleteAuthToken } from "../authTokenStorage";

const LinkSeparator = () => (
  <div className="ml1" aria-hidden="true">
    |
  </div>
);

const Header = ({ history }) => {
  const authToken = getAuthToken();

  return (
    <div className="flex pa1 justify-between nowrap orange">
      <div className="flex flex-fixed black">
        <h1 className="fw7 mr1 f5 ma0">Hacker News</h1>
        <Link to="/" className="ml1 no-underline black">
          new
        </Link>
        <LinkSeparator />
        <Link to="/top" className="ml1 no-underline black">
          top
        </Link>
        <LinkSeparator />
        <Link to="/search" className="ml1 no-underline black">
          search
        </Link>
        {authToken && (
          <div className="flex">
            <LinkSeparator />
            <Link to="/create" className="ml1 no-underline black">
              submit
            </Link>
          </div>
        )}
      </div>
      <div className="flex flex-fixed">
        {authToken ? (
          <div
            className="ml1 pointer black"
            onClick={() => {
              deleteAuthToken();
              history.push(`/`);
            }}
          >
            logout
          </div>
        ) : (
          <Link to="/login" className="ml1 no-underline black">
            login
          </Link>
        )}
      </div>
    </div>
  );
};

export default withRouter(Header);
