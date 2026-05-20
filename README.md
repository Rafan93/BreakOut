# BreakOut - Pràctica P200 Laboratori Multimèdia

Joc Breakout basat en HTML5 Canvas, CSS3 i JavaScript (amb jQuery). Pràctica de l'assignatura 103133 - Laboratori Multimèdia, curs 2025-2026, TecnoCampus / UPF.

---

## Estructura del projecte

```
BreakOut/
├── index.html          # Entrada principal del joc
├── css/
│   └── estils.css      # Estils globals (canvas, pantalles, capçalera)
├── js/
│   ├── app.js          # Inicialització i bucle d'animació (jQuery ready + requestAnimationFrame)
│   ├── joc.js          # Classe Joc: orquestra tots els elements
│   ├── bola.js         # Classe Bola: moviment i col·lisions
│   ├── pala.js         # Classe Pala: dibuix i moviment horitzontal
│   ├── totxo.js        # Classe Totxo: dibuix i detecció de punt interior
│   ├── mur.js          # Classe Mur: definició de nivells i generació del mur
│   ├── punt.js         # Classe Punt: coordenades (x, y) i distància
│   ├── segment.js      # Classe Segment: intersecció entre segments (geometria)
│   ├── jquery-3.6.0.min.js
│   └── jquery-ui.min.js
└── images/
    ├── fons.webp
    └── 20151006051016_votacion-estrellas-css.jpg  # fons actual del body
```

---

## Com funciona el joc (arquitectura)

### Bucle principal (`app.js`)
Quan el DOM és llest, es crea una instància de `Joc` i s'arrenca el bucle:
```
jQuery ready → new Joc() → joc.inicialitza() → animacio()
                                                    └─ joc.update() → requestAnimationFrame(animacio)
```

### Classes principals

| Classe | Fitxer | Responsabilitat |
|--------|--------|-----------------|
| `Joc` | `joc.js` | Conté canvas, ctx, bola, pala, mur. Gestiona tecles i crida a update/draw de cada element |
| `Bola` | `bola.js` | Posició, velocitat, col·lisions amb parets i pala. Usa `Segment.puntInterseccio()` |
| `Pala` | `pala.js` | Rectangle mòbil a la part inferior. Es mou amb ← → |
| `Totxo` | `totxo.js` | Rectangle individual del mur. Té `tocat` (boolea) per amagar-se en ser colpejat |
| `Mur` | `mur.js` | Conté l'array de `Totxo` d'un nivell. Genera el mur a partir d'un patró de text |
| `Punt` | `punt.js` | (x, y) + mètode estàtic `distanciaDosPunts` |
| `Segment` | `segment.js` | Dos punts A i B. Mètode `puntInterseccio(seg2)` per calcular creuaments de línies |

### Com funcionen les col·lisions
La bola avança un pas per frame (`vx`, `vy`). Es construeix un `Segment` (trajectòria) des de la posició actual fins a la posició següent. Es comprova si aquest segment intersecta amb:
- **Parets del canvas**: comprovació directa de coordenades.
- **Pala**: `interseccioSegmentRectangle()` calcula intersecció amb els 4 segments del rectangle de la pala.
- **Totxos del mur**: mateixa funció aplicada a cada totxo actiu.

Si hi ha col·lisió, s'inverteix `vx` (laterals) o `vy` (superior/inferior).

### Definició dels nivells (`mur.js`)
Els nivells es defineixen amb un array de strings on cada `a` representa un totxo:
```javascript
this.nivells = [
    { color: "#4CF", totxos: ["aaaaaaaaaaaa", "aaaaaaaaaaaa", ...] },
    { color: "#8D1", totxos: ["  aaaaaa  ", ...] },
    { color: "#D30", totxos: ["aaaaaaaaaaaa", "a        a", ...] }
]
```
`generaMur()` recorre els strings, crea un `Totxo` per cada `a` i el col·loca en posició pixel calculada.

---

## Estat actual d'implementació

### Implementat ✅
- Canvas amb fons i bucle d'animació
- Classe `Bola`: dibuix, moviment, rebot amb parets (top, laterals), col·lisió amb pala
- Classe `Pala`: dibuix, moviment esquerra/dreta amb tecles de fletxa
- Classe `Totxo`: dibuix, `tocat` per eliminar-lo
- Classe `Mur`: `defineixNivells()` amb 3 configuracions de patrons
- Classes geomètriques `Punt` i `Segment`: càlcul d'interseccions
- Captura de tecles (keydown/keyup) en `Joc`

### Pendent / Errors coneguts ❌

#### Errors crítics
1. **Dimensions del canvas mal configurades**: El canvas en HTML no té atributs `width`/`height`, per tant la resolució real és 300×150px (default HTML5), tot i que el CSS el mostra a 740×400px. Cal afegir `width="740" height="400"` al `<canvas>` del HTML.
2. **Col·lisions de `Bola` amb valors hardcodejats**: `bola.js` compara amb `300` i `150` en lloc de les dimensions reals del canvas. Cal passar el canvas a la bola o llegir les dimensions correctament.
3. **`Mur.generaMur()` i `Mur.draw()` buits**: La classe `Mur` té els mètodes clau sense implementar. El joc actualment crea un únic `Totxo` gegant de prova en comptes d'un mur real.
4. **Col·lisió de la bola amb totxos del mur no implementada**: El comentari és present a `bola.js` però no hi ha codi.

