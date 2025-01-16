
function setup(globalProperties) {
  globalProperties.__exampleData = "hello"; // use in scripts
}

export default {
  install: (app) => {
    // Plugin code goes here
    setup(app.config.globalProperties);
  },
};
