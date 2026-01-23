(function() {
  'use strict';

  let testimonials = [];
  let currentIndex = 0;
  let previousIndex = 0;
  let touchStartX = 0;
  let touchEndX = 0;
  let direction = 'next';

  // DOM elements
  let carousel, slidesContainer, navContainer, prevBtn, nextBtn, counterEl;

  // Parse frontmatter from markdown content
  function parseFrontmatter(content) {
    const match = content.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
    if (!match) return null;

    const frontmatter = {};
    match[1].split('\n').forEach(line => {
      const colonIndex = line.indexOf(':');
      if (colonIndex > 0) {
        const key = line.slice(0, colonIndex).trim();
        const value = line.slice(colonIndex + 1).trim();
        frontmatter[key] = value;
      }
    });

    // Convert blank lines to <br><br> for HTML display
    const quote = match[2].trim().replace(/\n\n/g, '<br><br>');

    return { ...frontmatter, quote };
  }

  // Initialize carousel
  async function init() {
    carousel = document.querySelector('.testimonial-carousel');
    if (!carousel) return;

    slidesContainer = carousel.querySelector('.carousel-slides');

    await loadTestimonials();
    renderSlides();
    setCarouselHeight();
    renderNav();
    bindEvents();
    showSlide(0);
    setupReadMore();

    window.addEventListener('resize', setCarouselHeight);
  }

  // Load testimonials from markdown files
  async function loadTestimonials() {
    try {
      const orderResponse = await fetch('./data/testimonial-order.json');
      const order = await orderResponse.json();

      const loadedTestimonials = await Promise.all(
        order.map(async (id) => {
          const response = await fetch(`./content/testimonials/${id}.md`);
          const content = await response.text();
          return parseFrontmatter(content);
        })
      );

      testimonials = loadedTestimonials.filter(t => t !== null);
    } catch (error) {
      console.error('Failed to load testimonials:', error);
    }
  }

  // Render slide HTML
  function renderSlides() {
    slidesContainer.innerHTML = testimonials.map((t, index) => `
      <div class="carousel-slide" data-index="${index}">
        <div class="carousel-slide-inner">
          <div class="carousel-header">
            <img src="./assets/images/${t.headshotImage}" alt="${t.name}" class="carousel-photo">
            <div class="carousel-person">
              <a href="${t.linkedinUrl}" target="_blank" class="carousel-name">${t.name}</a>
              <span class="carousel-title">${t.title}, <a href="${t.companyUrl}" target="_blank">${t.company}</a></span>
            </div>
          </div>
          <div class="carousel-quote-wrapper">
            <div class="carousel-quote">"${t.quote}"</div>
            <button class="carousel-read-more" aria-expanded="false">Read more</button>
          </div>
        </div>
      </div>
    `).join('');
  }

  // Set carousel height based on tallest slide (desktop only)
  function setCarouselHeight() {
    // On mobile, let CSS handle height (allows read more expansion)
    if (window.innerWidth <= 768) {
      slidesContainer.style.height = '';
      return;
    }

    const slides = slidesContainer.querySelectorAll('.carousel-slide');
    let maxHeight = 0;

    // Temporarily make all slides visible to measure
    slides.forEach(slide => {
      slide.style.position = 'relative';
      slide.style.visibility = 'hidden';
      slide.style.opacity = '1';
      const height = slide.offsetHeight;
      if (height > maxHeight) maxHeight = height;
    });

    // Reset styles
    slides.forEach(slide => {
      slide.style.position = '';
      slide.style.visibility = '';
      slide.style.opacity = '';
    });

    slidesContainer.style.height = maxHeight + 'px';
  }

  // Render navigation with arrows and counter
  function renderNav() {
    navContainer = document.createElement('div');
    navContainer.className = 'carousel-nav';
    navContainer.innerHTML = `
      <button class="carousel-arrow prev" aria-label="Previous testimonial">
        <svg viewBox="0 0 24 24"><polyline points="15 18 9 12 15 6"></polyline></svg>
      </button>
      <span class="carousel-counter">1 / ${testimonials.length}</span>
      <button class="carousel-arrow next" aria-label="Next testimonial">
        <svg viewBox="0 0 24 24"><polyline points="9 6 15 12 9 18"></polyline></svg>
      </button>
    `;
    carousel.appendChild(navContainer);

    prevBtn = navContainer.querySelector('.carousel-arrow.prev');
    nextBtn = navContainer.querySelector('.carousel-arrow.next');
    counterEl = navContainer.querySelector('.carousel-counter');
  }

  // Setup read more functionality
  function setupReadMore() {
    const checkOverflow = () => {
      const isMobile = window.innerWidth <= 768;
      document.querySelectorAll('.carousel-quote-wrapper').forEach(wrapper => {
        const quote = wrapper.querySelector('.carousel-quote');
        const btn = wrapper.querySelector('.carousel-read-more');
        const isExpanded = wrapper.classList.contains('expanded');

        if (isMobile && !isExpanded) {
          // Check if content overflows
          const isOverflowing = quote.scrollHeight > quote.clientHeight;
          btn.style.display = isOverflowing ? 'block' : 'none';
        } else if (!isMobile) {
          btn.style.display = 'none';
          wrapper.classList.remove('expanded');
        }
      });
    };

    // Handle read more clicks
    slidesContainer.addEventListener('click', (e) => {
      if (e.target.classList.contains('carousel-read-more')) {
        const wrapper = e.target.closest('.carousel-quote-wrapper');
        const isExpanded = wrapper.classList.contains('expanded');
        wrapper.classList.toggle('expanded');
        e.target.textContent = isExpanded ? 'Read more' : 'Show less';
        e.target.setAttribute('aria-expanded', !isExpanded);
      }
    });

    // Check on load and resize
    checkOverflow();
    window.addEventListener('resize', checkOverflow);
  }

  // Show specific slide with animation direction
  function showSlide(index) {
    previousIndex = currentIndex;

    if (index < 0) index = testimonials.length - 1;
    if (index >= testimonials.length) index = 0;
    currentIndex = index;

    // Determine direction for animation
    const slides = slidesContainer.querySelectorAll('.carousel-slide');

    slides.forEach((slide, i) => {
      slide.classList.remove('active', 'exit-left', 'exit-right', 'enter-left', 'enter-right');

      // Reset any expanded quotes when changing slides
      const wrapper = slide.querySelector('.carousel-quote-wrapper');
      if (wrapper) {
        wrapper.classList.remove('expanded');
        const btn = wrapper.querySelector('.carousel-read-more');
        if (btn) btn.textContent = 'Read more';
      }

      if (i === currentIndex) {
        slide.classList.add('active', direction === 'next' ? 'enter-right' : 'enter-left');
      } else if (i === previousIndex) {
        slide.classList.add(direction === 'next' ? 'exit-left' : 'exit-right');
      }
    });

    // Update counter
    if (counterEl) {
      counterEl.textContent = `${currentIndex + 1} / ${testimonials.length}`;
    }

    // Re-check read more visibility for new slide
    setTimeout(() => {
      const activeSlide = slides[currentIndex];
      if (activeSlide) {
        const wrapper = activeSlide.querySelector('.carousel-quote-wrapper');
        const quote = activeSlide.querySelector('.carousel-quote');
        const btn = activeSlide.querySelector('.carousel-read-more');
        if (wrapper && quote && btn && window.innerWidth <= 768) {
          const isOverflowing = quote.scrollHeight > quote.clientHeight;
          btn.style.display = isOverflowing ? 'block' : 'none';
        }
      }
    }, 50);
  }

  // Navigation functions
  function nextSlide() {
    direction = 'next';
    showSlide(currentIndex + 1);
  }

  function prevSlide() {
    direction = 'prev';
    showSlide(currentIndex - 1);
  }

  // Handle swipe gestures
  function handleTouchStart(e) {
    touchStartX = e.changedTouches[0].screenX;
  }

  function handleTouchEnd(e) {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
  }

  function handleSwipe() {
    const swipeThreshold = 50;
    const diff = touchStartX - touchEndX;

    if (Math.abs(diff) > swipeThreshold) {
      if (diff > 0) {
        nextSlide();
      } else {
        prevSlide();
      }
    }
  }

  // Handle keyboard navigation
  function handleKeydown(e) {
    if (!carousel.contains(document.activeElement) && document.activeElement !== carousel) return;

    if (e.key === 'ArrowLeft') {
      prevSlide();
      e.preventDefault();
    } else if (e.key === 'ArrowRight') {
      nextSlide();
      e.preventDefault();
    }
  }

  // Bind all events
  function bindEvents() {
    // Arrow buttons
    prevBtn.addEventListener('click', prevSlide);
    nextBtn.addEventListener('click', nextSlide);

    // Touch/swipe events
    carousel.addEventListener('touchstart', handleTouchStart, { passive: true });
    carousel.addEventListener('touchend', handleTouchEnd, { passive: true });

    // Keyboard navigation
    carousel.setAttribute('tabindex', '0');
    carousel.addEventListener('keydown', handleKeydown);

    // Make carousel focusable for keyboard nav
    carousel.addEventListener('focus', () => {
      carousel.classList.add('focused');
    });

    carousel.addEventListener('blur', () => {
      carousel.classList.remove('focused');
    });
  }

  // Initialize when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
