const mediumBlue = '#3F72AF';
const offwhite = '#F9F7F7';
const darkBlue = '#112D4E';
const lightBlue = '#DBE2EF'

const symbol = document.getElementById("symbol").textContent.trim();
const companyName = document.getElementById('companyName').textContent.trim();
let interval = "1min";
let date = new Date(new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" })).getTime() + 24 * 60 * 60 * 1000);
// console.log("p\t" + date);

// let date = new Date(new Date().getTime() + 24 * 60 * 60 * 1000);
// console.log("date\t" + date);

let today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
// console.log("q\t" + today);

// let today = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
// console.log("today\t" + today);

let end_date = new Date(today);
// console.log("r\t" + end_date);

// let end_date = new Date(today);
// console.log("end_date\t" + end_date);

let yDate = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
// console.log("s\t" + yDate);

// let yDate = new Date();
// console.log("yDate\t" + yDate);

let yesterday = yDate.getFullYear() + '-' + (yDate.getMonth() + 1) + '-' + yDate.getDate();
// console.log("t\t" + yesterday);

// let yesterday = yDate.getFullYear() + '-' + (yDate.getMonth() + 1) + '-' + yDate.getDate();
// console.log("yesterday\t" + yesterday);

let start_date = new Date(yesterday);
// console.log("u\t" + start_date);

// let start_date = new Date(yesterday);
// console.log("start_date\t" + start_date);

let compare1Date = new Date(yesterday);
// console.log("v\t" + compare1Date);

// let compare1Date = new Date(yesterday);
// console.log("compare1Date\t" + compare1Date);

let compare2Date = new Date(yesterday);
// console.log("w\t" + compare2Date);

// let compare2Date = new Date(yesterday);
// console.log("compare2Date\t" + compare2Date);


const time_series_div = document.getElementById("time_series_duration");
let url_time_series = "https://api.twelvedata.com/time_series?apikey=" + config.api + "&interval=" + interval + "&outputsize=8&symbol=" + symbol + "&end_date=" + today;
const date_input = document.getElementById("date");
let canvas = document.getElementById('myChart');
// const isMarketcloseTag = document.getElementById("isMarketclose");
// const futureDataTag = document.getElementById("futureData");
const notice = document.getElementById("notice");
let preInterval = interval;

let time = [];
let open = [];
let close = [];
let high = [];
let low = [];

const info = document.getElementById("info");
const infoDiv = document.getElementById("infoDiv");
const infoDivContent = document.getElementById('infoDivContent');
const infoDivError = document.getElementById('infoDivError');
const historicalData = document.getElementById("historicalData");
const historicalDataDiv = document.getElementById("historicalDataDiv");
const historicaldivHeading = document.getElementById('historicaldivHeading');
const stockSplitHistory = document.getElementById("stockSplitHistory");
const stockSplitHistoryDiv = document.getElementById("stockSplitHistoryDiv");
const stockSplitHistoryDivContent = document.getElementById("stockSplitHistoryDivContent");
const stockSplitHistoryDivError = document.getElementById('stockSplitHistoryDivError');
const dividendHistory = document.getElementById("dividendHistory");
const dividendHistoryDiv = document.getElementById("dividendHistoryDiv");
const dividendHistoryDivContent = document.getElementById("dividendHistoryDivContent");
const dividendHistoryDivError = document.getElementById("dividendHistoryDivError");
const dividendHistoryDivHeading = document.getElementById('dividendHistoryDivHeading');
// const news = document.getElementById("news");
// const newsDiv = document.getElementById("newsDiv");
infoDiv.style.display = "";
historicalDataDiv.style.display = "none";
dividendHistoryDiv.style.display = "none";
// newsDiv.style.display = "none";
stockSplitHistoryDiv.style.display = "none";

infoDivError.style.display = "none";
stockSplitHistoryDivError.style.display = "none";

// *****************************************************************************************
let myChart;
async function getChart(time, low, high, open, high) {
    const ctx = document.getElementById('myChart').getContext('2d');
    myChart = new Chart(ctx, {
        type: 'line',
        data: {
            labels: time,
            datasets: [{
                label: 'low',
                data: low,
                backgroundColor: [
                    // 'rgba(100, 0, 0, 1)',
                    '#FF6B6B'
                    // "red",
                ],
                borderColor: [
                    '#FF6B6B'
                    // 'rgba(100, 0, 0, 1)',
                    // "red",
                ],
                color: 'white',

                // borderWidth: 1
            },
            {
                label: 'open',
                data: open,
                backgroundColor: [
                    // 'rgba(100, 0, 0, 1)',
                    '#FFD93D'
                    // "red",
                ],
                borderColor: [
                    '#FFD93D'
                    // 'rgba(100, 0, 0, 1)',
                    // "red",
                ],
                color: 'white',

                // borderWidth: 1
            }, {
                label: 'close',
                data: close,
                backgroundColor: [
                    // 'rgba(100, 0, 0, 1)',
                    '#4D96FF'
                    // "red",
                ],
                borderColor: [
                    '#4D96FF'
                    // 'rgba(100, 0, 0, 1)',
                    // "red",
                ],
                color: 'white',

                // borderWidth: 1
            },
            {
                label: 'high',
                data: high,
                backgroundColor: [
                    // 'rgba(222, 99, 132, 0.2)',
                    // "green",
                    '#6BCB77'
                ],
                borderColor: [
                    // 'rgba(222, 99, 132, 1)',
                    // "green",
                    '#6BCB77'
                ],
                color: 'white',
            }]
        },
        options: {
            scales: {
                y: {
                    ticks: {
                        // Include a dollar sign in the ticks
                        callback: function (value, index, ticks) {
                            return '$' + value.toFixed(0);
                        }
                    }
                }
            },
            elements: {
                point: {
                    radius: 2,
                    hoverRadius: 8,
                },
                line: {
                    borderWidth: 1,
                }
            },
            plugins: {
                tooltip: {
                    callbacks: {
                        // title: function () {
                        //     return symbol;
                        // },
                        title: function (context) {
                            return context[0].label.trim();
                        },
                        label: function (context) {
                            let label = context.dataset.label || '';

                            if (label) {
                                label += ': ';
                            }
                            if (context.parsed.y !== null) {
                                label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                            }
                            return label;
                        }


                    }
                }
            }
        }
    });
}

// *****************************************************************************************
const get_interval_data = async (preInterval, interval, start_date, end_date) => {
    // let timeDate = new Date();
    // let currentTime = timeDate.toTimeString().substring(0, 8);

    let timeDate = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }))
    let currentTime = timeDate.toTimeString().substring(0, 8);
    // console.log(currentTime);

    // console.log("getInterval Date is running");
    let marketOpenTime = "09:30:00";
    let sd = new Date(start_date);
    // console.log("a---->\t" + sd);
    // let sd = new Date(start_date);
    // console.log("sd---->\t" + sd);
    // console.log("compare1Date---->\t" + compare1Date);
    // console.log("compare2Date---->\t" + compare2Date);
    // console.log("start_date---->\t" + start_date);
    // console.log("start_date---->\t" + start_date);
    // console.log("end_date---->\t" + end_date);
    // console.log("end_date---->\t" + end_date);
    // console.log("end_date---->\t" + end_date);
    // console.log("yesterday---->\t" + new Date(yesterday));
    // console.log("today---->\t" + new Date(today));
    // console.log(new Date(start_date).getDate() === new Date(yesterday).getDate());
    // console.log(sd);
    // console.log("getintervaldata start");
    // console.log(end_date);
    // console.log(interval);f
    // console.log("getintervaldata end");
    // isMarketcloseTag.style.display = "none";

    const postData = {
        symbol: symbol,
        interval: interval,
        end_date: new Date(end_date).toDateString(),
        start_date: new Date(start_date).toDateString()
    }

    const data2 = await fetch('http://localhost:3000/url_time_series', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
    // console.log("data2");
    // const data3 = await data2.json();
    // console.log(data3);

    // url_time_series = "https://api.twelvedata.com/time_series?apikey=" + config.api + "&interval=" + interval + "&symbol=" + symbol + "&end_date=" + new Date(end_date).toDateString() + "&start_date=" + new Date(start_date).toDateString();
    // console.log(start_date);
    // console.log(url_time_series);
    // const data = await fetch(url_time_series);
    const json_data = await data2.json();
    const arr = await json_data.values;
    // console.log(start_date);
    // if(arr === undefined){
    //     document.getElementById('historicaldiv').innerHTML = "<h1>DATA NOT AVAILABLE</h1>"
    //     return;
    // }

    if (new Date(compare1Date) > new Date(compare2Date)) {
        // futureDataTag.style.display = "";
        canvas.style.display = "none";
        time_series_div.style.display = "none";
        notice.textContent = "Selected Date is in the future. You can only see historical data.";
        notice.style.display = "";
        historicaldivHeading.style.display = "none";
        return;
    }

    if (preInterval === "1week" && currentTime < marketOpenTime && sd.getDay() <= 1 && new Date(start_date).getDate() === new Date(yesterday).getDate()) {
        notice.textContent = "Market for this week is not started yet";
        notice.style.display = "";
        canvas.style.display = "none";
        time_series_div.style.display = "none";
        historicaldivHeading.style.display = "none";
        return;
    }

    if ((sd.getDay() == 0 || sd.getDay() == 6) && (interval != "1week" && interval != "1month")) {
        // isMarketcloseTag.style.display = "block";
        canvas.style.display = "none";
        time_series_div.style.display = "none";
        notice.textContent = "Market is close on weekends";
        notice.style.display = "";
        historicaldivHeading.style.display = "none";
        return;
    }


    if (new Date(start_date).getDate() === new Date(yesterday).getDate() && currentTime < marketOpenTime && (preInterval != "1week" && preInterval != "1month")) {
        // console.log(currentTime);
        // console.log(marketOpenTime);
        // alert("today market not open");
        notice.innerHTML = "Today's market is not open yet";
        notice.style.display = "block";
        canvas.style.display = "none";
        time_series_div.style.display = "none";
        historicaldivHeading.style.display = "none";
        return;
    }


    canvas.style.display = "block";
    time_series_div.style.display = "block";
    historicaldivHeading.style.display = "";
    // futureDataTag.style.display = "none";
    notice.style.display = "none";

    let min = arr.length;
    if (min != 0) {
        let html2 = `<div class="historicaldivHeading">
        <span class="alignLeft">Date</span>
        <span>Time</span>
        <span>Open</span>
        <span>High</span>
        <span>Low</span>
        <span>Close</span>
        </div>`;
        document.getElementById('historicaldivHeading').innerHTML = html2;
    }
    let html = "<hr>";
    if (arr[0].datetime.length > 10) {
        for (let i = 0; i < min; i++) {
            html +=
                `<div>
            <span class="alignLeft">${arr[i].datetime.substring(0, 10)}</span> 
            <span>${arr[i].datetime.substring(10, arr[i].length)}</span> 
            <span>${parseFloat(arr[i].open).toFixed(2)}</span> 
            <span>${parseFloat(arr[i].high).toFixed(2)}</span> 
            <span>${parseFloat(arr[i].low).toFixed(2)}</span> 
            <span>${parseFloat(arr[i].close).toFixed(2)}</span>
            </div><hr>`
        }
    }
    else {
        for (let i = 0; i < min; i++) {
            html +=
                `<div>
            <span class="alignLeft">${arr[i].datetime.substring(0, 10)}</span> 
            <span>-</span> 
            <span>${parseFloat(arr[i].open).toFixed(2)}</span> 
            <span>${parseFloat(arr[i].high).toFixed(2)}</span> 
            <span>${parseFloat(arr[i].low).toFixed(2)}</span> 
            <span>${parseFloat(arr[i].close).toFixed(2)}</span>
            </div><hr>`
        }
    }

    time_series_div.innerHTML = html;

    time = [];
    open = [];
    close = [];
    high = [];
    low = [];
    for (let i = arr.length - 1; i >= 0; i--) {
        if (preInterval == "1week" || preInterval == "1month") {
            time.push(arr[i].datetime);
        }
        else {
            time.push(arr[i].datetime.substring(10, arr[i].length));
        }
        open.push(parseFloat(arr[i].open).toFixed(2));
        close.push(parseFloat(arr[i].close).toFixed(2));
        high.push(parseFloat(arr[i].high).toFixed(2));
        low.push(parseFloat(arr[i].low).toFixed(2));
    }
    updateChart();
}

