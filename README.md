# FlowWave Frontend

### Descripción
Esta aplicación web es un cliente para la transferencia de ficheros
a través de WebSockets principalmente por redes locales.


### Copyright
<pre>
MIT License

Copyright (c) 2024 cdelaof26

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:
</pre>

**Antes de usar este software, revisa [LICENSE (full document)](LICENSE).**

La licencia del MIT solo aplica a la versión `v0.0.4` y posteriores de 
FlowWave Frontend.


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

#### v0.0.4
**[ Compatible con FlowWaveServer v0.0.3 y anteriores ]**
- Implementado subir y descargar archivos
  - **Requiere de FlowWaveServer v0.0.3**

#### v0.0.3
- Mejorado el diseño responsivo
- Ahora ejecutar un comando no limpiará la salida automáticamente

#### v0.0.2
- Agregado spinner al conectarse a un servidor
- **[WIP]** Agregada vista CLI 

#### v0.0.1
- Proyecto inicial
