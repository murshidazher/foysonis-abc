BEGIN TRANSACTION;

CREATE TABLE transaction_log
(
    id serial PRIMARY KEY,
    t_date TIMESTAMP NOT NULL,
    t_type_id SMALLINT NOT NULL,
    t_amount DECIMAL NOT NULL,
    new_balance DECIMAL NOT NULL,
    bank_account_id INTEGER NOT NULL REFERENCES bank_account(id),
    user_account_id INTEGER NOT NULL REFERENCES user_account(id)
);

COMMIT;