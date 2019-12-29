BEGIN TRANSACTION;

CREATE TABLE bank_account
(
    id serial PRIMARY KEY,
    balance DECIMAL DEFAULT 0,
    opened TIMESTAMP NOT NULL,
    user_id INTEGER NOT NULL REFERENCES user_account(id),
    last_transaction_id INTEGER REFERENCES transaction_log(id),
);

COMMIT;