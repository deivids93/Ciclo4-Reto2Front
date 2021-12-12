const urlbase = "http://localhost:8080/api/user";

function cargartabla() {
  $.ajax({
    url: `${urlbase}/all`,
    type: "GET",
    datatype: "JSON",
    success: function (respuesta) {
      console.log(respuesta);
      MostrarTabla(respuesta);
    },
  });
}

function MostrarTabla(respuesta) {
  let myTable = '  <table  class="table table-hover">';
  myTable += "<thead>";
  myTable += "<tr>";
  myTable += "<th>Identificacion</th>";
  myTable += "<th>Nombres</th>";
  myTable += "<th>Email</th>";
  myTable += "<th>Tipo Usuario</th>";
  myTable += "<th>Zona</th>";
  myTable += "<td class='table_td'> Actualizar</td>";

  myTable += "</tr>";
  myTable += "</thead>";

  for (i = 0; i < respuesta.length; i++) {
    myTable += "<tr>";
    myTable += "<td >" + respuesta[i].identification + "</td>";
    myTable += "<td > " + respuesta[i].name + "</td>";
    myTable += "<td >" + respuesta[i].email + "</td>";
    myTable += "<td >" + respuesta[i].type + "</td>";
    myTable += "<td >" + respuesta[i].zone + "</td>";
    myTable +=
      "<td > <button onclick=' datosActualizar(" +
      respuesta[i].id +
      ")'>Actualizar</button>";

    myTable += "</tr>";
  }
  myTable += "</table>";
  $("#cargartabla").html(myTable);
}

function validacionRegistro() {
  //document.getElementById('txtNombre').value;

  const id = $("#txtId").val();
  const identification = $("#txtNumIdentificacion").val();
  const nombre = $("#txtNombre").val();
  const addres = $("#txtDirrecion").val();
  const celular = $("#txtCelular").val();
  const correo = $("#txtEmail").val();
  const clave = $("#txtClave").val();
  const confirmar = $("#txtConfirmarClave").val();
  const zona = $("#txtZona").val();
  const perfil = $("#selectperfil").val();

  const emailvalido = validarEmail(correo);

  if (
    id.length === 0 ||
    identification.length === 0 ||
    nombre.length === 0 ||
    addres.length === 0 ||
    celular.length === 0 ||
    correo.length === 0 ||
    clave.length === 0 ||
    confirmar.length === 0 ||
    zona.length === 0 ||
    perfil.length === 0
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
  } else {
    validarcorreo(correo, "registro");
  }
}

function validarcorreo(correo, accion) {
  $.ajax({
    url: `${urlbase}/emailexist/${correo}`,
    type: "GET",
    datatype: "JSON",
    success: function (respuesta) {
      console.log("funcion existe " + respuesta + " " + accion);
      if (respuesta == true) {
        console.log("coreo ya existe  ");
        if (accion == "registro") {
          mostrarMensaje("Error", "No se puede crear usuario", true);
        } else {
          mostrarMensaje("Error", "Usuario no editado", true);
        }
      } else {
        console.log("coreo no  existe  ");
        ejecutarAccion(accion);
      }
    },
  });
}

function ejecutarAccion(accion) {
  let payload = {
    id: $("#txtId").val(),
    identification: $("#txtNumIdentificacion").val(),
    name: $("#txtNombre").val(),
    address: $("#txtDirrecion").val(),
    cellPhone: $("#txtCelular").val(),
    email: $("#txtEmail").val(),
    password: $("#txtClave").val(),
    zone: $("#txtZona").val(),
    type: $("#selectperfil").val(),
  };
  console.log("registros" + payload);
  if (accion == "registro") {
    console.log("usuario registrado:" + payload);
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
          console.log("usuario creado:" + payload);
          mostrarMensaje("Confirmacion", "Cuenta creada de forma correcta");
          //alert('Empresa Creada');
          limpiardatos();
          cargartabla();
        },
      },
      error: function (xhr, status) {
        $("#loading").html("");
        console.log(xhr);
        console.log(status);
        mostrarMensaje("Error", "No se puede crear usuario", true);
      },
    });
  } else if (accion == "Actualizar") {
    console.log(payload);
    let dataToSend = JSON.stringify(payload);
    $.ajax({
      url: `${urlbase}/update`,
      type: "PUT",
      data: dataToSend,
      contentType: "application/JSON",
      datatype: "JSON",
      success: function () {
        mostrarMensaje("Confirmacion", "Usuario editado");
        limpiardatos();
        cargartabla();
      },
      error: function (xhr, status) {
        $("#loading").html("");
        console.log(xhr);
        console.log(status);
        mostrarMensaje("Error", "Usuario no editado", true);
      },
    });
  }

  {
    mostrarMensaje("Error", "No se puede crear usuario", true);
    limpiardatos();
  }
}