const getCompanyDetails = async () => {
    infoDivError.style.display = "none";
    let url = 'https://api.polygon.io/v3/reference/tickers/' + symbol + '?apiKey=' + config.polygonAPI1;
    // console.log(url);
    const data = await fetch(url);
    const dataJSON = await data.json();
    // console.log(dataJSON.status);
    if (dataJSON.status == 'NOT_FOUND') {
        infoDivContent.style.display = "none";
        infoDivError.style.display = "";
        return;
    }

    let locale = document.getElementById("locale");
    let primaryExchange = document.getElementById("primaryExchange");
    let typeOfStock = document.getElementById("typeOfStock");
    let cik = document.getElementById("cik");
    let composite_figi = document.getElementById("composite_figi");
    let share_class_figi = document.getElementById("share_class_figi");
    let market_cap = document.getElementById("market_cap");
    let phone_number = document.getElementById("phone_number");
    // let address = document.getElementById("address");
    let sic_code = document.getElementById("sic_code");
    let sic_description = document.getElementById("sic_description")
    let homepage_url = document.getElementById("homepage_url");
    let total_employees = document.getElementById("total_employees");
    let list_date = document.getElementById("list_date");
    let share_class_shares_outstanding = document.getElementById("share_class_shares_outstanding");
    let weighted_shares_outstanding = document.getElementById("weighted_shares_outstanding");

    let homepageUrl = dataJSON.results.homepage_url;

    var formatter = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',

        // These options are needed to round to whole numbers if that's what you want.
        //minimumFractionDigits: 0, // (this suffices for whole numbers, but will print 2500.10 as $2,500.1)
        //maximumFractionDigits: 0, // (causes 2500.99 to be printed as $2,501)
    });

    description.textContent = dataJSON.results.description;
    locale.innerHTML = '<div class="dataDivHeading">Locale</div> <div>' + dataJSON.results.locale + '</div>';
    primaryExchange.innerHTML = '<div class="dataDivHeading">Primary Exchange</div> <div>' + dataJSON.results.primary_exchange + '</div>';
    typeOfStock.innerHTML = '<div class="dataDivHeading">Type Of Stock</div> <div>' + dataJSON.results.type + '</div>';
    cik.innerHTML = '<div class="dataDivHeading">CIK Number</div> <div>' + dataJSON.results.cik + '</div>';
    composite_figi.innerHTML = '<div class="dataDivHeading">Composite Figi Number</div> <div>' + dataJSON.results.composite_figi + '</div>';
    share_class_figi.innerHTML = '<div class="dataDivHeading">Share Class Figi Number</div> <div>' + dataJSON.results.share_class_figi + '</div>';
    market_cap.innerHTML = '<div class="dataDivHeading">Market Cap</div> <div>' + formatter.format(dataJSON.results.market_cap) + '</div>';
    phone_number.innerHTML = '<div class="dataDivHeading">Phone Number</div> <div>' + dataJSON.results.phone_number + '</div>';
    // address.innerHTML = `<div class="dataDivHeading">Address</div> <div>${dataJSON.results.address.address1} <br> 
    //                     ${dataJSON.results.address.city},
    //                     ${dataJSON.results.address.state}<br>
    //                     ${dataJSON.results.address.postal_code}<div>`;
    sic_code.innerHTML = '<div class="dataDivHeading">SIC Code</div> <div>' + dataJSON.results.sic_code + '</div>';
    sic_description.innerHTML = '<div class="dataDivHeading">SIC Description</div> <div>' + dataJSON.results.sic_description + '</div>';
    homepage_url.innerHTML = `<div class="dataDivHeading">Homepage URL</div> <div><a href='${homepageUrl}'>  ${dataJSON.results.homepage_url}  </a></div>`;
    total_employees.innerHTML = '<div class="dataDivHeading">Total Employees</div> <div>' + dataJSON.results.total_employees + '</div>';
    list_date.innerHTML = '<div class="dataDivHeading">List Date</div> <div>' + dataJSON.results.list_date + '</div>';
    share_class_shares_outstanding.innerHTML = '<div class="dataDivHeading">Share Class Outstanding Shares</div> <div>' + dataJSON.results.share_class_shares_outstanding + '</div>';
    weighted_shares_outstanding.innerHTML = '<div class="dataDivHeading">Weighted Outstanding Shares</div> <div>' + dataJSON.results.weighted_shares_outstanding + '</div>';

}

