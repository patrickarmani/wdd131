const loadMoreButton = document.querySelector("#load-more-button");
const plantCards = document.querySelectorAll(".plant-card");

let visibleCards = 2;
const cardsPerClick = 2;

function updatePlantCards() {
    plantCards.forEach((card, index) => {
        card.classList.toggle("hidden-card", index >= visibleCards);
    });

    if (visibleCards >= plantCards.length) {
        loadMoreButton.hidden = true;
    }
}

loadMoreButton.addEventListener("click", () => {
    visibleCards += cardsPerClick;
    updatePlantCards();
});

updatePlantCards();