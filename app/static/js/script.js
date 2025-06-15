$(document).ready(function() {
    const chatMessages = $('#chat-messages');
    const userInput = $('#user-input');
    const sendButton = $('#send-button');
    
    // Add message to chat
    function addMessage(content, isUser) {
        const messageClass = isUser ? 'user-message' : 'bot-message';
        const messageElement = $(`<div class="message ${messageClass}">${content}</div>`);
        chatMessages.append(messageElement);
        chatMessages.scrollTop(chatMessages[0].scrollHeight);
    }
    
    // Send message to server
    function sendMessage() {
        const message = userInput.val().trim();
        if (message === '') return;
        
        addMessage(message, true);
        userInput.val('');
        
        // Disable input while waiting for response
        userInput.prop('disabled', true);
        sendButton.prop('disabled', true);
        
        // Show typing indicator
        const typingIndicator = $('<div class="message bot-message">Typing...</div>');
        chatMessages.append(typingIndicator);
        chatMessages.scrollTop(chatMessages[0].scrollHeight);
        
        // Send to server
        $.ajax({
            url: '/chat',
            type: 'POST',
            contentType: 'application/json',
            data: JSON.stringify({ message: message }),
            success: function(response) {
                typingIndicator.remove();
                addMessage(response.response, false);
            },
            error: function(xhr) {
                typingIndicator.remove();
                addMessage('Error: ' + (xhr.responseJSON?.error || 'Failed to get response'), false);
            },
            complete: function() {
                userInput.prop('disabled', false);
                sendButton.prop('disabled', false);
                userInput.focus();
            }
        });
    }
    
    // Event handlers
    sendButton.click(sendMessage);
    userInput.keypress(function(e) {
        if (e.which === 13) { // Enter key
            sendMessage();
        }
    });
    
    // Focus input on load
    userInput.focus();
});