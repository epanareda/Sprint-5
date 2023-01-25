// DOM elements variables.
const next_btn = document.querySelector("#next-joke-btn");
const joke_text = document.querySelectorAll("p")[1];
const punct_btn_conatiner = document.querySelector("#punct-joke-container");
const weather_text = document.querySelector("p");

// API variables.
// Father jokes.
const api_url = "https://icanhazdadjoke.com/";
const api_headers = {"Accept": "application/json"};
// Weather.
const api_weather_url = "https://api.open-meteo.com/v1/forecast?latitude=41.39&longitude=2.16&current_weather=true"; // Weather in Barcelona.
const weather_code = {
    0: "clear sky",
    1: "mainly clear",
    2: "partly cloudy",
    3: "overcast",
    45: "fog",
    48: "depositing rime fog",
    51: "drizzle light",
    53: "drizzle moderate",
    55: "drizzle dense intensity",
    56: "freezing drizzle light",
    57: "freezing dizzle heavy intensity",
    61: "rain slight",
    63: "rain moderate",
    65: "rain heavy intensity",
    66: "freezing rain light",
    67: "freezing rain heavy intensity",
    71: "snow fall slight",
    73: "snow fall moderate",
    75: "snow fall heavy intensity",
    77: "snow grains",
    80: "rain shower slight",
    81: "rain shower moderate",
    82: "rain shower violent",
    85: "snow showers slight",
    86: "snow showers heavy",
    95: "thunderstorm",
    96: "thunderstorm with slight hail",
    99: "thunderstorm with heavy hail"
};
// Chuck Norris jokes.
const api_chuckNorris_url = "https://api.chucknorris.io/jokes/random";

// Data storage variables.
const reportAcudits = [];

function random_joke(){
    const rand = Math.floor(Math.random() * 2); // Get a random num, either 0 or 1;
    if(rand === 0) {
        return [api_url, {headers: api_headers}];
    }
    return [api_chuckNorris_url];
}

// Here is called the event that will handle the whole API call.
next_btn.addEventListener("click", () => {
    const api_to_fetch = random_joke();
    fetch(...api_to_fetch) // With the use of fetch the delay occured because of the request to de API is solved automatically, fetch uses a promise.
        .then(response => response.json())
        // .then(json => console.log(json.joke))
        .then(json => {
            if(api_to_fetch.length === 1) {
                joke_text.textContent = `" ${json.value} "`;
                // The new joke shown is added the the report, it's score, in case it's voted, will be assign later on.
                add_report(json.value);
            } else {
                joke_text.textContent = `" ${json.joke} "`;
                // The new joke shown is added the the report, it's score, in case it's voted, will be assign later on.
                add_report(json.joke);
            };
        });
        add_punct_btn();
});

// Here the weather api is acceced by fetch.
fetch(api_weather_url)
    .then(response => response.json())
    // .then(json => console.log(weather_code[json.current_weather.weathercode]))
    .then(json => weather_text.textContent = `Avui: ${weather_code[json.current_weather.weathercode]} | ${json.current_weather.temperature}ºC`);

// This function adds the buttons to vote the jokes once they are shown on screen, with all of it's styles and functionalities.
function add_punct_btn() {
    // I decided to use the code not commented because I think is more efficient, short, and correct. The array of 0 is to have a loop with 3 runs without using for.

    // const btn_1 = document.createElement("btn");
    // const btn_2 = document.createElement("btn");
    // const btn_3 = document.createElement("btn");

    /*const [btn_1, btn_2, btn_3] = */[0, 0, 0].map((b, index) => {
        if(punct_btn_conatiner.children.length === 3) {
            punct_btn_conatiner.innerHTML = "";
        }
        const btn = document.createElement("btn");
        ["btn", "btn-secondary", "mb-5", "mx-5"].map(c => {
            if(index !== 1 && c === "mx-5") {
                return;
            }
            btn.classList.add(c);
        });
        btn.textContent = `${index+1}`;
        
        btn.addEventListener("click", () => {
            // Updates the "reportAcudits" score if the user decides to vote or re-vote the joke.
            reportAcudits[reportAcudits.length - 1].score = index+1;
            // Change the aspect of the current button score given by the user.
            punct_btn_active(index);
            // As it's ask, every time the "reportAcudits" is updated, it has to be shown by console.
            console.log(reportAcudits);
        });

        punct_btn_conatiner.appendChild(btn);
    });
}

// This functions adds a new joke to the report array in the format required.
function add_report(joke) {
    reportAcudits.push({
        joke: joke,
        score: undefined,
        date: new Date().toISOString()
    });
    // As it's ask, every time the "reportAcudits" is updated, it has to be shown by console.
    console.log(reportAcudits);
}

// This function changes the state of the button to active, so the user can si what it's voted.
function punct_btn_active(index) {
    // First the "btn-active" class is removed for all buttons.
    [0, 1, 2].map(i => punct_btn_conatiner.children[i].classList.remove("btn-active"));
    // Then it's added to the one actually active.
    punct_btn_conatiner.children[index].classList.add("btn-active");
}

// add_punct_btn();