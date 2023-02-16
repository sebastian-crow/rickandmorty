const { createApp } = Vue;

createApp({
  data() {
    return {
      toGo: {
        login: false,
        register: false,
        galery: true,
      },
    };
  },

  methods: {
    changeViewLogin() {
      this.toGo = {
        login: true,
        register: false,
        galery: false,
      };

      document.title = "Login";
    },

    changeViewRegister() {
      this.toGo = {
        login: false,
        register: true,
        galery: false,
      };

      document.title = "Registro";
    },
  },

  created() {},
}).mount("#root");
