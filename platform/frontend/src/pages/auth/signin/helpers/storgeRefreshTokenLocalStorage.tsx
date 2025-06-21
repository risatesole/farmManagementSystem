function StorgeRefreshTokenLocalStorage(refreshToken: string) {
  if (refreshToken) {
    localStorage.setItem("refreshToken", refreshToken as string);
  }
}
export default StorgeRefreshTokenLocalStorage;