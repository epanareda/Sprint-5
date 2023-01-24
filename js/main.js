// DOM elements variables.
const next_btn = document.querySelector("#next-joke-btn");
const joke_text = document.querySelectorAll("p")[1];
const punct_btn_conatiner = document.querySelector("#punct-joke-container");

// API variables.
const api_url = "https://icanhazdadjoke.com/";
const api_headers = {"Accept": "application/json"};

// Data storage variables.
const reportAcudits = [];

// Here is called the event that will handle the whole API call.
next_btn.addEventListener("click", () => {
    fetch(api_url, {headers: api_headers}) // With the use of fetch the delay occured because of the request to de API is solved automatically, fetch uses a promise.
        .then(response => response.json())
        // .then(json => console.log(json.joke))
        .then(json => {
            joke_text.textContent = `" ${json.joke} "`;
            // The new joke shown is added the the report, it's score, in case it's voted, will be assign later on.
            add_report(json.joke);
        })
        add_punct_btn();
});

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