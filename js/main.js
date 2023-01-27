// DOM elements variables.
const next_btn = document.querySelector("#next-joke-btn");
const joke_text = document.querySelectorAll("p")[1];
const punct_btn_conatiner = document.querySelector("#punct-joke-container");
const weather_text = document.querySelector("p");
const weather_img = document.querySelector("img");
const blob_container = document.querySelector("#blob-container");
const blob_tr = document.querySelector("#blob-top-right");
const blob_bl = document.querySelector("#blob-bottom-left");

// API variables.
// Father jokes.
const api_url = "https://icanhazdadjoke.com/";
const api_headers = {"Accept": "application/json"};
// Weather.
const api_weather_url = "https://api.open-meteo.com/v1/forecast?latitude=41.39&longitude=2.16&current_weather=true"; // Weather in Barcelona.
const weather_code = {
    0: {description: "clear sky",
        image: "sunny"},
    1: {description: "mainly clear",
        image: "cloudy"},
    2: {description: "partly cloudy",
        image: "cloudy"},
    3: {description: "overcast",
        image: "cloud"},
    45: {description: "fog",
        image: "fog"},
    48: {description: "depositing rime fog",
        image: "fog"},
    51: {description: "drizzle light",
        image: "rain"},
    53: {description: "drizzle moderate",
        image: "rain"},
    55: {description: "drizzle dense intensity",
        image: "rain"},
    56: {description: "freezing drizzle light",
        image: "rain"},
    57: {description: "freezing dizzle heavy intensity",
        image: "rain"},
    61: {description: "rain slight",
        image: "rain"},
    63: {description: "rain moderate",
        image: "rain"},
    65: {description: "rain heavy intensity",
        image: "rain"},
    66: {description: "freezing rain light",
        image: "rain"},
    67: {description: "freezing rain heavy intensity",
        image: "rain"},
    71: {description: "snow fall slight",
        image: "snow"},
    73: {description: "snow fall moderate",
        image: "snow"},
    75: {description: "snow fall heavy intensity",
        image: "snow"},
    77: {description: "snow grains",
        image: "snow"},
    80: {description: "rain shower slight",
        image: "rain"},
    81: {description: "rain shower moderate",
        image: "rain"},
    82: {description: "rain shower violent",
        image: "rain"},
    85: {description: "snow showers slight",
        image: "snow"},
    86: {description: "snow showers heavy",
        image: "snow"},
    95: {description: "thunderstorm",
        image: "thunderstorm"},
    96: {description: "thunderstorm with slight hail",
        image: "thunderstorm-hail"},
    99: {description: "thunderstorm with heavy hail",
        image: "thunderstorm-hail"}
};
// Chuck Norris jokes.
const api_chuckNorris_url = "https://api.chucknorris.io/jokes/random";

// Data storage variables.
const reportAcudits = [];
let blob_color = blob_changer();

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
            blob_color = blob_changer(blob_color);
            add_punct_btn();
        });
});

// Here the weather api is acceced by fetch.
fetch(api_weather_url)
    .then(response => response.json())
    // .then(json => console.log(weather_code[json.current_weather.weathercode]))
    .then(json => {
        weather_img.src = `/images/weather/${weather_code[json.current_weather.weathercode].image}.png`;
        weather_img.alt = `${weather_code[json.current_weather.weathercode].description}`;
        weather_text.textContent = `${json.current_weather.temperature}ºC`;
    });

// This function adds the buttons to vote the jokes once they are shown on screen, with all of it's styles and functionalities.
function add_punct_btn() {
    // I decided to use the code not commented because I think is more efficient, short, and correct. The array of 0 is to have a loop with 3 runs without using for.

    // const btn_1 = document.createElement("btn");
    // const btn_2 = document.createElement("btn");
    // const btn_3 = document.createElement("btn");

    /*const [btn_1, btn_2, btn_3] = */["sad", "indifferent", "happiness"].map((name, index) => {
        if(punct_btn_conatiner.children.length === 3) {
            punct_btn_conatiner.innerHTML = "";
        }
        const btn = document.createElement("btn");
        const img = document.createElement("img");
        img.src = `/images/faces/${name}.png`;
        img.alt = name;
        img.width = 32;
        btn.appendChild(img);
        ["btn", "p-0", "rounded-circle", "mb-5", "mx-5"].map(c => {
            if(index !== 1 && c === "mx-5") {
                return;
            }
            btn.classList.add(c);
        });
        // btn.textContent = `${index+1}`;
        
        btn.addEventListener("click", () => {
            // Updates the "reportAcudits" score if the user decides to vote or re-vote the joke.
            reportAcudits[reportAcudits.length - 1].score = index+1;
            // Change the aspect of the current button score given by the user.
            punct_btn_active(name, index);
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
function punct_btn_active(img_name, index) {
    // First set as non-selected for all buttons.
    ["sad", "indifferent", "happiness"].map((name, i) => punct_btn_conatiner.children[i].children[0].src = `/images/faces/${name}-inactive.png`);
    // Then the selectec button is given a colorfull image.
    punct_btn_conatiner.children[index].children[0].src = `/images/faces/${img_name}.png`;
}

// This functions sets a new color blob each time a new joke is asked.
function blob_changer(current_color = false) {
    // Makes sure the blobs always change.
    if(["blue", "brown", "purple"].includes(current_color)) {
        blob_container.classList.remove(`${current_color}-blob-container`);
        blob_tr.classList.remove(`${current_color}-blob-tr`);
        blob_bl.classList.remove(`${current_color}-blob-bl`);
    };
    // Picks a new random color blob.
    const aviable_colors = ["blue", "brown", "purple"].filter(color => color != current_color);
    const rand = Math.floor(Math.random() * aviable_colors.length);
    const chosen_color = aviable_colors[rand];
    blob_container.classList.add(`${chosen_color}-blob-container`);
    blob_tr.classList.add(`${chosen_color}-blob-tr`);
    blob_bl.classList.add(`${chosen_color}-blob-bl`);
    // Return the chosen color so it won't be picked for the next joke.
    return chosen_color;
}

// add_punct_btn();