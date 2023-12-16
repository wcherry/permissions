insert into auth_users (name, email_address, password) values
  ('admin', 'admin@dev.null', '$argon2id$v=19$m=19456,t=2,p=1$Bg7Of0oEBrTHsOsivVWl3w$xi2Dg/B/4VBNrDModmxG4avdeKsg4RBN+st6sKbn0r4');


insert into permissions (id, name) values 
  (2,'permissions.permissions.all.query'),
  (3,'permissions.permissions.users.query'),
  (4,'permissions.permissions.roles.query'),
  (5,'permissions.roles.all.query'),
  (6,'permissions.role.query'),
  (7,'permissions.users.all.query'),
  (8,'permissions.user.query'),
  (9,'permissions.user.create');

insert into users (id, name) values
  (1,'admin');

insert into companies (id, name) values
  (1,'DEFAULT');

-- insert into user_company_permissions (user_id, company_id, permission_id) values
--   (4,1,2),
--   (4,1,3),
--   (4,1,4);

 insert into roles (id, name, company_id) values
  (1, 'admin', 1);

insert into role_permissions (role_id, permission_id) values 
 (1,1),
 (1,2),
 (1,3),
 (1,4),
 (1,5),
 (1,6),
 (1,7),
 (1,8),
 (1,9);


insert into user_roles (user_id, company_id, role_id) values
  (1,1,1);
