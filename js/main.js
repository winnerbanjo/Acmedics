document.addEventListener('DOMContentLoaded', () => {
  // ==========================================
  // 1. PAGE PRELOADER FADE-OUT
  // ==========================================
  const preloader = document.getElementById('preloader');
  
  const fadeOutPreloader = () => {
    if (preloader && !preloader.classList.contains('fade-out')) {
      preloader.classList.add('fade-out');
    }
  };
  
  // Fade out once window assets are fully loaded
  window.addEventListener('load', () => {
    setTimeout(fadeOutPreloader, 600); // short delay for visual loading bar effect
  });
  
  // Backup timeout: guarantee page loading in max 1.5s
  setTimeout(fadeOutPreloader, 1500);

  // ==========================================
  // 2. STICKY GLASS HEADER & SCROLL BEHAVIOR
  // ==========================================
  const header = document.querySelector('header');
  const mobileStickyBar = document.querySelector('.mobile-sticky-bar');
  const heroSection = document.getElementById('home') || document.querySelector('.page-hero');
  
  const handleScroll = () => {
    if (window.scrollY > 50) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
    
    if (heroSection) {
      const heroHeight = heroSection.offsetHeight;
      if (window.scrollY > heroHeight - 100) {
        mobileStickyBar?.classList.add('visible');
      } else {
        mobileStickyBar?.classList.remove('visible');
      }
    }
  };
  
  window.addEventListener('scroll', handleScroll);
  handleScroll();

  // ==========================================
  // 3. ACTIVE NAVIGATION PAGE TRACKING
  // ==========================================
  const currentPath = window.location.pathname;
  const navLinks = document.querySelectorAll('.nav-link');
  
  navLinks.forEach(link => {
    const href = link.getAttribute('href');
    if (href && !href.startsWith('#')) {
      if (currentPath.includes(href)) {
        link.classList.add('active-page');
      }
    }
  });

  // ==========================================
  // 4. MOBILE MENU DRAWER TOGGLE
  // ==========================================
  const navToggle = document.querySelector('.nav-toggle');
  const navMenu = document.querySelector('.nav-menu');
  const linksClose = document.querySelectorAll('.nav-link, .nav-menu .btn');
  
  const toggleMenu = () => {
    navToggle.classList.toggle('active');
    navMenu.classList.toggle('active');
    document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : 'visible';
  };
  
  navToggle?.addEventListener('click', toggleMenu);
  
  linksClose.forEach(link => {
    link.addEventListener('click', () => {
      if (navMenu.classList.contains('active')) {
        toggleMenu();
      }
    });
  });

  // ==========================================
  // 5. STATS COUNTER UP ANIMATION
  // ==========================================
  const statsElements = document.querySelectorAll('.stat-item h4');
  
  const animateCounter = (el) => {
    const rawVal = el.textContent.trim();
    const target = parseInt(rawVal, 10);
    if (isNaN(target)) return;
    
    const suffix = rawVal.replace(/[0-9]/g, '');
    let count = 0;
    const duration = 1200; // ms
    const frameRate = 1000 / 60; // 60 FPS
    const totalFrames = Math.round(duration / frameRate);
    const step = target / totalFrames;
    
    let frame = 0;
    const counterLoop = () => {
      frame++;
      count += step;
      if (frame < totalFrames) {
        el.textContent = Math.floor(count) + suffix;
        requestAnimationFrame(counterLoop);
      } else {
        el.textContent = target + suffix;
      }
    };
    counterLoop();
  };

  if (statsElements.length > 0 && 'IntersectionObserver' in window) {
    const statsObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.5 });
    
    statsElements.forEach(el => statsObserver.observe(el));
  }

  // ==========================================
  // 6. INTERACTIVE 3D CARD TILT EFFECT (Desktop Only)
  // ==========================================
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  
  if (!isMobile) {
    const tiltCards = document.querySelectorAll('.service-card, .shop-card, .benefit-card, .contact-card');
    
    tiltCards.forEach(card => {
      card.classList.add('tilt-card');
      
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = ((centerY - y) / centerY) * 8;
        const rotateY = ((x - centerX) / centerX) * 8;
        
        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateY(0)';
      });
    });
  }

  // ==========================================
  // 7. TESTIMONIAL CAROUSEL
  // ==========================================
  const track = document.querySelector('.carousel-track');
  const slides = Array.from(document.querySelectorAll('.carousel-slide'));
  const nextBtn = document.querySelector('.carousel-btn-next');
  const prevBtn = document.querySelector('.carousel-btn-prev');
  const dotsContainer = document.querySelector('.carousel-dots');
  
  if (slides.length > 0 && track) {
    let currentIndex = 0;
    
    slides.forEach((_, index) => {
      const dot = document.createElement('div');
      dot.classList.add('carousel-dot');
      if (index === 0) dot.classList.add('active');
      dot.setAttribute('data-index', index);
      dotsContainer?.appendChild(dot);
    });
    
    const dots = Array.from(document.querySelectorAll('.carousel-dot'));
    
    const updateCarousel = (index) => {
      track.style.transform = `translateX(-${index * 100}%)`;
      dots.forEach(d => d.classList.remove('active'));
      if (dots[index]) dots[index].classList.add('active');
      currentIndex = index;
    };
    
    nextBtn?.addEventListener('click', () => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= slides.length) nextIndex = 0;
      updateCarousel(nextIndex);
    });
    
    prevBtn?.addEventListener('click', () => {
      let prevIndex = currentIndex - 1;
      if (prevIndex < 0) prevIndex = slides.length - 1;
      updateCarousel(prevIndex);
    });
    
    dots.forEach(dot => {
      dot.addEventListener('click', (e) => {
        const targetIndex = parseInt(e.target.getAttribute('data-index'), 10);
        updateCarousel(targetIndex);
      });
    });
    
    let autoPlayInterval = setInterval(() => {
      let nextIndex = currentIndex + 1;
      if (nextIndex >= slides.length) nextIndex = 0;
      updateCarousel(nextIndex);
    }, 7000);
    
    const resetAutoPlay = () => {
      clearInterval(autoPlayInterval);
      autoPlayInterval = setInterval(() => {
        let nextIndex = currentIndex + 1;
        if (nextIndex >= slides.length) nextIndex = 0;
        updateCarousel(nextIndex);
      }, 7000);
    };
    
    nextBtn?.addEventListener('click', resetAutoPlay);
    prevBtn?.addEventListener('click', resetAutoPlay);
    dotsContainer?.addEventListener('click', resetAutoPlay);

    // Swipe support
    let startX = 0;
    let endX = 0;
    
    track.addEventListener('touchstart', (e) => {
      startX = e.touches[0].clientX;
    }, { passive: true });
    
    track.addEventListener('touchend', (e) => {
      endX = e.changedTouches[0].clientX;
      const difference = startX - endX;
      
      if (Math.abs(difference) > 50) {
        if (difference > 0) {
          let nextIndex = currentIndex + 1;
          if (nextIndex >= slides.length) nextIndex = 0;
          updateCarousel(nextIndex);
        } else {
          let prevIndex = currentIndex - 1;
          if (prevIndex < 0) prevIndex = slides.length - 1;
          updateCarousel(prevIndex);
        }
        resetAutoPlay();
      }
    }, { passive: true });
  }

  // ==========================================
  // 8. ACCORDION FAQ
  // ==========================================
  const faqItems = document.querySelectorAll('.faq-item');
  
  faqItems.forEach(item => {
    const header = item.querySelector('.faq-header');
    const content = item.querySelector('.faq-content');
    
    header.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-content').style.maxHeight = null;
      });
      
      if (!isActive) {
        item.classList.add('active');
        content.style.maxHeight = content.scrollHeight + 'px';
      }
    });
  });

  // ==========================================
  // 9. SCROLL REVEAL OBSERVER
  // ==========================================
  const revealElements = document.querySelectorAll('.reveal');
  
  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('active');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.15,
      rootMargin: '0px 0px -50px 0px'
    });
    
    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('active'));
  }

  // ==========================================
  // 10. RESOURCE SHOP FILTER CONTROLLER
  // ==========================================
  const filterBtns = document.querySelectorAll('.shop-filter-btn');
  const shopCards = document.querySelectorAll('.shop-card');
  
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      
      const filterValue = btn.getAttribute('data-filter');
      
      shopCards.forEach(card => {
        if (filterValue === 'all') {
          card.style.display = 'flex';
          setTimeout(() => card.style.opacity = '1', 50);
        } else {
          const category = card.getAttribute('data-category');
          if (category === filterValue) {
            card.style.display = 'flex';
            setTimeout(() => card.style.opacity = '1', 50);
          } else {
            card.style.opacity = '0';
            setTimeout(() => card.style.display = 'none', 300);
          }
        }
      });
    });
  });

  // ==========================================
  // 11. MULTI-STEP BOOKING SCHEDULER
  // ==========================================
  const bookingForm = document.getElementById('assessmentScheduler');
  const steps = Array.from(document.querySelectorAll('.booking-form-step'));
  const stepIndicators = Array.from(document.querySelectorAll('.booking-step-indicator'));
  const nextBtns = document.querySelectorAll('.booking-next-btn');
  const prevBtns = document.querySelectorAll('.booking-prev-btn');
  
  if (bookingForm && steps.length > 0) {
    let currentStep = 0;
    
    const updateBookingStep = (targetStep) => {
      steps.forEach(s => s.classList.remove('active'));
      stepIndicators.forEach(ind => ind.classList.remove('active'));
      
      steps[targetStep].classList.add('active');
      stepIndicators[targetStep].classList.add('active');
      currentStep = targetStep;
    };
    
    nextBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const currentInputs = steps[currentStep].querySelectorAll('input, select, textarea');
        let isValid = true;
        
        currentInputs.forEach(input => {
          if (input.hasAttribute('required') && !input.value.trim()) {
            isValid = false;
            input.style.borderColor = 'red';
            setTimeout(() => input.style.borderColor = '', 2000);
          }
        });
        
        if (isValid) {
          updateBookingStep(currentStep + 1);
        }
      });
    });
    
    prevBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        updateBookingStep(currentStep - 1);
      });
    });
    
    bookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const parentName = document.getElementById('schedParentName').value;
      const childName = document.getElementById('schedChildName').value;
      const childAge = document.getElementById('schedChildAge').value;
      const serviceNeeded = document.getElementById('schedService').value;
      const date = document.getElementById('schedDate').value;
      const time = document.getElementById('schedTime').value;
      const details = document.getElementById('schedDetails').value;
      
      const whatsappBase = "https://wa.me/2348067616756";
      const text = `Hello Acmedics, I would like to schedule a Child Assessment.\n\n*Parent Name:* ${parentName}\n*Child Name:* ${childName}\n*Child Age:* ${childAge} years\n*Service:* ${serviceNeeded}\n*Preferred Date:* ${date}\n*Preferred Time:* ${time}\n*Details:* ${details}`;
      const encodedText = encodeURIComponent(text);
      const whatsappUrl = `${whatsappBase}?text=${encodedText}`;
      
      const submitBtn = bookingForm.querySelector('button[type="submit"]');
      submitBtn.disabled = true;
      submitBtn.innerText = 'Creating WhatsApp booking...';
      
      setTimeout(() => {
        window.open(whatsappUrl, '_blank');
        submitBtn.disabled = false;
        submitBtn.innerText = 'Confirm and Book via WhatsApp';
        bookingForm.reset();
        updateBookingStep(0);
      }, 800);
    });
  }

  // ==========================================
  // 12. GENERAL CONTACT FORM REDIRECT
  // ==========================================
  const contactForm = document.getElementById('consultationForm');
  contactForm?.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const name = document.getElementById('formName').value;
    const email = document.getElementById('formEmail').value;
    const phone = document.getElementById('formPhone').value;
    const concern = document.getElementById('formConcern').value;
    const message = document.getElementById('formMessage').value;
    
    const whatsappBase = "https://wa.me/2348067616756";
    const text = `Hello Acmedics, I would like to book a consultation.\n\n*Name:* ${name}\n*Email:* ${email}\n*Phone:* ${phone}\n*Concern:* ${concern}\n*Message:* ${message}`;
    const encodedText = encodeURIComponent(text);
    const whatsappUrl = `${whatsappBase}?text=${encodedText}`;
    
    const button = contactForm.querySelector('button[type="submit"]');
    button.disabled = true;
    button.innerHTML = 'Connecting...';
    
    setTimeout(() => {
      window.open(whatsappUrl, '_blank');
      button.disabled = false;
      button.innerHTML = 'Book Consultation via WhatsApp';
      contactForm.reset();
    }, 800);
  });
});
