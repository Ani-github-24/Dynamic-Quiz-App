// Initialize Firebase (again)
const firebaseConfig = {
    apiKey: "AIzaSyBrzGjYJjr1aQV_2QWS7mnOc5wUJcj9ixI",
    authDomain: "dynamic-quiz-page.firebaseapp.com",
    projectId: "dynamic-quiz-page",
    storageBucket: "dynamic-quiz-page.firebasestorage.app",
    messagingSenderId: "552535960214",
    appId: "1:552535960214:web:9c2e83b610ceb13f7c30b7",
    measurementId: "G-H6LSVS9RMY"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Fetch selected topic from localStorage
const selectedTopic = localStorage.getItem('selectedTopic');
document.getElementById('quizTopicTitle').innerText = `Quiz on: ${selectedTopic}`;

// Fetch questions based on selected topic
async function fetchQuestions(topic) {
  try {
    const response = await fetch(`https://api.gemini.com/quiz?topic=${topic}`);
    const data = await response.json();
    
    // Dynamically create question elements
    const questionsContainer = document.getElementById('questions-container');
    data.questions.forEach((question, index) => {
      const questionElement = document.createElement('div');
      questionElement.classList.add('question');
      
      const questionText = document.createElement('p');
      questionText.innerText = `${index + 1}. ${question.question}`;
      
      const optionsList = document.createElement('ul');
      question.options.forEach(option => {
        const optionItem = document.createElement('li');
        const optionInput = document.createElement('input');
        optionInput.type = 'radio';
        optionInput.name = `question${index}`;
        optionInput.value = option;
        optionItem.appendChild(optionInput);
        optionItem.appendChild(document.createTextNode(option));
        optionsList.appendChild(optionItem);
      });
      
      questionElement.appendChild(questionText);
      questionElement.appendChild(optionsList);
      questionsContainer.appendChild(questionElement);
    });
  } catch (error) {
    console.error('Error fetching questions:', error);
  }
}

// Call fetchQuestions function with the selected topic
fetchQuestions(selectedTopic);

// Handle logout
document.getElementById('logoutButton').addEventListener('click', () => {
  auth.signOut().then(() => {
    localStorage.clear();  // Clear saved data
    window.location.href = 'login.html';
  });
});

// Handle quiz submission (optional)
document.getElementById('submitQuizButton').addEventListener('click', () => {
  // You can collect answers and evaluate the quiz here
  const selectedAnswers = [];
  const questions = document.querySelectorAll('.question');
  
  questions.forEach((question, index) => {
    const selectedOption = question.querySelector(`input[name='question${index}']:checked`);
    if (selectedOption) {
      selectedAnswers.push(selectedOption.value);
    }
  });
  
  // Show the answers (or process them further)
  console.log('Selected Answers:', selectedAnswers);
  // Proceed to show results or save progress
});
