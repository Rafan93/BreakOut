class Totxo{
    constructor(puntPosicio, amplada, alcada){

    this.amplada=amplada;
    this.alcada=alcada;
    this.tocat=false;
    this.posicio = puntPosicio;
    this.color;
    this.punts;
    this.tocs = 1;
    this.tocsRestants = 1;
    this.tempsColpejat = 0;

    }
    get area() {
        return this.amplada * this.alcada;
    }

    // Colors per a blocs multi-hit: [0]=1 toc restant, [1]=2 restants, [2]=3 restants
    _colorsMultiToc() {
        return ["#FFCC44", "#FF8800", "#FF2200"];
    }

    draw(ctx) {
        if (!this.tocat){
            ctx.save();

            if (this.tocs > 1 && this.tocsRestants < this.tocs) {
                const colors = this._colorsMultiToc();
                ctx.fillStyle = colors[this.tocsRestants - 1];
            } else {
                ctx.fillStyle = this.color;
            }

            ctx.fillRect(this.posicio.x, this.posicio.y, this.amplada, this.alcada);

            if (this.tocs > 1) {
                ctx.strokeStyle = "rgba(0,0,0,0.4)";
                ctx.lineWidth = 1.5;
                ctx.strokeRect(this.posicio.x, this.posicio.y, this.amplada, this.alcada);

                // Flash blanc que es dissipa 300ms després d'un impacte
                const elapsed = Date.now() - this.tempsColpejat;
                if (elapsed < 300) {
                    const alpha = 0.7 * (1 - elapsed / 300);
                    ctx.fillStyle = `rgba(255, 255, 255, ${alpha})`;
                    ctx.fillRect(this.posicio.x, this.posicio.y, this.amplada, this.alcada);
                }

            }

            ctx.restore();
        }

    }
    puntInteriorRectangle(punt){
        return (punt.x >= this.posicio.x &&
            punt.x <= this.posicio.x + this.amplada) &&
            (punt.y >= this.posicio.y &&
                punt.y<=this.posicio.y+this.alcada);
    }
};