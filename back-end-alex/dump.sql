CREATE DATABASE IF NOT EXISTS devhub;
USE devhub;

CREATE TABLE IF NOT EXISTS usuario (
    id INT PRIMARY KEY AUTO_INCREMENT,
    nome VARCHAR(100),
    idade INT,
    email VARCHAR(100) UNIQUE,
    senha VARCHAR(100)
);

CREATE TABLE IF NOT EXISTS lgs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    categoria TEXT,
    horas_trabalhadas INT,
    linhas_codigo INT,
    bugs_corrigidos INT,
    user_id INT,
    FOREIGN KEY (user_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS `like` (
    id INT PRIMARY KEY AUTO_INCREMENT,
    log_id INT,
    user_id INT,
    FOREIGN KEY (log_id) REFERENCES lgs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES usuario(id) ON DELETE CASCADE
);

CREATE TABLE IF NOT EXISTS comment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    log_id INT,
    user_id INT,
    conteudo TEXT,
    FOREIGN KEY (log_id) REFERENCES lgs(id) ON DELETE CASCADE,
    FOREIGN KEY (user_id) REFERENCES usuario(id) ON DELETE CASCADE
);
