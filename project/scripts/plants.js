const plantsGrid = document.querySelector("#plants-grid");
const loadMoreButton = document.querySelector("#load-more-button");

const cardsPerClick = 2;

let plants = [];
let nextPlantIndex = 0;
let initialCardsRevealed = false;


function createPlantCard(plant) {
    const article = document.createElement("article");

    article.classList.add("plant-card");

    article.dataset.scientific = plant.scientificName;
    article.dataset.origin = plant.origin;
    article.dataset.uses = plant.uses.join(",");
    article.dataset.countries = JSON.stringify(plant.countries);
    article.dataset.id = plant.id;

    article.innerHTML = `
        <div class="card-inner">

            <div class="card-front">
                <div class="plant-image">
                    <img
                        src="${plant.image}"
                        alt="${plant.alt}"
                        loading="lazy"
                    >

                    <button
                        class="favorite"
                        type="button"
                        aria-label="Add ${plant.name} to favorites"
                    >
                        ♡
                    </button>
                </div>

                <h3>${plant.name}</h3>

                <div class="plant-details">
                    <p>
                        <strong>Scientific name:</strong>
                        <span class="scientific-name"></span>
                    </p>

                    <p>
                        <strong>Origin:</strong>
                        <span class="plant-origin"></span>
                    </p>

                    <button class="flip-button" type="button">
                        Flip card ↻
                    </button>

                    <button class="close-card" type="button">
                        Close
                    </button>
                </div>
            </div>

            <div class="card-back">
                <h3>${plant.name}</h3>

                <h4>Traditional medicinal uses</h4>

                <ul class="uses-list"></ul>

                <div class="countries-section">
                    <h4>Countries where this plant is found or cultivated</h4>
                    <div class="countries-list"></div>
                </div>

                <button class="flip-button" type="button">
                    ↶ Back
                </button>
            </div>

        </div>
    `;

    setupPlantCard(article);

    return article;
}


function revealInitialCards() {
    const hiddenCards = document.querySelectorAll(".initially-hidden");

    hiddenCards.forEach((card) => {
        card.classList.remove("initially-hidden");
    });

    initialCardsRevealed = true;
}


function displayMorePlants() {

    if (!initialCardsRevealed) {
        revealInitialCards();
        return;
    }

    const nextPlants = plants.slice(
        nextPlantIndex,
        nextPlantIndex + cardsPerClick
    );

    nextPlants.forEach((plant) => {
        const card = createPlantCard(plant);

        plantsGrid.appendChild(card);
    });

    nextPlantIndex += nextPlants.length;

    if (nextPlantIndex >= plants.length) {
        loadMoreButton.hidden = true;
    }
}


async function loadPlantsData() {
    try {
        const response = await fetch("data/plants.json");

        if (!response.ok) {
            throw new Error("Could not load plants data.");
        }

        plants = await response.json();
        await openRequestedPlant(); //Added to ensure it runs after plants.json finishes loading.

    } catch (error) {
        console.error("Error loading plants:", error);
    }
}


loadMoreButton.addEventListener("click", displayMorePlants);

loadPlantsData();
//------------------open the card and show the details-----------------------

function setupPlantCard(card) {
    card.addEventListener("click", (event) => {

        if (event.target.closest(".favorite")) {
            return;
        }

        if (card.classList.contains("expanded")) {
            return;
        }

        document.querySelectorAll(".plant-card.expanded")
            .forEach((otherCard) => {
                otherCard.classList.remove("expanded");
                otherCard.classList.remove("flipped");
            });

        card.classList.add("expanded");

        showPlantDetails(card);
    });
}

//When clicking the heart icon, the card should not open.

function showPlantDetails(card) {

    const scientificName =
        card.dataset.scientific || "Not available";

    const origin =
        card.dataset.origin || "Not available";

    const uses =
        card.dataset.uses
            ? card.dataset.uses.split(",")
            : [];

    const countries =
        card.dataset.countries
            ? JSON.parse(card.dataset.countries)
            : {};


    const scientificElement =
        card.querySelector(".scientific-name");

    const originElement =
        card.querySelector(".plant-origin");

    const usesList =
        card.querySelector(".uses-list");

    const countriesElement =
        card.querySelector(".countries-list");


    if (scientificElement) {
        scientificElement.textContent = scientificName;
    }


    if (originElement) {
        originElement.textContent = origin;
    }


    if (usesList) {

        usesList.innerHTML = "";

        uses.forEach((use) => {

            const listItem =
                document.createElement("li");

            listItem.textContent =
                use.trim();

            usesList.appendChild(listItem);

        });
    }


    if (countriesElement) {

        countriesElement.innerHTML = "";

        Object.entries(countries).forEach(
            ([continent, countryList]) => {

                const continentBlock =
                    document.createElement("div");

                continentBlock.classList.add(
                    "continent-group"
                );


                const continentTitle =
                    document.createElement("strong");

                continentTitle.textContent =
                    `${continent}: `;


                const countriesText =
                    document.createElement("span");

                countriesText.textContent =
                    countryList.join(", ");


                continentBlock.appendChild(
                    continentTitle
                );

                continentBlock.appendChild(
                    countriesText
                );

                countriesElement.appendChild(
                    continentBlock
                );

            }
        );
    }
}

//------------------flip the card and show the back side-----------------------
document.addEventListener("click", (event) => {

    if (event.target.classList.contains("flip-button")) {
        event.stopPropagation();

        const card = event.target.closest(".plant-card");

        card.classList.toggle("flipped");
    }

});

//------------------close the card and hide the details-----------------------
document.addEventListener("click", (event) => {

    if (event.target.classList.contains("close-card")) {
        event.stopPropagation();

        const card = event.target.closest(".plant-card");

        card.classList.remove("expanded");
        card.classList.remove("flipped");
    }

});
//------------------setup the card and show the details-----------------------

document.querySelectorAll(".plant-card")
    .forEach((card) => {
        setupPlantCard(card);
    });

//-----------------search----------------------------------
async function openRequestedPlant() {

    const params =
        new URLSearchParams(window.location.search);

    const requestedPlantId =
        params.get("plant");


    if (!requestedPlantId) {
        return;
    }


    let card =
        document.querySelector(
            `.plant-card[data-id="${requestedPlantId}"]`
        );


    /*
       Card already exists in HTML
    */

    if (card) {

        card.classList.remove("initially-hidden");

        card.classList.add("expanded");

        showPlantDetails(card);

        card.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });

        return;
    }


    /*
       Card comes from JSON
    */

    const requestedPlant =
        plants.find(
            (plant) =>
                String(plant.id) === requestedPlantId
        );


    if (!requestedPlant) {
        return;
    }


    card = createPlantCard(requestedPlant);

    plantsGrid.prepend(card);

    card.classList.add("expanded");

    showPlantDetails(card);

    card.scrollIntoView({
        behavior: "smooth",
        block: "center"
    });

}