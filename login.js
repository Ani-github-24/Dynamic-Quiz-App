// login.js

// Your Firebase configuration
import firebaseConfig from './firebaseConfig.js';

  
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
  