const exploreButton =
    document.querySelector("#explore-plants-button");

const searchDialog =
    document.querySelector("#plant-search-dialog");

const searchForm =
    document.querySelector("#plant-search-form");

const closeSearchButton =
    document.querySelector("#close-search-dialog");

const cancelSearchButton =
    document.querySelector("#cancel-search");

const plantNameInput =
    document.querySelector("#plant-name-search");

const conditionInput =
    document.querySelector("#condition-search");

const resultsContainer =
    document.querySelector("#plant-search-results");

const searchError =
    document.querySelector("#search-error");

const essentialOilError =
    document.querySelector("#essential-oil-error");


let searchPlants = [];


/* -------------------------------------------
   Load search data
-------------------------------------------- */

async function loadSearchPlants() {

    try {

        const response =
            await fetch("data/search-plants.json");

        if (!response.ok) {
            throw new Error("Could not load plant search data.");
        }

        searchPlants = await response.json();

    } catch (error) {

        console.error("Error loading search plants:", error);

        searchError.textContent =
            "The plant database could not be loaded.";

    }

}

loadSearchPlants();


/* -------------------------------------------
   Open dialog
-------------------------------------------- */

exploreButton.addEventListener("click", (event) => {

    event.preventDefault();

    searchDialog.showModal();

});


/* -------------------------------------------
   Close dialog
-------------------------------------------- */

function closeSearchDialog() {

    searchDialog.close();

    searchForm.reset();

    resultsContainer.innerHTML = "";

    searchError.textContent = "";

    essentialOilError.textContent = "";

}


closeSearchButton.addEventListener(
    "click",
    closeSearchDialog
);


cancelSearchButton.addEventListener(
    "click",
    closeSearchDialog
);


/* -------------------------------------------
   Normalize text
-------------------------------------------- */

function normalizeText(text) {

    return text
        .toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "")
        .trim();

}


/* -------------------------------------------
   Search
-------------------------------------------- */

searchForm.addEventListener("submit", (event) => {

    event.preventDefault();

    searchError.textContent = "";
    essentialOilError.textContent = "";
    resultsContainer.innerHTML = "";


    const plantQuery =
        normalizeText(plantNameInput.value);

    const conditionQuery =
        normalizeText(conditionInput.value);

    const essentialOilChoice =
        document.querySelector(
            'input[name="essentialOil"]:checked'
        );


    /* At least one search field */

    if (!plantQuery && !conditionQuery) {

        searchError.textContent =
            "Enter a plant name, scientific name, or health condition.";

        return;
    }


    /* Essential oil choice is mandatory */

    if (!essentialOilChoice) {

        essentialOilError.textContent =
            "Mark Yes or No.";

        return;
    }


    let results = [...searchPlants];


    /* Plant or scientific-name search */

    if (plantQuery) {

        results = results.filter((plant) => {

            const commonName =
                normalizeText(plant.name);

            const scientificName =
                normalizeText(plant.scientificName);

            return (
                commonName.includes(plantQuery) ||
                scientificName.includes(plantQuery)
            );

        });

    }


    /* Health-condition search */

    if (conditionQuery) {

        results = results.filter((plant) => {

            return plant.uses.some((use) =>
                normalizeText(use)
                    .includes(conditionQuery)
            );

        });

    }


    /*
        Yes = only plants with essential oil.
        No = essential oil is not used as a filter.
    */

    if (essentialOilChoice.value === "yes") {

        results = results.filter(
            (plant) => plant.essentialOil === true
        );

    }


    displayResults(
        results,
        plantQuery,
        conditionQuery
    );

});


/* -------------------------------------------
   Display results
-------------------------------------------- */

function displayResults(
    results,
    plantQuery,
    conditionQuery
) {

    if (results.length === 0) {

        const message =
            conditionQuery
                ? "Not found. Try similar names."
                : "Sorry! No records!";

        resultsContainer.innerHTML = `
            <div class="empty-search-card">

                <button
                    type="button"
                    class="close-result"
                    aria-label="Close result"
                >
                    ×
                </button>

                <p>${message}</p>

            </div>
        `;

        return;
    }


    const list =
        document.createElement("ul");


    results.forEach((plant) => {

        const item =
            document.createElement("li");

        const link =
            document.createElement("a");

        link.href =
            `plants.html?plant=${plant.id}`;

        link.textContent =
            `${plant.name} — ${plant.scientificName}`;

        item.appendChild(link);

        list.appendChild(item);

    });


    resultsContainer.appendChild(list);

}


/* -------------------------------------------
   Close empty result card
-------------------------------------------- */

resultsContainer.addEventListener(
    "click",
    (event) => {

        if (
            event.target.classList.contains("close-result")
        ) {

            resultsContainer.innerHTML = "";

        }

    }
);