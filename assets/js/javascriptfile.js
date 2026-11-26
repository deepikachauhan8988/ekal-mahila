const header = document.querySelector(".site-header");
const footer = document.querySelector("[data-site-footer]");

if (header && !header.innerHTML.trim()) {
    const registrationPage = window.location.pathname.endsWith("registration.html");
    header.innerHTML = `
        <div class="header-top">
            <div class="container header-top-inner">
                <a class="brand" href="index.html" aria-label="योजना का मुखपृष्ठ">
                    <span class="brand-mark" aria-hidden="true"><img src="assets/images/uk_logo.jpeg" alt="उत्तराखंड सरकार" loading="eager"></span>
                    <span class="brand-copy"><strong>उत्तराखंड सरकार</strong><small>मुख्यमंत्री एकल महिला स्वरोजगार योजना</small></span>
                </a>
                <div class="header-actions">
                    <a class="header-help" href="index.html#help"><span class="header-help-icon" aria-hidden="true">?</span><span>सहायता</span></a>
                    <a class="header-apply${registrationPage ? " header-apply-current" : ""}" href="registration.html">${registrationPage ? "फॉर्म भर रहे हैं" : "आवेदन करें"} <span aria-hidden="true">→</span></a>
                </div>
                <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" data-menu-toggle><span></span><span></span><span></span><b>मेन्यू</b></button>
            </div>
        </div>`;
} else if (header) {
    const registrationPage = window.location.pathname.endsWith("registration.html");
    const applyBtn = header.querySelector(".header-apply");
    if (applyBtn) {
        applyBtn.classList.toggle("header-apply-current", registrationPage);
        applyBtn.innerHTML = `${registrationPage ? "फॉर्म भर रहे हैं" : "आवेदन करें"} <span aria-hidden="true">→</span>`;
    }
}

if (footer) {
    footer.innerHTML = `
        <div class="container footer-inner">
            <a class="brand brand-footer" href="index.html"><span class="brand-mark" aria-hidden="true"><img src="assets/images/uk_logo.jpeg" alt="उत्तराखंड सरकार" loading="lazy"></span><span class="brand-copy"><strong>उत्तराखंड सरकार</strong><small>एकल महिला स्वरोजगार योजना</small></span></a>
            <p>मुख्यमंत्री एकल महिला स्वरोजगार योजना<br><span>योजना जानकारी एवं आवेदन प्रारूप</span></p>
            <a class="footer-top" href="#main-content">पृष्ठ के शीर्ष पर ↑</a>
        </div>`;
}

const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");
const navBar = document.querySelector(".header-nav-bar");

if (menuToggle && navigation && navBar) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        navBar.classList.toggle("navigation-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            menuToggle.setAttribute("aria-expanded", "false");
            navBar.classList.remove("navigation-open");
        }
    });
}

const carousel = document.querySelector("[data-carousel]");

if (carousel) {
    const slides = Array.from(carousel.querySelectorAll("[data-slide]"));
    const dots = Array.from(carousel.querySelectorAll("[data-go-to]"));
    let activeSlide = 0;

    const showSlide = (index) => {
        activeSlide = (index + slides.length) % slides.length;
        slides.forEach((slide, slideIndex) => {
            const isActive = slideIndex === activeSlide;
            slide.classList.toggle("slide-active", isActive);
            slide.setAttribute("aria-hidden", String(!isActive));
        });
        dots.forEach((dot, dotIndex) => {
            const isActive = dotIndex === activeSlide;
            dot.classList.toggle("is-current", isActive);
            dot.setAttribute("aria-pressed", String(isActive));
        });
    };

    carousel.querySelector("[data-previous]").addEventListener("click", () => showSlide(activeSlide - 1));
    carousel.querySelector("[data-next]").addEventListener("click", () => showSlide(activeSlide + 1));
    dots.forEach((dot) => dot.addEventListener("click", () => showSlide(Number(dot.dataset.goTo))));
}

const form = document.querySelector("#application-form");

