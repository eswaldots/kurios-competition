# Kronos | Kurios Competition 2026

Kronos es un juego inmersivo basado en terminal, desarrollado para la **Kurios Competition 2026**. El jugador asume el rol de un analista de ciberseguridad que debe resolver una serie de puzzles lógicos ambientados en la terminal.

## Instalación

Clona este repositorio

```
git clone https://github.com/neovim/neovim
```

Abrelo en Visual Studio Code y usa la extensión Live Preview para poder ver el juego en local. No requiere instalar dependencias, solo son archivos estaticos.

Aún así, si prefieres no descargarlo, existe una preview en la web (aquí)[https://kurios-competition-eight.vercel.app/]

## Explicación del código

Antes de explicarla:

*Pedimos disculpas por no haber podido entregar toda nuestra lógica en un solo archivo de JavaScript como se nos sugirió inicialmente. Entendemos que eso habría facilitado la revisión inicial a un solo vistazo, pero nos fue imposible lograrlo sin comprometer el orden interno del proyecto. 

Al final, aprovechando la libertad de herramientas estipulada en el reglamento de la competencia, decidimos asumir la responsabilidad de enviar una arquitectura modular (múltiples archivos y clases). Nuestra esperanza es que esta estructura segmentada haga que la lectura del código, la separación de responsabilidades y la evaluación lógica sea lo más amigable, escalable y clara posible para ustedes. Un código simple y ordenado es un mejor código.*

El proyecto tiene un flujo de código sencillo hecho para poder ser escalable a nuevos niveles y modelos gráficos.

Solo usamos un archivo HTML ya que en las reglas se estipulo que la página no se debe recargar, asi que preferimos dejar un HTML con un elemento al que pudieramos mover facilmente en el JavaScript.

```html
	<main id="root"></main>
	<script type="module" src="script.js"></script>
```

La tag `main` sera el principal contenedor que usara el JavaScript para manipular y crear su propio DOM y renderizar todo el proyecto. Usamos el `type="module"` para poder importar más otros archivos con una sintaxis "moderna".

En `script.js` se inicializa la clase Engine(), que se encargaría de modificar todos los estados.

```javascript
const engine = new Engine();

engine.handleStateUpdate(GameState.BOOTING);
```

El archivo `engine.js` contiene el corazón de la arquitectura: la clase Engine. Su función principal es determinar qué pantalla debe estar visible en cada momento.

Además de controlar el flujo, el Engine centraliza recursos globales. Por ejemplo, almacena y maneja los efectos de sonido (this.audio), evitando que cada pantalla tenga que instanciar sus propios audios de "Aceptar" o "Error" (dejando a `LevelScreen` como excepción contando el nivel 4), lo cual es vital para el rendimiento, ya que así no generamos objetos de forma aleatoria y los dejamos flotando en el código.

También abstrae la lógica de renderizado en el DOM a través del método renderScreen().

~Aunque esta clase cumple su propósito, reconocemos que en un escenario ideal (o en una refactorización futura), el Engine podría absorber aún más responsabilidades lógicas. Actualmente, las clases Screen gestionan de forma individual su contenido, animaciones y su propio ciclo de vida. Mover esa lógica de montaje/desmontaje al Engine resultaría en un sistema aún más DRY~

Para mantener el código ordenado, cada "vista" o "nivel" del juego está encapsulado en su propia clase dentro de la carpeta `/screens`.

Cada clase de screen tiene un constructor en donde se especifica el `root`, que es la tag `main` definida en HTML. Tienen dos metodos que facilitan el renderizado del DOM:

- `render()` Solo se encarga de renderizar la screen (que es solo una html template) usando el metodo de `renderScreen` definido por el `Engine`
- `callback()` Este es el codigo que se corre despues de que los elementos de rendericen en el DOM, necesita un pequeño delay (definido en `constants.js`) para poder esperar a que el navegador renderice todos los elementos y asi poder obtenerlos.

Esta separación de clases nos permite que cada nivel maneje sus propios puzles, eventos de teclado o animaciones de CSS, sin ensuciar la lógica global de la aplicación. Cuando el Engine llama a un nuevo estado, la pantalla actual queda inactiva y la nueva Screen toma el control del root.
