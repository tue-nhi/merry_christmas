// ❄️ Create snowfall effect
function createSnowfall() {
  const snowContainer = document.getElementById("snow-container");
  const snowflakeCount = 100;
  
  for (let i = 0; i < snowflakeCount; i++) {
    const snowflake = document.createElement("div");
    snowflake.className = "snowflake";
    snowflake.innerHTML = "❄";
    
    // Random starting position
    const startX = Math.random() * 100;
    const drift = (Math.random() - 0.5) * 200; // Random horizontal drift
    
    snowflake.style.left = startX + "%";
    snowflake.style.animationDuration = (Math.random() * 10 + 10) + "s"; // 10-20 seconds
    snowflake.style.animationDelay = Math.random() * 5 + "s";
    snowflake.style.fontSize = (Math.random() * 10 + 10) + "px";
    snowflake.style.setProperty("--drift", drift + "px");
    
    snowContainer.appendChild(snowflake);
  }
}

// Advent Calendar Configuration
const QUESTIONS = [
  {
    question: "Số đo 3 vòng của em theo thứ tự từ trên xúngg",
    answers: ["83, 62, 90", "83, 62, 90", "83, 62, 90", "83 62 90"], // Add more variations if needed: ["pizza", "pasta"]
    ornamentImage: "ornament1.png", // Replace with your image path
    finalImage: "photo1.jpg" // Replace with your photo path
  },
  {
    question: "Mình gặp nhau lần đầu hôm nàoo (cả ngày tháng năm nha)?",
    answers: ["31/07/2025"],
    ornamentImage: "ornament2.png",
    finalImage: "photo2.jpg"
  },
  {
    question: "Bộ phim đầu tiên mình xem chung?",
    answers: ["Your name"],
    ornamentImage: "ornament3.png",
    finalImage: "photo3.jpg"
  },
  {
    question: "Lúc call babi em khóc tổng bao nhiu lần?",
    answers: ["hong đếm được"],
    ornamentImage: "ornament4.png",
    finalImage: "photo4.jpg"
  },
  {
    question: "Nhắn tin với em đầu tiên hôm nàoo?",
    answers: ["31/05/2025", "01/06/2025", "01/6/2025", "31/05/2025", "01/06"],
    ornamentImage: "ornament5.png",
    finalImage: "photo5.jpg"
  },
  {
    question: "Bài hát Giáng sinh miêu tả tình cảm của em cho anh?",
    answers: ["All I want for Christmas is you", "all I want for christmas is you", "All I want for christmas is you"],
    ornamentImage: "ornament6.png",
    finalImage: "photo6.jpg"
  },
  {
    question: "Em thích loài chó nào nhất zị?",
    answers: ["Labrador", "labrador", "chó labrador"],
    ornamentImage: "ornament7.png",
    finalImage: "photo7.jpg"
  },
  {
    question: "Anh có iu em hongg 🥹",
    answers: ["coá", "anh có iu em", "anh yêu em", "có"],
    ornamentImage: "ornament8.png",
    finalImage: "photo8.jpg"
  }
];


let answeredQuestions = new Set();
let currentQuestionIndex = null;
let wrongAttempts = {}; // Track wrong attempts per question

// Initialize advent calendar
function initAdventCalendar() {
  const grid = document.getElementById("advent-grid");
  grid.innerHTML = '';
  
  QUESTIONS.forEach((q, index) => {
    const door = document.createElement("div");
    door.className = "advent-door locked";
    door.dataset.index = index;
    
    // Set ornament image
    if (q.ornamentImage) {
      door.style.setProperty('--ornament-image', `url(${q.ornamentImage})`);
    }
    
    const number = document.createElement("div");
    number.className = "advent-door-number";
    number.textContent = index + 1;
    
    door.appendChild(number);
    door.addEventListener('click', () => openQuestion(index));
    grid.appendChild(door);
  });
}

// Open question modal
function openQuestion(index) {
  if (answeredQuestions.has(index)) {
    return; // Already answered
  }
  
  currentQuestionIndex = index;
  const question = QUESTIONS[index];
  
  document.getElementById("modal-question").textContent = question.question;
  document.getElementById("modal-answer").value = "";
  document.getElementById("modal-feedback").textContent = "";
  document.getElementById("modal-feedback").className = "feedback";
  document.getElementById("modal-answer").style.display = "block";
  document.getElementById("modal-submit").style.display = "block";
  document.getElementById("question-modal").classList.remove("hidden");
  document.getElementById("modal-answer").focus();
}

// Close question modal
function closeModal() {
  document.getElementById("question-modal").classList.add("hidden");
  currentQuestionIndex = null;
}

