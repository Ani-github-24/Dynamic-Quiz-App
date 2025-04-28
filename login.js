// login.js

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBrzGjYJjr1aQV_2QWS7mnOc5wUJcj9ixI",
    authDomain: "dynamic-quiz-page.firebaseapp.com",
    projectId: "dynamic-quiz-page",
    storageBucket: "dynamic-quiz-page.firebasestorage.app",
    messagingSenderId: "552535960214",
    appId: "1:552535960214:web:9c2e83b610ceb13f7c30b7",
    measurementId: "G-H6LSVS9RMY"
  };
  
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  const auth = firebase.auth();  // <-- ✅ this is the right way
  
  // Get elements
  const loginForm = document.getElementById('loginForm');
  
  // Add event listener to sign in button
  loginForm.addEventListener('submit', (e) => {
    e.preventDefault();  // Prevent form from submitting normally
  
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;
  
    auth.signInWithEmailAndPassword(email, password)
      .then((userCredential) => {
        // Signed in successfully
        const user = userCredential.user;
        console.log("Signed in as:", user.email);
        window.location.href = "dashboard.html";  // Redirect
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.error("Error:", errorCode, errorMessage);
        alert("Login failed: " + errorMessage);  // Show error
      });
  });
  