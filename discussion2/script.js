let questions = [];
let currentQuestionIndex = null;

// Reference to DOM elements
const questionForm = document.getElementById('question-form');
const questionList = document.getElementById('question-list');
const rightPane = document.getElementById('right-pane');
const searchBox = document.getElementById('search-box');

// Handle search functionality - User Story 6
searchBox.addEventListener('input', () => {
    const searchTerm = searchBox.value.toLowerCase();
    renderQuestions(searchTerm);
});

// User Story 2: Add question when form is submitted
questionForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const title = document.getElementById('title').value;
    const questionText = document.getElementById('question').value;
    
    const newQuestion = {
        title: title,
        question: questionText,
        responses: [],
        upvotes: 0,
        downvotes: 0
    };
    
    questions.push(newQuestion);
    renderQuestions();
    resetForm();
});

function resetForm() {
    document.getElementById('title').value = '';
    document.getElementById('question').value = '';
}

// Render the list of questions based on search filter - User Story 1 and User Story 6
function renderQuestions(filter = '') {
    questionList.innerHTML = '';
    const filteredQuestions = questions.filter(q => q.title.toLowerCase().includes(filter));
    if (filteredQuestions.length > 0) {
        filteredQuestions.forEach((question, index) => {
            const li = document.createElement('li');
            li.textContent = `${question.title} (${question.upvotes - question.downvotes} votes)`;
            li.addEventListener('click', () => displayQuestion(index));
            questionList.appendChild(li);
        });
    } else {
        questionList.innerHTML = '<li>No questions matched</li>';
    }
}

// User Story 3: Display question with response form and upvote/downvote buttons
function displayQuestion(index) {
    currentQuestionIndex = index;
    const question = questions[index];
    
    rightPane.innerHTML = `
        <h3>${question.title}</h3>
        <p>${question.question}</p>
        <h4>Responses:</h4>
        <ul id="response-list">
            ${question.responses.map(response => `
                <li><strong>${response.name}</strong>: ${response.comment} 
                (${response.upvotes - response.downvotes} votes)
                <button onclick="voteResponse(${index}, ${question.responses.indexOf(response)}, 1)">Upvote</button>
                <button onclick="voteResponse(${index}, ${question.responses.indexOf(response)}, -1)">Downvote</button>
                </li>
            `).join('')}
        </ul>
        <form id="response-form">
            <label for="name">Name:</label>
            <input type="text" id="name" name="name" required>
            <br>
            <label for="comment">Comment:</label>
            <textarea id="comment" name="comment" required></textarea>
            <br>
            <button type="submit">Submit Response</button>
        </form>
        <button id="resolve-button">Resolve</button>
        <br>
        <button onclick="voteQuestion(${index}, 1)">Upvote Question</button>
        <button onclick="voteQuestion(${index}, -1)">Downvote Question</button>
    `;

    // User Story 4: Handle response submission
    document.getElementById('response-form').addEventListener('submit', handleResponse);

    // User Story 8: Handle resolve button
    document.getElementById('resolve-button').addEventListener('click', resolveQuestion);
}

// Handle response form submission - User Story 4 and User Story 5
function handleResponse(event) {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const comment = document.getElementById('comment').value;

    const newResponse = {
        name: name,
        comment: comment,
        upvotes: 0,
        downvotes: 0
    };
    
    questions[currentQuestionIndex].responses.push(newResponse);
    displayQuestion(currentQuestionIndex); // Refresh the question with new response
}

// Handle voting for questions - User Story 7
function voteQuestion(index, value) {
    questions[index].upvotes += value === 1 ? 1 : 0;
    questions[index].downvotes += value === -1 ? 1 : 0;
    renderQuestions();
    displayQuestion(index);
}

// Handle voting for responses - User Story 7
function voteResponse(questionIndex, responseIndex, value) {
    const response = questions[questionIndex].responses[responseIndex];
    response.upvotes += value === 1 ? 1 : 0;
    response.downvotes += value === -1 ? 1 : 0;
    displayQuestion(questionIndex);
}

// Handle resolve action - User Story 8
function resolveQuestion() {
    questions.splice(currentQuestionIndex, 1);
    renderQuestions();
    rightPane.innerHTML = `
        <div id="question-form-container">
            <h3>Ask a Question</h3>
            <form id="question-form">
                <label for="title">Title:</label>
                <input type="text" id="title" name="title" required>
                <br>
                <label for="question">Question:</label>
                <textarea id="question" name="question" required></textarea>
                <br>
                <button type="submit">Submit Question</button>
            </form>
        </div>
    `;

    // Reattach the event listener for the form
    document.getElementById('question-form').addEventListener('submit', (event) => {
        event.preventDefault();
        const title = document.getElementById('title').value;
        const questionText = document.getElementById('question').value;
        
        const newQuestion = {
            title: title,
            question: questionText,
            responses: [],
            upvotes: 0,
            downvotes: 0
        };
        
        questions.push(newQuestion);
        renderQuestions();
        resetForm();
    });
}
