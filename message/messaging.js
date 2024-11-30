// Get DOM elements
const messageInput = document.querySelector('.chat-input input');
const sendButton = document.querySelector('.chat-input button');
const chatMessages = document.querySelector('.chat-messages');

// Function to create a message element
function createMessage(messageText, isSent) {
    // Create message container
    const messageDiv = document.createElement('div');
    messageDiv.className = isSent ? 'sent-message' : 'received-message';
    
    // Add message content and delete button for sent messages
    messageDiv.innerHTML = `
        ${messageText}
        ${isSent ? '<button class="delete-btn">×</button>' : ''}
    `;
    
    // Add delete functionality for sent messages
    if (isSent) {
        const deleteBtn = messageDiv.querySelector('.delete-btn');
        deleteBtn.onclick = () => messageDiv.remove();
    }
    
    return messageDiv;
}

// Function to send message
function sendMessage() {
    const messageText = messageInput.value.trim();
    
    if (messageText) {
        // Create and add the sent message
        const messageElement = createMessage(messageText, true);
        chatMessages.appendChild(messageElement);
        
        // Clear input
        messageInput.value = '';
        
        // Scroll to bottom
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Simulate reply (for demo purposes)
        setTimeout(() => {
            const replies = [
                "Got it!",
                "Thanks for the message",
                "I'll check and get back to you",
                "Okay, noted",
                "Thanks!"
            ];
            const randomReply = replies[Math.floor(Math.random() * replies.length)];
            const replyElement = createMessage(randomReply, false);
            chatMessages.appendChild(replyElement);
            chatMessages.scrollTop = chatMessages.scrollHeight;
        }, 1000);
    }
}

// Add event listeners
sendButton.addEventListener('click', sendMessage);

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessage();
    }
});

// Add some CSS for the delete button
const style = document.createElement('style');
style.textContent = `
    .delete-btn {
        display: none;
        position: absolute;
        right: 5px;
        top: 50%;
        transform: translateY(-50%);
        background: none;
        border: none;
        color: #666;
        font-size: 18px;
        cursor: pointer;
        padding: 0 5px;
    }
    
    .sent-message {
        position: relative;
        padding-right: 25px;
    }
    
    .sent-message:hover .delete-btn {
        display: block;
    }
    
    .delete-btn:hover {
        color: #ff4444;
    }
`;
document.head.appendChild(style);