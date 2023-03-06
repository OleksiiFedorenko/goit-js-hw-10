import { Notify } from 'notiflix/build/notiflix-notify-aio';

export function fetchCountries(input) {
  return fetch(`https://restcountries.com/v3.1/name/${input}`).then(r => {
    if (!r.ok) Notify.failure('Oops, there is no country with that name');
    return r.json();
  });
}
