// https://v3.nuxtjs.org/api/configuration/nuxt.config

export default defineNuxtConfig({
  build: {
    transpile: ["@heroicons/vue"],
  },
  runtimeConfig: {
    // The private keys which are only available within server-side
    DATABASE_URL: "mysql://root@localhost:3306/adminportal",
    secretOrKey: "asdfasdf",
  },
  transpile: ["@headlessui/vue"],
  nitro: {
    preset: "node-server",
  },
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
