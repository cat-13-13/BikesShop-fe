# BikeShop (marKus-biKus) - Frontend

marKus-biKus es una plataforma de ecommerce diseñada para que Marcus, dueño de una tienda de bicicletas, pueda vender bicicletas totalmente personalizables y otros elementos deportivos online. El frontend está construido con **React**, utilizando **React Router** para el enrutamiento, **Bootstrap** para los estilos y **Axios** para la comunicación con la API.

## 🚲 Características Principales

- Visualización de productos personalizables.
- Cálculo de precio en tiempo real.
- Gestión de carrito de compra.
- Gestión de usuario y autenticación con JWT.
- Panel de administración para crear y editar productos.
- Lógica avanzada de precios condicionales y restricciones de opciones.

---

## 🧰 Stack Tecnológico

- **Frontend**: React.js, Bootstrap, React Router, Axios
- **Testing**: React Testing Library
- **Backend**: Node.js, Express, MongoDB (ver repositorio correspondiente)

---

## 📦 Instalación del Frontend

```bash
git clone https://github.com/tu-usuario/bikeshop-frontend.git
cd frontend
npm install
```

## ▶️ Ejecución en desarrollo
```bash
npm run start
```
Esto arrancará la aplicación en modo desarrollo en http://localhost:3000.

## 🗃️ Estructura del Proyecto
```pgsql
frontend/
├── public/
├── src/
│   ├── components/
│   ├── pages/
│   ├── services/
│   └── index.js
├── .env
├── package.json
└── README.md
```

## 🌐 Variables de Entorno
Crea un archivo .env en la raíz del proyecto con las siguientes variables:

```env
REACT_APP_API_URL=http://localhost:5005/api
```

## ⚙️ Scripts disponibles
```bash
npm start       # Ejecuta la app en desarrollo
npm run build   # Compila la app para producción
```

## 🧩 Componentes clave

### Cliente

- **ProductsListPage**: lista de productos disponibles.
- **ProductDetailsPage**: personalización dinámica de productos.
- **NewProductForm**: formulario de creación de producto (solo admin).
- **EditProductForm**: edición de producto desde un modal.
- **SearchBar**: búsqueda por nombre.

### Funcionalidades avanzadas

- **`getImageUrl()`**: genera dinámicamente una imagen SVG según la personalización.
- **`calculateTotalPrice()`**: suma precio base, precios adicionales y aplica condiciones.
- Control de estado con **`useState`**, **`useEffect`** y **`useContext`**.

---

## 👥 Gestión de Usuarios

- Registro e inicio de sesión
- Verificación de sesión
- Edición y eliminación de usuarios
- Carrito y compra de productos personalizados
- Historial de pedidos

---

## 🛠️ Panel de Administración

Acciones disponibles solo para usuarios con rol `ADMIN`:

- Crear, editar y eliminar productos.
- Definir partes personalizables, precios condicionales y combinaciones inválidas.
- Gestionar stock de cada opción.

---

## 📈 Roadmap

- 🔐 Integración con Stripe (pasarela de pago)
- 📊 Filtros avanzados por partes y precio
- 🧮 Gestión de stock automatizada
- 📦 Mejora del sistema de inventario
