export const isAdmin = () => {
  if (typeof window === "undefined") return false;

  const userDataString = localStorage.getItem("user_data");
  if (!userDataString) return false;

  try {
    const user = JSON.parse(userDataString);

    // Solo vips
    const admins = [
      "jose123@hotmail.com",
      "maussbrian06@gmail.com"
    ];

    // Verificamos si el correo del usuario logueado está en la lista
    return admins.includes(user.email?.toLowerCase());
  } catch (error) {
    return false;
  }
};