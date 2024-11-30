document.addEventListener('DOMContentLoaded', function() {

    // Testimonial slider with improved reliability
    const testimonials = [
        {
            name: "Mike Taylor",
            location: "Lahore, Pakistan",
            quote: "SwapSpot has changed how I approach sustainability! I now trade items I don't need for services like design and tutoring, reducing waste and finding real value in every exchange.",
            avatar: "img/download.jpeg"
        },
        {
            name: "Sarah Johnson",
            location: "New York, USA",
            quote: "What an amazing platform! I've made so many successful trades and met wonderful people. The community here is incredibly supportive and trustworthy.",
            avatar: "img/download.jpeg"
        },
        {
            name: "David Chen",
            location: "Singapore",
            quote: "The verification system gives me peace of mind when trading. I've completed over 20 successful swaps so far. Highly recommended!",
            avatar: "img/download.jpeg"
        }
    ];

    let currentTestimonialIndex = 0;
    const testimonialCard = document.querySelector('.testimonial-card');

    function updateTestimonial() {
        if (!testimonialCard) return;
        
        const currentTestimonial = testimonials[currentTestimonialIndex];
        testimonialCard.style.opacity = '0';
        
        setTimeout(() => {
            testimonialCard.innerHTML = `
                <div class="testimonial-content">
                    <div class="testimonial-user">
                        <img src="${currentTestimonial.avatar}" alt="User avatar" class="testimonial-avatar">
                        <div class="user-info">
                            <p class="testimonial-name">${currentTestimonial.name}</p>
                            <p class="testimonial-location">${currentTestimonial.location}</p>
                        </div>
                    </div>
                    <p class="testimonial-quote">${currentTestimonial.quote}</p>
                </div>
            `;
            testimonialCard.style.opacity = '1';
        }, 500);

        currentTestimonialIndex = (currentTestimonialIndex + 1) % testimonials.length;
    }

    setInterval(updateTestimonial, 5000);

    // Subscription form handler
    const subscriptionForm = document.querySelector('.subscription-form');
    if (subscriptionForm) {
        subscriptionForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('.email-input');
            const email = emailInput.value;
            
            if (email && email.includes('@') && email.includes('.')) {
                showMessage('Thank you for subscribing!', 'success');
                emailInput.value = '';
            } else {
                showMessage('Please enter a valid email address', 'error');
            }
        });
    }

    // Message display utility
    function showMessage(message, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        messageDiv.textContent = message;
        messageDiv.style.cssText = `
            padding: 10px;
            margin-top: 10px;
            border-radius: 5px;
            background-color: ${type === 'success' ? '#d4edda' : '#f8d7da'};
            color: ${type === 'success' ? '#155724' : '#721c24'};
        `;
        
        const subscriptionContent = document.querySelector('.subscription-content');
        if (subscriptionContent) {
            subscriptionContent.appendChild(messageDiv);
            setTimeout(() => messageDiv.remove(), 3000);
        }
    }
});
