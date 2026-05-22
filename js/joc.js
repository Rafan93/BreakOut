/*
* CLASSE JOC
*/

class Joc {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.amplada = canvas.width;
        this.alcada = canvas.height;

        this.totxoamplada = 50;
        this.totxoalcada = 20;

        this.punts = 0;
        this.acabat = false;

        this.bola = new Bola(
            new Punt(this.canvas.width / 2, this.canvas.height / 2),
            6
        );
        this.bola.canvasAmplada = this.canvas.width;
        this.bola.canvasAlcada = this.canvas.height;

        this.pala = new Pala(
            new Punt((this.canvas.width - 80) / 2, this.canvas.height - 30),
            80,
            10
        );

        this.mur = new Mur(
            this.canvas.width,
            this.canvas.height,
            this.totxoamplada,
            this.totxoalcada
        );

        this.key = {
            LEFT: { code: 37, pressed: false },
            RIGHT: { code: 39, pressed: false }
        };

        this.configuraTeclat();
    }

    configuraTeclat() {
        $(document).on("keydown", (e) => {
            if (e.keyCode === this.key.LEFT.code)  this.key.LEFT.pressed  = true;
            if (e.keyCode === this.key.RIGHT.code) this.key.RIGHT.pressed = true;
        });

        $(document).on("keyup", (e) => {
            if (e.keyCode === this.key.LEFT.code)  this.key.LEFT.pressed  = false;
            if (e.keyCode === this.key.RIGHT.code) this.key.RIGHT.pressed = false;
        });
    }

    clearCanvas() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    dibuixaPunts() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "16px Arial";
        this.ctx.fillText("Punts: " + this.punts, 10, 20);
    }

    dibuixaRanking() {
        const llista = getPuntuacions();
        if (llista.length === 0) return;

        const millor = llista[0];
        const x = this.amplada - 145;

        this.ctx.fillStyle = "rgba(0,0,0,0.5)";
        this.ctx.fillRect(x - 5, 5, 145, 36);

        this.ctx.font = "bold 11px Arial";
        this.ctx.fillStyle = "#FFD700";
        this.ctx.fillText("RÈCORD", x, 18);

        this.ctx.font = "11px Arial";
        this.ctx.fillStyle = "white";
        this.ctx.fillText(`${millor.nom}  ${millor.punts}`, x, 33);
    }

    draw() {
        this.clearCanvas();
        this.mur.draw(this.ctx);
        this.pala.draw(this.ctx);
        this.bola.draw(this.ctx);
        this.dibuixaPunts();
        this.dibuixaRanking();
    }

    inicialitza(nivell, nom) {
        this.nom = nom;
        this.mur.nivellActual = nivell - 1;
        this.mur.generaMur();
        for (let i = 1; i < nivell; i++) {
            this.bola.vx *= 1.2;
            this.bola.vy *= 1.2;
        }
        this.draw();
    }

    update() {

        if (this.key.LEFT.pressed && this.pala.posicio.x > 0) {
            this.pala.mou(-this.pala.vx, 0);
        }

        if (this.key.RIGHT.pressed && this.pala.posicio.x + this.pala.amplada < this.amplada) {
            this.pala.mou(this.pala.vx, 0);
        }

        this.bola.update(this.pala, this.mur);

        if (this.bola.fora) {
            this.acabat = true;
            guardaPuntuacio(this.nom, this.punts);
            $("#lose-punts").text(this.punts);
            renderitzaRanking("#lose-ranking");
            $("#pantalla-lose").removeClass("d-none").addClass("d-flex");
            return;
        }

        this.pala.update();

        if (this.mur.estaNet()) {
            if (this.mur.seguentNivell()) {
                const factor = 1.2;
                this.bola.vx *= factor;
                this.bola.vy *= factor;
            } else {
                this.acabat = true;
                guardaPuntuacio(this.nom, this.punts);
                $("#win-punts").text(this.punts);
                renderitzaRanking("#win-ranking");
                $("#pantalla-win").removeClass("d-none").addClass("d-flex");
            }
        }

        this.draw();
    }
}