// Submit answer
function submitAnswer() {
  if (currentQuestionIndex === null) return;
  
  const input = document.getElementById("modal-answer");
  const feedback = document.getElementById("modal-feedback");
  const answer = input.value.toLowerCase().trim();
  const question = QUESTIONS[currentQuestionIndex];
  
  // Special handling for question 4 (index 3) - always correct
  if (currentQuestionIndex === 3) {
    feedback.textContent = "em bíc anh hong nhớ mà hic, anh chạ iu emm";
    feedback.className = "feedback correct";
    
    // Unlock door
    setTimeout(() => {
      const door = document.querySelector(`.advent-door[data-index="${currentQuestionIndex}"]`);
      if (door) {
        door.classList.remove("locked");
        door.classList.add("unlocked");
      }
      
      answeredQuestions.add(currentQuestionIndex);
      closeModal();
      
      // Check if all questions are answered
      if (answeredQuestions.size === QUESTIONS.length) {
        setTimeout(() => {
          showFinalTree();
        }, 1500);
      }
    }, 2000);
    return;
  }
  
  // Special handling for question 8 (index 7) - after 2 wrong attempts, auto correct
  if (currentQuestionIndex === 7) {
    if (!wrongAttempts[7]) {
      wrongAttempts[7] = 0;
    }
    
    const isCorrect = question.answers.some(correct => 
      answer.includes(correct.toLowerCase())
    );
    
    if (isCorrect || wrongAttempts[7] >= 2) {
      // Correct answer OR after 2 wrong attempts
      if (wrongAttempts[7] >= 2) {
        feedback.textContent = "em hong thương em àa";
      } else {
        feedback.textContent = "✨ Ỏ embe trả lời đúng hết gòi nè";
      }
      feedback.className = "feedback correct";
      
      // Unlock door
      setTimeout(() => {
        const door = document.querySelector(`.advent-door[data-index="${currentQuestionIndex}"]`);
        if (door) {
          door.classList.remove("locked");
          door.classList.add("unlocked");
        }
        
        answeredQuestions.add(currentQuestionIndex);
        wrongAttempts[7] = 0; // Reset
        closeModal();
        
        // Check if all questions are answered
        if (answeredQuestions.size === QUESTIONS.length) {
          setTimeout(() => {
            showFinalTree();
          }, 1500);
        }
      }, wrongAttempts[7] >= 2 ? 2000 : 1000);
    } else {
      // Wrong answer - increment counter
      wrongAttempts[7]++;
      feedback.textContent = "Tôy bíc mà, 41/100 :(";
      feedback.className = "feedback incorrect";
      input.value = "";
      input.focus();
    }
    return;
  }
  
  const isCorrect = question.answers.some(correct => 
    answer.includes(correct.toLowerCase())
  );
  
  if (isCorrect) {
    feedback.textContent = "✨ đúng gòii, mở được quà nìee";
    feedback.className = "feedback correct";
    
    // Unlock door
    setTimeout(() => {
      const door = document.querySelector(`.advent-door[data-index="${currentQuestionIndex}"]`);
      if (door) {
        door.classList.remove("locked");
        door.classList.add("unlocked");
      }
      
      answeredQuestions.add(currentQuestionIndex);
      closeModal();
      
      // Check if all questions are answered
      if (answeredQuestions.size === QUESTIONS.length) {
        setTimeout(() => {
          showFinalTree();
        }, 1500);
      }
    }, 1000);
  } else {
    feedback.textContent = "anh quên gòi í gì :(";
    feedback.className = "feedback incorrect";
    input.value = "";
    input.focus();
  }
}

// Update progress bar
function updateProgress() {
  const progress = (answeredQuestions.size / QUESTIONS.length) * 100;
  document.getElementById("progress-fill").style.width = progress + "%";
  document.getElementById("progress-text").textContent = 
    `${answeredQuestions.size}/${QUESTIONS.length} Ornaments Unlocked`;
}

// Show final tree with letter star
function showFinalTree() {
  document.getElementById("quiz").classList.add("hidden");
  document.getElementById("letter").classList.remove("hidden");
}

// Show picture in modal
function showPicture(imagePath) {
  document.getElementById("modal-picture").src = imagePath;
  document.getElementById("picture-modal").classList.remove("hidden");
}

// Close picture modal
function closePictureModal() {
  document.getElementById("picture-modal").classList.add("hidden");
}

// Allow Enter key to submit
document.addEventListener("DOMContentLoaded", function() {
  const modalAnswer = document.getElementById("modal-answer");
  if (modalAnswer) {
    modalAnswer.addEventListener("keypress", function(e) {
      if (e.key === "Enter") {
        submitAnswer();
      }
    });
  }
  
  // Close modals on background click
  document.getElementById("question-modal")?.addEventListener("click", function(e) {
    if (e.target === this) {
      closeModal();
    }
  });
  
  document.getElementById("picture-modal")?.addEventListener("click", function(e) {
    if (e.target === this) {
      closePictureModal();
    }
  });
  
  document.getElementById("letter-modal")?.addEventListener("click", function(e) {
    if (e.target === this) {
      document.getElementById("letter-modal").classList.add("hidden");
    }
  });
});

// Initialize snowfall and advent calendar when page loads
window.addEventListener("load", function() {
  createSnowfall();
  initAdventCalendar();
});

// Show letter when tree is clicked
function showLetter() {
  document.getElementById("letter-modal").classList.remove("hidden");
}

function yes() {
  alert("Merry Christmas & marry mee");
}
