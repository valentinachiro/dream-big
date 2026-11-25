// elementos de la página
const btnMarty = document.getElementById('btn-marty');
const btnKoto = document.getElementById('btn-koto');
const popup = document.getElementById('popup');
const cerrar = document.getElementById('cerrar-popup');
const poll = document.getElementById('poll');

// porcentajes inventados
const PCT_MARTY = 73;
const PCT_KOTO = 27;

// hace que el número suba de 0 hasta el porcentaje final
function contar(idTexto, hasta) {
    const texto = document.getElementById(idTexto);
    let actual = 0;
    const timer = setInterval(function () {
        actual = actual + 1;
        texto.textContent = actual + '%';
        if (actual >= hasta) {
            clearInterval(timer);
        }
    }, 20);
}

// muestra la encuesta y anima las barras
function mostrarPoll() {
    poll.classList.add('visible');
    document.getElementById('barra-marty').style.width = PCT_MARTY + '%';
    document.getElementById('barra-koto').style.width = PCT_KOTO + '%';
    contar('pct-marty', PCT_MARTY);
    contar('pct-koto', PCT_KOTO);
}

// cuando se aprieta un botón de apuesta
function apostar(botonElegido) {
    btnMarty.disabled = true;
    btnKoto.disabled = true;
    botonElegido.classList.add('elegido');
    popup.classList.add('visible');
}

// cuando se cierra el pop-up
function cerrarPopup() {
    popup.classList.remove('visible');
    mostrarPoll();
}

btnMarty.addEventListener('click', function () { apostar(btnMarty); });
btnKoto.addEventListener('click', function () { apostar(btnKoto); });
cerrar.addEventListener('click', cerrarPopup);

// ANIMACION ROAD TO JAPAN

const barra = document.getElementById('barra-progreso');
const zeppelin = document.getElementById('zeppelin');
const porcentaje = document.getElementById('porcentaje-viaje');

const porcentajeFinal = 64.5;
let animacionIniciada = false;

function animarViaje() {

    // La barra se llena
    barra.style.width = porcentajeFinal + '%';

    // El zeppelin avanza junto con la barra
    zeppelin.style.left = porcentajeFinal + '%';

    // El porcentaje acompaña al zeppelin
    porcentaje.style.left = porcentajeFinal + '%';

    // El número empieza a contar
    let actual = 0;

    const contador = setInterval(function () {

        actual = actual + 0.5;

        if (actual >= porcentajeFinal) {
            actual = porcentajeFinal;
            clearInterval(contador);
        }

        porcentaje.textContent = actual.toFixed(1) + '%';

    }, 20);
}

// Detecta cuando llegamos a Road to Japan
const observador = new IntersectionObserver(function (entradas) {

    entradas.forEach(function (entrada) {

        if (entrada.isIntersecting && animacionIniciada === false) {
            animacionIniciada = true;
            animarViaje();
        }

    });

}, { threshold: 0.3 });

observador.observe(document.getElementById('japan'));

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

    // la primera vez, aparece directamente donde está el mouse
    if (visible === false) {
        bolitaX = mouseX;
        bolitaY = mouseY;
        bolita.style.opacity = 1;
        visible = true;
    }
});

