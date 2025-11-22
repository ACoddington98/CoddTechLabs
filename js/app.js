// Simple fade-in animation for hero text
document.addEventListener('DOMContentLoaded', () => {
  const heroText = document.querySelector('.hero-content');
  if (heroText) {
    heroText.style.opacity = 0;
    setTimeout(() => {
      heroText.style.transition = "opacity 1.5s";
      heroText.style.opacity = 1;
    }, 300);
  }
});
