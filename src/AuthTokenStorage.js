import { AUTH_TOKEN } from "./constants";

function getAuthToken() {
  const authToken = localStorage.getItem(AUTH_TOKEN);
  return authToken;
}

function saveAuthToken(authToken) {
  localStorage.setItem(AUTH_TOKEN, authToken);
}

function deleteAuthToken() {
  localStorage.removeItem(AUTH_TOKEN);
}

export { getAuthToken, saveAuthToken, deleteAuthToken };
