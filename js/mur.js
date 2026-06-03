class Mur {
    constructor(canvasAmplada, canvasAlcada, totxoAmplada, totxoAlcada) {
        this.canvasAmplada = canvasAmplada;
        this.canvasAlcada = canvasAlcada;
        this.totxoAmplada = totxoAmplada;
        this.totxoAlcada = totxoAlcada;

        this.separacio = 4; // separació entre totxos

        this.defineixNivells();
        this.nivellActual = 0;
        this.totxos = [];

        this.generaMur();
    }

    // Selecció de colors per al canvas, pala i bola
    defineixNivells() {
        this.nivells = [
            {
                color: "#4CF",
                totxos: [
                    "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa",
                    "aaaaaaaaaaaa",
                ]
            },
            {
                color: "#8D1",
                totxos: [
                    "aaaaaaaaaaaa",
                    "     aa     ",
                    "   aaaaaa   ",
                    "   aaaaaa   ",
                    "     aa     ",
                ]
            },
            {
                color: "#D30",
                totxos: [
                    "aaaaaaaaaaaa",
                    "a          a",
                    " a        a ",
                    "aa        aa",
                    "  aaaaaaaa  ",
                ]
            },
            {
                color: "#9D00FF",
                imatgeFons: "images/fondobikini.jpeg",
                colorPala: "#007BFF",
                colorBola: "#FFD700",
                velocitatPala: 9,
                totxos: [
                    "a a a a a a a",
                    " a a a a a a ",
                    "a a a a a a a",
                    "aaaaaaaaaaaaa",
                ]
            }
        ];
    }

    estaNet() {
        return this.totxos.every(t => t.tocat);
    }

    // Pas de nivell
    seguentNivell() {
        if (this.nivellActual < this.nivells.length - 1) {
            this.nivellActual++;
            this.generaMur();
            return true;
        }
        return false;
    }

    // Generació del mur
    generaMur() {
        this.totxos = [];

        const def = this.nivells[this.nivellActual];
        const files = def.totxos.length;
        const columnes = def.totxos[0].length;

        // ample total del mur (amb separació)
        const ampleMur = columnes * (this.totxoAmplada + this.separacio);

        const margeSuperior = 40;
        const margeLateral = (this.canvasAmplada - ampleMur) / 2;

        for (let fila = 0; fila < files; fila++) {
            const linia = def.totxos[fila];

            for (let col = 0; col < columnes; col++) {

                if (linia[col] === "a") {

                    const x = margeLateral + col * (this.totxoAmplada + this.separacio);
                    const y = margeSuperior + fila * (this.totxoAlcada + this.separacio);

                    const t = new Totxo(
                        new Punt(x, y),
                        this.totxoAmplada,
                        this.totxoAlcada
                    );

                    t.color = def.color;
                    t.punts = 10;

                    this.totxos.push(t);
                }
            }
        }

        // Blocs multi-toc al nivell 3 (2 tocs) i nivell 4 (3 tocs): 15% aleatori
        if (this.nivellActual === 2 || this.nivellActual === 3) {
            const tocsNivell = this.nivellActual === 2 ? 2 : 3;
            for (let t of this.totxos) {
                if (Math.random() < 0.15) {
                    t.tocs = tocsNivell;
                    t.tocsRestants = tocsNivell;
                }
            }
        }
    }

    draw(ctx) {
        for (let t of this.totxos) {
            t.draw(ctx);
        }
    }
}