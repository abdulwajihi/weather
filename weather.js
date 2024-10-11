const apikey = "f5cd9f462e38ee46209ec3fa390cd5fb";

window.addEventListener("load", () => {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition((position) => {
            let lon = position.coords.longitude;
            let lat = position.coords.latitude;
            const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apikey}`;

            fetch(url)
                .then((res) => res.json())
                .then((data) => {
                    console.log(data);
                    weatherReport(data); // Display current weather
                });
        });
    }
});

function searchByCity() {
    var place = document.getElementById('input').value;
    var urlsearch = `https://api.openweathermap.org/data/2.5/weather?q=${place}&appid=${apikey}`;

    fetch(urlsearch)
        .then((res) => res.json())
        .then((data) => {
            console.log(data);
            weatherReport(data); // Display weather for searched city
        });
    document.getElementById('input').value = ''; // Clear input field
}

function weatherReport(data) {
    var urlcast = `https://api.openweathermap.org/data/2.5/forecast?q=${data.name}&appid=${apikey}`;

    fetch(urlcast)
        .then((res) => res.json())
        .then((forecast) => {
            console.log(forecast.city);
            hourForecast(forecast); // Display hourly forecast
            dayForecast(forecast); // Display 4-day forecast

            document.getElementById('city').innerText = data.name + ', ' + data.sys.country;
            document.getElementById('temperature').innerText = Math.floor(data.main.temp - 273) + ' °C';
            document.getElementById('clouds').innerText = data.weather[0].description;

            let icon1 = data.weather[0].icon;
            let iconurl = "https://api.openweathermap.org/img/w/" + icon1 + ".png";
            document.getElementById('img').src = iconurl;
        });
}

function hourForecast(forecast) {
    document.querySelector('.templist').innerHTML = '';
    for (let i = 0; i < 5; i++) {
        var date = new Date(forecast.list[i].dt * 1000);

        let hourR = document.createElement('div');
        hourR.setAttribute('class', 'next');

        let div = document.createElement('div');
        let time = document.createElement('p');
        time.setAttribute('class', 'time');
        time.innerText = (date.toLocaleTimeString(undefined, 'Asia/Kolkata')).replace(':00', '');

        let temp = document.createElement('p');
        temp.innerText = 'Max: ' + Math.floor(forecast.list[i].main.temp_max - 273) + ' °C / Min: ' + Math.floor(forecast.list[i].main.temp_min - 273) + ' °C';

        div.appendChild(time);
        div.appendChild(temp);

        let desc = document.createElement('p');
        desc.setAttribute('class', 'desc');
        desc.innerText = forecast.list[i].weather[0].description;

        hourR.appendChild(div);
        hourR.appendChild(desc);
        document.querySelector('.templist').appendChild(hourR);
    }
}

function dayForecast(forecast) {
    document.querySelector('.weekF').innerHTML = ''; // Clear previous forecast

    let dayData = {};

    // Aggregate forecast data for each day
    forecast.list.forEach((entry) => {
        let date = new Date(entry.dt * 1000).toDateString(undefined, 'Asia/Kolkata');

        if (!dayData[date]) {
            dayData[date] = {
                temp_max: entry.main.temp_max,
                temp_min: entry.main.temp_min,
                description: entry.weather[0].description
            };
        } else {
            dayData[date].temp_max = Math.max(dayData[date].temp_max, entry.main.temp_max);
            dayData[date].temp_min = Math.min(dayData[date].temp_min, entry.main.temp_min);
        }
    });

    // Extract and display 4 days of forecast
    Object.keys(dayData).slice(0, 4).forEach((date) => {
        let div = document.createElement('div');
        div.setAttribute('class', 'dayF');

        let day = document.createElement('p');
        day.setAttribute('class', 'date');
        day.innerText = date;
        div.appendChild(day);

        let temp = document.createElement('p');
        temp.innerText = `Max: ${Math.floor(dayData[date].temp_max - 273)} °C / Min: ${Math.floor(dayData[date].temp_min - 273)} °C`;
        div.appendChild(temp);

        let description = document.createElement('p');
        description.setAttribute('class', 'desc');
        description.innerText = dayData[date].description;
        div.appendChild(description);

        document.querySelector('.weekF').appendChild(div);
    });
}
