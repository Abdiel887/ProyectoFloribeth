
document.addEventListener("DOMContentLoaded", function () {

  let datosFinanciamiento = {
    "kawasaki": { nombre: "Kawasaki Ninja H2R", precio: 55500, imagen: "img/kawah2r.png" },
    "yamahar9": { nombre: "Yamaha R9", precio: 12500, imagen: "img/yamaha r9.png" },
    "hondacbr": { nombre: "Honda CBR 650 R", precio: 10500 , imagen: "img/Honda-CBR650R.png" },
    "hayabusa": { nombre: "Susuki Hayabusa GSX1300R", precio: 18500, imagen: "img/GSX1300R-Hayabusa.png" },
    "yamahayz": { nombre: "Yamaha YZ 125", precio: 8300, imagen: "img/yamayz.png" },
    "beta": { nombre: "Beta RR Racing 300", precio: 10200, imagen: "img/BETA-RR-RACING-300.png" },
    "hondacrf": { nombre: "Honda CRF 450R", precio: 9800, imagen: "img/honda_0018_CRF450R.png" },
    "ktm450": { nombre: "KTM 450 XC-F", precio: 11000, imagen: "img/KTM-450-XC-F.png" },
    "ktmsuperadventure": { nombre: "KTM Super Adventure R", precio: 21700, imagen: "img/ktmad.png" },
    "freedom": { nombre: "Freedom RX401", precio: 6500, imagen: "img/freedom.png" },
    "bmw": { nombre: "BMW R 1200 GS", precio: 20000, imagen: "img/2017_bmw-r-1200-gs_6.png" },
    "ktm890": { nombre: "KTM 890 Adventure R", precio: 15000, imagen: "img/ktm890.png" },
  };

  let entradaPrima = document.getElementById("entradaPrima");
  if (!entradaPrima) return;

  let botonesModelo = document.querySelectorAll(".opcion-modelo");
  let botonesPlazo = document.querySelectorAll(".opcion-plazo");
  let botonesTasa = document.querySelectorAll(".opcion-tasa");

  let estado = { modelo: null, plazo: 36, tasa: 18 };
  let motoSeleccionada = false;

  function formatearMoneda(valor) {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2
    }).format(valor);
  }

  function activarBoton(botones, valor, llave) {
    botones.forEach(function (boton) {
      if (boton.dataset[llave] === String(valor)) {
        boton.classList.add("active");
      } else {
        boton.classList.remove("active");
      }
    });
  }

  function texto(id, valor) {
    let nodo = document.getElementById(id);
    if (nodo) nodo.textContent = valor;
  }

  function actualizarVista() {
    if (!motoSeleccionada) return;

    let moto = datosFinanciamiento[estado.modelo];
    if (!moto) return;

    let precio = moto.precio;

    entradaPrima.max = precio;

    if (Number(entradaPrima.value) > precio) {
      entradaPrima.value = Math.round((precio * 0.3) / 100) * 100;
    }

    let prima = Number(entradaPrima.value);
    let monto = Math.max(precio - prima, 0);
    let tasaMensual = estado.tasa / 100 / 12;
    let meses = estado.plazo;

    let cuota = 0;
    if (monto > 0) {
      cuota = tasaMensual === 0
        ? monto / meses
        : (monto * tasaMensual) / (1 - Math.pow(1 + tasaMensual, -meses));
    }

    let total = cuota * meses + prima;
    let interes = total - precio;

    let img = document.getElementById("imagenFinanciamiento");
    if (img) {
      img.src = moto.imagen;
      img.alt = moto.nombre;
      img.style.display = "block";
    }

    texto("nombreFinanciamiento", moto.nombre);
    texto("precioFinanciamiento", formatearMoneda(precio));
    texto("resumenPrecio", formatearMoneda(precio));
    texto("resumenPrima", "-" + formatearMoneda(prima));
    texto("resumenPlazo", meses + " meses");
    texto("resumenTasa", estado.tasa + "% anual");
    texto("resumenInteres", formatearMoneda(Math.max(interes, 0)));
    texto("resumenTotal", formatearMoneda(total));
    texto("cuotaMensual", formatearMoneda(cuota));
    texto("etiquetaPrima", formatearMoneda(prima));
    texto("limitePrecio", formatearMoneda(precio));
  }

  function seleccionarModelo(llaveModelo) {
    if (!datosFinanciamiento[llaveModelo]) return;

    estado.modelo = llaveModelo;
    motoSeleccionada = true;

    activarBoton(botonesModelo, llaveModelo, "model");

    entradaPrima.value = Math.round((datosFinanciamiento[llaveModelo].precio * 0.3) / 100) * 100;

    let btn = document.getElementById("modeloSeleccionado");
    if (btn) {
      let moto = datosFinanciamiento[llaveModelo];
      btn.style.display = "inline-block";
      btn.innerHTML = `${moto.nombre} <span>${formatearMoneda(moto.precio)}</span>`;
    }

    actualizarVista();
  }

  botonesModelo.forEach(btn => {
    btn.addEventListener("click", () => seleccionarModelo(btn.dataset.model));
  });

  botonesPlazo.forEach(btn => {
    btn.addEventListener("click", () => {
      estado.plazo = Number(btn.dataset.term);
      activarBoton(botonesPlazo, estado.plazo, "term");
      actualizarVista();
    });
  });

  botonesTasa.forEach(btn => {
    btn.addEventListener("click", () => {
      estado.tasa = Number(btn.dataset.rate);
      activarBoton(botonesTasa, estado.tasa, "rate");
      actualizarVista();
    });
  });

  entradaPrima.addEventListener("input", actualizarVista);

  let params = new URLSearchParams(window.location.search);
  let modeloUrl = params.get("model");

  if (modeloUrl) {
    modeloUrl = modeloUrl.toLowerCase();
  }

  if (modeloUrl && datosFinanciamiento[modeloUrl]) {
    seleccionarModelo(modeloUrl);
  }
});

