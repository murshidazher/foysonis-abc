BEGIN TRANSACTION;

CREATE TABLE transaction_type
(
    id serial PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description VARCHAR(1000),
    amount DECIMAL DEFAULT 0
);

COMMIT;