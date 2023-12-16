use serde::{Deserialize, Serialize};

#[derive(
    Debug, Clone, Serialize, Deserialize, Queryable, Insertable, QueryableByName, PartialEq,
)]
#[diesel(table_name = crate::schema::permissions)]
pub struct Permission {
    pub id: Option<i32>,
    pub name: String,
    pub active: bool,
}

#[derive(
    Debug, Clone, Serialize, Deserialize, Queryable, Insertable, QueryableByName, PartialEq,
)]
#[diesel(table_name = crate::schema::role_permissions)]
pub struct RolePermission {
    pub id: Option<i32>,
    pub role_id: i32,
    pub permission_id: i32,
}

#[derive(
    Debug, Clone, Serialize, Deserialize, Queryable, Insertable, QueryableByName, PartialEq,
)]
#[diesel(table_name = crate::schema::roles)]
pub struct Role {
    pub id: i32,
    pub name: String,
    pub company_name: String,
    pub active: bool,
}

#[derive(
    Debug, Clone, Serialize, Deserialize, Queryable, Insertable, QueryableByName, PartialEq,
)]
#[diesel(table_name = crate::schema::companies)]
pub struct Company {
    pub id: i32,
    pub name: String,
    pub active: bool,
}

#[derive(
    Debug, Clone, Serialize, Deserialize, Queryable, Insertable, QueryableByName, PartialEq,
)]
#[diesel(table_name = crate::schema::auth_users)]
pub struct AuthUser {
    pub id: i32,
    pub name: String,
    pub password: String,
    pub email_address: String,
    pub created_at: chrono::NaiveDateTime,
    pub updated_at: chrono::NaiveDateTime,
    pub created_by: i32,
    pub updated_by: i32,
    pub active: bool,
}

#[derive(
    Debug, Clone, Serialize, Deserialize, Queryable, Insertable, QueryableByName, PartialEq,
)]
#[diesel(table_name = crate::schema::users)]
pub struct User {
    pub id: Option<i32>,
    pub name: String,
    pub active: bool,
}
