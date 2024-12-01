// Select DOM elements
const button = document.getElementById('ask-button');
const biasedButton = document.getElementById('biased-button'); // New biased button
const ball = document.getElementById('magic-ball');
const responseTriangle = document.getElementById('response-triangle');
const questionInput = document.getElementById('question-input');

// Event listener for "Enter" key press
questionInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
        button.click();
    }
});

// Event listener for button click (standard ask)
button.addEventListener('click', () => handleAsk(false));

// Event listener for biased button click
biasedButton.addEventListener('click', () => handleAsk(true)); // Passing true for biased

// Function to handle both standard and biased asks
async function handleAsk(isBiased) {
    const question = questionInput.value.trim();

    if (!question) {
        alert('Please ask a question!');
        return;
    }

    responseTriangle.style.opacity = '0';
    ball.classList.remove('shake');
    void ball.offsetWidth; 
    ball.classList.remove('bobbing');
    ball.classList.add('shake');

    setTimeout(async () => {
        try {
            ball.src = 'assets/8ball_back_pixel.png';
            let encodedQuestion = encodeURIComponent(question + getRandomString());

            // API URLs
            const PROXY_URL = "http://api.allorigins.win/get?url=";
            const API_ENDPOINT = isBiased
                ? `https://www.eightballapi.com/api/biased?question=${encodedQuestion}&lucky=true` //first endpoint
                : `https://www.eightballapi.com/api`; //second endpoint

            // Fetch response from API
            const response = await fetch(`${PROXY_URL}${API_ENDPOINT}`);
            const data = await response.json();
            const apiResponse = data.contents;

            if (!apiResponse) {
                handleError(null);
                return;
            }

            const eightballAnswer = JSON.parse(apiResponse).reading;
            responseTriangle.style.opacity = '1';
            responseTriangle.textContent = eightballAnswer;
            ball.classList.remove('shake');
            ball.classList.add('bobbing');
            responseTriangle.classList.add('bobbing');

        } catch (error) {
            handleError(error);
        }

        ball.classList.remove('shake');
    }, 500);
}

// Function to generate a random string for API queries
function getRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 3; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Function to handle errors
function handleError(error) {
    responseTriangle.style.opacity = '0';
    ball.src = 'assets/8ball_back_pixel.png';
    responseTriangle.textContent = 'Error fetching response!';
    console.error('Error:', error);
}
