export function clearClientAuthState() {
  sessionStorage.clear()
  localStorage.removeItem('appLoggedIn')
  localStorage.removeItem('appUserEmail')
  localStorage.removeItem('appUserName')
  localStorage.removeItem('appUserAvatar')
}
