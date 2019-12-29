BEGIN TRANSACTION;

CREATE TABLE user_account
(
    id serial PRIMARY KEY,
    name VARCHAR(100),
    email text UNIQUE NOT NULL,
    joined TIMESTAMP NOT NULL,
    group_id INTEGER NOT NULL REFERENCES user_group(id),
    user_role_id INTEGER NOT NULL REFERENCES user_role(id)
);

COMMIT;