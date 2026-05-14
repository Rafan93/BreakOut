//  APLICACIÓ
$(document).ready(function() {

    let myCanvas = document.getElementById("joc");
    let ctx = myCanvas.getContext("2d");

    joc = new Joc(myCanvas,ctx);
    joc.inicialitza();
    animacio();

});

function animacio() {
    joc.update();
    requestAnimationFrame(animacio);    
}

//   MENÚ PRINCIPAL (Bootstrap)
let nivellSeleccionat = null;

//  Selección de nivel
$(".nivell-btn").on("click", function () {
    $(".nivell-btn").removeClass("active");
    $(this).addClass("active");
    nivellSeleccionat = $(this).data("nivell");
});

//  Botón JUGAR
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

    //  Ocultar menú completamente
    $("#menu-principal").fadeOut(300, function () {
        $(this).remove(); //    Desaparece del DOM
    });

    //  Mostrar el juego
    $("#principal").fadeIn(300);
});
