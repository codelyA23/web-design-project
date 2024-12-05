document.addEventListener("DOMContentLoaded", () => {
  const menuIcon = document.getElementById("menu-icon");
  const navbar = document.querySelector(".navbar");
  const navLinks = document.querySelectorAll(".navbar a");
  const searchInput = document.getElementById("search-input");
  const searchBtn = document.querySelector(".search-btn");
  const categoryBtns = document.querySelectorAll(".category-btn");
  const resourceItems = document.querySelectorAll(".resource-item");

  // Menu toggle
  menuIcon.addEventListener("click", () => {
    menuIcon.classList.toggle("bx-x");
    navbar.classList.toggle("active");
  });

  // Close navbar when clicking a link
  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      menuIcon.classList.remove("bx-x");
      navbar.classList.remove("active");
    });
  });

  // Filter resources by category
  function filterResources(category) {
    resourceItems.forEach((item) => {
      const itemCategory = item.getAttribute("data-category");
      item.style.display = category === "all" || itemCategory === category ? "block" : "none";
    });
  }

  // Search resources by text
  function searchResources() {
    const searchText = searchInput.value.toLowerCase();
    resourceItems.forEach((item) => {
      const title = item.querySelector("h4").textContent.toLowerCase();
      const description = item.querySelector("p").textContent.toLowerCase();
      item.style.display = title.includes(searchText) || description.includes(searchText) ? "block" : "none";
    });
  }

  // Category and search event listeners
  categoryBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      categoryBtns.forEach((button) => button.classList.remove("active"));
      btn.classList.add("active");
      filterResources(btn.getAttribute("data-category"));
    });
  });
  searchBtn.addEventListener("click", searchResources);
  searchInput.addEventListener("keypress", (event) => {
    if (event.key === "Enter") searchResources();
  });

  // Carousel functionality
  const carousel = document.querySelector(".testimonial-carousel");
  const container = document.querySelector(".carousel-container");
  const testimonials = document.querySelectorAll(".testimonial");
  const prevBtn = document.querySelector(".prev");
  const nextBtn = document.querySelector(".next");
  let currentIndex = 0;
  let autoScrollInterval;

  // Clone first and last slides for infinite loop
  const firstClone = testimonials[0].cloneNode(true);
  const lastClone = testimonials[testimonials.length - 1].cloneNode(true);
  container.appendChild(firstClone);
  container.insertBefore(lastClone, testimonials[0]);

  function updateCarousel(smooth = true) {
    const slideWidth = testimonials[0].offsetWidth;
    const gap = 32; // 2rem gap
    const offset = (carousel.offsetWidth - slideWidth) / 2;
    
    container.style.transition = smooth ? 'transform 0.5s ease-in-out' : 'none';
    container.style.transform = `translateX(${-currentIndex * (slideWidth + gap) + offset}px)`;

    // Update active states
    const allSlides = container.querySelectorAll('.testimonial');
    allSlides.forEach((slide, index) => {
      slide.classList.remove('active');
      if (index === currentIndex + 1) { // +1 because of the cloned slide
        slide.classList.add('active');
      }
    });
  }

  function handleTransitionEnd() {
    const slides = container.querySelectorAll('.testimonial');
    if (currentIndex === -1) {
      currentIndex = slides.length - 3; // Go to last real slide
      updateCarousel(false);
    } else if (currentIndex === slides.length - 2) {
      currentIndex = 0; // Go to first real slide
      updateCarousel(false);
    }
  }

  function moveSlide(direction) {
    currentIndex += direction;
    updateCarousel();
  }

  function startAutoScroll() {
    stopAutoScroll();
    autoScrollInterval = setInterval(() => moveSlide(1), 10000);
  }

  function stopAutoScroll() {
    if (autoScrollInterval) {
      clearInterval(autoScrollInterval);
      autoScrollInterval = null;
    }
  }

  // Event Listeners
  container.addEventListener('transitionend', handleTransitionEnd);

  prevBtn.addEventListener("click", () => {
    moveSlide(-1);
    stopAutoScroll();
    startAutoScroll();
  });

  nextBtn.addEventListener("click", () => {
    moveSlide(1);
    stopAutoScroll();
    startAutoScroll();
  });

  carousel.addEventListener("mouseenter", stopAutoScroll);
  carousel.addEventListener("mouseleave", startAutoScroll);

  // Handle window resize
  let resizeTimeout;
  window.addEventListener("resize", () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => updateCarousel(false), 100);
  });

  // Initialize
  updateCarousel(false);
  startAutoScroll();
});
