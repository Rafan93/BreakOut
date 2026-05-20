# BreakOut — Pràctica P200 Laboratori Multimèdia

Pràctica de l'assignatura 103133 - Laboratori Multimèdia, curs 2025-2026, TecnoCampus / UPF.

---

## Explicació del joc

**Breakout** és un joc clàssic d'Atari. El jugador controla una pala horitzontal situada a la part inferior del canvas i ha d'evitar que una bola caigui fora de la pantalla. L'objectiu és destruir tots els totxos d'un mur situat a la part superior colpejant-los amb la bola.

- La **bola** es mou constantment en diagonal i rebota contra les parets, la pala i els totxos.
- La **pala** es mou esquerra i dreta amb les tecles de direcció del teclat.
- Cada **totxo** destruït suma punts al jugador.
- Si la bola cau per sota de la pala, el jugador perd una vida.
- El joc acaba quan el jugador es queda sense vides o quan destrueix tots els totxos del nivell.

---

## Què s'ha de fer

### Requeriments obligatoris

- [ ] **Pantalla inicial** amb formulari per introduir el nom del jugador, selecció de nivell (Fàcil / Normal / Difícil) i visualització del top 5 de puntuacions.
- [ ] **Sistema de vides**: el jugador disposa d'un nombre limitat de vides. Quan la bola cau per sota de la pala es perd una vida; si arriben a 0, és game over.
- [ ] **Sistema de puntuació**: cada totxo destruït suma punts. La puntuació es mostra en temps real.
- [ ] **Generació del mur** (`Mur.generaMur()`): crear els totxos en pantalla a partir del patró de text definit als nivells.
- [ ] **Col·lisions bola–totxos**: detectar quan la bola xoca amb un totxo, eliminar-lo i rebotar la bola en la direcció correcta (vertical o horitzontal segons la vora tocada).
- [ ] **Pas de nivell**: quan es destrueixen tots els totxos, pujar de nivell i augmentar la velocitat de la bola.
- [ ] **Pantalla de fi**: missatge de felicitació (si el jugador guanya) o game over (si es queden sense vides). Registrar la puntuació al top 5 si correspon.
- [ ] **Persistència amb localStorage**: guardar i carregar el top 5 de puntuacions per nom de jugador.
- [ ] **Efectes de so**: sons per a inici, xoc amb pala, xoc amb totxo, pèrdua de vida i fi de partida.
- [ ] **Display** (`Display.js`): mostrar en pantalla la puntuació actual, les vides restants i el millor marcador durant la partida.

### Requeriments addicionals

- [ ] Selecció d'un joc de colors per al canvas, pala i bola.
- [ ] Nivells amb configuracions de totxos diferents.
- [ ] Totxos especials:
  - Totxos que necessiten més d'un xoc per destruir-se.
  - Totxos que donen puntuació extra o regalen una vida en ser colpejats.
  - Totxos que destrueixen els adjacents quan s'hi produeix un xoc.

---

## Tecnologies

- **HTML5 Canvas** — dibuix del joc
- **CSS3** — estils i pantalles
- **JavaScript ES6+** — lògica del joc (classes: `Joc`, `Bola`, `Pala`, `Totxo`, `Mur`, `Punt`, `Segment`)
- **jQuery 3.6.0** — gestió d'events i DOM

> **Restricció**: no es permet cap altra llibreria JavaScript fora de jQuery.

---

## Autors

Pràctica en grup — Laboratori Multimèdia 3T, curs 2025-2026.