#### Funcionalitats pendents (requeriments de la pràctica)
5. **Pantalla inicial**: Cal crear el `<div id="inici">` amb formulari per al nom del jugador, selecció de nivell (Fàcil/Normal/Difícil) i visualització del top 5.
6. **Sistema de vides**: El jugador ha de tenir N vides. Quan la bola cau per sota de la pala, es perd una vida. Si arriben a 0, game over.
7. **Sistema de puntuació**: Cada totxo destruït suma punts. Cal mostrar la puntuació en pantalla.
8. **Classe `Display`**: Mostrar puntuació actual, vides restants i millors puntuacions durant la partida.
9. **Persistència amb `localStorage`**: Guardar i carregar el top 5 de puntuacions per jugador.
10. **Pas de nivell**: Quan es destrueixen tots els totxos, pujar de nivell i augmentar velocitat de la bola.
11. **Efectes de so**: Sons per a inici, xoc amb pala, xoc amb totxo, pèrdua de vida, fi de partida.
12. **Pantalla de fi**: Mostrar missatge de felicitació o game over. Registrar puntuació si entra al top 5.

---

## Tasques per implementar (ordre recomanat)

### 1. Corregir el canvas (index.html)
```html
<canvas id="joc" width="740" height="400"></canvas>
```

### 2. Corregir col·lisions de la bola (bola.js)
Passar les dimensions del canvas a la bola o accedir-hi via `joc`:
```javascript
// Substituir els valors hardcodejats 300 i 150
if (trajectoria.puntB.x + this.radi > canvas.width) { ... }
if (trajectoria.puntB.y + this.radi > canvas.height) { ... }
```

### 3. Implementar Mur.generaMur() i Mur.draw()
```javascript
generaMur(nivell, canvasAmplada, totxoAmplada, totxoAlcada) {
    this.totxos = [];
    let patrons = this.nivells[nivell];
    patrons.totxos.forEach((fila, row) => {
        for (let col = 0; col < fila.length; col++) {
            if (fila[col] === 'a') {
                let x = col * totxoAmplada + offsetX;
                let y = row * totxoAlcada + offsetY;
                let t = new Totxo(new Punt(x, y), totxoAmplada - 2, totxoAlcada - 2);
                t.color = patrons.color;
                this.totxos.push(t);
            }
        }
    });
}

draw(ctx) {
    this.totxos.forEach(t => t.draw(ctx));
}
```

### 4. Afegir col·lisió bola–totxos (bola.js, update)
```javascript
// Dins del bucle de totxos del mur
mur.totxos.forEach(totxo => {
    if (!totxo.tocat) {
        let resultat = this.interseccioSegmentRectangle(trajectoria, totxo);
        if (resultat) {
            totxo.tocat = true;
            if (resultat.vora === "superior" || resultat.vora === "inferior") this.vy = -this.vy;
            else this.vx = -this.vx;
            xoc = true;
        }
    }
});
```

### 5. Sistema de vides i puntuació (joc.js)
```javascript
this.vides = 3;
this.puntuacio = 0;
// Quan bola.y > canvas.height → this.vides-- → resetBola()
// Quan totxo.tocat → this.puntuacio += totxo.punts
```

### 6. Pantalla inicial (index.html + joc.js)
- Formulari amb camp de text per al nom i botons de nivell
- Llegir top 5 de `localStorage` i mostrar-los
- Al clicar "Jugar", iniciar la partida

### 7. Persistència (localStorage)
```javascript
// Guardar
localStorage.setItem('breakout_scores', JSON.stringify(topScores));
// Llegir
let scores = JSON.parse(localStorage.getItem('breakout_scores')) || [];
```

### 8. Efectes de so
```javascript
let soXoc = new Audio('sons/xoc.mp3');
soXoc.play();
```

---

## Tecnologies

- **HTML5 Canvas**: dibuix del joc (bola, pala, totxos)
- **CSS3**: estils, fons, pantalles d'inici/fi
- **JavaScript ES6+**: classes (`Joc`, `Bola`, `Pala`, `Totxo`, `Mur`, `Punt`, `Segment`)
- **jQuery 3.6.0**: gestió d'events (tecles, DOM ready)
- **Bootstrap 5.3**: opcional per al layout de les pantalles d'inici/fi

> **Restricció del projecte**: No es permet cap altra llibreria JavaScript fora de jQuery.

---

## Com executar

Obrir `index.html` en un navegador modern (Chrome, Firefox, Edge). No es necessita servidor local (tot és estàtic), però si es volen sons cal servir-ho amb un servidor HTTP simple (ex: `python -m http.server` o extensió Live Server de VS Code) per evitar restriccions CORS amb l'API Web Audio.

---

## Autors

Pràctica en grup — Laboratori Multimèdia 3T, curs 2025-2026.
