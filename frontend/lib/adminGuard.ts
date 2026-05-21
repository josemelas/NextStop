export const isAdmin = () => {
  if (typeof window === "undefined") return false;

  const userDataString = localStorage.getItem("user_data");
  if (!userDataString) return false;

  try {
    const user = JSON.parse(userDataString);

    // Solo vips
    const admins = user.rol === "Administrador";

    // Verificamos si el correo del usuario logueado está en la lista
    return admins.includes(user.email?.toLowerCase());
  } catch (error) {
    return false;
  }
};