function limpiardatos() {
  $("#txtId").val("");
  $("#txtNumIdentificacion").val("");
  $("#txtDirrecion").val("");
  $("#txtCelular").val("");
  $("#txtEmail").val("");
  $("#txtNombre").val("");
  $("#txtClave").val("");
  $("#txtConfirmarClave").val("");
  $("#txtZona").val("");
  $("#selectperfil").val("");
}

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

function datosActualizar(idElemento) {
  console.log("id", +idElemento);
  $.ajax({
    url: `${urlbase}/${idElemento}`,
    type: "GET",
    datatype: "JSON",
    success: function (respuesta) {
      console.log(respuesta);

      registrardatos(respuesta);
    },
  });
}

function registrardatos(respuesta) {
  console.log("hola" + respuesta);

  $("#txtId").val(respuesta.id);
  $("#txtNumIdentificacion").val(respuesta.identification);
  $("#txtDirrecion").val(respuesta.address);
  $("#txtCelular").val(respuesta.cellPhone);
  $("#txtEmail").val(respuesta.email);
  $("#txtNombre").val(respuesta.name);
  $("#txtClave").val(respuesta.password);
  $("#txtZona").val(respuesta.zone);
  $("#selectperfil").val(respuesta.type);
  mostrar();
}

function validarcambios(id, correo, accion) {
  $.ajax({
    url: `${urlbase}/${id}`,
    type: "GET",
    dataType: "json",
    success: function (respuesta) {
      if (respuesta.email == correo) {
        console.log("No se mdifico correo");
        ejecutarAccion(accion);
      } else {
        console.log("Se mdifico correo");
        validarcorreo(correo, accion);
      }
    },
  });
}

function mostrar() {
  document.getElementById("btnactualizar").style.display = "inline";
  document.getElementById("btnelimianr").style.display = "inline";
  document.getElementById("btnguardar").style.display = "none";
  $("#txtId").prop("disabled", true);
  $("#selectperfil").prop("disabled", true);
}

function validacionActualizar() {
  const id = $("#txtId").val();
  const nombre = $("#txtNombre").val();
  const addres = $("#txtDirrecion").val();
  const celular = $("#txtCelular").val();
  const correo = $("#txtEmail").val();
  const clave = $("#txtClave").val();
  const confirmar = $("#txtConfirmarClave").val();
  const zona = $("#txtZona").val();
  const emailvalido = validarEmail(correo);

  if (
    nombre.length === 0 ||
    addres.length === 0 ||
    celular.length === 0 ||
    correo.length === 0 ||
    clave.length === 0 ||
    confirmar.length === 0 ||
    zona.length === 0
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
  } else {
    validarcambios(id, correo, "Actualizar");
  }
}

function Eliminar() {
  const id = $("#txtId").val();

  $.ajax({
    url: `${urlbase}/${id}`,
    type: "DELETE",

    contentType: "application/JSON",
    datatype: "JSON",
    success: function (respuesta) {
      $("#cargartabla").empty();
      cargartabla();
      $("#txtId").val("");
      $("#txtNumIdentificacion").val("");
      $("#txtDirrecion").val("");
      $("#txtCelular").val("");
      $("#txtEmail").val("");
      $("#txtNombre").val("");
      $("#txtClave").val("");
      $("#txtConfirmarClave").val("");
      $("#txtZona").val("");
      $("#selectperfil").val("");
      $("#txtId").prop("disabled", false);
      $("#selectperfil").prop("disabled", false);
      mostrarMensaje("Confirmacion", "Usuario borrado de la BD");
    },
  });
}