const getStockSplitHistory = async () => {
    stockSplitHistoryDivError.style.display = "none";

    const stockSplitData = document.getElementById("stockSplitData");
    const url = 'https://api.polygon.io/v3/reference/splits?ticker=' + symbol + '&apiKey=' + config.polygonAPI1;
    const data = await fetch(url);
    const dataJSON = await data.json();
    const arr = dataJSON.results;
    // console.log("ssssss---->  " + arr.length);
    if (arr.length === 0) {
        stockSplitHistoryDivContent.style.display = "none";
        stockSplitHistoryDivError.style.display = "";
        return;
    }
    let html = "<hr>";
    for (let i = 0; i < arr.length; i++) {
        html += `<div>
                    <span class="alignLeft">${arr[i].execution_date}</span>
                    <span>${arr[i].split_from}</span>
                    <span>${arr[i].split_to}</span>
                </div><hr>`
    }
    stockSplitData.innerHTML = html;

}

// const getNews = async () => {
//     const url = 'https://api.polygon.io/v2/reference/news?ticker=' + symbol + '&apiKey=' + config.polygonAPI2;
//     const data = await fetch(url);
//     // console.log(data);
//     const dataJSON = await data.json();
//     const arr = dataJSON.results;
//     // console.log(arr.length);
//     if (arr.length === 0) {
//         newsDiv.innerHTML = "<h1>DATA NOT AVAILABLE</h1>";
//         return;
//     }
//     let html = "";
//     for (let i = 0; i < arr.length; i++) {
//         let homepage = arr[i].publisher.homepage_url;
//         homepage = homepage.substring(0, homepage.length - 1);
//         let description = arr[i].description;
//         // console.log(description);
//         // console.log(homepage);
//         // homepage_url = homepage_url.substr(0, homepage_url.length - 1)
//         html += `<div id="newsDiv">
//                     <img src="${arr[i].image_url}" alt="" width="400rem">
//                     <a href="${arr[i].article_url}"><h3>${arr[i].title}</h3></a>`
//         if (description != undefined) {
//             html += `<p>${arr[i].description}</p>`

//         }
//         html += `<a href="${homepage}">
//                         <p><img src="${arr[i].publisher.favicon_url}" alt="" width="20px"> Published by ${arr[i].publisher.name}</p>
//                     </a>
//                 </div>`
//     }
//     newsDiv.innerHTML = html;

// }

