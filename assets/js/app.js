const header = document.querySelector("[data-site-header]");
const footer = document.querySelector("[data-site-footer]");

if (header) {
    const registrationPage = window.location.pathname.endsWith("registration.html");
    header.innerHTML = `
        <div class="container header-inner">
            <a class="brand" href="index.html" aria-label="योजना का मुखपृष्ठ">
                <span class="brand-mark" aria-hidden="true"><span>उ</span></span>
                <span class="brand-copy"><strong>उत्तराखंड सरकार</strong><small>महिला सशक्तिकरण एवं बाल विकास</small></span>
            </a>
            <button class="menu-toggle" type="button" aria-expanded="false" aria-controls="primary-navigation" data-menu-toggle><span></span><span></span><span></span><b>मेन्यू</b></button>
            <nav class="primary-navigation" id="primary-navigation" aria-label="मुख्य नेविगेशन" data-navigation>
                <a href="index.html#yojana">योजना के बारे में</a><a href="index.html#patrata">पात्रता</a><a href="index.html#dastavez">जरूरी दस्तावेज</a>
                <a class="nav-apply${registrationPage ? " nav-apply-current" : ""}" href="registration.html">${registrationPage ? "आवेदन फॉर्म" : "पंजीकरण करें"} <span aria-hidden="true">↗</span></a>
            </nav>
        </div>`;
}

if (footer) {
    footer.innerHTML = `
        <div class="container footer-inner">
            <a class="brand brand-footer" href="index.html"><span class="brand-mark" aria-hidden="true"><span>उ</span></span><span class="brand-copy"><strong>उत्तराखंड सरकार</strong><small>महिला सशक्तिकरण एवं बाल विकास</small></span></a>
            <p>मुख्यमंत्री एकल महिला स्वरोजगार योजना<br><span>योजना जानकारी एवं आवेदन प्रारूप</span></p>
            <a class="footer-top" href="#main-content">पृष्ठ के शीर्ष पर ↑</a>
        </div>`;
}

const menuToggle = document.querySelector("[data-menu-toggle]");
const navigation = document.querySelector("[data-navigation]");

if (menuToggle && navigation) {
    menuToggle.addEventListener("click", () => {
        const isOpen = menuToggle.getAttribute("aria-expanded") === "true";
        menuToggle.setAttribute("aria-expanded", String(!isOpen));
        navigation.classList.toggle("navigation-open", !isOpen);
    });

    navigation.addEventListener("click", (event) => {
        if (event.target.closest("a")) {
            menuToggle.setAttribute("aria-expanded", "false");
            navigation.classList.remove("navigation-open");
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

    nextButton.addEventListener("click", () => {
        if (currentStep === 2) {
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

    form.addEventListener("submit", (event) => {
        event.preventDefault();
        updateConditionalFields();
        updateProjectValidity();
        const incompleteStep = steps.findIndex((step, index) => !validateStep(index));
        if (incompleteStep !== -1) {
            updateFormStep(incompleteStep);
            return;
        }
        message.innerHTML = `<strong>आपका आवेदन प्रारूप पूरा है।</strong><p>यह डेमो किसी सरकारी ऑनलाइन सबमिशन सेवा से जुड़ा नहीं है। आपका आवेदन या दस्तावेज कहीं भेजे नहीं गए हैं। आवेदन जमा करने के लिए संबंधित विभाग से संपर्क करें।</p><button class="print-button" type="button" data-print-application>इस पृष्ठ को प्रिंट करें</button>`;
        message.hidden = false;
        message.querySelector("[data-print-application]").addEventListener("click", () => window.print());
        message.scrollIntoView({ behavior: "smooth", block: "center" });
    });

    updateConditionalFields();
    updateFormStep(0);
}
