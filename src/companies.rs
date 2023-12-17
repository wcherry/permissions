use crate::common::{DbError, ServiceError, AppState};
use crate::model::Company;
use crate::schema::companies;
use actix_web::{get, web, Error, HttpResponse, post};
use diesel::{prelude::*, sql_query, MysqlConnection, insert_into, update};
use crate::auth::jwt_auth;
use log::info;


fn find_all_companies(conn: &mut MysqlConnection) -> Result<Vec<Company>, DbError> {
    let companies = sql_query("SELECT * FROM companies").get_results(conn)?;
    Ok(companies)
}

fn insert_company(conn: &mut MysqlConnection, company: Company) -> Result<usize, DbError> {
    let result = insert_into(companies::dsl::companies).values(company).execute(conn)?;

    info!("result {}", &result);
    Ok(result)
}

fn update_company(conn: &mut MysqlConnection, company: Company) -> Result<usize, DbError> {
    let result = update(companies::dsl::companies.filter(companies::id.eq(company.id)))
        .set((companies::name.eq(company.name), companies::active.eq(company.active)))
        .execute(conn)?;

    info!("result {}", &result);
    Ok(result)
}


#[get("/companies")]
pub async fn get_companies(app_state: web::Data<AppState>,jwt: jwt_auth::AuthenticatedUser) -> Result<HttpResponse, Error> {
    let _auth_id = jwt.user_id;
    
    let all_companies = web::block(move || {
        let mut conn = app_state.pool.get()?;
        find_all_companies(&mut conn)
    })
    .await?
    .map_err(|err| ServiceError::InternalServerError(err.to_string()))?;

    info!("Returning {} companies", all_companies.len());
    Ok(HttpResponse::Ok().json(all_companies))
}

#[post("/company")]
pub async fn create_company(
    app_state: web::Data<AppState>,
    _jwt: jwt_auth::AuthenticatedUser,
    web::Json(body): web::Json<Company>,
) -> Result<HttpResponse, Error> {
    web::block(move || {
        let mut conn = app_state.pool.get()?;
        if body.id.is_none() {
            insert_company(&mut conn, body)
        } else {
            update_company(&mut conn, body)
        }
    })
    .await?
    .map_err(|err| ServiceError::BadRequest(err.to_string()))?;

    Ok(HttpResponse::Ok().json("Saved Compnay"))
}