document.addEventListener('DOMContentLoaded', () => {
    /* --- 1. Mobile Menu Toggle --- */
    const hamburger = document.getElementById('hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger) {
        hamburger.addEventListener('click', () => {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
            
            // Toggle hamburger icon animation
            const bars = hamburger.querySelectorAll('.bar');
            if (hamburger.classList.contains('active')) {
                bars[0].style.transform = 'translateY(8px) rotate(45deg)';
                bars[1].style.opacity = '0';
                bars[2].style.transform = 'translateY(-8px) rotate(-45deg)';
            } else {
                bars[0].style.transform = 'none';
                bars[1].style.opacity = '1';
                bars[2].style.transform = 'none';
            }
        });
    }

    // Close mobile menu when clicking a link
    document.querySelectorAll('.nav-link').forEach(link => {
        link.addEventListener('click', () => {
            hamburger.classList.remove('active');
            navMenu.classList.remove('active');
            
            const bars = hamburger.querySelectorAll('.bar');
            bars[0].style.transform = 'none';
            bars[1].style.opacity = '1';
            bars[2].style.transform = 'none';
        });
    });

    /* --- 2. Sticky Navbar & Scroll Spy --- */
    const header = document.getElementById('header');
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-link');

    window.addEventListener('scroll', () => {
        // Sticky Header effect
        if (window.scrollY > 50) {
            header.style.padding = '0';
            header.style.boxShadow = '0 4px 10px rgba(0,0,0,0.1)';
        } else {
            header.style.boxShadow = 'var(--shadow-sm)';
        }

        // Active Link Highlighting (Scroll Spy)
        let current = '';
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            // Add offset for fixed header
            if (scrollY >= sectionTop - 150) {
                current = section.getAttribute('id');
            }
        });

        // If at top of page, force 'home' to be active
        if (window.scrollY < 100) {
            current = 'home';
        }

        navLinks.forEach(link => {
            const href = link.getAttribute('href');
            
            // Only manage active state for anchor links on the current page
            if (href.startsWith('#')) {
                link.classList.remove('active');
                if (href === `#${current}` || (current === '' && href === '#home')) {
                    link.classList.add('active');
                }
            }
        });
    });

    /* --- 3. Scroll Reveal Animations --- */
    const fadeUpElements = document.querySelectorAll('.fade-up');
    
    const observerOptions = {
        root: null,
        rootMargin: '0px',
        threshold: 0.15 // trigger when 15% is visible
    };

    const observer = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Optional: Stop observing once animated
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    fadeUpElements.forEach(el => observer.observe(el));

    // Force visible for elements already in viewport on load
    setTimeout(() => {
        fadeUpElements.forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);

    /* --- Number Counter Animation for Statistics --- */
    const statNumbers = document.querySelectorAll('.stat-number');
    let counted = false;

    const statObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !counted) {
                counted = true;
                statNumbers.forEach(stat => {
                    const target = +stat.getAttribute('data-target');
                    const duration = 2000; // 2 seconds
                    const increment = target / (duration / 16); // 60fps
                    
                    let current = 0;
                    const updateCounter = () => {
                        current += increment;
                        if (current < target) {
                            stat.innerText = Math.ceil(current) + (target > 200 ? '+' : '');
                            requestAnimationFrame(updateCounter);
                        } else {
                            if (target === 98) {
                                stat.innerText = target + '%';
                            } else {
                                stat.innerText = target + '+';
                            }
                        }
                    };
                    updateCounter();
                });
            }
        });
    }, { threshold: 0.5 });

    const statsSections = document.querySelectorAll('.statistics');
    statsSections.forEach(section => {
        statObserver.observe(section);
    });

    /* --- 4. EMI Calculator Logic --- */
    const calculateBtn = document.getElementById('calculateBtn');
    if (calculateBtn) {
        calculateBtn.addEventListener('click', () => {
            const principal = parseFloat(document.getElementById('loanAmount').value);
            const rate = parseFloat(document.getElementById('interestRate').value);
            const time = parseFloat(document.getElementById('loanTenure').value);

            // Validation
            if (isNaN(principal) || isNaN(rate) || isNaN(time) || principal <= 0 || rate <= 0 || time <= 0) {
                alert("Please enter valid positive numbers in all calculator fields.");
                return;
            }

            // Calculation Constants
            // r = monthly interest rate = (Annual Rate / 12) / 100
            // n = total number of months = Tenure (years) * 12
            const r = (rate / 12) / 100;
            const n = time * 12;

            // EMI Formula: [P x R x (1+R)^N]/[(1+R)^N-1]
            let emi = 0;
            if (r === 0) {
                emi = principal / n;
            } else {
                emi = (principal * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
            }
            
            const totalPayment = emi * n;
            const totalInterest = totalPayment - principal;

            // Animate results (simple number update)
            document.getElementById('emiResult').textContent = '$' + emi.toFixed(2);
            document.getElementById('totalInterest').textContent = '$' + totalInterest.toFixed(2);
            document.getElementById('totalPayment').textContent = '$' + totalPayment.toFixed(2);
            
            // Add a small highlight animation to the result box
            const resultBox = document.querySelector('.calc-results');
            resultBox.style.transform = 'scale(1.02)';
            resultBox.style.transition = 'transform 0.3s ease';
            setTimeout(() => {
                resultBox.style.transform = 'scale(1)';
            }, 300);
        });
    }

    /* --- 5. Investment ROI Calculator --- */
    const roiBtn = document.getElementById('btnRoiCalculate');
    if (roiBtn) {
        roiBtn.addEventListener('click', () => {
            const amount = parseFloat(document.getElementById('investAmount').value);
            const rate = parseFloat(document.getElementById('investRate').value);
            const time = parseFloat(document.getElementById('investTime').value);

            if (isNaN(amount) || isNaN(rate) || isNaN(time) || amount <= 0) {
                alert("Please enter valid positive numbers for investment.");
                return;
            }

            // Simple Interest Formula: P + (P * R * T / 100)
            const interest = (amount * rate * time) / 100;
            const totalReturn = amount + interest;

            const resultVal = document.getElementById('roiResult');
            resultVal.textContent = 'NPR ' + totalReturn.toLocaleString();
            
            // Animation
            resultVal.classList.add('pulse');
            setTimeout(() => resultVal.classList.remove('pulse'), 500);
        });
    }

    /* --- 6. Contact Form Validation (PHP backend — no EmailJS) --- */
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            let isValid = true;

            // Name
            const name = document.getElementById('name');
            if (name && name.value.trim().length < 2) {
                name.parentElement.classList.add('error');
                isValid = false;
            } else if (name) {
                name.parentElement.classList.remove('error');
            }

            // Email
            const email = document.getElementById('email');
            const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (email && !emailPattern.test(email.value.trim())) {
                email.parentElement.classList.add('error');
                isValid = false;
            } else if (email) {
                email.parentElement.classList.remove('error');
            }

            // Phone
            const phone = document.getElementById('phone');
            if (phone && phone.value.trim().length < 5) {
                phone.parentElement.classList.add('error');
                isValid = false;
            } else if (phone) {
                phone.parentElement.classList.remove('error');
            }

            // Message
            const message = document.getElementById('message');
            if (message && message.value.trim().length < 10) {
                message.parentElement.classList.add('error');
                isValid = false;
            } else if (message) {
                message.parentElement.classList.remove('error');
            }

            if (!isValid) {
                e.preventDefault(); // Only block if invalid
                return;
            }

            // Show loading state while PHP processes
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            if (submitBtn) {
                submitBtn.innerHTML = '<i class="fa-solid fa-spinner fa-spin"></i> Sending...';
                submitBtn.disabled = true;
            }
            // Allow normal form submission to PHP
        });

        // Remove error styling on input
        const inputs = contactForm.querySelectorAll('input, textarea');
        inputs.forEach(input => {
            input.addEventListener('input', function() {
                this.parentElement.classList.remove('error');
            });
        });
    }


    /* --- 7. Advanced Location System --- */
    const branchData = [
        { name: "Head Office - Kathmandu", city: "Kathmandu", address: "Asaan Plaza, New Baneshwor, Kathmandu", phone: "+977-9820000470", email: "info@asaancredit.com", manager: "Ramesh Sharma", img: "https://i.pravatar.cc/150?u=ramesh" },
        { name: "Pokhara Branch", city: "Pokhara", address: "Lakeside, Ward 6, Pokhara", phone: "+977 61-551122", email: "pokhara@asaancredit.com", manager: "Sita Thapa", img: "https://i.pravatar.cc/150?u=sita" },
        { name: "Biratnagar Branch", city: "Biratnagar", address: "Main Road, Biratnagar", phone: "+977 21-445566", email: "biratnagar@asaancredit.com", manager: "Biraj Rai", img: "https://i.pravatar.cc/150?u=biraj" },
        { name: "Lalitpur Branch", city: "Lalitpur", address: "Pulchowk, Lalitpur", phone: "+977 1-5522334", email: "lalitpur@asaancredit.com", manager: "Maya Shrestha", img: "https://i.pravatar.cc/150?u=maya" },
        { name: "Bharatpur Branch", city: "Bharatpur", address: "Chaukhadi, Bharatpur", phone: "+977 56-523311", email: "bharatpur@asaancredit.com", manager: "Rajesh Gurung", img: "https://i.pravatar.cc/150?u=rajesh" },
        { name: "Butwal Branch", city: "Butwal", address: "Traffic Chowk, Butwal", phone: "+977 71-544332", email: "butwal@asaancredit.com", manager: "Gita KC", img: "https://i.pravatar.cc/150?u=gita" },
        { name: "Dharan Branch", city: "Dharan", address: "Bhanu Chowk, Dharan", phone: "+977 25-521199", email: "dharan@asaancredit.com", manager: "Deepak Lamsal", img: "https://i.pravatar.cc/150?u=deepak" },
        { name: "Nepalgunj Branch", city: "Nepalgunj", address: "Birendra Chowk, Nepalgunj", phone: "+977 81-521100", email: "nepalgunj@asaancredit.com", manager: "Anjali Pun", img: "https://i.pravatar.cc/150?u=anjali" },
        { name: "Hetauda Branch", city: "Hetauda", address: "Main Road, Hetauda", phone: "+977 57-520099", email: "hetauda@asaancredit.com", manager: "Sanjay Biswokarma", img: "https://i.pravatar.cc/150?u=sanjay" },
        { name: "Itahari Branch", city: "Itahari", address: "Gharipatan, Itahari", phone: "+977 25-580011", email: "itahari@asaancredit.com", manager: "Pratima Ghimire", img: "https://i.pravatar.cc/150?u=pratima" },
        { name: "Janakpur Branch", city: "Janakpur", address: "Shiva Chowk, Janakpur", phone: "+977 41-523311", email: "janakpur@asaancredit.com", manager: "Ram Yadav", img: "https://i.pravatar.cc/150?u=ramy" },
        { name: "Dhangadhi Branch", city: "Dhangadhi", address: "Hospital Road, Dhangadhi", phone: "+977 91-521100", email: "dhangadhi@asaancredit.com", manager: "Bishal Joshi", img: "https://i.pravatar.cc/150?u=bishal" },
        { name: "Bhairahawa Branch", city: "Bhairahawa", address: "Bank Road, Bhairahawa", phone: "+977 71-520088", email: "bhairahawa@asaancredit.com", manager: "Pooja Gupta", img: "https://i.pravatar.cc/150?u=pooja" },
        { name: "Siddharthanagar Branch", city: "Siddharthanagar", address: "Belhiya Road, Siddharthanagar", phone: "+977 71-521122", email: "siddharthanagar@asaancredit.com", manager: "Arjun Pathak", img: "https://i.pravatar.cc/150?u=arjun" },
        { name: "Birtamod Branch", city: "Birtamod", address: "Mukti Chowk, Birtamod", phone: "+977 23-541100", email: "birtamod@asaancredit.com", manager: "Kiran Limbu", img: "https://i.pravatar.cc/150?u=kiran" },
        { name: "Damak Branch", city: "Damak", address: "Main Chowk, Damak", phone: "+977 23-581122", email: "damak@asaancredit.com", manager: "Niru Pandey", img: "https://i.pravatar.cc/150?u=niru" },
        { name: "Tansen Branch", city: "Tansen", address: "Bansghari, Tansen", phone: "+977 75-520011", email: "tansen@asaancredit.com", manager: "Suman Rana", img: "https://i.pravatar.cc/150?u=suman" },
        { name: "Baglung Branch", city: "Baglung", address: "Halla Chowk, Baglung", phone: "+977 67-521122", email: "baglung@asaancredit.com", manager: "Rupa Regmi", img: "https://i.pravatar.cc/150?u=rupa" },
        { name: "Gorkha Branch", city: "Gorkha", address: "Bus Park, Gorkha", phone: "+977 64-520011", email: "gorkha@asaancredit.com", manager: "Shyam Bhatta", img: "https://i.pravatar.cc/150?u=shyam" },
        { name: "Kavre Branch", city: "Banepa", address: "Banepa Bazar, Kavre", phone: "+977 11-662233", email: "kavre@asaancredit.com", manager: "Laxmi Dahal", img: "https://i.pravatar.cc/150?u=laxmi" }
    ];

    const franchiseData = [
        // Province 1 Area
        { name: "Mechinagar Franchise", city: "Jhapa", address: "Mechinagar, Jhapa", phone: "+977 9852611223", email: "mechinagar.f@asaancredit.com", manager: "Hari Prasai", img: "https://i.pravatar.cc/150?u=hari" },
        { name: "Kakarvitta Franchise", city: "Jhapa", address: "Kakarvitta, Jhapa", phone: "+977 9842611224", email: "kakarvitta.f@asaancredit.com", manager: "Sarita Dash", img: "https://i.pravatar.cc/150?u=sarita" },
        { name: "Urlabari Franchise", city: "Morang", address: "Urlabari, Morang", phone: "+977 9812611225", email: "urlabari.f@asaancredit.com", manager: "Manoj Sah", img: "https://i.pravatar.cc/150?u=manoj" },
        { name: "Rangeli Franchise", city: "Morang", address: "Rangeli, Morang", phone: "+977 9802611226", email: "rangeli.f@asaancredit.com", manager: "Indira Poudel", img: "https://i.pravatar.cc/150?u=indira" },
        { name: "Inaruwa Franchise", city: "Sunsari", address: "Inaruwa, Sunsari", phone: "+977 9852611227", email: "inaruwa.f@asaancredit.com", manager: "Bibek Bhagat", img: "https://i.pravatar.cc/150?u=bibek" },
        { name: "Dhankuta Franchise", city: "Dhankuta", address: "Dhankuta Bazar, Dhankuta", phone: "+977 9842611228", email: "dhankuta.f@asaancredit.com", manager: "Sunita Rai", img: "https://i.pravatar.cc/150?u=sunita" },
        { name: "Ilam Franchise", city: "Ilam", address: "Ilam Bazar, Ilam", phone: "+977 9812611229", email: "ilam.f@asaancredit.com", manager: "Prem Subba", img: "https://i.pravatar.cc/150?u=prem" },
        { name: "Phidim Franchise", city: "Panchthar", address: "Phidim, Panchthar", phone: "+977 9802611230", email: "phidim.f@asaancredit.com", manager: "Anita Tumbapo", img: "https://i.pravatar.cc/150?u=anita" },
        
        // Madhesh Area
        { name: "Rajbiraj Franchise", city: "Saptari", address: "Rajbiraj, Saptari", phone: "+977 9853611231", email: "rajbiraj.f@asaancredit.com", manager: "Satish Mishra", img: "https://i.pravatar.cc/150?u=satish" },
        { name: "Siraha Franchise", city: "Siraha", address: "Siraha Bazar, Siraha", phone: "+977 9843611232", email: "siraha.f@asaancredit.com", manager: "Kalpana Mahato", img: "https://i.pravatar.cc/150?u=kalpana" },
        { name: "Mirchaiya Franchise", city: "Siraha", address: "Mirchaiya, Siraha", phone: "+977 9813611233", email: "mirchaiya.f@asaancredit.com", manager: "Binod Thakur", img: "https://i.pravatar.cc/150?u=binod" },
        { name: "Bardibas Franchise", city: "Mahottari", address: "Bardibas, Mahottari", phone: "+977 9803611234", email: "bardibas.f@asaancredit.com", manager: "Rekha Jha", img: "https://i.pravatar.cc/150?u=rekha" },
        { name: "Jaleshwar Franchise", city: "Mahottari", address: "Jaleshwar, Mahottari", phone: "+977 9853611235", email: "jaleshwar.f@asaancredit.com", manager: "Manoj Singh", img: "https://i.pravatar.cc/150?u=manojs" },
        { name: "Malangwa Franchise", city: "Sarlahi", address: "Malangwa, Sarlahi", phone: "+977 9843611236", email: "malangwa.f@asaancredit.com", manager: "Susila Sah", img: "https://i.pravatar.cc/150?u=susila" },
        { name: "Gaur Franchise", city: "Rautahat", address: "Gaur, Rautahat", phone: "+977 9813611237", email: "gaur.f@asaancredit.com", manager: "Pawan Sah", img: "https://i.pravatar.cc/150?u=pawan" },
        { name: "Kalaiya Franchise", city: "Bara", address: "Kalaiya, Bara", phone: "+977 9803611238", email: "kalaiya.f@asaancredit.com", manager: "Madhav Pd", img: "https://i.pravatar.cc/150?u=madhav" },
        
        // Bagmati Area
        { name: "Banepa Franchise", city: "Kavre", address: "Banepa, Kavre", phone: "+977 9851122334", email: "banepa.f@asaancredit.com", manager: "Umesh Shrestha", img: "https://i.pravatar.cc/150?u=umesh" },
        { name: "Dhulikhel Franchise", city: "Kavre", address: "Dhulikhel, Kavre", phone: "+977 9841122335", email: "dhulikhel.f@asaancredit.com", manager: "Sabina KC", img: "https://i.pravatar.cc/150?u=sabina" },
        { name: "Panauti Franchise", city: "Kavre", address: "Panauti, Kavre", phone: "+977 9811122336", email: "panauti.f@asaancredit.com", manager: "Rajiv Rana", img: "https://i.pravatar.cc/150?u=rajiv" },
        { name: "Tokha Franchise", city: "Kathmandu", address: "Tokha, Kathmandu", phone: "+977 9801122337", email: "tokha.f@asaancredit.com", manager: "Nirmala Adhikari", img: "https://i.pravatar.cc/150?u=nirmala" },
        { name: "Kirtipur Franchise", city: "Kathmandu", address: "Kirtipur, Kathmandu", phone: "+977 9851122338", email: "kirtipur.f@asaancredit.com", manager: "Pramila Karki", img: "https://i.pravatar.cc/150?u=pramila" },
        { name: "Thankot Franchise", city: "Kathmandu", address: "Thankot, Kathmandu", phone: "+977 9841122339", email: "thankot.f@asaancredit.com", manager: "Anup Thapa", img: "https://i.pravatar.cc/150?u=anup" },
        { name: "Bidur Franchise", city: "Nuwakot", address: "Bidur, Nuwakot", phone: "+977 9811122340", email: "bidur.f@asaancredit.com", manager: "Suman Giri", img: "https://i.pravatar.cc/150?u=sumang" },
        { name: "Charikot Franchise", city: "Dolakha", address: "Charikot, Dolakha", phone: "+977 9801122341", email: "charikot.f@asaancredit.com", manager: "Kalpana Oli", img: "https://i.pravatar.cc/150?u=kalpana" },

        // Gandaki Area
        { name: "Waling Franchise", city: "Syangja", address: "Waling, Syangja", phone: "+977 9856112342", email: "waling.f@asaancredit.com", manager: "Bimal Shrestha", img: "https://i.pravatar.cc/150?u=bimal" },
        { name: "Putalibazar Franchise", city: "Syangja", address: "Putalibazar, Syangja", phone: "+977 9846112343", email: "putalibazar.f@asaancredit.com", manager: "Laxmi Aryal", img: "https://i.pravatar.cc/150?u=laxmia" },
        { name: "Baglung Franchise", city: "Baglung", address: "Baglung Bazar, Baglung", phone: "+977 9816112344", email: "baglung.f@asaancredit.com", manager: "Ishwor Sharma", img: "https://i.pravatar.cc/150?u=ishwor" },
        { name: "Kushma Franchise", city: "Parbat", address: "Kushma, Parbat", phone: "+977 9806112345", email: "kushma.f@asaancredit.com", manager: "Sabitra Rana", img: "https://i.pravatar.cc/150?u=sabitra" },
        { name: "Besisahar Franchise", city: "Lamjung", address: "Besisahar, Lamjung", phone: "+977 9856112346", email: "besisahar.f@asaancredit.com", manager: "Nabin Gurung", img: "https://i.pravatar.cc/150?u=nabin" },
        { name: "Damauli Franchise", city: "Tanahun", address: "Damauli, Tanahun", phone: "+977 9846112347", email: "damauli.f@asaancredit.com", manager: "Pabitra Paudel", img: "https://i.pravatar.cc/150?u=pabitra" },
        { name: "Gorkha Franchise", city: "Gorkha", address: "Gorkha Bazar, Gorkha", phone: "+977 9816112348", email: "gorkha.f@asaancredit.com", manager: "Dhan Bdr Bhatta", img: "https://i.pravatar.cc/150?u=dhanb" },
        { name: "Lekhnath Franchise", city: "Pokhara", address: "Lekhnath, Pokhara", phone: "+977 9806112349", email: "lekhnath.f@asaancredit.com", manager: "Suraj Parajuli", img: "https://i.pravatar.cc/150?u=suraj" },

        // Lumbini Area
        { name: "Bhairahawa Franchise", city: "Rupandehi", address: "Bhairahawa, Rupandehi", phone: "+977 9857112350", email: "bhairahawa.f@asaancredit.com", manager: "Dinesh Gupta", img: "https://i.pravatar.cc/150?u=dineshg" },
        { name: "Sunwal Franchise", city: "Nawalparasi", address: "Sunwal, Nawalparasi", phone: "+977 9847112351", email: "sunwal.f@asaancredit.com", manager: "Radha Baniya", img: "https://i.pravatar.cc/150?u=radha" },
        { name: "Parasi Franchise", city: "Nawalparasi", address: "Parasi, Nawalparasi", phone: "+977 9817112352", email: "parasi.f@asaancredit.com", manager: "Umesh Ray", img: "https://i.pravatar.cc/150?u=umeshr" },
        { name: "Tulsipur Franchise", city: "Dang", address: "Tulsipur, Dang", phone: "+977 9807112353", email: "tulsipur.f@asaancredit.com", manager: "Krishna Oli", img: "https://i.pravatar.cc/150?u=krishna" },
        { name: "Ghorahi Franchise", city: "Dang", address: "Ghorahi, Dang", phone: "+977 9857112354", email: "ghorahi.f@asaancredit.com", manager: "Maya Chaudhary", img: "https://i.pravatar.cc/150?u=mayac" },
        { name: "Lamahi Franchise", city: "Dang", address: "Lamahi, Dang", phone: "+977 9847112355", email: "lamahi.f@asaancredit.com", manager: "Govinda BK", img: "https://i.pravatar.cc/150?u=govinda" },
        { name: "Taulihawa Franchise", city: "Kapilvastu", address: "Taulihawa, Kapilvastu", phone: "+977 9817112356", email: "taulihawa.f@asaancredit.com", manager: "Ram Pd Gupta", img: "https://i.pravatar.cc/150?u=rampd" },
        { name: "Sandhikharka Franchise", city: "Arghakhanchi", address: "Sandhikharka, Arghakhanchi", phone: "+977 9807112357", email: "sandhikharka.f@asaancredit.com", manager: "Sushila Sharma", img: "https://i.pravatar.cc/150?u=sushilas" },

        // Karnali Area
        { name: "Surkhet Franchise", city: "Birendranagar", address: "Surkhet Bazar, Surkhet", phone: "+977 9858112358", email: "surkhet.f@asaancredit.com", manager: "Kamal Rawat", img: "https://i.pravatar.cc/150?u=kamal" },
        { name: "Dailekh Franchise", city: "Dailekh", address: "Dailekh Bazar, Dailekh", phone: "+977 9848112359", email: "dailekh.f@asaancredit.com", manager: "Lila Shahi", img: "https://i.pravatar.cc/150?u=lila" },
        { name: "Jumla Franchise", city: "Jumla", address: "Jumla Bazar, Jumla", phone: "+977 9818112360", email: "jumla.f@asaancredit.com", manager: "Hira Bdr Budha", img: "https://i.pravatar.cc/150?u=hira" },
        { name: "Kalikot Franchise", city: "Kalikot", address: "Kalikot Bazar, Kalikot", phone: "+977 9808112361", email: "kalikot.f@asaancredit.com", manager: "Nitu Shahi", img: "https://i.pravatar.cc/150?u=nitu" },
        { name: "Jajarkot Franchise", city: "Jajarkot", address: "Jajarkot Bazar, Jajarkot", phone: "+977 9858112362", email: "jajarkot.f@asaancredit.com", manager: "Bimal Rokaya", img: "https://i.pravatar.cc/150?u=bimalr" },
        { name: "Rukum West Franchise", city: "Musikot", address: "Musikot, Rukum West", phone: "+977 9848112363", email: "rukumwest.f@asaancredit.com", manager: "Januka Pun", img: "https://i.pravatar.cc/150?u=januka" },
        { name: "Salyan Franchise", city: "Salyan", address: "Salyan Bazar, Salyan", phone: "+977 9818112364", email: "salyan.f@asaancredit.com", manager: "Dipak Bohara", img: "https://i.pravatar.cc/150?u=dipakb" },
        { name: "Dolpa Franchise", city: "Dolpa", address: "Dunai, Dolpa", phone: "+977 9808112365", email: "dolpa.f@asaancredit.com", manager: "Sunita Budhathoki", img: "https://i.pravatar.cc/150?u=sunitab" },

        // Sudurpashchim Area
        { name: "Attariya Franchise", city: "Kailali", address: "Attariya, Kailali", phone: "+977 9859112366", email: "attariya.f@asaancredit.com", manager: "Ganesh Bhatta", img: "https://i.pravatar.cc/150?u=ganesh" },
        { name: "Mahendranagar Franchise", city: "Kanchanpur", address: "Mahendranagar, Kanchanpur", phone: "+977 9849112367", email: "mahendranagar.f@asaancredit.com", manager: "Rekha Pant", img: "https://i.pravatar.cc/150?u=rekhap" },
        { name: "Dadeldhura Franchise", city: "Dadeldhura", address: "Dadeldhura Bazar, Dadeldhura", phone: "+977 9819112368", email: "dadeldhura.f@asaancredit.com", manager: "Janak Bohara", img: "https://i.pravatar.cc/150?u=janak" },
        { name: "Doti Franchise", city: "Dipayal", address: "Dipayal, Doti", phone: "+977 9809112369", email: "doti.f@asaancredit.com", manager: "Sabitra Shahi", img: "https://i.pravatar.cc/150?u=sabitras" },
        { name: "Achham Franchise", city: "Mangalsen", address: "Mangalsen, Achham", phone: "+977 9859112370", email: "achham.f@asaancredit.com", manager: "Hikmat Khadka", img: "https://i.pravatar.cc/150?u=hikmat" },
        { name: "Bajhang Franchise", city: "Chainpur", address: "Chainpur, Bajhang", phone: "+977 9849112371", email: "bajhang.f@asaancredit.com", manager: "Bimala Joshi", img: "https://i.pravatar.cc/150?u=bimalaj" },
        { name: "Bajura Franchise", city: "Martadi", address: "Martadi, Bajura", phone: "+977 9819112372", email: "bajura.f@asaancredit.com", manager: "Karna Bdr Rawal", img: "https://i.pravatar.cc/150?u=karnar" },
        { name: "Baitadi Franchise", city: "Baitadi", address: "Baitadi Bazar, Baitadi", phone: "+977 9809112373", email: "baitadi.f@asaancredit.com", manager: "Puja Rana", img: "https://i.pravatar.cc/150?u=pujar" },
        { name: "Darchula Franchise", city: "Darchula", address: "Darchula Bazar, Darchula", phone: "+977 9859112374", email: "darchula.f@asaancredit.com", manager: "Lalit Singh", img: "https://i.pravatar.cc/150?u=lalits" },
        { name: "Tikapur Franchise", city: "Kailali", address: "Tikapur, Kailali", phone: "+977 9849112375", email: "tikapur.f@asaancredit.com", manager: "Sita Chaudhary", img: "https://i.pravatar.cc/150?u=sitac" },
        { name: "Lamki Franchise", city: "Kailali", address: "Lamki, Kailali", phone: "+977 9819112376", email: "lamki.f@asaancredit.com", manager: "Ravi Rawat", img: "https://i.pravatar.cc/150?u=ravir" },
        { name: "Gulariya Franchise", city: "Bardiya", address: "Gulariya, Bardiya", phone: "+977 9809112377", email: "gulariya.f@asaancredit.com", manager: "Anjana Sharma", img: "https://i.pravatar.cc/150?u=anjana" }
    ];

    let activeType = 'branch'; 
    let visibleCount = 6;
    let searchQuery = "";

    const locationGrid = document.getElementById('locationGrid');
    const loadMoreBtn = document.getElementById('btnLoadMore');
    const searchInput = document.getElementById('locationSearch');
    const tabBtns = document.querySelectorAll('.tab-btn');

    function renderLocations() {
        if (!locationGrid) return;

        const data = activeType === 'branch' ? branchData : franchiseData;
        
        const filtered = data.filter(loc => 
            loc.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
            loc.city.toLowerCase().includes(searchQuery.toLowerCase())
        );

        const toDisplay = filtered.slice(0, visibleCount);
        
        if (toDisplay.length === 0) {
            locationGrid.innerHTML = `
                <div class="no-results text-center py-5" style="grid-column: 1 / -1;">
                    <i class="fa-solid fa-magnifying-glass mb-3" style="font-size: 3rem; color: #ddd;"></i>
                    <p>No locations found matching "${searchQuery}"</p>
                </div>
            `;
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            return;
        }

        locationGrid.innerHTML = toDisplay.map((loc, index) => `
            <div class="branch-card fade-up" style="transition-delay: ${index % 6 * 0.1}s">
                <div class="branch-info-content">
                    <i class="fa-solid ${activeType === 'branch' ? 'fa-building-columns' : 'fa-store'} main-icon"></i>
                    <h4>${loc.name}</h4>
                    <p><i class="fa-solid fa-location-dot"></i> ${loc.address}</p>
                    <p><i class="fa-solid fa-phone"></i> ${loc.phone}</p>
                    <p><i class="fa-solid fa-envelope"></i> ${loc.email}</p>
                    <a href="https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(loc.name + ' ' + loc.address)}" target="_blank" class="btn-link">View Map <i class="fa-solid fa-arrow-right"></i></a>
                </div>
                <a href="mailto:${loc.email}" class="manager-profile-link">
                    <div class="manager-profile">
                        <img src="${loc.img}" alt="${loc.manager}" class="manager-img" onerror="this.src='https://ui-avatars.com/api/?name=${encodeURIComponent(loc.manager)}&background=0B2545&color=fff'">
                        <span class="manager-name">Mgr: ${loc.manager}</span>
                    </div>
                </a>
            </div>
        `).join('');

        // Trigger animation after a tiny delay
        setTimeout(() => {
            const cards = locationGrid.querySelectorAll('.branch-card');
            cards.forEach(card => card.classList.add('visible'));
        }, 50);

        if (loadMoreBtn) {
            loadMoreBtn.style.display = filtered.length > visibleCount ? 'inline-block' : 'none';
        }
    }

    if (tabBtns.length > 0) {
        tabBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                tabBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                activeType = btn.dataset.type;
                visibleCount = 6;
                renderLocations();
            });
        });
    }

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            searchQuery = e.target.value;
            visibleCount = 6;
            renderLocations();
        });
    }

    if (loadMoreBtn) {
        loadMoreBtn.addEventListener('click', () => {
            visibleCount += 6;
            renderLocations();
        });
    }

    renderLocations();

    /* --- 8. Projects & Updates System --- */
    const districts = ["Kathmandu", "Pokhara", "Lalitpur", "Biratnagar", "Bharatpur", "Butwal", "Dharan", "Nepalgunj", "Hetauda", "Itahari", "Janakpur", "Dhangadhi", "Bhairahawa", "Surkhet", "Ghorahi", "Tulsipur", "Mustang", "Chitwan", "Jhapa", "Morang", "Sunsari", "Dhankuta", "Ilam", "Kavre", "Baglung", "Gorkha", "Nawalparasi", "Dang", "Kailali", "Kanchanpur"];
    const types = ["Energy", "Real Estate", "Commercial", "Agriculture", "Infrastructure", "Tourism", "Healthcare"];
    const projectNames = ["Solar Park", "Industrial Estate", "Eco Resort", "Smart City", "Organic Valley", "Hydropower Plant", "Heritage Hotel", "Shopping Mall", "Nursing College", "Dry Port", "Fruit Processing", "Cement Factory", "Bridge Link", "Cold Storage", "IT Park"];
    
    // Generate 100 projects for demonstration
    const projectsData = [];
    for (let i = 1; i <= 100; i++) {
        const dist = districts[i % districts.length];
        const type = types[i % types.length];
        const namePrefix = projectNames[i % projectNames.length];
        const amount = (Math.floor(Math.random() * 500) + 50) + " Million";
        const statusVal = i % 10 === 0 ? "closed" : (i % 3 === 0 ? "ongoing" : "open");
        
        projectsData.push({
            id: i,
            title: `${dist} ${namePrefix} #${i + 100}`,
            shortDesc: `A landmark ${type.toLowerCase()} development project in ${dist} district aimed at socio-economic growth.`,
            fullDesc: `This ${type.toLowerCase()} project is strategically located in the heart of ${dist}. It aims to provide modern facilities and high-yield investment opportunities while adhering to strict environmental and social safeguards. The budget of NPR ${amount} ensures high-quality construction and long-term sustainability. Phase ${i % 4 + 1} of this multi-stage development is now entering the core implementation cycle.`,
            location: dist,
            amount: "NPR " + amount,
            status: statusVal,
            type: type,
            returns: (Math.floor(Math.random() * 10) + 8) + "% p.a.",
            risk: i % 4 === 0 ? "High" : (i % 3 === 0 ? "Medium" : "Low"),
            timeline: (Math.floor(Math.random() * 36) + 12) + " Months",
            img: `https://plus.unsplash.com/premium_photo-1683121366420-d159396aefb9?w=800&auto=format&fit=crop&q=60`,
            docs: ["Project_Overview.pdf", "Legal_Compliance.pdf"]
        });
    }

    // High-quality manual entries for the first few (as promised in walkthrough)
    projectsData[0] = {
        id: 1,
        title: "Mustang Wind Farm Phase II",
        shortDesc: "Expansion of clean energy generation in the windy corridors of Mustang district.",
        fullDesc: "This project involves the installation of 12 additional high-capacity wind turbines in the Jomsom area. Mustang Phase II aims to contribute 15MW of renewable energy to the national grid, supporting Nepal's green energy goals while providing stable returns for local investors.",
        location: "Mustang",
        amount: "NPR 150 Million",
        status: "open",
        type: "Energy",
        returns: "14% p.a.",
        risk: "Medium",
        timeline: "24 Months",
        img: "https://images.unsplash.com/photo-1508514177221-188b1cf16e9d?auto=format&fit=crop&w=800&q=80",
        docs: ["Brochure.pdf", "Legal_Clearance.pdf"]
    };
    projectsData[1] = {
        id: 2,
        title: "Pokhara Lakeside Residency",
        shortDesc: "Premium eco-friendly residential apartment complex near Phewa Lake.",
        fullDesc: "A luxury housing project focusing on sustainable architecture and premium amenities. Located in the heart of Lakeside, Pokhara, this residency offers a blend of natural beauty and modern living, with high rental yield potential for early investors.",
        location: "Pokhara",
        amount: "NPR 280 Million",
        status: "ongoing",
        type: "Real Estate",
        returns: "18% Total",
        risk: "Low",
        timeline: "36 Months",
        img: "https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80",
        docs: ["Project_Plan.pdf", "Terms.pdf"]
    };

    let projectFilters = {
        search: '',
        location: 'all',
        status: 'all',
        type: 'all'
    };
    
    let visibleProjects = 6;

    function renderProjects() {
        const grid = document.getElementById('projectsGrid');
        if (!grid) return;

        const filtered = projectsData.filter(p => {
            const matchesSearch = p.title.toLowerCase().includes(projectFilters.search.toLowerCase());
            const matchesLocation = projectFilters.location === 'all' || p.location === projectFilters.location;
            const matchesStatus = projectFilters.status === 'all' || p.status === projectFilters.status;
            const matchesType = projectFilters.type === 'all' || p.type === projectFilters.type;
            return matchesSearch && matchesLocation && matchesStatus && matchesType;
        });

        const toDisplay = filtered.slice(0, visibleProjects);

        if (toDisplay.length === 0) {
            grid.innerHTML = `<div class="no-results py-5 text-center" style="grid-column: 1/-1;">
                <i class="fa-solid fa-folder-open mb-3" style="font-size: 3rem; color: #eee;"></i>
                <p>No projects found matching your criteria.</p>
            </div>`;
            const loadMoreBtn = document.getElementById('btnLoadMoreProjects');
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            return;
        }

        grid.innerHTML = toDisplay.map(p => `
            <div class="project-card fade-up">
                <div class="project-card-img" style="background-image: url('${p.img}')">
                    <span class="status-badge status-${p.status}">${p.status}</span>
                </div>
                <div class="project-card-content">
                    <h4>${p.title}</h4>
                    <p class="text-muted small">${p.shortDesc}</p>
                    <div class="project-meta">
                        <span><i class="fa-solid fa-location-dot me-1"></i> ${p.location}</span>
                        <span class="text-red fw-bold">${p.amount}</span>
                    </div>
                    <button class="btn btn-outline-primary w-100 mt-3" onclick="openProjectModal(${p.id})">View Details</button>
                </div>
            </div>
        `).join('');

        // Handle Load More button visibility
        const loadMoreBtn = document.getElementById('btnLoadMoreProjects');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = filtered.length > visibleProjects ? 'inline-block' : 'none';
        }

        // Trigger animation
        setTimeout(() => {
            grid.querySelectorAll('.project-card').forEach(card => card.classList.add('visible'));
        }, 50);
    }

    // Modal Global Functions
    window.openProjectModal = function(id) {
        const project = projectsData.find(p => p.id === id);
        if (!project) return;

        const modal = document.getElementById('projectModal');
        const content = modal.querySelector('.modal-content');

        content.innerHTML = `
            <button class="close-modal" onclick="closeProjectModal()">&times;</button>
            <div class="modal-header" style="background-image: url('${project.img}')">
                <div class="modal-header-text">
                    <span class="status-badge status-${project.status}">${project.status}</span>
                    <h2 class="text-white mt-2">${project.title}</h2>
                    <p class="text-white opacity-75"><i class="fa-solid fa-location-dot"></i> ${project.location}, Nepal</p>
                </div>
            </div>
            <div class="modal-body">
                <h3>About the Project</h3>
                <p class="mt-3 text-muted">${project.fullDesc}</p>
                
                <div class="details-grid">
                    <div class="detail-item">
                        <p class="text-muted small mb-1">Investment Amount</p>
                        <p class="fw-bold"><i class="fa-solid fa-money-bill-wave"></i> ${project.amount}</p>
                    </div>
                    <div class="detail-item">
                        <p class="text-muted small mb-1">Expected Returns</p>
                        <p class="fw-bold text-red"><i class="fa-solid fa-chart-line"></i> ${project.returns}</p>
                    </div>
                    <div class="detail-item">
                        <p class="text-muted small mb-1">Risk Level</p>
                        <p class="fw-bold"><i class="fa-solid fa-triangle-exclamation"></i> ${project.risk}</p>
                    </div>
                    <div class="detail-item">
                        <p class="text-muted small mb-1">Timeline</p>
                        <p class="fw-bold"><i class="fa-solid fa-calendar-days"></i> ${project.timeline}</p>
                    </div>
                </div>

                <h4 class="mt-4">Available Documents</h4>
                <div class="doc-list mt-3">
                    ${project.docs.map(doc => `
                        <a href="#" class="doc-link">
                            <i class="fa-solid fa-file-pdf"></i>
                            <span>${doc}</span>
                            <i class="fa-solid fa-download ms-auto" style="font-size: 1rem; color: #ccc;"></i>
                        </a>
                    `).join('')}
                </div>

                <div class="modal-footer mt-5 border-top pt-4 display-flex gap-3">
                    <a href="contact.html" class="btn btn-primary">Invest Now</a>
                    <a href="contact.html" class="btn btn-secondary">Request Call</a>
                </div>
            </div>
        `;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
    };

    window.closeProjectModal = function() {
        const modal = document.getElementById('projectModal');
        modal.classList.remove('active');
        document.body.style.overflow = 'auto';
    };

    // Filter Change Handlers
    const projectSearch = document.getElementById('projectSearch');
    const filterLoc = document.getElementById('filterLocation');
    const filterStat = document.getElementById('filterStatus');
    const filterType = document.getElementById('filterType');

    if (projectSearch) {
        projectSearch.addEventListener('input', (e) => {
            projectFilters.search = e.target.value;
            renderProjects();
        });
    }

    if (filterLoc) {
        filterLoc.addEventListener('change', (e) => {
            projectFilters.location = e.target.value;
            renderProjects();
        });
    }

    if (filterStat) {
        filterStat.addEventListener('change', (e) => {
            projectFilters.status = e.target.value;
            renderProjects();
        });
    }

    if (filterType) {
        filterType.addEventListener('change', (e) => {
            projectFilters.type = e.target.value;
            renderProjects();
        });
    }

    const btnLoadMoreProj = document.getElementById('btnLoadMoreProjects');
    if (btnLoadMoreProj) {
        btnLoadMoreProj.addEventListener('click', () => {
            visibleProjects += 6;
            renderProjects();
        });
    }

    // Modal closing on overlay click
    const modalOverlay = document.getElementById('projectModal');
    if (modalOverlay) {
        modalOverlay.addEventListener('click', (e) => {
            if (e.target === modalOverlay) {
                modalOverlay.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    }

    /* --- 9. Asaan News & Blog System --- */
    const newsData = [
        {
            id: 1,
            title: "Asaan Credit Expands to Five New Districts",
            category: "News",
            date: "March 15, 2026",
            shortDesc: "Focusing on rural financial inclusion, ACL opens branches in Mustang, Dolpa, and beyond.",
            fullDesc: "Asaan Credit Limited is proud to announce its strategic expansion into the remote districts of Nepal. Our new branches will provide tailored credit solutions to local farmers and small enterprises, bridging the gap between rural ambition and financial accessibility. This move marks a significant milestone in our commitment to national financial inclusion.",
            img: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=800&q=80",
            author: "Corporate Relations",
            readTime: "4 Min Read"
        },
        {
            id: 2,
            title: "Success Story: Empowering Women Entrepreneurs in Pokhara",
            category: "Success Story",
            date: "March 10, 2026",
            shortDesc: "How a small micro-loan transformed a local weaving business into a regional exporter.",
            fullDesc: "Meet Sunita Gurung, a determined entrepreneur who used an ACL SME loan to modernize her traditional handloom business. Today, her company employs 15 local women and exports high-quality pashmina to European markets. ACL is honored to be a part of her journey toward economic independence.",
            img: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?auto=format&fit=crop&w=800&q=80",
            author: "Impact Team",
            readTime: "6 Min Read"
        },
        {
            id: 3,
            title: "5 Tips for Investing in Nepal's Real Estate Market",
            category: "Investment Tips",
            date: "March 05, 2026",
            shortDesc: "Expert insights on legal compliance, high-growth zones, and long-term asset security.",
            fullDesc: "The Nepali real estate landscape is evolving rapidly. To help you navigate this complex market, our senior investment advisors have compiled a guide on identifying high-yield locations, understanding land titles, and leveraging credit for maximum equity growth.",
            img: "https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&w=800&q=80",
            author: "Investment Desk",
            readTime: "5 Min Read"
        },
        {
            id: 4,
            title: "Annual Stakeholder Meet 2026 Announced",
            category: "Announcements",
            date: "February 28, 2026",
            shortDesc: "Join us for our digital-first annual conference focusing on futuristic fintech scaling.",
            fullDesc: "We invite all our valued stakeholders to the ACL Annual Meet 2026. This year's theme is 'Digital Horizons: Scaling Financial Power'. We will discuss our upcoming platform integrate and our vision for AI-driven credit assessments.",
            img: "https://images.unsplash.com/photo-1540317580384-e5d418a6293b?auto=format&fit=crop&w=800&q=80",
            author: "Board Office",
            readTime: "3 Min Read"
        },
        {
            id: 5,
            title: "Green Energy: The Future of Nepalese Investment",
            category: "Blog",
            date: "February 20, 2026",
            shortDesc: "Why renewable energy projects are becoming the most stable asset class in the region.",
            fullDesc: "With the increase in energy demand across South Asia, Nepal's hydropower and solar potential is more valuable than ever. This blog explores why ACL is shifting 30% of its project portfolio toward green energy and what it means for our impact-driven investors.",
            img: "https://images.unsplash.com/photo-1466611653911-954ffea113ad?auto=format&fit=crop&w=800&q=80",
            author: "Advisor Desk",
            readTime: "7 Min Read"
        },
        {
            id: 6,
            title: "Navigating SME Loans: A Beginner's Guide",
            category: "Investment Tips",
            date: "February 15, 2026",
            shortDesc: "Essential documentation and business planning tips for first-time credit applicants.",
            fullDesc: "Applying for your first business loan can be daunting. We break down the checklist you need to prepare, from tax registration to cash flow projections, ensuring your application gets approved smoothly.",
            img: "https://images.unsplash.com/photo-1450101499163-c8848c66ca85?auto=format&fit=crop&w=800&q=80",
            author: "Loan Department",
            readTime: "5 Min Read"
        }
    ];

    let newsFilters = {
        search: '',
        category: 'all'
    };

    let visibleNewsCount = 6;

    function renderNews() {
        const newsGrid = document.getElementById('newsGrid');
        if (!newsGrid) return;

        const filtered = newsData.filter(n => {
            const matchesSearch = n.title.toLowerCase().includes(newsFilters.search.toLowerCase());
            const matchesCategory = newsFilters.category === 'all' || n.category === newsFilters.category;
            return matchesSearch && matchesCategory;
        });

        const toDisplay = filtered.slice(0, visibleNewsCount);

        if (toDisplay.length === 0) {
            newsGrid.innerHTML = `<div class="no-results py-5 text-center" style="grid-column: 1/-1;">
                <p>No articles found matching your criteria.</p>
            </div>`;
            const loadMoreBtn = document.getElementById('btnLoadMoreNews');
            if (loadMoreBtn) loadMoreBtn.style.display = 'none';
            return;
        }

        newsGrid.innerHTML = toDisplay.map(n => `
            <article class="news-card fade-up">
                <div class="news-card-img" style="background-image: url('${n.img}')">
                    <span class="category-badge">${n.category}</span>
                </div>
                <div class="news-card-content">
                    <div class="news-date">${n.date}</div>
                    <h4>${n.title}</h4>
                    <p class="text-muted small">${n.shortDesc}</p>
                    <div class="mt-auto">
                        <button class="btn btn-link text-red ps-0 fw-bold" onclick="openNewsModal(${n.id})">Read More <i class="fa-solid fa-arrow-right ms-1"></i></button>
                    </div>
                </div>
            </article>
        `).join('');

        // Sidebar
        const recentList = document.getElementById('recentNewsSidebar');
        if (recentList) {
            recentList.innerHTML = newsData.slice(0, 4).map(n => `
                <div class="recent-post-item" onclick="openNewsModal(${n.id})" style="cursor: pointer;">
                    <div class="recent-post-thumb" style="background-image: url('${n.img}')"></div>
                    <div class="recent-post-info">
                        <h6>${n.title}</h6>
                        <p>${n.date}</p>
                    </div>
                </div>
            `).join('');
        }

        // Handle Load More
        const loadMoreBtn = document.getElementById('btnLoadMoreNews');
        if (loadMoreBtn) {
            loadMoreBtn.style.display = filtered.length > visibleNewsCount ? 'inline-block' : 'none';
        }

        // Animations
        setTimeout(() => {
            newsGrid.querySelectorAll('.news-card').forEach(card => card.classList.add('visible'));
        }, 50);
    }

    window.openNewsModal = function(id) {
        const article = newsData.find(n => n.id === id);
        if (!article) return;

        const modal = document.getElementById('newsModal');
        const modalContent = modal.querySelector('.modal-content');

        modalContent.innerHTML = `
            <div class="modal-header d-block p-0 overflow-hidden" style="height: auto;">
                <img src="${article.img}" alt="${article.title}" style="width: 100%; height: 350px; object-fit: cover;">
                <button class="close-modal" onclick="closeNewsModal()" style="background: white; color: black; top: 1rem; right: 1rem;">&times;</button>
            </div>
            <div class="modal-body p-4 p-md-5">
                <span class="category-badge mb-3 d-inline-block" style="position: static;">${article.category}</span>
                <h2 class="mb-4 text-primary">${article.title}</h2>
                <div class="d-flex align-items-center mb-4 text-muted small">
                    <span class="me-3"><i class="fa-regular fa-calendar me-1"></i> ${article.date}</span>
                    <span class="me-3"><i class="fa-regular fa-user me-1"></i> ${article.author}</span>
                    <span><i class="fa-regular fa-clock me-1"></i> ${article.readTime}</span>
                </div>
                <div class="news-full-text" style="line-height: 1.8; color: #444; font-size: 1.1rem;">
                    <p class="fw-bold mb-4">${article.shortDesc}</p>
                    <p>${article.fullDesc}</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam in dui mauris. Vivamus hendrerit arcu sed erat molestie vehicula. Sed auctor neque eu tellus rhoncus ut eleifend nibh porttitor. Ut in nulla enim. Phasellus molestie magna non est bibendum non venenatis nisl tempor. Suspendisse dictum feugiat nisl ut dapibus.</p>
                    <p>Mauris iaculis porttitor posuere. Praesent id metus massa, ut blandit odio. Proin quis tortor orci. Etiam at risus et justo dignissim congue. Donec congue lacinia dui, a porttitor lectus condimentum laoreet. Nunc adipiscing nisi tortor, vitae fringilla magna.</p>
                </div>
                <div class="mt-5 pt-4 border-top">
                    <p class="fw-bold mb-3">Share this insights:</p>
                    <div class="social-links" style="justify-content: flex-start;">
                        <a href="#"><i class="fa-brands fa-facebook-f"></i></a>
                        <a href="#"><i class="fa-brands fa-twitter"></i></a>
                        <a href="#"><i class="fa-brands fa-linkedin-in"></i></a>
                    </div>
                </div>
            </div>
        `;

        modal.style.display = 'block';
        document.body.style.overflow = 'hidden';
    };

    window.closeNewsModal = function() {
        const modal = document.getElementById('newsModal');
        if (modal) modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    };

    // Listeners
    const newsSearch = document.getElementById('newsSearch');
    if (newsSearch) {
        newsSearch.addEventListener('input', (e) => {
            newsFilters.search = e.target.value;
            renderNews();
        });
    }

    const newsPills = document.querySelectorAll('.category-pill');
    newsPills.forEach(pill => {
        pill.addEventListener('click', () => {
            newsPills.forEach(p => p.classList.remove('active'));
            pill.classList.add('active');
            newsFilters.category = pill.getAttribute('data-category');
            renderNews();
        });
    });

    const loadMoreNews = document.getElementById('btnLoadMoreNews');
    if (loadMoreNews) {
        loadMoreNews.addEventListener('click', () => {
            visibleNewsCount += 3;
            renderNews();
        });
    }

    const newsModalOverlay = document.getElementById('newsModal');
    if (newsModalOverlay) {
        newsModalOverlay.addEventListener('click', (e) => {
            if (e.target === newsModalOverlay) closeNewsModal();
        });
    }

    /* --- 10. Sliding Hero Logic --- */
    const slides = document.querySelectorAll('.hero-slide');
    const dotsContainer = document.getElementById('dotsNav');
    const prevBtn = document.getElementById('prevSlide');
    const nextBtn = document.getElementById('nextSlide');
    let currentIndex = 0;
    let slideInterval;
    const totalSlides = slides.length;

    if (totalSlides > 0) {
        // create dots
        function createDots() {
            if (!dotsContainer) return;
            dotsContainer.innerHTML = '';
            for (let i = 0; i < totalSlides; i++) {
                const dot = document.createElement('button');
                dot.classList.add('dot');
                if (i === currentIndex) dot.classList.add('active');
                dot.setAttribute('data-index', i);
                dot.setAttribute('aria-label', `Go to slide ${i + 1}`);
                dot.addEventListener('click', () => {
                    goToSlide(i);
                    resetAutoSlide();
                });
                dotsContainer.appendChild(dot);
            }
        }

        function updateDots() {
            const dots = document.querySelectorAll('.dot');
            dots.forEach((dot, idx) => {
                if (idx === currentIndex) {
                    dot.classList.add('active');
                } else {
                    dot.classList.remove('active');
                }
            });
        }

        function goToSlide(index) {
            // remove active class from all slides
            slides.forEach((slide) => {
                slide.classList.remove('active');
                slide.style.position = 'absolute';
                slide.style.opacity = '0';
                slide.style.visibility = 'hidden';
            });
            // set new active slide
            const newSlide = slides[index];
            newSlide.classList.add('active');
            newSlide.style.position = 'relative';
            newSlide.style.opacity = '1';
            newSlide.style.visibility = 'visible';
            currentIndex = index;
            updateDots();
        }

        function nextSlide() {
            let newIndex = (currentIndex + 1) % totalSlides;
            goToSlide(newIndex);
        }

        function prevSlideFn() {
            let newIndex = (currentIndex - 1 + totalSlides) % totalSlides;
            goToSlide(newIndex);
        }

        function resetAutoSlide() {
            if (slideInterval) clearInterval(slideInterval);
            slideInterval = setInterval(nextSlide, 5000);
        }

        // initial setup
        function initSlidesLayout() {
            slides.forEach((slide, idx) => {
                if (idx === currentIndex) {
                    slide.classList.add('active');
                    slide.style.position = 'relative';
                    slide.style.opacity = '1';
                    slide.style.visibility = 'visible';
                } else {
                    slide.classList.remove('active');
                    slide.style.position = 'absolute';
                    slide.style.opacity = '0';
                    slide.style.visibility = 'hidden';
                }
            });
            createDots();
            resetAutoSlide();
        }

        // event listeners for arrows
        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlideFn();
                resetAutoSlide();
            });
        }
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoSlide();
            });
        }

        // optional: pause auto slide on hover
        const sliderSection = document.querySelector('.hero-slider');
        if (sliderSection) {
            sliderSection.addEventListener('mouseenter', () => {
                if (slideInterval) clearInterval(slideInterval);
            });
            sliderSection.addEventListener('mouseleave', resetAutoSlide);

            // touch / swipe support
            let touchStartX = 0;
            sliderSection.addEventListener('touchstart', (e) => {
                touchStartX = e.changedTouches[0].screenX;
            }, { passive: true });
            
            sliderSection.addEventListener('touchend', (e) => {
                const touchEndX = e.changedTouches[0].screenX;
                const diff = touchEndX - touchStartX;
                if (Math.abs(diff) > 50) {
                    if (diff > 0) prevSlideFn();
                    else nextSlide();
                    resetAutoSlide();
                }
            }, { passive: true });
        }

        initSlidesLayout();
    }

    // --- 9. Testimonials Slider (20 Clients) ---
    function initTestimonialsSlider() {
        const viewport = document.getElementById('testViewport');
        const wrapper = document.getElementById('testWrapper');
        const prevBtn = document.getElementById('testPrev');
        const nextBtn = document.getElementById('testNext');
        const dotsContainer = document.getElementById('testDots');
        const slides = document.querySelectorAll('.testimonial-slide');

        if (!viewport || !wrapper || slides.length === 0) return;

        let currentIndex = 0;
        let isDragging = false;
        let startPos = 0;
        let currentTranslate = 0;
        let prevTranslate = 0;
        let animationID = 0;
        let autoInterval;

        const totalSlides = slides.length;

        function getVisibleSlides() {
            if (window.innerWidth > 992) return 3;
            if (window.innerWidth > 600) return 2;
            return 1;
        }

        function setSliderPosition() {
            wrapper.style.transform = `translateX(${currentTranslate}px)`;
        }

        function updateSlider() {
            const visible = getVisibleSlides();
            const slideWidth = viewport.offsetWidth / visible;
            
            // Limit index
            const maxIndex = totalSlides - visible;
            if (currentIndex > maxIndex) currentIndex = maxIndex;
            if (currentIndex < 0) currentIndex = 0;

            currentTranslate = currentIndex * -slideWidth;
            prevTranslate = currentTranslate;
            setSliderPosition();
            updateDots();
        }

        function updateDots() {
            const dots = dotsContainer.querySelectorAll('.test-dot');
            dots.forEach((dot, idx) => {
                dot.classList.toggle('active', idx === currentIndex);
            });
        }

        function createDots() {
            dotsContainer.innerHTML = '';
            // For 20 slides, we'll create one dot per slide
            slides.forEach((_, idx) => {
                const dot = document.createElement('button');
                dot.classList.add('test-dot');
                if (idx === 0) dot.classList.add('active');
                dot.addEventListener('click', () => {
                    currentIndex = idx;
                    updateSlider();
                    resetAutoSlide();
                });
                dotsContainer.appendChild(dot);
            });
        }

        function nextSlide() {
            const visible = getVisibleSlides();
            if (currentIndex < totalSlides - visible) {
                currentIndex++;
            } else {
                currentIndex = 0; // Loop back
            }
            updateSlider();
        }

        function prevSlide() {
            if (currentIndex > 0) {
                currentIndex--;
            } else {
                currentIndex = totalSlides - getVisibleSlides();
            }
            updateSlider();
        }

        function startAutoSlide() {
            autoInterval = setInterval(nextSlide, 5000);
        }

        function resetAutoSlide() {
            clearInterval(autoInterval);
            startAutoSlide();
        }

        // Event Listeners
        if (nextBtn) {
            nextBtn.addEventListener('click', () => {
                nextSlide();
                resetAutoSlide();
            });
        }

        if (prevBtn) {
            prevBtn.addEventListener('click', () => {
                prevSlide();
                resetAutoSlide();
            });
        }

        // Touch Events
        viewport.addEventListener('touchstart', touchStart);
        viewport.addEventListener('touchend', touchEnd);
        viewport.addEventListener('touchmove', touchMove);

        function touchStart(event) {
            isDragging = true;
            startPos = getPositionX(event);
            animationID = requestAnimationFrame(animation);
            viewport.classList.add('grabbing');
            clearInterval(autoInterval);
        }

        function touchMove(event) {
            if (isDragging) {
                const currentPosition = getPositionX(event);
                currentTranslate = prevTranslate + currentPosition - startPos;
            }
        }

        function touchEnd() {
            isDragging = false;
            viewport.classList.remove('grabbing');
            cancelAnimationFrame(animationID);

            const movedBy = currentTranslate - prevTranslate;
            const threshold = viewport.offsetWidth / 10;

            if (movedBy < -threshold) {
                nextSlide();
            } else if (movedBy > threshold) {
                prevSlide();
            } else {
                updateSlider();
            }
            startAutoSlide();
        }

        function getPositionX(event) {
            return event.type.includes('mouse') ? event.pageX : event.touches[0].clientX;
        }

        function animation() {
            setSliderPosition();
            if (isDragging) requestAnimationFrame(animation);
        }

        window.addEventListener('resize', () => {
            updateSlider();
            // Recalculate dots? No, dots count stays same for now.
        });

        // Initialize
        createDots();
        updateSlider();
        startAutoSlide();
    }

    initTestimonialsSlider();

    renderNews();
    renderProjects();
});
