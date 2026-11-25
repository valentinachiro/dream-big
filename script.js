
(() => {
    // Evita ejecutar el mismo script dos veces
    if (window.__martyScriptLoaded) return;
    window.__martyScriptLoaded = true;

    // ELEMENTOS DE LA PÁGINA
    const btnMarty = document.getElementById('btn-marty');
    const btnKoto = document.getElementById('btn-koto');
    const popup = document.getElementById('popup');
    const cerrar = document.getElementById('cerrar-popup');
    const poll = document.getElementById('poll');

    // PORCENTAJES
    const PCT_MARTY = 73;
    const PCT_KOTO = 27;

    function contar(idTexto, hasta) {
        const texto = document.getElementById(idTexto);
        if (!texto) return;

        let actual = 0;
        const timer = setInterval(function () {
            actual++;
            texto.textContent = actual + '%';

            if (actual >= hasta) {
                clearInterval(timer);
            }
        }, 20);
    }

    function mostrarPoll() {
        if (!poll) return;

        poll.classList.add('visible');

        const barraMarty = document.getElementById('barra-marty');
        const barraKoto = document.getElementById('barra-koto');

        if (barraMarty) barraMarty.style.width = PCT_MARTY + '%';
        if (barraKoto) barraKoto.style.width = PCT_KOTO + '%';

        contar('pct-marty', PCT_MARTY);
        contar('pct-koto', PCT_KOTO);
    }

    function apostar(botonElegido) {
        if (btnMarty) btnMarty.disabled = true;
        if (btnKoto) btnKoto.disabled = true;

        botonElegido.classList.add('elegido');

        if (popup) popup.classList.add('visible');
    }

    function cerrarPopup() {
        if (popup) popup.classList.remove('visible');
        mostrarPoll();
    }

    if (btnMarty) {
        btnMarty.addEventListener('click', function () {
            apostar(btnMarty);
        });
    }

    if (btnKoto) {
        btnKoto.addEventListener('click', function () {
            apostar(btnKoto);
        });
    }

    if (cerrar) {
        cerrar.addEventListener('click', cerrarPopup);
    }

    // ANIMACIÓN ROAD TO JAPAN
    const barra = document.getElementById('barra-progreso');
    const zeppelin = document.getElementById('zeppelin');
    const porcentaje = document.getElementById('porcentaje-viaje');

    const porcentajeFinal = 64.5;
    let animacionIniciada = false;

    function animarViaje() {
        if (!barra || !zeppelin || !porcentaje) return;

        barra.style.width = porcentajeFinal + '%';
        zeppelin.style.left = porcentajeFinal + '%';
        porcentaje.style.left = porcentajeFinal + '%';

        let actual = 0;

        const contador = setInterval(function () {
            actual += 0.5;

            if (actual >= porcentajeFinal) {
                actual = porcentajeFinal;
                clearInterval(contador);
            }

            porcentaje.textContent = actual.toFixed(1) + '%';
        }, 20);
    }

    const seccionJapan = document.getElementById('japan');

    if (seccionJapan && 'IntersectionObserver' in window) {
        const observador = new IntersectionObserver(function (entradas) {
            entradas.forEach(function (entrada) {
                if (entrada.isIntersecting && !animacionIniciada) {
                    animacionIniciada = true;
                    animarViaje();
                }
            });
        }, { threshold: 0.3 });

        observador.observe(seccionJapan);
    }

    // BOLITA QUE SIGUE AL CURSOR
    const bolita = document.getElementById('bolita');

    let mouseX = 0;
    let mouseY = 0;
    let bolitaX = 0;
    let bolitaY = 0;
    let visible = false;

    document.addEventListener('mousemove', function (e) {
        mouseX = e.clientX;
        mouseY = e.clientY;

        if (bolita && !visible) {
            bolitaX = mouseX;
            bolitaY = mouseY;
            bolita.style.opacity = 1;
            visible = true;
        }
    });

    function seguir() {
        if (bolita) {
            bolitaX += (mouseX - bolitaX) * 0.15;
            bolitaY += (mouseY - bolitaY) * 0.15;

            bolita.style.transform =
                'translate(' + (bolitaX - 15) + 'px, ' +
                (bolitaY - 15) + 'px)';
        }

        requestAnimationFrame(seguir);
    }

    seguir();

    // CARRUSEL DE FOTOS DE MARTY
    const fotosMarty = [
        'images/chosenone.png',
        'images/marty2.png',
        'images/marty3.png',
        'images/marty4.png'
    ];

    const fotoMarty = document.getElementById('foto-marty');
    const anterior = document.getElementById('anterior');
    const siguiente = document.getElementById('siguiente');

    let fotoActual = 0;

    function cambiarFoto(direccion) {
        if (!fotoMarty) return;

        fotoActual += direccion;

        if (fotoActual >= fotosMarty.length) {
            fotoActual = 0;
        }

        if (fotoActual < 0) {
            fotoActual = fotosMarty.length - 1;
        }

        fotoMarty.style.opacity = 0;

        setTimeout(function () {
            fotoMarty.src = fotosMarty[fotoActual];
            fotoMarty.style.opacity = 1;
        }, 250);
    }

    if (anterior) {
        anterior.addEventListener('click', function () {
            cambiarFoto(-1);
        });
    }

    if (siguiente) {
        siguiente.addEventListener('click', function () {
            cambiarFoto(1);
        });
    }

    if (fotoMarty) {
        setInterval(function () {
            cambiarFoto(1);
        }, 3000);
    }

    // PELOTITAS QUE CAEN
    const zonaPelotas = document.getElementById('zona-pelotas');
    const botonPelota = document.getElementById('pelota-boton');
    const botonCerrarPelotas = document.getElementById('cerrar-pelotas');

    const TAMANO = window.innerWidth < 600 ? 40 : 60;
    const GRAVEDAD = 0.5;
    const REBOTE = 0.75;
    const MAXIMO = 120;
    const RADIO_MOUSE = 150;
    const FUERZA_MOUSE = 6;
    const VEL_MAX = 35;

    let pelotas = [];
    let moviendo = false;
    let mouseAntesX = 0;
    let mouseAntesY = 0;
    let animacionPelotas = null;

    function soltarPelotas() {
        if (!zonaPelotas || !botonCerrarPelotas) return;
        if (pelotas.length >= MAXIMO) return;

        for (let i = 0; i < 40 && pelotas.length < MAXIMO; i++) {
            const img = document.createElement('img');

            img.src = './images/pelotaqcae.png';
            img.className = 'pelota-cayendo';
            img.style.width = TAMANO + 'px';

            zonaPelotas.appendChild(img);

            pelotas.push({
                elemento: img,
                x: Math.random() * (window.innerWidth - TAMANO),
                y: -TAMANO - Math.random() * 700,
                vx: (Math.random() - 0.5) * 6,
                vy: 0,
                giro: 0
            });
        }

        botonCerrarPelotas.classList.add('visible');

        if (!moviendo) {
            moviendo = true;
            mouseAntesX = mouseX;
            mouseAntesY = mouseY;
            moverPelotas();
        }
    }

    function moverPelotas() {
        if (pelotas.length === 0) {
            moviendo = false;
            animacionPelotas = null;
            return;
        }

        const mouseVX = mouseX - mouseAntesX;
        const mouseVY = mouseY - mouseAntesY;

        mouseAntesX = mouseX;
        mouseAntesY = mouseY;

        pelotas.forEach(function (p) {
            p.vy += GRAVEDAD;

            // EL MOUSE EMPUJA LAS PELOTITAS
            const dx = (p.x + TAMANO / 2) - mouseX;
            const dy = (p.y + TAMANO / 2) - mouseY;
            const distancia = Math.sqrt(dx * dx + dy * dy);

            if (distancia < RADIO_MOUSE && distancia > 0) {
                const fuerza = (RADIO_MOUSE - distancia) / RADIO_MOUSE;

                p.vx += (dx / distancia) * fuerza * FUERZA_MOUSE
                    + mouseVX * fuerza * 0.5;

                p.vy += (dy / distancia) * fuerza * FUERZA_MOUSE
                    + mouseVY * fuerza * 0.5;
            }

            p.vx = Math.max(-VEL_MAX, Math.min(VEL_MAX, p.vx));
            p.vy = Math.max(-VEL_MAX, Math.min(VEL_MAX, p.vy));

            p.x += p.vx;
            p.y += p.vy;

            // REBOTE EN EL SUELO
            const suelo = window.innerHeight - TAMANO;

            if (p.y > suelo) {
                p.y = suelo;
                p.vy = -p.vy * REBOTE;
                p.vx *= 0.98;

                if (Math.abs(p.vy) < 1.5) {
                    p.vy = 0;
                }
            }

            // REBOTE EN LAS PAREDES
            if (p.x < 0) {
                p.x = 0;
                p.vx = -p.vx * REBOTE;
            }

            if (p.x > window.innerWidth - TAMANO) {
                p.x = window.innerWidth - TAMANO;
                p.vx = -p.vx * REBOTE;
            }

            p.giro += p.vx * 2;
        });

        // CHOQUES ENTRE PELOTITAS
        for (let i = 0; i < pelotas.length; i++) {
            for (let j = i + 1; j < pelotas.length; j++) {
                const a = pelotas[i];
                const b = pelotas[j];

                const dx = b.x - a.x;
                const dy = b.y - a.y;
                const dist = Math.sqrt(dx * dx + dy * dy);

                if (dist < TAMANO && dist > 0) {
                    const nx = dx / dist;
                    const ny = dy / dist;
                    const solape = (TAMANO - dist) / 2;

                    a.x -= nx * solape;
                    a.y -= ny * solape;
                    b.x += nx * solape;
                    b.y += ny * solape;

                    const va = a.vx * nx + a.vy * ny;
                    const vb = b.vx * nx + b.vy * ny;

                    if (va - vb > 0) {
                        const cambio = (va - vb) * 0.9;

                        a.vx -= cambio * nx;
                        a.vy -= cambio * ny;
                        b.vx += cambio * nx;
                        b.vy += cambio * ny;
                    }
                }
            }
        }

        // DIBUJAR PELOTITAS
        pelotas.forEach(function (p) {
            p.elemento.style.transform =
                'translate(' + p.x + 'px, ' + p.y + 'px) rotate(' +
                p.giro + 'deg)';
        });

        animacionPelotas = requestAnimationFrame(moverPelotas);
    }

    function cerrarPelotas() {
        pelotas.forEach(function (p) {
            p.elemento.remove();
        });

        pelotas = [];

        if (animacionPelotas !== null) {
            cancelAnimationFrame(animacionPelotas);
            animacionPelotas = null;
        }

        moviendo = false;

        if (botonCerrarPelotas) {
            botonCerrarPelotas.classList.remove('visible');
        }
    }

    if (botonPelota) {
        botonPelota.addEventListener('click', soltarPelotas);
    }

    if (botonCerrarPelotas) {
        botonCerrarPelotas.addEventListener('click', cerrarPelotas);
    }

    // MENÚ HAMBURGUESA
    const menuToggle = document.getElementById('menu-toggle');
    const menuNav = document.getElementById('menu-nav');

    if (menuToggle && menuNav) {
        menuToggle.addEventListener('click', function () {
            menuNav.classList.toggle('abierto');
            menuToggle.classList.toggle('abierto');

            const estaAbierto = menuNav.classList.contains('abierto');

            menuToggle.setAttribute('aria-expanded', estaAbierto);
            menuToggle.setAttribute(
                'aria-label',
                estaAbierto ? 'Cerrar menú' : 'Abrir menú'
            );
        });

        menuNav.querySelectorAll('a').forEach(function (enlace) {
            enlace.addEventListener('click', function () {
                menuNav.classList.remove('abierto');
                menuToggle.classList.remove('abierto');
                menuToggle.setAttribute('aria-expanded', 'false');
                menuToggle.setAttribute('aria-label', 'Abrir menú');
            });
        });
    }

    console.log('Script de Marty cargado correctamente');
})();
