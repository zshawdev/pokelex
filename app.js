const pokeSelect = () => document.querySelector('.simplebar-content');
const search = document.querySelector('#search');
const viewerIDNumber = document.querySelector('#viewer-id-number');
const viewerName = document.querySelector('#viewer-name');
const viewerImage = document.querySelector('#viewer-image');
const viewerHT = document.querySelector('#viewer-ht');
const viewerWT = document.querySelector('#viewer-wt');
const viewerSpecies = document.querySelector('#viewer-species');
const card = document.querySelector('#card');
const cryBtn = document.querySelector('#cry-btn');
const viewerDexEntry = document.querySelector('#dex-text');
const speaker = document.querySelector('#speaker');
const toggleButton = document.querySelector('#toggle-button');
const left = document.querySelector('#left');
let mainArray, liAll, cry;
// card.style.display = 'none';

// let isAssetsLoaded = false;

// window.addEventListener('DOMContentLoaded', () => {
//     toggleCardDisplay();
// });

// const toggleCardDisplay = () => {
//     if (!isAssetsLoaded) {
//         card.style.display = 'none';
//         //spinner.style.display

//     } else {
//         card.style.display = 'flex';
//         //spinner.style.display = 'none';
//     }
// }


//Endgoal: create a single array of objects (mainArray), whose desired key:value pairs are spread across two separate objects-containing API endpoints
const fetchJson = url => fetch(url).then(r => r.json()).catch(console.log);
(async() => {
    [arrayA, arrayB] = await Promise.all([
        Promise.all(new Array(151).fill(0).map((_, i) => fetchJson(`https://pokeapi.co/api/v2/pokemon/${i + 1}`))),
        Promise.all(new Array(151).fill(0).map((_, i) => fetchJson(`https://pokeapi.co/api/v2/pokemon-species/${i + 1}`)))
    ]);

    arrayAB(arrayA, arrayB);

})();

const arrayAB = ((arrayA, arrayB) => {
    arrayA.forEach(function(n) {
        index = n.id - 1;
        arrayA[index] = {
            ...arrayA[index],
            ...arrayB[index]
        }
    });
    mainArray = arrayA.map(poke => ({
        id: digitPlace(poke.id),
        name: poke.name.toUpperCase(),
        image: `images/${arrayA.indexOf(poke) + 1}.png`,
        cry: `cries/${arrayA.indexOf(poke) + 1}.wav`,
        ht: toFeet(poke.height),
        wt: toPounds(poke.weight),
        species: poke.genera[7].genus.replace(' Pokémon', '').toUpperCase(),
        entry: poke.flavor_text_entries[6].flavor_text.replaceAll('\n', ' ').replaceAll('\f', ' '),
    }));

    mainArray[121].name = 'MR. MIME';
    mainArray[28].name = 'NIDORAN (F)';
    mainArray[31].name = 'NIRDON (M)';
    mainArray[82].name = `FARFETCH'D`;

    mainArray[18].entry = mainArray[18].entry.replace(' ity', 'ity');
    mainArray[19].entry = mainArray[19].entry.replace(' es', 'es');
    mainArray[20].entry = mainArray[20].entry.replace(' pi', 'pi');
    mainArray[53].entry = mainArray[53].entry.replace(' ch', 'ch');
    mainArray[53].entry = mainArray[53].entry.replace(' ch', 'ch');
    mainArray[64].entry = mainArray[64].entry.replace(' l', 'l');
    mainArray[68].entry = mainArray[68].entry.replace(' te', 'te').replace(' cap', 'cap');
    mainArray[72].entry = mainArray[72].entry.replace(' er', 'er');
    mainArray[74].entry = mainArray[74].entry.replace(' l', 'l');
    mainArray[130].entry = mainArray[130].entry.replace(' ry', 'ry');
    mainArray[137].entry = mainArray[137].entry.replace(' s', 's');

    generateList(mainArray);
    listInteractivity();
    selectActive(mainArray[25 - 1]);
    let isAssetsLoaded = true;
    // toggleCardDisplay();
    // card.style.display = 'flex';
})

//Unit Conversion

