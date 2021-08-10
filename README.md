# Magento-store v1.0.0

# Guía de Instalación Tienda Magento

## Características
La tienda de ejemplo con Magento contiene una plantilla con algunos productos añadidos en donde se puede visualizar de que manera se puede realizar la configuración de una tienda online. Su contenido abarca desde la instalación de un paquete de herramientas y servicios para desarrolladores cómo lo es MAMP, pasando por una serie de configuraciones necesarias para la correcta ejecucion de la tienda, hasta el despliegue de la misma, así como una base de datos precargada con la información de los productos y la plantilla de estilos de una tienda Pagando.

### Requisitos para una instalación local.
- Un servidor en donde quedará alojada la página. En éste caso se usará MAMP.`

## Instalación en Mac

### 1. Instalar MAMP

Lo primero que debe hacer es visitar el sitio web de [MAMP](https://www.mamp.info/en/mac/) y descargar. Una vez finalizada la descarga, deberá abrir el archivo descargado y arrastrar el archivo de imagen dentro de él a su carpeta de Aplicaciones. A continuación, simplemente siga las instrucciones en pantalla.
Después de la instalación, puede continuar e iniciar MAMP desde **Aplicaciones »MAMP** en su computadora.

Antes de comenzar, se recomienda configurar algunos ajustes para mejorar su experiencia con MAMP. Puede hacer esto abriendo el menú Preferencias y luego cambiar a la pestaña de puertos.

![changeapacheport](https://user-images.githubusercontent.com/88348069/128447300-023fbd7e-c5c3-4443-ae15-f6a3c51db855.png)

El siguiente paso es configurar la carpeta raíz del documento. Esta será la carpeta donde creará y almacenará sus sitios web. De forma predeterminada, MAMP usa la carpeta / Aplicaciones / MAMP / htdocs /, pero puede cambiarla a una ubicación más accesible.

Para terminar con la instalación de MAMP solo hay que presionar el botón **start** del servidor. Al hacerlo se abrirá la pagina de inicio de MAMP (http://localhost/MAMP/?language=English)

### 2. Clonar el repositorio

```
git clone https://github.com/pagandocheck/woocommerce-store.git
```
Para que se pueda acceder a la tienda, la carpeta del proyecto que se descargó, **woocommerce-store**, deberá quedar ubicada dentro de MAMP, normalmente se encuentra ubicado en **Applications/MAMP** , pegar el proyecto dentro de la carpeta **htdocs**.

### 3. Cargar dump de la base de datos con los productos de ejemplo.
Para importar la base de datos, en el menu superior de la página de inicio de MAMP seleccionar **Tools** y despues **phpMyAdmin**.

En **phpMyAdmin** hacer clic en Bases de datos y luego crear nueva base de datos. Agregar como nombre ***woocommerce***, en caso de que se desee poner otro nombre habrá que cambiar la configuración en el proyecto.

Luego, seleccionar la base de datos, dar clic en el menu **importar** y seleccionar el archivo **woocommerce.sql** de nuestro proyecto, despues dar clic en **importar**. Si se importó de manera satisfactoria podremos ver las tablas de la base de datos.

> **_Nota:_**
Para realizar el cambio del nombre de la base de datos en la configuración , hay que editar el archivo **wp-config.php** y cambiar el campo **DB_NAME** con el nombre que se haya elegido.

### 4. Acceder a la página.
En el navegador ir a http://localhost/woocommerce-store/ para visualizar la tienda con los productos cargados en la base de datos. Debería verse de la siguiente forma: 

<img width="950" alt="Captura de Pantalla 2021-08-05 a la(s) 20 33 11" src="https://user-images.githubusercontent.com/88348069/128447095-2bf718d3-44d4-4b45-b5de-562cef808c27.png">

## Instalar plugin de Pagando para pagos en la tienda.

### 1. Iniciar sesión en Wordpress
Ingresar a la página de configuración de Wordpress de nuestra tienda **http://localhost/woocommerce-store/wp-login.php** e iniciar sesión con las siguientes credenciales:

```
username: admin
pass: 
```

Se mostrará la página de Wordpress instalada localmente, en la cual se puedenn configurar las diferentes opciones de la tienda de Woocommerce, incluyendo los productos, precios y métodos de pago.

### 2. Agregar plugin de Pagando.
Ir al menu lateral izquierdo, en la sección **Plugins**, seleccionar la opción **Agregar plugin** y despues en la opción **cargar plugin**, subir la carpeta comprimida (.zip) con el plugin de Pagando.

### 3. Activar plugin
Para activar el plugin , ir al menu lateral izquierdo, en la sección **Plugins**, y seleccionar **Activar** en el plugin de Pagando. Cuando se ha realizado correctamente , deberá aparecer **Pagando** en el menú lateral izquierdo.

### 4. Agregar credenciales.
Para poder aceptar pagos con **Pagando**, es necesario configurar el usuario y la llave generados en la plataforma de **Pagando**.

### 5. Activar el método de pago.
En el menu lateral izquierdo, en la sección **Woocommerce**, seleccionar la opción **Ajustes**, en la opción **Pagos**, activar Pagando como método de pago. 








