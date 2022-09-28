// https://v3.nuxtjs.org/api/configuration/nuxt.config
export default defineNuxtConfig({
  //   modules: ["@pinia/nuxt"],
  transpile: ["@headlessui/vue"],
  modules: [
    ["@nuxtjs/tailwindcss"],
    [
      "@pinia/nuxt",
      {
        autoImports: ["defineStore", "acceptHMRUpdate"],
      },
    ],
  ],
});
