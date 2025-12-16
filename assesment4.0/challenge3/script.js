let categorySelect = document.getElementById('categorySelect');
let difficultySelect = document.getElementById('difficultySelect');
let fetchBtn = document.getElementById('fetchBtn');
let questionSection = document.getElementById('questionSection');
let questionText = document.getElementById('questionText');
let optionsList = document.getElementById('optionsList');
let nextQuestionBtn = document.getElementById('nextQuestionBtn');
let category=document.getElementById('category');
let difficulty=document.getElementById('difficulty');
let questions
async function fetchQuestion() {
    let category = categorySelect.value;
    let difficulty = difficultySelect.value;
    let url =
    "https://the-trivia-api.com/v2/questions" +
    "?limit=1" +
    "&categories=" + category +
    "&difficulties=" + difficulty;

    await fetch(url)
    .then(response => response.json())
    .then(data => {
        questions = data[0];
        showQuestion();
    })
    .catch(error => {
        console.error('Error fetching question:', error);
    });
}
function showQuestion() {
    selectionSection.style.display = 'none';
    questionSection.style.display = 'block';
    console.log(questions);
    category.innerText = questions.category;
    difficulty.innerHTML = questions.difficulty;
    optionsList.innerHTML = '';
    let options = [...questions.incorrectAnswers, questions.correctAnswer];
    for (let option of options) {
        let li = document.createElement('li');
        li.innerText = option;
        optionsList.appendChild(li);
    }
}
fetchBtn.addEventListener('click', fetchQuestion);
nextQuestionBtn.addEventListener('click', () => {
selectionSection.style.display = 'block';
questionSection.style.display = 'none';
})