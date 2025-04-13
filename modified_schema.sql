
-- Tabel titik
CREATE TABLE titik (
    id INT AUTO_INCREMENT PRIMARY KEY,
    latitude DOUBLE NOT NULL,
    longitude DOUBLE NOT NULL,
    name VARCHAR(255),
    description TEXT
);

-- Tabel users
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    UNIQUE (email)
);

-- Hak akses
GRANT SELECT, INSERT, DELETE, UPDATE ON `titik` TO 'admin'@'localhost';
GRANT SELECT, INSERT, DELETE, UPDATE ON `users` TO 'admin'@'localhost';

