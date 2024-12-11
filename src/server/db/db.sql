CREATE TABLE users(
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    email VARCHAR(255),
    password VARCHAR(255),
    status INT
);

CREATE TABLE goods_categories (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    parent_id INT,
    CONSTRAINT fk_parent_category
        FOREIGN KEY (parent_id)
        REFERENCES goods_categories(id)
        ON DELETE SET NULL
);

CREATE TABLE goods (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    description TEXT,
    price NUMERIC(10, 2) NOT NULL,
    category_id SERIAL NOT NULL,
    photos TEXT[],
    CONSTRAINT fk_category
        FOREIGN KEY (category_id)
        REFERENCES goods_categories(id)
        ON DELETE CASCADE
);

ALTER TABLE goods
ADD COLUMN discount INT DEFAULT 0;

ALTER TABLE goods
ADD COLUMN article VARCHAR(255) DEFAULT NULL;

ALTER TABLE goods_categories
ADD COLUMN photo TEXT DEFAULT NULL;

ALTER TABLE goods
ADD COLUMN brand VARCHAR(255) DEFAULT NULL;

ALTER TABLE goods
ADD COLUMN stock INT DEFAULT 0;