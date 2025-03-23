document.addEventListener('DOMContentLoaded', function() {
    // Initialize AOS animations with optimized settings
    AOS.init({
        duration: window.innerWidth < 768 ? 600 : 800,
        once: true,
        offset: window.innerWidth < 768 ? 10 : 100,
        delay: 100,
        easing: 'ease-out-cubic'
    });

    // Navbar scroll effect
    const navbar = document.querySelector('.navbar');
    const heroSection = document.querySelector('.hero-section');
    let lastScroll = 0;

    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        const heroHeight = heroSection.offsetHeight;

        if (currentScroll > 50) {
            navbar.classList.add('scrolled');
        } else {
            navbar.classList.remove('scrolled');
        }

        // Parallax effect for hero content
        if (currentScroll <= heroHeight) {
            const heroContent = document.querySelector('.hero-content');
            heroContent.style.transform = `translateY(${currentScroll * 0.4}px)`;
            heroContent.style.opacity = 1 - (currentScroll / heroHeight);
        }

        lastScroll = currentScroll;
    });

    // Enhanced carousel settings
    const heroCarousel = new bootstrap.Carousel(document.getElementById('heroCarousel'), {
        interval: 5000,
        ride: 'carousel',
        pause: false
    });

    // Smooth scroll for anchor links with dynamic offset
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            
            if (target) {
                const headerOffset = window.innerWidth < 768 ? 60 : 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Feature items animation on hover
    const featureItems = document.querySelectorAll('.feature-item');
    featureItems.forEach(item => {
        item.addEventListener('mouseenter', () => {
            item.style.transform = 'translateY(-10px)';
        });

        item.addEventListener('mouseleave', () => {
            item.style.transform = 'translateY(0)';
        });
    });

    // Add dynamic text animation to hero title
    const heroTitle = document.querySelector('.hero-content h1');
    if (heroTitle) {
        heroTitle.style.backgroundSize = '200% auto';
    }

    // Smooth scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                const headerOffset = window.innerWidth < 768 ? 20 : 60;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });

    // Form handling with responsive validation
    const form = document.getElementById('fitnessForm');
    const progressBar = document.querySelector('.progress-bar');
    const medicalYes = document.getElementById('medicalYes');
    const medicalNo = document.getElementById('medicalNo');
    const medicalDetailsSection = document.getElementById('medicalDetailsSection');
    let formProgress = 0;
    let isMobile = window.innerWidth < 768;

    // Update isMobile on resize
    window.addEventListener('resize', () => {
        isMobile = window.innerWidth < 768;
    });

    // Form sections for progress calculation
    const formSections = [
        'fitnessGoal',
        'trainerExperience',
        'medicalCondition',
        'fitnessLevel',
        'daysPerWeek',
        'trainingType',
        'communication',
        'contactInfo'
    ];

    // Smooth scroll to first error on mobile
    function scrollToError(element) {
        if (isMobile && element) {
            const headerOffset = 20;
            const elementPosition = element.getBoundingClientRect().top;
            const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
        }
    }

    // Update progress bar with animation
    function updateProgress() {
        const totalSections = formSections.length;
        let completedSections = 0;

        formSections.forEach(section => {
            if (section === 'contactInfo') {
                if (document.getElementById(section).value) completedSections++;
            } else if (section === 'fitnessLevel' || section === 'daysPerWeek') {
                if (document.getElementById(section).value) completedSections++;
            } else {
                if (document.querySelector(`input[name="${section}"]:checked`)) completedSections++;
            }
        });

        const newProgress = (completedSections / totalSections) * 100;
        
        // Animate progress bar
        if (newProgress !== formProgress) {
            const startProgress = formProgress;
            const changeInProgress = newProgress - startProgress;
            const duration = 300;
            let startTime = null;

            function animate(currentTime) {
                if (!startTime) startTime = currentTime;
                const timeElapsed = currentTime - startTime;
                const nextProgress = easeOutQuad(timeElapsed, startProgress, changeInProgress, duration);

                progressBar.style.width = `${nextProgress}%`;
                
                if (timeElapsed < duration) {
                    requestAnimationFrame(animate);
                } else {
                    progressBar.style.width = `${newProgress}%`;
                    formProgress = newProgress;
                }
            }

            requestAnimationFrame(animate);
        }

        // Add success class when complete
        if (newProgress === 100) {
            progressBar.classList.add('bg-success');
        } else {
            progressBar.classList.remove('bg-success');
        }
    }

    // Easing function for smooth progress bar animation
    function easeOutQuad(t, b, c, d) {
        t /= d;
        return -c * t * (t - 2) + b;
    }

    // Show/hide medical details section with animation
    medicalYes.addEventListener('change', () => {
        medicalDetailsSection.style.display = 'block';
        medicalDetailsSection.classList.add('animate-fade-in');
        if (isMobile) {
            scrollToError(medicalDetailsSection);
        }
    });

    medicalNo.addEventListener('change', () => {
        medicalDetailsSection.style.display = 'none';
    });

    // Add input event listeners
    form.querySelectorAll('input, select, textarea').forEach(element => {
        element.addEventListener('change', updateProgress);
        element.addEventListener('input', updateProgress);
    });

    // Form validation and submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        // Reset previous errors
        form.querySelectorAll('.is-invalid').forEach(el => {
            el.classList.remove('is-invalid');
        });

        let isValid = true;
        let firstError = null;

        // Validate required fields
        const requiredFields = [
            { id: 'fitnessGoal', name: 'Fitness Goal', type: 'radio' },
            { id: 'trainerExperience', name: 'Trainer Experience', type: 'radio' },
            { id: 'medicalCondition', name: 'Medical Condition', type: 'radio' },
            { id: 'fitnessLevel', name: 'Fitness Level', type: 'select' },
            { id: 'daysPerWeek', name: 'Days Per Week', type: 'select' },
            { id: 'trainingType', name: 'Training Type', type: 'radio' },
            { id: 'communication', name: 'Communication Method', type: 'radio' },
            { id: 'contactInfo', name: 'Contact Information', type: 'text' }
        ];

        requiredFields.forEach(field => {
            const element = document.getElementById(field.id);
            if (field.type === 'radio') {
                const radios = document.getElementsByName(field.id);
                const checked = Array.from(radios).some(radio => radio.checked);
                if (!checked) {
                    isValid = false;
                    if (!firstError) firstError = radios[0];
                    highlightError(field.id);
                }
            } else if (!element.value.trim()) {
                isValid = false;
                if (!firstError) firstError = element;
                highlightError(field.id);
            }
        });

        // Validate medical details if "Yes" is selected
        if (medicalYes.checked && !document.getElementById('medicalDetails').value.trim()) {
            isValid = false;
            if (!firstError) firstError = document.getElementById('medicalDetails');
            highlightError('medicalDetails');
            
            // Add specific error message for medical details
            const medicalError = document.createElement('div');
            medicalError.className = 'invalid-feedback';
            medicalError.textContent = 'Please describe your injury or medical condition';
            const medicalDetails = document.getElementById('medicalDetails');
            if (!medicalDetails.nextElementSibling || !medicalDetails.nextElementSibling.classList.contains('invalid-feedback')) {
                medicalDetails.parentNode.appendChild(medicalError);
            }
        }

        if (!isValid) {
            showError(firstError);
            return;
        }

        // If form is valid, show success message
        showSuccess();
    });

    function highlightError(fieldId) {
        const element = document.getElementById(fieldId);
        if (element) {
            element.classList.add('is-invalid');
            // Add shake animation
            element.classList.add('shake');
            setTimeout(() => element.classList.remove('shake'), 500);
        }
    }

    function showError(firstErrorElement) {
        const errorDiv = document.createElement('div');
        errorDiv.className = 'alert alert-danger animate-fade-in';
        errorDiv.role = 'alert';
        errorDiv.innerHTML = `
            <h4 class="alert-heading"><i class="fas fa-exclamation-triangle"></i> Please complete all required fields</h4>
            <p class="mb-0">Some required information is missing. Please check the highlighted fields.</p>
        `;

        // Remove existing error messages
        const existingError = form.querySelector('.alert');
        if (existingError) {
            existingError.remove();
        }

        form.insertBefore(errorDiv, form.firstChild);

        // Scroll to first error on mobile
        if (isMobile && firstErrorElement) {
            scrollToError(firstErrorElement);
        }
    }

    function showSuccess() {
        const successDiv = document.createElement('div');
        successDiv.className = 'alert alert-success animate-fade-in';
        successDiv.role = 'alert';
        successDiv.innerHTML = `
            <h4 class="alert-heading"><i class="fas fa-check-circle"></i> Thank You!</h4>
            <p>Your fitness questionnaire has been submitted successfully. We will contact you soon!</p>
        `;

        // Clear form and show success message
        form.innerHTML = '';
        form.appendChild(successDiv);

        // Scroll to success message
        successDiv.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    // Add shake animation class
    const style = document.createElement('style');
    style.textContent = `
        @keyframes shake {
            0%, 100% { transform: translateX(0); }
            25% { transform: translateX(-10px); }
            75% { transform: translateX(10px); }
        }
        .shake {
            animation: shake 0.5s cubic-bezier(.36,.07,.19,.97) both;
        }
    `;
    document.head.appendChild(style);

    // Initialize fitness level bars
    const fitnessVisual = document.querySelector('.fitness-bars');
    const fitnessLevelInput = document.getElementById('fitnessLevel');
    const fitnessDescription = document.getElementById('fitnessLevelDescription');

    // Create fitness level bars
    for (let i = 1; i <= 10; i++) {
        const bar = document.createElement('div');
        bar.className = 'fitness-bar';
        bar.setAttribute('data-level', i);
        fitnessVisual.appendChild(bar);

        // Add click handler for each bar
        bar.addEventListener('click', () => {
            // Update hidden input value
            fitnessLevelInput.value = i;
            
            // Update visual state
            document.querySelectorAll('.fitness-bar').forEach(b => b.classList.remove('selected'));
            bar.classList.add('selected');

            // Update description
            updateFitnessDescription(i);

            // Trigger change event for form validation
            fitnessLevelInput.dispatchEvent(new Event('change'));
        });
    }

    function updateFitnessDescription(level) {
        const descriptions = {
            1: "Just starting your fitness journey",
            2: "Building basic exercise habits",
            3: "Developing consistent routine",
            4: "Gaining exercise confidence",
            5: "Established fitness foundation",
            6: "Regular workout practitioner",
            7: "Advanced exercise capacity",
            8: "High fitness achievement",
            9: "Athletic performance level",
            10: "Elite fitness level"
        };
        
        fitnessDescription.textContent = descriptions[level] || 'Select your fitness level';
    }
});