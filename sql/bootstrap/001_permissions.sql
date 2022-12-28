insert into permissions (id, name) values 
  (2,'alpha.user.query'),
  (3,'alpha.user.update'),
  (4,'alpha.user.create'),
  (5,'alpha.user.delete'),
  (6,'beta.user.query'),
  (7,'beta.user.update'),
  (8,'beta.user.create'),
  (9,'beta.user.delete');

insert into users (id, name) values
  (1,'frank'),
  (2,'ted'),
  (3,'betty'),
  (4,'william');

insert into companies (name) values
  (1,'BigTech'),
  (2,'AcmeCo');

insert into user_company_permissions (user_id, company_id, permission_id) values
  (4,1,2),
  (4,1,3),
  (4,1,4);

 insert into roles (name, company_id) values
  (1, 'admin', 1),
  (2, 'guest', 2);

insert into role_permissions (role_id, permission_id) values 
 (1,7),
 (1,8),
 (1,9),
 (2,5),
 (2,6);

insert into user_roles (user_id, company_id, role_id) values
  (4,1,1);
