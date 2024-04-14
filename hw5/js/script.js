"use strict";

const exchangeRatesDateEl = document.querySelector('#exchangeRatesDate');
exchangeRatesDateEl.value = getDate();

exchangeRatesDateEl.addEventListener('input', showExchangeRates);
showExchangeRates();

let currencyDynamicsEl = undefined;
document.addEventListener('click', function (e) {
  const currencyDynamicEls = document.querySelectorAll('div.currencyDynamics');
  if (currencyDynamicsEl !== undefined && !currencyDynamicsEl.contains(e.target)) currencyDynamicsEl.remove();
}, true);

function getDate(monthAgo = 0) {
  const currentDate = new Date();

  if (monthAgo > 0) currentDate.setMonth(currentDate.getMonth() - monthAgo);

  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function showExchangeRates() {
  const apiAddress = `https://api.nbrb.by/exrates/rates?ondate=${exchangeRatesDateEl.value}&periodicity=0`;
  const ratesContentEl = document.querySelector('div.ratesContent');
  ratesContentEl.innerHTML = '';

  fetch(apiAddress)
    .then((response) => response.json())
    .then((parseResult) => {
      let i = 0;
      parseResult.forEach(el => {
        const currencyEl = document.createElement('div');
        currencyEl.classList.add('ratesContent__line');
        if (i % 2 === 0) currencyEl.classList.add('ratesContent__line_dark');

        const idEl = document.createElement('span');
        idEl.classList.add('ratesContent__id');
        idEl.innerHTML = el.Cur_ID;

        const abbrEl = document.createElement('span');
        abbrEl.classList.add('ratesContent__abbr');
        abbrEl.innerHTML = el.Cur_Abbreviation;

        const scaleEl = document.createElement('span');
        scaleEl.classList.add('ratesContent__scale');
        scaleEl.innerHTML = el.Cur_Scale;

        const nameEl = document.createElement('span');
        nameEl.classList.add('ratesContent__name');
        nameEl.innerHTML = el.Cur_Name;

        const rateEl = document.createElement('span');
        rateEl.classList.add('ratesContent__rate');
        rateEl.innerHTML = el.Cur_OfficialRate;

        currencyEl.appendChild(idEl);
        currencyEl.appendChild(abbrEl);
        currencyEl.appendChild(scaleEl);
        currencyEl.appendChild(nameEl);
        currencyEl.appendChild(rateEl)

        currencyEl.addEventListener('click', function (e) {
          if (currencyDynamicsEl === undefined || !currencyDynamicsEl.contains(e.target)) showCurrencyDynamics(e.currentTarget.firstElementChild.textContent, this);
        });

        ratesContentEl.appendChild(currencyEl);

        i++;
      });
    });
}

function showCurrencyDynamics(curId, currencyEl) {
  const startdate = getDate(1);
  const enddate = getDate();
  const apiAddress = `https://api.nbrb.by/exrates/rates/dynamics/${curId}?startdate=${startdate}&enddate=${enddate}`;

  fetch(apiAddress)
    .then((response) => response.json())
    .then((parseResult) => {

      currencyDynamicsEl = document.createElement('div');
      currencyDynamicsEl.classList.add('currencyDynamics');
      currencyEl.appendChild(currencyDynamicsEl);

      let i = 0;
      parseResult.forEach(el => {
        const divEl = document.createElement('div');
        divEl.classList.add('currencyDynamics__line');
        if (i % 2 === 0) divEl.classList.add('currencyDynamics__line_dark');

        const date = new Date(el.Date);
        const formattedDate = date.toLocaleString('en-US', {year: 'numeric', month: '2-digit', day: '2-digit'});

        const dateEl = document.createElement('span');
        dateEl.classList.add('currencyDynamics__date');
        dateEl.innerHTML = formattedDate;

        const rateEl = document.createElement('span');
        rateEl.classList.add('currencyDynamics__rate');
        rateEl.innerHTML = el.Cur_OfficialRate;

        divEl.appendChild(dateEl);
        divEl.appendChild(rateEl)

        currencyDynamicsEl.appendChild(divEl);

        i++;
      });
    });
}
