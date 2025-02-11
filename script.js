


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
        console.log(weatherData);

        return weatherData;

    } catch (err) {
        console.error("Error fetching weather data:", err);
        return { error: err.message };
    }
    
}

getWeather('Buenos Aires');