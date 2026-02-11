document.addEventListener('DOMContentLoaded', () => {
    // Mobile Menu Toggle
    const hamburger = document.querySelector('.hamburger');
    const navLinks = document.querySelector('.nav-links');
    const links = document.querySelectorAll('.nav-links li');

    hamburger.addEventListener('click', () => {
        navLinks.classList.toggle('nav-active');
        hamburger.classList.toggle('toggle');
    });

    // Smooth Scrolling
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            navLinks.classList.remove('nav-active'); // Close menu on click

            document.querySelector(this.getAttribute('href')).scrollIntoView({
                behavior: 'smooth'
            });
        });
    });

    // Intersection Observer for Fade-in Animation
    const sections = document.querySelectorAll('.section');
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (!entry.isIntersecting) {
                return;
            }
            entry.target.classList.add('visible');
            observer.unobserve(entry.target);
        });
    }, observerOptions);

    sections.forEach(section => {
        observer.observe(section);
    });

    // Contact Form Handler
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function (event) {
            event.preventDefault();
            const btn = contactForm.querySelector('button');
            const originalText = btn.innerText;

            btn.innerText = 'Sending...';
            btn.disabled = true;

            // Generate a five digit number for the contact_number variable
            // this.contact_number.value = Math.random() * 100000 | 0;

            // emailjs.sendForm('YOUR_SERVICE_ID', 'YOUR_TEMPLATE_ID', this)
            emailjs.sendForm('service_b17tl3f', 'template_0zzmg48', this)
                .then(function () {
                    alert('Message Sent Successfully!');
                    contactForm.reset();
                    btn.innerText = originalText;
                    btn.disabled = false;
                }, function (error) {
                    alert('Failed to send message: ' + JSON.stringify(error));
                    btn.innerText = originalText;
                    btn.disabled = false;
                });
        });
    }

    // Show More Projects
    const showMoreBtn = document.getElementById('showMoreBtn');
    const hiddenProjects = document.querySelectorAll('.hidden-project');

    if (showMoreBtn) {
        showMoreBtn.addEventListener('click', () => {
            const isHidden = hiddenProjects[0].style.display === '' || hiddenProjects[0].style.display === 'none';

            hiddenProjects.forEach(project => {
                project.style.display = isHidden ? 'block' : 'none';
            });

            showMoreBtn.innerText = isHidden ? 'Show Less' : 'Show More';
        });
    }
});
