const urlbase = "http://localhost:8080/api/user";

const iniciarSesion = () => {
  const loading = '<img src="img/spinner.gif">';
  $("#loading").html(loading);

  setTimeout(() => {
    autenticar();
  }, 2000);
};

const autenticar = () => {
  const email = $("#txtCorreo").val();
  const password = $("#txtPassword").val();

  if (email.length === 0 || password.length === 0) {
    mostrarMensaje(
      "Error",
      "Debe escribir el correo  y la clave para ingresar",
      true
    );
    $("#loading").html("");
    return;
  }

  $.ajax({
    url: `${urlbase}/${email}/${password}`,
    type: "GET",
    dataType: "json",
    success: function (respuesta) {
      $("#loading").html("");
      console.log(respuesta);
      if (respuesta.id === null) {
        mostrarMensaje("Error", "No existe un usuario", true);
      } else {
        mostrarMensaje("Error", "Bienvenido " + respuesta.name);

        setTimeout(() => {
          ingresar(respuesta.type);
        }, 2000);
      }
    },
    error: function (xhr, status) {
      $("#loading").html("");
      console.log(xhr);
      console.log(status);
      mostrarMensaje("Error", "Error al validar", true);
    },
  });
};

const ingresar = (perfil) => {
  if (perfil === "ADM") {
    window.open("menu.html", "MENU");
  }
  window.close();
};

const mostrarMensaje = (titulo, cuerpo, error) => {
  //console.log("error",error);
  document.getElementById("titulomensaje").innerHTML = titulo;
  $("#cuerpomensaje").html(cuerpo);
  $("#myToast").removeClass();
  if (error) {
    $("#myToast").addClass("toast bg-danger");
  } else {
    $("#myToast").addClass("toast bg-primary");
  }

  $("#myToast").toast("show");
};

const crear = () => {
  const correo = $("#txtEmail").val();
  const nombre = $("#txtNombre").val();
  const clave = $("#txtClave").val();
  const confirmar = $("#txtConfirmarClave").val();

  const emailvalido = validarEmail(correo);
  console.log("el correr valido " + emailvalido);

  if (
    correo.length === 0 ||
    nombre.length === 0 ||
    clave.length === 0 ||
    confirmar.length === 0
  ) {
    mostrarMensaje("Error", "No se permiten campos vacios", true);
    return;
  } else if (clave !== confirmar) {
    mostrarMensaje("Error", "Las claves no coinciden", true);
    return;
  } else if (clave.length < 6) {
    mostrarMensaje("Error", "La clave debe tener minimo 6 caracteres", true);
    return;
  } else if (emailvalido === false) {
    mostrarMensaje("Error", "Por favor digite un  correo valido ", true);
    return;
  }

  $.ajax({
    url: `${urlbase}/emailexist/${correo}`,
    type: "GET",
    dataType: "json",
    success: function (respuesta) {
      $("#loading").html("");
      console.log("correo " + respuesta);
      if (respuesta === true) {
        mostrarMensaje("Error", "Correo ya Existe no puede", true);
        setTimeout(() => {}, 1000);
        return;
      }
    },
    error: function (xhr, status) {
      $("#loading").html("");
      console.log(xhr);
      console.log(status);
      mostrarMensaje("Error", "Error al validar", true);
    },
  });

  const payload = {
    email: correo,
    password: clave,
    name: nombre,
  };
  console.log("creado" + payload);
  $.ajax({
    url: `${urlbase}/new`,
    type: "POST",
    dataType: "json",
    headers: {
      "Content-Type": "application/json",
    },

    data: JSON.stringify(payload),

    statusCode: {
      201: function () {
        mostrarMensaje("Confirmacion", "Usuario Creado");
        //alert('Empresa Creada');
        $("#txtEmail").val("");
        $("#txtNombre").val("");
        $("#txtClave").val("");
        $("#txtConfirmarClave").val("");
      },
    },
  });
};

const validarEmail = (valor) => {
  //expresion regular o regex
  let expReg =
    /^(([^<>()[\]\.,;:\s@\"]+(\.[^<>()[\]\.,;:\s@\"]+)*)|(\".+\"))@(([^<>()[\]\.,;:\s@\"]+\.)+[^<>()[\]\.,;:\s@\"]{2,})$/i;
  if (expReg.test(valor)) {
    return true;
  } else {
    return false;
  }
};
