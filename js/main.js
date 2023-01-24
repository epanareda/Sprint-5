const next_btn = document.querySelector("button");
const joke_text = document.querySelectorAll("p")[1];

const api_url = "https://icanhazdadjoke.com/";
const api_headers = {"Accept": "application/json"};

// console.log(next_btn);

next_btn.addEventListener("click", () => {
    fetch(api_url, {headers: api_headers})
        .then(response => response.json())
        // .then(json => console.log(json.joke))
        .then(json => joke_text.textContent = `" ${json.joke} "`)
});