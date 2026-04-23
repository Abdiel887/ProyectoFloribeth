document.addEventListener("DOMContentLoaded", function () {
  const contenedorPanel = document.getElementById("contenedorPanelAccesibilidad");
  const contenido = document.getElementById("contenidoAccesible");

  if (!contenido) return;

  if (contenedorPanel) {
    fetch("panelAccesibilidad.html")
      .then(function (respuesta) {
        return respuesta.text();
      })
      .then(function (html) {
        contenedorPanel.innerHTML = html;
        iniciarAccesibilidad();
      })
      .catch(function (error) {
        console.error("No se pudo cargar panelAccesibilidad.html:", error);
      });
  } else {
    iniciarAccesibilidad();
  }

  function iniciarAccesibilidad() {
    if (contenido.dataset.accesibilidadLista === "si") return;
    contenido.dataset.accesibilidadLista = "si";

    const selectorTexto =
      "p, a, li, span, label, td, th, h1, h2, h3, h4, h5, h6, button, input, textarea, select, small, strong, legend, caption";

    const textos = Array.from(contenido.querySelectorAll(selectorTexto)).filter(function (elemento) {
      return (
        !elemento.classList.contains("bi") &&
        !elemento.closest(".navbar-brand") &&
        !elemento.closest(".marca-texto") &&
        !elemento.closest(".marca-icono") &&
        !elemento.closest(".panel-accesibilidad")
      );
    });

    textos.forEach(function (elemento) {
      if (!elemento.dataset.tamanoOriginal) {
        elemento.dataset.tamanoOriginal = window.getComputedStyle(elemento).fontSize;
      }
    });

   
    const PASO = 0.20;       
    const MIN_ESCALA = 0.40; 
    const MAX_ESCALA = 1.60; 

    let escala = 1;
    let fuenteActiva = false;
    let contrasteActivo = false;

    const CLAVE_ESCALA = "accesibilidadEscala";
    const CLAVE_FUENTE = "accesibilidadFuente";
    const CLAVE_CONTRASTE = "accesibilidadContraste";

    const btnAumentar = document.getElementById("aumentarTexto");
    const btnDisminuir = document.getElementById("disminuirTexto");
    const btnFuente = document.getElementById("toggleFuente");
    const btnContrasteAccesible = document.getElementById("contrasteAccesible");
    const btnReset = document.getElementById("resetAccesibilidad");

    function guardarPreferencias() {
      localStorage.setItem(CLAVE_ESCALA, escala);
      localStorage.setItem(CLAVE_FUENTE, fuenteActiva);
      localStorage.setItem(CLAVE_CONTRASTE, contrasteActivo);
    }

    function cargarPreferencias() {
      const escalaGuardada = localStorage.getItem(CLAVE_ESCALA);
      const fuenteGuardada = localStorage.getItem(CLAVE_FUENTE);
      const contrasteGuardado = localStorage.getItem(CLAVE_CONTRASTE);

      if (escalaGuardada !== null) {
        escala = parseFloat(escalaGuardada);
      }

      if (fuenteGuardada !== null) {
        fuenteActiva = fuenteGuardada === "true";
      }

      if (contrasteGuardado !== null) {
        contrasteActivo = contrasteGuardado === "true";
      }
    }

    function aplicarTamano() {
      textos.forEach(function (elemento) {
        const base = parseFloat(elemento.dataset.tamanoOriginal);
        elemento.style.fontSize = (base * escala) + "px";
      });
    }

    function aplicarFuente() {
      if (fuenteActiva) {
        contenido.classList.add("fuente-legible");
      } else {
        contenido.classList.remove("fuente-legible");
      }
    }

    function aplicarContraste() {
      if (contrasteActivo) {
        contenido.classList.add("contraste-accesible");
      } else {
        contenido.classList.remove("contraste-accesible");
      }
    }

    function resetearAccesibilidad() {
      escala = 1;
      fuenteActiva = false;
      contrasteActivo = false;

      textos.forEach(function (elemento) {
        elemento.style.fontSize = "";
      });

      contenido.classList.remove("fuente-legible");
      contenido.classList.remove("contraste-accesible");

      localStorage.removeItem(CLAVE_ESCALA);
      localStorage.removeItem(CLAVE_FUENTE);
      localStorage.removeItem(CLAVE_CONTRASTE);
    }

    if (btnAumentar) {
      btnAumentar.addEventListener("click", function () {
        if (escala + PASO <= MAX_ESCALA) {
          escala += PASO;
        } else {
          escala = MAX_ESCALA;
        }
        aplicarTamano();
        guardarPreferencias();
      });
    }

    if (btnDisminuir) {
      btnDisminuir.addEventListener("click", function () {
        if (escala - PASO >= MIN_ESCALA) {
          escala -= PASO;
        } else {
          escala = MIN_ESCALA;
        }
        aplicarTamano();
        guardarPreferencias();
      });
    }

    if (btnFuente) {
      btnFuente.addEventListener("click", function () {
        fuenteActiva = !fuenteActiva;
        aplicarFuente();
        guardarPreferencias();
      });
    }

    if (btnContrasteAccesible) {
      btnContrasteAccesible.addEventListener("click", function () {
        contrasteActivo = !contrasteActivo;
        aplicarContraste();
        guardarPreferencias();
      });
    }

    if (btnReset) {
      btnReset.addEventListener("click", function () {
        resetearAccesibilidad();
      });
    }

    cargarPreferencias();
    aplicarTamano();
    aplicarFuente();
    aplicarContraste();
  }
});
