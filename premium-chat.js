
document.addEventListener('DOMContentLoaded', () => {
  if(document.getElementById('chat-toggle')) return; // Check if already injected
  
  const protocol = window.location.protocol;
  const isHtmlFiles = window.location.pathname.includes('Html-Files');
  const appointmentLink = isHtmlFiles ? 'appointment.html' : 'Html-Files/appointment.html';

  const chatHTML = 
    '<div id="chat-toggle"><i class="fas fa-comment-medical"></i></div>' +
    '<div id="premium-chat-widget">' +
      '<div class="chat-header">' +
        'Live Doctor Chat <span class="timer" id="chat-timer">02:00</span>' +
        '<i class="fas fa-times" id="close-chat" style="cursor:pointer; font-size:18px;"></i>' +
      '</div>' +
      '<div class="chat-messages" id="chat-msgs">' +
        '<div class="chat-msg bot">Hello! I\'m Dr. Sarah from MediSwift. How can I assist you today? You have 2 free minutes of consultation.</div>' +
      '</div>' +
      '<div class="chat-input-area">' +
        '<input type="text" id="chat-input" placeholder="Type your symptoms...">' +
        '<button id="send-chat"><i class="fas fa-paper-plane"></i></button>' +
      '</div>' +
      '<div class="paywall-overlay" id="paywall">' +
        '<h3><i class="fas fa-lock"></i> Time\'s Up!</h3>' +
        '<p>Your 2-minute free consultation session has expired. Please upgrade or book an appointment to securely continue chatting with our medical experts.</p>' +
        '<button onclick="window.location.href=\'' + appointmentLink + '\'">Book Appointment ($49)</button>' +
      '</div>' +
    '</div>';
  document.body.insertAdjacentHTML('beforeend', chatHTML);

  const toggleBtn = document.getElementById('chat-toggle');
  const widget = document.getElementById('premium-chat-widget');
  const closeBtn = document.getElementById('close-chat');
  const sendBtn = document.getElementById('send-chat');
  const input = document.getElementById('chat-input');
  const msgs = document.getElementById('chat-msgs');
  const timerDisplay = document.getElementById('chat-timer');
  const paywall = document.getElementById('paywall');

  let timeLeft = 120;
  let timerInterval;
  let chatStarted = false;

  toggleBtn.addEventListener('click', () => {
    widget.classList.add('open');
    toggleBtn.style.transform = 'scale(0)';
    setTimeout(() => toggleBtn.style.display = 'none', 300);
    if (!chatStarted) {
      chatStarted = true;
      startTimer();
    }
  });

  closeBtn.addEventListener('click', () => {
    widget.classList.remove('open');
    toggleBtn.style.display = 'flex';
    setTimeout(() => toggleBtn.style.transform = 'scale(1)', 50);
  });

  function startTimer() {
    timerInterval = setInterval(() => {
      timeLeft--;
      let m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
      let s = (timeLeft % 60).toString().padStart(2, '0');
      timerDisplay.innerText = m + ':' + s;
      
      if (timeLeft <= 30) {
        timerDisplay.style.background = 'rgba(255, 60, 60, 0.5)';
        timerDisplay.style.color = '#fff';
      }

      if (timeLeft <= 0) {
        clearInterval(timerInterval);
        paywall.classList.add('active');
        input.disabled = true;
      }
    }, 1000);
  }

  function addMsg(text, type) {
    const d = document.createElement('div');
    d.className = 'chat-msg ' + type;
    d.innerText = text;
    msgs.appendChild(d);
    msgs.scrollTop = msgs.scrollHeight;
  }

  const responses = [
    "I understand. How long have you been experiencing these symptoms?",
    "Could you describe the pain or discomfort on a scale of 1 to 10?",
    "Have you taken any medication for this recently?",
    "Let me check our systems. We definitely recommend resting. Would you like to schedule an in-person meeting?"
  ];
  let resIdx = 0;

  sendBtn.addEventListener('click', () => {
    if (input.value.trim() && timeLeft > 0) {
      addMsg(input.value, 'user');
      input.value = '';
      
      const typingD = document.createElement('div');
      typingD.className = 'chat-msg bot';
      typingD.innerHTML = '<i class="fas fa-ellipsis-h"></i>';
      msgs.appendChild(typingD);
      msgs.scrollTop = msgs.scrollHeight;

      setTimeout(() => {
        msgs.removeChild(typingD);
        if (timeLeft > 0) {
          addMsg(responses[resIdx % responses.length], 'bot');
          resIdx++;
        }
      }, 1500);
    }
  });

  input.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') sendBtn.click();
  });
});
