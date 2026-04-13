CREATE TABLE chauffeurs (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  prenom VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  telephone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role ENUM('chauffeur', 'admin') DEFAULT 'chauffeur',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE clients (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(100) NOT NULL,
  email VARCHAR(150) NOT NULL UNIQUE,
  telephone VARCHAR(20),
  password VARCHAR(255) NOT NULL,
  role ENUM('client', 'admin') DEFAULT 'client',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE adresses (
  id INT AUTO_INCREMENT PRIMARY KEY,
  rue VARCHAR(255) NOT NULL,
  ville VARCHAR(100) NOT NULL,
  code_postal VARCHAR(10) NOT NULL,
  pays VARCHAR(100) NOT NULL DEFAULT 'France',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE marchandises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  nom VARCHAR(150) NOT NULL,
  poids DECIMAL(10,2) NOT NULL,
  volume DECIMAL(10,2) NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

CREATE TABLE tournees (
  id INT AUTO_INCREMENT PRIMARY KEY,
  date DATE NOT NULL,
  chauffeur_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (chauffeur_id) REFERENCES chauffeurs(id)
);

CREATE TABLE livraisons (
  id INT AUTO_INCREMENT PRIMARY KEY,
  heure_prevue DATETIME,
  statut ENUM('en_attente', 'en_cours', 'livree', 'echouee') DEFAULT 'en_attente',
  tournee_id INT NOT NULL,
  client_id INT NOT NULL,
  adresse_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (tournee_id) REFERENCES tournees(id),
  FOREIGN KEY (client_id) REFERENCES clients(id),
  FOREIGN KEY (adresse_id) REFERENCES adresses(id)
);

CREATE TABLE livraison_marchandises (
  id INT AUTO_INCREMENT PRIMARY KEY,
  quantite INT NOT NULL,
  livraison_id INT NOT NULL,
  marchandise_id INT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  FOREIGN KEY (livraison_id) REFERENCES livraisons(id),
  FOREIGN KEY (marchandise_id) REFERENCES marchandises(id)
);


-- Insérer un utilisateur admin par défaut (pour se login il faut email : "admin@legendre.fr" et password : "SecurePassword123")
INSERT INTO chauffeurs (nom, prenom, email, telephone, password, role)
VALUES ('Admin', 'Super', 'admin@legendre.fr', '0600000000', '$2b$10$7.z5FG0PMm/BWiu8J4TSZuS3l/SfTxjMnkEj.haefNUd2zV9iZ7kC', 'admin');

-- Adresses
INSERT INTO adresses (rue, ville, code_postal, pays) VALUES
('12 rue de la Paix', 'Paris', '75001', 'France'),
('45 avenue Victor Hugo', 'Lyon', '69002', 'France'),
('8 boulevard des Capucines', 'Marseille', '13001', 'France');

-- Marchandises
INSERT INTO marchandises (nom, poids, volume) VALUES
('Palettes de bois', 50.00, 2.50),
('Cartons alimentaires', 20.00, 1.20),
('Equipement informatique', 15.00, 0.80);

-- Clients (password = "password")
INSERT INTO clients (nom, email, telephone, password, role) VALUES
('Martin Sophie', 'sophie.martin@email.com', '0611111111', '$2b$10$7.z5FG0PMm/BWiu8J4TSZuS3l/SfTxjMnkEj.haefNUd2zV9iZ7kC', 'client'),
('Bernard Paul', 'paul.bernard@email.com', '0622222222', '$2b$10$7.z5FG0PMm/BWiu8J4TSZuS3l/SfTxjMnkEj.haefNUd2zV9iZ7kC', 'client');

-- Chauffeurs (password = "password")
INSERT INTO chauffeurs (nom, prenom, email, telephone, password, role) VALUES
('Legendre', 'Marc', 'marc.legendre@legendre.fr', '0633333333', '$2b$10$7.z5FG0PMm/BWiu8J4TSZuS3l/SfTxjMnkEj.haefNUd2zV9iZ7kC', 'chauffeur'),
('Dubois', 'Pierre', 'pierre.dubois@legendre.fr', '0644444444', '$2b$10$7.z5FG0PMm/BWiu8J4TSZuS3l/SfTxjMnkEj.haefNUd2zV9iZ7kC', 'chauffeur');

-- Tournees (utilise les id des chauffeurs insérés)
INSERT INTO tournees (date, chauffeur_id) VALUES
('2026-04-14', 1),
('2026-04-14', 2);

-- Livraisons
INSERT INTO livraisons (heure_prevue, statut, tournee_id, client_id, adresse_id) VALUES
('2026-04-14 09:00:00', 'en_attente', 1, 1, 1),
('2026-04-14 11:00:00', 'en_attente', 1, 2, 2),
('2026-04-14 14:00:00', 'en_cours', 2, 1, 3);

-- Livraison_marchandises
INSERT INTO livraison_marchandises (quantite, livraison_id, marchandise_id) VALUES
(2, 1, 1),
(5, 1, 2),
(1, 2, 3),
(3, 3, 2);
