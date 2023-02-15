const { createApp } = Vue;

createApp({
  data() {
    return {
      first: "",
    };
  },
  methods: {},
  mounted() {
    console.log("Hello world");
  },
}).mount("#root");
