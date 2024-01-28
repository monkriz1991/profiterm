module.exports = {
  apps: [
    {
      name: "cryptoscool",
      exec_mode: "cluster",
      instances: 1,
      // script: "./.output/server/index.mjs",
      script: "dist/server/index.mjs",
      args: "start",
      port: 8880,
    },
  ],
};
