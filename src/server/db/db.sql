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

-- ITER2
ALTER TABLE goods
ADD COLUMN brand VARCHAR(255) DEFAULT NULL;

ALTER TABLE goods
ADD COLUMN stock INT DEFAULT 0;

CREATE TABLE Cart (
    id SERIAL PRIMARY KEY,
    user_id INT UNIQUE NOT NULL
);

CREATE TABLE CartItems (
    id SERIAL PRIMARY KEY,
    cart_id INT NOT NULL,
    goods_id INT NOT NULL,
    count INT NOT NULL,
    selected BOOLEAN DEFAULT TRUE,
    FOREIGN KEY (cart_id) REFERENCES Cart(id) ON DELETE CASCADE
);

CREATE TABLE metrics (
    id SERIAL PRIMARY KEY,
    goods_id INT NOT NULL,
    views INT DEFAULT 0,
    add_to_cart_count INT DEFAULT 0,
    order_count INT DEFAULT 0,
    FOREIGN KEY (goods_id) REFERENCES goods(id) ON DELETE CASCADE
);


ALTER TABLE CartItems
ADD CONSTRAINT fk_goods
FOREIGN KEY (goods_id) REFERENCES goods(id) ON DELETE CASCADE;


ALTER TABLE metrics
ADD COLUMN metric_date DATE NOT NULL,
ADD CONSTRAINT unique_goods_date UNIQUE (goods_id, metric_date);


CREATE TABLE payments (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT
);

ALTER TABLE payments
ADD COLUMN logo VARCHAR(255);


CREATE TABLE delivery (
    id SERIAL PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    logo VARCHAR(255)
);


CREATE TABLE recipients (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    first_name VARCHAR(50) NOT NULL,
    last_name VARCHAR(50) NOT NULL,
    middle_name VARCHAR(50),
    address TEXT NOT NULL,
    zip_code VARCHAR(20),
    phone VARCHAR(20) NOT NULL
);

CREATE TABLE checkouts (
    id SERIAL PRIMARY KEY,
    user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
    recipient_id INTEGER REFERENCES recipients(id) ON DELETE CASCADE,
    cart_id INTEGER REFERENCES cart(id) ON DELETE CASCADE,
    payment_id INTEGER REFERENCES payments(id) ON DELETE CASCADE,
    delivery_id INTEGER REFERENCES delivery(id) ON DELETE CASCADE,
    payment_total NUMERIC(10, 2) NOT NULL
);
