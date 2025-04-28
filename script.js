document.addEventListener('DOMContentLoaded', () => {
    // Get the topic from the URL or localStorage
    const urlParams = new URLSearchParams(window.location.search);
    const topic = urlParams.get('topic') || localStorage.getItem('selectedTopic');
  
    if (!topic) {
      window.location.href = "dashboard.html"; // Redirect to dashboard if no topic is selected
    } else {
      // Initialize quiz page
      initializeQuiz(topic);
    }
  });
  
  async function initializeQuiz(topic) {
    // Get elements for displaying the quiz
    const quizTopic = document.getElementById('quizTopic');
    const quizSection = document.getElementById('quizSection');
    const questionsContainer = document.getElementById('questionsContainer');
    const submitQuiz = document.getElementById('submitQuiz');
    const loading = document.getElementById('loading');
    const scoreSection = document.getElementById('scoreSection');
  
    quizTopic.textContent = topic; // Display the selected topic
    quizSection.classList.remove('hidden'); // Show the quiz section
  
    // Show loading spinner
    loading.classList.remove('hidden');
  
    // Get quiz data from Gemini API
    const quizData = await fetchQuizQuestions(topic);
  
    // Hide loading spinner after receiving the questions
    loading.classList.add('hidden');
  
    if (quizData.length === 0) {
      questionsContainer.innerHTML = "<p>Sorry, couldn't generate quiz questions. Please try another topic.</p>";
      submitQuiz.classList.add('hidden');
      return;
    }
  
    // Loop through the questions and dynamically create HTML for each question
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
  
    // Show submit button once the questions are loaded
    submitQuiz.classList.remove('hidden');
  
    // Add event listener to submit button
    submitQuiz.onclick = () => checkAnswers(quizData);
  }
  
  // Function to fetch quiz questions from the Gemini API
  async function fetchQuizQuestions(topic) {
    const GEMINI_API_KEY = 'AIzaSyD-yM_kwCQXDkRRjWN-Z-SKb3UHgHiuj7Y'; // Replace with your actual API Key
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
  
      // Extract the quiz JSON from the response
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
  
  // Function to check answers and calculate score
  function checkAnswers(quizData) {
    let score = 0;
  
    quizData.forEach((q, idx) => {
      const options = document.getElementsByName(`question${idx}`);
      let selected = null;
  
      options.forEach((opt) => {
        if (opt.checked) selected = opt;
        
        // Reset styles for each option
        opt.parentElement.style.color = 'initial';
        opt.parentElement.style.fontWeight = 'normal';
      });
  
      options.forEach((opt) => {
        if (opt.value === q.answer) {
          // Highlight the correct answer
          opt.parentElement.style.color = 'green';
          opt.parentElement.style.fontWeight = 'bold';
        }
      });
  
      if (selected) {
        if (selected.value === q.answer) {
          score++;
        } else {
          // Highlight wrong selected answer
          selected.parentElement.style.color = 'red';
        }
      }
    });
  
    // Display score after quiz submission
    const scoreSection = document.getElementById('scoreSection');
    scoreSection.innerHTML = `
      <div style="margin-top: 20px; font-size: 20px;">
        You scored <strong>${score}</strong> out of <strong>${quizData.length}</strong>! 🎉
      </div>
    `;
  }
  