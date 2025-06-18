$(document).ready(function() {
    const chatMessages = $('#chat-messages');
    const userInput = $('#user-input');
    const sendButton = $('#send-button');
    
    function addMessage(content, isUser) {
        const messageClass = isUser ? 'user-message' : 'bot-message';
        const messageElement = $(`<div class="message ${messageClass}">${content}</div>`);
        chatMessages.append(messageElement);
        chatMessages.scrollTop(chatMessages[0].scrollHeight);
    }
    
    function sendMessage() {
        const message = userInput.val().trim();
        if (message === '') return;
        
        addMessage(message, true);
        userInput.val('');
        
        // Disable UI during request
        userInput.prop('disabled', true);
        sendButton.prop('disabled', true);
        
        // Typing indicator
        const typingIndicator = $('<div class="message bot-message">Typing...</div>');
        chatMessages.append(typingIndicator);
        chatMessages.scrollTop(chatMessages[0].scrollHeight);
        
        // Critical fixes below:
        $.ajax({
            url: 'app.php', // Changed from api.php to app.php
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ message: message }),
            dataType: 'json', // Explicitly expect JSON response
            timeout: 10000, // 10-second timeout
            success: function(response) {
                typingIndicator.remove();
                
                // Enhanced response handling
                if (response && response.candidates) {
                    const text = response.candidates[0].content.parts[0].text;
                    addMessage(text, false);
                } else if (response && response.error) {
                    addMessage('API Error: ' + response.error, false);
                } else {
                    addMessage('Invalid response format', false);
                }
            },
            error: function(xhr, status, error) {
                typingIndicator.remove();
                
                // Detailed error handling
                let errorMsg = 'Error: ';
                if (xhr.status === 0) {
                    errorMsg += 'Network connection failed';
                } else if (xhr.responseJSON && xhr.responseJSON.error) {
                    errorMsg += xhr.responseJSON.error;
                } else {
                    errorMsg += error || 'Unknown error';
                }
                addMessage(errorMsg, false);
            },
            complete: function() {
                userInput.prop('disabled', false).focus();
                sendButton.prop('disabled', false);
            }
        });
    }
    
    // Event handlers
    sendButton.on('click', sendMessage);
    userInput.on('keypress', function(e) {
        if (e.which === 13) sendMessage();
    });
    
    userInput.focus();
});