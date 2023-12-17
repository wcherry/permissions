use actix_web::{get, web, Error, HttpResponse};
use diesel::{prelude::*, sql_query, sql_types::Integer, MysqlConnection};
use crate::model::Role;
use crate::common::{DbError, AppState, ServiceError};
use crate::auth::jwt_auth;
use log::info;


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

// #[permissions("permissions.roles.all.query")]
#[get("/roles")]
pub async fn get_all_roles(app_state: web::Data<AppState>,_jwt: jwt_auth::AuthenticatedUser) -> Result<HttpResponse, Error> {
    let roles = web::block(move || {
        let mut conn = app_state.pool.get()?;
        find_all_roles(&mut conn)
    })
    .await?
    .map_err(|err| ServiceError::InternalServerError(err.to_string()))?;

    info!("Returning {} roles", roles.len());
    Ok(HttpResponse::Ok().json(roles))
}

// #[permissions("permissions.role.query")]
#[get("/role/{role_id}")]
pub async fn get_role(
    app_state: web::Data<AppState>,
    _jwt: jwt_auth::AuthenticatedUser,
    path: web::Path<i32>,
) -> Result<HttpResponse, Error> {
    let role_id = path.into_inner();
    let role = web::block(move || {
        let mut conn = app_state.pool.get()?;
        find_role(&mut conn, role_id)
    })
    .await?
    .map_err(|err| ServiceError::InternalServerError(err.to_string()))?;

    Ok(HttpResponse::Ok().json(role))
}
