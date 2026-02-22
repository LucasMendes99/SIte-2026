const { Resend } = require('resend');

function json(res, status, payload) {
    res.status(status).setHeader('Content-Type', 'application/json');
    res.end(JSON.stringify(payload));
}

function normalize(value) {
    return String(value || '').trim();
}

function isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function onlyDigits(value) {
    return String(value || '').replace(/\D/g, '');
}

function escapeHtml(value) {
    return String(value || '')
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#39;');
}

async function validateCaptcha(token, secret, remoteIp) {
    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', token);
    if (remoteIp) params.append('remoteip', remoteIp);

    const response = await fetch('https://hcaptcha.com/siteverify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: params.toString()
    });

    if (!response.ok) return false;
    const result = await response.json().catch(() => ({}));
    return Boolean(result.success);
}

module.exports = async (req, res) => {
    if (req.method === 'GET') {
        return json(res, 200, { siteKey: process.env.HCAPTCHA_SITE_KEY || '' });
    }

    if (req.method !== 'POST') {
        res.setHeader('Allow', 'GET, POST');
        return json(res, 405, {
            success: false,
            code: 'METHOD_NOT_ALLOWED',
            message: 'Método não permitido.'
        });
    }

    const resendApiKey = process.env.RESEND_API_KEY;
    const toEmail = process.env.CONTACT_TO_EMAIL;
    const fromEmail = process.env.CONTACT_FROM_EMAIL;
    const hcaptchaSecret = process.env.HCAPTCHA_SECRET;

    if (!resendApiKey || !toEmail || !fromEmail || !hcaptchaSecret) {
        return json(res, 500, {
            success: false,
            code: 'INTERNAL_ERROR',
            message: 'Serviço de contato não configurado.'
        });
    }

    const body = req.body && typeof req.body === 'object' ? req.body : {};
    const nome = normalize(body.nome);
    const email = normalize(body.email).toLowerCase();
    const celular = normalize(body.celular);
    const mensagem = normalize(body.mensagem);
    const captchaToken = normalize(body.captchaToken);
    const honey = normalize(body._honey);

    if (honey) {
        return json(res, 403, {
            success: false,
            code: 'SPAM_DETECTED',
            message: 'Solicitação bloqueada.'
        });
    }

    const celularDigits = onlyDigits(celular);
    if (
        nome.length < 3 ||
        !isValidEmail(email) ||
        celularDigits.length < 10 ||
        celularDigits.length > 11 ||
        mensagem.length < 10 ||
        !captchaToken
    ) {
        return json(res, 400, {
            success: false,
            code: 'VALIDATION_ERROR',
            message: 'Preencha todos os campos corretamente antes de enviar.'
        });
    }

    let captchaOk = false;
    try {
        const ip = req.headers['x-forwarded-for'] || req.socket?.remoteAddress || '';
        captchaOk = await validateCaptcha(captchaToken, hcaptchaSecret, String(ip));
    } catch (error) {
        captchaOk = false;
    }

    if (!captchaOk) {
        return json(res, 403, {
            success: false,
            code: 'SPAM_DETECTED',
            message: 'Falha na validação do captcha. Tente novamente.'
        });
    }

    const resend = new Resend(resendApiKey);

    try {
        const assunto = `Novo contato no site: ${nome}`;
        const now = new Date().toLocaleString('pt-BR', { timeZone: 'America/Sao_Paulo' });
        const safeNome = escapeHtml(nome);
        const safeEmail = escapeHtml(email);
        const safeCelular = escapeHtml(celular);
        const safeMensagem = escapeHtml(mensagem).replace(/\n/g, '<br/>');
        const safeNow = escapeHtml(now);

        await resend.emails.send({
            from: fromEmail,
            to: [toEmail],
            replyTo: email,
            subject: assunto,
            html: `
                <h2>Novo contato recebido</h2>
                <p><strong>Nome:</strong> ${safeNome}</p>
                <p><strong>E-mail:</strong> ${safeEmail}</p>
                <p><strong>Celular:</strong> ${safeCelular}</p>
                <p><strong>Mensagem:</strong></p>
                <p>${safeMensagem}</p>
                <hr/>
                <p><small>Enviado em: ${safeNow}</small></p>
            `
        });

        return json(res, 200, {
            success: true,
            message: 'Mensagem enviada com sucesso.'
        });
    } catch (error) {
        return json(res, 500, {
            success: false,
            code: 'INTERNAL_ERROR',
            message: 'Não foi possível enviar no momento. Tente novamente em instantes.'
        });
    }
};
