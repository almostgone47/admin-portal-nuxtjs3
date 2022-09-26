// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  //   modules: ["@pinia/nuxt"],
  modules: [
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "acceptHMRUpdate"],
      },
    ],
  ],
});
