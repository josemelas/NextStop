const API_URL = "https://seal-app-u4egd.ondigitalocean.app/api/usuarios";

export const authService = {
  // 1. Registro de usuarios (Cliente)
  registrar: async (datos: any) => {
    try {
      const res = await fetch(`${API_URL}/registrar/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...datos, recaptcha_token: "fake-token" }),
      });
      return await res.json();
    } catch (error) {
      return { error: "No se pudo conectar con el servidor de NextStop" };
    }
  },

  // 2. Inicio de Sesión
  login: async (email: string, pass: string, portal: "cliente" | "empresa") => {
    try {
      const res = await fetch(`${API_URL}/login/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password: pass,
          recaptcha_token: "fake-token",
          portal
        }),
      });

      const data = await res.json();

      if (res.ok && data.token) {
        localStorage.setItem("user_token", data.token.access);
        localStorage.setItem("user_data", JSON.stringify(data.usuario));
        localStorage.setItem("user_portal", portal);
        return { ok: true, data };
      }

      return { ok: false, data };
    } catch (error) {
      return { ok: false, data: { error: "Error de conexión con el servidor" } };
    }
  },

  // 3. Validar Token
  verificarSesion: async () => {
    if (typeof window === "undefined") return null;
    const token = localStorage.getItem("user_token");
    if (!token) return null;

    try {
      const res = await fetch(`${API_URL}/validar-token/`, {
        method: "GET",
        headers: { "Authorization": `Bearer ${token}`, "Content-Type": "application/json" },
      });
      return res.ok ? await res.json() : (localStorage.clear(), null);
    } catch (error) {
      return null;
    }
  },

  // 4. RECUPERACIÓN DE CONTRASEÑA (NUEVAS FUNCIONES)
  solicitarRecuperacion: async (email: string) => {
    try {
      const res = await fetch(`${API_URL}/restablecer/contraseña/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      return await res.json();
    } catch (error) {
      return { error: "Error de conexión." };
    }
  },

confirmarRecuperacion: async (uid: string, token: string, nueva_password: string) => {
    try {
      const res = await fetch(`${API_URL}/password/confirmar/`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
           uid: uid,
           token: token,
           nueva_password: nueva_password // ESTE ES EL NOMBRE EXACTO QUE PIDIÓ BRIAN
        }),
      });
      return await res.json();
    } catch (error) {
      return { error: "Error al actualizar la contraseña." };
    }
  },

  // 5. Cerrar Sesión
  logout: () => {
    localStorage.clear();
    window.location.href = "/";
  }
};