CREATE DATABASE IF NOT EXISTS campaigns_db;

USE campaigns_db;

CREATE TABLE customers (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(255) NOT NULL,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    customer_id INT NOT NULL,
    username VARCHAR(100) NOT NULL UNIQUE,
    status BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (customer_id) REFERENCES customers (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

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
    FOREIGN KEY (user_id) REFERENCES users (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

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
    FOREIGN KEY (campaign_id) REFERENCES campaigns (id) ON DELETE CASCADE
) ENGINE = InnoDB DEFAULT CHARSET = utf8mb4 COLLATE = utf8mb4_unicode_ci;

CREATE INDEX idx_campaigns_process_status ON campaigns (process_status);
CREATE INDEX idx_campaigns_process_date ON campaigns (process_date);
CREATE INDEX idx_messages_campaign_id ON messages (campaign_id);
CREATE INDEX idx_messages_shipping_status ON messages (shipping_status);
CREATE INDEX idx_users_customer_id ON users (customer_id);


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