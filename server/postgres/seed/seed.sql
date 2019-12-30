BEGIN TRANSACTION;

INSERT INTO  transaction_type (name, description, amount) VALUES ('Deposit', 'Amount of money held at the bank', 0);

INSERT INTO  transaction_type (name, description, amount) VALUES ('Withdrawal', 'Amount of money taken from the bank account', 15);


INSERT INTO user_group (name, description) VALUES ('Emploryee', 'A person endowed by ABC bank to look after transactions.');

INSERT INTO user_group (name, description) VALUES ('Customer', 'A person who requires the services of ABC bank.');



INSERT INTO user_role (name, description) VALUES ('Administrator', 'A person responsible for carrying out the administration of ABC bank.');

INSERT INTO user_role (name, description) VALUES ('Bank Officer', 'A person responsible for carrying out daily activities of ABC bank.');

INSERT INTO user_role (name, description) VALUES ('Account Holder', 'A person who has an account at ABC bank.');


INSERT INTO permission (name) VALUES ('ALL');
INSERT INTO permission (name) VALUES ('MID');
INSERT INTO permission (name) VALUES ('LOW');
INSERT INTO permission (name) VALUES ('NONE');


INSERT INTO role_permission (user_role_id, permission_id)
SELECT r.id, p.id
FROM user_role r, permission p
WHERE r.name='Account Holder'
AND p.name='LOW';

INSERT INTO role_permission (user_role_id, permission_id)
SELECT r.id, p.id
FROM user_role r, permission p
WHERE r.name='Administrator'
AND p.name='ALL';

INSERT INTO role_permission (user_role_id, permission_id)
SELECT r.id, p.id
FROM user_role r, permission p
WHERE r.name='Bank Officer'
AND p.name='MID';



INSERT INTO user_account (name, email, joined, group_id, user_role_id) 
SELECT 'Admin', 'admin@test.com', NOW(), g.id, u.id
FROM user_group g, user_role u
WHERE g.name='Employee'
AND u.name='Administrator';


INSERT INTO credential (hash, email) 
VALUES ('$2a$10$YeJlNWzfcyvrr22GUGT2oeeUXKTsRP1n45IQugduxET/t/EOgf//K', 'admin@test.com');

INSERT INTO user_account (name, email, joined, group_id, user_role_id) 
SELECT 'Officer', 'test@test.com', NOW(), g.id, u.id
FROM user_group g, user_role u
WHERE g.name='Employee'
AND u.name='Bank Officer';

INSERT INTO credential (hash, email) 
VALUES ('$2a$10$sDe0D3Luw3RKNgTqndSfKOw0D0jqJF2.8gIJztHbQdHOe0exdlrI6', 'test@test.com');


INSERT INTO user_account (name, email, joined, group_id, user_role_id) 
SELECT 'Isobelle Patterson', 'belle@gmail.com', NOW(), g.id, u.id
FROM user_group g, user_role u
WHERE g.name='Customer'
AND u.name='Account Holder';

INSERT INTO credential (hash, email) 
VALUES ('$2a$10$fbe/V4wRBu.PlOapvMO0.ewm2Rxi5n8xjtpbvFtTIYm2DTEsTIJvK', 'belle@gmail.com');

INSERT INTO bank_account (balance, user_id, last_transaction_id) 
SELECT 0, u.id, 0
FROM user_account u
WHERE u.name='Isobelle Patterson';


COMMIT;

