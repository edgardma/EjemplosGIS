# Manual de configuración GIS

## Configurar GeoServer y PostgreSQL con Docker

Para crear los contenedores, ejecutar las siguientes sentencia:

```bash
## Crear una red virtual
sudo docker network create red_wp

## Crear el servidor GeoServer
sudo docker run -d -p 8081:8080 --name geoserver --network red_wp docker.osgeo.org/geoserver:2.23.1

## Crear el servidor PostgreSQL con PostGIS
sudo docker run -p 54321:5432 --name posgis-db --network red_wp -e POSTGRES_PASSWORD=secret -d postgis/postgis:15-3.3

## Crear el servidor Apache
sudo docker run -dit --name apache-app --network red_wp -p 8082:80 -v "$PWD":/usr/local/apache2/htdocs/ httpd:2.4
```

En el navegador, ingresar la ruta `http://localhost:8081/geoserver` para probar la instalación el GeoServer e ingresar con el usuario y clave por defecto `admin:geoserver`.

Para probar la instalación de la base de datos, ejecutar la siguientes sentencias:

```sql
SELECT version();
SELECT postgis_full_version();
```

Conectarse al PostgreSQL y crear una base de datos:

```sql
-- Crear Base de datos
-- DROP DATABASE GIS_Database;
CREATE DATABASE GIS_Database WITH OWNER = postgres ENCODING = 'UTF8'
TABLESPACE=pg_default;
ALTER DATABASE GIS_Database SET search_path="$user", public, sde;
GRANT ALL ON DATABASE GIS_Database TO public;
GRANT ALL ON DATABASE GIS_Database TO postgres;
```

Conectarse a la base de datos creada y ejecutar la siguiente sentencia:

```sql
CREATE EXTENSION postgis;
```

Si se desea copiar una carpeta a un contenedor, se puede ejecutar el siguiente ejemplo, para lo cual se ha usado PowerShell en donde se copia una carpeta ubicada en la unidad E: (Windows) al contendor Apache a la ruta de publicación:

```bash
docker cp e:/appgis apache-app:/usr/local/apache2/htdocs/
```

*Fuentes:*

- [GeoServer connects with PostgreSQL - YouTube](https://www.youtube.com/watch?v=_UF98jQ2d-c)

- [¿Cómo conectar PostGIS desde QGIS de forma sencilla? - Geoinnova](https://geoinnova.org/blog-territorio/tutorial-gis-conectar-postgis-desde-qgis/)

- [Importar shapefiles a PostGIS - Geoinnova](https://geoinnova.org/blog-territorio/importar-shapefiles-a-postgis/)

## Shape de pruebas

En el siguiente link se puede conseguir shape gratuitos:

- [Limites Departamentales | Plataforma Nacional de Datos Abiertos](https://www.datosabiertos.gob.pe/dataset/limites-departamentales)

- [Geofabrik Download Server](https://download.geofabrik.de/south-america/peru.html)



## Errores

### Geoserver: from origin 'null' has been blocked by CORS policy: No 'Access-Control-Allow-Origin' header is present on the requested resource geoserver

Revisar el siguiente artículo: [Fixing CORS error in Geoserver](https://www.linkedin.com/pulse/fixing-cors-error-geoserver-krishna-lodha/)