const getDividendHistory = async () => {
    dividendHistoryDivError.style.display = "none";
    const url = 'https://api.polygon.io/v3/reference/dividends?ticker=' + symbol + '&apiKey=' + config.polygonAPI3;
    let data = await fetch(url);
    let json_data = await data.json();
    // console.log(json_data.results.length);
    if (json_data.results.length === 0) {
        dividendHistoryDivContent.style.display = "none";
        dividendHistoryDivError.style.display = "";
        return;
    }
    let arr = [];
    let temp_arr = json_data.results;
    // console.log(temp_arr);
    const dividendData = document.getElementById('dividendData');
    // let html = "";
    for (let i = 0; i < temp_arr.length; i++) {
        arr.push(temp_arr[i]);
    }
    // console.log(arr);
    // console.log(json_data.next_url);
    let next_url = json_data.next_url + '&apiKey=' + config.polygonAPI3;

    dividendHistoryDivHeading.style.display = "";
    let html2 = "";
    if (temp_arr.length > 0) {
        html2 = `<div class="dividendHistoryDivHeading">
                    <span class="alignLeft">Dividend Type</span>
                    <span>Declaration Date</span>
                    <span>Pay Date</span>
                    <span>Record Date</span>
                    <span>Cash Amount Per Share</span>
                </div>`
        dividendHistoryDivHeading.innerHTML = html2;
    }

    let html = `<hr>`;

    for (let i = 0; i < temp_arr.length; i++) {
        html += `<div>
        <span class="alignLeft">${temp_arr[i].dividend_type}</span>
        <span>${temp_arr[i].declaration_date}</span>
        <span>${temp_arr[i].pay_date}</span>
        <span>${temp_arr[i].record_date}</span>
        <span>${temp_arr[i].cash_amount.toFixed(2)}</span>
        </div><hr>`;
        // arr.push(temp_arr[i]);
    }


    for (let j = 0; j < 4; j++) {
        if (json_data.next_url != undefined) {
            data = await fetch(next_url);
            json_data = await data.json();
            temp_arr = json_data.results;
            for (let i = 0; i < temp_arr.length; i++) {
                html += `<div>
                <span class="alignLeft">${temp_arr[i].dividend_type}</span>
                <span>${temp_arr[i].declaration_date}</span>
                <span>${temp_arr[i].pay_date}</span>
                <span>${temp_arr[i].record_date}</span>
                <span>${temp_arr[i].cash_amount.toFixed(2)}</span>
                </div><hr>`;
                arr.push(temp_arr[i]);
            }
            next_url = json_data.next_url + '&apiKey=' + config.polygonAPI3;
        }
    }
    dividendData.innerHTML = html;

    // CHART 
    let dividendPayDate = [];
    let dividendAmount = [];
    // console.log(arr);
    for (let i = 0; i < arr.length; i++) {
        dividendPayDate.push(arr[i].pay_date)
        dividendAmount.push(arr[i].cash_amount);
    }
    async function getChart(dividendPayDate, dividendAmount) {
        const context = document.getElementById("dividendChart")
        let dividendChart = new Chart(context, {
            type: 'line',
            data: {
                labels: dividendPayDate,
                datasets: [{
                    label: 'low',
                    data: dividendAmount,
                    backgroundColor: [
                        // 'rgba(100, 0, 0, 1)',
                        '#F10086'
                    ],
                    borderColor: [
                        '#F10086'
                    ],
                    color: 'white',
                }]
            },
            options: {
                scales: {
                    y: {
                        ticks: {
                            callback: function (value, index, ticks) {
                                return '$' + value.toFixed(2);
                            }
                        }
                    }
                },
                elements: {
                    point: {
                        radius: 2,
                        hoverRadius: 8,
                    },
                    line: {
                        borderWidth: 1,
                    }
                },
                plugins: {
                    legend: {
                        display: false
                    },
                    tooltip: {
                        callbacks: {
                            title: function (context) {
                                return context[0].label.trim();
                            },
                            label: function (context) {
                                let label = context.dataset.label || '';

                                if (label) {
                                    label += ': ';
                                }
                                if (context.parsed.y !== null) {
                                    label += new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(context.parsed.y);
                                }
                                return label;
                            }
                        }
                    }
                }
            }
        });
    }
    getChart(dividendPayDate, dividendAmount)
}

getCompanyDetails();
get_interval_data(preInterval, interval, yesterday, today);
getChart(time, low, high, open, close);
getStockSplitHistory();
getDividendHistory();
// getNews();

function updateChart() {
    // console.log("Update Chart is running");
    myChart.data.datasets[0].data = low;
    myChart.data.datasets[1].data = open;
    myChart.data.datasets[2].data = close;
    myChart.data.datasets[3].data = high;
    myChart.data.labels = time;
    myChart.update();
}

function change_interval(e) {
    interval = e.value;
    if (interval == "1day") {
        interval = "5min";
        preInterval = "1day";
        get_interval_data(preInterval, interval, start_date, end_date);
        return;
    }
    if (interval == "1week") {
        isIntervalWeek();
        return;
    }
    if (interval == "1month") {
        isIntervalMonth();
        return;
    }
    // console.log(interval);
    preInterval = interval;
    get_interval_data(preInterval, interval, start_date, end_date);
}

