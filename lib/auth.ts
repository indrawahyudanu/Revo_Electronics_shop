// Cek apakah user sudah login (data user disimpan di localStorage setelah register/login)
export function isLoggedIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    const raw = localStorage.getItem("user");
    if (!raw) return false;
    const user = JSON.parse(raw);
    return Boolean(user && user.id);
  } catch {
    return false;
  }
}
