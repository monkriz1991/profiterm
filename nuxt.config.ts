// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    // pageTransition: { name: "page", mode: "out-in" },
    head: {
      link: [{ rel: "icon", type: "image/x-icon", href: "/favicon.png" }],
    },
  },

  runtimeConfig: {
    bdurl: process.env.DATABASE_URL,
    dbName: process.env.DBNAME,
    user: process.env.DBUSERNAME,
    pass: process.env.DBPASSWORD,
    authSource: process.env.DBAUTHSOURCE,
    authSecret: process.env.AUTH_SECRET,
    mongodbUri: process.env.DATABASE_URL,
    MAILHOST: process.env.MAILHOST,
    MAILPORT: process.env.MAILPORT,
    MAILUSER: process.env.MAILUSER,
    MAILPASSWORD: process.env.MAILPASSWORD,
    CONTACTMAIL: process.env.CONTACTMAIL,
  },
  css: [
    "@/assets/main.css",
    "@/node_modules/bulma/css/bulma.css",
    "@/node_modules/plyr/dist/plyr.css",
    // "element-plus/dist/index.css",
  ],
  elementPlus: {
    importStyle: "css",
  },
  modules: [
    "nuxt-simple-sitemap",
    "nuxt-server-utils",
    "@sidebase/nuxt-auth",
    "nuxt-swiper",
    "@element-plus/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt-modules/cache",
    "nuxt-icons",
    "nuxt-icon",
    "@nuxt/image-edge",
    "@nuxt/image",
    // "@nuxt/http",
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Montserrat: [100, 300, 400, 500, 600, 700, 800],
          download: true,
          inject: true,
        },
      },
    ],
  ],
  http: {
    proxy: true,
  },
  // proxy: {
  //   "/images/": {
  //     target: "https://cryptoscool.ru",
  //     pathRewrite: {
  //       "^/images/": "/images/",
  //     },
  //   },
  // },
  staticAssets: {
    directory: [
      {
        prefix: "/images/",
        root: "/var/www/cryptoscool.ru/images/",
      },
    ],
  },
  nitro: {
    plugins: ["~/server/index.ts"],
  },
  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: "authjs",
    },
  },
  image: {},
  buildModules: ["@nuxt/http"],
  // devtools: { enabled: true },
});
