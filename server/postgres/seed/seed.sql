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


INSERT INTO user_account
    (name, email, entries, joined, phone, city)
VALUES
    (
        'Isobelle Patterson',
        'belle@gmail.com',
        '0',
        '2019-10-05 08:53:16.687',
        '853 243 764 02',
        'Arkansas'
);




INSERT INTO user_account (name, email, joined, group_id, user_role_id) 
SELECT 'Admin', 'admin@test.com', NOW(), g.id, u.id
FROM user_group g, user_role u
WHERE g.name='Customer'
AND u.name='Account Holder';


INSERT INTO credential (hash, email) 
VALUES ('$2a$10$IUZWPT6q4QaEkXLLqDX3Du66d1u3lJXaJaaAdkWVKIpl.c/MqNDRy', 'admin@test.com');

INSERT INTO user_account (name, email, joined, group_id, user_role_id) 
SELECT 'Officer', 'test@test.com', NOW(), g.id, u.id
FROM user_group g, user_role u
WHERE g.name='Employee'
AND u.name='Bank Officer';

INSERT INTO credential (hash, email) 
VALUES ('$2a$10$0fetMndoOk3k4bzCE7UpVOW6xMTL8Yv9C5sxSlkTMsu/5rbL3WVYS', 'test@test.com');


INSERT INTO user_account (name, email, joined, group_id, user_role_id) 
SELECT 'Isobelle Patterson', 'belle@gmail.com', NOW(), g.id, u.id
FROM user_group g, user_role u
WHERE g.name='Account Holder'
AND u.name='Account Holder';

INSERT INTO credential (hash, email) 
VALUES ('$2a$10$7ujfGO.aeGvLsu4LHhS1XeBhsw4KP5f/o8rXYR36aXnCHmp7xuR/q', 'belle@gmail.com');

INSERT INTO bank_account (balance, user_id, last_transaction_id, opened) 
SELECT 0, 'belle@gmail.com', g.id, 0, NOW()
FROM user_account u
WHERE u.name='Isobelle Patterson';


COMMIT;

