const { createApp } = Vue;

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

createApp({
  data() {
    return {
      first: "yessss",
      User: "",
      isAuthenticated: false,
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
  },
  mounted() {
    console.log("Hello world");
    this.User = JSON.parse(localStorage.getItem("user"));
    this.isAuthenticated = this.User ? true : false;
  },
})
  .use(router)
  .mount("#root");
