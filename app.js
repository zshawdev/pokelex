let currentLanguage = "en";
let pokemonObjectsArray = [];

//cardBall Rotation
const pokeSelect = () => document.querySelector(".simplebar-content");
window.addEventListener('DOMContentLoaded', () => {
    const pokeSelect = document.querySelector('.simplebar-content-wrapper');

    function transformCardBall (scrollTop, scrollHeight, clientHeight) {
        const degrees = Math.round((scrollTop / (scrollHeight - clientHeight)) * 360);
        document.documentElement.style.setProperty('--deg', `${ degrees }deg`);
    }
    const scrollHeight = 5136;
    // const scrollHeight = document.querySelector('.simplebar-content').clientHeight;
    pokeSelect.addEventListener('scroll', e => {
        transformCardBall(e.target.scrollTop, scrollHeight, e.target.clientHeight);
    });
});

const pokemonObjectsFetch = async() => {
    const res = await fetch("pokemonObjects.json");
    const data = await res.json();
    pokemonObjectsArray = data;
}

const printPokedex = async() => {
    await pokemonObjectsFetch();
    generateList(pokemonObjectsArray);
    listInteractivity();
    selectActive(pokemonObjectsArray[25 - 1]);
    printSelectedLanguage(currentLanguage);
}

printPokedex();

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

printPokemonLanguageName = () => {
    for (let li of liAll) {
        num = parseInt(li.innerText, 10) - 1;
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

// print clicked-li to viewer pane
const listInteractivity = () => {
    let liAll = document.querySelectorAll("li");
    for (let li of liAll) {
        li.addEventListener("click", () => {
            num = parseInt(li.innerText, 10) - 1;
            selectActive(pokemonObjectsArray[num]);
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
let currentActive;

const selectActive = (poke) => {
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
    currentActive = parseInt(poke.id, 10) - 1;
};

// focus selected Poke's card
const focusPoke = poke => {
    search.value = "";
    liAll = document.querySelectorAll("li");
    for (let li of liAll) {
        li.classList.remove("u-display-none");
        li.classList.remove("u-border-color-white");
    };
    const focusedPoke = pokeSelect().children[parseInt(poke.id, 10) - 1];
    focusedPoke.classList.add("u-border-color-white");
    focusedPoke.focus();
    resetPokedexPaneDisplay(window.innerWidth);
};

const entryAudioButton = document.querySelector("#entry-audio-button");

window.addEventListener("DOMContentLoaded", () => {
    entryAudioButton.addEventListener("click", () => {
        entryAudioFile.play()
    });
});

const nameOfPokemonHeading = document.querySelector("#name-of-pokemon-heading");
const entryNumberHeading = document.querySelector("#entry-number-heading");
const entrySpeciesHeading = document.querySelector("#entry-species-heading");
const entryHeightHeading = document.querySelector("#entry-height-heading");
const entryWeightHeading = document.querySelector("#entry-weight-heading");

const multilingualHeadings = {
    search: {
        de: "SUCHE",
        en: "SEARCH",
        fr: "RECHERCHER",
    },
    nameOfPokemonHeading: {
        de: `POK&#233;MON`,
        en: `POK&#233;MON`,
        fr: `POK&#233;MON`
    },
    entryNumberHeading: {
        de: "No.",
        en: "No.",
        fr: "No."
    },
    entrySpeciesHeading: {
        de: "SPECIES",
        en: "SPECIES",
        fr: "ESPÈCES"
    },
    entryHeightHeading: {
        de: "GR.",
        en: "HT",
        fr: "TAI"
    },
    entryWeightHeading: {
        de: "GEW",
        en: "WT",
        fr: "PDS"
    },
    languageSelectDe: {
        de: "DEUTSCH",
        en: "GERMAN",
        fr: "ALLEMAND"
    },
    languageSelectEn: {
        de: "ENGLISCH",
        en: "ENGLISH",
        fr: "ANGLAIS"
    },
    languageSelectFr: {
        de: "FRANZÖSISCH",
        en: "FRENCH",
        fr: "FRANÇAIS"
    },
}

const printAllHeadings = () => {
    const printHeading = (heading) => {
        const passedInHeading = eval(heading);
        if (passedInHeading.placeholder) {
            passedInHeading.placeholder = multilingualHeadings[heading][currentLanguage];
        }
        passedInHeading.textContent = multilingualHeadings[heading][currentLanguage];
    }
    printHeading("search");
    printHeading("entryNumberHeading");
    printHeading("entrySpeciesHeading");
    printHeading("entryHeightHeading");
    printHeading("entryWeightHeading");
    printHeading("languageSelectDe");
    printHeading("languageSelectEn");
    printHeading("languageSelectFr");
    eval(nameOfPokemonHeading).innerHTML = multilingualHeadings["nameOfPokemonHeading"][currentLanguage];
}

const printSelectedLanguage = (selectedLanguage) => {
    currentLanguage = selectedLanguage;
    selectActive(pokemonObjectsArray[currentActive]);
    printPokemonLanguageName();
    printAllHeadings();
}

const languageSelectEn = document.querySelector("#language-select-en");
const languageSelectFr = document.querySelector("#language-select-fr");
const languageSelectDe = document.querySelector("#language-select-de");

languageSelectEn.addEventListener("click", () => {
    printSelectedLanguage("en")
});

languageSelectFr.addEventListener("click", () => {
    printSelectedLanguage("fr")
});

languageSelectDe.addEventListener("click", () => {
    printSelectedLanguage("de")
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
