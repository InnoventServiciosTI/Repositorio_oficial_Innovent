document.addEventListener("DOMContentLoaded", () => {

    const sliders = document.querySelectorAll("[data-slider]");

    sliders.forEach((slider) => {

        const container =
            slider.querySelector(".carousel-container");

        const track =
            slider.querySelector(".carousel-track");

        const cards =
            slider.querySelectorAll(".plan");

        const prev =
            slider.querySelector(".slider-prev");

        const next =
            slider.querySelector(".slider-next");

        const dotsContainer =
            slider.parentElement.querySelector(".slider-dots");


        let currentIndex = 0;


        /* ==========================================
           CREAR INDICADORES
        ========================================== */

        if (dotsContainer) {

            cards.forEach((card, index) => {

                const dot =
                    document.createElement("button");

                dot.className = "slider-dot";

                dot.type = "button";

                dot.setAttribute(
                    "aria-label",
                    `Mostrar plan ${index + 1}`
                );

                dot.addEventListener("click", () => {

                    currentIndex = index;

                    moveSlider();

                });

                dotsContainer.appendChild(dot);

            });

        }


        const dots =
            dotsContainer
                ? dotsContainer.querySelectorAll(".slider-dot")
                : [];


        /* ==========================================
           MOVER SLIDER
        ========================================== */

        function moveSlider() {

            /*
             * En móviles:
             * desplazamiento únicamente mediante
             * los botones.
             */

            if (window.innerWidth <= 800) {

                const card =
                    cards[currentIndex];

                if (card) {

                    container.scrollTo({

                        left:
                            card.offsetLeft -
                            container.offsetLeft,

                        behavior: "smooth"

                    });

                }

            }

            /*
             * En escritorio:
             * mover el track mediante transform.
             */

            else {

                const cardWidth =
                    cards[0].offsetWidth;

                const gap = 22;

                const position =
                    currentIndex *
                    (cardWidth + gap);

                track.style.transform =
                    `translateX(-${position}px)`;

            }


            updateDots();

        }


        /* ==========================================
           ACTUALIZAR DOT
        ========================================== */

        function updateDots() {

            dots.forEach((dot, index) => {

                dot.classList.toggle(
                    "active",
                    index === currentIndex
                );

            });

        }


        /* ==========================================
           SIGUIENTE
        ========================================== */

        function nextSlide() {

            if (currentIndex < cards.length - 1) {

                currentIndex++;

            } else {

                /*
                 * Regresa al primer plan
                 */

                currentIndex = 0;

            }

            moveSlider();

        }


        /* ==========================================
           ANTERIOR
        ========================================== */

        function previousSlide() {

            if (currentIndex > 0) {

                currentIndex--;

            } else {

                /*
                 * Regresa al último plan
                 */

                currentIndex =
                    cards.length - 1;

            }

            moveSlider();

        }


        /* ==========================================
           BOTÓN SIGUIENTE
        ========================================== */

        if (next) {

            next.addEventListener(
                "click",
                () => {

                    nextSlide();

                }
            );

        }


        /* ==========================================
           BOTÓN ANTERIOR
        ========================================== */

        if (prev) {

            prev.addEventListener(
                "click",
                () => {

                    previousSlide();

                }
            );

        }


        /* ==========================================
           RESPONSIVE
        ========================================== */

        window.addEventListener(
            "resize",
            () => {

                if (window.innerWidth <= 800) {

                    track.style.transform =
                        "none";

                } else {

                    moveSlider();

                }

            }
        );


        /* ==========================================
           INICIALIZAR
        ========================================== */

        updateDots();

    });

});