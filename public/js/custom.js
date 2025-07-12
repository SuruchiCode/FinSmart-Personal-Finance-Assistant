// Custom JavaScript for FinSmart

document.addEventListener('DOMContentLoaded', function() {
  // Initialize animations
  initPageAnimations();
  
  // Initialize interactive elements
  initInteractiveElements();
  
  // Initialize form validations
  initFormValidations();
  
  // Initialize charts if any
  initCharts();
  
  // Remove page loader
  removePageLoader();
});

// Remove page loader
function removePageLoader() {
  const pageLoader = document.getElementById('page-loader');
  if (pageLoader) {
    setTimeout(() => {
      pageLoader.style.opacity = '0';
      setTimeout(() => {
        pageLoader.style.display = 'none';
      }, 500);
    }, 800);
  }
}

// Initialize page animations
function initPageAnimations() {
  // Animate navigation on scroll
  window.addEventListener('scroll', function() {
    const nav = document.querySelector('nav');
    const navBg = document.getElementById('nav-bg');
    
    if (window.scrollY > 10) {
      nav.classList.add('shadow-lg');
      if (navBg) navBg.classList.add('opacity-100');
      nav.classList.add('py-2');
      nav.classList.remove('py-4');
    } else {
      nav.classList.remove('shadow-lg');
      if (navBg) navBg.classList.remove('opacity-100');
      nav.classList.remove('py-2');
      nav.classList.add('py-4');
    }
  });
  
  // Animate elements on scroll
  const animateOnScrollElements = document.querySelectorAll('.animate-on-scroll');
  
  if (animateOnScrollElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const animation = entry.target.dataset.animation || 'animate-fade-in';
          entry.target.classList.add(animation);
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -50px 0px'
    });
    
    animateOnScrollElements.forEach(element => {
      observer.observe(element);
    });
  }
  
  // Initialize progress bars
  const progressBars = document.querySelectorAll('.progress-bar .animate-on-scroll');
  
  if (progressBars.length > 0) {
    setTimeout(() => {
      progressBars.forEach(bar => {
        const width = bar.getAttribute('data-width');
        if (width) {
          bar.style.width = width;
        }
      });
    }, 500);
  }
}

