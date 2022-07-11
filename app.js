const pokeSelect = () => document.querySelector(".simplebar-content");
const search = document.querySelector("#search");
let mainArray, liAll, entryAudioFile;

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

const fetchJson = url => fetch(url).then(r => r.json()).catch(console.log);
(async() => {
    [arrayA, arrayB] = await Promise.all([
        Promise.all(new Array(151).fill(0).map((_, i) => fetchJson(`https://pokeapi.co/api/v2/pokemon/${i + 1}`))),
        Promise.all(new Array(151).fill(0).map((_, i) => fetchJson(`https://pokeapi.co/api/v2/pokemon-species/${i + 1}`)))
    ]);

    arrayAB(arrayA, arrayB);

}
)();

const arrayAB = ((arrayA, arrayB) => {
    arrayA.forEach(function(n) {
        index = n.id - 1;
        arrayA[index] = {
            ...arrayA[index],
            ...arrayB[index]
        };
    });
    
    mainArray = arrayA.map(poke => ({
        id: `${poke.id}`.padStart(3, "0"),
        name: poke.name.toUpperCase(),
        image: `assets/img/sprites/${arrayA.indexOf(poke) + 1}.png`,
        audioFile: `assets/audio/cries/${arrayA.indexOf(poke) + 1}.wav`,
        ht: toFeet(poke.height),
        wt: toPounds(poke.weight),
        species: poke.genera[7].genus.replace(" Pokémon", "").toUpperCase(),
        entry: poke.flavor_text_entries[6].flavor_text.replaceAll("\n", " ").replaceAll("\f", " ")
    }));

    mainArray[121].name = "MR. MIME";
    mainArray[28].name = "NIDORAN (F)";
    mainArray[31].name = "NIDORAN (M)";
    mainArray[82].name = `FARFETCH"D`;

    const removeEntrySpace = (index, text) => {
        console.log(index, text);
        mainArray[index].entry = mainArray[index].entry.replace(` ${text}`, `${text}`);
    }

    removeEntrySpace(18, "ity");
    removeEntrySpace(19, "es");
    removeEntrySpace(20, "pi");
    removeEntrySpace(25, "cit");
    removeEntrySpace(53, "ch");
    removeEntrySpace(64, "l");
    removeEntrySpace(68, "te");
    removeEntrySpace(68, "cap");
    removeEntrySpace(72, "er");
    removeEntrySpace(74, "l");
    removeEntrySpace(130, "ry");
    removeEntrySpace(137, "s");

    generateList(mainArray);
    listInteractivity();
    selectActive(mainArray[25 - 1]);
})

//Unit Conversion

const toPounds = weight => {
    const raw = (weight / 10) * 2.2046; //weight"s value: kg albeit misplaced (stored: 69, desired: 6.9), is converted to kg (via / 10) then kg-to-pounds
    let pounds = raw.toFixed(1);
    return `<span class="u-color-gray">WT</span> ${pounds}lbs`;
}

const toFeet = height => {
    const raw = (height / 10) * 3.28084; //height"s value: meters albeit misplaced (stored: 69, desired: 6.9), is converted to meters (via / 10) then meters-to-feet
    let feet = Math.floor(raw);
    let inches = Math.round((raw - feet) * 12);
    if (inches === 12) {
        feet++;
        inches = 0;
    }
    return `<span class="u-color-gray">HT</span> ${feet}'${String(inches).padStart(2, "0")}"`;
}

const generateList = array => {
    array.forEach(({
        id,
        name
    }) => {
        const newPoke = document.createElement("li");
        newPoke.innerHTML = `<span>${id}</span> <span class="pokedex__list-item--name-of-pokemon">${name}</span>`;
        pokeSelect().append(newPoke);
        newPoke.tabIndex = -1;
    })
};

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
            selectActive(mainArray[num]);
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

const selectActive = poke => {
    entryNumber.textContent = `No.${poke.id}`;
    entryName.textContent = poke.name;
    entrySprite.src = poke.image;
    entrySpecies.innerHTML = `<span class="u-color-gray">SPECIES</span> ${poke.species}`;
    entryHeight.innerHTML = poke.ht;
    entryWeight.innerHTML = poke.wt;
    entryFlavorText.innerText = poke.entry;
    entryAudioFile = new Audio(poke.audioFile);
    focusPoke(poke);
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

<<<<<<< Updated upstream
=======
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
    //iterate over object, print headings like that
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

>>>>>>> Stashed changes
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
