use crate::common::{DbError, ServiceError, AppState};
use crate::model::Company;
use actix_web::{get, put, web, Error, HttpResponse, post};
use diesel::sql_types::{Integer, Text};
use diesel::{prelude::*, sql_query, MysqlConnection, insert_into};
use crate::auth::jwt_auth;
use log::info;


fn find_all_companies(conn: &mut MysqlConnection) -> Result<Vec<Company>, DbError> {
    let companies = sql_query("SELECT * FROM companies").get_results(conn)?;
    Ok(companies)
}

#[get("/companies")]
pub async fn get_companies(app_state: web::Data<AppState>,jwt: jwt_auth::JwtMiddleware) -> Result<HttpResponse, Error> {
    let auth_id = jwt.user_id;
    
    let all_companies = web::block(move || {
        let mut conn = app_state.pool.get()?;
        find_all_companies(&mut conn)
    })
    .await?
    .map_err(|err| ServiceError::InternalServerError(err.to_string()))?;

    info!("Returning {} companies", all_companies.len());
    Ok(HttpResponse::Ok().json(all_companies))
}
