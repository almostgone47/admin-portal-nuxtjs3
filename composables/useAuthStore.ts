const useAuthStore: Object = defineStore("auth", {
  state: () => ({
    email: "",
    password: "",
    confirmPassword: "",
    username: "",
    token: "",
    isAuthenticated: false,
  }),

  actions: {
    async register() {
      const res: any = await useFetch("/api/register", {
        method: "POST",
        body: {
          email: this.email,
          password: this.password,
          username: this.username,
        },
        headers: {
          "Content-Type": "application/json",
        },
      });
      const { success, jwtToken } = res.data.value;

      if (success) {
        localStorage.setItem("token", jwtToken);
        await useRouter().push("/dashboard");
      }
    },
    async login() {
      const res: any = await useFetch("/api/login", {
        method: "POST",
        body: { email: this.email, password: this.password },
      });

      const { success, jwtToken } = res.data.value;

      if (success) {
        localStorage.setItem("token", jwtToken);
        await useRouter().push("/dashboard");
      }
    },
    logout() {
      localStorage.removeItem("token");
      window.location.href = "/";
    },
    async currentUser() {
      const token = localStorage.getItem("token");

      if (!token) {
        await useRouter().push("/");
      }
    },
  },
});

export default useAuthStore;
