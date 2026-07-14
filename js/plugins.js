const $ = window.jQuery;

export function initPlugins() {
  if (window.AOS) {
    window.AOS.init({ duration: 750, once: true, offset: 80 });
  }

  initProgramCarousel();
}

function initProgramCarousel() {
  const $programSlider = $('.program-slider');
  const $programCurrent = $('#programCurrent');

  if (!$programSlider.length || typeof $.fn.slick !== 'function') return;

  $programSlider.on('init afterChange', function (_event, _slick, currentSlide) {
    const activeSlide = typeof currentSlide === 'number' ? currentSlide : 0;
    $programCurrent.text(String(activeSlide + 1).padStart(2, '0'));
  });

  $programSlider.slick({
    slidesToShow: 3,
    slidesToScroll: 1,
    arrows: true,
    prevArrow: $('.program-prev'),
    nextArrow: $('.program-next'),
    dots: false,
    infinite: true,
    autoplay: true,
    autoplaySpeed: 4500,
    pauseOnHover: true,
    pauseOnFocus: true,
    adaptiveHeight: false,
    responsive: [
      { breakpoint: 992, settings: { slidesToShow: 2 } },
      { breakpoint: 576, settings: { slidesToShow: 1.1 } }
    ]
  });
}

