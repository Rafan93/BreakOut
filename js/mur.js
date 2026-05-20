/*
* CLASSE MUR
*/

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
            }
        ];
    }

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
    }

    draw(ctx) {
        for (let t of this.totxos) {
            t.draw(ctx);
        }
    }
}
