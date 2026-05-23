const accessTokenKey = 'railway-prep-access-token';

export function getAccessToken() {
  return localStorage.getItem(accessTokenKey);
}

export function setAccessToken(token) {
  localStorage.setItem(accessTokenKey, token);
}

export function clearAccessToken() {
  localStorage.removeItem(accessTokenKey);
}
