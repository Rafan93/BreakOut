/*
* CLASSE BOLA
*/

class Bola {
    constructor(puntPosicio, radi) {
        this.radi = radi;
        this.posicio = puntPosicio;
        this.vx = 3;
        this.vy = -3;
        this.color = "#fff";

        this.canvasAmplada = 300;
        this.canvasAlcada = 150;
    }

    draw(ctx) {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.posicio.x, this.posicio.y, this.radi, 0, 2 * Math.PI);
        ctx.fill();
        ctx.closePath();
    }

    mou(x, y) {
        this.posicio.x += x;
        this.posicio.y += y;
    }

    update(pala, mur) {

        let puntActual = this.posicio;
        let puntSeguent = new Punt(this.posicio.x + this.vx,
                                   this.posicio.y + this.vy);

        let trajectoria = new Segment(puntActual, puntSeguent);
        let xoc = false;

        // ===== PARETS =====
        if (puntSeguent.y - this.radi < 0) {
            this.posicio.y = this.radi;
            this.vy = -this.vy;
            xoc = true;
        }

        if (puntSeguent.y + this.radi > this.canvasAlcada) {
            this.fora = true;
            return;
        }

        if (puntSeguent.x + this.radi > this.canvasAmplada) {
            this.posicio.x = this.canvasAmplada - this.radi;
            this.vx = -this.vx;
            xoc = true;
        }

        if (puntSeguent.x - this.radi < 0) {
            this.posicio.x = this.radi;
            this.vx = -this.vx;
            xoc = true;
        }

        // ===== PALA =====
                    let palaGran = { posicio: new Punt(pala.posicio.x - this.radi, pala.posicio.y - this.radi),
            amplada: pala.amplada + 2 * this.radi,
            alcada: pala.alcada + 2 * this.radi}

        let colPala = this.interseccioSegmentRectangle(trajectoria, palaGran);
        if (colPala) {
            if (colPala.vora === "superior" || colPala.vora === "inferior") this.vy = -this.vy;
            if (colPala.vora === "esquerra" || colPala.vora === "dreta") this.vx = -this.vx;
            xoc = true;
        }

        // Col·lisions bola–totxos: detecta xoc, elimina el totxo i rebota la bola
        // ===== TOTXOS =====
        if (mur && mur.totxos) {
            for (let t of mur.totxos) {
                if (t.tocat) continue;

                let col = this.interseccioSegmentRectangle(trajectoria, t);
                if (col) {
                    t.tocat = true;

                    // Sistema de puntuació: suma punts per totxo destruït
                    joc.punts += t.punts;

                    if (col.vora === "superior" || col.vora === "inferior") this.vy = -this.vy;
                    if (col.vora === "esquerra" || col.vora === "dreta") this.vx = -this.vx;

                    xoc = true;
                    break;
                }
            }
        }

        if (!xoc) {
            this.posicio = puntSeguent;
        }
    }

    interseccioSegmentRectangle(segment, rectangle) {

        let millor = null;
        let millorDist = Infinity;

        let vores = [
            { vora: "superior", seg: new Segment(rectangle.posicio,
                new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y)) },

            { vora: "inferior", seg: new Segment(
                new Punt(rectangle.posicio.x, rectangle.posicio.y + rectangle.alcada),
                new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y + rectangle.alcada)) },

            { vora: "esquerra", seg: new Segment(rectangle.posicio,
                new Punt(rectangle.posicio.x, rectangle.posicio.y + rectangle.alcada)) },

            { vora: "dreta", seg: new Segment(
                new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y),
                new Punt(rectangle.posicio.x + rectangle.amplada, rectangle.posicio.y + rectangle.alcada)) }
        ];

        for (let v of vores) {
            let p = segment.puntInterseccio(v.seg);
            if (p) {
                let d = Punt.distanciaDosPunts(segment.puntA, p);
                if (d < millorDist) {
                    millorDist = d;
                    millor = { pI: p, vora: v.vora };
                }
            }
        }

        return millor;
    }
}
