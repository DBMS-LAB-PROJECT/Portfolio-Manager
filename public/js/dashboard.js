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
    userDataDiv.innerHTML = `<h2><p>Greetings,</p> <span>${userName}</span></h2>`
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
    let fname = json.first_name;
    let lname = json.last_name;
    let prof = json.profession;
    let html = `<h2>Profile</h2>`;
    if(fname === null && lname === null && prof === null || fname === "" && lname === "" && prof === "")
    {
        html += `
            <div class="empty-msg">
                <i class="fa-solid fa-circle-exclamation"></i>
                <p>No Data to show</p>
                <p>Please add profile details</p>
            </div>
        `;
    }
    else
    {
        html = `
            <h2>Profile</h2>
            <div>
                <div>
                    <p>Name:</p><span>${fname} ${lname}</span> 
                </div>
                <div>
                    <p>Profession:</p><span>${prof}</span> 
                </div>
            </div>
        `;
    }
    profileDataDiv.innerHTML = html;
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
    let html = `<h2>Insurance</h2>`;
    if(json.length === 0){
        html += `
            <div class="empty-msg">
                <i class="fa-solid fa-circle-exclamation"></i>
                <p>No Data to show</p>
                <p>Please add insurance details</p>
            </div>
        `;
    }
    else{
        html += `
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
    }
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
    console.log(json);
    
    let growthPercentage = (parseFloat(json.growthRate)).toFixed(2);
    let rows = json.sqlData;
    const uniqueSymbolArr = json.uniqueSymbolArr;
    let html = `<h2>Stocks</h2>`;
    html += `<div>Total Invested</div>`
    html += `<div class="totalInvested">$${json.totalCostPrice}</div>`
    
    if(growthPercentage >= 0){
        html += '<h3>Growth:</h3>'
        html += `<span id="growth">${growthPercentage}%</span>`
    }
    else{
        html += '<h3>Loss:</h3>'
        html += `<span id="loss">${growthPercentage * -1}%</span>`
    }

    html += '<p>List of current holdings in stock:</p>';
    for(let i = 0; i < uniqueSymbolArr.length; i++){
        html += `<div>${uniqueSymbolArr[i].symbol}</div> `;
    }

    const stocksData = document.getElementById('stocks-data');
    stocksData.innerHTML = html;
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
        <div>
            <div>
                <p>Annual Income: </p><span>${json.income_expense.annualIncome}</span>
            </div>
            <div>
                <p>Annual Expense: </p><span>${json.income_expense.annualExpense}</span>
            </div>
            <div>
                <p>Total Loan Amount: </p><span>${json.total_loan_amount}</span>
            </div>
        </div>
    `;
}

getUserData();
getStocksData();
getLiabilityData();
getProfileData();
getInsuranceData();