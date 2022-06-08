const pokeSelect = () => document.querySelector(".simplebar-content");
const toggleButton = document.querySelector("#toggle-button");
const searchPane = document.querySelector("#search-pane");
const entryPane = document.querySelector("#entry-pane");
const search = document.querySelector("#search");
const entryNumber = document.querySelector("#entry-number");
const entryName = document.querySelector("#entry-name");
const entrySprite = document.querySelector("#entry-sprite");
const entryHeight = document.querySelector("#entry-height");
const entryWeight = document.querySelector("#entry-weight");
const entrySpecies = document.querySelector("#entry-species");
const entryAudioButton = document.querySelector("#entry-audio-button");
const entryFlavorText = document.querySelector("#entry-flavor-text");
let mainArray, liAll, entryAudioFile;

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
        image: `images/${arrayA.indexOf(poke) + 1}.png`,
        audioFile: `cries/${arrayA.indexOf(poke) + 1}.wav`,
        ht: toFeet(poke.height),
        wt: toPounds(poke.weight),
        species: poke.genera[7].genus.replace(" Pokémon", "").toUpperCase(),
        entry: poke.flavor_text_entries[6].flavor_text.replaceAll("\n", " ").replaceAll("\f", " ")
    }));

    mainArray[121].name = "MR. MIME";
    mainArray[28].name = "NIDORAN (F)";
    mainArray[31].name = "NIDORAN (M)";
    mainArray[82].name = `FARFETCH"D`;

    mainArray[18].entry = mainArray[18].entry.replace(" ity", "ity");
    mainArray[19].entry = mainArray[19].entry.replace(" es", "es");
    mainArray[20].entry = mainArray[20].entry.replace(" pi", "pi");
    mainArray[53].entry = mainArray[53].entry.replace(" ch", "ch");
    mainArray[53].entry = mainArray[53].entry.replace(" ch", "ch");
    mainArray[64].entry = mainArray[64].entry.replace(" l", "l");
    mainArray[68].entry = mainArray[68].entry.replace(" te", "te").replace(" cap", "cap");
    mainArray[72].entry = mainArray[72].entry.replace(" er", "er");
    mainArray[74].entry = mainArray[74].entry.replace(" l", "l");
    mainArray[130].entry = mainArray[130].entry.replace(" ry", "ry");
    mainArray[137].entry = mainArray[137].entry.replace(" s", "s");

    generateList(mainArray);
    listInteractivity();
    selectActive(mainArray[25 - 1]);
})

//Unit Conversion

const toPounds = weight => {
    const raw = (weight / 10) * 2.2046; //weight"s value: kg albeit misplaced (stored: 69, desired: 6.9), is converted to kg (via / 10) then kg-to-pounds
    let pounds = Math.floor(raw);
    let decimal = Math.round((raw - pounds) * 10);
    if (decimal === 10) {
        pounds++;
        decimal = 0;
    };
    return `<span class="u-color-gray">WT</span> ${pounds}.${decimal}lbs`;
}

const toFeet = height => {
    const raw = (height / 10) * 3.28084; //height"s value: meters albeit misplaced (stored: 69, desired: 6.9), is converted to meters (via / 10) then meters-to-feet
    let feet = Math.floor(raw);
    let inches = Math.round((raw - feet) * 12);
    if (inches === 12) {
        feet++;
        inches = 0;
        return `<span class="u-color-gray">HT</span> ${feet}'0${inches}"`;
    }
    if (inches < 10) {
        return `<span class="u-color-gray">HT</span> ${feet}'0${inches}"`;
    } else {
        return `<span class="u-color-gray">HT</span> ${feet}'${inches}"`;
    }
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

// focus selected Poke"s card
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

window.addEventListener("DOMContentLoaded", () => {
    entryAudioButton.addEventListener("click", () => {
        entryAudioFile.play()
    });
});

//Responsiveness

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