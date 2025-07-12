// Animation and Transition Utilities

document.addEventListener('DOMContentLoaded', function() {
  // Initialize animations
  initAnimations();
  
  // Initialize scroll animations
  initScrollAnimations();
  
  // Initialize hover effects
  initHoverEffects();
  
  // Initialize counters
  initCounters();
  
  // Initialize charts (if any)
  initCharts();
});

// Initialize animations for elements that should animate on page load
function initAnimations() {
  // Animate header elements
  animateWithDelay('.header-animate', 'animate-fade-in', 100);
  
  // Animate hero section
  animateElement('.hero-title', 'animate-slide-bottom');
  animateElement('.hero-subtitle', 'animate-slide-bottom delay-200');
  animateElement('.hero-cta', 'animate-slide-bottom delay-400');
  animateElement('.hero-image', 'animate-slide-left delay-300');
  
  // Animate cards
  animateWithDelay('.card-animate', 'animate-scale-in', 100);
  
  // Animate features
  animateWithDelay('.feature-animate', 'animate-slide-bottom', 150);
  
  // Animate statistics
  animateWithDelay('.stat-animate', 'animate-slide-bottom', 100);
}

// Initialize scroll animations
function initScrollAnimations() {
  // Get all elements that should animate on scroll
  const elements = document.querySelectorAll('.scroll-animate');
  
  // Create an Intersection Observer
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        // Add the animation class when element is visible
        const animationClass = entry.target.dataset.animation || 'animate-fade-in';
        entry.target.classList.add(animationClass);
        
        // Unobserve after animation is added
        observer.unobserve(entry.target);
      }
    });
  }, {
    threshold: 0.1, // Trigger when at least 10% of the element is visible
    rootMargin: '0px 0px -50px 0px' // Adjust the trigger point
  });
  
  // Observe each element
  elements.forEach(element => {
    observer.observe(element);
  });
}

// Initialize hover effects
function initHoverEffects() {
  // Add hover effects to cards
  document.querySelectorAll('.card-hover').forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.classList.add('hover-lift');
    });
    
    card.addEventListener('mouseleave', function() {
      this.classList.remove('hover-lift');
    });
  });
  
  // Add hover effects to buttons
  document.querySelectorAll('.btn-hover').forEach(button => {
    button.addEventListener('mouseenter', function() {
      this.classList.add('hover-scale');
    });
    
    button.addEventListener('mouseleave', function() {
      this.classList.remove('hover-scale');
    });
  });
}

// Initialize counters for statistics
function initCounters() {
  const counters = document.querySelectorAll('.counter');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const counter = entry.target;
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = parseInt(counter.getAttribute('data-duration') || '2000');
        const increment = target / (duration / 16); // 60fps
        
        let current = 0;
        
        const updateCounter = () => {
          current += increment;
          
          if (current < target) {
            counter.textContent = Math.ceil(current).toLocaleString();
            requestAnimationFrame(updateCounter);
          } else {
            counter.textContent = target.toLocaleString();
          }
        };
        
        updateCounter();
        observer.unobserve(counter);
      }
    });
  }, {
    threshold: 0.5
  });
  
  counters.forEach(counter => {
    observer.observe(counter);
  });
}

// Initialize charts
function initCharts() {
  // This is a placeholder for chart initialization
  // You would use a library like Chart.js here
  
  // Example:
  // const ctx = document.getElementById('myChart').getContext('2d');
  // const myChart = new Chart(ctx, { ... });
}

// Helper function to animate elements with delay
function animateWithDelay(selector, animationClass, delayIncrement) {
  const elements = document.querySelectorAll(selector);
  
  elements.forEach((element, index) => {
    setTimeout(() => {
      element.classList.add(animationClass);
    }, index * delayIncrement);
  });
}

// Helper function to animate a single element
function animateElement(selector, animationClass) {
  const element = document.querySelector(selector);
  if (element) {
    element.classList.add(animationClass);
  }
}

// Progress bar animation
function animateProgressBars() {
  document.querySelectorAll('.progress-bar').forEach(bar => {
    const percentage = bar.getAttribute('data-percentage');
    bar.style.width = percentage + '%';
  });
}

// Notification system
function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification-${type}`;
  notification.textContent = message;
  
  document.body.appendChild(notification);
  
  // Remove notification after animation completes
  setTimeout(() => {
    notification.remove();
  }, 5000);
}

// Typing animation
function typeText(element, text, speed = 50) {
  let i = 0;
  element.textContent = '';
  
  function typing() {
    if (i < text.length) {
      element.textContent += text.charAt(i);
      i++;
      setTimeout(typing, speed);
    }
  }
  
  typing();
}

// Add ripple effect to buttons
function addRippleEffect() {
  document.querySelectorAll('.btn-ripple').forEach(button => {
    button.addEventListener('click', function(e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Parallax effect
function initParallax() {
  window.addEventListener('scroll', function() {
    const parallaxElements = document.querySelectorAll('.parallax');
    
    parallaxElements.forEach(element => {
      const speed = element.getAttribute('data-speed') || 0.5;
      const yPos = -(window.scrollY * speed);
      element.style.transform = `translateY(${yPos}px)`;
    });
  });
}

// Animate on scroll
window.addEventListener('scroll', function() {
  // Animate elements when they come into view
  document.querySelectorAll('.animate-on-scroll:not(.animated)').forEach(element => {
    const elementTop = element.getBoundingClientRect().top;
    const elementVisible = 150;
    
    if (elementTop < window.innerHeight - elementVisible) {
      const animation = element.getAttribute('data-animation') || 'animate-fade-in';
      element.classList.add(animation, 'animated');
    }
  });
});
