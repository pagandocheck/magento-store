# Magento-store v1.0.0

# Guía de Instalación Tienda Magento

## Características
La tienda de ejemplo con Magento contiene una plantilla con algunos productos añadidos en donde se puede visualizar de qué manera se puede realizar la configuración de una tienda online. Su contenido abarca desde la instalación de un paquete de herramientas y servicios para desarrolladores cómo lo es MAMP, pasando por una serie de configuraciones necesarias para la correcta ejecución de la tienda, hasta el despliegue de la misma, así como una base de datos precargada con la información de los productos y la plantilla de estilos de una tienda Pagando.

### Requisitos para una instalación local.
- Tener **PHP 7.4** instalado, como mínimo, en caso de no cumplir con este requerimiento, nosotros sugerimos su actualización a esta versión a través de brew; un instalador de paquetes para macOS que puedes encontrar [aquí](https://brew.sh/index_es).
- **MAMP**.- Un servidor para alojar la página web, puedes encontrarlo [aquí](https://www.mamp.info/en/mac/), pero también puede utilizar otro servidor de su preferencia.
- **ElasticSearch**.- Un motor de búsqueda y analítica de RESTful distribuido, puedes obtenerlo [aquí](https://www.elastic.co/es/downloads/elasticsearch).
- **Composer**.- Un administrador de dependencias para proyectos de PHP que puede obtener [aquí](https://getcomposer.org/download/):
  
## Instalación

### 1. Configurar MAMP

Para la correcta configuración debe ingresar en el menú Preferencias y luego cambiar a la pestaña de puertos, e ingresar estos valores, o haz clic en el botón **80 & 3306**

<img width="524" alt="mamp-ports" src="https://user-images.githubusercontent.com/88348069/128804539-fcda57fe-d102-4aef-a97e-5f55cf2bc3a4.png">

El siguiente paso es configurar la carpeta raíz del documento. Esta será la carpeta donde creará y almacenará sus sitios web. De forma predeterminada, MAMP usa la carpeta / Aplicaciones / MAMP / htdocs, pero puede cambiarla a una ubicación más accesible.

Para terminar con la configuración de MAMP solo hay que presionar el botón **start** del servidor. Al hacerlo se abrirá la página de inicio de MAMP (http://localhost/MAMP/?language=English)

### 2. Clonar el repositorio

Para que se pueda acceder a la tienda, la carpeta del proyecto que se descargó, **magento-store**, deberá ser ubicada dentro de MAMP, normalmente se encuentra ubicado en **Applications/MAMP**, es necesario clonar el proyecto dentro de la carpeta **htdocs**.

```
git clone https://github.com/pagandocheck/magento-store.git
```

### 3. Cargar dump de la base de datos con los productos de ejemplo

Para importar la base de datos, en el menú superior de la página de inicio de MAMP seleccionar **Tools** y después **phpMyAdmin**.

En **phpMyAdmin** hacer clic en la pestaña **importar**.

<img width="1260" alt="Captura de Pantalla 2021-08-11 a la(s) 22 04 42" src="https://user-images.githubusercontent.com/88348069/129136792-b3c1d270-d2c6-428d-b15e-b3e235576979.png">

Aquí verá un formulario como este, donde podrá cargar el archivo **database / magento.sql** de nuestro proyecto, después dar clic en **aceptar**.

<img width="569" alt="Captura de Pantalla 2021-08-11 a la(s) 22 07 40" src="https://user-images.githubusercontent.com/88348069/129136908-c491d3ab-5262-4c63-9b60-22da7a3d8b03.png">

Si se importó de manera satisfactoria podremos ver las tablas de la base de datos.

### 4. Creación del virtual host

#### 4.1 Configuración de httpd.conf

Lo primero que debes hacer es acceder al directorio **MAMP / conf / apache** y editar el archivo **httpd.conf** que verás en su interior con cualquier editor de texto.

Después incluiremos el archivo **httpd-vhosts.conf** en la configuración de Apache, que es en donde definimos los hosts virtuales.

Para ello buscaremos la siguiente línea: **# Virtual hosts**:

En Unix
```
#Include /Applications/MAMP/conf/apache/extra/httpd-vhosts.conf
```

En Windows
```
#Include conf/extra/httpd-vhosts.conf
```

Elimina el carácter **#** del inicio de la línea para descomentar la línea:

> **_Nota:_**
En Windows, si no existe dicho archivo, tendrás que crearlo. Puedes copiar y pegar una copia desde el directorio **bin / apache / conf / extra**.

Ahora, dentro del mismo archivo, vamos a cambiar la configuración de los SymLinks que se usa por defecto. Busca la opción **FollowSymLinks** y vamos a modificar su **AllowOverride**:

```
<Directory />
    Options Indexes FollowSymLinks
    AllowOverride None
</Directory>
```

Debes cambiar el valor de la opción **AllowOverride** por **All**:

Y posteriormente guardar el archivo.

#### 4.2 Configuración de httpd-vhosts.conf

Para agregar un host virtual debes iniciar MAMP y asegurarte de que el directorio que se usa por defecto es el directorio **Applications / MAMP / htdocs**

 <img width="474" alt="Captura de Pantalla 2021-08-10 a la(s) 0 32 29" src="https://user-images.githubusercontent.com/88348069/128819331-16e3cdb7-a605-4a11-86ac-44e50bc31628.png">

Luego debes editar el archivo **httpd-vhosts.conf** y agregar el código que ves a continuación, reemplazando **direccion.dominio** en la opción **ServerName** por el la dirección y el dominio que vas a utilizar con tu virtualhost, y **/ ruta / hasta / el / directorio** en la opción DocumentRoot por la ruta de la carpeta en donde está tu proyecto:

```
<VirtualHost *:80>
  ServerName direccion.dominio
  DocumentRoot "/ruta/hasta/el/directorio"
</VirtualHost>
```

Siguiendo el esquema anterior, vamos a crear el host virtual miproyecto.localhost y lo vamos a enlazar con el directorio /Users/edu/hosts/miproyecto. La configuración sería la siguiente:

En Unix
```
<VirtualHost *:80>
  ServerName magento-pagandocheck-store.com
  DocumentRoot "/Applications/MAMP/htdocs/magento-store/pub"
</VirtualHost>
```

En Windows
```
<VirtualHost *:80>
  ServerName magento-pagandocheck-store.com
  DocumentRoot "C:/Users/MAMP/htdocs/magento-store/pub"
</VirtualHost>
```

Tendríamos que acceder a la URL miproyecto.localhost para acceder a él desde el navegador, ya que es el valor de la opción ServerName. Apache buscará los archivos de este proyecto en el directorio **/Users/edu/hosts/miproyecto** especificado en la opción DocumentRoot.

#### 4.3 Agregar el dominio al archivo hosts

En Unix abre la terminal de comandos y ejecuta el siguiente comando para abrir el archivo de configuración de hosts de macOS:

```
sudo pico /etc/hosts
```

Seguramente se te pedirá tu contraseña de administrador cuando lo abras. Introdúcela.

En Windows debes acceder al directorio C:\WINDOWS\system32\drivers\etc\, abrir el archivo /hosts:

En cualquiera de los dos casos debes agregar la línea siguiente al final del archivo:

```
127.0.0.1 magento-pagandocheck-store.com
```

Por último, guarda el archivo y reinicia los servicios de MAMP.


> **_Nota:_**
En caso de querer cambiar el dominio, puedes modificarlo con este comando:

```
bin/magento setup:store-config:set --base-url="http://tu-direccion.dominio/
```

Y luego tienes que hacer una limpieza del cache corriendo este otro comando:

```
bin/magento cache:flush
```
y además, tendrás que editar nuevamente el archivo /hosts, que modificamos justo arriba, para configurar el dominio que sea que hayas elegido.

### 5. Acceder a la página.
En el navegador ir a http://magento-pagandocheck-store.com/ para visualizar la tienda con los productos cargados en la base de datos. Debería verse de la siguiente forma: 

<img width="1267" alt="Captura de Pantalla 2021-08-10 a la(s) 0 10 54" src="https://user-images.githubusercontent.com/88348069/128817128-847e144c-2348-4b63-8ec5-5cbdf8a74d90.png">

Y listo, ya tienes una tienda alojada localmente en tu equipo, con productos de ejemplo.
