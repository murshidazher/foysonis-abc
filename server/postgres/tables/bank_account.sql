BEGIN TRANSACTION;

CREATE TABLE bank_account
(
    id serial PRIMARY KEY,
    balance DECIMAL DEFAULT 0,
    opened TIMESTAMP NOT NULL DEFAULT NOW(),
    user_id INTEGER NOT NULL,
    last_transaction_id INTEGER 
);

COMMIT;