export const isTokenValid = () => {
  const token = localStorage.getItem("token");
  if (!token) return false;

  try {
    const payload = JSON.parse(atob(token.split('.')[1])); // decode JWT
    const expiry = payload.exp;
    const now = Math.floor(Date.now() / 1000);
    return expiry > now;
  } catch (error) {
    return false;
  }
};
