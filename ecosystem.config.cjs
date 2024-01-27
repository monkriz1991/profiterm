// module.exports = {
//   apps: [
//     {
//       name: "cryptoscool",
//       exec_mode: "cluster",
//       instances: "max", //
//       script: "./node_modules/nuxt/bin/nuxt.mjs",
//       args: "start",
//       port: 8880,
//     },
//   ],
// };
module.exports = {
  apps : [
    // {
    //   name: "nuxt-dev",
    //   script: "npm",
    //   args: "run dev"
    // },
    {
      name: "nuxt-prod",
      script: "npm",
      args: "run start"
    }
  ]
}
