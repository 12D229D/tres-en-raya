# Plan: Tres en Raya 🎮

## Resumen
Juego clásico del Tres en Raya (Tic-Tac-Toe) y Conecta-N en el navegador. Desarrollado con HTML5 semántico, CSS3 moderno (con animaciones SVG y modo claro/oscuro), JavaScript Vanilla ES6+ y sintetizador de audio procedimental Web Audio API.

## Objetivos
- [x] Tablero responsivo multiformato (3×3, 4×4 y 5×5) con celdas interactivas y animaciones SVG para fichas X y O.
- [x] Modos de juego: 2 Jugadores local, vs CPU Fácil (aleatorio/heurístico), vs CPU Difícil (**Minimax con poda alfa-beta**).
- [x] Marcador persistente durante la sesión con historial de victorias/empates y botón de reinicio.
- [x] Detección de combinaciones ganadoras con resaltado visual y efectos de sonido en tiempo real.
- [x] Modo claro y oscuro conmutable.

---

## 🏗️ Arquitectura

- **Patrón**: Single Page Application (SPA) modular con renderizado dinámico de cuadrículas y audio sintetizado.

```text
tres-en-raya/
├── index.html      # Tablero, controles, modal de fin de juego y marcador
├── style.css       # Layout flex/grid, animaciones SVG, temas claro/oscuro
├── script.js       # Lógica del tablero multiformato, motor Minimax, sintetizador Web Audio API
├── README.md       # Instrucciones de juego y ejecución
└── plan.md         # Plan de desarrollo y bitácora
```

---

## 🧠 Paradigma de Programación

- **Híbrido: Orientado a Objetos (OOP) + Event-Driven + Funcional**:
  - `TicTacToeAudio` encapsula la síntesis procedural de sonido.
  - El motor de evaluación y Minimax utiliza funciones puras sobre arrays.
  - La interacción UI reacciona a eventos DOM en tiempo real.

---

## 🌐 Propósito de Visibilidad y Destino Remoto

- **Visibilidad**: `Público (Open Source / Portafolio)`.
- **Plataforma Remota Asignada**: `GitHub`.
- **Plataforma de Despliegue CI/CD**: `GitHub Pages` / `Cloudflare Pages`.
- **Justificación**: Tres en raya multiformato (3x3, 4x4, 5x5) con IA Minimax y audio procedural sin backend, óptimo para GitHub Pages.

---

## Estado Actual
- Estado: ✅ **Completado**

### Tareas Realizadas
- [x] Tablero interactivo con rendering SVG limpio y selector de dimensiones (3x3, 4x4, 5x5).
- [x] Motor de juego local 2 Jugadores.
- [x] IA CPU nivel Fácil (movimientos aleatorios válidos y heurística de bloqueo).
- [x] IA CPU nivel Difícil (algoritmo Minimax optimizado).
- [x] Marcador de partidas (X / O / Empates) con reinicio independiente.
- [x] Detección visual de combinación ganadora.
- [x] Modo claro y oscuro conmutable.
- [x] Efectos de sonido procedurales para colocación de fichas, victoria y empate (Web Audio API).
- [x] Modo tablero 4x4 y 5x5 opcional (Conecta-4 en cuadrícula extendida).
