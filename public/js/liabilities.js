document.getElementById("homeBtn").addEventListener("click", () => {
    location.href = "/";
});

document.getElementById("aboutBtn").addEventListener("click", () => {
    location.href = "/about";
});

document.getElementById("contactBtn").addEventListener("click", () => {
    location.href = "/contact";
});

document.getElementById("dashboardBtn").addEventListener("click", () => {
    location.href = "/dashboard";
});


let modal = document.getElementById("myModal");
let MIn, MEx;

let monthlIn = document.getElementById("monthlyIn");
let annualIn = document.getElementById("annualIn");
monthlIn.addEventListener("click", () => { showIn_Ex(MIn, "Monthly Income"); });
annualIn.addEventListener("click", () => { showIn_Ex(MIn, "Monthly Income"); });

let monthlEx = document.getElementById("monthlyEx");
let annualEx = document.getElementById("annualEx");
monthlEx.addEventListener("click", () => { showIn_Ex(MEx, "Monthly Expenses"); });
annualEx.addEventListener("click", () => { showIn_Ex(MEx, "Monthly Expenses"); });

getMonthlyInEx();
addClickEventToEditBtn();


async function getMonthlyInEx() {

    const response = await fetch("/getMonthlyIncomeExpense.json");
    const getData = await response.json();

    MIn = getData.monthly_income;
    MEx = getData.monthly_expenses;

};


async function addClickEventToEditBtn() {

    const response = await fetch("/getLiabilityNames.json")
    const getData = await response.json();
    const liabilities = getData.liabilities;

    liabilities.forEach(function (liability) {

        let getTheBtn = document.getElementById(liability.type);
        getTheBtn.addEventListener("click", showFormData);
    });
};


async function showFormData() { 

    const response = await fetch("/liabilities/edit/" + this.id);
    const getData = await response.json();

    let formHtml = ` <span id="closeBtn" class="close">&times;</span>
    <div>
        <h3>${getData.liability_name}</h3>
    </div>
    
    <form action="/liabilities/edit/${getData.liability_name}" method="post">

        <div class="elements">
            <label for="liability">Liability Type:</label>
            <input type="text" name="liability" value="${getData.liability_name}" readonly>
        </div>

        <div>
            <label for="amount">Amount:</label>
            <input type="number" name="amount" value="${getData.liability[getData.amount]}">
        </div>

        <div>
            <label for="ineterest_rate">Interest rate:</label>
            <input type="number" name="interest_rate" value="${getData.liability[getData.rate]}" step=".01">
        </div>

        <div>
            <label for="duration">Duration(in years):</label>
            <input type="number" name="duration" value="${getData.liability[getData.duration]}">
        </div>

        <div>
            <label for="date">Borrowing Date:</label>
            <input type="date" name="date" value="${getData.liability[getData.date]}">
        </div>

        <button class="saveBtn" type="submit">Save</button>
        
    </form>
    <p><i class="fa fa-info-circle"></i>Interest will be calculated and reflected in the table</p>`

    modal.style.display = "block";
    document.getElementById("formData").innerHTML = formHtml;
    closeModal();
};


function showIn_Ex(value, label) {

    let formHtml = ` <span id="closeBtn" class="close">&times;</span>
    <div>
        <h3>
            ${label}
        </h3>
    </div>
    <form action="/liabilities/update/${label}" method="post">
        <div>
            <label for="amount">${label}:</label>
            <input type="number" name="amount" value="${value}">
        </div>

        <button class="saveBtn" type="submit">Save</button>
        
    </form>`

    if (label === "Monthly Income") {
        formHtml += `<p><i class="fa fa-info-circle"></i>Annual Income = 12 x Monthly Income</p>`
    }

    if (label === "Monthly Expenses") {
        formHtml += `<p><i class="fa fa-info-circle"></i>Annual Expenses = 12 x Monthly Expenses</p>`
    }

    modal.style.display = "block";
    document.getElementById("formData").innerHTML = formHtml;
    closeModal();

};


function closeModal() {

    let closeBtn = document.getElementById("closeBtn");
    closeBtn.addEventListener("click", () => { modal.style.display = "none"; });
    window.onclick = function (event) {
        if (event.target == modal) {
            modal.style.display = "none";
        }
    }
};
