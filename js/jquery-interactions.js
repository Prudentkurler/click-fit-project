const $ = window.jQuery;

export function initJqueryInteractions(){

  const $window = $(window);
  const $header = $('.site-header');
  const $backToTop = $('#backToTop');

    setTimeout(()=> {
        $('#pageLoader').addClass('is-hidden')},450);
    $('#currentYear').text(new Date().getFullYear());

    initAnchorNavigation();
    initScheduleFilters();
    initScrollState($window,$header, $backToTop);
    initRevealAnimations();
    
    
}





function initScheduleFilters() {
  $('#scheduleFilters').on('click', 'button', function () {
    const filter = $(this).data('filter');
    $(this).addClass('active').siblings().removeClass('active');

    $('.class-row').stop(true, true).each(function () {
      const matches = filter === 'all' || $(this).data('category') === filter;
      $(this)[matches ? 'slideDown' : 'slideUp'](260);
    });
  });
}

function initScrollState($window, $header, $backToTop) {
  let countersStarted = false;

  function updatePageState() {
    const top = $window.scrollTop();
    $header.toggleClass('scrolled', top > 40);
    $backToTop.toggleClass('visible', top > 650);

    const $stats = $('.stats-strip');
    if (!countersStarted && $stats.length && top + $window.height() > $stats.offset().top + 80) {
      countersStarted = true;
      $('.counter').each(function () {
        const $counter = $(this);
        $({ value: 0 }).animate({ value: Number($counter.data('count')) }, {
          duration: 1600,
          easing: 'swing',
          step: function () {
            $counter.text(Math.ceil(this.value));
          }
        });
      });
    }
  }

  $window.on('scroll', updatePageState);
  updatePageState();
}

function initRevealAnimations() {
  $('.reveal-up').each(function (index) {
    $(this)
      .css({ opacity: 0, transform: 'translateY(35px)' })
      .delay(300 + (index * 130))
      .animate({ opacity: 1 }, 650, function () {
        $(this).css('transform', 'translateY(0)');
      });
  });
}

function initAnchorNavigation() {
  $('a[href^="#"]').on('click', function (event) {
    const target = $($(this).attr('href'));
    if (!target.length) return;

    event.preventDefault();
    $('html, body').animate({ scrollTop: target.offset().top - 70 }, 650);

    const nav = document.getElementById('mainNav');
    if (nav?.classList.contains('show')) {
      window.bootstrap?.Collapse.getOrCreateInstance(nav).hide();
    }
  });
}