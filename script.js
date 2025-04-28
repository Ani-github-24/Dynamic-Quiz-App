document.addEventListener('DOMContentLoaded', () => {
  // Get the topic from the URL or localStorage
  const urlParams = new URLSearchParams(window.location.search);
  const topic = urlParams.get('topic') || localStorage.getItem('selectedTopic');

  if (!topic) {
    window.location.href = "dashboard.html"; // Redirect to dashboard if no topic is selected
  } else {
    initializeQuiz(topic);
  }
});



async function initializeQuiz(topic) {
  const quizTopic = document.getElementById('quizTopic');
  const quizSection = document.getElementById('quizSection');
  const questionsContainer = document.getElementById('questionsContainer');
  const submitQuiz = document.getElementById('submitQuiz');
  const loading = document.getElementById('loading');

  quizTopic.textContent = topic;
  quizSection.classList.remove('hidden');

  loading.classList.remove('hidden');

  const quizData = await fetchQuizQuestions(topic);

  loading.classList.add('hidden');

  if (quizData.length === 0) {
    questionsContainer.innerHTML = "<p>Sorry, couldn't generate quiz questions. Please try another topic.</p>";
    submitQuiz.classList.add('hidden');
    return;
  }

  quizData.forEach((q, idx) => {
    const questionBlock = document.createElement('div');
    questionBlock.classList.add('question-block');
    
    questionBlock.innerHTML = `
      <p><strong>Q${idx + 1}. ${q.question}</strong></p>
      ${q.options.map((opt, i) => `
        <label>
          <input type="radio" name="question${idx}" value="${opt}">
          ${opt}
        </label><br>
      `).join('')}
    `;
    questionsContainer.appendChild(questionBlock);
  });

  submitQuiz.classList.remove('hidden');
  submitQuiz.onclick = () => checkAnswers(quizData);

  
}

async function fetchQuizQuestions(topic) {
  const GEMINI_API_KEY = 'CONFIG.GEMINI_API_KEY'; 
  const url = 'https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=' + GEMINI_API_KEY;
  
  const prompt = `
    You are a quiz generator.
    Create 10 multiple-choice questions about "${topic}".
    Each question must have:
    - 1 correct answer
    - 3 incorrect options
    Respond ONLY with a JSON array like:
    [
      {
        "question": "Your question?",
        "options": ["Option1", "Option2", "Option3", "Option4"],
        "answer": "Correct Option"
      },
      ...
    ]
    Do NOT add any explanation or extra text.
  `;

  const requestBody = {
    contents: [
      {
        parts: [{ text: prompt }]
      }
    ]
  };

  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    const data = await response.json();
    const generatedText = data.candidates[0]?.content?.parts[0]?.text || "";

    const jsonStart = generatedText.indexOf('[');
    const jsonEnd = generatedText.lastIndexOf(']');
    if (jsonStart !== -1 && jsonEnd !== -1) {
      const jsonString = generatedText.slice(jsonStart, jsonEnd + 1);
      const quizArray = JSON.parse(jsonString);
      return quizArray;
    } else {
      console.error("No valid JSON found in Gemini response.");
      return [];
    }
  } catch (error) {
    console.error("Error fetching or parsing quiz:", error);
    return [];
  }
}

function checkAnswers(quizData) {
  let score = 0;

  quizData.forEach((q, idx) => {
    const options = document.getElementsByName(`question${idx}`);
    let selected = null;

    options.forEach((opt) => {
      if (opt.checked) selected = opt;
      opt.parentElement.style.color = 'initial';
      opt.parentElement.style.fontWeight = 'normal';
    });

    options.forEach((opt) => {
      if (opt.value === q.answer) {
        opt.parentElement.style.color = 'green';
        opt.parentElement.style.fontWeight = 'bold';
      }
    });

    if (selected) {
      if (selected.value === q.answer) {
        score++;
      } else {
        selected.parentElement.style.color = 'red';
      }
    }
  });

  const scoreSection = document.getElementById('scoreSection');
  scoreSection.innerHTML = `
    <div style="margin-top: 20px; font-size: 20px;">
      You scored <strong>${score}</strong> out of <strong>${quizData.length}</strong>! 🎉
    </div>
  `;

  // Show Give Feedback button
  const feedbackBtn = document.getElementById('giveFeedbackBtn');
  const feedbackSection = document.getElementById('feedbackSection');
  feedbackBtn.classList.remove('hidden');

  feedbackBtn.addEventListener('click', () => {
    feedbackSection.classList.remove('hidden');
    feedbackBtn.classList.add('hidden');
  });
}

// Feedback form handling
const feedbackForm = document.getElementById('feedbackForm');
const feedbackMessage = document.getElementById('feedbackMessage');

feedbackForm.addEventListener('submit', (e) => {
  e.preventDefault();
  
  const name = document.getElementById('name').value.trim();
  const phone = document.getElementById('phone').value.trim();
  const email = document.getElementById('email').value.trim();
  const dob = document.getElementById('dob').value;
  const topicLiked = document.getElementById('topicLiked').value.trim();
  const suggestion = document.getElementById('suggestion').value.trim();
  
  if (!name || !phone || !email || !dob || !topicLiked || !suggestion) {
    feedbackMessage.style.color = 'red';
    feedbackMessage.textContent = "Please fill in all fields!";
    return;
  }
  
  const phoneRegex = /^[0-9]{10}$/;
  if (!phoneRegex.test(phone)) {
    feedbackMessage.style.color = 'red';
    feedbackMessage.textContent = "Enter a valid 10-digit phone number!";
    return;
  }
  
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    feedbackMessage.style.color = 'red';
    feedbackMessage.textContent = "Enter a valid email address!";
    return;
  }
  
  feedbackMessage.style.color = 'green';
  feedbackMessage.textContent = "Thank you for your valuable feedback! 🎉";
  
  feedbackForm.reset();

  feedbackMessage.classList.remove('pop-animation'); // Restart animation
  void feedbackMessage.offsetWidth; // Force reflow
  feedbackMessage.classList.add('pop-animation');

});
