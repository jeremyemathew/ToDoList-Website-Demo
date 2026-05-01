export async function isTokenValid(token) {

  if (!token) return false;

  try {

    const res = await fetch('/api/auth/check', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    return res.ok;

  } catch {
    console.log(err);
    return false;
  }

}