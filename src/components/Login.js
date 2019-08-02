import React, { useState } from "react";
import { Mutation } from "react-apollo";
import gql from "graphql-tag";
import { saveAuthToken } from "../authTokenStorage";
import Input from "./Input";

const SIGNUP_MUTATION = gql`
  mutation SignupMutation($email: String!, $password: String!, $name: String!) {
    signup(email: $email, password: $password, name: $name) {
      token
    }
  }
`;

const LOGIN_MUTATION = gql`
  mutation LoginMutation($email: String!, $password: String!) {
    login(email: $email, password: $password) {
      token
    }
  }
`;

const Login = ({ history }) => {
  const [showLoginScreen, setshowLoginScreen] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");

  const _confirm = async data => {
    const { token } = showLoginScreen ? data.login : data.signup;
    saveAuthToken(token);
    history.push("/");
  };

  return (
    <Mutation
      mutation={showLoginScreen ? LOGIN_MUTATION : SIGNUP_MUTATION}
      variables={{ email, password, name }}
      onCompleted={data => _confirm(data)}
    >
      {(mutation, { loading, error }) => (
        <form
          onSubmit={e => {
            e.preventDefault();
            mutation();
          }}
        >
          <h4 className="mv3">{showLoginScreen ? "Login" : "Sign Up"}</h4>
          <div className="flex flex-column">
            {!showLoginScreen && (
              <Input
                value={name}
                onChange={e => setName(e.target.value)}
                label="Name"
                placeholder="Your name"
                id="login-name"
              />
            )}
            <Input
              value={email}
              onChange={e => setEmail(e.target.value)}
              label="Email address"
              type="email"
              placeholder="Your email address"
              id="email-address"
            />
            <Input
              value={password}
              onChange={e => setPassword(e.target.value)}
              type="password"
              label="Password"
              placeholder="Choose a safe password"
              id="login-password"
            />
          </div>
          <div className="mt3">
            <>
              {error && (
                <div className="pv3">
                  Error
                  <span role="img" aria-label="light">
                    🚨
                  </span>
                </div>
              )}
              <button type="submit" className="pointer mr2 button" onClick={mutation}>
                {showLoginScreen ? "login" : "create account"}
              </button>
            </>

            <button type="button" className="pointer button" onClick={() => setshowLoginScreen(!showLoginScreen)}>
              {showLoginScreen ? "need to create an account?" : "already have an account?"}
            </button>
          </div>
        </form>
      )}
    </Mutation>
  );
};

export default Login;
