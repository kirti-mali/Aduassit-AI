// AduAssist AI - Academic Chatbot JavaScript

class AcademicChatbot {
    constructor() {
        this.currentSubject = 'general';
        this.userName = localStorage.getItem('userName') || 'Student';
        this.gradeLevel = localStorage.getItem('gradeLevel') || 'high';
        this.learningStyle = localStorage.getItem('learningStyle') || 'mixed';
        this.chatHistory = [];
        
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.updateUserGreeting();
        this.loadChatHistory();
    }

    setupEventListeners() {
        // Send message
        const sendBtn = document.getElementById('sendBtn');
        const messageInput = document.getElementById('messageInput');
        
        sendBtn.addEventListener('click', () => this.sendMessage());
        messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') this.sendMessage();
        });

        // Character count
        messageInput.addEventListener('input', () => this.updateCharCount());

        // Subject selection
        document.querySelectorAll('.subject-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.selectSubject(e.target.dataset.subject));
        });

        // Quick actions
        document.querySelectorAll('.quick-btn').forEach(btn => {
            btn.addEventListener('click', (e) => this.handleQuickAction(e.target.dataset.action));
        });

        // Settings modal
        const settingsBtn = document.getElementById('settingsBtn');
        const settingsModal = document.getElementById('settingsModal');
        const closeModal = document.querySelector('.close');
        const saveSettings = document.getElementById('saveSettings');

        settingsBtn.addEventListener('click', () => settingsModal.style.display = 'block');
        closeModal.addEventListener('click', () => settingsModal.style.display = 'none');
        saveSettings.addEventListener('click', () => this.saveSettings());

        // Voice input
        document.getElementById('voiceBtn').addEventListener('click', () => this.handleVoiceInput());
        
        // File attachment
        document.getElementById('attachBtn').addEventListener('click', () => this.handleFileAttachment());
    }
    updateCharCount() {
        const input = document.getElementById('messageInput');
        const charCount = document.querySelector('.char-count');
        charCount.textContent = `${input.value.length}/500`;
        
        if (input.value.length > 450) {
            charCount.style.color = '#ef4444';
        } else {
            charCount.style.color = '#6b7280';
        }
    }

    selectSubject(subject) {
        this.currentSubject = subject;
        
        // Update active button
        document.querySelectorAll('.subject-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-subject="${subject}"]`).classList.add('active');
        
        // Add context message
        this.addMessage('bot', `Great! I'm now focused on ${this.getSubjectName(subject)}. How can I help you with this subject?`);
    }

    getSubjectName(subject) {
        const subjects = {
            general: 'General Studies',
            math: 'Mathematics',
            science: 'Science',
            english: 'English',
            history: 'History',
            programming: 'Programming'
        };
        return subjects[subject] || 'General Studies';
    }

    handleQuickAction(action) {
        const actions = {
            explain: "I'd like you to explain a concept to me.",
            solve: "Can you help me solve a problem?",
            study: "What are some effective study tips?",
            quiz: "Can you give me a quick quiz?"
        };
        
        const message = actions[action];
        if (message) {
            document.getElementById('messageInput').value = message;
            this.sendMessage();
        }
    }

    sendMessage() {
        const input = document.getElementById('messageInput');
        const message = input.value.trim();
        
        if (!message) return;
        
        // Add user message
        this.addMessage('user', message);
        input.value = '';
        this.updateCharCount();
        
        // Show typing indicator
        this.showTypingIndicator();
        
        // Simulate AI response
        setTimeout(() => {
            this.hideTypingIndicator();
            this.generateAIResponse(message);
        }, 1000 + Math.random() * 2000);
    }
    addMessage(sender, content) {
        const chatMessages = document.getElementById('chatMessages');
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${sender}-message`;
        
        const avatar = sender === 'bot' ? '<i class="fas fa-robot"></i>' : '<i class="fas fa-user"></i>';
        
        messageDiv.innerHTML = `
            <div class="message-avatar">
                ${avatar}
            </div>
            <div class="message-content">
                ${content.includes('<br>') ? content : `<p>${content}</p>`}
            </div>
        `;
        
        chatMessages.appendChild(messageDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
        
        // Save to history
        this.chatHistory.push({ sender, content, timestamp: new Date() });
        this.saveChatHistory();
    }

    showTypingIndicator() {
        const chatMessages = document.getElementById('chatMessages');
        const typingDiv = document.createElement('div');
        typingDiv.className = 'message bot-message typing-indicator';
        typingDiv.id = 'typingIndicator';
        
        typingDiv.innerHTML = `
            <div class="message-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <span>AduAssist is thinking</span>
                <div class="typing-dots">
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                    <div class="typing-dot"></div>
                </div>
            </div>
        `;
        
        chatMessages.appendChild(typingDiv);
        chatMessages.scrollTop = chatMessages.scrollHeight;
    }

    hideTypingIndicator() {
        const typingIndicator = document.getElementById('typingIndicator');
        if (typingIndicator) {
            typingIndicator.remove();
        }
    }

    generateAIResponse(userMessage) {
        const responses = this.getContextualResponses(userMessage.toLowerCase());
        const response = responses[Math.floor(Math.random() * responses.length)];
        this.addMessage('bot', response);
    }
    getContextualResponses(message) {
        // Math responses
        if (message.includes('math') || message.includes('algebra') || message.includes('calculus') || message.includes('geometry')) {
            return [
                "I'd be happy to help with mathematics! Could you share the specific problem or concept you're working on?",
                "Mathematics can be challenging, but breaking it down step by step makes it manageable. What area of math are you studying?",
                "Let's tackle this math problem together! Please share the equation or concept you need help with."
            ];
        }
        
        // Science responses
        if (message.includes('science') || message.includes('physics') || message.includes('chemistry') || message.includes('biology')) {
            return [
                "Science is fascinating! What specific topic or experiment are you curious about?",
                "I love helping with science concepts. Are you working on a particular subject like physics, chemistry, or biology?",
                "Let's explore this scientific concept together! What would you like to understand better?"
            ];
        }
        
        // Study tips
        if (message.includes('study') || message.includes('tips') || message.includes('learn')) {
            return [
                `Here are some effective study techniques for ${this.learningStyle} learners like you:<br><br>• Use active recall - test yourself regularly<br>• Create a study schedule and stick to it<br>• Take breaks every 25-30 minutes<br>• Find a quiet, dedicated study space<br>• Use visual aids like diagrams and charts<br><br>What subject are you preparing for?`,
                "Great question! Effective studying is about quality, not just quantity. Try the Pomodoro Technique: 25 minutes of focused study followed by a 5-minute break. What's your biggest study challenge?",
                "Study tips tailored for you:<br><br>1. Start with the hardest subject when your mind is fresh<br>2. Use multiple senses - read aloud, write notes, draw diagrams<br>3. Teach concepts to someone else<br>4. Review material within 24 hours<br><br>Which study method works best for you?"
            ];
        }
        
        // Quiz responses
        if (message.includes('quiz') || message.includes('test') || message.includes('question')) {
            return [
                `Let's do a quick ${this.getSubjectName(this.currentSubject)} quiz! Here's your question:<br><br>What is the most important study habit for academic success?<br><br>A) Studying for long hours without breaks<br>B) Regular review and active practice<br>C) Memorizing everything<br>D) Only studying before exams<br><br>What's your answer?`,
                "Quiz time! I'll ask you a question based on your current subject. Ready?<br><br>Which learning technique helps with long-term retention?<br><br>A) Cramming<br>B) Spaced repetition<br>C) Passive reading<br>D) Highlighting everything<br><br>Take your best guess!",
                "Perfect! Let's test your knowledge. Here's a study skills question:<br><br>What's the recommended study session length for optimal focus?<br><br>A) 3-4 hours<br>B) 25-30 minutes<br>C) 1-2 hours<br>D) Until you're exhausted<br><br>What do you think?"
            ];
        }
        
        // Default responses
        return [
            `That's an interesting question about ${this.getSubjectName(this.currentSubject)}! Could you provide more details so I can give you a more specific answer?`,
            "I'm here to help you succeed academically! Can you tell me more about what you're working on?",
            `As your academic assistant, I want to make sure I understand your question correctly. Could you elaborate on what you need help with in ${this.getSubjectName(this.currentSubject)}?`,
            "Great question! I'm designed to help students like you excel in their studies. What specific topic or assignment are you working on?",
            "I'm excited to help you learn! Could you share more context about your question so I can provide the most helpful response?"
        ];
    }
    updateUserGreeting() {
        const greeting = document.getElementById('userGreeting');
        const hour = new Date().getHours();
        let timeGreeting = 'Good evening';
        
        if (hour < 12) timeGreeting = 'Good morning';
        else if (hour < 18) timeGreeting = 'Good afternoon';
        
        greeting.textContent = `${timeGreeting}, ${this.userName}!`;
    }

    saveSettings() {
        const userName = document.getElementById('userName').value.trim();
        const gradeLevel = document.getElementById('gradeLevel').value;
        const learningStyle = document.getElementById('learningStyle').value;
        
        if (userName) {
            this.userName = userName;
            localStorage.setItem('userName', userName);
        }
        
        this.gradeLevel = gradeLevel;
        this.learningStyle = learningStyle;
        
        localStorage.setItem('gradeLevel', gradeLevel);
        localStorage.setItem('learningStyle', learningStyle);
        
        this.updateUserGreeting();
        document.getElementById('settingsModal').style.display = 'none';
        
        this.addMessage('bot', `Settings updated! I now know you're a ${gradeLevel} student with a ${learningStyle} learning style. I'll tailor my responses accordingly.`);
    }

    handleVoiceInput() {
        // Check if browser supports speech recognition
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            const recognition = new SpeechRecognition();
            
            recognition.continuous = false;
            recognition.interimResults = false;
            recognition.lang = 'en-US';
            
            recognition.onstart = () => {
                document.getElementById('voiceBtn').innerHTML = '<i class="fas fa-stop"></i>';
                this.addMessage('bot', 'Listening... Please speak your question.');
            };
            
            recognition.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                document.getElementById('messageInput').value = transcript;
                document.getElementById('voiceBtn').innerHTML = '<i class="fas fa-microphone"></i>';
            };
            
            recognition.onerror = () => {
                document.getElementById('voiceBtn').innerHTML = '<i class="fas fa-microphone"></i>';
                this.addMessage('bot', 'Sorry, I couldn\'t hear you clearly. Please try typing your question.');
            };
            
            recognition.onend = () => {
                document.getElementById('voiceBtn').innerHTML = '<i class="fas fa-microphone"></i>';
            };
            
            recognition.start();
        } else {
            this.addMessage('bot', 'Voice input is not supported in your browser. Please type your question.');
        }
    }

    handleFileAttachment() {
        this.addMessage('bot', 'File attachment feature is coming soon! For now, you can describe your homework or paste text directly in the chat.');
    }

    saveChatHistory() {
        localStorage.setItem('chatHistory', JSON.stringify(this.chatHistory.slice(-50))); // Keep last 50 messages
    }

    loadChatHistory() {
        const saved = localStorage.getItem('chatHistory');
        if (saved) {
            this.chatHistory = JSON.parse(saved);
        }
    }
}

// Initialize the chatbot when page loads
document.addEventListener('DOMContentLoaded', () => {
    new AcademicChatbot();
});

// Close modal when clicking outside
window.addEventListener('click', (event) => {
    const modal = document.getElementById('settingsModal');
    if (event.target === modal) {
        modal.style.display = 'none';
    }
});