# Sinapsis Campaigns - Backend

Backend para la gestión y simulación del envío de campañas de marketing por SMS.  
Desarrollado como parte de una prueba técnica para el puesto **Full Stack Semi Senior**.

---

## Arquitectura y Stack

- **Node.js 18**
- **TypeScript**
- **Serverless Framework**
- **AWS Lambda (simulado con serverless-offline)**
- **MySQL**
- **OpenAPI 3 (documentación)**
- **serverless-offline** para desarrollo local

Arquitectura orientada a dominios (campaigns, messages), siguiendo buenas prácticas de mantenibilidad y escalabilidad.

---

## Estructura del Proyecto
```bash

├── src/
│ ├── handlers/
│ ├── services/
│ ├── models/
│ ├── config/
│ ├── types/
│ └── utils/
└── README.md
├── openapi.yaml
├── serverless.ts

```
---

## Requisitos Previos

    - Node.js >= 18
    - npm >= 9
    - MySQL >= 8
    - Serverless Framework

```bash
Instalar Serverless Framework de forma global:
    npm install -g serverless
```


## Base de Datos

    La base de datos se ejecuta en un entorno de MySQL

    Nombre de la Base de Datos : campaigns_db
    Collation: utf8mb4_unicode_ci
Script de Creación de Base de Datos - MySQL
```bash

    CREATE DATABASE IF NOT EXISTS campaigns_db;
    USE campaigns_db;

    CREATE TABLE customers (
        id INT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(255) NOT NULL,
        status BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
    )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE users (
        id INT PRIMARY KEY AUTO_INCREMENT,
        customer_id INT NOT NULL,
        username VARCHAR(100) NOT NULL UNIQUE,
        status BOOLEAN DEFAULT TRUE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (customer_id) REFERENCES customers(id) ON DELETE CASCADE
    )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE campaigns (
        id INT PRIMARY KEY AUTO_INCREMENT,
        user_id INT NOT NULL,
        name VARCHAR(255) NOT NULL,
        process_date DATE NOT NULL,
        process_hour TIME NOT NULL,
        process_status INT DEFAULT 1, -- 1: pendiente, 2: en proceso, 3: finalizada
        phone_list TEXT NOT NULL,
        message_text TEXT NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE TABLE messages (
        id INT PRIMARY KEY AUTO_INCREMENT,
        campaign_id INT NOT NULL,
        phone VARCHAR(20) NOT NULL,
        text TEXT NOT NULL,
        shipping_status INT DEFAULT 1, -- 1: pendiente, 2: enviado, 3: error
        process_date DATE,
        process_hour TIME,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
        FOREIGN KEY (campaign_id) REFERENCES campaigns(id) ON DELETE CASCADE
    )ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

    CREATE INDEX idx_campaigns_process_status ON campaigns(process_status);
    CREATE INDEX idx_campaigns_process_date ON campaigns(process_date);
    CREATE INDEX idx_messages_campaign_id ON messages(campaign_id);
    CREATE INDEX idx_messages_shipping_status ON messages(shipping_status);
    CREATE INDEX idx_users_customer_id ON users(customer_id);
```
Datos Iniciales (Seed)
```bash

    INSERT INTO customers (id, name, status) VALUES
    (1, 'TechSolutions SAC.', true),
    (2, 'Retail SAC', true),
    (3, 'Sinapsis', true),
    (4, 'EduSystems SA.', true),
    (5, 'Transports SA', true);

    INSERT INTO users (id, customer_id, username, status) VALUES
    (1, 1, 'juan.perez', true),
    (2, 1, 'ana.gomez', true),
    (3, 2, 'carlos.lopez', false),
    (4, 3, 'maria.rodriguez', true),
    (5, 4, 'pedro.martinez', true);

    INSERT INTO campaigns (id, user_id, name, process_date, process_hour, process_status, phone_list, message_text) VALUES
    (1, 1, 'Campaña Navidad 2025', '2024-12-20', '10:30:00', 2, '+123456789,+987654321', '¡Felices Fiestas! Descuento especial del 20%'),
    (2, 2, 'Promo Verano', '2024-07-15', '14:00:00', 1, '+112233445,+556677889', 'Disfruta del verano con nuestras ofertas exclusivas'),
    (3, 3, 'Recordatorio Pago', '2024-01-10', '09:15:00', 3, '+998877665', 'Recordatorio: Su pago vence el 15 de enero'),
    (4, 4, 'Nuevos Cursos', '2024-03-01', '16:45:00', 2, '+443322110,+667788990', 'Inscríbete a nuestros nuevos cursos disponibles'),
    (5, 5, 'Seguimiento Envío', '2024-11-05', '11:20:00', 1, '+112233445,+998877665', 'Su paquete ha sido enviado. N° seguimiento: TRK789456');

    INSERT INTO messages (id, campaign_id, phone, text, shipping_status, process_date, process_hour) VALUES
    (1, 1, '+123456789', '¡Felices Fiestas! Descuento especial del 20%', 1, '2024-12-20', '10:31:00'),
    (2, 1, '+987654321', '¡Felices Fiestas! Descuento especial del 20%', 2, '2024-12-20', '10:32:00'),
    (3, 2, '+112233445', 'Disfruta del verano con nuestras ofertas exclusivas', 1, '2024-07-15', '14:01:00'),
    (4, 2, '+556677889', 'Disfruta del verano con nuestras ofertas exclusivas', 3, '2024-07-15', '14:02:00'),
    (5, 3, '+998877665', 'Recordatorio: Su pago vence el 15 de enero', 2, '2024-01-10', '09:16:00');
```
## Clonar Repositorio

Clonar el proyecto

```bash
  git clone https://github.com/JesusChungaGuizado/sinapsis_campaigns_backend-.git
```

Ir al directorio del proyecto

```bash
  cd my-project
```
##  Variables de Entorno

Crear un archivo .env en la raíz del proyecto:

Las variables de entorno son cargadas mediante serverless-dotenv-plugin.

```bash
DB_HOST=127.0.0.1
DB_USER=user
DB_PORT=3306
DB_PASSWORD=password
DB_NAME=campaigns_db

API_PREFIX=api/v1

```
## Instalación de Dependencias
```bash
npm install
```

## Ejecución en Desarrollo
```bash
"sls:dev": "sls offline --stage develop --region us-east-1"

Ejecutar el backend
    npm run sls:dev
```

## Endpoints Principales
```bash

| Método | Endpoint                 | Descripción                         |
| ------ | ------------------------ | ----------------------------------- |
| POST   | /campaigns               | Crear campaña                       |
| POST   | /campaigns/{id}/process  | Procesar campaña                    |
| GET    | /campaigns               | Listar campañas por rango de fechas |
| GET    | /campaigns/{id}/messages | Ver mensajes de una campaña         |

```

## Documentación OpenAPI
La documentación de la API está definida usando OpenAPI 3 en el archivo:

```bash
openapi.yaml
```

Puede ser visualizada mediante: https://editor.swagger.io
