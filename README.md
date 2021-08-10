# Magento-store v1.0.0

# Guía de Instalación Tienda Magento

## Características
La tienda de ejemplo con Magento contiene una plantilla con algunos productos añadidos en donde se puede visualizar de que manera se puede realizar la configuración de una tienda online. Su contenido abarca desde la instalación de un paquete de herramientas y servicios para desarrolladores cómo lo es MAMP, pasando por una serie de configuraciones necesarias para la correcta ejecucion de la tienda, hasta el despliegue de la misma, así como una base de datos precargada con la información de los productos y la plantilla de estilos de una tienda Pagando.

### Requisitos para una instalación local.
- **PHP 7.4** como minimo.
- Un servidor en donde quedará alojada la página. En éste caso se usará **MAMP**.
- **Composer**, un administrador de dependecias para projectos de PHP.
  
## Instalación en Mac

### 1. Instalar MAMP

Lo primero que debe hacer es visitar el sitio web de [MAMP](https://www.mamp.info/en/mac/) y descargar. Una vez finalizada la descarga, deberá abrir el archivo descargado y arrastrar el archivo de imagen dentro de él a su carpeta de Aplicaciones. A continuación, simplemente siga las instrucciones en pantalla.
Después de la instalación, puede continuar e iniciar MAMP desde **Aplicaciones »MAMP** en su computadora.

Antes de comenzar, se recomienda configurar algunos ajustes para mejorar su experiencia con MAMP. Puede hacer esto abriendo el menú Preferencias y luego cambiar a la pestaña de puertos.

<img width="524" alt="mamp-ports" src="https://user-images.githubusercontent.com/88348069/128804539-fcda57fe-d102-4aef-a97e-5f55cf2bc3a4.png">

El siguiente paso es configurar la carpeta raíz del documento. Esta será la carpeta donde creará y almacenará sus sitios web. De forma predeterminada, MAMP usa la carpeta / Aplicaciones / MAMP / htdocs /, pero puede cambiarla a una ubicación más accesible.

Para terminar con la instalación de MAMP solo hay que presionar el botón **start** del servidor. Al hacerlo se abrirá la pagina de inicio de MAMP (http://localhost/MAMP/?language=English)

### 2. Instalar Composer

### 3. Clonar el repositorio

Para que se pueda acceder a la tienda, la carpeta del proyecto que se descargó, **magento-store**, deberá quedar ubicada dentro de MAMP, normalmente se encuentra ubicado en **Applications/MAMP**, es necesario clonar el proyecto dentro de la carpeta **htdocs**.

```
git clone https://github.com/pagandocheck/magento-store.git
```

### 34 Cargar dump de la base de datos con los productos de ejemplo.
Para importar la base de datos, en el menu superior de la página de inicio de MAMP seleccionar **Tools** y despues **phpMyAdmin**.

En **phpMyAdmin** hacer clic en Bases de datos y luego crear nueva base de datos. Agregar como nombre ***magento***, en caso de que se desee poner otro nombre habrá que cambiar la configuración en el proyecto.

Luego, seleccionar la base de datos, dar clic en el menu **importar** y seleccionar el archivo **database/magento.sql** de nuestro proyecto, despues dar clic en **importar**. Si se importó de manera satisfactoria podremos ver las tablas de la base de datos.

> **_Nota:_**
Para realizar el cambio del nombre de la base de datos en la configuración, hay que editar el archivo **app/etc/env.php** y cambiar el campo **db.connection.dbname** con el nombre que se haya elegido.

### 5. Creacion del virtual host.

#### 5.1 Configuración de httpd.conf

Lo primero que debes hacer acceder al directorio **Applications/MAMP/conf/apache** mediante Finder y edita el archivo **httpd.conf** que verás en su interior con cualquier editor de texto.

Despues incluiremos el archivo **httpd-vhosts.conf** en la configuración de Apache, que es en donde definimos los hosts virtuales.

Para ello buscaremos la siguiente línea: **# Virtual hosts**:

```
#Include /Applications/MAMP/conf/apache/extra/httpd-vhosts.conf
```

Elimina el caracter **#** del inicio de la línea para así borrar el comentario de la línea:

```
Include /Applications/MAMP/conf/apache/extra/httpd-vhosts.conf
```

Ahora, dentro del mismo archivo, vamos a cambiar la configuración de los SymLinks que se usa por defecto. Busca la opción **FollowSymLinks** y vamos a modificar su **AllowOverride**:

```
<Directory />
    Options Indexes FollowSymLinks
    AllowOverride None
</Directory>
```

Debes cambiar el valor de la opción **AllowOverride** por **All**:

```
<Directory />
  Options Indexes FollowSymLinks
  AllowOverride All
</Directory>
```

Y posteriormente guardar el archivo.

#### 5.2 Configuración de httpd-vhosts.conf

Para agregar un host virtual debes iniciar MAMP y asegurarte de que el directorio que se usa por defecto es el directorio **Applications/MAMP/htdocs**

 <img width="474" alt="Captura de Pantalla 2021-08-10 a la(s) 0 32 29" src="https://user-images.githubusercontent.com/88348069/128819331-16e3cdb7-a605-4a11-86ac-44e50bc31628.png">

Luego debes editar el archivo httpd-vhosts.conf y agregar el código que ves a continuación, reemplazando dominio.localhost en la opción ServerName por el nombre del dominio que vas a utilizar con tu virtualhost, y **/ruta/hasta/el/directorio** en la opción DocumentRoot por la ruta de la carpeta en donde está tu proyecto:

```
<VirtualHost *:80>
  ServerName direccion.dominio
  DocumentRoot "/ruta/hasta/el/directorio"
</VirtualHost>
```

Siguiendo el esquema anterior, vamos a crear el host virtual miproyecto.localhost y lo vamos a enlazar con el directorio /Users/edu/hosts/miproyecto. La configuración sería la siguiente:

```
<VirtualHost *:80>
  ServerName magento-pagandocheck-store.com
  DocumentRoot "/Applications/MAMP/htdocs/magento-store/pub"
</VirtualHost>
```

Tendríamos que acceder a la URL miproyecto.localhost para acceder a él desde el navegador, ya que es el valor de la opción ServerName. Apache buscará los archivos de este proyecto en el directorio **/Users/edu/hosts/miproyecto** especificado en la opción DocumentRoot.

#### 5.3 Agregar el dominio al archivo hosts

Abre la terminal de comandos y ejecuta el siguiente comando para abrir el archivo de configuración de hosts de macOS:

```
sudo pico /etc/hosts
```

Seguramente se te pida tu contraseña de administrador cuando lo abras. Introdúcela.

Debes agregar la línea siguiente al final del archivo:

```
127.0.0.1 magento-pagandocheck-store.com
```

Por último, guarda el archivo pulsando las teclas **CTRL+X** y reinicia los servicios de MAMP.

> **_Nota:_**
En caso de querer cambiar el dominio, puedes modificarlo con este comando:

```
bin/magento setup:store-config:set --base-url="http://tu-direccion.dominio/
```

Y luego tienes que hacer una limpieza del cache corriendo este otro comando:

```
bin/magento cache:flush
```
En caso de que modificaras la dirección, tendras que ejecutar nuevamente

```
sudo pico /etc/hosts
```

para configurar el dominio que sea que hayas elegido.

### 6. Acceder a la página.
En el navegador ir a http://magento-pagandocheck-store.com/ para visualizar la tienda con los productos cargados en la base de datos. Debería verse de la siguiente forma: 

<img width="1267" alt="Captura de Pantalla 2021-08-10 a la(s) 0 10 54" src="https://user-images.githubusercontent.com/88348069/128817128-847e144c-2348-4b63-8ec5-5cbdf8a74d90.png">

Y listo, ya tendrias una tienda alojada localmente en tu equipo.
