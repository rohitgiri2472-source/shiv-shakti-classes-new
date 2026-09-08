const slides = document.querySelectorAll(".hero-slide");
const dots = document.querySelectorAll(".dot");

const prevButton = document.getElementById("prevSlide");
const nextButton = document.getElementById("nextSlide");

let currentSlide = 0;

function showSlide(index) {

    if (index >= slides.length) {
        currentSlide = 0;
    } else if (index < 0) {
        currentSlide = slides.length - 1;
    } else {
        currentSlide = index;
    }

    slides.forEach((slide) => {
        slide.classList.remove("active");
    });

    dots.forEach((dot) => {
        dot.classList.remove("active");
    });

    slides[currentSlide].classList.add("active");
    dots[currentSlide].classList.add("active");
}


// Next
nextButton.addEventListener("click", () => {
    showSlide(currentSlide + 1);
});


// Previous
prevButton.addEventListener("click", () => {
    showSlide(currentSlide - 1);
});


// Dots
dots.forEach((dot, index) => {

    dot.addEventListener("click", () => {
        showSlide(index);
    });

});


// Automatic sliding
setInterval(() => {
    showSlide(currentSlide + 1);
}, 5000);