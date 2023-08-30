$(".arrow").on("click", function(e) {
    e.stopPropagation();
    $(this).parent().removeClass("expanded");
});

$(".service-card").on("click", function() {
    if ($(this).hasClass("expanded")) {
    } else {
      $(this).addClass("expanded");
    }
  });

// Initialize Locomotive Scroll (horizontal direction)

// Preload images and fonts
// Promise.all([preloadImages('.gallery__item-imginner'), preloadFonts('vxy2fer')]).then(() => {
//     // Remove loader (loading class)
//     document.body.classList.remove('loading');

//     // Initialize custom cursor
//     const cursor = new Cursor(document.querySelector('.cursor'));

//     // Mouse effects on all links and others
//     [...document.querySelectorAll('a')].forEach(link => {
//         link.addEventListener('mouseenter', () => cursor.enter());
//         link.addEventListener('mouseleave', () => cursor.leave());
//     });
// });
