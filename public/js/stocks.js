let stocks_data;
let obj_data;
let obj_array;

const container = document.querySelector("#list");
let index = 0;
const loader = document.getElementById('loading');

const getpost = async () => {
    let url_stocks = "https://api.twelvedata.com/stocks?apikey=" + config.api + "&country=usa";
    if (stocks_data === undefined) {
        stocks_data = await fetch(url_stocks);
        obj_data = await stocks_data.json();
    }
    obj_array = await obj_data.data;

    for (let i = 0; i < 50; i++) {
        const htmlData = `
        <form action="/stocks" method="post">
                <input type="hidden" value="${obj_array[index + i].symbol}" name="company_symbol">
                <button><span class="symbol">
                ${obj_array[index + i].symbol}
                    </span></button>

                <input type="hidden" value="${obj_array[index + i].name}" name="company_name">
                <span>
                ${obj_array[index + i].name}
                </span>
                <span>
                ${obj_array[index + i].currency}
                </span>
                <span>
                ${obj_array[index + i].exchange}
                </span>
                <span>
                ${obj_array[index + i].country}
                <span>
                ${obj_array[index + i].type}
                </span>
                <br>
            </form>`;
        container.insertAdjacentHTML("beforeend", htmlData);
    }
    loader.classList.add("hide");

}

getpost();

const showdata = () => {
    loader.classList.remove("hide");
    setTimeout(() => {
        index += 50;
        getpost();
    }, 500)
}

window.addEventListener('scroll', () => {
    const { scrollHeight, scrollTop, clientHeight } = document.documentElement;
    if (clientHeight + scrollTop >= scrollHeight) {
        console.log(index);
        showdata();
    }
})

const searchbar = document.getElementById("searchbar");
const search_list = document.getElementById("search_list");

searchbar.addEventListener("keyup", (e) => {
    const query = e.target.value.toLowerCase();
    // console.log(query);
    const symbol_arr = [];
    const name_arr = [];
    obj_array.forEach(company => {
        if (company.symbol.toLowerCase().includes(query) || company.name.toLowerCase().includes(query)) {
            console.log(company.symbol + "\t\t" + company.name);
            symbol_arr.push(company.symbol);
            name_arr.push(company.name);
        }
    });
    let html = ''
    let n = 10;
    if(n > symbol_arr.length){
        n = symbol_arr.length 
    }
    for (let i = 0; i < n; i++) {
        html += `<form action="/stocks" method="post">
                <input type="hidden" value="${symbol_arr[i]}" name="company_symbol">
                <input type="hidden" value="${name_arr[i]}" name="company_name">
                <button type="submit"><div>${symbol_arr[i]} ${name_arr[i]}</div></button>
                </form>`
    }
    search_list.innerHTML = html;
    if (query.length === 0) {
        search_list.innerHTML = '';
    }
})


