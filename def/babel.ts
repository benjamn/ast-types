export = function (fork: any) {
  fork.use(require("./babel-core"));
  fork.use(require("./flow"));
};