const digitPlace = (number) => {
    if (number < 10) {
        return `00${number}`
    }
    if (number < 100) {
        return `0${number}`
    } else {
        return number
    }
}

const toPounds = weight => {
    const raw = (weight / 10) * 2.2046; //weight's value: kg albeit misplaced (stored: 69, desired: 6.9), is converted to kg (via / 10) then kg-to-pounds
    let pounds = Math.floor(raw);
    let decimal = Math.round((raw - pounds) * 10);
    if (decimal === 10) {
        pounds++;
        decimal = 0;
    }
    return `<span class="make-grey">WT</span> ${pounds}.${decimal}lbs`;
}

const toFeet = height => {
    const raw = (height / 10) * 3.28084; //height's value: meters albeit misplaced (stored: 69, desired: 6.9), is converted to meters (via / 10) then meters-to-feet
    let feet = Math.floor(raw);
    let inches = Math.round((raw - feet) * 12);
    if (inches === 12) {
        feet++;
        inches = 0;
        return `<span class="make-grey">HT</span> ${feet}'0${inches}"`;
    }
    if (inches < 10) {
        return `<span class="make-grey">HT</span> ${feet}'0${inches}"`
    } else {
        return `<span class="make-grey">HT</span> ${feet}'${inches}"`
    }
}

// add all li to ol
const generateList = array => {
    array.forEach(({
        id,
        name
    }) => {
        const newPoke = document.createElement('li');
        newPoke.innerHTML = `<span>${id}</span> <span class="poke-item-name">${name}</span>`;
        pokeSelect().append(newPoke);
        newPoke.tabIndex = -1;
    })
};


// search filter
search.addEventListener('input', () => {
    for (let li of liAll) {
        if (!li.innerText.includes(search.value.toUpperCase())) {
            li.classList.add('make-hidden');
        } else {
            li.classList.remove('make-hidden')
        }
    }
});


// print clicked-li to viewer pane
const listInteractivity = () => {
    let liAll = document.querySelectorAll('li')
    for (let li of liAll) {
        li.addEventListener('click', () => {
            num = parseInt(li.innerText) - 1;
            selectActive(mainArray[num]);
        });
    }
}


// printing of clicked-li to viewer pane
const selectActive = poke => {
    viewerIDNumber.textContent = `No.${poke.id}`;
    viewerName.textContent = poke.name;
    viewerImage.src = poke.image;
    viewerSpecies.innerHTML = `<span class="make-grey">SPECIES</span> ${poke.species}`;
    viewerHT.innerHTML = poke.ht;
    viewerWT.innerHTML = poke.wt;
    viewerDexEntry.innerText = poke.entry;
    cry = new Audio(poke.cry);
    focusPoke(poke);
};

// focus selected Poke's card
const focusPoke = poke => {
    search.value = '';
    liAll = document.querySelectorAll('li');
    for (let li of liAll) {
        li.classList.remove('make-hidden');
        li.classList.remove('make-white');
    };
    const focusedPoke = pokeSelect().children[parseInt(poke.id, 10) - 1];
    focusedPoke.classList.add('make-white');
    focusedPoke.focus();
    mobileResponsivePane(window.innerWidth);
};

window.addEventListener('DOMContentLoaded', () => {
    cryBtn.addEventListener('click', () => {
        cry.play()
    });
});

//Responsiveness

window.addEventListener('DOMContentLoaded', () => {
    toggleButton.addEventListener('click', () => {
        left.classList.toggle('make-hidden');
    });
});

let prevWidth = window.innerWidth;

window.addEventListener('DOMContentLoaded', () => {
    window.addEventListener('resize', () => {
        currentWidth = window.innerWidth
        if (currentWidth <= 769) {
            if (prevWidth >= 769) {
                left.classList.add('make-hidden');
            }
            if (prevWidth <= 769) {
                return prevWidth = currentWidth;
            }
        } else {
            left.classList.remove('make-hidden');
        }
        prevWidth = currentWidth;
    })
});

const mobileResponsivePane = (width) => {
    if (width <= 769) {
        left.classList.add('make-hidden');
    }
}