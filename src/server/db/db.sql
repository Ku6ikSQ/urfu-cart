CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    status INT
);

CREATE TABLE goodscategories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id SERIAL,
    CONSTRAINT fk_parent_category
        FOREIGN KEY (parent_id)
        REFERENCES goodscategories(id)
        ON DELETE SET NULL
);

CREATE TABLE goods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    category_id INTEGER NOT NULL,
    photos TEXT[],
    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES goodscategories(id)
        ON DELETE CASCADE
);
