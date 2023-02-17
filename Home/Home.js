export const Home = {
  name: "Home",
  template: ``,
  data() {
    return {
      rickandmorty: "",
    };
  },
  created() {
    console.log("Has been created");
  },
  mounted() {},
  methods: {
    async getApiData() {
      const response = await fetch("https://rickandmortyapi.com/api/character");
      let data = response.json();
      return (this.rickandmorty = data);
    },
  },
};
