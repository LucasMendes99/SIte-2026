/**
 * Portfólio - Script principal
 * Navegação suave, indicador de scroll, menu mobile e animações
 */

document.addEventListener('DOMContentLoaded', () => {
    // Elementos
    const scrollIndicator = document.getElementById('scrollIndicator');
    const header = document.getElementById('header');
    const navToggle = document.getElementById('navToggle');
    const navMenu = document.getElementById('navMenu');
    const navLinks = document.querySelectorAll('.nav-link');
    const typedRole = document.getElementById('typedRole');
    const trackedSections = document.querySelectorAll('main section[id]');

    // ===== Efeito de digitação no Hero =====
    if (typedRole) {
        const words = ['Full-Stack', 'Frontend', 'Backend', 'React', 'Node.js'];
        let wordIndex = 0;
        let charIndex = words[0].length;
        let isDeleting = false;
        let isPausing = true;
        typedRole.textContent = words[0];

        function typeLoop() {
            const currentWord = words[wordIndex];
            let delay = isDeleting ? 85 : 140;

            if (isPausing) {
                isPausing = false;
                isDeleting = true;
                delay = 1400;
            } else if (isDeleting && charIndex > 0) {
                charIndex -= 1;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
            } else if (!isDeleting && charIndex < currentWord.length) {
                charIndex += 1;
            } else {
                isPausing = true;
            }

            typedRole.textContent = currentWord.slice(0, charIndex);
            window.setTimeout(typeLoop, delay);
        }

        typeLoop();
    }

    // ===== Indicador de Scroll =====
    function updateScrollIndicator() {
        const scrollTop = window.scrollY;
        const docHeight = document.documentElement.scrollHeight - window.innerHeight;
        const scrollPercent = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
        scrollIndicator.style.width = `${scrollPercent}%`;
    }

    window.addEventListener('scroll', updateScrollIndicator);
    updateScrollIndicator(); // Inicial

    // ===== Header com efeito no scroll =====
    function updateHeader() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }

    window.addEventListener('scroll', updateHeader);
    updateHeader(); // Inicial

    // ===== Menu Mobile =====
    function toggleMenu() {
        navMenu.classList.toggle('active');
        navToggle.classList.toggle('active');
        document.body.style.overflow = navMenu.classList.contains('active') ? 'hidden' : '';
    }

    navToggle.addEventListener('click', toggleMenu);

    // Fechar menu ao clicar em um link
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (navMenu.classList.contains('active')) {
                toggleMenu();
            }
        });
    });

    // Fechar menu ao clicar fora
    document.addEventListener('click', (e) => {
        if (navMenu.classList.contains('active') && 
            !navMenu.contains(e.target) && 
            !navToggle.contains(e.target)) {
            toggleMenu();
        }
    });

    // ===== Navegação suave =====
    navLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            const href = link.getAttribute('href');
            if (href.startsWith('#')) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ===== Link ativo no menu conforme seção visível =====
    if (trackedSections.length && navLinks.length) {
        const updateActiveNavLink = (sectionId) => {
            navLinks.forEach((link) => {
                const targetId = link.getAttribute('href');
                link.classList.toggle('active', targetId === `#${sectionId}`);
            });
        };

        const sectionObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    updateActiveNavLink(entry.target.id);
                }
            });
        }, {
            root: null,
            rootMargin: '-45% 0px -45% 0px',
            threshold: 0
        });

        trackedSections.forEach((section) => sectionObserver.observe(section));
    }

    // Links de CTA no Hero
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ===== Animações ao rolar a página =====
    const animatedElements = document.querySelectorAll('.animate-on-scroll');
    const observerOptions = {
        root: null,
        rootMargin: '0px 0px -80px 0px', // Dispara um pouco antes do elemento entrar
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                // Opcional: parar de observar após animar (melhor performance)
                // observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    animatedElements.forEach(el => observer.observe(el));

    // ===== Formulário de contato =====
    const contatoForm = document.getElementById('contatoForm');
    const contatoStatus = document.getElementById('contatoStatus');
    const celularInput = document.getElementById('celular');
    const captchaContainer = document.getElementById('captchaContainer');
    const nomeInput = document.getElementById('nome');
    const emailInput = document.getElementById('email');
    const mensagemInput = document.getElementById('mensagem');
    let captchaWidgetId = null;

    function setContatoStatus(message, type = '') {
        if (!contatoStatus) return;
        contatoStatus.textContent = message;
        contatoStatus.classList.remove('success', 'error');
        if (type) contatoStatus.classList.add(type);
    }

    function trackAnalyticsEvent(eventName, data = {}) {
        if (typeof window !== 'undefined' && typeof window.va === 'function') {
            window.va('event', { name: eventName, data });
        }
    }

    function formatarCelular(input) {
        const digits = input.replace(/\D/g, '').slice(0, 11);
        if (digits.length <= 10) {
            return digits
                .replace(/(\d{0,2})(\d{0,4})(\d{0,4})/, (_, d1, d2, d3) => {
                    let value = '';
                    if (d1) value += `(${d1}`;
                    if (d1.length === 2) value += ') ';
                    if (d2) value += d2;
                    if (d3) value += `-${d3}`;
                    return value;
                })
                .trim();
        }

        return digits
            .replace(/(\d{2})(\d{5})(\d{0,4})/, (_, d1, d2, d3) => {
                let value = `(${d1}) ${d2}`;
                if (d3) value += `-${d3}`;
                return value;
            })
            .trim();
    }

    function setFieldError(inputEl, message) {
        if (!inputEl) return;
        const errorEl = document.getElementById(`erro-${inputEl.id}`);
        inputEl.classList.toggle('input-invalid', Boolean(message));
        inputEl.setAttribute('aria-invalid', message ? 'true' : 'false');
        if (errorEl) {
            errorEl.textContent = message || '';
        }
    }

    function validateField(inputEl) {
        if (!inputEl) return true;
        const value = inputEl.value.trim();
        const fieldName = inputEl.name;
        let message = '';

        if (!value) {
            message = 'Este campo é obrigatório.';
        } else if (fieldName === 'email') {
            const isValidEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
            if (!isValidEmail) message = 'Digite um e-mail válido.';
        } else if (fieldName === 'celular') {
            const digits = value.replace(/\D/g, '');
            if (digits.length < 10) message = 'Digite um celular válido com DDD.';
        } else if (fieldName === 'mensagem' && value.length < 20) {
            message = 'A mensagem precisa ter pelo menos 20 caracteres.';
        }

        setFieldError(inputEl, message);
        return message === '';
    }

    async function getCaptchaSiteKey() {
        try {
            const response = await fetch('/api/contato', {
                method: 'GET',
                headers: { Accept: 'application/json' }
            });
            const data = await response.json().catch(() => ({}));
            if (!response.ok || !data.siteKey) return '';
            return data.siteKey;
        } catch (error) {
            return '';
        }
    }

    async function loadHcaptchaScript() {
        return new Promise((resolve, reject) => {
            if (window.hcaptcha) {
                resolve();
                return;
            }

            const script = document.createElement('script');
            script.src = 'https://js.hcaptcha.com/1/api.js?render=explicit';
            script.async = true;
            script.defer = true;
            script.onload = () => resolve();
            script.onerror = () => reject(new Error('Falha ao carregar hCaptcha'));
            document.head.appendChild(script);
        });
    }

    async function ensureCaptchaReady() {
        if (!captchaContainer) return false;
        const siteKey = await getCaptchaSiteKey();
        if (!siteKey) {
            captchaContainer.innerHTML = '';
            setContatoStatus('Proteção anti-spam não configurada. Defina HCAPTCHA_SITE_KEY na Vercel.', 'error');
            return false;
        }

        await loadHcaptchaScript();
        if (captchaWidgetId === null && window.hcaptcha) {
            captchaWidgetId = window.hcaptcha.render(captchaContainer, { sitekey: siteKey });
        }
        return true;
    }

    if (celularInput) {
        celularInput.addEventListener('input', () => {
            celularInput.value = formatarCelular(celularInput.value);
        });
    }

    if (contatoForm) {
        const submitButton = contatoForm.querySelector('button[type="submit"]');
        const originalButtonText = submitButton ? submitButton.textContent : 'Enviar';
        const formFields = [nomeInput, emailInput, celularInput, mensagemInput].filter(Boolean);

        formFields.forEach((field) => {
            field.addEventListener('blur', () => validateField(field));
            field.addEventListener('input', () => {
                if (field.classList.contains('input-invalid')) {
                    validateField(field);
                }
            });
        });

        ensureCaptchaReady().catch(() => {
            setContatoStatus('Não foi possível carregar o captcha agora. Recarregue a página.', 'error');
        });

        contatoForm.addEventListener('submit', async (e) => {
            e.preventDefault();

            const isFormValid = formFields.every((field) => validateField(field));
            if (!isFormValid) {
                setContatoStatus('Revise os campos destacados antes de enviar.', 'error');
                return;
            }

            const honeyField = contatoForm.querySelector('input[name="_honey"]');
            if (honeyField && honeyField.value.trim() !== '') return;

            if (!window.hcaptcha || captchaWidgetId === null) {
                setContatoStatus('Captcha indisponível. Recarregue a página e tente novamente.', 'error');
                return;
            }

            const captchaToken = window.hcaptcha.getResponse(captchaWidgetId);
            if (!captchaToken) {
                setContatoStatus('Confirme que você não é robô antes de enviar.', 'error');
                return;
            }

            if (submitButton) {
                submitButton.disabled = true;
                submitButton.classList.add('is-loading');
                submitButton.textContent = 'Enviando...';
            }

            setContatoStatus('Enviando sua mensagem...');

            try {
                const payload = {
                    nome: contatoForm.nome.value.trim(),
                    email: contatoForm.email.value.trim(),
                    celular: contatoForm.celular.value.trim(),
                    mensagem: contatoForm.mensagem.value.trim(),
                    captchaToken,
                    _honey: honeyField ? honeyField.value : ''
                };

                const response = await fetch('/api/contato', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        Accept: 'application/json'
                    },
                    body: JSON.stringify(payload)
                });
                const result = await response.json().catch(() => ({}));

                if (!response.ok || result.success === false) {
                    const code = result.code || 'INTERNAL_ERROR';
                    if (code === 'VALIDATION_ERROR') {
                        throw new Error(result.message || 'Verifique os campos e tente novamente.');
                    }
                    if (code === 'SPAM_DETECTED') {
                        throw new Error(result.message || 'Captcha inválido. Faça a verificação novamente.');
                    }
                    throw new Error(result.message || 'Não consegui enviar agora. Tente novamente.');
                }

                contatoForm.reset();
                window.hcaptcha.reset(captchaWidgetId);
                setContatoStatus('Mensagem enviada com sucesso. Vou te responder em breve!', 'success');
                trackAnalyticsEvent('contato_enviado', { origem: 'formulario_site' });
            } catch (error) {
                setContatoStatus(
                    error.message || 'Não consegui enviar agora. Tente de novo ou mande e-mail para lucas.ms2312@gmail.com.',
                    'error'
                );
            } finally {
                if (submitButton) {
                    submitButton.disabled = false;
                    submitButton.classList.remove('is-loading');
                    submitButton.textContent = originalButtonText;
                }
            }
        });
    }
});
