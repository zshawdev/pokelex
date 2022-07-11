//Fetch Array of Pokemon Objects from Third-Party API
const fetchJson = url => fetch(url).then(r => r.json()).catch(console.log);
(async() => {
    [arrayA, arrayB] = await Promise.all([
        Promise.all(new Array(151).fill(0).map((_, i) => fetchJson(`https://pokeapi.co/api/v2/pokemon/${i + 1}`))),
        Promise.all(new Array(151).fill(0).map((_, i) => fetchJson(`https://pokeapi.co/api/v2/pokemon-species/${i + 1}`)))
    ]);

    arrayAB(arrayA, arrayB);

})();

let pokemonObjectsArray;
const arrayAB = ((arrayA, arrayB) => {
    arrayA.forEach(function(n) {
        index = n.id - 1;
        arrayA[index] = {
            ...arrayA[index],
            ...arrayB[index]
        };
    });
    
    pokemonObjectsArray = arrayA.map(poke => ({
        id: String(poke.id).padStart(3, "0"),
        name: {
            de: poke.names[5].name.toUpperCase(),
            en: poke.names[8].name.toUpperCase(),
            fr: poke.names[4].name.toUpperCase()
        },
        image: `assets/img/sprites/${arrayA.indexOf(poke) + 1}.png`,
        audioFile: `assets/audio/cries/${arrayA.indexOf(poke) + 1}.wav`,
        height: {
            imperial: formatHeight("imperial", poke.height),
            metric: formatHeight("metric", poke.height)
        },
        weight: {
            imperial: formatWeight("imperial", poke.weight),
            metric: formatWeight("metric", poke.weight)
        },
        species: {
            de: poke.genera[4].genus.replace("-Pokémon", "").toUpperCase(),
            en: poke.genera[7].genus.replace(" Pokémon", "").toUpperCase(),
            fr: poke.genera[3].genus.replace("Pokémon ", "").toUpperCase()
        },
        entry: {
            de: poke.flavor_text_entries[25].flavor_text.replaceAll("\n", " ").replaceAll("\f", " "),
            en: poke.flavor_text_entries[28].flavor_text.replaceAll("\n", " ").replaceAll("\f", " "),
            fr: poke.flavor_text_entries[24].flavor_text.replaceAll("\n", " ").replaceAll("\f", " ")
        }
    }));
})

//Unit Conversion
const formatHeight = (unit, height) => {
    if (unit === "imperial") {
        const raw = (height / 10) * 3.28084; //height's value: meters albeit misplaced (stored: 69, desired: 6.9), is converted to meters (via / 10) then meters-to-feet
        let feet = Math.floor(raw);
        let inches = Math.round((raw - feet) * 12);
        if (inches === 12) {
            feet++;
            inches = 0;
        }
        return `${feet}'${String(inches).padStart(2, "0")}"`;
    } else if (unit === "metric") {
        const metricHeight = height / 10; //height's value: meters albeit misplaced (stored: 69, desired: 6.9), is converted to meters (via / 10) then meters-to-feet
        return `${metricHeight.toFixed(1).replace(".", ",")}m`;
    }
};

const formatWeight = (unit, weight) => {
    if (unit === "imperial") {
        const raw = (weight / 10) * 2.2046; //weight's value: kg albeit misplaced (stored: 69, desired: 6.9), is converted to kg (via / 10) then kg-to-pounds
        let pounds = raw.toFixed(1);
        return `${pounds}lb`;
    } else if (unit === "metric") {
        const metricWeight = weight / 10; //height"s value: meters albeit misplaced (stored: 69, desired: 6.9), is converted to meters (via / 10) then meters-to-feet
        return `${metricWeight.toFixed(1).replace(".", ",")}kg`;
    }
};