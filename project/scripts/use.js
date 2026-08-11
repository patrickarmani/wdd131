const usesGrid = document.querySelector("#uses-grid");
const useError = document.querySelector("#use-error");

const searchInput =
    document.querySelector("#plant-use-search");

const noResults =
    document.querySelector("#no-use-results");


let allPlants = [];


async function loadPlantUses() {

    try {

        const response = await fetch("data/uses.json");

        if (!response.ok) {
            throw new Error("Could not load uses.json");
        }

        const plants = await response.json();

        allPlants = plants;

        displayPlantUses(allPlants);

    } catch (error) {

        console.error("Error loading plant uses:", error);

        useError.hidden = false;
    }
}


function displayPlantUses(plants) {

    usesGrid.innerHTML = "";

    if (plants.length === 0) {

        noResults.hidden = false;

        return;
    }

    noResults.hidden = true;


    plants.forEach((plant) => {

        const card = createUseCard(plant);

        usesGrid.appendChild(card);
    });
}


function createUseCard(plant) {

    const article =
        document.createElement("article");

    article.classList.add("use-card");


    article.innerHTML = `
        <div class="use-card-image">

            <img
                src="${plant.image}"
                alt="${plant.alt}"
                loading="lazy"
                width="400"
                height="300"
            >

        </div>


        <div class="use-card-summary">

            <h3>${plant.name}</h3>

            <p class="scientific-name">
                <em>${plant.scientificName}</em>
            </p>

            <button
                class="use-toggle-button"
                type="button"
                aria-expanded="false"
            >
                <span class="toggle-text">
                    How to use
                </span>

                <span class="toggle-symbol">
                    +
                </span>

            </button>

        </div>


        <div class="use-details" hidden>

            <h4>Common forms of use</h4>

            <div class="use-methods"></div>

            <div class="use-warning">

                <strong>Safety note</strong>

                <p>${plant.warning}</p>

            </div>

        </div>
    `;


    const methodsContainer =
        article.querySelector(".use-methods");


    plant.methods.forEach((method) => {

        const methodSection =
            document.createElement("section");

        methodSection.classList.add(
            "use-method"
        );


        const title =
            document.createElement("h5");

        title.textContent =
            method.title;


        const description =
            document.createElement("p");

        description.textContent =
            method.description;


        methodSection.append(
            title,
            description
        );


        methodsContainer.appendChild(
            methodSection
        );
    });


    const toggleButton =
        article.querySelector(
            ".use-toggle-button"
        );

    const details =
        article.querySelector(
            ".use-details"
        );

    const symbol =
        article.querySelector(
            ".toggle-symbol"
        );

    const toggleText =
        article.querySelector(
            ".toggle-text"
        );


    toggleButton.addEventListener(
        "click",
        () => {

            const isOpen =
                toggleButton.getAttribute(
                    "aria-expanded"
                ) === "true";


            // Close all other open cards
            document
                .querySelectorAll(".use-card")
                .forEach((card) => {

                    if (card !== article) {

                        const otherButton =
                            card.querySelector(
                                ".use-toggle-button"
                            );

                        const otherDetails =
                            card.querySelector(
                                ".use-details"
                            );

                        const otherSymbol =
                            card.querySelector(
                                ".toggle-symbol"
                            );

                        const otherText =
                            card.querySelector(
                                ".toggle-text"
                            );


                        otherButton.setAttribute(
                            "aria-expanded",
                            "false"
                        );

                        otherDetails.hidden = true;

                        otherText.textContent =
                            "How to use";

                        otherSymbol.textContent =
                            "+";
                    }
                });


            toggleButton.setAttribute(
                "aria-expanded",
                String(!isOpen)
            );


            details.hidden = isOpen;


            if (isOpen) {

                toggleText.textContent =
                    "How to use";

                symbol.textContent = "+";

            } else {

                toggleText.textContent =
                    "Hide instructions";

                symbol.textContent = "−";
            }
        }
    );


    return article;
}


/* =========================
   SEARCH
========================= */

searchInput.addEventListener(
    "input",
    () => {

        const searchTerm =
            searchInput.value
                .toLowerCase()
                .trim();


        const filteredPlants =
            allPlants.filter((plant) => {

                const plantName =
                    plant.name.toLowerCase();

                const scientificName =
                    plant.scientificName.toLowerCase();


                return (
                    plantName.includes(searchTerm) ||
                    scientificName.includes(searchTerm)
                );
            });


        displayPlantUses(filteredPlants);
    }
);


loadPlantUses();