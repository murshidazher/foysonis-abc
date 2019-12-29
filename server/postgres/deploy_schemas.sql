-- Deploy fresh database tables

\i '/docker-entrypoint-initdb.d/tables/user_role.sql'
\i '/docker-entrypoint-initdb.d/tables/user_group.sql'
\i '/docker-entrypoint-initdb.d/tables/user_account.sql'
\i '/docker-entrypoint-initdb.d/tables/transaction_type.sql'
\i '/docker-entrypoint-initdb.d/tables/bank_account.sql'
\i '/docker-entrypoint-initdb.d/tables/transaction_log.sql'
\i '/docker-entrypoint-initdb.d/tables/permission.sql'
\i '/docker-entrypoint-initdb.d/tables/role_permission.sql'
\i '/docker-entrypoint-initdb.d/tables/credential.sql'

\i '/docker-entrypoint-initdb.d/seed/seed.sql'