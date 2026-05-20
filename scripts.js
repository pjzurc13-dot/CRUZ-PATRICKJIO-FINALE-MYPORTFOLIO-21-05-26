// Wait for all HTML components to load before initializing
document.addEventListener('DOMContentLoaded', function() {
    
    // Use Promise.all to wait for ALL fetch requests to complete
    Promise.all([
        fetch('nav.html').then(response => response.text()),
        fetch('body.html').then(response => response.text()),
        fetch('footer.html').then(response => response.text())
    ])
    .then(([navHtml, bodyHtml, footerHtml]) => {
        // Insert all HTML content
        document.getElementById('nav-placeholder').innerHTML = navHtml;
        document.getElementById('body-placeholder').innerHTML = bodyHtml;
        document.getElementById('footer-placeholder').innerHTML = footerHtml;
        
        // NOW initialize all interactive features
        initializeFeatures();
    })
    .catch(error => {
        console.error('Error loading components:', error);
        // Show error message on page
        document.getElementById('body-placeholder').innerHTML = '<div style="text-align:center; padding:50px; color:red;">Error loading components. Make sure all files (nav.html, body.html, footer.html) exist in the same folder.</div>';
    });
    
    function initializeFeatures() {
        // Update date and time
        function updateDateTime() {
            const now = new Date();
            const time = now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
            const date = now.toLocaleDateString('en-US', { month: '2-digit', day: '2-digit', year: 'numeric' });
            const timeEl = document.getElementById('currentTime');
            const dateEl = document.getElementById('currentDate');
            if (timeEl) timeEl.textContent = time;
            if (dateEl) dateEl.textContent = date;
        }
        updateDateTime();
        setInterval(updateDateTime, 1000);
        
        // Smooth scroll for buttons with data-scroll attribute
        const scrollButtons = document.querySelectorAll('[data-scroll]');
        scrollButtons.forEach(btn => {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                const targetId = this.getAttribute('data-scroll');
                const targetSection = document.getElementById(targetId);
                if (targetSection) {
                    targetSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
        
        // Navigation links smooth scroll
        const navLinks = document.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                const sectionId = this.getAttribute('data-section');
                const section = document.getElementById(sectionId);
                if (section) {
                    section.scrollIntoView({ behavior: 'smooth', block: 'start' });
                }
            });
        });
        
        // Active navigation highlight on scroll
        function updateActiveNav() {
            const scrollPos = window.scrollY + 150;
            let current = 'home';
            const sectionIds = ['home', 'projects', 'about', 'contact'];
            
            for (const id of sectionIds) {
                const section = document.getElementById(id);
                if (section) {
                    const top = section.offsetTop;
                    const bottom = top + section.offsetHeight;
                    if (scrollPos >= top && scrollPos < bottom) {
                        current = id;
                    }
                }
            }
            
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('data-section') === current) {
                    link.classList.add('active');
                }
            });
        }
        
        window.addEventListener('scroll', updateActiveNav);
        window.addEventListener('load', updateActiveNav);
        
        // Mobile menu toggle
        const toggleBtn = document.getElementById('mobileToggle');
        const navMenu = document.getElementById('navMenu');
        if (toggleBtn && navMenu) {
            toggleBtn.addEventListener('click', function() {
                navMenu.classList.toggle('active');
                const icon = this.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-times');
                    icon.classList.toggle('fa-bars');
                }
            });
        }
        
        // Close mobile menu when clicking a nav link
        navLinks.forEach(link => {
            link.addEventListener('click', function() {
                if (navMenu && navMenu.classList.contains('active')) {
                    navMenu.classList.remove('active');
                    const icon = toggleBtn?.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            });
        });
        
        // Search functionality
        const searchBtn = document.getElementById('searchBtn');
        const searchInput = document.getElementById('searchInput');
        if (searchBtn && searchInput) {
            function performSearch() {
                const query = searchInput.value.trim();
                if (!query) {
                    alert('Please enter a search term.');
                    return;
                }
                const bodyText = document.body.innerText.toLowerCase();
                if (bodyText.includes(query.toLowerCase())) {
                    alert(`🔍 Found results for "${query}". Scroll through the page to see matches.`);
                } else {
                    alert(`No matches found for "${query}"`);
                }
            }
            searchBtn.addEventListener('click', performSearch);
            searchInput.addEventListener('keypress', function(e) {
                if (e.key === 'Enter') performSearch();
            });
        }
        
        // Contact form submission
        const contactForm = document.getElementById('contactForm');
        const formFeedback = document.getElementById('formFeedback');
        if (contactForm) {
            contactForm.addEventListener('submit', function(e) {
                e.preventDefault();
                const name = document.getElementById('contactName')?.value.trim();
                const email = document.getElementById('contactEmail')?.value.trim();
                const message = document.getElementById('contactMsg')?.value.trim();
                
                if (!name || !email || !message) {
                    if (formFeedback) {
                        formFeedback.style.color = '#f87171';
                        formFeedback.textContent = '❌ All fields are required.';
                        setTimeout(() => formFeedback.textContent = '', 3000);
                    }
                    return;
                }
                if (!email.includes('@') || !email.includes('.')) {
                    if (formFeedback) {
                        formFeedback.style.color = '#f87171';
                        formFeedback.textContent = '❌ Please enter a valid email address.';
                        setTimeout(() => formFeedback.textContent = '', 3000);
                    }
                    return;
                }
                if (formFeedback) {
                    formFeedback.style.color = '#4ade80';
                    formFeedback.textContent = `✅ Thanks ${name}! I'll get back to you soon.`;
                    contactForm.reset();
                    setTimeout(() => formFeedback.textContent = '', 4000);
                }
            });
        }
        
        console.log('Portfolio fully loaded and interactive!');
    }
});