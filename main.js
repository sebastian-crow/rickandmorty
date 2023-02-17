const { createApp } = Vue;
/* 
// Define route components
import { Home } from "./Home/Home.js";
import { Login } from "./Auth/Login/Login.js";
import { Register } from "./Auth/Register/Register.js";
import { User } from "./Auth/User/User.js";
import { Auction } from "./Auction/Auction.js";

// Define some routes
// Each route should map to a component
const routes = [
  { path: "/", component: Home },
  { path: "/login", component: Login },
  { path: "/register", component: Register },
  { path: "/user", component: User },
  { path: "/auction", component: Auction },
];

// Create the router instance and pass the 'routes' option
const router = VueRouter.createRouter({
  history: VueRouter.createWebHistory(),
  routes,
});
 */
createApp({
  data() {
    return {
      first: "yessss",
      User: "",
      isAuthenticated: false,
      localCards: "",
      Cards: "",
      buy: {
        active: false,
        randomPrice: "",
        success: false,
      },
      open: false,
      favorite: false,
      favorites: [],
      localFavorites: "",
    };
  },
  computed: {
    username() {
      return this.$route.params.username;
    },
  },
  methods: {
    goToDashboard() {
      if (this.isAuthenticated) {
        this.$router.push("/subasta");
      } else {
        this.$router.push("/login");
      }
    },

    setOpen() {
      this.open = true;
    },
    setClose() {
      this.open = false;
    },
    setFavorite(cardId) {
      const cardsLoop = JSON.parse(JSON.stringify(this.Cards));
      this.Cards = cardsLoop.map((c) => {
        c.favorite = c.id === cardId ? true : false;
        this.favorites.push(c.id === cardId ? c : "");
        return c;
      });
      if (this.favorites.length >= 0) {
        const favs = JSON.parse(JSON.stringify(this.favorites));
        const uniqueFavs = favs.reduce((accumulator, current) => {
          if (!accumulator.find((item) => item.id === current.id)) {
            accumulator.push(current);
          }
          return accumulator;
        }, []);
        const result = uniqueFavs.filter((f) => {
          return f !== "";
        });
        this.favorites = result;
        this.localFavorites = result;
        localStorage.setItem("favorites", JSON.stringify(result));
      }
    },
    noFavorite(cardId) {
      const cardsLoop = JSON.parse(JSON.stringify(this.Cards));
      this.Cards = cardsLoop.map((c) => {
        c.favorite = c.id === cardId ? false : false;
        this.favorites.push(c.id === cardId ? c : "");
        return c;
      });

      if (this.favorites.length > 0) {
        let favs = JSON.parse(JSON.stringify(this.favorites));

        for (let i = 0; i < favs.length; i++) {
          if (favs[i].id === cardId) {
            /*  favs.splice(i, 1); */
            delete favs[i];
          }
        }

        this.favorites = result;
        this.localFavorites = result;
        localStorage.setItem("favorites", JSON.stringify(result));
      }
    },
    removeDuplicates(arr) {
      return arr.filter((item, index) => arr.indexOf(item) === index);
    },
  },

  async beforeCreate() {
    const cardsAPI = await axios
      .get("https://rickandmortyapi.com/api/character")
      .then((response) => {
        return response.data.results;
      })
      .catch((error) => console.log(error));

    const local = JSON.parse(JSON.stringify(this.localFavorites));
    /*  console.log(local); */
    this.Cards = cardsAPI.map((c) => {
      c.price = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
      /*      if (local) {
        local.map((l) => {
          if (c.id === l.id) c.favorite = l.favorite;
        });
      } */

      c.favorite = false;
      return c;
    });
  },
  beforeMount() {
    console.log(this.Cards);
    this.localFavorites = JSON.parse(localStorage.getItem("favorites"));
  },
  mounted() {
    this.User = JSON.parse(localStorage.getItem("user"));
    this.isAuthenticated = this.User ? true : false;
  },
  beforeUpdate() {
    /*  console.log(this.Cards); */
    console.log(this.favorites);
  },
  updated() {},
})
  /*   .use(router) */
  .mount("#root");
