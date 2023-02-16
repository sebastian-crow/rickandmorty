const { createApp } = Vue;

createApp({
  data() {
    return {
      first: "",
    };
  },

  methods: {},

  created() {
    console.log("Hello world");
  },
}).mount("#root");
