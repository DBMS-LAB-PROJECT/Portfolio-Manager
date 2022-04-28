let stocks_data;
let obj_data;
let obj_array;

const container = document.querySelector("#list");
let index = 0;
const loader = document.getElementById('loading');

const getpost = async () => {
    // let url_stocks = "https://api.twelvedata.com/stocks?apikey=" + config.api + "&country=usa";
    if (stocks_data === undefined) {
        const postData = {};
        const data2 = await fetch('http://localhost:3000/getAllCompanies', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });
        // stocks_data = await fetch(url_stocks);
        // obj_data = await stocks_data.json();
        obj_data = await data2.json();
    }
    obj_array = await obj_data.data;

    // for (let i = 0; i < 50; i++) {
    //     const htmlData = `
    //     <form action="/stocks" method="post">
    //             <input type="hidden" value="${obj_array[index + i].symbol}" name="company_symbol">
    //             <button><span class="symbol">
    //             ${obj_array[index + i].symbol}
    //                 </span></button>

    //             <input type="hidden" value="${obj_array[index + i].name}" name="company_name">
    //             <span>
    //             ${obj_array[index + i].name}
    //             </span>
    //             <span>
    //             ${obj_array[index + i].currency}
    //             </span>
    //             <span>
    //             ${obj_array[index + i].exchange}
    //             </span>
    //             <span>
    //             ${obj_array[index + i].country}
    //             <span>
    //             ${obj_array[index + i].type}
    //             </span>
    //             <br>
    //         </form>`;
    //     container.insertAdjacentHTML("beforeend", htmlData);
    // }
    // loader.classList.add("hide");

}

getpost();

// const showdata = () => {
//     loader.classList.remove("hide");
//     setTimeout(() => {
//         index += 50;
//         getpost();
//     }, 500)
// }

// window.addEventListener('scroll', () => {
//     const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
//     if (clientHeight + scrollTop >= scrollHeight) {
//         console.log(index);
//         showdata();
//     }
// })

const searchbar = document.getElementById("searchbar");
searchbar.value = "";
const search_list = document.getElementById("search_list");

const searchResultDiv = document.getElementById('searchResultDiv');
searchResultDiv.style.display = "none";
let symbol_arr = [];
let name_arr = [];

searchbar.addEventListener("keyup", (e) => {
    const query = e.target.value.toLowerCase();
    // console.log(query);
    symbol_arr = [];
    name_arr = [];
    obj_array.forEach(company => {
        if (company.symbol.toLowerCase().includes(query) || company.name.toLowerCase().includes(query)) {
            // console.log(company.symbol + "\t\t" + company.name);
            symbol_arr.push(company.symbol);
            name_arr.push(company.name);
        }
    });
    // console.log(symbol_arr.length);
    if (symbol_arr.length == 0) {
        searchResultDiv.style.display = "none";
    }

    let html = ''
    let n = 4;
    if (n > symbol_arr.length) {
        n = symbol_arr.length
    }
    for (let i = 0; i < n; i++) {
        html += `<form action="/stocks" method="post">
                <input type="hidden" value="${symbol_arr[i]}" name="company_symbol">
                <input type="hidden" value="${name_arr[i]}" name="company_name">
                <button type="submit" class="resultList">
                    <div class='companyName'>${name_arr[i]}</div>
                    <div class='symbol'>${symbol_arr[i]}</div>
                </button>
                </form>`
    }
    search_list.innerHTML = html;
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

