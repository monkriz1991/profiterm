module.exports = {
  apps: [
    {
      name: "cryptoscool",
      exec_mode: "cluster",
      instances: 1,
      script: "npm",
      args: "start",
      port: 8880,
    },
  ],
};
