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

const fetch_content = () => {
    console.log("Fetching content");
    fetch(`http://localhost:3000/`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
        // body: JSON.stringify({
        //     "email": "pedale.velocedp@gmail.com",
        //     "password": "pw123",
        //     "username": "pedwoo",
        //     "userType": "consumer",
        //     "FirstName": "daniele",
        //     "LastName": "pedwolli"
        // }),
        // mode: 'no-cors'
    })
    .then(response => {
        console.log(response);
        if(response.ok) {
            console.log("Response OK");
        } else {
            console.log("Response not OK");
        }
    })
    .catch(error => {
        console.log(error);
    });
}
