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
    const json = await data.json();
    profileDataDiv.innerHTML = `
        <div>${json.first_name} ${json.last_name}</div>
        <div>${json.profession}</div>`
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
    const json = await data.json();
    console.log(json);
    let html = `<h2>Insurance</h2>
        <table>
        <thead>
            <th>Type</th>
            <th>Insurer</th>
            <th>Ending Date</th>
        </thead>
        <tbody>
    `;
    for(var i = 0; i < json.length; i++){
        html += `
        <tr>
            <td>${json[i].type}</td>
            <td>${json[i].insurer}</td>
            <td>${json[i].endingDate}</td>
        </tr>`
    }
    html += `</tbody></table>`;
    insuranceDataDiv.innerHTML = html;
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
    const data = await fetch('http://localhost:3000/dashboard/liabilities', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
    const json = await data.json();
    liabilityDataDiv.innerHTML = `
        <h2>Liability</h2>
        <div>Annual Income: ${json.income_expense.monthlyIncome}</div>
        <div>Monthly Income: ${json.income_expense.annualIncome}</div>
        <div>Total Loan Amount: ${json.total_loan_amount}</div>`
}

getUserData();
getStocksData();
getLiabilityData();
getProfileData();
getInsuranceData();