function seguir() {
    bolitaX = bolitaX + (mouseX - bolitaX) * 0.15;
    bolitaY = bolitaY + (mouseY - bolitaY) * 0.15;
    bolita.style.transform = 'translate(' + (bolitaX - 15) + 'px, ' + (bolitaY - 15) + 'px)';
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

// CAMBIA LA FOTO

function cambiarFoto(direccion) {
    fotoActual = fotoActual + direccion;

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

// FLECHAS

anterior.addEventListener('click', function () {
    cambiarFoto(-1);
});

siguiente.addEventListener('click', function () {
    cambiarFoto(1);
});

// CAMBIO AUTOMATICO CADA 3 SEGUNDOS

setInterval(function () {
    cambiarFoto(1);
}, 3000);


// PELOTITAS QUE CAEN
const zonaPelotas = document.getElementById('zona-pelotas');
const botonPelota = document.getElementById('pelota-boton');
const botonCerrarPelotas = document.getElementById('cerrar-pelotas');

const TAMANO = window.innerWidth < 600 ? 40 : 60;  // tamaño de cada pelotita
const GRAVEDAD = 0.5;      // qué tan rápido caen
const REBOTE = 0.75;       // 1 = rebota siempre igual, 0 = no rebota
const MAXIMO = 120;        // cantidad máxima en pantalla
const RADIO_MOUSE = 150;   // a qué distancia las afecta el mouse
const FUERZA_MOUSE = 6;    // qué tan fuerte las empuja
const VEL_MAX = 35;        // velocidad máxima, para que no salgan disparadas

let pelotas = [];
let moviendo = false;
let mouseAntesX = 0;
let mouseAntesY = 0;

function soltarPelotas() {
    if (pelotas.length >= MAXIMO) {
        return;
    }

    for (let i = 0; i < 40; i++) {
        const img = document.createElement('img');
        img.src = './images/pelotaqcae.png';
        img.className = 'pelota-cayendo';
        img.style.width = TAMANO + 'px';
        zonaPelotas.appendChild(img);

        pelotas.push({
            elemento: img,
            x: Math.random() * (window.innerWidth - TAMANO),
            y: -TAMANO - Math.random() * 700,   // arrancan arriba de la pantalla, a distintas alturas
            vx: (Math.random() - 0.5) * 6,
            vy: 0,
            giro: 0
        });
    }

    botonCerrarPelotas.classList.add('visible');

    if (moviendo === false) {
        moviendo = true;
        mouseAntesX = mouseX;
        mouseAntesY = mouseY;
        moverPelotas();
    }
}

function moverPelotas() {
    // qué tan rápido se está moviendo el mouse
    const mouseVX = mouseX - mouseAntesX;
    const mouseVY = mouseY - mouseAntesY;
    mouseAntesX = mouseX;
    mouseAntesY = mouseY;

    pelotas.forEach(function (p) {
        p.vy = p.vy + GRAVEDAD;

        // el mouse empuja a las pelotitas que están cerca
        const dx = (p.x + TAMANO / 2) - mouseX;
        const dy = (p.y + TAMANO / 2) - mouseY;
        const distancia = Math.sqrt(dx * dx + dy * dy);
        if (distancia < RADIO_MOUSE && distancia > 0) {
            const fuerza = (RADIO_MOUSE - distancia) / RADIO_MOUSE;
            p.vx = p.vx + (dx / distancia) * fuerza * FUERZA_MOUSE + mouseVX * fuerza * 0.5;
            p.vy = p.vy + (dy / distancia) * fuerza * FUERZA_MOUSE + mouseVY * fuerza * 0.5;
        }

        // límite de velocidad para que no salgan disparadas
        p.vx = Math.max(-VEL_MAX, Math.min(VEL_MAX, p.vx));
        p.vy = Math.max(-VEL_MAX, Math.min(VEL_MAX, p.vy));

        p.x = p.x + p.vx;
        p.y = p.y + p.vy;

        // rebote en el suelo
        const suelo = window.innerHeight - TAMANO;
        if (p.y > suelo) {
            p.y = suelo;
            p.vy = -p.vy * REBOTE;
            p.vx = p.vx * 0.98;
            if (Math.abs(p.vy) < 1.5) {
                p.vy = 0;
            }
        }

        // rebote en las paredes
        if (p.x < 0) {
            p.x = 0;
            p.vx = -p.vx * REBOTE;
        }
        if (p.x > window.innerWidth - TAMANO) {
            p.x = window.innerWidth - TAMANO;
            p.vx = -p.vx * REBOTE;
        }

        p.giro = p.giro + p.vx * 2;
    });

    // choques entre pelotitas
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

                // las separo para que no se superpongan
                a.x = a.x - nx * solape;
                a.y = a.y - ny * solape;
                b.x = b.x + nx * solape;
                b.y = b.y + ny * solape;

                // se intercambian la velocidad con la que chocan
                const va = a.vx * nx + a.vy * ny;
                const vb = b.vx * nx + b.vy * ny;
                if (va - vb > 0) {
                    const cambio = (va - vb) * 0.9;
                    a.vx = a.vx - cambio * nx;
                    a.vy = a.vy - cambio * ny;
                    b.vx = b.vx + cambio * nx;
                    b.vy = b.vy + cambio * ny;
                }
            }
        }
    }

    // dibujo cada pelotita en su posición
    pelotas.forEach(function (p) {
        p.elemento.style.transform = 'translate(' + p.x + 'px, ' + p.y + 'px) rotate(' + p.giro + 'deg)';
    });

    requestAnimationFrame(moverPelotas);
}

function cerrarPelotas() {
    pelotas.forEach(function (p) {
        p.elemento.remove();
    });
    pelotas = [];
    botonCerrarPelotas.classList.remove('visible');
}

botonPelota.addEventListener('click', soltarPelotas);
botonCerrarPelotas.addEventListener('click', cerrarPelotas);

console.log("Botón de pelotitas conectado");
botonPelota.addEventListener('click', function () {
    console.log("Se hizo clic en el botón");
});


const menuToggle = document.getElementById("menu-toggle");
const menuNav = document.getElementById("menu-nav");

menuToggle.addEventListener("click", function () {
    menuNav.classList.toggle("abierto");
    menuToggle.classList.toggle("abierto");

    const estaAbierto = menuNav.classList.contains("abierto");

    menuToggle.setAttribute("aria-expanded", estaAbierto);
    menuToggle.setAttribute(
        "aria-label",
        estaAbierto ? "Cerrar menú" : "Abrir menú"
    );
});

// Cerrar el menú al seleccionar una sección

menuNav.querySelectorAll("a").forEach(function (enlace) {
    enlace.addEventListener("click", function () {
        menuNav.classList.remove("abierto");
        menuToggle.classList.remove("abierto");
        menuToggle.setAttribute("aria-expanded", "false");
        menuToggle.setAttribute("aria-label", "Abrir menú");
    });
});

