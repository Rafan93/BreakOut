let joc = null;


// Persistència amb localStorage top 5
function getPuntuacions() {
    return JSON.parse(localStorage.getItem("breakout_puntuacions") || "[]");
}

function guardaPuntuacio(nom, punts) {
    let llista = getPuntuacions();
    llista.push({ nom, punts });
    llista.sort((a, b) => b.punts - a.punts);
    llista = llista.slice(0, 5);
    localStorage.setItem("breakout_puntuacions", JSON.stringify(llista));
}

function renderitzaRanking(selector) {
    const llista = getPuntuacions();
    if (llista.length === 0) {
        $(selector).html("<p class='text-muted'>Encara no hi ha puntuacions.</p>");
        return;
    }
    let html = "<ol class='ps-3 mb-0'>";
    for (const p of llista) {
        html += `<li>${p.nom} — <strong style="color:#4CF;">${p.punts}</strong></li>`;
    }
    html += "</ol>";
    $(selector).html(html);
}

$(document).ready(function () {

    let myCanvas = document.getElementById("joc");
    let ctx = myCanvas.getContext("2d");

    joc = new Joc(myCanvas, ctx);

    // Pantalla inicial visualització top 5
    renderitzaRanking("#ranking-menu");
});

function animacio() {
    if (joc.acabat) return;
    joc.update();
    requestAnimationFrame(animacio);
}

$(document).on("click", "#win-tornarBtn, #lose-tornarBtn", function () {
    location.reload();
});

//   MENÚ PRINCIPAL
let nivellSeleccionat = null;

// Selecció de nivell
$(".nivell-btn").on("click", function () {
    $(".nivell-btn").removeClass("active");
    $(this).addClass("active");
    nivellSeleccionat = $(this).data("nivell");
});

//Botó JUGAR
$("#jugarBtn").on("click", function () {

    let nom = $("#nomJugador").val();

    if (nom.trim() === "") {
        alert("Introdueix un nom!");
        return;
    }

    const nomsTop5 = getPuntuacions().map(p => p.nom.toLowerCase());
    if (nomsTop5.includes(nom.trim().toLowerCase())) {
        alert(`El nom "${nom.trim()}" ja és al TOP 5! Utilitza un nom diferent.`);
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

    // Mostrar joc
    $("#principal").fadeIn(300);

    // Arranca el joc
    joc.inicialitza(nivellSeleccionat, nom);
    animacio();
});


