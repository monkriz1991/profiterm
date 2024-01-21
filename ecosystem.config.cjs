module.exports = {
  apps: [
    {
      name: "cryptoscool",
      exec_mode: "cluster",
      instances: "max", //
      script: "./node_modules/nuxt/bin/nuxt.mjs",
      args: "start",
      port: 8830,
    },
  ],
};
