# FlowWave Frontend

### Descripción
Esta aplicación web es un cliente para la transferencia de ficheros
a través de WebSockets.


### Copyright
<pre>
https://github.com/cdelaof26
</pre>

Por el momento, este software no contiene una licencia, por
lo que todos los derechos están reservados - cdelaof26.


### Dependencias
Esta página web requiere únicamente de HTML5, JS, CSS3 y 
un navegador web.

Para el desarrollo se requiere de lo siguiente:
- Navegador web
- Tailwind CSS
  - Requiere NodeJS
  - Opcionalmente: [Tailwind Standalone CLI](https://tailwindcss.com/blog/standalone-cli)


### Uso
Este cliente únicamente se requiere un navegador web para visualizar 
el archivo `index.html`.

Para la transferencia de archivos se requiere de otro dispositivo 
que haga de servidor por medio de [FlowWaveServer](https://github.com/cdelaof26/FlowWaveServer).


### Historial de cambios

#### v0.0.3
**[ Compatible con FlowWaveServer v0.0.2 y anteriores ]**
- Mejorado el diseño responsivo
- Ahora ejecutar un comando no limpiará la salida automáticamente

#### v0.0.2
- Agregado spinner al conectarse a un servidor
- **[WIP]** Agregada vista CLI 

#### v0.0.1
- Proyecto inicial