// Initialize interactive elements
function initInteractiveElements() {
  // Add ripple effect to buttons
  const rippleButtons = document.querySelectorAll('.btn-ripple');
  
  rippleButtons.forEach(button => {
    button.addEventListener('click', function(e) {
      const x = e.clientX - e.target.getBoundingClientRect().left;
      const y = e.clientY - e.target.getBoundingClientRect().top;
      
      const ripple = document.createElement('span');
      ripple.className = 'absolute w-full h-full bg-white rounded-full opacity-30 transform scale-0';
      ripple.style.left = `${x}px`;
      ripple.style.top = `${y}px`;
      ripple.style.transformOrigin = '50% 50%';
      
      this.appendChild(ripple);
      
      // Animate the ripple
      ripple.animate([
        { transform: 'scale(0)', opacity: '0.3' },
        { transform: 'scale(4)', opacity: '0' }
      ], {
        duration: 600,
        easing: 'ease-out'
      });
      
      // Remove the ripple after animation
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
  
  // Add hover effects to cards
  const cards = document.querySelectorAll('.card-hover');
  
  cards.forEach(card => {
    card.addEventListener('mouseenter', function() {
      this.classList.add('shadow-lg');
      this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
      this.classList.remove('shadow-lg');
      this.style.transform = 'translateY(0)';
    });
  });
  
  // Add notification system
  const notificationContainer = document.createElement('div');
  notificationContainer.className = 'fixed top-4 right-4 z-50 flex flex-col items-end space-y-2';
  document.body.appendChild(notificationContainer);
  
  // Expose notification function globally
  window.showNotification = function(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `transform translate-x-full transition-all duration-500 bg-white rounded-lg shadow-lg p-4 flex items-center max-w-md ${
      type === 'success' ? 'border-l-4 border-green-500' :
      type === 'error' ? 'border-l-4 border-red-500' :
      type === 'warning' ? 'border-l-4 border-amber-500' :
      'border-l-4 border-blue-500'
    }`;
    
    const icon = document.createElement('div');
    icon.className = 'mr-3 text-xl';
    icon.innerHTML = type === 'success' ? '✅' :
                    type === 'error' ? '❌' :
                    type === 'warning' ? '⚠️' : 'ℹ️';
    
    const content = document.createElement('div');
    content.className = 'flex-1';
    content.textContent = message;
    
    const closeBtn = document.createElement('button');
    closeBtn.className = 'ml-4 text-gray-400 hover:text-gray-600';
    closeBtn.innerHTML = '&times;';
    closeBtn.addEventListener('click', () => {
      notification.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => {
        notification.remove();
      }, 500);
    });
    
    notification.appendChild(icon);
    notification.appendChild(content);
    notification.appendChild(closeBtn);
    
    notificationContainer.appendChild(notification);
    
    // Animate in
    setTimeout(() => {
      notification.classList.remove('translate-x-full');
    }, 10);
    
    // Auto remove after 5 seconds
    setTimeout(() => {
      notification.classList.add('translate-x-full', 'opacity-0');
      setTimeout(() => {
        notification.remove();
      }, 500);
    }, 5000);
  };
}

// Initialize form validations
function initFormValidations() {
  const forms = document.querySelectorAll('form');
  
  forms.forEach(form => {
    const requiredInputs = form.querySelectorAll('[required]');
    
    requiredInputs.forEach(input => {
      // Add validation styles
      input.addEventListener('blur', function() {
        if (this.value.trim() === '') {
          this.classList.add('border-red-500');
          
          // Add error message if it doesn't exist
          let errorMsg = this.nextElementSibling;
          if (!errorMsg || !errorMsg.classList.contains('error-message')) {
            errorMsg = document.createElement('p');
            errorMsg.className = 'text-red-500 text-xs mt-1 error-message';
            errorMsg.textContent = 'This field is required';
            this.parentNode.insertBefore(errorMsg, this.nextSibling);
          }
        } else {
          this.classList.remove('border-red-500');
          
          // Remove error message if it exists
          const errorMsg = this.nextElementSibling;
          if (errorMsg && errorMsg.classList.contains('error-message')) {
            errorMsg.remove();
          }
        }
      });
      
      // Clear validation styles on input
      input.addEventListener('input', function() {
        this.classList.remove('border-red-500');
        
        // Remove error message if it exists
        const errorMsg = this.nextElementSibling;
        if (errorMsg && errorMsg.classList.contains('error-message')) {
          errorMsg.remove();
        }
      });
    });
    
    // Form submission animation
    form.addEventListener('submit', function(e) {
      const submitBtn = this.querySelector('button[type="submit"]');
      
      if (submitBtn) {
        // Add loading state
        const originalContent = submitBtn.innerHTML;
        submitBtn.disabled = true;
        submitBtn.classList.add('opacity-75');
        submitBtn.innerHTML = '<div class="flex items-center justify-center"><div class="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div> Processing...</div>';
        
        // For demo purposes, we'll restore the button after 2 seconds
        // In a real app, this would happen after the form submission completes
        setTimeout(() => {
          submitBtn.disabled = false;
          submitBtn.classList.remove('opacity-75');
          submitBtn.innerHTML = originalContent;
        }, 2000);
      }
    });
  });
}

// Initialize charts
function initCharts() {
  // Check if Chart.js is available
  if (typeof Chart === 'undefined') return;
  
  // Example: Expense by Category chart
  const expenseCategoryChart = document.getElementById('expense-category-chart');
  if (expenseCategoryChart) {
    const ctx = expenseCategoryChart.getContext('2d');
    
    // Get data from the element's data attributes
    const labels = JSON.parse(expenseCategoryChart.dataset.labels || '[]');
    const values = JSON.parse(expenseCategoryChart.dataset.values || '[]');
    
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: labels,
        datasets: [{
          data: values,
          backgroundColor: [
            '#3B82F6', // blue
            '#8B5CF6', // purple
            '#EC4899', // pink
            '#F97316', // orange
            '#10B981', // green
            '#6366F1', // indigo
            '#14B8A6', // teal
            '#F59E0B', // amber
          ],
          borderWidth: 1
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            position: 'bottom',
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                const label = context.label || '';
                const value = context.raw || 0;
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = Math.round((value / total) * 100);
                return `${label}: ₹${value} (${percentage}%)`;
              }
            }
          }
        },
        animation: {
          animateScale: true,
          animateRotate: true
        }
      }
    });
  }
  
  // Example: Monthly Spending Trend chart
  const spendingTrendChart = document.getElementById('spending-trend-chart');
  if (spendingTrendChart) {
    const ctx = spendingTrendChart.getContext('2d');
    
    // Get data from the element's data attributes
    const labels = JSON.parse(spendingTrendChart.dataset.labels || '[]');
    const values = JSON.parse(spendingTrendChart.dataset.values || '[]');
    
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: labels,
        datasets: [{
          label: 'Monthly Spending',
          data: values,
          borderColor: '#3B82F6',
          backgroundColor: 'rgba(59, 130, 246, 0.1)',
          tension: 0.4,
          fill: true
        }]
      },
      options: {
        responsive: true,
        plugins: {
          legend: {
            display: false
          },
          tooltip: {
            callbacks: {
              label: function(context) {
                return `₹${context.raw}`;
              }
            }
          }
        },
        scales: {
          y: {
            beginAtZero: true,
            ticks: {
              callback: function(value) {
                return '₹' + value;
              }
            }
          }
        },
        animation: {
          duration: 2000,
          easing: 'easeOutQuart'
        }
      }
    });
  }
}
