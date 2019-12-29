BEGIN TRANSACTION;

CREATE TABLE credential
(
    id serial PRIMARY KEY,
    hash VARCHAR(100) NOT NULL,
    email text UNIQUE NOT NULL
);

COMMIT;