function change_date(e) {
    let day = e.textContent;
    if (day === "Today") {
        date_input.value = date_input.defaultValue;
        preInterval = interval;
        compare1Date = yesterday;
        end_date = today;
        start_date = yesterday
        if (interval == '1week') {
            isIntervalWeek();
            return;
        }
        if (interval == "1month") {
            isIntervalMonth();
            return;
        }
        get_interval_data(preInterval, interval, start_date, end_date);
        return;
    }
    if (day === "Yesterday") {
        date_input.value = date_input.defaultValue;

        let Yesterday = new Date(new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" })).getTime());
        // console.log("b\t" + Yesterday);

        // let Yesterday = new Date(new Date().getTime());
        // console.log("Yesterday\t" + Yesterday);

        let Yesterday_Date = Yesterday.getFullYear() + '-' + (Yesterday.getMonth() + 1) + '-' + Yesterday.getDate();
        // console.log("c\t" + Yesterday_Date);

        // let Yesterday_Date = Yesterday.getFullYear() + '-' + (Yesterday.getMonth() + 1) + '-' + Yesterday.getDate();
        // console.log("Yesterday_Date\t" + Yesterday_Date);

        let db_yesterday = new Date(new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" })).getTime() - 24 * 60 * 60 * 1000);
        // console.log("d\t" + db_yesterday);

        // let db_yesterday = new Date(new Date().getTime() - 24 * 60 * 60 * 1000);
        // console.log("db_yesterday\t" + db_yesterday);

        // *****************************************************************************************************************
        let db_yesterday_date = db_yesterday.getFullYear() + '-' + (db_yesterday.getMonth() + 1) + '-' + db_yesterday.getDate();
        // console.log("e\t" + db_yesterday_date);

        // let db_yesterday_date = db_yesterday.getFullYear() + '-' + (db_yesterday.getMonth() + 1) + '-' + db_yesterday.getDate();
        // console.log("db_yesterday_date\t" + db_yesterday_date);


        end_date = Yesterday_Date;
        start_date = db_yesterday_date;
        compare1Date = db_yesterday_date;
        preInterval = interval;

        if (interval == '1week') {
            isIntervalWeek();
            return;
        }
        if (interval == "1month") {
            isIntervalMonth();
            return;
        }
        get_interval_data(preInterval, interval, start_date, end_date);
        return;
    }


    // let temp_Date = new Date(new Date(new Date(e.value).toLocaleString("en-US", {timeZone: "America/New_York"})).getTime() + 24 * 60 * 60 * 1000);
    // console.log("f\t" + temp_Date);

    let temp_Date = new Date(new Date(e.value).getTime() + 24 * 60 * 60 * 1000);
    // console.log("temp_Date\t" + temp_Date);

    // let temp2_Date = new Date(new Date(new Date(e.value).toLocaleString("en-US", {timeZone: "America/New_York"})).getTime());
    // console.log("g\t" + temp2_Date);



    let temp2_Date = new Date(new Date(e.value).getTime());
    // console.log("temp2_Date\t" + temp2_Date);

    day = temp_Date.getFullYear() + '-' + (temp_Date.getMonth() + 1) + '-' + temp_Date.getDate();
    // console.log("day\t" + day);

    // day = temp_Date.getFullYear() + '-' + (temp_Date.getMonth() + 1) + '-' + temp_Date.getDate();
    // console.log("day\t" + day);


    let before_day = temp2_Date.getFullYear() + '-' + (temp2_Date.getMonth() + 1) + '-' + temp2_Date.getDate();
    // console.log("before_day\t" + before_day);


    // let before_day = temp2_Date.getFullYear() + '-' + (temp2_Date.getMonth() + 1) + '-' + temp2_Date.getDate();


    end_date = day;
    start_date = before_day;
    compare1Date = start_date;
    // console.log(new Date(today).getTime() -  new Date(end_date).getTime());
    if (is2YearsBack()) {
        const date = getWeekStart();
        // console.log(date);
        preInterval = interval;
        get_interval_data(preInterval, "1day", date, end_date);
        return;
    }
    if (interval == "1week") {
        isIntervalWeek();
        return;
    }
    if (interval == "1month") {
        isIntervalMonth();
        return;
    }
    preInterval = interval;
    get_interval_data(preInterval, interval, start_date, end_date);
    // updateChart();
}


function getWeekStart() {
    let date = new Date(start_date);
    let day = date.getDay();
    // console.log("day--->\t" + day);
    let temp;
    if (day >= 1) {
        temp = new Date(new Date(start_date).getTime() - (day - 1) * 24 * 60 * 60 * 1000);
    }
    if (day === 0) {
        temp = new Date(new Date(start_date).getTime() + 24 * 60 * 60 * 1000);
    }
    let tempDate = temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate();
    // console.log("tempDate---->\t" + tempDate);
    return tempDate;
}

function getWeekEnd() {
    let date = new Date(start_date);
    let day = date.getDay();
    // console.log("day--->\t" + day);
    let temp;
    if (day < 6 && day != 0) {
        temp = new Date(end_date);
    }
    else {
        temp = new Date(new Date(start_date).getTime() + (6 - day) * 24 * 60 * 60 * 1000);
    }
    // console.log(start_date);
    let tempDate = temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate();
    // console.log("tempDate---->\t" + tempDate);
    return tempDate;
}

function getMonthStart() {
    let date = new Date(start_date);
    let day = date.getMonth();
    let temp = new Date(date.getFullYear(), date.getMonth(), 1);
    let tempDate = temp.getFullYear() + '-' + (temp.getMonth() + 1) + '-' + temp.getDate();
    return tempDate;
}

function is2YearsBack() {
    if (new Date(today).getTime() - new Date(end_date).getTime() >= 2 * 365 * 24 * 60 * 60 * 1000)
        return true;
    return false;
}

function isIntervalWeek() {
    const date = getWeekStart();
    const date2 = getWeekEnd();
    // console.log(date);
    preInterval = "1week";
    get_interval_data(preInterval, "1h", date, date2);
    return;
}
function isIntervalMonth() {
    const date = getMonthStart();
    // console.log(date);
    preInterval = "1month";
    get_interval_data(preInterval, "1day", date, end_date);
    return;
}


info.parentElement.classList.add('selectedButton');

info.addEventListener("click", function () {
    // console.log(info);
    historicalDataDiv.style.display = "none";
    dividendHistoryDiv.style.display = "none";
    // newsDiv.style.display = "none";
    stockSplitHistoryDiv.style.display = "none";
    infoDiv.style.display = "block";

    info.parentElement.classList.add('selectedButton');
    historicalData.parentElement.classList.remove('selectedButton');
    dividendHistory.parentElement.classList.remove('selectedButton');
    stockSplitHistory.parentElement.classList.remove('selectedButton');
})

historicalData.addEventListener("click", function () {
    // console.log(historicalData);
    infoDiv.style.display = "none";
    dividendHistoryDiv.style.display = "none";
    // newsDiv.style.display = "none";
    stockSplitHistoryDiv.style.display = "none";
    historicalDataDiv.style.display = "block";

    info.parentElement.classList.remove('selectedButton');
    historicalData.parentElement.classList.add('selectedButton');
    dividendHistory.parentElement.classList.remove('selectedButton');
    stockSplitHistory.parentElement.classList.remove('selectedButton');
})

dividendHistory.addEventListener("click", function () {
    infoDiv.style.display = "none";
    historicalDataDiv.style.display = "none";
    // newsDiv.style.display = "none";
    stockSplitHistoryDiv.style.display = "none";
    dividendHistoryDiv.style.display = "block";

    info.parentElement.classList.remove('selectedButton');
    historicalData.parentElement.classList.remove('selectedButton');
    dividendHistory.parentElement.classList.add('selectedButton');
    stockSplitHistory.parentElement.classList.remove('selectedButton');
})

stockSplitHistory.addEventListener("click", function () {
    infoDiv.style.display = "none";
    dividendHistoryDiv.style.display = "none";
    historicalDataDiv.style.display = "none";
    // newsDiv.style.display = "none";
    stockSplitHistoryDiv.style.display = "block";

    info.parentElement.classList.remove('selectedButton');
    historicalData.parentElement.classList.remove('selectedButton');
    dividendHistory.parentElement.classList.remove('selectedButton');
    stockSplitHistory.parentElement.classList.add('selectedButton');
})

function increaseValue() {
    var value = parseInt(document.getElementById('number').value, 10);
    value = isNaN(value) ? 0 : value;
    value++;
    document.getElementById('number').value = value;
}

function decreaseValue() {
    var value = parseInt(document.getElementById('number').value, 10);
    value = isNaN(value) ? 0 : value;
    value < 1 ? value = 1 : '';
    value--;
    document.getElementById('number').value = value;
}

const addToPortfolio = document.getElementById('addToPortfolio');
const addButton = document.getElementById('addButton');
addButton.style.display = "none";
const successfullyAdded = document.getElementById('successfullyAdded')
successfullyAdded.style.display = "none";
const addToPortfolioModal = document.getElementById('addToPortfolioModal');
addToPortfolioModal.style.display = "none";
const confirmAdd = document.getElementById('confirmAdd');
confirmAdd.style.display = "none";

// ERROR MESSAGES IN ADD TO PORTFOLIO MODAL
const quantityMessage = document.getElementById('quantityMessage');
const pricePerShareMessage = document.getElementById('pricePerShareMessage');
const dateOfBuyingMessage = document.getElementById('dateOfBuyingMessage');
quantityMessage.style.display = "none";
pricePerShareMessage.style.display = "none";
dateOfBuyingMessage.style.display = "none";

let price;

getCurrentPrice = async () => {
    const data = await fetch('https://api.twelvedata.com/time_series?apikey=a7d873a9ef674f3991558d933153c0c9&symbol=' + symbol + '&interval=1min');
    const json = await data.json();
    // console.log(json);
    const arr = json.values;
    // console.log(arr[0]);
    // console.log(arr[0].open);
    let value = arr[0].open;
    value = parseFloat(value).toFixed(2);
    // console.log(value);
    price = value;
    return value;
    // console.log(((arr[0].open + arr[0].close)/2).toFixed(2));
}

getCurrentPrice();

let buyDate = yDate.getFullYear() + '-' + (yDate.getMonth() + 1) + '-' + yDate.getDate();
// console.log(buyDate);
// console.log(price);


const getError = () => {
    setInterval(() => {
        // QUANTITY ERROR 
        const quantity = document.getElementById('number').value;
        if (quantity.length === 0) {
            quantityMessage.innerText = "Quantity cannot be empty";
            quantityMessage.style.display = "";
        }
        else if (isNaN(quantity)) {
            quantityMessage.innerHTML = "Quantity must be a number";
            quantityMessage.style.display = "";
        }
        else if (parseInt(quantity) == 0) {
            quantityMessage.innerHTML = "Quantity should be greater than 0";
            quantityMessage.style.display = "";
        }
        else {
            quantityMessage.style.display = "none";
        }

        // PRICE ERROR 
        const customPriceInput = document.getElementById('customPriceInput');
        if (price.length === 0) {
            pricePerShareMessage.innerText = "Price field cannot be empty";
            pricePerShareMessage.style.display = "";
        }
        else if (isNaN(customPriceInput.value)) {
            pricePerShareMessage.innerText = "Price must be a number";
            pricePerShareMessage.style.display = "";
        }
        else {
            pricePerShareMessage.style.display = "none";
        }

        // BUY DATE ERROR 
        let buyday = new Date(buyDate).getDay();
        let marketOpenTime = "09:30:00";
        let timeDate = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }))
        let currentTime = timeDate.toTimeString().substring(0, 8);
        // console.log("buyDate\t" + new Date(buyDate));
        // console.log(compare2Date);
        if (buyDate.length === 0) {
            dateOfBuyingMessage.innerText = "Date field cannot be empty";
            dateOfBuyingMessage.style.display = "";
        }
        else if (new Date(new Date(buyDate).setHours(0, 0, 0, 0)) > compare2Date) {
            dateOfBuyingMessage.innerText = "Selected date is in the future";
            dateOfBuyingMessage.style.display = "";
        }
        else if (buyday === 0 || buyday === 6) {
            dateOfBuyingMessage.innerText = "Market is closed on weekends";
            dateOfBuyingMessage.style.display = "";
            dateOfBuyingMessage.style.display = "";
        }
        else if (new Date(buyDate).getDate() === new Date(yesterday).getDate() && currentTime < marketOpenTime) {
            dateOfBuyingMessage.innerText = "Today's market is not open yet";
            dateOfBuyingMessage.style.display = "";
        }
        else {
            dateOfBuyingMessage.style.display = "none";
        }
    }, 20);
}

