import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './js/fetch-countries';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;
const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const input = e.target.value.trim();
  if (!input) return clearElements();
  if (e.target.value !== input) return;

  fetchCountries(input)
    .then(changeMarkup)
    .catch(e => console.log(e));
}

function changeMarkup(countries) {
  if (countries.length > 10) {
    clearElements();
    Notify.info('Too many matches found. Please enter a more specific name.');
  } else if (countries.length === 1) {
    clearElements();
    refs.countryInfo.innerHTML = createCountryInfoMarkup(countries[0]);
  } else if (countries.length > 1) {
    clearElements();
    refs.countryList.innerHTML = createCountryListMarkup(countries);
  } else {
    clearElements();
  }
}

function createCountryListMarkup(countries) {
  return countries
    .map(
      ({ flags, name }) =>
        `<li class="name-container">
        <img
          src="${flags.png}"
          alt="${flags.alt}"
          width="20"
        /><span>${name.common}</span>
      </li>`
    )
    .join('');
}

function createCountryInfoMarkup({
  flags,
  name,
  capital,
  population,
  languages,
}) {
  return `<div class="name-container">
        <img
          src="${flags.png}"
          alt="${flags.alt}"
          width="30"
        />
        <h2 class="name">${name.common}</h2>
      </div>
      <p><span class="atr-name">Capital: </span>${capital[0]}</p>
      <p><span class="atr-name">Population: </span>${population}</p>
      <p><span class="atr-name">Languages: </span>${Object.values(
        languages
      )}</p>`;
}

function clearElements() {
  refs.countryList.innerHTML = '';
  refs.countryInfo.innerHTML = '';
}

// function createCountriesMarkupArr(countries) {
//   return countries.map(({ flags, name }) => {
//     const listItem = document.createElement('li');
//     listItem.classList.add('name-container');
//     const img = document.createElement('img');
//     img.src = flags.png;
//     img.alt = flags.alt;
//     img.width = '20';
//     const span = document.createElement('span');
//     // span.classList.add('cl__name');
//     span.textContent = name.common;

//     listItem.append(img, span);
//     return listItem;
//   });
// }
