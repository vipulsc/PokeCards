const pokemonCard = document.querySelector("#pokemon-card");
let playCryButton = document.querySelector(".play-cry");
let button = document.querySelector(".submit");

function resetPokemonCard() {
  document.querySelector(".pokemon-image").src = "";
  document.querySelector(".pokemon-name").textContent = "Loading...";
  document.querySelector(".pokemon-id").textContent = "";
  document.querySelector(".pokemon-types").textContent = "";
  document.querySelector(".pokemon-abilities").textContent = "";
  document.querySelector(".pokemon-height").textContent = "";
  document.querySelector(".pokemon-weight").textContent = "";
  document.querySelector(".pokemon-stats").innerHTML = "";
  playCryButton.classList.add("hidden");
}

async function getPokemonData(input) {
  try {
    resetPokemonCard();

    const response = await axios.get(
      `https://pokeapi.co/api/v2/pokemon/${input.toLowerCase().trim()}`
    );

    const data = response.data;

    let pokemon = {
      name: data.name.toUpperCase(),
      id: `ID: ${data.id}`,
      image:
        data.sprites.other["official-artwork"].front_default ||
        data.sprites.front_default,
      types: `Type(s): ${data.types.map((t) => t.type.name).join(", ")}`,
      abilities: `Abilities: ${data.abilities
        .map((a) => a.ability.name)
        .join(", ")}`,
      height: `Height: ${data.height / 10} m`,
      weight: `Weight: ${data.weight / 10} kg`,
      stats: data.stats
        .map((stat) => `${stat.base_stat}: ${stat.stat.name}`)
        .join("<br>"),
      cry: `https://raw.githubusercontent.com/PokeAPI/cries/main/cries/pokemon/latest/${data.id}.ogg`,
    };

    displayPokemonData(pokemon);
  } catch (error) {
    resetPokemonCard();
    document.querySelector(".pokemon-name").textContent = "Pokémon Not Found!";
  }
}

async function displayPokemonData(data) {
  document.querySelector(".pokemon-image").src = data.image;
  document.querySelector(".pokemon-name").textContent = data.name;
  document.querySelector(".pokemon-id").textContent = data.id;
  document.querySelector(".pokemon-types").textContent = data.types;
  document.querySelector(".pokemon-abilities").textContent = data.abilities;
  document.querySelector(".pokemon-height").textContent = data.height;
  document.querySelector(".pokemon-weight").textContent = data.weight;
  document.querySelector(".pokemon-stats").innerHTML = data.stats;

  playCryButton.classList.remove("hidden");

  // Keep existing event listener instead of replacing button
  playCryButton.classList.remove("hidden");
  playCryButton.replaceWith(playCryButton.cloneNode(true));
  playCryButton = document.querySelector(".play-cry");

  playCryButton.addEventListener("click", () => {
    const audio = new Audio(data.cry);
    audio.volume = 0.05;
    audio.play();
  });
}

button.addEventListener("click", () => {
  let inputField = document.querySelector(".search");
  let input = inputField.value.trim().toLowerCase();

  if (input === "") {
    document.querySelector(".pokemon-name").textContent =
      "Please enter a Pokémon name!";
    return;
  }

  getPokemonData(input);
  inputField.value = "";
});

document.querySelectorAll(".pokeNames").forEach((button) => {
  button.addEventListener("click", () => {
    getPokemonData(button.value);
  });
});
