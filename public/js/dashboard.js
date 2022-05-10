console.log('hello');
const dashboard = document.getElementById('dashboard')
dashboard.classList.add('currently-selected');
const profile = document.getElementById('profile');
const liability = document.getElementById('liability')
const insurance = document.getElementById('insurance')
const stocks = document.getElementById('stocks')
const crypto = document.getElementById('crypto');

const userDataDiv = document.getElementById('user-data');
const profileDataDiv = document.getElementById('profile-data')
const stocksDataDiv = document.getElementById('stocks-data')
const insuranceDataDiv = document.getElementById('insurance-data')
const liabilityDataDiv = document.getElementById('liability-data')
const cryptoDataDiv = document.getElementById('crypto-data')

const getUserData = async () => {
    const postData = {};
    const data = await fetch('http://localhost:3000/username', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
    const json = await data.json();
    const userName = json.userName;
    userDataDiv.innerHTML = `<h2>Greetings, ${userName}</h2>`
}

const getProfileData = async () => {
    const postData = {};
    const data = await fetch('http://localhost:3000/dashboard/profile', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
    
}
const getInsuranceData = async () => {
    const postData = {};
    const data = await fetch('http://localhost:3000/dashboard/insurance', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
}
const getCryptoData = async () => {
    const postData = {};
    const data = await fetch('http://localhost:3000/dashboard/crypto', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
}
const getStocksData = async () => {
    const postData = {};
    const data = await fetch('http://localhost:3000/dashboard/stocks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
    const json = await data.json();
}
const getLiabilityData = async () => {
    const postData = {};
    const data = await fetch('http://localhost:3000/dashboard/liability', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
}

getUserData();
getStocksData();