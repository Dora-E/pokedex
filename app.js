// DOM Objects
const mainScreen = document.querySelector('.main-screen');
const pokeName = document.querySelector('.poke-name');
const pokeId = document.querySelector('.poke-id');
const pokeFrontImage = document.querySelector('.poke-front-image');
const pokeBackImage = document.querySelector('.poke-back-image');
const pokeTypeOne = document.querySelector('.poke-type-one');
const pokeTypeTwo = document.querySelector('.poke-type-two');
const pokeWeight = document.querySelector('.poke-weight');
const pokeHeight = document.querySelector('.poke-height');
const pokeListItems = document.querySelectorAll('.list-item');
const leftBtn = document.querySelector('.left-button');
const rightBtn = document.querySelector('.right-button');

//Constants and variables

const TYPES = [
  'normal',
  'fighting',
  'grass',
  'poison',
  'ground',
  'rock',
  'bug',
  'ghost',
  'steel',
  'water',
  'fire',
  'flying',
  'ice',
  'dragon',
  'electric',
  'dark',
  'psychic',
  'fairy',
];
let prevUrl = null;
let nextUrl = null;

//functions

const resetScreen = () => {
  mainScreen.classList.remove('hide');
  for (const type of TYPES) {
    mainScreen.classList.remove(type);
  }
};
const capitalize = (str) => str[0].toUpperCase() + str.substr(1);

const fetchPoke = (url) => {
  fetch(url)
    .then((res) => res.json())
    .then((data) => {
      const { results, previous, next } = data;
      prevUrl = previous;
      nextUrl = next;

      for (let i = 0; i < pokeListItems.length; i++) {
        const pokeListItem = pokeListItems[i];
        const resultData = results[i];

        if (resultData) {
          const { name, url } = resultData;
          const urlArray = url.split('/');
          const id = urlArray[urlArray.length - 2];

          pokeListItem.textContent = id + '. ' + capitalize(name);
        } else {
          pokeListItem.textContent = '';
        }
      }
    });
};

const fecthPokeData = (id) => {
  fetch(`https://pokeapi.co/api/v2/pokemon/${id}`)
    .then((res) => res.json())
    .then((data) => {
      resetScreen();
      const dataTypes = data[['types']];

      const dataFirstType = dataTypes[0];
      const dataSecondType = dataTypes[1];
      pokeTypeOne.textContent = capitalize(dataFirstType['type']['name']);
      if (dataSecondType) {
        pokeTypeTwo.classList.remove('hide');
        pokeTypeTwo.textContent = capitalize(dataSecondType['type']['name']);
      } else {
        pokeTypeTwo.classList.add('hide');
        pokeTypeTwo.textContent = '';
      }
      mainScreen.classList.add(dataFirstType['type']['name']);

      pokeName.textContent = capitalize(data['name']);
      pokeId.textContent = '#' + data['id'].toString().padStart(3, '0');
      pokeWeight.textContent = data['weight'];
      pokeHeight.textContent = data['height'];
      pokeFrontImage.src = data['sprites']['front_default'] || '';
      pokeBackImage.src = data['sprites']['back_default'] || '';
    });
};
const handleLeftBtn = () => {
  if (prevUrl) {
    fetchPoke(prevUrl);
  }
};
const handleRightBtn = () => {
  if (nextUrl) {
    fetchPoke(nextUrl);
  }
};
const handleItem = (e) => {
  if (!e.target) return;
  const listItem = e.target;
  if (!listItem.textContent) return;

  const id = listItem.textContent.split('.')[0];
  fecthPokeData(id);
};

//events listener

leftBtn.addEventListener('click', handleLeftBtn);
rightBtn.addEventListener('click', handleRightBtn);

for (const pokeListItem of pokeListItems) {
  pokeListItem.addEventListener('click', handleItem);
}

//initialize app

fetchPoke('https://pokeapi.co/api/v2/pokemon?limit=20&offset=0');
