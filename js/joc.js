class Joc {
    constructor(canvas, ctx) {
        this.canvas = canvas;
        this.ctx = ctx;
        this.amplada = canvas.width;
        this.alcada = canvas.height;

        this.totxoamplada = 50;
        this.totxoalcada = 20;

        this.punts = 0;
        this.vides = 3;
        this.acabat = false;

        this.soColissio = new Audio('so/burbuja.mp3');
        this.soPerdreVida = new Audio('so/perdrevida.mp3')
        this.soPerdre = new Audio('so/spongebob-fail.mp3')
        this.soGuanyar = new Audio('so/victory_fanfare.mp3')
        this.soMur = new Audio('so/Mur.mp3');

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

        this.imatgesFons = {};
        for (const niv of this.mur.nivells) {
            if (niv.imatgeFons && !this.imatgesFons[niv.imatgeFons]) {
                const img = new Image();
                img.src = niv.imatgeFons;
                this.imatgesFons[niv.imatgeFons] = img;
            }
        }

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
        const def = this.mur.nivells[this.mur.nivellActual];
        if (def.imatgeFons) {
            document.body.style.backgroundImage = `url('${def.imatgeFons}')`;
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        } else {
            document.body.style.backgroundImage = "";
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
        }
    }

    //Puntuació actual
    dibuixaPunts() {
        this.ctx.fillStyle = "white";
        this.ctx.font = "16px Arial";
        this.ctx.fillText("Punts: " + this.punts, 10, 20);
    }

    // Vides restants
    dibuixaVides() {
        this.ctx.font = "20px Arial";
        for (let i = 0; i < 3; i++) {
            const emoji = i < this.vides ? "❤️" : "🖤";
            this.ctx.fillText(emoji, this.amplada - 78 + i * 26, 20);
        }
    }

    // Millor top
    dibuixaRanking() {
        const llista = getPuntuacions();
        if (llista.length === 0) return;

        const millor = llista[0];
        this.ctx.fillStyle = "white";
        this.ctx.font = "16px Arial";
        this.ctx.fillText(`Rècord: ${millor.nom} ${millor.punts}`, 150, 20);
    }

    draw() {
        const def = this.mur.nivells[this.mur.nivellActual];
        this.pala.color = def.colorPala || "#D30";
        this.bola.color = def.colorBola || "#fff";
        this.clearCanvas();
        this.mur.draw(this.ctx);
        this.pala.draw(this.ctx);
        this.bola.draw(this.ctx);
        this.dibuixaPunts();
        this.dibuixaRanking();
        this.dibuixaVides();
    }

    inicialitza(nivell, nom) {
        this.nom = nom;
        this.mur.nivellActual = nivell - 1;
        this.mur.generaMur();
        for (let i = 1; i < nivell; i++) {
            this.bola.vx *= 1.2;
            this.bola.vy *= 1.2;
        }
        const defInicial = this.mur.nivells[this.mur.nivellActual];
        if (defInicial.velocitatPala) this.pala.vx = defInicial.velocitatPala;
        this.esperant = true;
        this.tempsInici = Date.now();
        this.draw();
    }

    update() {

        if (this.key.LEFT.pressed && this.pala.posicio.x > 0) {
            this.pala.mou(-this.pala.vx, 0);
        }

        if (this.key.RIGHT.pressed && this.pala.posicio.x + this.pala.amplada < this.amplada) {
            this.pala.mou(this.pala.vx, 0);
        }

        if (this.esperant) {
            if (Date.now() - this.tempsInici < 1500) {
                this.draw();
                return;
            }
            this.esperant = false;
        }

        this.bola.update(this.pala, this.mur);

        // Perdre vida quan cau la bola
        if (this.bola.fora) {
            this.vides--;
            this.bola.fora = false;

            // Game over
            if (this.vides <= 0) {
                this.acabat = true;
                this.draw();
                this.reproduirSo(this.soPerdre);
                guardaPuntuacio(this.nom, this.punts);
                $("#lose-punts").text(this.punts);
                renderitzaRanking("#lose-ranking");
                $("#pantalla-lose").removeClass("d-none").addClass("d-flex");
                return;
            }

            this.reproduirSo(this.soPerdreVida);

            this.bola.posicio = new Punt(this.canvas.width / 2, this.canvas.height / 2);
            this.bola.vy = -Math.abs(this.bola.vy);
            this.esperant = true;
            this.tempsInici = Date.now();
            return;
        }

        this.pala.update();

        //Pas de nivell
        if (this.mur.estaNet()) {
            if (this.mur.seguentNivell()) {
                const factor = 1.2;
                this.bola.vx *= factor;
                this.bola.vy *= factor;
                this.pala.vx *= factor;
                const defNou = this.mur.nivells[this.mur.nivellActual];
                if (defNou.velocitatPala) this.pala.vx = defNou.velocitatPala;
                this.bola.posicio = new Punt(this.canvas.width / 2, this.canvas.height / 2);
                this.bola.vy = -Math.abs(this.bola.vy);
                this.esperant = true;
                this.tempsInici = Date.now();
            } else {
                // Victoria
                this.acabat = true;
                this.reproduirSo(this.soGuanyar);
                guardaPuntuacio(this.nom, this.punts);
                $("#win-punts").text(this.punts);
                renderitzaRanking("#win-ranking");
                $("#pantalla-win").removeClass("d-none").addClass("d-flex");
            }
        }

        this.draw();
    }

    reproduirSo(audio) {
        if (window.jocVolumen !== false) audio.play();
    }

    reproduirColissio() {
        this.reproduirSo(this.soColissio);
    }

    reproduirMur() {
        this.reproduirSo(this.soMur);
    }
}
