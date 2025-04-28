// Initialize Firebase (again)
import firebaseConfig from './firebaseConfig.js';


firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// Fetch user and display welcome message
auth.onAuthStateChanged((user) => {
  if (user) {
    document.getElementById('welcomeMessage').innerText = `Welcome, ${user.email}!`;
  } else {
    // Not logged in, redirect to login
    window.location.href = "login.html";
  }
});

// Handle starting quiz when tile is clicked
function startQuiz(topic) {
    console.log("Starting quiz for:", topic);
  
    // Save the topic name into localStorage
    localStorage.setItem('selectedTopic', topic);
  
    // Redirect to quiz page with topic in URL (optional, for better URL structure)
    window.location.href = `quiz.html?topic=${encodeURIComponent(topic)}`;
  }
  

// Handle logout
document.addEventListener('DOMContentLoaded', function () {
  const logoutButton = document.getElementById('logoutButton');

  logoutButton.addEventListener('click', () => {
    localStorage.clear(); // Clear any saved data like selectedTopic
    // Redirect to login page
    window.location.href = 'login.html';
  });
});

// Logout button
document.getElementById('logoutButton').addEventListener('click', () => {
  auth.signOut().then(() => {
    window.location.href = "login.html";
  });
});
