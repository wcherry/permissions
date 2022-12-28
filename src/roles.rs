use actix_web::{get, web, Error, HttpResponse};
use diesel::{prelude::*, sql_query, sql_types::Integer, MysqlConnection};
use serde::{Deserialize, Serialize};

use crate::common::{DbError, DbPool, ServiceError};

use log::info;

#[derive(
    Debug, Clone, Serialize, Deserialize, Queryable, Insertable, QueryableByName, PartialEq,
)]
#[diesel(table_name = crate::schema::users)]
struct User {
    pub id: i32,
    pub name: String,
    pub active: bool,
}

#[derive(
    Debug, Clone, Serialize, Deserialize, Queryable, Insertable, QueryableByName, PartialEq,
)]
#[diesel(table_name = crate::schema::roles)]
struct Role {
    pub id: i32,
    pub name: String,
    pub company_name: String,
    pub active: bool,
}

fn find_all_roles(conn: &mut MysqlConnection) -> Result<Vec<Role>, DbError> {
    let roles = sql_query("SELECT r.id, r.name, r.active, c.name company_name FROM roles r join companies c on r.company_id = c.id")
        .get_results(conn)?;
    Ok(roles)
}

fn find_role(conn: &mut MysqlConnection, role_id: i32) -> Result<Role, DbError> {
    let role = sql_query("SELECT r.id, r.name, r.active, c.name company_name FROM roles r join companies c on r.company_id = c.id where r.id=?")
    .bind::<Integer, _>(role_id)
        .get_result(conn)?;
    Ok(role)
}

#[get("/roles")]
pub async fn get_all_roles(pool: web::Data<DbPool>) -> Result<HttpResponse, Error> {
    let roles = web::block(move || {
        let mut conn = pool.get()?;
        find_all_roles(&mut conn)
    })
    .await?
    .map_err(|err| ServiceError::InternalServerError(err.to_string()))?;

    info!("Returning {} roles", roles.len());
    Ok(HttpResponse::Ok().json(roles))
}

#[get("/role/{role_id}")]
pub async fn get_role(
    pool: web::Data<DbPool>,
    path: web::Path<i32>,
) -> Result<HttpResponse, Error> {
    let role_id = path.into_inner();
    let role = web::block(move || {
        let mut conn = pool.get()?;
        find_role(&mut conn, role_id)
    })
    .await?
    .map_err(|err| ServiceError::InternalServerError(err.to_string()))?;

    Ok(HttpResponse::Ok().json(role))
}
