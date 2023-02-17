var app = new Vue({
  el: "#app",
  data: {
    users: [],
    toGo: {
      login: false,
      register: false,
      galery: true,
    },
    formRegister: {
      username: "",
      password: "",
      fullName: "",
      cellPhone: "",
    },
    formLogin: {
      username: "",
      password: "",
    },
  },

  methods: {
    // funciones para cambiar el template dependiendo las acciones del usuario
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

    // Funcion reset form
    submitForm() {
      this.$refs.anyName.reset();
    },

    // Funciones para validar formulario con expresiones regulares
    validUsername(username) {
      const expRegUsername = /(?!.*[\.\-\_]{2,})^[a-zA-Z0-9\.\-\_]{3,24}$/gm;
      if (expRegUsername.test(username)) {
        return true;
      }
      Swal.fire({
        icon: "error",
        title: "Nombre Usuario...",
        text: `El nombre de usuario ${username} no es valido`,
      });
      return false;
    },

    validPassword(password) {
      const expRegPassword =
        /^(?=.{8,})(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?!.*\s).*$/gm;
      if (expRegPassword.test(password)) {
        return true;
      }
      Swal.fire({
        icon: "error",
        title: "Contraseña...",
        text: `La contraseña ${password} no es valida, debe incluir al menos 8 caracteres, una mayuscula, una minuscula`,
      });
      return false;
    },

    validFullName(fullname) {
      const expRegFullName =
        /^([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\']+[\s])+([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\'])+[\s]?([A-Za-zÁÉÍÓÚñáéíóúÑ]{0}?[A-Za-zÁÉÍÓÚñáéíóúÑ\'])?$/g;
      if (expRegFullName.test(fullname)) {
        return true;
      }
      Swal.fire({
        icon: "error",
        title: "Nombre Completo..",
        text: `El nombre completo ingresado ${fullname} no es valido`,
      });
      return false;
    },

    validEmail(email) {
      const expRegEmail = /\b[\w\.-]+@[\w\.-]+\.\w{2,4}\b/gi;
      if (expRegEmail.test(email)) {
        return true;
      }
      Swal.fire({
        icon: "error",
        title: "Email...",
        text: `El email ${email || ""} no es valido`,
      });
      return false;
    },

    validCellphone(num) {
      const expRegCellphoneCol = /^(3[0-9]{2})[0-9]{3}[0-9]{4}$/gm;
      if (expRegCellphoneCol.test(num)) {
        return true;
      }
      Swal.fire({
        icon: "error",
        title: "Celular...",
        text: `El numero de celular ${num} no es valido`,
      });
      return false;
    },

    // funcion verificar si existe un user con el mismo username
    validUserExists(arrayUsers, username) {
      if (
        arrayUsers.some(
          (el) => el.username.toLowerCase() === username.toLowerCase()
        )
      ) {
        Swal.fire({
          icon: "error",
          title: "Nombre Usuario...",
          text: `El nombre de usuario ${username.toLowerCase()} Ya existe en la base de datos, Por favor ingrese otro`,
        });
        return true;
      }
    },

    // funcion agregart user
    addUsers(newUser, arrayUsers) {
      arrayUsers.push(newUser);
      localStorage.setItem("users", JSON.stringify(this.users));
      Swal.fire({
        position: "center",
        icon: "success",
        title: "Usuario Registrado Correctamente",
        showConfirmButton: false,
        timer: 1500,
      });
      this.submitForm();
    },

    // funcion verificar user login
    verifyLogin(username, password, arrayUsers) {
      if (
        arrayUsers.find(
          (el) =>
            el.username.toLowerCase() === username.toLowerCase() &&
            el.password === password
        )
      ) {
        return true;
      }
      Swal.fire({
        icon: "error",
        title: "Usuario o Contraseña Invalido...",
        text: `El nombre de usuario ${username.toLowerCase()} y la Contraseña ${password} son invalidos, Por favor ingrese otro`,
      });
    },
    // funcion login
    login() {
      const { username, password } = this.formLogin;
      if (this.verifyLogin(username, password, this.users)) {
        Swal.fire({
          position: "center",
          icon: "success",
          title: "Existe",
          showConfirmButton: false,
          timer: 1500,
        });
      }
    },

    // funcion register
    register() {
      const { username, password, fullName, email, cellPhone } =
        this.formRegister;

      if (
        this.validUsername(username) &&
        this.validPassword(password) &&
        this.validFullName(fullName) &&
        this.validEmail(email) &&
        this.validCellphone(cellPhone)
      ) {
        // console.log("Registrado");
        this.validUserExists(this.users, username)
          ? false
          : this.addUsers(
              { username, password, fullName, email, cellPhone },
              this.users
            );
      }
    },
  },

  created() {
    let users = JSON.parse(localStorage.getItem("users"));
    if (users !== null) {
      this.users = users;
    }
  },
});
