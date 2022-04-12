const symbol = document.getElementById("symbol").textContent.trim();
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
const historicalData = document.getElementById("historicalData");
const infoDiv = document.getElementById("infoDiv");
const historicalDataDiv = document.getElementById("historicalDataDiv");
const stockSplitHistory = document.getElementById("stockSplitHistory");
const stockSplitHistoryDiv = document.getElementById("stockSplitHistoryDiv");
const dividendHistory = document.getElementById("dividendHistory");
const dividendHistoryDiv = document.getElementById("dividendHistoryDiv");
const news = document.getElementById("news");
const newsDiv = document.getElementById("newsDiv");
historicalDataDiv.style.display = "none";
dividendHistoryDiv.style.display = "none";
newsDiv.style.display = "none";
stockSplitHistoryDiv.style.display = "none";

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

    url_time_series = "https://api.twelvedata.com/time_series?apikey=" + config.api + "&interval=" + interval + "&symbol=" + symbol + "&end_date=" + new Date(end_date).toDateString() + "&start_date=" + new Date(start_date).toDateString();
    // console.log(start_date);
    // console.log(url_time_series);
    const data = await fetch(url_time_series);
    const json_data = await data.json();
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
        return;
    }

    if (preInterval === "1week" && currentTime < marketOpenTime && sd.getDay() <= 1 && new Date(start_date).getDate() === new Date(yesterday).getDate()) {
        notice.textContent = "Market for this week is not started yet";
        notice.style.display = "";
        canvas.style.display = "none";
        time_series_div.style.display = "none";
        return
    }
    if (new Date(start_date).getDate() === new Date(yesterday).getDate() && currentTime < marketOpenTime && (preInterval != "1week" && preInterval != "1month")) {
        // console.log(currentTime);
        // console.log(marketOpenTime);
        // alert("today market not open");
        notice.innerHTML = "Today's market is not open yet";
        notice.style.display = "block";
        canvas.style.display = "none";
        time_series_div.style.display = "none";
        return;
    }


    if ((sd.getDay() == 0 || sd.getDay() == 6) && (interval != "1week" && interval != "1month")) {
        // isMarketcloseTag.style.display = "block";
        canvas.style.display = "none";
        time_series_div.style.display = "none";
        notice.textContent = "Market is close today";
        notice.style.display = "";
        return;
    }

    canvas.style.display = "block";
    time_series_div.style.display = "block";
    // futureDataTag.style.display = "none";
    notice.style.display = "none";

    let min = arr.length;
    let html = "";
    for (let i = 0; i < min; i++) {
        html +=
            `<div><span>${arr[i].datetime}</span> <span>${parseFloat(arr[i].open).toFixed(2)}</span> <span>${parseFloat(arr[i].high).toFixed(2)}</span> <span>${parseFloat(arr[i].low).toFixed(2)}</span> <span>${parseFloat(arr[i].close).toFixed(2)}</span></div>`
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
    let url = 'https://api.polygon.io/v3/reference/tickers/' + symbol + '?apiKey=' + config.polygonAPI1;
    // console.log(url);
    const data = await fetch(url);
    const dataJSON = await data.json();
    // console.log(dataJSON.status);
    if (dataJSON.status == 'NOT_FOUND') {
        infoDiv.innerHTML = "<h1>DATA NOT AVAILABLE</h1>";
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
    let address = document.getElementById("address");
    let sic_code = document.getElementById("sic_code");
    let sic_description = document.getElementById("sic_description")
    let homepage_url = document.getElementById("homepage_url");
    let total_employees = document.getElementById("total_employees");
    let list_date = document.getElementById("list_date");
    let share_class_shares_outstanding = document.getElementById("share_class_shares_outstanding");
    let weighted_shares_outstanding = document.getElementById("weighted_shares_outstanding");

    let homepageUrl = dataJSON.results.homepage_url;

    description.textContent = dataJSON.results.description;
    locale.textContent = 'Locale: ' + dataJSON.results.locale;
    primaryExchange.textContent = 'Primary Exchange: ' + dataJSON.results.primary_exchange;
    typeOfStock.textContent = 'Type Of Stock: ' + dataJSON.results.type;
    cik.textContent = 'CIK Number: ' + dataJSON.results.cik;
    composite_figi.textContent = 'Composite Figi Number: ' + dataJSON.results.composite_figi;
    share_class_figi.textContent = 'Share Class Figi Number: ' + dataJSON.results.share_class_figi;
    market_cap.textContent = 'Market Cap: ' + '$' + dataJSON.results.market_cap;
    phone_number.textContent = 'Phone Number: ' + dataJSON.results.phone_number;
    address.innerHTML = `Address: <div>${dataJSON.results.address.address1} <br> 
                        <p>${dataJSON.results.address.city}</p> 
                        <p>${dataJSON.results.address.state} </p>
                        <p>${dataJSON.results.address.postal_code}</p><div>`;
    sic_code.textContent = 'SIC Code: ' + dataJSON.results.sic_code;
    sic_description.textContent = 'SIC Description: ' + dataJSON.results.sic_description;
    homepage_url.innerHTML = `Homepage URL: <a href='${homepageUrl}'>  ${dataJSON.results.homepage_url}  </a>`;
    total_employees.textContent = 'Total Employees: ' + dataJSON.results.total_employees;
    list_date.textContent = 'List Date: ' + dataJSON.results.list_date;
    share_class_shares_outstanding.textContent = 'Share Class Outstanding Shares: ' + dataJSON.results.share_class_shares_outstanding;
    weighted_shares_outstanding.textContent = 'Weighted Outstanding Shares: ' + dataJSON.results.weighted_shares_outstanding;



}

const getStockSplitHistory = async () => {
    const stockSplitData = document.getElementById("stockSplitData");
    const url = 'https://api.polygon.io/v3/reference/splits?ticker=' + symbol + '&apiKey=' + config.polygonAPI1;
    const data = await fetch(url);
    const dataJSON = await data.json();
    const arr = dataJSON.results;
    // console.log("ssssss---->  " + arr.length);
    if (arr.length === 0) {
        stockSplitHistoryDiv.innerHTML = "<h1>DATA NOT AVAILABLE</h1>";
        return;
    }
    let html = "";
    for (let i = 0; i < arr.length; i++) {
        html += `<div>
                    <span>${arr[i].execution_date}</span>
                    <span>${arr[i].split_from}</span>
                    <span>${arr[i].split_to}</span>
                </div>`
    }
    stockSplitData.innerHTML = html;

}

const getNews = async () => {
    const url = 'https://api.polygon.io/v2/reference/news?ticker=' + symbol + '&apiKey=' + config.polygonAPI2;
    const data = await fetch(url);
    // console.log(data);
    const dataJSON = await data.json();
    const arr = dataJSON.results;
    // console.log(arr.length);
    if (arr.length === 0) {
        newsDiv.innerHTML = "<h1>DATA NOT AVAILABLE</h1>";
        return;
    }
    let html = "";
    for (let i = 0; i < arr.length; i++) {
        let homepage = arr[i].publisher.homepage_url;
        homepage = homepage.substring(0, homepage.length - 1);
        let description = arr[i].description;
        // console.log(description);
        // console.log(homepage);
        // homepage_url = homepage_url.substr(0, homepage_url.length - 1)
        html += `<div id="newsDiv">
                    <img src="${arr[i].image_url}" alt="" width="400rem">
                    <a href="${arr[i].article_url}"><h3>${arr[i].title}</h3></a>`
        if (description != undefined) {
            html += `<p>${arr[i].description}</p>`

        }
        html += `<a href="${homepage}">
                        <p><img src="${arr[i].publisher.favicon_url}" alt="" width="20px"> Published by ${arr[i].publisher.name}</p>
                    </a>
                </div>`
    }
    newsDiv.innerHTML = html;

}

const getDividendHistory = async () => {
    const url = 'https://api.polygon.io/v3/reference/dividends?ticker=' + symbol + '&apiKey=' + config.polygonAPI3;
    let data = await fetch(url);
    let json_data = await data.json();
    console.log(json_data.results.length);
    if (json_data.results.length === 0) {
        dividendHistoryDiv.innerHTML = "<h1>DATA NOT AVAILABLE</h1>";
        return;
    }
    let arr = [];
    let temp_arr = json_data.results;
    const dividendData = document.getElementById('dividendData');
    // let html = "";
    arr.push(temp_arr);
    let next_url = json_data.next_url + '&apiKey=' + config.polygonAPI3;
    for (let j = 0; j < 4; j++) {
        if (next_url.length > 0) {
            data = await fetch(next_url);
            json_data = await data.json();
            temp_arr = json_data.results;
            for (let i = 0; i < temp_arr.length; i++) {
                const html = `<div>
                <span>${temp_arr[i].dividend_type}</span>
                <span>${temp_arr[i].declaration_date}</span>
                <span>${temp_arr[i].pay_date}</span>
                <span>${temp_arr[i].record_date}</span>
                <span>${temp_arr[i].cash_amount.toFixed(2)}</span>
                </div>`;
                dividendData.insertAdjacentHTML('beforeend', html);
                arr.push(temp_arr[i]);
            }
            next_url = json_data.next_url + '&apiKey=' + config.polygonAPI3;
        }
    }
    let dividendPayDate = [];
    let dividendAmount = [];
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
getNews();

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

info.addEventListener("click", function () {
    // console.log(info);
    historicalDataDiv.style.display = "none";
    dividendHistoryDiv.style.display = "none";
    newsDiv.style.display = "none";
    stockSplitHistoryDiv.style.display = "none";
    infoDiv.style.display = "block";
})

historicalData.addEventListener("click", function () {
    // console.log(historicalData);
    infoDiv.style.display = "none";
    dividendHistoryDiv.style.display = "none";
    newsDiv.style.display = "none";
    stockSplitHistoryDiv.style.display = "none";
    historicalDataDiv.style.display = "block";
})

dividendHistory.addEventListener("click", function () {
    infoDiv.style.display = "none";
    historicalDataDiv.style.display = "none";
    newsDiv.style.display = "none";
    stockSplitHistoryDiv.style.display = "none";
    dividendHistoryDiv.style.display = "block";
})

news.addEventListener("click", function () {
    infoDiv.style.display = "none";
    dividendHistoryDiv.style.display = "none";
    historicalDataDiv.style.display = "none";
    stockSplitHistoryDiv.style.display = "none";
    newsDiv.style.display = "block";
})

stockSplitHistory.addEventListener("click", function () {
    infoDiv.style.display = "none";
    dividendHistoryDiv.style.display = "none";
    historicalDataDiv.style.display = "none";
    newsDiv.style.display = "none";
    stockSplitHistoryDiv.style.display = "block";
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

// document.getElementById('number').addEventListener('keypress', function (event) {
//     console.log('hello');
//     console.log(event.key);
//     if (event.key === 'Enter') {
//         event.preventDefault();
//     }
// })

const addButton = document.getElementById('addButton');
addButton.style.display = "none";
const successfullyAdded = document.getElementById('successfullyAdded')
successfullyAdded.style.display = "none";
const successfullyUpdated = document.getElementById('successfullyUpdated')
successfullyUpdated.style.display = "none";
const alreadyHaveSelectedStock = document.getElementById('alreadyHaveSelectedStock');
alreadyHaveSelectedStock.style.display = "none";
const alreadyHaveSelectedStockMessage = document.getElementById('alreadyHaveSelectedStockMessage');

setInterval(() => {
    const quantity = document.getElementById('number').value;
    if (!isNaN(quantity) && parseInt(quantity) > 0) {
        addButton.style.display = "";
    }
    else {
        addButton.style.display = "none";
    }
}, 100);

let timer;
const runtimer = () => {
    console.log("runtimer");
    timer = setTimeout(() => {
        successfullyAdded.style.display = "none";
    }, 5000);
}

getCurrentQunatity = async () => {
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
    document.getElementById('number').value = 0;

}

// setInterval(() => {
getCurrentQunatity();
// }, 1000);

addButton.addEventListener('click', function () {
    async function getdata() {
        const postData = {
            symbol: symbol,
            quantity: document.getElementById('number').value
        }
        console.log(symbol);
        const data = await fetch('http://localhost:3000/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(postData),
        });

        const jsonData = await data.json();
        const prevQuantity = jsonData.prevQuantity;
        // console.log(jsonData);
        if (prevQuantity == 0) {
            successfullyAdded.style.display = "block";
            // console.log("prevquantity---->" + prevQuantity);

            setTimeout(() => {
                successfullyAdded.style.display = "none";
            }, 2000);
            getCurrentQunatity();
            // document.getElementById('number').value = 0;
        }

        if (prevQuantity > 0) {
            alreadyHaveSelectedStockMessage.innerHTML = "You already have " + prevQuantity + " " + symbol + " stocks in your portfolio.";
            alreadyHaveSelectedStock.style.display = "block";
        }

        const alreadyHaveSelectedStockButtonUpdate = document.getElementById('alreadyHaveSelectedStockButtonUpdate');
        const alreadyHaveSelectedStockButtonAdd = document.getElementById('alreadyHaveSelectedStockButtonAdd');

        alreadyHaveSelectedStockButtonAdd.addEventListener('click', async function () {
            const postData = {
                symbol: symbol,
                quantity: document.getElementById('number').value,
                prevQuantity: prevQuantity
            }
            fetch('http://localhost:3000/alreadyHaveSelectedStockButtonAdd', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });
            alreadyHaveSelectedStock.style.display = "none";
            successfullyAdded.style.display = "block";
            setTimeout(() => {
                successfullyAdded.style.display = "none";
            }, 2000);
            getCurrentQunatity();
            // document.getElementById('number').value = 0;
        })

        alreadyHaveSelectedStockButtonUpdate.addEventListener('click', async function () {
            fetch('http://localhost:3000/alreadyHaveSelectedStockButtonUpdate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(postData),
            });
            alreadyHaveSelectedStock.style.display = "none";
            successfullyUpdated.style.display = "block";
            setTimeout(() => {
                successfullyUpdated.style.display = "none";
            }, 2000);
            // successfullyUpdated.style.animation = 'none';
            // successfullyUpdated.offsetHeight; /* trigger reflow */
            // successfullyUpdated.style.animation = null;
            // runtimer();
            // alreadyHaveSelectedStock.style.display = "none";
            getCurrentQunatity();
            // document.getElementById('number').value = 0;

        })
    }
    getdata();
})

window.onclick = function (event) {
    if (event.target == alreadyHaveSelectedStock) {
        alreadyHaveSelectedStock.style.display = "none";
    }
}





