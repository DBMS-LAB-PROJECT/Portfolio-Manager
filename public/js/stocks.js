function search_company() {
    console.log("hello");
    let input = document.getElementById('searchbar').value
    input = input.toLowerCase();
    let x = document.getElementsByClassName('symbol');

    for (i = 0; i < x.length; i++) {
        if (!x[i].innerHTML.toLowerCase().includes(input)) {
            x[i].parentElement.parentElement.style.display = "none";
            // x[i].parentElement.parentElement.style.backgroundColor = "red";
        }
        else {
            x[i].parentElement.parentElement.style.display = "block";
            // x[i].parentElement.parentElement.style.backgroundColor = "yellow";
        }
    }
}



const getpost = async () => {
    let url_time_series = "https://api.twelvedata.com/time_series?apikey=" + process.env.API_KEY + "&interval=1min&outputsize=5&symbol=";
    const response = await fetch(url);


}

getpost();


