const topicForm = document.getElementById('topicForm');
const topicInput = document.getElementById('topicInput');
const quizSection = document.getElementById('quizSection');
const quizTopic = document.getElementById('quizTopic');
const questionsContainer = document.getElementById('questionsContainer');
const submitQuiz = document.getElementById('submitQuiz');
const scoreSection = document.getElementById('scoreSection');

topicForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const topic = topicInput.value.trim();
  
  if (topic) {
    quizTopic.textContent = topic;
    quizSection.classList.remove('hidden');
    questionsContainer.innerHTML = '';
    scoreSection.innerHTML = '';
    submitQuiz.classList.remove('hidden');

    loading.classList.remove('hidden'); // Show loading spinner
    // Get questions from Gemini API
    const quizData = await fetchQuizQuestions(topic);
    loading.classList.add('hidden'); // Hide loading spinner
    

    if (quizData.length === 0) {
      questionsContainer.innerHTML = "<p>Sorry, couldn't generate quiz questions. Please try another topic.</p>";
      submitQuiz.classList.add('hidden');
      return;
    }

    quizData.forEach((q, idx) => {
      const block = document.createElement('div');
      block.classList.add('question-block');
      
      block.innerHTML = `
        <p><strong>Q${idx + 1}. ${q.question}</strong></p>
        ${q.options.map((opt, i) => `
          <label>
            <input type="radio" name="question${idx}" value="${opt}">
            ${opt}
          </label><br>
        `).join('')}
      `;
      questionsContainer.appendChild(block);
    });

    submitQuiz.onclick = () => checkAnswers(quizData);
  }
});

// 🔥 Your Gemini API Call Here
async function fetchQuizQuestions(topic) {
    const GEMINI_API_KEY = 'AIzaSyD-yM_kwCQXDkRRjWN-Z-SKb3UHgHiuj7Y'; // 🔥
  
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
  
      // 🔥 Clean the output: find only the JSON part
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
  

// ✨ Function to Check Answers
function checkAnswers(quizData) {
    let score = 0;
    
    quizData.forEach((q, idx) => {
      const options = document.getElementsByName(`question${idx}`);
      let selected = null;
  
      options.forEach((opt) => {
        if (opt.checked) selected = opt;
        
        // Reset colors before marking
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
          // Highlight wrong selected answer in red
          selected.parentElement.style.color = 'red';
        }
      }
    });
  
    scoreSection.innerHTML = `
      <div style="margin-top: 20px; font-size: 20px;">
        You scored <strong>${score}</strong> out of <strong>${quizData.length}</strong>! 🎉
      </div>
    `;
  }
  
