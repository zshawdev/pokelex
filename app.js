let pokemonObjectsArray = [];
let currentLanguage = "en";
let scrollHeight;
(async() => {
    const fetchJson = file => fetch(file).then(r => r.json()).catch(console.log);
    pokemonObjectsArray = await fetchJson("assets/json/pokemon-objects.json");
    generateList(pokemonObjectsArray);
    scrollHeight = document.querySelector(".simplebar-content").clientHeight;
    listInteractivity();
    selectActivePokemon(pokemonObjectsArray[24]); //24 contains Pikachu, the mascot of Pokemon, to open with a recognizable character.
    printSelectedLanguage(currentLanguage);
})();

const pokeSelect = () => document.querySelector(".simplebar-content");
const generateList = array => {
    array.forEach(({
        id,
        name
    }) => {
        const newPoke = document.createElement("li");
        newPoke.innerHTML = `<span>${id}</span> <span class="pokedex__list-item--name-of-pokemon">${name[currentLanguage]}</span>`;
        pokeSelect().append(newPoke);
        newPoke.tabIndex = -1;
    })
};

const parseIntIndex = index => parseInt(index, 10) - 1;
printPokemonNameCurrentLanguage = () => {
    for (let li of liAll) {
        num = parseIntIndex(li.innerText);
        li.children[1].innerHTML = pokemonObjectsArray[num].name[currentLanguage];
    }
}

const search = document.querySelector("#search");
let liAll;
search.addEventListener("input", () => {
    for (let li of liAll) {
        if (!li.innerText.includes(search.value.toUpperCase())) {
            li.classList.add("u-display-none");
        } else {
            li.classList.remove("u-display-none");
        }
    }
});

const listInteractivity = () => {
    let liAll = document.querySelectorAll("li");
    for (let li of liAll) {
        li.addEventListener("click", () => {
            num = parseIntIndex(li.innerText);
            selectActivePokemon(pokemonObjectsArray[num]);
        });
    }
}

const entryNumber = document.querySelector("#entry-number");
const entryName = document.querySelector("#entry-name");
const entrySprite = document.querySelector("#entry-sprite");
const entrySpecies = document.querySelector("#entry-species");
const entryHeight = document.querySelector("#entry-height");
const entryWeight = document.querySelector("#entry-weight");
const entryFlavorText = document.querySelector("#entry-flavor-text");
let entryAudioFile;
let currentActivePokemon;

const selectActivePokemon = (poke) => {
    entryNumber.lastChild.textContent = poke.id;
    entryName.textContent = poke.name[currentLanguage];
    entrySprite.src = poke.image;
    entrySpecies.lastChild.textContent = ` ${poke.species[currentLanguage]}`;
    if (currentLanguage === "en") {
        entryHeight.lastChild.textContent = ` ${poke.height.imperial}`;
        entryWeight.lastChild.textContent = ` ${poke.weight.imperial}`;
    } else {
        entryHeight.lastChild.textContent = ` ${poke.height.metric}`;
        entryWeight.lastChild.textContent = ` ${poke.weight.metric}`;
    }
    entryFlavorText.innerText = poke.entry[currentLanguage];
    entryAudioFile = new Audio(poke.audioFile);
    focusPoke(poke);
    currentActivePokemon = parseIntIndex(poke.id);;
};

const focusPoke = poke => {
    search.value = "";
    liAll = document.querySelectorAll("li");
    for (let li of liAll) {
        li.classList.remove("u-display-none");
        li.classList.remove("u-border-color-white");
    };
    const focusedPoke = pokeSelect().children[parseIntIndex(poke.id)];
    focusedPoke.classList.add("u-border-color-white");
    focusedPoke.focus();
    resetPokedexPaneDisplay(window.innerWidth);
};

const entryAudioButton = document.querySelector("#entry-audio-button");

window.addEventListener("DOMContentLoaded", () => {
    entryAudioButton.addEventListener("click", () => {
        entryAudioFile.play();
    });
});

const entryNumberHeading = document.querySelector("#entry-number-heading");
const entrySpeciesHeading = document.querySelector("#entry-species-heading");
const entryHeightHeading = document.querySelector("#entry-height-heading");
const entryWeightHeading = document.querySelector("#entry-weight-heading");

let multilingualHeadings;
(async() => {
    const fetchJson = file => fetch(file).then(r => r.json()).catch(console.log);
    return multilingualHeadings = await fetchJson("assets/json/multilingual-headings.json");
})();

const printAllHeadings = () => {
    for (let heading in multilingualHeadings) {
        const passedInHeading = eval(heading);
        if (passedInHeading.placeholder) {
            passedInHeading.placeholder = multilingualHeadings[heading][currentLanguage];
        } else {
            passedInHeading.textContent = multilingualHeadings[heading][currentLanguage];
        }
    }
}

const printSelectedLanguage = (selectedLanguage) => {
    currentLanguage = selectedLanguage;
    selectActivePokemon(pokemonObjectsArray[currentActivePokemon]);
    printPokemonNameCurrentLanguage();
    printAllHeadings();
}

const languageSelectButtons = document.querySelectorAll("[data-language]");

languageSelectButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const language = button.getAttribute("data-language");
        printSelectedLanguage(language);
    });
});

//cardBall Rotation
window.addEventListener("DOMContentLoaded", () => {
    const pokeSelect = document.querySelector(".simplebar-content-wrapper");

    function transformCardBall (scrollTop, scrollHeight, clientHeight) {
        const degrees = Math.round((scrollTop / (scrollHeight - clientHeight)) * 360);
        document.documentElement.style.setProperty("--deg", `${ degrees }deg`);
    }
    pokeSelect.addEventListener("scroll", e => {
        transformCardBall(e.target.scrollTop, scrollHeight, e.target.clientHeight);
    });
});

//Responsiveness

const toggleButton = document.querySelector("#toggle-button");
const searchPane = document.querySelector("#search-pane");
const entryPane = document.querySelector("#entry-pane");

window.addEventListener("DOMContentLoaded", () => {
    toggleButton.addEventListener("click", () => {
        searchPane.classList.toggle("u-display-block");
        entryPane.classList.toggle("u-display-none");
    });
});

tabPortMediaQuery = 900;

const resetPokedexPaneDisplay = (width) => {
    if (width <= tabPortMediaQuery) {
        searchPane.classList.remove("u-display-block");
        entryPane.classList.remove("u-display-none");
    }
}

let prevWidth = window.innerWidth;

window.addEventListener("DOMContentLoaded", () => {
    window.addEventListener("resize", () => {
        currentWidth = window.innerWidth
        if (currentWidth <= tabPortMediaQuery) { //To small...
            if (prevWidth >= tabPortMediaQuery) { //...from big
                searchPane.classList.remove("u-display-block");
                entryPane.classList.remove("u-display-none");
            }
            if (prevWidth <= tabPortMediaQuery) { //...from small
                return prevWidth = currentWidth;
            }
        } else { //To big from big & from small to big
            searchPane.classList.remove("u-display-block");
            entryPane.classList.remove("u-display-none");
        }
        prevWidth = currentWidth;
    })
});
