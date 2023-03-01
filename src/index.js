import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';

const refs = {
  input: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
  countryInfo: document.querySelector('.country-info'),
};

const DEBOUNCE_DELAY = 300;

refs.input.addEventListener('input', debounce(onInput, DEBOUNCE_DELAY));

function onInput(e) {
  const input = e.target.value;
  if (!input) {
    refs.countryList.innerHTML = '';
    refs.countryInfo.innerHTML = '';
    return;
  }
  fetchCountries(input).then(countries => {
    console.log(countries);
    if (countries.length === 1) {
      refs.countryList.innerHTML = '';
      refs.countryInfo.innerHTML = createCountryInfoMarkup(countries[0]);
    } else if (countries.length > 10) {
      refs.countryInfo.innerHTML = '';
      refs.countryList.innerHTML = '';
      Notify.info('Too many matches found. Please enter a more specific name.');
    } else {
      refs.countryInfo.innerHTML = '';
      const check = createCountriesMarkupArr(countries);
      console.log(check);
      console.log(check[0]);
      refs.countryList.append(...check);
    }
  });
}

function createCountriesMarkupArr(countries) {
  return countries.map(({ flags, name }) => {
    const listItem = document.createElement('li');
    listItem.classList.add('name-container');
    const img = document.createElement('img');
    img.src = flags.png;
    img.alt = flags.alt;
    img.width = '20';
    const span = document.createElement('span');
    // span.classList.add('cl__name');
    span.textContent = name.common;

    listItem.append(img, span);
    return listItem;
  });
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
        <h2 class="name">${name.official}</h2>
      </div>
      <p><span class="atr-name">Capital: </span>${capital[0]}</p>
      <p><span class="atr-name">Population: </span>${population}</p>
      <p><span class="atr-name">Languages: </span>${Object.values(
        languages
      )}</p>`;
}

function fetchCountries(input) {
  return fetch(`https://restcountries.com/v3.1/name/${input}`).then(r => {
    if (!r.ok) Notify.failure('Oops, there is no country with that name');
    return r.json();
  });
}
