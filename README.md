# fswebdevelopment
##  Tecnologías utilizadas

### Backend
- Node.js
- Express.js (v5)
- Mongoose
- dotenv
- cors
- nodemon

### Frontend
- React (v19)
- React Router DOM (v7)
- Axios
- JSX (predominante) y mínimo uso de TSX
- CSS modularizado por página

---

## Cómo iniciar el proyecto

### 1. Clonar el repositorio

bash
git clone https://github.com/ezequielgoy/fswebdevelopment.git
cd fswebdevelopment

### 2. Instalar dependencias
cd backend
npm install


### 2. Instalar dependencias
cd ../frontend
npm install

### 3. Configurar Variables de entorno dentro del backend
MONGODB_URI= mongodb+srv://<db_username>:<db_password>@fswebdevelopment.uhbho1g.mongodb.net/

 ### 4.Iniciar los servidores

cd backend
npm start

cd frontend
npm start


### Funcionalidades principales
Selección de fecha y hora con validaciones (selector personalizado).

Registro de orden con productos y reglas de seguridad.

Panel de administrador para ver órdenes existentes.

Navegación con React Router DOM.

Comunicación frontend-backend mediante Axios.

Validaciones y controladores organizados por responsabilidad (MVC).

### Notas adicionales

No llegue a hacer que calcule el total en el front para poder mostrar el precio antes de hacer la reserva

Los equipos de seguridad se indican indiferentemente la empresa cuenta con 2 equipos de seguridad por cada cuatricilo y jetsky correspondiente

El proyecto no utiliza autenticación de usuarios.

Los datos se almacenan en una base MongoDB local o remota.

El selector de hora (DateTimeSelector) permite modos de selección única o por rango.

La UI es moderna y minimalista, con estilos organizados por página