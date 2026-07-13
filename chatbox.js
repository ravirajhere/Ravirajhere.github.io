// chatbox.js - Sirf JavaScript
document.addEventListener('DOMContentLoaded', function() {
    const chatWindow = document.getElementById('chatWindow');
    const chatClose = document.getElementById('chatClose');
    const chatInput = document.getElementById('chatInput');
    const chatSend = document.getElementById('chatSend');
    const chatMessages = document.getElementById('chatMessages');

    // Chatbox ko open/close karne ke liye function (index se call hoga)
    window.openChatbox = function() {
        chatWindow.classList.toggle('open');
        if (chatWindow.classList.contains('open')) {
            chatInput.focus();
        }
    };

    // Close button
    chatClose.addEventListener('click', function() {
        chatWindow.classList.remove('open');
    });

    // Send message
    function sendMessage() {
        const msg = chatInput.value.trim();
        if (!msg) return;
        chatMessages.innerHTML += `<div class="message bot">${msg}</div>`;
        chatInput.value = '';
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    chatSend.addEventListener('click', sendMessage);
    chatInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') sendMessage();
    });

    console.log('✅ Chatbox JS loaded!');
});
