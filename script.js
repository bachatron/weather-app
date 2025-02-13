async function assignWeatherData (location, celsius=false) {
    const elements = {
        city: document.querySelector("#city span"),
        time: document.querySelector("#time span"),
        timezone: document.querySelector("#timezone span"),
        actualtemp: document.querySelector("#actualtemp span"),
        mintemp: document.querySelector("#mintemp span"),
        maxtemp: document.querySelector("#maxtemp span"),
        description: document.querySelector("#description span"),
    };

    const weatherData = await getWeather(location);

    if (!lastWeatherData || lastWeatherData.resolvedAddress !== location) {
        lastWeatherData = await getWeather(location);
    }

    if (lastWeatherData.error) {
        console.error(lastWeatherData.error);
        return;
    }

    console.log(lastWeatherData);

    elements.city.textContent = lastWeatherData.resolvedAddress;
    elements.time.textContent = lastWeatherData.currentConditions.datetime;
    elements.timezone.textContent = lastWeatherData.tzoffset;
    elements.description.textContent = lastWeatherData.currentConditions.conditions;

    updateTemperatures();

}

function updateTemperatures() {
    if (!lastWeatherData) return;

    const elements = {
        actualtemp: document.querySelector("#actualtemp span"),
        mintemp: document.querySelector("#mintemp span"),
        maxtemp: document.querySelector("#maxtemp span"),
    };

    if (isCelsius) {
        elements.actualtemp.textContent = toCelsius(lastWeatherData.currentConditions.temp).toFixed(1) + "°C";
        elements.mintemp.textContent = toCelsius(lastWeatherData.days[0].tempmin).toFixed(1) + "°C";
        elements.maxtemp.textContent = toCelsius(lastWeatherData.days[0].tempmax).toFixed(1) + "°C";
    } else {
        elements.actualtemp.textContent = lastWeatherData.currentConditions.temp.toFixed(1) + "°F";
        elements.mintemp.textContent = lastWeatherData.days[0].tempmin.toFixed(1) + "°F";
        elements.maxtemp.textContent = lastWeatherData.days[0].tempmax.toFixed(1) + "°F";
    }
}

async function getWeather(location) {
    try {
        
        const weatherAPI = 'https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/';
        const key = 'QVA7PGUE5M3SNA5W3SU3XFZXW';
        
        const city = location;

        const url = `${weatherAPI}${location}?key=${key}`;

        const response = await fetch(url);

        if (!response.ok) {
            return { error: `API error: ${response.status} ${response.statusText}` };
        }

        const weatherData = await response.json();
        //console.log(weatherData);

        return weatherData;

    } catch (err) {
        console.error("Error fetching weather data:", err);
        return { error: err.message };
    }
    
}

let isCelsius = false;
let lastWeatherData = null;

function toCelsius(fahrenheit) {
    return ((fahrenheit - 32) * 5) / 9;
}

function changeMetric() {
    const metric = document.getElementById('metric');

    metric.textContent = metric.textContent === 'C' ? 'F' : 'C';

    isCelsius = !isCelsius;

    updateTemperatures();
}

document.getElementById('form').addEventListener('submit', function (event) {
    event.preventDefault();
    document.getElementById('container').style.display = 'grid';

    assignWeatherData(document.getElementById('query').value, isCelsius);
});