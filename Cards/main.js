const { createApp } = Vue;

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
      isOpen: false,
      favorite: false,
      leave: false,
      favorites: [],
      localFavorites: "",
      input: {
        systemPrice: "",
        randomPrice: "",
        userPrice: 0,
        success: false,
      },
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
      this.isOpen = true;
    },
    setClose() {
      this.open = false;
      this.isOpen = false;
      this.input = {
        systemPrice: "",
        randomPrice: "",
        userPrice: 0,
        success: false,
        validation: false,
      };
    },
    leave() {
      this.leave = !false;
      this.isOpen = false;
    },
    buyCard(cardPrice, card) {
      if (this.input.userPrice) {
        this.input.systemPrice = cardPrice;
        this.input.success =
          parseInt(this.input.userPrice) >= this.input.systemPrice &&
          parseInt(this.input.userPrice) - 100 >= this.input.systemPrice
            ? true
            : false;
        this.input.validation = !true;
        const randomPrice = Math.floor(
          Math.random() *
            (this.input.systemPrice + 1000 - this.input.systemPrice + 1) +
            this.input.systemPrice
        );
        if (this.input.randomPrice) {
          this.input.success =
            parseInt(this.input.userPrice) >= this.input.randomPrice
              ? true
              : false;
        } else {
          this.input.randomPrice = randomPrice;
        }
      } else {
        this.input.validation = true;
      }
      if (this.input.success) {
        let userCard = card;
        userCard.ownerCode = this.User?.ownerCode;
        const cartsSold = JSON.parse(localStorage.getItem("cartsSold"));
        localStorage.setItem(
          "cartsSold",
          JSON.stringify([...cartsSold, userCard])
        );
      }
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

        const result = favs.filter((f) => {
          return f !== "";
        });

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

    this.Cards = cardsAPI.map((c) => {
      c.price = Math.floor(Math.random() * (10000 - 1000 + 1) + 1000);
      c.favorite = false;
      return c;
    });
  },
  beforeMount() {
    this.localFavorites = JSON.parse(localStorage.getItem("favorites"));
  },
  mounted() {
    this.User = JSON.parse(localStorage.getItem("user"));
    this.isAuthenticated = this.User ? true : false;
  },
  beforeUpdate() {},
  updated() {},
}).mount("#root");
