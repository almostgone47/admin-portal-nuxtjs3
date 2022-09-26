interface Idata {
  success: String;
  jwtToken: String;
}

export const useAuthStore: Object = defineStore("auth", {
  state: () => ({ email: "a", password: "a", token: "" }),

  actions: {
    async login() {
      const res = await useFetch("/api/login", {
        method: "POST",
        body: { email: this.email, password: this.password },
      });
      console.log("login: ", res);

      //   if (res.data.success) {
      //     localStorage.setItem("token", res.data.jwtToken);
      //     await useRouter().push("/");
      //   }
    },
    logout() {
      localStorage.removeItem("token");
      useRouter().push("/login");
    },
    async currentUser() {
      const token = localStorage.getItem("token");
      const { data } = useFetch("/api/current-user", {
        headers: { "Content-Type": "application/json", Authorization: token },
      });
      console.log("middleware: ", data);
      if (!data) {
        await useRouter().push("/login");
      }
    },
  },
});
