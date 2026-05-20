//  APLICACIÓ
let joc = null;

$(document).ready(function () {

    let myCanvas = document.getElementById("joc");
    let ctx = myCanvas.getContext("2d");

    // Solo creamos el objeto, no arrancamos el juego
    joc = new Joc(myCanvas, ctx);
});

function animacio() {
    joc.update();
    requestAnimationFrame(animacio);
}

//   MENÚ PRINCIPAL
let nivellSeleccionat = null;

// Selección de nivel
$(".nivell-btn").on("click", function () {
    $(".nivell-btn").removeClass("active");
    $(this).addClass("active");
    nivellSeleccionat = $(this).data("nivell");
});

// Botón JUGAR
$("#jugarBtn").on("click", function () {

    let nom = $("#nomJugador").val();

    if (nom.trim() === "") {
        alert("Introdueix un nom!");
        return;
    }

    if (!nivellSeleccionat) {
        alert("Selecciona un nivell!");
        return;
    }

    // Ocultar menú
    $("#menu-principal").fadeOut(300, function () {
        $(this).remove();
    });

    // Mostrar juego
    $("#principal").fadeIn(300);

    // Ahora sí arrancamos el juego
    joc.inicialitza();
    animacio();
});
