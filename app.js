import { currencies, exchangeRates } from './currencyData.js';

const elements = {
    form: document.getElementById('converter-form'),
    amountInput: document.getElementById('amount'),
    fromCurrency: document.getElementById('from-currency'),
    toCurrency: document.getElementById('to-currency'),
    fromFlag: document.querySelector('.from img'),
    toFlag: document.querySelector('.to img'),
    rateMessage: document.querySelector('.rate-message'),
    convertBtn: document.querySelector('.convert-btn'),
    exchangeBtn: document.querySelector('.exchange-icon'),
    resultsSection: document.querySelector('.results-section'),
    fromAmount: document.getElementById('from-amount'),
    fromCode: document.getElementById('from-code'),
    toAmount: document.getElementById('to-amount'),
    toCode: document.getElementById('to-code'),
    popularRates: document.getElementById('popular-rates')
};

const popularCurrencies = ['USD', 'EUR', 'GBP', 'JPY', 'AUD', 'CAD', 'CHF', 'CNY', 'INR'];

function init() {
    populateCurrencyDropdowns();
    setupEventListeners();
    updateRateMessage();
}

function populateCurrencyDropdowns() {
    Object.keys(currencies).forEach(code => {
        const option1 = document.createElement('option');
        const option2 = document.createElement('option');
        
        option1.value = option2.value = code;
        option1.textContent = option2.textContent = code;
        
        if (code === 'USD') option1.selected = true;
        if (code === 'INR') option2.selected = true;
        
        elements.fromCurrency.appendChild(option1);
        elements.toCurrency.appendChild(option2);
    });
}

function updateFlags() {
    const fromCode = elements.fromCurrency.value;
    const toCode = elements.toCurrency.value;
    
    elements.fromFlag.src = `https://flagsapi.com/${currencies[fromCode]}/flat/64.png`;
    elements.toFlag.src = `https://flagsapi.com/${currencies[toCode]}/flat/64.png`;
}

function updateRateMessage() {
    const fromCode = elements.fromCurrency.value;
    const toCode = elements.toCurrency.value;
    const rate = getExchangeRate(fromCode, toCode);
    elements.rateMessage.textContent = `1 ${fromCode} = ${rate} ${toCode}`;
}

function getExchangeRate(from, to) {
    if (from === to) return 1;
    return (exchangeRates[to] / exchangeRates[from]).toFixed(4);
}

function convertCurrency(amount, from, to) {
    const rate = getExchangeRate(from, to);
    return (amount * rate).toFixed(2);
}

function showResults(amount, from, to) {
    const convertedAmount = convertCurrency(amount, from, to);
    
    elements.fromAmount.textContent = amount;
    elements.fromCode.textContent = from;
    elements.toAmount.textContent = convertedAmount;
    elements.toCode.textContent = to;
    
    displayPopularRates(amount, from);
    
    elements.resultsSection.style.display = 'block';
}

function displayPopularRates(amount, baseCurrency) {
    elements.popularRates.innerHTML = '';
    
    popularCurrencies.forEach(currency => {
        if (currency !== baseCurrency) {
            const rate = convertCurrency(amount, baseCurrency, currency);
            createRateItem(currency, rate, elements.popularRates);
        }
    });
}

function createRateItem(currency, rate, container) {
    const rateItem = document.createElement('div');
    rateItem.className = 'rate-item';
    rateItem.innerHTML = `
        <div class="currency-code">${currency}</div>
        <div>${rate}</div>
    `;
    container.appendChild(rateItem);
}

async function handleSubmit(e) {
    e.preventDefault();
    
    const amount = parseFloat(elements.amountInput.value);
    const from = elements.fromCurrency.value;
    const to = elements.toCurrency.value;
    
    if (isNaN(amount)) {
        alert('Please enter a valid amount');
        return;
    }
    
    try {
        elements.convertBtn.disabled = true;
        elements.convertBtn.textContent = 'Converting...';
        
        showResults(amount, from, to);
        
    } catch (error) {
        console.error('Conversion error:', error);
        alert('Failed to convert currencies. Please try again.');
    } finally {
        elements.convertBtn.disabled = false;
        elements.convertBtn.textContent = 'Convert Currency';
    }
}

function swapCurrencies() {
    const temp = elements.fromCurrency.value;
    elements.fromCurrency.value = elements.toCurrency.value;
    elements.toCurrency.value = temp;
    updateFlags();
    updateRateMessage();
}

function setupEventListeners() {
    elements.form.addEventListener('submit', handleSubmit);
    elements.fromCurrency.addEventListener('change', () => {
        updateFlags();
        updateRateMessage();
    });
    elements.toCurrency.addEventListener('change', () => {
        updateFlags();
        updateRateMessage();
    });
    elements.exchangeBtn.addEventListener('click', swapCurrencies);
    elements.amountInput.addEventListener('input', updateRateMessage);
}

document.addEventListener('DOMContentLoaded', init);