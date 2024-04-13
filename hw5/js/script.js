"use strict";

const exchangeRatesDateEl = document.querySelector('#exchangeRatesDate');
exchangeRatesDateEl.value = getCurrentDate();

exchangeRatesDateEl.addEventListener('input', updateExchangeRates)
updateExchangeRates();

function getCurrentDate() {
  const currentDate = new Date();
  const year = currentDate.getFullYear();
  const month = String(currentDate.getMonth() + 1).padStart(2, '0');
  const day = String(currentDate.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

function updateExchangeRates() {
  const apiAddress = `https://api.nbrb.by/exrates/rates?ondate=${exchangeRatesDateEl.value}&periodicity=0`;
  const exchangeRatesEl = document.querySelector('div.ratesContent');
  exchangeRatesEl.innerHTML = '';

  fetch(apiAddress)
    .then((response) => response.json())
    .then((parseResult) => {
        let i = 0;
        parseResult.forEach(el => {
          const divEl = document.createElement('div');
          divEl.classList.add('ratesContent__currency');
          if (i % 2 === 0) divEl.classList.add('ratesContent__currency_dark');

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

          divEl.appendChild(abbrEl);
          divEl.appendChild(scaleEl);
          divEl.appendChild(nameEl);
          divEl.appendChild(rateEl)

          exchangeRatesEl.appendChild(divEl);
          i++;
        })
      }
    );
}