getError();

const noError = () => {
    if (quantityMessage.style.display == "none"
        && pricePerShareMessage.style.display == "none"
        && dateOfBuyingMessage.style.display == "none") {
        return true;
    }
    return false;
}

function getCustomDate() {
    const customDateInput = document.getElementById('customDateInput');
    buyDate = customDateInput.value;
    // console.log("customDate---->   " + buyDate);
    // console.log(new Date(new Date(buyDate).setHours(0,0,0,0)));
}

function getCustomPrice() {
    const customPriceInput = document.getElementById('customPriceInput');
    price = customPriceInput.value;
    // console.log("custommPrice----->" + price);
}

let dateInterval;
let priceInterval;
// let dateInterval = setInterval(getCustomDate , 100);
// let priceInterval = setInterval(getCustomPrice, 100);

const customPriceInput = document.getElementById('customPriceInput');
const customDateInput = document.getElementById('customDateInput');
const customPrice = document.getElementById('customPrice');
const customDate = document.getElementById('customDate');
const currentPrice = document.getElementById('currentPrice');
const currentDate = document.getElementById('currentDate');

customDateInput.value = "";
customPriceInput.style.display = "none";
customDateInput.style.display = "none";
currentPrice.classList.add('red');
currentDate.classList.add('red');

addToPortfolio.addEventListener('click', () => {
    document.querySelector('#addToPortfolio button').classList.add('selectedButton');
    addToPortfolioModal.style.display = "";
    currentDate.style.setProperty('color', offwhite);

    currentDate.style.setProperty('background-color', mediumBlue);
    currentPrice.style.setProperty('color', offwhite);
    currentPrice.style.setProperty('background-color', mediumBlue);

    customPrice.addEventListener('click', () => {
        customPriceInput.style.display = "";
        customPrice.style.setProperty('color', offwhite);
        customPrice.style.setProperty('background-color', mediumBlue);
        currentPrice.style.setProperty('color', darkBlue);
        currentPrice.style.setProperty('background-color', offwhite);
        clearInterval(priceInterval);
        priceInterval = setInterval(getCustomPrice, 100);
    })
    customDate.addEventListener('click', () => {
        customDateInput.style.display = "";
        customPriceInput.style.display = "";
        customDate.style.setProperty('color', offwhite);
        customDate.style.setProperty('background-color', mediumBlue);
        customPrice.style.setProperty('color', offwhite);
        customPrice.style.setProperty('background-color', mediumBlue);
        currentDate.style.setProperty('color', darkBlue);
        currentDate.style.setProperty('background-color', offwhite);
        currentPrice.style.setProperty('color', darkBlue);
        currentPrice.style.setProperty('background-color', offwhite);
        clearInterval(dateInterval);
        dateInterval = setInterval(getCustomDate, 100);
        clearInterval(priceInterval);
        priceInterval = setInterval(getCustomPrice, 100);
    })
    currentPrice.addEventListener('click', async () => {
        customPriceInput.style.display = "none";
        currentPrice.style.setProperty('color', offwhite);
        currentPrice.style.setProperty('background-color', mediumBlue);
        customPrice.style.setProperty('color', darkBlue);
        customPrice.style.setProperty('background-color', offwhite);
        clearInterval(priceInterval);
        price = await getCurrentPrice();
        // console.log("currentPrice--->" + price);
    })
    currentDate.addEventListener('click', () => {
        currentDate.style.setProperty('color', offwhite);
        currentDate.style.setProperty('background-color', mediumBlue);
        customDate.style.setProperty('color', darkBlue);
        customDate.style.setProperty('background-color', offwhite);
        clearInterval(dateInterval);
        customDateInput.style.display = "none";
        const date = new Date(new Date().toLocaleString("en-US", { timeZone: "America/New_York" }));
        buyDate = date.getFullYear() + '-' + (date.getMonth() + 1) + '-' + date.getDate();
        // console.log("today----->" + buyDate);
    })

    setInterval(() => {
        if (noError()) {
            addButton.style.display = "";
        }
        else {
            addButton.style.display = "none";
        }
    }, 0);
})


