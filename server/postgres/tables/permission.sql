BEGIN TRANSACTION;

CREATE TABLE permission
(
    id serial PRIMARY KEY,
    name VARCHAR(100),
);

COMMIT;