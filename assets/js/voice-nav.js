export const scroller = new LocomotiveScroll({
  el: document.querySelector("[data-scroll-container]"),
  smooth: true,
  direction: "horizontal",
  // offset: [0, "70%"]
});

scroller.on("scroll", (instance) => {
  var windowWidth = $(window).width() / 2 - 50;
  if (instance.scroll.x >= windowWidth) {
    $(".mic-sticky").addClass("show-mic");
    $(".mic").addClass("hide-mic");
  } else {
    $(".mic-sticky").removeClass("show-mic");
    $(".mic").removeClass("hide-mic");
  }
});

$(".service-card").on("click", function() {
  if ($(this).hasClass("expanded")) {
  } else {
    $(this).addClass("expanded");
  }
  scroller.start()
});

var randomNumber = function randomNumber(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

var clamp = function clamp(num, min, max) {
  return num <= min ? min : num >= max ? max : num;
};

var map = function map(x, a, b, c, d) {
  return (x - a) * (d - c) / (b - a) + c;
};

const elems = [...document.querySelectorAll('.service-card-container')];
const initialTranslationArr = Array.from({ length: elems.length }, () => randomNumber(100, 100));
const translationArr = Array.from({ length: elems.length }, () => 0); // Elements start at their original position

scroller.on('scroll', (obj) => {
  for (const key of Object.keys(obj.currentElements)) {
    const el = obj.currentElements[key].el;
    const idx = elems.indexOf(el);
    if (obj.currentElements[key].el.classList.contains('service-card-container')) {
      let progress = obj.currentElements[key].progress;
      const translationVal = clamp(map(progress, 0, 0.5, initialTranslationArr[idx], translationArr[idx]), translationArr[idx], initialTranslationArr[idx]);
      obj.currentElements[key].el.style.transform = `translateY(${translationVal}%) `;
      obj.currentElements[key].el.style.transform = `opacity(${initialTranslationArr[idx]}) `;
    }
  }
});

// scroller.update();


/**
 * @license
 * Nombre: Rodolfo Torres
 * Email: rodolfo.torres@outlook.com
 * LinkedIn: https://www.linkedin.com/in/rodolfo-torres-p/?locale=es_ES
 *
 * Este código está bajo la Licencia Creative Commons Atribución 4.0 Internacional.
 * Puedes usar, compartir y adaptar libremente este código, siempre que proporciones
 * atribución al autor original, en este caso, Rodolfo Torres.
 */

let recognition; // Variable global para almacenar la instancia de reconocimientoç
let activeToast = null; // Almacena la instancia activa de la notificación toast para su gestión.
let lastWord = null; // Almacena la última palabra detectada por el reconocimiento de voz.

/**
 * Un objeto que mapea palabras clave a sus correspondientes acciones o funciones.
 * Cada entrada en el objeto tiene la forma:
 *   clave: [palabras, acción]
 */
const words = {
  banner: [["inicio"], redirect],
  nosotros: [["nosotros", "us", "quienes somos"], redirect],
  servicios: [
    [
      "servicio",
      "service",
      "services",
      "servicios",
      "soluciones",
    ],
    redirect,
  ],
  machine: [["machine"], redirect],
  deep: [["deep", "dip"], redirect],
  web: [["web", "diseño", "aplicaciones", "app"], redirect],
  software: [["desarrollo", "software"], redirect],
  hardware: [["hardware"], redirect],
  contacto: [["contacto", "contactar", "contactenos"], redirect],
  detener: [["detener", "tener", "finalizar", "apagar"], stopVoiceDetection],
};

/**
 * Redirige la página a la ubicación especificada por medio de una ancla en la URL.
 *
 * @param {string} path - El identificador de la sección a la que se desea redirigir.
 */

function redirect(path) {
  const target = document.querySelector("#" + path);
  scroller.scrollTo(target, -200);
}

/**
 * Encuentra la clave coincidente en el objeto de palabras para una palabra dada.
 *
 * @param {string} word - La palabra para la cual se busca una clave coincidente.
 * @returns {string|null} La clave correspondiente o null si no se encuentra ninguna coincidencia.
 */
function findMatchingKey(word) {
  for (const key in words) {
    if (words[key][0].includes(word)) {
      return key;
    }
  }
  return null;
}

/**
 * Convierte un texto a minúsculas y elimina los acentos diacríticos.
 *
 * @param {string} text - El texto a procesar.
 * @returns {string} El texto en minúsculas y sin acentos diacríticos.
 */
function convertToLowerCaseAndRemoveAccents(text) {
  return text
    .normalize("NFD") // Descomponer caracteres acentuados en forma de combinación de caracteres y diacríticos
    .replace(/[\u0300-\u036f]/g, "") // Quitar diacríticos
    .toLowerCase(); // Convertir a minúsculas
}

/**
 * Inicia el reconocimiento de voz continuo y configura los manejadores de eventos.
 * Si el navegador es compatible con el reconocimiento de voz, comienza el proceso.
 */
function initVoiceDetection() {
  // Verificamos si el navegador es compatible con el reconocimiento de voz
  if ("SpeechRecognition" in window || "webkitSpeechRecognition" in window) {
    recognition = new (window.SpeechRecognition ||
      window.webkitSpeechRecognition)();
    recognition.continuous = true; // Reconocimiento continuo
    recognition.interimResults = true; // Resultados provisionales
    recognition.lang = "es-ES";

    // Evento que se dispara cuando se detecta una nueva palabra
    recognition.onresult = (event) => {
      const results = event.results;
      const transcriptPhrases = results[results.length - 1][0].transcript;
      console.log("Frase, " + results[results.length - 1][0].transcript);
      console.log("Frase, " + transcriptPhrases);
      showMessage(transcriptPhrases);

      let transcript = results[results.length - 1][0].transcript
        .trim()
        .split(" ");

      transcript = transcript[transcript.length - 1];
      transcript = convertToLowerCaseAndRemoveAccents(transcript);
      const matchingKey = findMatchingKey(transcript);

      // Ejecutamos la función con la nueva palabra
      setTimeout(() => {
        if (matchingKey !== null && lastWord != matchingKey) {
          // showMessage(`${matchingKey}`, "ok");
          if (words[matchingKey] && words[matchingKey][1]) {
            words[matchingKey][1](matchingKey);
            
          }
          lastWord = matchingKey;
        } else{
          console.log('otras palabra')
          // showMessage(`Prueba con otras palabras como desarrollo web o contacto`, "ok");
        }
      }, 600)
    };

    // Comenzar el reconocimiento de voz
    lastWord = null;
    recognition.start();
    showMessage("Di qué estas buscando", "ok");

    // Evento de error
    recognition.onerror = (event) => {
      recognition = null;
      showMessage(`Error en el reconocimiento de voz: ${event.error}`, "error");
    };

    recognition.onend = (event) => {
      //   console.log('recognition',recognition);
      //   if (recognition) {
      //     initVoiceDetection();
      //   }
      recognition = null;
      $(".mic-fire").removeClass("active");
      showMessage("Dejare de escuchar, bye", "warning");
      
      stopVoiceDetection();
    };
  } else {
    recognition = null;

    showMessage(
      "El reconocimiento de voz no es compatible con este navegador.",
      "error"
    );
  }
}

/**
 * Detiene la detección de voz en curso, si está activa.
 */
function stopVoiceDetection() {
  if (recognition) {
    $(".mic-fire").removeClass("active");
    recognition.stop();
    recognition = null;
  }
}

/**
 * Muestra una notificación toast con contenido HTML y un ícono según el tipo.
 *
 * @param {string} text - El texto para mostrar en la notificación.
 * @param {string} type - El tipo de notificación ('alert', 'warning' o 'ok').
 */
function showMessage(text, type) {
  // Obtener el contenedor de las notificaciones toast
  const toastContainer = $(".toast-container");

  const toast = $("<div>", {
    class: "toast show clickable",
    role: "alert",
    "aria-live": "assertive",
    "aria-atomic": "true",
  });

  const existingToast = $(".toast");
  const bsToasts = [];

  // Ocultar la notificación toast activa, si existe
  if (activeToast) {
    activeToast.hide();
  }

  existingToast.each(function () {
    const bsToast = new bootstrap.Toast(this, {
      delay: 2500,
      animation: true,
      autohide: true,
    });

    bsToasts.push(bsToast);

    // Cerrar el toast cuando se hace clic en él
    $(this).on("click", function () {
      bsToast.hide();
    });

    bsToast.show();
  });

  if (existingToast.length > 0) {
    console.log("funciona");
    const toastBody = existingToast.find(".toast-body");
    toastBody.text(text);
  } else {
    const toastBody = $("<div>", {
      class: "toast-body",
      text: text,
    });

    toast.append(toastBody);
    toastContainer.append(toast);

    const bsToast = new bootstrap.Toast(toast[0], {
      delay: 2500,
      animation: true,
      autohide: true,
    });

    bsToast.show();

    toast.on("click", function () {
      bsToast.hide();
    });

    activeToast = bsToast;
  }
}


$(".mic-fire").on("click", function () {
  if ($(".mic-fire").hasClass("active")) {
    // recognition = null;
    console.log("stop");
    stopVoiceDetection();
    $(".mic-fire").removeClass("active");
  } else {
    console.log("play");
    $(".mic-fire").addClass("active");
    initVoiceDetection();
  }
});

// Agregar un manejador de clic para el botón Stop
// stopButton.on("click", function () {
//   console.log("stop");
//   $("#playButton").removeClass("active");
//   recognition = null;
//   // Aquí puedes agregar la lógica que quieras al hacer clic en Stop
//   stopVoiceDetection();
// });

// initVoiceDetection();
