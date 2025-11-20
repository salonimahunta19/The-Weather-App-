// Unsplash API code integration
let unsplash = {
    photoApiKey: 'YOUR_UNSPLASH_API_KEY', // replace with your actual Unsplash API key
    fetchPhoto: function (query) {
        const unsplashURL = `https://api.unsplash.com/photos/random?query=${query}&client_id=${this.photoApiKey}`;
        fetch(unsplashURL)
            .then((response) => {
                if (!response.ok) throw new Error("Unable to fetch photo");
                return response.json();
            })
            .then((data) => this.displayPhoto(data))
            .catch((error) => console.error('Photo fetch error: ', error));
    },
    displayPhoto: function (data) {
        document.body.style.backgroundImage = `url('${data.urls.full}')`;
        console.log('Photo from Unsplash applied as background.');
    }
};

// Weather app with Unsplash background
let weather = {
    apiKey: 'YOUR_OPENWEATHERMAP_API_KEY', // replace with your OpenWeatherMap API key
    fetchWeather: function (city) {
        const weatherURL = `https://api.openweathermap.org/data/2.5/weather?q=${city}&units=metric&appid=${this.apiKey}`;
        fetch(weatherURL)
            .then((response) => {
                if (!response.ok) throw new Error("Unable to fetch weather data");
                return response.json();
            })
            .then((data) => this.displayWeather(data))
            .catch((error) => console.error('Weather fetch error: ', error));
    },
    displayWeather: function (data) {
        const { name } = data;
        const { icon, description } = data.weather[0];
        const { temp, humidity } = data.main;
        const { speed } = data.wind;

        document.querySelector(".city").innerText = "Weather in " + name;
        document.querySelector(".icon").src = "https://openweathermap.org/img/wn/" + icon + ".png";
        document.querySelector(".description").innerText = description;
        document.querySelector(".temp").innerText = temp + "°C";
        document.querySelector(".humidity").innerText = "Humidity: " + humidity + "%";
        document.querySelector(".wind").innerText = "Wind speed: " + speed + " km/h";

        // Fetch Unsplash photo based on city name
        unsplash.fetchPhoto(name);
    },
    search: function () {
        this.fetchWeather(document.querySelector(".search-bar").value);
    }
};

// Geolocation-based weather fetch
let geocode = {
    reverseGeocode: function (latitude, longitude) {
        const geocodeURL = `https://api.opencagedata.com/geocode/v1/json?q=${latitude}+${longitude}&key=YOUR_OPENCAGE_API_KEY`; // replace with OpenCage API key
        fetch(geocodeURL)
            .then((response) => {
                if (!response.ok) throw new Error("Unable to geocode location");
                return response.json();
            })
            .then((data) => {
                const city = data.results[0].components.city;
                weather.fetchWeather(city);
            })
            .catch((error) => console.error('Geocoding error: ', error));
    },
    getLocation: function () {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition((position) => {
                this.reverseGeocode(position.coords.latitude, position.coords.longitude);
            });
        } else {
            weather.fetchWeather("Denver"); // Default city if geolocation fails
        }
    }
};

// Event listeners for search functionality
document.querySelector(".search button").addEventListener("click", function () {
    weather.search();
});

document.querySelector(".search-bar").addEventListener("keyup", function (event) {
    if (event.key == "Enter") {
        weather.search();
    }
});

// Fetch weather and photo based on user's geolocation
geocode.getLocation();