if (form) {
    const singlePage = form.hasAttribute("data-single-page");
    const steps = Array.from(form.querySelectorAll("[data-form-step]"));
    const indicators = Array.from(form.querySelectorAll("[data-step-indicator]"));
    const previousButton = form.querySelector("[data-previous-step]");
    const nextButton = form.querySelector("[data-next-step]");
    const submitButton = form.querySelector("[data-submit-application]");
    const stepCount = form.querySelector("[data-step-count]");
    const message = form.querySelector("[data-submission-message]");
    const fundsDetails = form.querySelector("[data-funds-details]");
    const costInput = form.elements.namedItem("projectCost");
    const contributionInput = form.elements.namedItem("contribution");
    const contributionNote = form.querySelector("[data-contribution-note]");
    let currentStep = 0;

    const updateFormStep = (index) => {
        if (singlePage) {
            steps.forEach((step) => {
                step.hidden = false;
                step.classList.add("is-visible");
            });
            return;
        }
        currentStep = index;
        steps.forEach((step, stepIndex) => {
            const isCurrent = stepIndex === currentStep;
            step.hidden = !isCurrent;
            step.classList.toggle("is-visible", isCurrent);
        });
        indicators.forEach((indicator, stepIndex) => {
            indicator.classList.toggle("is-current", stepIndex === currentStep);
            indicator.classList.toggle("is-complete", stepIndex < currentStep);
            if (stepIndex === currentStep) {
                indicator.setAttribute("aria-current", "step");
            } else {
                indicator.removeAttribute("aria-current");
            }
        });
        previousButton.hidden = currentStep === 0;
        nextButton.hidden = currentStep === steps.length - 1;
        submitButton.hidden = currentStep !== steps.length - 1;
        stepCount.textContent = `चरण ${currentStep + 1} / ${steps.length}`;
        message.hidden = true;
    };

    const validateStep = (stepIndex) => {
        const fields = Array.from(steps[stepIndex].querySelectorAll("input, select, textarea"));
        const invalidField = fields.find((field) => !field.checkValidity());
        if (invalidField) {
            invalidField.reportValidity();
            invalidField.focus();
            return false;
        }
        return true;
    };

    const updateContributionHint = () => {
        const projectCost = Number(costInput.value);
        const minimumContribution = Math.ceil(projectCost * 0.25);
        if (projectCost > 0) {
            contributionNote.textContent = `इस लागत के लिए 25% अंशदान कम-से-कम ₹${minimumContribution.toLocaleString("en-IN")} होना चाहिए।`;
        } else {
            contributionNote.textContent = "परियोजना लागत का कम-से-कम 25% लाभार्थी का योगदान होना चाहिए।";
        }
    };

    const updateProjectValidity = () => {
        const projectCost = Number(costInput.value);
        const supportAmount = Number(form.elements.namedItem("supportAmount").value);
        const contribution = Number(contributionInput.value);
        const projectError = supportAmount > projectCost
            ? "मांगी गई सहायता परियोजना की कुल लागत से अधिक नहीं हो सकती।"
            : "";
        const contributionError = projectCost > 0 && contribution < projectCost * 0.25
            ? `लाभार्थी का अंशदान कम-से-कम ₹${Math.ceil(projectCost * 0.25).toLocaleString("en-IN")} होना चाहिए।`
            : "";

        form.elements.namedItem("supportAmount").setCustomValidity(projectError);
        contributionInput.setCustomValidity(contributionError);
        updateContributionHint();
    };

    const updateConditionalFields = () => {
        const fundsReceived = form.querySelector('input[name="otherDepartmentFunds"]:checked')?.value === "हाँ";
        fundsDetails.hidden = !fundsReceived;
        ["otherDepartmentName", "otherDepartmentAmount"].forEach((name) => {
            form.elements.namedItem(name).required = fundsReceived;
        });

        ["notarizedDeclaration", "noDoubleBenefitDeclaration"].forEach((name) => {
            const declarationAttached = form.querySelector(`input[name="${name}"]:checked`)?.value === "हाँ";
            const upload = form.querySelector(`[data-declaration-upload="${name}"] input`);
            upload.required = declarationAttached;
            upload.closest(".field").classList.toggle("conditional-upload-required", declarationAttached);
        });
    };

    form.querySelectorAll("[data-file-name]").forEach((input) => {
        const note = input.closest(".upload-field").querySelector("[data-file-label]");
        input.addEventListener("change", () => {
            const file = input.files[0];
            input.setCustomValidity("");
            if (file && file.size > 5 * 1024 * 1024) {
                input.setCustomValidity("फाइल का आकार 5 MB से कम रखें।");
                note.textContent = "फाइल 5 MB से बड़ी है। छोटी फाइल चुनें।";
                note.classList.add("file-error");
                return;
            }
            note.classList.remove("file-error");
            note.textContent = file ? file.name : "PDF, JPG या PNG · अधिकतम 5 MB";
        });
    });

    form.addEventListener("change", (event) => {
        if (event.target.name === "otherDepartmentFunds" || event.target.name === "notarizedDeclaration" || event.target.name === "noDoubleBenefitDeclaration") {
            updateConditionalFields();
        }
    });

    costInput.addEventListener("input", updateProjectValidity);
    contributionInput.addEventListener("input", updateProjectValidity);
    form.elements.namedItem("supportAmount").addEventListener("input", updateProjectValidity);

    if (!singlePage) {
        nextButton.addEventListener("click", () => {
            if (currentStep === 1) {
                updateConditionalFields();
                updateProjectValidity();
            }
            if (validateStep(currentStep)) {
                updateFormStep(currentStep + 1);
                form.scrollIntoView({ behavior: "smooth", block: "start" });
            }
        });

        previousButton.addEventListener("click", () => {
            updateFormStep(currentStep - 1);
            form.scrollIntoView({ behavior: "smooth", block: "start" });
        });
    }

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        updateConditionalFields();
        updateProjectValidity();
        const incompleteStep = steps.findIndex((step) =>
            Array.from(step.querySelectorAll("input, select, textarea")).some((field) => !field.checkValidity())
        );
        if (incompleteStep !== -1) {
            if (!singlePage) {
                updateFormStep(incompleteStep);
            }
            validateStep(incompleteStep);
            return;
        }
        message.innerHTML = `<strong>आपका आवेदन प्रारूप पूरा है।</strong><p>यह डेमो किसी सरकारी ऑनलाइन सबमिशन सेवा से जुड़ा नहीं है। आपका आवेदन या दस्तावेज कहीं भेजे नहीं गए हैं। आवेदन जमा करने के लिए संबंधित विभाग से संपर्क करें।</p><button class="print-button" type="button" data-print-application>इस पृष्ठ को प्रिंट करें</button>`;
        message.hidden = false;
        message.querySelector("[data-print-application]").addEventListener("click", () => window.print());
        message.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    form.addEventListener("reset", () => {
        window.setTimeout(() => {
            form.querySelectorAll("[data-file-name]").forEach((input) => {
                input.setCustomValidity("");
                const note = input.closest(".upload-field").querySelector("[data-file-label]");
                note.classList.remove("file-error");
                note.textContent = "PDF, JPG या PNG · अधिकतम 5 MB";
            });
            updateConditionalFields();
            updateProjectValidity();
            message.hidden = true;
        }, 0);
    });

    updateConditionalFields();
    updateFormStep(0);
}

