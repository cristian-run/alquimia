const scroller = new LocomotiveScroll({
  el: document.querySelector("[data-scroll-container]"),
  smooth: true,
  direction: "horizontal",
});


scroller.on('scroll', (instance) => {
  var windowWidth = ($(window).width() / 2) - 50;
  if (instance.scroll.x >= windowWidth) {
    $('.mic-sticky').addClass('show-mic');
    $('.mic').addClass('hide-mic');
  } else {
    $('.mic-sticky').removeClass('show-mic');
    $('.mic').removeClass('hide-mic');
  }
})

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
      "dip",
      "deep",
      "soluciones",
    ],
    redirect,
  ],
  hardware: [["hardware"], redirect],
  contacto: [["contacto", "contactar", "contactenos"], redirect],
  detener: [["detener", "tener", "finalizar"], stopVoiceDetection],
};

/**
 * Redirige la página a la ubicación especificada por medio de una ancla en la URL.
 *
 * @param {string} path - El identificador de la sección a la que se desea redirigir.
 */

function redirect(path) {
  const target = document.querySelector("#" + path);
  scroller.scrollTo(target);
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
    // Establecer el idioma deseado
    recognition.lang = "es-ES"; // Idioma español de España
    // Evento que se dispara cuando se detecta una nueva palabra
    recognition.onresult = (event) => {
      const results = event.results;
      let transcript = results[results.length - 1][0].transcript
        .trim()
        .split(" ");
      transcript = transcript[transcript.length - 1];
      transcript = convertToLowerCaseAndRemoveAccents(transcript);
      console.log(transcript);
      const matchingKey = findMatchingKey(transcript);

      // Ejecutamos la función con la nueva palabra
      if (matchingKey !== null && lastWord != matchingKey) {
        showMessage(`Comando detectado: ${matchingKey}`, "ok");
        if (words[matchingKey] && words[matchingKey][1]) {
          words[matchingKey][1](matchingKey);
        }

        lastWord = matchingKey;
      }
    };

    // Comenzar el reconocimiento de voz
    // showStopButton();
    lastWord = null;
    recognition.start();
    showMessage("Reconocimiento de voz iniciado", "ok");

    // Evento de error
    recognition.onerror = (event) => {
      recognition = null;
      showMessage(`Error en el reconocimiento de voz: ${event.error}`, "error");
      // showPlayButton();
    };

    recognition.onend = (event) => {
      //   console.log('recognition',recognition);
      //   if (recognition) {
      //     initVoiceDetection();
      //   }
      recognition = null;
      showMessage("Fin de reconocimiento de voz", "warning");
      stopVoiceDetection();
    };
  } else {
    recognition = null;
    showMessage(
      "El reconocimiento de voz no es compatible con este navegador.",
      "error"
    );
    // showPlayButton();
  }
}

/**
 * Detiene la detección de voz en curso, si está activa.
 */
function stopVoiceDetection() {
  if (recognition) {
    recognition.stop();
    $(".mic-fire").removeClass('active')
    recognition = null;
  }
}

/**
 * Muestra una notificación toast con contenido HTML y un ícono según el tipo.
 *
 * @param {string} htmlContent - El contenido HTML para mostrar en la notificación.
 * @param {string} type - El tipo de notificación ('alert', 'warning' o 'ok').
 */
function showMessage(text, type) {
  // Obtener el contenedor de las notificaciones toast
  const toastContainer = $("#toastContainer");

  // Ocultar la notificación toast activa, si existe
  if (activeToast) {
    activeToast.hide();
  }

  // Crear un elemento div para la notificación toast usando jQuery
  const toast = $("<div>", {
    class: "toast show clickable", // Clases para la notificación toast
    role: "alert",
    "aria-live": "assertive",
    "aria-atomic": "true",
  });

  // Crear un elemento i para el icono de FontAwesome usando jQuery
  const toastIcon = $("<i>", {
    class: `fas mr-2 ${
      type === "alert"
        ? "fa-exclamation-triangle text-danger"
        : type === "warning"
        ? "fa-exclamation-circle text-warning"
        : "fa-check-circle text-success"
    }`,
  });

  // Crear un elemento div para el cuerpo de la notificación toast usando jQuery
  const toastBody = $("<div>", {
    class: "toast-body",
    text: text, // Establecer el texto de la notificación
  });

  // Agregar el icono al inicio del cuerpo de la notificación
  toastBody.prepend(toastIcon);

  // Agregar el cuerpo de la notificación al elemento de la notificación
  toast.append(toastBody);

  // Agregar la notificación al contenedor de las notificaciones
  toastContainer.append(toast);

  // Crear una instancia de bootstrap.Toast para la notificación toast
  const bsToast = new bootstrap.Toast(toast[0], {
    delay: 2000, // Establecer la duración en milisegundos
    animation: true,
    autohide: true,
  });

  // Mostrar la notificación toast
  bsToast.show();

  // Cerrar el toast cuando se hace clic en él
  toast.on("click", function () {
    bsToast.hide();
  });

  // Almacenar la instancia de la notificación toast activa
  activeToast = bsToast;
}

$(".mic-fire").on("click", function () {
  if ($('.mic-fire').hasClass("active")) {
    // recognition = null;
    console.log("stop");
    stopVoiceDetection();
    $('.mic-fire').removeClass("active");
  } else {
    console.log("play");
    $('.mic-fire').addClass("active");
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
