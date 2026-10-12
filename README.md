# Tres en Raya 🎮

Juego clásico del **Tres en Raya** (Tic-Tac-Toe) implementado en HTML5, CSS3 y JavaScript vanilla, sin dependencias ni frameworks. Diseño moderno, responsive y con tema claro/oscuro.

## Características

- **Tablero 3x3** con celdas clicables y animación SVG al marcar X / O.
- **3 modos de juego:**
  - `2 Jugadores` — partida local entre dos jugadores humanos.
  - `vs CPU · Fácil` — la CPU elige movimientos aleatorios.
  - `vs CPU · Difícil` — la CPU usa el algoritmo **Minimax** con poda alfa-beta (invencible).
- **Marcador** de victorias de X, O y empates, con botón de reinicio.
- **Indicador de turno** en tiempo real.
- **Detección de ganador** con resaltado de la combinación ganadora y línea animada sobre el tablero.
- **Tema claro / oscuro** conmutable.
- **Responsive** — se adapta a móvil y escritorio.

## Estructura

```
tres-en-raya/
├── index.html      # Estructura del juego
├── style.css        # Estilos modernos + tema claro/oscuro + responsive
├── script.js        # Lógica del juego (estados, IA minimax, marcador)
└── README.md        # Este archivo
```

## Cómo ejecutar

No requiere instalación ni servidor:

1. Abre la carpeta `tres-en-raya/`.
2. Haz doble clic en `index.html` (se abrirá en tu navegador por defecto).

> También puedes servirlo con cualquier servidor estático, por ejemplo:
> ```bash
> npx serve tres-en-raya
> # o
> python -m http.server -d tres-en-raya
> ```

## Cómo jugar

1. Selecciona el **modo de juego** (2 Jugadores o vs CPU). Si eliges vs CPU, selecciona la **dificultad** (Fácil / Difícil).
2. El Jugador **X** siempre empieza.
3. Haz clic en una celda vacía para colocar tu ficha.
4. El primer jugador en alinear **tres fichas iguales** en una fila, columna o diagonal gana.
5. Si se rellenan las 9 celdas sin ganador, es **empate**.
6. Pulsa **Nueva Partida** para reiniciar el tablero (el marcador se conserva) o **Reiniciar Marcador** para ponerlo a cero.

## Controles

| Acción | Control |
|---|---|
| Colocar ficha | Clic en una celda vacía |
| Nueva partida | Botón _Nueva Partida_ |
| Reiniciar marcador | Botón _Reiniciar Marcador_ |
| Cambiar tema | Botón de sol/luna en la cabecera |

## Stack técnico

- **HTML5** semántico
- **CSS3** con variables, Grid, Flexbox y animaciones
- **JavaScript** vanilla (sin librerías externas)
- **SVG** para las fichas y la línea ganadora
- Algoritmo **Minimax** con poda **alfa-beta** para la IA difícil

## Licencia

Proyecto educativo de uso libre.
