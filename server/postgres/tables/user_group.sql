BEGIN TRANSACTION;

CREATE TABLE user_group
(
    id serial PRIMARY KEY,
    name VARCHAR(100),
    description VARCHAR(1000)
);

COMMIT;