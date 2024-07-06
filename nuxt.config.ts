// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  app: {
    // pageTransition: { name: "page", mode: "out-in" },
    head: {
      htmlAttrs: {
        lang: "ru",
      },
      title:
        "Проектирование, монтаж систем отопления, водоснабжения, канализации",
      titleTemplate: "%s",
      charset: "utf-8",
      viewport: "width=device-width, initial-scale=1",
      meta: [
        // Viewport
        {
          hid: "viewport",
          name: "viewport",
          content: "width=device-width, initial-scale=1, maximum-scale=1",
        },
        // Phone Number Detection
        {
          hid: "format-detection",
          name: "format-detection",
          content: "telephone=no",
        },
        // {
        //   hid: "robots",
        //   name: "robots",
        //   content: "noindex, nofollow",
        // },
        // // Robots (noodp means no Open Directory Project information)
        // { hid: "robots", name: "robots", content: "noodp" },
        { hid: "color-scheme", name: "color-scheme", content: "light only" },
      ],
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
    FILES_PATH: process.env.FILES_PATH,
    public: {
      filesPath: process.env.FILES_PATH_URL,
    },
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
    "nuxt-server-utils",
    "@sidebase/nuxt-auth",
    "nuxt-swiper",
    "@element-plus/nuxt",
    "@pinia/nuxt",
    "@pinia-plugin-persistedstate/nuxt",
    "@nuxt-modules/cache",
    "nuxt-icons",
    "formidable",
    "@nuxtjs/seo",
    "nuxt-icon",
    "@nuxt/image-edge",
    "@nuxt/image",
    [
      "@nuxtjs/google-fonts",
      {
        families: {
          Montserrat: [100, 300, 400, 500, 600, 700, 800],
          Caveat: [100, 300, 400, 500, 600, 700, 800],
        },
        download: true,
        inject: true,
      },
    ],
    [
      "yandex-metrika-module-nuxt3",
      {
        id: "74350936",
        webvisor: true,
      },
    ],
  ],
  site: {
    url: "https://profiterm.by",
  },
  sitemap: {
    sitemaps: {
      pages: {
        sources: ["/api/sitemap/pages-urls"],
      },
      catalog: {
        sources: ["/api/sitemap/catalog-urls"],
      },
      project: {
        sources: ["/api/sitemap/project-urls"],
      },
    },
  },
  nitro: {
    plugins: ["~/server/index.ts"],
    devProxy: {
      "/images": {
        target: "https://disk.profiterm.by/images/",
        changeOrigin: true,
      },
    },
  },
  auth: {
    baseURL: process.env.AUTH_ORIGIN,
    provider: {
      type: "authjs",
    },
  },
  image: {
    aliyun: {
      baseURL: "https://disk.profiterm.by/images/",
    },
  },
  // devtools: { enabled: true },
});
