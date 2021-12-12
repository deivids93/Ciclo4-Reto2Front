const urlbase = "http://localhost:8080/api/gadget";

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
  myTable += "<th>Id</th>";
  myTable += "<th>Marca</th>";
  myTable += "<th>Categoria</th>";
  myTable += "<th>Nombre</th>";
  myTable += "<th>Descripcion</th>";
  myTable += "<th>Disponibilidad</th>";
  myTable += "<th>Precio</th>";
  myTable += "<th>Cantidad</th>";
  myTable += "<th>Fotografia</th>";
  myTable += "<td class='table_td'> Actualizar</td>";

  myTable += "</tr>";
  myTable += "</thead>";

  for (i = 0; i < respuesta.length; i++) {
    myTable += "<tr>";
    myTable += "<td >" + respuesta[i].id + "</td>";
    myTable += "<td > " + respuesta[i].brand + "</td>";
    myTable += "<td >" + respuesta[i].category + "</td>";
    myTable += "<td >" + respuesta[i].name + "</td>";
    myTable += "<td >" + respuesta[i].description + "</td>";
    myTable += "<td >" + respuesta[i].availability + "</td>";
    myTable += "<td >" + respuesta[i].price + "</td>";
    myTable += "<td >" + respuesta[i].quantity + "</td>";
    myTable += "<td >" + respuesta[i].photography + "</td>";
    myTable +=
      "<td > <button onclick=' datosActualizar(" +
      respuesta[i].id +
      ")'>Actualizar</button>";

    myTable += "</tr>";
  }
  myTable += "</table>";
  $("#cargartabla").html(myTable);
}

function crear() {
  //document.getElementById('txtNombre').value;
  const id = $("#txtIdGadg").val();
  const brand = $("#txtMarca").val();
  const category = $("#txtCategoria").val();
  const name = $("#txtNombre").val();
  const availability = $("#selectDispon").val();
  const price = $("#txtPrecio").val();
  const quantity = $("#txtCantidad").val();
  const description = $("#txtDescripcion").val();
  const photography = $("#txtFoto").val();

  if (
    id.length === 0 ||
    brand.length === 0 ||
    category.length === 0 ||
    name.length === 0 ||
    availability.length === 0 ||
    price.length === 0 ||
    quantity.length === 0 ||
    description.length === 0
  ) {
    mostrarMensaje("Error", "No se permiten campos vacios", true);
    return;
  }

  let payload = {
    id: id,
    brand: brand,
    category: category,
    name: name,
    description: description,
    price: price,
    availability: availability,
    quantity: quantity,
    photography: photography,
  };

  console.log("usuario creado:" + payload);
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
        limpiarcampos();
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
}

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
  console.log("hola" + respuesta.photography);

  if (respuesta.availability == true) {
  }

  $("#txtIdGadg").val(respuesta.id);
  $("#txtMarca").val(respuesta.brand);
  $("#txtCategoria").val(respuesta.category);
  $("#txtNombre").val(respuesta.name);
  $("#selectDispon").val(respuesta.availability);
  if (respuesta.availability == true) {
    $("#selectDispon").val("true");
  } else {
    $("#selectDispon").val("false");
  }

  $("#txtPrecio").val(respuesta.price);
  $("#txtCantidad").val(respuesta.quantity);
  $("#txtDescripcion").val(respuesta.description);
  $("#txtFoto").val(respuesta.photography);

  let foto =
    "<figure> <img id='producto' src='" +
    respuesta.photography +
    "'> </figure>";
  $("#foto").html(foto);

  mostrar();
}

function mostrar() {
  document.getElementById("btnactualizar").style.display = "inline";
  document.getElementById("btnelimianr").style.display = "inline";
  document.getElementById("btnguardar").style.display = "none";
}

function actualizar() {
  const id = $("#txtIdGadg").val();
  const brand = $("#txtMarca").val();
  const category = $("#txtCategoria").val();
  const name = $("#txtNombre").val();
  const availability = $("#selectDispon").val();
  const price = $("#txtPrecio").val();
  const quantity = $("#txtCantidad").val();
  const description = $("#txtDescripcion").val();
  const photography = $("#txtFoto").val();

  if (
    id.length === 0 ||
    brand.length === 0 ||
    category.length === 0 ||
    name.length === 0 ||
    availability.length === 0 ||
    price.length === 0 ||
    quantity.length === 0 ||
    description.length === 0 ||
    photography.length === 0
  ) {
    mostrarMensaje("Error", "No se permiten campos vacios", true);
    return;
  }

  let myData = {
    id,
    brand,
    category,
    name,
    availability,
    price,
    quantity,
    description,
    photography,
  };

  console.log(myData);
  let dataToSend = JSON.stringify(myData);
  $.ajax({
    url: `${urlbase}/update`,
    type: "PUT",
    data: dataToSend,
    contentType: "application/JSON",
    datatype: "JSON",
    success: function (respuesta) {
      limpiarcampos();
      cargartabla();
    },
  });
}

function borrar() {
  const id = $("#txtIdGadg").val();
  $.ajax({
    url: `${urlbase}/${id}`,
    type: "DELETE",

    contentType: "application/JSON",
    datatype: "JSON",
    success: function (respuesta) {
      $("#cargartabla").empty();
      cargartabla();
      mostrarMensaje("Confirmacion", "Usuario borrado de la BD");
      limpiarcampos();
    },
  });
}

function limpiarcampos() {
  $("#txtIdGadg").val("");
  $("#txtMarca").val("");
  $("#txtCategoria").val("");
  $("#txtNombre").val("");
  $("#selectDispon").val("");
  $("#txtPrecio").val("");
  $("#txtCantidad").val("");
  $("#txtDescripcion").val("");
  $("#txtFoto").val("");
  $("#foto").empty();
}
