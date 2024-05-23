let lastScrollY = window.scrollY;

window.addEventListener("scroll", () => {
    const navigation_bar = document.querySelector(".navigation-wrapper");
    const check = document.querySelector(".mobile-menu-button .check");
    const shouldHideNav = lastScrollY < window.scrollY && !check.checked;
    navigation_bar.classList.toggle("hidden", shouldHideNav);
    lastScrollY = window.scrollY;
});


// Handling of scroll animations
const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
        if(entry.isIntersecting) {
            entry.target.classList.add('show');
        }
    });
})

document.querySelectorAll(".animateOnScroll").forEach((el) => observer.observe(el));