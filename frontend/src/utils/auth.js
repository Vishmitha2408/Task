export function isLoggedIn() {
  return !!localStorage.getItem('token');
}

export function getRole() {
  return localStorage.getItem('role');
}

export function getUserId() {
  return localStorage.getItem('userId');
}

export function logout() {
  localStorage.clear();
}