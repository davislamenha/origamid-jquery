//Lodash debounce function
debounce = function (func, wait, immediate) {
  let timeout;
  return function () {
    let context = this,
      args = arguments;
    let later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    let callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
};

//Change tab on click and Active tab link
$('section ul a').on('click', (e) => {
  const { target } = e;
  e.preventDefault();
  const classActive = 'active';

  if (!$(target).hasClass(classActive)) {
    const elementClass = `.${target.innerHTML.toLowerCase()}`;
    const sectionId = $(target).parents('section').attr('id');

    $(
      `#${sectionId} ul li a, #${sectionId} .${sectionId}-container`,
    ).removeClass(classActive);
    $(elementClass).addClass(classActive);
  }
});

//Smooth scroll on menu links
$('header a').on('click', (e) => {
  e.preventDefault();
  const { target } = e;
  const headerHeight = $('header').height();
  const scrollTarget = $(target).attr('data-scroll');
  const targetOffsetTop =
    $(`#${scrollTarget}`).offset().top - headerHeight + 20;
  $('html, body').animate({ scrollTop: targetOffsetTop }, 800);
});

// Get information about each section
$('section').each(function () {
  const height = $(this).height();
  const menuHeight = $('header').height();
  const slideHeight = $('.slide-container img').height();
  const offsetTop = $(this).offset().top + slideHeight;
  const id = $(this).attr('id');
  const $menuLink = $(`a[href="#${id}"]`);

  $(window).on(
    'scroll',
    debounce(function () {
      const scrollTop = $(window).scrollTop();

      //Verifies if the section are visible on screen based on scroll position
      if (
        offsetTop - menuHeight < scrollTop &&
        offsetTop + height > scrollTop
      ) {
        $('.menu-list a').removeClass('active');
        $menuLink.addClass('active');
        // Remove all active links when there's no section on screen
      } else if (scrollTop < slideHeight) {
        $('.menu-list a').removeClass('active');
      }
      tabAnimation();
    }, 200),
  );
});

// Animate when tab is visible on screen
function tabAnimation() {
  const offset = $(window).height() * (3 / 4);
  const scrollTop = $(window).scrollTop();

  $('[data-animation="scroll"]').each(function () {
    const itemTop = $(this).offset().top;

    if (scrollTop > itemTop - offset) $(this).addClass('active');
    else $(this).removeClass('active');
  });
}

// Menu mobile button and Blur background when menu is opened
$(window).on('click', ({ target }) => {
  if ($(target).data('menu') === 'mobile')
    $('.menu-mobile, .menu-list, body').toggleClass('active');
  else $('.menu-mobile, .menu-list, body').removeClass('active');
});

// Call function that changes
(function () {
  function slider(sliderClass, speed) {
    const activeClass = 'active';
    let change = setInterval(changeSlide, speed);
    const firstSlide = $(`${sliderClass}`).first();
    firstSlide.addClass(activeClass);

    // Pauses image on mouse over and start when mouse leaves
    $(sliderClass)
      .on('mouseenter', () => clearInterval(change))
      .on('mouseleave', () => (change = setInterval(changeSlide, speed)));

    // Changes img to next and when there`s no next, back to first img.
    function changeSlide() {
      const activeSlide = $(`${sliderClass}.${activeClass}`);
      const nextSlide = $(`${sliderClass}.${activeClass}`).next();

      activeSlide.removeClass(activeClass);
      if (nextSlide.length === 0) {
        firstSlide.addClass(activeClass);
      }
      nextSlide.addClass(activeClass);
    }
  }

  // Calling slider change function
  slider('.slide-container', 3000);
})();
