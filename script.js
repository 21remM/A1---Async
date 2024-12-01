// Select DOM elements
const button = document.getElementById('ask-button');
const ball = document.getElementById('magic-ball');
const responseTriangle = document.getElementById('response-triangle');

// Event listener for button click
button.addEventListener('click', async () => {
    const question = document.getElementById('question-input').value.trim();

    // Check if user entered a question and display an alert to prompt user to a ask a question
    if (!question) {
        alert('Please ask a question!');
        return;
    }

    // Hide previous response
    responseTriangle.style.opacity = '0';

    // Shake animation reset
    ball.classList.remove('shake');  

    void ball.offsetWidth;

    // Apply shake animation
    ball.classList.remove('bobbing');
    ball.classList.add('shake');

    setTimeout(async () => {
        try {
            // Change the image to the back of the 8 Ball
            ball.src = 'assets/8ball_back_pixel.png';

            // Added random string to generate another unique API answer even without changing the question
            let encodedQuestion = encodeURIComponent(question + getRandomString());

            // API URLs
            const PROXY_URL = "http://api.allorigins.win/get?url=";
            const API_ENDPOINT = "https://www.eightballapi.com/api";

            // Fetch response from API
            const response = await fetch(`${PROXY_URL}${API_ENDPOINT}?question=${encodedQuestion}`);
            const data = await response.json();
            const apiResponse = data.contents;

           // Handle missing response
            if (!apiResponse) {
                handleError(null); 
                return;
            }

            // Parse the API response
            const eightballAnswer = JSON.parse(apiResponse).reading;

            // Show the response and apply animation
            responseTriangle.style.opacity = '1';
            responseTriangle.textContent = eightballAnswer;
            ball.classList.remove('shake');
            ball.classList.add('bobbing');
            responseTriangle.classList.add('bobbing');

        } catch (error) {
            handleError(error); 
        }

        // Reset the shake animation
        ball.classList.remove('shake');
    }, 500);
});

// Function to generate a random string for API queries
function getRandomString() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';
    for (let i = 0; i < 3; i++) {
        result += characters.charAt(Math.floor(Math.random() * characters.length));
    }
    return result;
}

// Create funtion for errors
function handleError(error) {
    responseTriangle.style.opacity = '0';
    ball.src = 'assets/8ball_back_pixel.png';
    responseTriangle.textContent = 'Error fetching response!';
    console.error('Error:', error);
}