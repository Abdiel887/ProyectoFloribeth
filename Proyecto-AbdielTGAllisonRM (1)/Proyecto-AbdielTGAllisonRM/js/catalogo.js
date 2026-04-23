document.addEventListener("DOMContentLoaded", function () {
  let botonesFiltro = document.querySelectorAll(".filtro-catalogo");
  let itemsCatalogo = document.querySelectorAll(".item-catalogo");
  let modalMoto = document.getElementById("modalMoto") || document.getElementById("bikeModal");

  function aplicarFiltro(filtro) {
    botonesFiltro.forEach(function (boton) {
      if (boton.dataset.filter === filtro) {
        boton.classList.add("active");
      } else {
        boton.classList.remove("active");
      }
    });

    itemsCatalogo.forEach(function (item) {
      if (filtro === "all" || item.dataset.category === filtro) {
        item.classList.remove("oculto");
      } else {
        item.classList.add("oculto");
      }
    });
  }

  botonesFiltro.forEach(function (boton) {
    boton.addEventListener("click", function () {
      aplicarFiltro(boton.dataset.filter);
    });
  });

  let parametros = new URLSearchParams(window.location.search);
  let filtroInicial = parametros.get("filter");

  if (filtroInicial) {
    aplicarFiltro(filtroInicial);
  }

  if (!modalMoto) {
    return;
  }

  function ponerTexto(id1, id2, valor) {
    let nodo = document.getElementById(id1) || document.getElementById(id2);
    if (nodo) {
      nodo.textContent = valor || "";
    }
  }

  modalMoto.addEventListener("show.bs.modal", function (evento) {
    let disparador = evento.relatedTarget;
    let datosMoto = disparador ? disparador.dataset.bike : null;

    if (!datosMoto) {
      return;
    }

    try {
      let datos = JSON.parse(datosMoto);

      ponerTexto("tituloModalMoto", "bikeModalTitle", datos.name);
      ponerTexto("categoriaModalMoto", "bikeModalCategory", datos.category);
      ponerTexto("precioModalMoto", "bikeModalPrice", datos.price);
      ponerTexto("descripcionModalMoto", "bikeModalDescription", datos.description);
      ponerTexto("potenciaModalMoto", "bikeModalHP", datos.hp);
      ponerTexto("torqueModalMoto", "bikeModalNw", datos.nw);
      ponerTexto("pesoModalMoto", "bikeModalKg", datos.kg);
      ponerTexto("cilindradaModalMoto", "bikeModalCilindrada", datos.cilindrada);
      ponerTexto("cilindrosModalMoto", "bikeModalCilindros", datos.cilindros);
      ponerTexto("marcaModalMoto", "bikeModalMarca", datos.marca);
      ponerTexto("arranqueModalMoto", "bikeModalArranque", datos.arranque);
      ponerTexto("transmisionModalMoto", "bikeModalTransmision", datos.transmision);
      ponerTexto("llantasModalMoto", "bikeModalLlantas", datos.llantas);
      ponerTexto("suspensionModalMoto", "bikeModalSuspension", datos.suspension);
      ponerTexto("frenosModalMoto", "bikeModalFrenos", datos.frenos);

      let video = document.getElementById("videoModalMoto") || document.getElementById("bikeModalVideo");
      if (video && datos.video) {
        video.innerHTML = '<source src="' + datos.video.replace("../assets/", "assets/").replace("./assets/", "assets/") + '" type="video/mp4">';
        video.load();
      }
    } catch (error) {
      console.error("No se pudo abrir el detalle de la moto.", error);
    }
  });

  modalMoto.addEventListener("hidden.bs.modal", function () {
    let video = document.getElementById("videoModalMoto") || document.getElementById("bikeModalVideo");
    if (video) {
      video.pause();
      video.currentTime = 0;
    }
  });
});
