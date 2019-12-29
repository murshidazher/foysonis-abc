BEGIN TRANSACTION;

CREATE TABLE role_permission
(
    user_role_id INTEGER PRIMARY KEY REFERENCES user_role(id),
    permission_id INTEGER REFERENCES permission(id)
);

COMMIT;