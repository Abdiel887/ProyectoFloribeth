document.addEventListener("DOMContentLoaded", function () {
  let formulario =
    document.getElementById("formularioContacto") ||
    document.getElementById("Formulario");

  if (!formulario) return;

  let botonEnviar = formulario.querySelector(
    'button[type="submit"], input[type="submit"]'
  );
  let botonLimpiar = formulario.querySelector(
    'button[type="reset"], input[type="reset"]'
  );

  let confirmarEnvio = false;
  let confirmarLimpieza = false;
  let temporizadorEnvio = null;
  let temporizadorLimpieza = null;

  function cambiarTextoBoton(boton, texto) {
    if (!boton) return;

    if (boton.tagName === "INPUT") {
      boton.value = texto;
    } else {
      boton.textContent = texto;
    }
  }

  function restaurarBotonEnviar() {
    confirmarEnvio = false;
    clearTimeout(temporizadorEnvio);
    cambiarTextoBoton(botonEnviar, "Enviar");
  }

  function restaurarBotonLimpiar() {
    confirmarLimpieza = false;
    clearTimeout(temporizadorLimpieza);
    cambiarTextoBoton(botonLimpiar, "Limpiar");
  }

  function limpiarErrores() {
    let camposFormulario = formulario.querySelectorAll("input, select, textarea");
    camposFormulario.forEach(function (elemento) {
      elemento.classList.remove("error");
    });
  }

  function validarFormulario() {
    limpiarErrores();

    let nombre = formulario.querySelector('input[name="Nombre"]');
    if (nombre.value.trim() === "") {
      nombre.classList.add("error");
      nombre.focus();
      alert("Ingrese su nombre.");
      return false;
    }

    let apellido = formulario.querySelector('input[name="Apellido"]');
    if (apellido.value.trim() === "") {
      apellido.classList.add("error");
      apellido.focus();
      alert("Ingrese su apellido.");
      return false;
    }

    let correo = formulario.querySelector('input[name="Correo"]');
    if (correo.value.trim() === "") {
      correo.classList.add("error");
      correo.focus();
      alert("Ingrese su correo.");
      return false;
    }

    let patronCorreo = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!patronCorreo.test(correo.value.trim())) {
      correo.classList.add("error");
      correo.focus();
      alert("Ingrese un correo válido.");
      return false;
    }

    let telefono = formulario.querySelector('input[name="Telefono"]');
    if (telefono.value.trim() === "") {
      telefono.classList.add("error");
      telefono.focus();
      alert("Ingrese su teléfono.");
      return false;
    }

    let patronTelefono = /^[0-9]{8}$/;
    if (!patronTelefono.test(telefono.value.trim())) {
      telefono.classList.add("error");
      telefono.focus();
      telefono.value = "";
      alert("El teléfono debe tener exactamente 8 dígitos.");
      return false;
    }

    let fecha = formulario.querySelector('input[name="Fecha_nacimiento"]');
    if (fecha.value.trim() === "") {
      fecha.classList.add("error");
      fecha.focus();
      alert("Ingrese su fecha de nacimiento.");
      return false;
    }

    let hoy = new Date().toISOString().split("T")[0];
    if (fecha.value > hoy) {
      fecha.classList.add("error");
      fecha.focus();
      alert("La fecha de nacimiento no puede ser futura.");
      return false;
    }

    let asunto = formulario.querySelector('select[name="Asunto"]');
    if (asunto.value === "") {
      asunto.classList.add("error");
      asunto.focus();
      alert("Seleccione un asunto.");
      return false;
    }

    let origen = formulario.querySelector('input[name="Origen"]:checked');
    if (!origen) {
      alert("Seleccione cómo nos conoció.");
      let primerRadio = formulario.querySelector('input[name="Origen"]');
      if (primerRadio) {
        primerRadio.focus();
      }
      return false;
    }

    let mensaje = formulario.querySelector('textarea[name="Mensaje"]');
    if (mensaje.value.trim() === "") {
      mensaje.classList.add("error");
      mensaje.focus();
      alert("Escriba un mensaje.");
      return false;
    }

    if (mensaje.value.trim().length < 10) {
      mensaje.classList.add("error");
      mensaje.focus();
      alert("El mensaje debe tener al menos 10 caracteres.");
      return false;
    }

    return true;
  }

  formulario.addEventListener("submit", function (e) {
    if (!confirmarEnvio) {
      e.preventDefault();

      confirmarEnvio = true;
      cambiarTextoBoton(botonEnviar, "Confirmar envío");

      temporizadorEnvio = setTimeout(function () {
        restaurarBotonEnviar();
      }, 2000);

      return;
    }

    e.preventDefault();
    restaurarBotonEnviar();

    if (!validarFormulario()) return;

    let nombre = formulario.querySelector('input[name="Nombre"]');

    alert(
      "Gracias por comunicarte con RACINGA&A, " +
        nombre.value.trim() +
        ". Tu formulario fue enviado con éxito."
    );

    formulario.submit();
  });

  formulario.addEventListener("reset", function (e) {
    if (!confirmarLimpieza) {
      e.preventDefault();

      confirmarLimpieza = true;
      cambiarTextoBoton(botonLimpiar, "Confirmar limpieza");

      temporizadorLimpieza = setTimeout(function () {
        restaurarBotonLimpiar();
      }, 2000);

      return;
    }

    restaurarBotonLimpiar();

    setTimeout(function () {
      limpiarErrores();
    }, 0);
  });
});