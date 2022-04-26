
const currentHoldingModalError = document.getElementById('currentHoldingModalError');
currentHoldingModalError.style.display = "none";

let obj_array;

const getCurrentHolding = async () => {
    currentHoldingModalError.style.display = "none";
    const postData = {};
    const data = await fetch('http://localhost:3000/currentHoldings', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
    const json = await data.json();
    obj_array = json;
    // console.log(json);
    // console.log(json[0].price.toFixed(2));
    const currentHoldingDataDiv = document.getElementById('currentHoldingDataDiv');
    // currentHoldingModal.style.display = "";
    if (json.length === 0) {
        // document.getElementsByClassName('modal-content3')[0].style.height = '40vh';
        currentHoldingDataDiv.style.display = "none";
        // currentHoldingModalHeading.style.display = "none";
        currentHoldingModalError.style.display = "";
    }
    else {
        // document.getElementsByClassName('modal-content3')[0].style.height = '70vh';
        // currentHoldingModalHeading.style.display = "";
        currentHoldingModalError.style.display = "none";
        currentHoldingDataDiv.style.display = "";
        let html = "";
        html += `<div class="currentHoldingModalTableHeading">
                    <span class="alignLeft">S.No</span>
                    <span>Symbol</span>
                    <span class="alignLeft">Company Name</span>
                    <span>Quantity</span>
                    <span>Price Per Share <br> ($)</span>
                    <span>Date of purchase</span>
                    <span>Total Cost Price <br> ($)</span>
                    <span style="visibility: hidden;">Remove</span>
                </div><hr>`
        for (let index = 0; index < json.length; index++) {
            const price = json[index].price.toFixed(2);
            // console.log(price);
            let costprice = parseFloat(json[index].quantity * json[index].price);
            // console.log(costprice.toFixed(2));
            costprice = costprice.toFixed(2);
            html += `<div>
                        <span class="alignLeft">${index + 1}</span>
                        <span>${json[index].symbol}</span>
                        <span class="alignLeft">${json[index].companyName}</span>
                        <span>${json[index].quantity}</span>
                        <span>${price}</span>
                        <span>${json[index].buyDate.substring(0, 10)}</span>
                        <span>${costprice}</span>
                        <span name="${json[index].stock_id}" class="removeTag" onclick='remove(this)'><i class="fa-solid fa-circle-minus"></i></span>
                    </div><hr>`
        };
        currentHoldingDataDiv.innerHTML = html;
    }
}

getCurrentHolding();

const remove = async (e) => {
    const id = e.getAttribute('name');
    console.log(id);
    const postData = {
        stock_id: id,
    }
    await fetch('http://localhost:3000/currentHoldings/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });

    await getCurrentHolding();
}

const searchbar = document.getElementById("searchbar");
searchbar.value = "";
const search_list = document.getElementById("search_list");

const searchResultDiv = document.getElementById('searchResultDiv');
searchResultDiv.style.display = "none";
let symbol_arr = [];
let name_arr = [];


searchbar.addEventListener("keyup", async (e) => {
    const query = e.target.value.toLowerCase();
    // console.log(query);
    symbol_arr = [];
    name_arr = [];
    obj_array.forEach(company => {
        if (company.symbol.toLowerCase().includes(query) || company.companyName.toLowerCase().includes(query)) {
            // console.log(company.symbol + "\t\t" + company.name);
            symbol_arr.push(company.symbol);
            name_arr.push(company.companyName);
        }
    });
    // console.log(symbol_arr);

    if (symbol_arr.length == 0) {
        searchResultDiv.style.display = "none";
    }

    const postData = {
        searchItem: query
    };
    // console.log(postData);
    const data = await fetch('http://localhost:3000/currentHoldings/search', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
    const json = await data.json();
    obj_array = json;
    const currentHoldingDataDiv = document.getElementById('currentHoldingDataDiv');
    if (json.length === 0) {
        currentHoldingDataDiv.style.display = "none";
    }
    else {
        currentHoldingDataDiv.style.display = "";
        let html = "";
        html += `<div class="currentHoldingModalTableHeading">
                    <span class="alignLeft">S.No</span>
                    <span>Symbol</span>
                    <span class="alignLeft">Company Name</span>
                    <span>Quantity</span>
                    <span>Price Per Share</span>
                    <span>Date of purchase</span>
                    <span>Total Cost Price</span>
                    <span style="visibility: hidden;">Remove</span>
                </div><hr>`
        for (let index = 0; index < json.length; index++) {
            const price = json[index].price.toFixed(2);
            let costprice = json[index].quantity * json[index].price;
            costprice = costprice.toFixed(2);
            html += `<div>
                        <span class="alignLeft">${index + 1}</span>
                        <span>${json[index].symbol}</span>
                        <span class="alignLeft">${json[index].companyName}</span>
                        <span>${json[index].quantity}</span>
                        <span>${price}</span>
                        <span>${json[index].buyDate.substring(0, 10)}</span>
                        <span>${costprice}</span>
                        <span name="${json[index].stock_id}" class="removeTag" onclick='remove(this)'><i class="fa-solid fa-circle-minus"></i></span>
                    </div><hr>`
        };
        currentHoldingDataDiv.innerHTML = html;
    }

    if (query.length === 0) {
        search_list.innerHTML = '';
    }
})

setInterval(() => {
    if (searchbar.value.length == 0 || symbol_arr.length == 0) {
        searchResultDiv.style.display = "none";
    }
    else {
        searchResultDiv.style.display = "";
    }
}, 0);