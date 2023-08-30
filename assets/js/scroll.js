export const scroller = new LocomotiveScroll({
    el: document.querySelector("[data-scroll-container]"),
    smooth: true,
    direction: "horizontal",
    reloadOnContextChange: true,
    smartphone: { smooth: true, direction: "vertical" }, // Opcional
    tablet: { smooth: true, direction: "horizontal" }, // Opcional
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
  
  $(window).on('load resize', function(){
    var width = $(this).width();
    if (!scroller.init() && width >= 768) {
      scroller.init();
      scroller.update();
    } else if (!scroller.init() && width < 768) {
      scroller.init();
      scroller.update();
    }
  });
  
 
  
//   var randomNumber = function randomNumber(min, max) {
//     return Math.floor(Math.random() * (max - min + 1) + min);
//   };
  
//   var clamp = function clamp(num, min, max) {
//     return num <= min ? min : num >= max ? max : num;
//   };
  
//   var map = function map(x, a, b, c, d) {
//     return (x - a) * (d - c) / (b - a) + c;
//   };
  
//   const elems = [...document.querySelectorAll('.service-card-container')];
//   const initialTranslationArr = Array.from({ length: elems.length }, () => randomNumber(100, 100));
//   const translationArr = Array.from({ length: elems.length }, () => 0); // Elements start at their original position
  
//   scroller.on('scroll', (obj) => {
//     for (const key of Object.keys(obj.currentElements)) {
//       const el = obj.currentElements[key].el;
//       const idx = elems.indexOf(el);
//       if (obj.currentElements[key].el.classList.contains('service-card-container')) {
//         let progress = obj.currentElements[key].progress;
//         const translationVal = clamp(map(progress, 0, 0.5, initialTranslationArr[idx], translationArr[idx]), translationArr[idx], initialTranslationArr[idx]);
//         obj.currentElements[key].el.style.transform = `translateY(${translationVal}%) `;
//         obj.currentElements[key].el.style.transform = `opacity(${initialTranslationArr[idx]}) `;
//       }
//     }
//   });
  
  // scroller.update();
  