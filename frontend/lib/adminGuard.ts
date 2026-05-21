export const isAdmin = () => {
  if (typeof window === "undefined") return false;

  const userDataString = localStorage.getItem("user_data");
  if (!userDataString) return false;

  try {
    const user = JSON.parse(userDataString);

    const esRolCorrecto = user.rol === "Administrador";

    return esRolCorrecto;
  } catch (error) {
    return false;
  }
};