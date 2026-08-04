let reviewCount = Number(localStorage.getItem("reviewCount")) || 0;

reviewCount++;

localStorage.setItem("reviewCount", reviewCount);

const reviewCountElement = document.querySelector("#review-count");

reviewCountElement.textContent = reviewCount;