const loginForm = document.querySelector("#login-form");

if (loginForm) {
    const sendOtpBtn = loginForm.querySelector("#send-otp-btn");
    const loginSubmitBtn = loginForm.querySelector("#login-submit-btn");
    const message = loginForm.querySelector("[data-login-message]");
    let otpSent = false;
    let otpTimer = null;

    const showMessage = (html, isError = false) => {
        message.innerHTML = html;
        message.hidden = false;
        message.classList.toggle("error", isError);
        message.scrollIntoView({ behavior: "smooth", block: "center" });
    };

    const startOtpTimer = () => {
        let seconds = 300;
        sendOtpBtn.disabled = true;
        sendOtpBtn.innerHTML = `<i class="fa-solid fa-clock" aria-hidden="true"></i> ${seconds}s`;
        otpTimer = setInterval(() => {
            seconds--;
            if (seconds <= 0) {
                clearInterval(otpTimer);
                sendOtpBtn.disabled = false;
                sendOtpBtn.innerHTML = `<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> OTP भेजें`;
            } else {
                sendOtpBtn.innerHTML = `<i class="fa-solid fa-clock" aria-hidden="true"></i> ${seconds}s`;
            }
        }, 1000);
    };

    const validateMobile = (mobile) => {
        return /^[6-9][0-9]{9}$/.test(mobile);
    };

    const validateOtp = (otp) => {
        return /^\d{6}$/.test(otp);
    };

    sendOtpBtn.addEventListener("click", () => {
        const mobile = loginForm.elements.namedItem("mobile").value.trim();
        if (!validateMobile(mobile)) {
            loginForm.elements.namedItem("mobile").reportValidity();
            loginForm.elements.namedItem("mobile").focus();
            return;
        }
        otpSent = true;
        startOtpTimer();
        showMessage(`<strong>OTP भेजा गया!</strong><p>मोबाइल नंबर <b>${mobile}</b> पर 6 अंकों का OTP भेजा गया है। कृपया OTP दर्ज करें।</p>`, false);
    });

    loginForm.addEventListener("submit", (event) => {
        event.preventDefault();
        const mobile = loginForm.elements.namedItem("mobile").value.trim();
        const otp = loginForm.elements.namedItem("otp").value.trim();

        if (!validateMobile(mobile)) {
            loginForm.elements.namedItem("mobile").reportValidity();
            loginForm.elements.namedItem("mobile").focus();
            return;
        }
        if (!validateOtp(otp)) {
            loginForm.elements.namedItem("otp").reportValidity();
            loginForm.elements.namedItem("otp").focus();
            return;
        }

        loginSubmitBtn.disabled = true;
        loginSubmitBtn.innerHTML = `<span class="spinner-border spinner-border-sm" aria-hidden="true"></span> लॉगिन हो रहा है...`;

        setTimeout(() => {
            if (otp === "123456") {
                showMessage(`<strong>लॉगिन सफल!</strong><p>आपका स्वागत है। आवेदन फॉर्म पर पुनर्निर्देशित किया जा रहा है...</p>`, false);
                setTimeout(() => {
                    window.location.href = "registration.html";
                }, 1500);
            } else {
                showMessage(`<strong>गलत OTP!</strong><p>दर्ज किया गया OTP सही नहीं है। कृपया सही OTP दर्ज करें।</p>`, true);
                loginSubmitBtn.disabled = false;
                loginSubmitBtn.innerHTML = `<i class="fa-solid fa-right-to-bracket" aria-hidden="true"></i> लॉगिन`;
            }
        }, 1000);
    });

    loginForm.addEventListener("reset", () => {
        if (otpTimer) {
            clearInterval(otpTimer);
            otpTimer = null;
        }
        sendOtpBtn.disabled = false;
        sendOtpBtn.innerHTML = `<i class="fa-solid fa-paper-plane" aria-hidden="true"></i> OTP भेजें`;
        message.hidden = true;
        message.classList.remove("error");
        otpSent = false;
    });
}