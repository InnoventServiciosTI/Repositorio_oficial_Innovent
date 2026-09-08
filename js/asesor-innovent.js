document.addEventListener("DOMContentLoaded", () => {

    /* =========================================================
       TABOTI - ASESOR VIRTUAL
       UX / UI + RESPONSIVE + INTERACCIONES
    ========================================================= */

    const chat = document.getElementById("chatbox");
    const chatToggle = document.getElementById("chat-toggle");
    const chatClose = document.getElementById("chat-close");
    const chatMessages = document.getElementById("chat-messages");
    const input = document.getElementById("input");

    const sendButton =
        document.getElementById("chat-send") ||
        document.querySelector("#chat-input button");

    const planButtons =
        document.querySelectorAll(".btn-plan");

    /* =========================================================
       CONFIGURACIÓN
    ========================================================= */

    const whatsappURL =
        "https://wa.me/573012041255?text=Hola%20Taboti%2C%20quiero%20más%20información%20sobre%20los%20servicios%20de%20Innovent.";

    let chatInitialized = false;
    let isTyping = false;
    let responseTimer = null;

    /* =========================================================
       ESTADO INICIAL
    ========================================================= */

    if (chat) {
        chat.setAttribute("aria-hidden", "true");
    }

    if (chatToggle) {
        chatToggle.setAttribute("aria-expanded", "false");
    }

    /* =========================================================
       ABRIR CHAT
    ========================================================= */

    function openChat() {

        if (!chat) return;

        chat.classList.add("active");
        chat.classList.add("open");

        chat.setAttribute("aria-hidden", "false");

        chatToggle?.classList.add("active");

        chatToggle?.setAttribute(
            "aria-expanded",
            "true"
        );

        document.body.classList.add(
            "taboti-open"
        );

        if (!chatInitialized) {
            initChat();
        }

        setTimeout(() => {
            input?.focus();
        }, 350);

    }

    /* =========================================================
       CERRAR CHAT
    ========================================================= */

    function closeChat() {

        if (!chat) return;

        chat.classList.remove("active");
        chat.classList.remove("open");

        chat.setAttribute("aria-hidden", "true");

        chatToggle?.classList.remove("active");

        chatToggle?.setAttribute(
            "aria-expanded",
            "false"
        );

        document.body.classList.remove(
            "taboti-open"
        );

        input?.blur();

    }

    /* =========================================================
       TOGGLE
    ========================================================= */

    chatToggle?.addEventListener(
        "click",
        (event) => {

            event.preventDefault();
            event.stopPropagation();

            if (
                chat?.classList.contains("active")
            ) {
                closeChat();
            } else {
                openChat();
            }

        }
    );

    /* =========================================================
       BOTÓN CERRAR
    ========================================================= */

    chatClose?.addEventListener(
        "click",
        (event) => {

            event.preventDefault();
            event.stopPropagation();

            closeChat();

        }
    );

    /* =========================================================
       CERRAR AL HACER CLICK FUERA
    ========================================================= */

    document.addEventListener(
        "click",
        (event) => {

            if (!chat) return;

            if (
                chat.classList.contains("active") &&
                !chat.contains(event.target) &&
                !chatToggle?.contains(event.target)
            ) {

                closeChat();

            }

        }
    );

    /* =========================================================
       ESC PARA CERRAR
    ========================================================= */

    document.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Escape" &&
                chat?.classList.contains("active")
            ) {

                closeChat();

            }

        }
    );

    /* =========================================================
       MENSAJE DE BIENVENIDA
    ========================================================= */

    function initChat() {

        if (!chatMessages) return;

        chatMessages.innerHTML = "";

        chatInitialized = true;

        showTyping();

        setTimeout(() => {

            hideTyping();

            appendMessage(
                "bot",
                `
                <div class="taboti-welcome">

                    <div class="taboti-welcome-title">
                        👋 ¡Hola! Soy <strong>Taboti</strong>
                    </div>

                    <div class="taboti-welcome-text">
                        Tu asesor virtual de
                        <strong>Innovent Servicios TI</strong>.
                    </div>

                    <div class="taboti-welcome-text">
                        Estoy aquí para ayudarte a encontrar
                        una solución tecnológica que realmente
                        se adapte a las necesidades de tu negocio.
                    </div>

                    <div class="taboti-question">
                        ¿Qué estás buscando?
                    </div>

                </div>
                `
            );

            setTimeout(() => {
                showOptions();
            }, 250);

        }, 850);

    }

    /* =========================================================
       OPCIONES INICIALES
    ========================================================= */

    function showOptions() {

        if (!chatMessages) return;

        const existing =
            chatMessages.querySelector(
                ".taboti-options"
            );

        if (existing) {
            existing.remove();
        }

        const options =
            document.createElement("div");

        options.className =
            "taboti-options";

        options.innerHTML = `

            <button
                type="button"
                data-option="web"
            >
                <span class="option-icon">💻</span>
                <span>
                    <strong>Desarrollo web</strong>
                    <small>Crear o mejorar tu sitio web</small>
                </span>
            </button>

            <button
                type="button"
                data-option="soporte"
            >
                <span class="option-icon">⚙️</span>
                <span>
                    <strong>Soporte técnico</strong>
                    <small>Resolver problemas tecnológicos</small>
                </span>
            </button>

            <button
                type="button"
                data-option="seguridad"
            >
                <span class="option-icon">🔐</span>
                <span>
                    <strong>Ciberseguridad</strong>
                    <small>Proteger equipos e información</small>
                </span>
            </button>

            <button
                type="button"
                data-option="consultoria"
            >
                <span class="option-icon">🤝</span>
                <span>
                    <strong>Consultoría TI</strong>
                    <small>Optimizar procesos tecnológicos</small>
                </span>
            </button>

        `;

        chatMessages.appendChild(options);

        const buttons =
            options.querySelectorAll("button");

        buttons.forEach(
            (button) => {

                button.addEventListener(
                    "click",
                    () => {

                        button.classList.add(
                            "selected"
                        );

                        buttons.forEach(
                            btn => {
                                btn.disabled = true;
                            }
                        );

                        handleOption(
                            button.dataset.option
                        );

                    }
                );

            }
        );

        scrollChat();

    }

    /* =========================================================
       RESPUESTAS
    ========================================================= */

    const responses = {

        web: {

            user:
                "💻 Estoy interesado en desarrollo web.",

            messages: [

                `Perfecto. Podemos ayudarte con eso.`,

                `
                En <strong>Innovent</strong> desarrollamos
                sitios web modernos, adaptados a celulares
                y pensados no solamente para verse bien,
                sino también para ayudarte a conseguir clientes
                y presentar mejor tu negocio.
                `,

                `
                Para orientarte mejor, dime algo:
                ¿ya tienes una página web o estaríamos
                comenzando desde cero?
                `

            ]

        },

        soporte: {

            user:
                "⚙️ Necesito soporte técnico.",

            messages: [

                `Claro, podemos ayudarte con eso.`,

                `
                Nuestro servicio de
                <strong>Soporte Técnico</strong> está pensado
                para resolver problemas de computadores,
                software, configuración, mantenimiento
                y otros inconvenientes tecnológicos.
                `,

                `
                Para entender mejor tu caso:
                ¿tienes un problema que necesitas solucionar
                ahora mismo o buscas un servicio de
                mantenimiento periódico?
                `

            ]

        },

        seguridad: {

            user:
                "🔐 Quiero información sobre ciberseguridad.",

            messages: [

                `
                Muy buena decisión.
                La seguridad tecnológica es cada vez
                más importante para cualquier negocio.
                `,

                `
                En <strong>Innovent</strong> podemos ayudarte
                a identificar riesgos y mejorar la protección
                de tus equipos, cuentas y sistemas.
                `,

                `
                ¿Lo que más te preocupa es proteger
                la información de tu negocio, tus equipos
                o tus cuentas digitales?
                `

            ]

        },

        consultoria: {

            user:
                "🤝 Estoy interesado en consultoría TI.",

            messages: [

                `
                Claro. En este caso podemos analizar
                primero lo que está sucediendo en tu negocio.
                `,

                `
                La <strong>Consultoría TI</strong> nos permite
                identificar procesos que pueden mejorarse
                y recomendar herramientas, automatizaciones
                o soluciones tecnológicas.
                `,

                `
                ¿Hay algún proceso de tu negocio que
                actualmente te esté quitando demasiado tiempo
                o que quieras automatizar?
                `

            ]

        }

    };

    /* =========================================================
       PROCESAR OPCIÓN
    ========================================================= */

    function handleOption(option) {

        const data = responses[option];

        if (!data) return;

        appendMessage(
            "user",
            data.user
        );

        showTyping();

        clearTimeout(responseTimer);

        responseTimer =
            setTimeout(
                () => {

                    hideTyping();

                    sendMessagesSequentially(
                        data.messages
                    );

                },
                800
            );

    }

    /* =========================================================
       MENSAJES SECUENCIALES
    ========================================================= */

    function sendMessagesSequentially(
        messages,
        index = 0
    ) {

        if (
            !messages ||
            index >= messages.length
        ) {

            setTimeout(
                () => {
                    showWhatsAppButton();
                },
                400
            );

            return;

        }

        appendMessage(
            "bot",
            messages[index]
        );

        const textLength =
            messages[index].length;

        let delay = 650;

        if (textLength > 180) {
            delay = 1100;
        } else if (textLength > 100) {
            delay = 850;
        }

        setTimeout(
            () => {

                if (
                    index + 1 <
                    messages.length
                ) {

                    showTyping();

                    setTimeout(
                        () => {

                            hideTyping();

                            sendMessagesSequentially(
                                messages,
                                index + 1
                            );

                        },
                        500
                    );

                } else {

                    sendMessagesSequentially(
                        messages,
                        index + 1
                    );

                }

            },
            delay
        );

    }

    /* =========================================================
       AGREGAR MENSAJE
    ========================================================= */

    function appendMessage(
        sender,
        text
    ) {

        if (!chatMessages) return;

        const message =
            document.createElement("div");

        message.className =
            sender === "bot"
                ? "message bot-message"
                : "message user-message";

        message.innerHTML = text;

        chatMessages.appendChild(
            message
        );

        scrollChat();

    }

    /* =========================================================
       INDICADOR DE ESCRITURA
    ========================================================= */

    function showTyping() {

        if (!chatMessages) return;

        removeTyping();

        isTyping = true;

        const typing =
            document.createElement("div");

        typing.id =
            "taboti-typing";

        typing.className =
            "message bot-message typing-message";

        typing.innerHTML = `

            <div class="typing-content">

                <span class="typing-name">
                    Taboti
                </span>

                <span class="typing-text">
                    está escribiendo
                </span>

                <span class="typing-dots">
                    <i></i>
                    <i></i>
                    <i></i>
                </span>

            </div>

        `;

        chatMessages.appendChild(
            typing
        );

        scrollChat();

    }

    function hideTyping() {

        isTyping = false;

        removeTyping();

    }

    function removeTyping() {

        const typing =
            document.getElementById(
                "taboti-typing"
            );

        typing?.remove();

    }

    /* =========================================================
       BOTÓN WHATSAPP
    ========================================================= */

    function showWhatsAppButton() {

        if (!chatMessages) return;

        const existing =
            chatMessages.querySelector(
                ".whatsapp-contact"
            );

        if (existing) return;

        const container =
            document.createElement("div");

        container.className =
            "whatsapp-contact";

        container.innerHTML = `

            <div class="whatsapp-icon">
                💬
            </div>

            <div class="whatsapp-content">

                <strong>
                    ¿Necesitas atención personalizada?
                </strong>

                <p>
                    Nuestro equipo puede revisar
                    tu caso y ayudarte directamente.
                </p>

            </div>

            <button
                type="button"
                class="whatsapp-btn"
            >
                Hablar con Innovent
                <span>→</span>
            </button>

        `;

        chatMessages.appendChild(
            container
        );

        const button =
            container.querySelector(
                ".whatsapp-btn"
            );

        button?.addEventListener(
            "click",
            () => {

                window.open(
                    whatsappURL,
                    "_blank",
                    "noopener,noreferrer"
                );

            }
        );

        scrollChat();

    }

    /* =========================================================
       BOTONES DE PLANES
    ========================================================= */

    planButtons.forEach(
        (button) => {

            button.addEventListener(
                "click",
                () => {

                    const planName =
                        button.dataset.plan ||
                        button
                            .closest(".plan")
                            ?.querySelector("h3")
                            ?.textContent
                            ?.trim() ||
                        "este plan";

                    openChat();

                    setTimeout(
                        () => {

                            appendMessage(
                                "user",
                                `
                                👤 Me interesa el plan
                                <strong>
                                    ${escapeHTML(planName)}
                                </strong>.
                                `
                            );

                            showTyping();

                            setTimeout(
                                () => {

                                    hideTyping();

                                    appendMessage(
                                        "bot",
                                        `
                                        ¡Excelente elección!
                                        El plan
                                        <strong>
                                            ${escapeHTML(planName)}
                                        </strong>
                                        puede ser una buena alternativa
                                        dependiendo de lo que quieras
                                        lograr con tu negocio.
                                        `
                                    );

                                    setTimeout(
                                        () => {

                                            appendMessage(
                                                "bot",
                                                `
                                                Antes de recomendarte algo
                                                definitivamente, me gustaría
                                                conocer un poco mejor lo que
                                                necesitas.
                                                `
                                            );

                                            setTimeout(
                                                () => {

                                                    appendMessage(
                                                        "bot",
                                                        `
                                                        Así evitamos ofrecerte
                                                        algo que realmente no
                                                        sea útil para ti.
                                                        <br><br>
                                                        ¿Quieres que revisemos
                                                        juntos si este plan es
                                                        el más adecuado para
                                                        tu negocio?
                                                        `
                                                    );

                                                    showWhatsAppButton();

                                                },
                                                700
                                            );

                                        },
                                        750
                                    );

                                },
                                900
                            );

                        },
                        350
                    );

                }
            );

        }
    );

    /* =========================================================
       ENVÍO DE MENSAJE
    ========================================================= */

    function enviar() {

        if (!input) return;

        const text =
            input.value.trim();

        if (!text) return;

        if (isTyping) {
            return;
        }

        appendMessage(
            "user",
            escapeHTML(text)
        );

        input.value = "";

        updateSendButton();

        showTyping();

        clearTimeout(responseTimer);

        responseTimer =
            setTimeout(
                () => {

                    hideTyping();

                    generateHumanResponse(
                        text
                    );

                },
                800
            );

    }

    /* =========================================================
       RESPUESTAS INTELIGENTES BÁSICAS
    ========================================================= */

    function generateHumanResponse(text) {

        const message =
            normalizeText(text);

        let response = "";

        /* WEB */

        if (
            message.includes("web") ||
            message.includes("pagina") ||
            message.includes("sitio") ||
            message.includes("pagina web") ||
            message.includes("website")
        ) {

            response = `
                Entiendo. Si estás buscando una
                <strong>página web</strong>, podemos ayudarte
                a crear una solución profesional, responsive
                y adaptada a tu negocio.
                <br><br>
                Para recomendarte la opción correcta,
                ¿la necesitas principalmente para
                <strong>mostrar tus servicios, conseguir clientes
                o vender por internet</strong>?
            `;

        }

        /* SOPORTE */

        else if (
            message.includes("soporte") ||
            message.includes("computador") ||
            message.includes("computadora") ||
            message.includes("pc") ||
            message.includes("impresora") ||
            message.includes("laptop") ||
            message.includes("portatil") ||
            message.includes("problema") ||
            message.includes("mantenimiento")
        ) {

            response = `
                Claro, cuéntame qué problema estás teniendo
                y te orientaré sobre la mejor forma de solucionarlo.
                <br><br>
                Podemos revisar problemas de
                <strong>hardware, software, configuración,
                mantenimiento y soporte técnico</strong>.
                <br><br>
                ¿Qué está ocurriendo exactamente?
            `;

        }

        /* CIBERSEGURIDAD */

        else if (
            message.includes("seguridad") ||
            message.includes("hack") ||
            message.includes("hacker") ||
            message.includes("virus") ||
            message.includes("malware") ||
            message.includes("robo") ||
            message.includes("cuenta")
        ) {

            response = `
                Podemos ayudarte a revisar la seguridad
                tecnológica de tu negocio.
                <br><br>
                Cuéntame qué sucede y veremos si se trata
                de un problema relacionado con
                <strong>equipos, cuentas, información
                o accesos</strong>.
            `;

        }

        /* CONSULTORÍA */

        else if (
            message.includes("consultoria") ||
            message.includes("consultoría") ||
            message.includes("automatizar") ||
            message.includes("automatizacion") ||
            message.includes("proceso")
        ) {

            response = `
                Perfecto. Podemos analizar el proceso
                que quieres mejorar y determinar si puede
                optimizarse mediante tecnología,
                automatización o inteligencia artificial.
                <br><br>
                Cuéntame qué proceso quieres mejorar.
            `;

        }

        /* PRECIOS */

        else if (
            message.includes("precio") ||
            message.includes("costo") ||
            message.includes("cuanto") ||
            message.includes("vale") ||
            message.includes("valor") ||
            message.includes("tarifa")
        ) {

            response = `
                Claro. En Innovent contamos con diferentes
                soluciones y planes dependiendo de lo que
                necesites.
                <br><br>
                Para recomendarte algo adecuado,
                prefiero conocer primero un poco tu situación.
                Así evitamos que pagues por algo que realmente
                no necesitas.
                <br><br>
                ¿Qué servicio estás buscando?
            `;

        }

        /* WHATSAPP */

        else if (
            message.includes("whatsapp") ||
            message.includes("contactar") ||
            message.includes("persona") ||
            message.includes("asesor")
        ) {

            response = `
                Por supuesto. Puedes hablar directamente
                con nuestro equipo de Innovent.
            `;

            appendMessage(
                "bot",
                response
            );

            setTimeout(
                () => {
                    showWhatsAppButton();
                },
                400
            );

            return;

        }

        /* SALUDO */

        else if (
            message.includes("hola") ||
            message.includes("buenas") ||
            message.includes("buenos dias") ||
            message.includes("buenos tardes") ||
            message.includes("buenas tardes") ||
            message.includes("buenas noches")
        ) {

            response = `
                ¡Hola! Qué bueno tenerte por aquí.
                <br><br>
                Cuéntame tranquilamente qué necesitas
                y trataré de orientarte de la mejor manera.
            `;

        }

        /* AGRADECIMIENTO */

        else if (
            message.includes("gracias") ||
            message.includes("muchas gracias")
        ) {

            response = `
                Con mucho gusto.
                <br><br>
                Si necesitas cualquier otra cosa,
                aquí estaré para orientarte.
            `;

        }

        /* RESPUESTA GENERAL */

        else {

            response = `
                Entiendo lo que me comentas.
                <br><br>
                Para poder orientarte correctamente,
                cuéntame un poco más sobre lo que necesitas.
                <br><br>
                Puedes explicármelo con tus propias palabras,
                aunque no tengas conocimientos técnicos.
                <strong>Yo te ayudo a identificar la mejor opción.</strong>
            `;

        }

        appendMessage(
            "bot",
            response
        );

        setTimeout(
            () => {
                showWhatsAppButton();
            },
            600
        );

    }

    /* =========================================================
       NORMALIZAR TEXTO
    ========================================================= */

    function normalizeText(text) {

        return text
            .toLowerCase()
            .normalize("NFD")
            .replace(
                /[\u0300-\u036f]/g,
                ""
            );

    }

    /* =========================================================
       ENTER PARA ENVIAR
    ========================================================= */

    input?.addEventListener(
        "keydown",
        (event) => {

            if (
                event.key === "Enter" &&
                !event.shiftKey
            ) {

                event.preventDefault();

                enviar();

            }

        }
    );

    /* =========================================================
       BOTÓN ENVIAR
    ========================================================= */

    sendButton?.addEventListener(
        "click",
        (event) => {

            event.preventDefault();

            enviar();

        }
    );

    /* =========================================================
       ESTADO DEL BOTÓN ENVIAR
    ========================================================= */

    input?.addEventListener(
        "input",
        updateSendButton
    );

    function updateSendButton() {

        if (!sendButton || !input) return;

        const hasText =
            input.value.trim().length > 0;

        sendButton.classList.toggle(
            "ready",
            hasText
        );

        sendButton.disabled =
            !hasText;

    }

    updateSendButton();

    /* =========================================================
       SCROLL
    ========================================================= */

    function scrollChat() {

        if (!chatMessages) return;

        requestAnimationFrame(
            () => {

                chatMessages.scrollTo({
                    top:
                        chatMessages.scrollHeight,
                    behavior:
                        "smooth"
                });

            }
        );

    }

    /* =========================================================
       SEGURIDAD
    ========================================================= */

    function escapeHTML(text) {

        const div =
            document.createElement("div");

        div.textContent = text;

        return div.innerHTML;

    }

    /* =========================================================
       PREVENIR ZOOM ACCIDENTAL EN IOS
    ========================================================= */

    input?.addEventListener(
        "focus",
        () => {

            if (
                window.innerWidth <= 600
            ) {

                input.style.fontSize =
                    "16px";

            }

        }
    );

    input?.addEventListener(
        "blur",
        () => {

            if (
                window.innerWidth <= 600
            ) {

                input.style.fontSize =
                    "";

            }

        }
    );

    /* =========================================================
       AJUSTE CUANDO APARECE EL TECLADO MÓVIL + RESPONSIVE DE LA VENTANA EMERGENTE
    ========================================================= */

