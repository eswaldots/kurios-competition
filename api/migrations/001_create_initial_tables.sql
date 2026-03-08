
-- podria haber creado una tabla secundaria para tener la fecha exacta de los intentos y las muertes,  tambien, el user_id, pero la verdad es que no necesitamos eso por los momentos
CREATE TABLE IF NOT EXISTS levels (
    id INTEGER PRIMARY KEY,         
    attempts INTEGER DEFAULT 0,   
    deaths INTEGER DEFAULT 0, 
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    alias VARCHAR(20) UNIQUE NOT NULL,
    score INTEGER DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
