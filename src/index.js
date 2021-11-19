import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import fetchCountries from './js/fetch-countries.js';
import debounce from 'lodash/debounce';

const DEBOUNCE_DELAY = 300;

const searchInputEl = document.querySelector('#search-box');
const counteryList = document.querySelector('.country-list');
const countryInfo = document.querySelector('.country-info');


const counterListItem = (filtredArr) => {
    counteryList.innerHTML = '';
    countryInfo.innerHTML = '';
        filtredArr.forEach(({ name, flags: {svg}}) => {
            const listItem = `<li style="list-style: none;"><img src="${svg}" width="20" style="margin-right: 4px;"></use>${name}</li>`;
            counteryList.insertAdjacentHTML("beforeend", listItem);
        });
}

const clear = () => {
    counteryList.innerHTML = '';
    countryInfo.innerHTML = '';
}

const countryInfoItem = (filtredArr) => {
        counteryList.innerHTML = '';
        countryInfo.innerHTML = '';
        filtredArr.forEach(({ flags: {svg}, name, capital, population, languages, }) => {
            const item = `<h1 style="margin: 0;"><img src="${svg}" width="25" height="25" style="margin-right: 4px;">${name}</h1>
            <ul style="margin: 0; padding: 0;">
            <li style="list-style: none;"><strong>Capital:</strong> ${capital}</li>
            <li style="list-style: none;"><strong>Population:</strong> ${population}</li>
            <li style="list-style: none;"><strong>languages:</strong> ${languages.map(el => el.name).join(', ')}</li>
            </ul>`;
            countryInfo.insertAdjacentHTML("beforeend", item);
    });
}

    

function onSearch(event) {
    if (event.target.value !== "") {
    fetchCountries(event.target.value).then(data => {
        console.log(data)
        if (data.length > 2 && data.length < 10) {
            const filtredData = data.filter(el => el.name.toLowerCase().includes(event.target.value.toLowerCase()));
            counterListItem(filtredData);
        } else if (data.length === 1) {
            const filtredData = data.filter(el => el.name.toLowerCase().includes(event.target.value.toLowerCase()));
            countryInfoItem(filtredData);
        } else if (data.length > 10){
            clear();
            Notify.info('Cogito ergo sum"Too many matches found. Please enter a more specific name.');
        }else if (data.length !== ''){
            clear();
            Notify.failure("Oops, there is no country with that name");
        }
    }).catch(error => {
        console.log(error);
    })
    }else {
        clear();
    }
}


searchInputEl.addEventListener('input', debounce(onSearch, DEBOUNCE_DELAY));