function updateTabotiViewport() {

    if (!chat) return;

    /*
       visualViewport permite obtener el espacio real
       disponible cuando aparece el teclado móvil.
    */

    const viewport = window.visualViewport;

    const viewportHeight = viewport
        ? viewport.height
        : window.innerHeight;

    const viewportWidth = viewport
        ? viewport.width
        : window.innerWidth;


    /*
       Guardamos las dimensiones en variables CSS.
       El CSS puede utilizarlas para adaptar la ventana.
    */

    document.documentElement.style.setProperty(
        "--taboti-vh",
        `${viewportHeight}px`
    );

    document.documentElement.style.setProperty(
        "--taboti-vw",
        `${viewportWidth}px`
    );


    /*
       Detectamos si estamos en dispositivo móvil.
    */

    const isMobile = viewportWidth <= 600;

    document.body.classList.toggle(
        "taboti-mobile",
        isMobile
    );


    /*
       Detectamos orientación.
    */

    document.body.classList.toggle(
        "taboti-landscape",
        viewportWidth > viewportHeight
    );


    /*
       Si el chat está abierto,
       reajustamos el scroll.
    */

    if (
        chat.classList.contains("active")
    ) {

        requestAnimationFrame(() => {

            scrollChat();

        });

    }

}

/* =========================================================
   ACTUALIZAR AL CARGAR
   ========================================================= */

