--
-- USERS are the top of the hierarchy
-- USERS are related to ROLES by USER_ROLE_COMPANIES
-- ROLES have many PERMISSIONS by ROLE_PERMISSIONS
-- USERS can also have their own PERMISSIONS by USER_COMPANY_PERMISSIONS
--
-- A special permission '_.DUMMY._' is available to use if you need to provide only
-- role based permissions
--
CREATE TABLE permissions(
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(256) NOT NULL UNIQUE,
        active BOOL NOT NULL DEFAULT true);

CREATE TABLE roles(
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(256) NOT NULL,
        company_id BIGINT NOT NULL,
        active BOOL NOT NULL DEFAULT true);

CREATE TABLE users(
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(256) NOT NULL UNIQUE,
        active BOOL NOT NULL DEFAULT true);

CREATE TABLE companies(
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        name VARCHAR(256) NOT NULL UNIQUE,
        active BOOL NOT NULL DEFAULT true);

CREATE TABLE user_roles(
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        user_id BIGINT NOT NULL,
        role_id BIGINT NOT NULL,
        company_id BIGINT NOT NULL,
        FOREIGN KEY (user_id) REFERENCES users(id),
        FOREIGN KEY (role_id) REFERENCES roles(id),
        FOREIGN KEY (company_id) REFERENCES companies(id));

CREATE TABLE role_permissions(
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        role_id BIGINT NOT NULL,
        permission_id BIGINT NOT NULL,
    	FOREIGN KEY (role_id) REFERENCES roles(id),
        FOREIGN KEY (permission_id) REFERENCES permissions(id)
        constraint unique(role_id, permission_id));

CREATE TABLE user_company_permissions(
        id BIGINT PRIMARY KEY AUTO_INCREMENT,
        user_id BIGINT NOT NULL,
        company_id BIGINT NOT NULL,
        permission_id BIGINT NOT NULL);
        FOREIGN KEY (company_id) REFERENCES companies(id),
        FOREIGN KEY (permission_id) REFERENCES permissions(id));

insert into permissions (name) values ('_.DUMMY._');