getCurrentQuantity = async () => {
    const postData = {
        symbol: symbol
    }
    const data = await fetch('http://localhost:3000/currentHolding', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
    const jsonData = await data.json();
    const prevQuantity = jsonData.prevQuantity;
    document.getElementById('currentQuantity').innerHTML = "Current Holding: " + prevQuantity;
    document.getElementById('number').value = 1;
}

// getCurrentQuantity();

addButton.addEventListener('click', function () {
    // console.log("addbutton is loaded");
    addToPortfolioModal.style.display = "none";
    confirmAdd.style.display = "";
    const quantity = document.getElementById('quantity');
    const pricePerShare = document.getElementById('pricePerShare');
    const dateOfBuying = document.getElementById('dateOfBuying');
    // console.log('price---->' + price);
    // console.log('buydate--->' + buyDate);
    quantity.innerText = document.getElementById('number').value;
    pricePerShare.innerText = price;
    dateOfBuying.innerText = buyDate;
})

backButton.addEventListener('click', function () {
    addToPortfolioModal.style.display = "";
    confirmAdd.style.display = "none";
})

const successfullyAddedHide = () => {
    successfullyAdded.style.display = "none";
}

let timeout;

confirmButton.addEventListener('click', function () {
    document.querySelector('#addToPortfolio button').classList.remove('selectedButton');
    const quantity = document.getElementById('quantity').innerText;
    let pricePerShare = document.getElementById('pricePerShare').innerText;
    pricePerShare = parseFloat(pricePerShare);
    pricePerShare = pricePerShare.toFixed(2);
    // console.log(pricePerShare);
    const dateOfBuying = document.getElementById('dateOfBuying').innerText;

    const postData = {
        companyName: companyName,
        symbol: symbol,
        quantity: quantity,
        pricePerShare: pricePerShare,
        dateOfBuying: dateOfBuying
    }

    fetch('http://localhost:3000/stocks/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
    confirmAdd.style.display = "none";
    clearTimeout(timeout)
    successfullyAdded.style.display = "";
    timeout = setTimeout(successfullyAddedHide, 2000);
})



const currentHoldingModal = document.getElementById('currentHoldingModal');
currentHoldingModal.style.display = "none";
const currentHolding = document.getElementById('currentHolding');
const currentHoldingModalError = document.getElementById('currentHoldingModalError');
currentHoldingModalError.style.display = "none";
const currentHoldingModalHeading = document.getElementById('currentHoldingModalHeading');

const getCurrentHolding = async () => {
    document.querySelector('#currentHolding button').classList.add('selectedButton');
    currentHoldingModalError.style.display = "none";
    const postData = {
        symbol: symbol
    }
    const data = await fetch('http://localhost:3000/currentHoldingModal', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });
    const json = await data.json();
    // console.log(json[0].price.toFixed(2));
    const currentHoldingDataDiv = document.getElementById('currentHoldingDataDiv');
    currentHoldingModal.style.display = "";
    if (json.length === 0) {
        document.getElementsByClassName('modal-content3')[0].style.height = '40vh';
        currentHoldingDataDiv.style.display = "none";
        currentHoldingModalHeading.style.display = "none";
        currentHoldingModalError.style.display = "";
    }
    else {
        document.getElementsByClassName('modal-content3')[0].style.height = '70vh';
        currentHoldingModalHeading.style.display = "";
        currentHoldingModalError.style.display = "none";
        currentHoldingDataDiv.style.display = "";
        let html = "";
        html += `<div class="currentHoldingModalTableHeading">
                    <span class="alignLeft">S.No</span>
                    <span>Symbol</span>
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
            // console.log(price);
            html += `<div>
                        <span class="alignLeft">${index + 1}</span>
                        <span>${json[index].symbol}</span>
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

const remove = async (e) => {
    const id = e.getAttribute('name');
    // console.log(id);
    const postData = {
        symbol: symbol,
        stock_id: id,
    }
    await fetch('http://localhost:3000/currentHoldingModal/remove', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
    });

    await getCurrentHolding();
}

currentHolding.addEventListener('click', async () => {
    await getCurrentHolding();
})

window.onclick = function (event) {
    if (event.target == addToPortfolioModal) {
        addToPortfolioModal.style.display = "none";
        document.querySelector('#addToPortfolio button').classList.remove('selectedButton');
    }
    if (event.target == currentHoldingModal) {
        document.querySelector('#currentHolding button').classList.remove('selectedButton');
        currentHoldingModal.style.display = "none";
    }
    if (event.target == confirmAdd) {
        confirmAdd.style.display = "none";
    }
}

// Selection Button Event Listeners 

document.getElementById('today').style.setProperty('color', offwhite, '');
document.getElementById('today').style.setProperty('background-color', mediumBlue, '');
document.getElementById('1m').style.setProperty('color', offwhite, '');
document.getElementById('1m').style.setProperty('background-color', mediumBlue, '');
document.getElementById('date').value = '';

document.getElementById('today').addEventListener('click', () => {
    document.getElementById('today').style.setProperty('color', offwhite, '');
    document.getElementById('today').style.setProperty('background-color', mediumBlue, '');
    document.getElementById('yesterday').style = "";
})
document.getElementById('yesterday').addEventListener('click', () => {
    document.getElementById('yesterday').style.setProperty('color', offwhite, '');
    document.getElementById('yesterday').style.setProperty('background-color', mediumBlue, '');
    document.getElementById('today').style = '';
})
document.getElementById('date').addEventListener('change', () => {
    document.getElementById('today').style = '';
    document.getElementById('yesterday').style = '';
})

document.getElementById('1m').addEventListener('click', () => {
    document.getElementById('1m').style.setProperty('color', offwhite, '');
    document.getElementById('1m').style.setProperty('background-color', mediumBlue, '');
    document.getElementById('1m').style.setProperty('font-weight', '700', '');

    document.getElementById('5m').style = '';
    document.getElementById('15m').style = '';
    document.getElementById('30m').style = '';
    document.getElementById('45m').style = '';
    document.getElementById('1h').style = '';
    document.getElementById('1D').style = '';
    document.getElementById('1W').style = '';
    document.getElementById('1M').style = '';
})
document.getElementById('5m').addEventListener('click', () => {
    document.getElementById('5m').style.setProperty('color', offwhite, '');
    document.getElementById('5m').style.setProperty('background-color', mediumBlue, '');
    document.getElementById('5m').style.setProperty('font-weight', '700', '');

    document.getElementById('1m').style = '';
    document.getElementById('15m').style = '';
    document.getElementById('30m').style = '';
    document.getElementById('45m').style = '';
    document.getElementById('1h').style = '';
    document.getElementById('1D').style = '';
    document.getElementById('1W').style = '';
    document.getElementById('1M').style = '';
})
document.getElementById('15m').addEventListener('click', () => {
    document.getElementById('15m').style.setProperty('color', offwhite, '');
    document.getElementById('15m').style.setProperty('background-color', mediumBlue, '');
    document.getElementById('15m').style.setProperty('font-weight', '700', '');

    document.getElementById('5m').style = '';
    document.getElementById('1m').style = '';
    document.getElementById('30m').style = '';
    document.getElementById('45m').style = '';
    document.getElementById('1h').style = '';
    document.getElementById('1D').style = '';
    document.getElementById('1W').style = '';
    document.getElementById('1M').style = '';
})
document.getElementById('30m').addEventListener('click', () => {
    document.getElementById('30m').style.setProperty('color', offwhite, '');
    document.getElementById('30m').style.setProperty('background-color', mediumBlue, '');
    document.getElementById('30m').style.setProperty('font-weight', '700', '');

    document.getElementById('5m').style = '';
    document.getElementById('15m').style = '';
    document.getElementById('1m').style = '';
    document.getElementById('45m').style = '';
    document.getElementById('1h').style = '';
    document.getElementById('1D').style = '';
    document.getElementById('1W').style = '';
    document.getElementById('1M').style = '';
})
document.getElementById('45m').addEventListener('click', () => {
    document.getElementById('45m').style.setProperty('color', offwhite, '');
    document.getElementById('45m').style.setProperty('background-color', mediumBlue, '');
    document.getElementById('45m').style.setProperty('font-weight', '700', '');

    document.getElementById('5m').style = '';
    document.getElementById('15m').style = '';
    document.getElementById('30m').style = '';
    document.getElementById('1m').style = '';
    document.getElementById('1h').style = '';
    document.getElementById('1D').style = '';
    document.getElementById('1W').style = '';
    document.getElementById('1M').style = '';
})
document.getElementById('1h').addEventListener('click', () => {
    document.getElementById('1h').style.setProperty('color', offwhite, '');
    document.getElementById('1h').style.setProperty('background-color', mediumBlue, '');
    document.getElementById('1h').style.setProperty('font-weight', '700', '');

    document.getElementById('5m').style = '';
    document.getElementById('15m').style = '';
    document.getElementById('30m').style = '';
    document.getElementById('45m').style = '';
    document.getElementById('1m').style = '';
    document.getElementById('1D').style = '';
    document.getElementById('1W').style = '';
    document.getElementById('1M').style = '';
})
document.getElementById('1D').addEventListener('click', () => {
    document.getElementById('1D').style.setProperty('color', offwhite, '');
    document.getElementById('1D').style.setProperty('background-color', mediumBlue, '');
    document.getElementById('1D').style.setProperty('font-weight', '700', '');

    document.getElementById('5m').style = '';
    document.getElementById('15m').style = '';
    document.getElementById('30m').style = '';
    document.getElementById('45m').style = '';
    document.getElementById('1h').style = '';
    document.getElementById('1m').style = '';
    document.getElementById('1W').style = '';
    document.getElementById('1M').style = '';
})
document.getElementById('1W').addEventListener('click', () => {
    document.getElementById('1W').style.setProperty('color', offwhite, '');
    document.getElementById('1W').style.setProperty('background-color', mediumBlue, '');
    document.getElementById('1W').style.setProperty('font-weight', '700', '');

    document.getElementById('5m').style = '';
    document.getElementById('15m').style = '';
    document.getElementById('30m').style = '';
    document.getElementById('45m').style = '';
    document.getElementById('1h').style = '';
    document.getElementById('1D').style = '';
    document.getElementById('1m').style = '';
    document.getElementById('1M').style = '';
})
document.getElementById('1M').addEventListener('click', () => {
    document.getElementById('1M').style.setProperty('color', offwhite, '');
    document.getElementById('1M').style.setProperty('background-color', mediumBlue, '');
    document.getElementById('1M').style.setProperty('font-weight', '700', '');

    document.getElementById('5m').style = '';
    document.getElementById('15m').style = '';
    document.getElementById('30m').style = '';
    document.getElementById('45m').style = '';

    document.getElementById('1h').style = '';
    document.getElementById('1D').style = '';
    document.getElementById('1W').style = '';
    document.getElementById('1m').style = '';
})