updateTabotiViewport();

/* =========================================================
   CAMBIO DE TAMAÑO DE LA VENTANA
   ========================================================= */

window.addEventListener(
    "resize",
    updateTabotiViewport
);


/* =========================================================
   CAMBIO DE ORIENTACIÓN
   ========================================================= */

window.addEventListener(
    "orientationchange",
    () => {

        setTimeout(() => {

            updateTabotiViewport();

        }, 150);

    }
);


/* =========================================================
   VISUAL VIEWPORT
   Especialmente útil en celulares
   ========================================================= */

if (window.visualViewport) {

    window.visualViewport.addEventListener(
        "resize",
        updateTabotiViewport
    );

    window.visualViewport.addEventListener(
        "scroll",
        updateTabotiViewport
    );

}


/* =========================================================
   AJUSTE AL ABRIR EL CHAT
   ========================================================= */

const originalOpenChat = openChat;

openChat = function () {

    originalOpenChat();

    updateTabotiViewport();

    /*
       En móvil esperamos un poco para permitir
       que el navegador termine de calcular el viewport.
    */

    setTimeout(() => {

        updateTabotiViewport();

        scrollChat();

    }, 300);


    setTimeout(() => {

        updateTabotiViewport();

        scrollChat();

    }, 700);

};


/* =========================================================
   AJUSTE AL CERRAR
   ========================================================= */

const originalCloseChat = closeChat;

closeChat = function () {

    originalCloseChat();

    /*
       Recuperar dimensiones normales después
       de cerrar la ventana.
    */

    setTimeout(() => {

        updateTabotiViewport();

    }, 150);

};
```

    /* =========================================================
       EXPONER FUNCIÓN
    ========================================================= */

    window.enviar = enviar;

});
