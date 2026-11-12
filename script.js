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