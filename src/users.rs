use crate::{common::{DbError, ServiceError, AppState}, model::{User, Company}, schema::users};
// use crate::users;
use actix_web::{get, post, web, Error, HttpResponse};
use diesel::{insert_into, update, prelude::*, sql_query, sql_types::Integer, MysqlConnection};
use crate::auth::jwt_auth;
use log::info;
use serde::{Deserialize, Serialize};

#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
struct CompanyDto {
    pub id: i32,
    pub name: String,
    pub active: bool,
}


#[derive(Debug, Clone, Serialize, Deserialize, PartialEq)]
struct UserDto {
    pub id: i32,
    pub name: String,
    pub active: bool,
    pub companies: Vec<CompanyDto>,
}

fn insert_user(conn: &mut MysqlConnection, user: User) -> Result<usize, DbError> {
    // FORNOW: The Mysql Rust connection doesn't support the RETURNING clause
    // so there is no good way to return the record just inserted and not even
    // a good way to return the id of the last record inserted. Need to
    // investigate creating a transaction to
    // 1. insert a new user
    // 2. query the LAST_INSERT_ID() to get its id
    // 3. query the DB to get the newly inserted user
    // ref: https://github.com/diesel-rs/diesel/issues/1011
    // Code left in to denote the way we originally tried to solve this,
    // supposed to work on PG but not MySQL or SqlLite.
    // fn insert_user(conn: &mut MysqlConnection, user: User) -> Result<User, DbError> {
    // let result = insert_into(users).values(user).get_result(conn);
    // Ok(result.unwrap())

    let result = insert_into(users::dsl::users).values(user).execute(conn)?;

    info!("result {}", &result);
    Ok(result)
}

fn update_user(conn: &mut MysqlConnection, user: User) -> Result<usize, DbError> {
    let result = update(users::dsl::users.filter(users::id.eq(user.id)))
        .set((users::name.eq(user.name), users::active.eq(user.active)))
        .execute(conn)?;

    info!("result {}", &result);
    Ok(result)
}

fn find_all_users(conn: &mut MysqlConnection) -> Result<Vec<User>, DbError> {
    let users = sql_query("SELECT * FROM users").get_results(conn)?;
    Ok(users)
}

fn find_user_with_companies(conn: &mut MysqlConnection, user_id: i32) -> Result<UserDto, DbError> {
    let user = sql_query("SELECT * FROM users WHERE id=?")
        .bind::<Integer, _>(user_id)
        .get_result::<User>(conn)?;
    let companies = sql_query(
        r#"select unique c.name name, c.id, c.active 
  from companies c 
  join user_company_permissions ucp on c.id=ucp.company_id and ucp.user_id=?
  union select unique c.name name, c.id, c.active 
  from companies c 
  join user_roles ur on c.id=ur.company_id and ur.user_id=?;
  "#,
    )
    .bind::<Integer, _>(user_id)
    .bind::<Integer, _>(user_id)
    .get_results(conn)?;
    Ok(UserDto {
        id: user.id.unwrap(), // TODO: Proper handling of this error that should never happen
        name: user.name,
        active: user.active,
        companies: companies.into_iter().map(|it: Company| CompanyDto{id: it.id.unwrap(), name: it.name, active: it.active}).collect(),
    })
}

///
///  Gets all users
///
#[utoipa::path(
    get,
    tag = "Users",
    path = "/users",
    responses(
        (status = 200, description = "Successfully got all users", body = [User])
    )
)]
// #[permissions("permissions.users.all.query")]
#[get("/users")]
pub async fn get_users(app_state: web::Data<AppState>,jwt: jwt_auth::AuthenticatedUser) -> Result<HttpResponse, Error> {
    let _auth_id = jwt.user_id;
    
    let all_users = web::block(move || {
        let mut conn = app_state.pool.get()?;
        find_all_users(&mut conn)
    })
    .await?
    .map_err(|err| ServiceError::InternalServerError(err.to_string()))?;

    // if all_users.len() > 0 {
    info!("Returning {} users", all_users.len());
    Ok(HttpResponse::Ok().json(all_users))
    // } else {
    //     Err("Users".to_string()).map_err(|err| ServiceError::NotFound(err))?
    // }
}

///
///  Gets a user by their primary identifer
///
#[utoipa::path(
    get,
    tag = "Users",
    path = "/user/{user_id}",
    responses(
        (status = 200, description = "Successfully got the user by their id", body = User)
    )
)]
// #[permissions("permissions.user.query")]
#[get("/user/{user_id}")]
pub async fn get_user(
    app_state: web::Data<AppState>,
    _jwt: jwt_auth::AuthenticatedUser,
    path: web::Path<i32>,
) -> Result<HttpResponse, Error> {
    let user_id = path.into_inner();
    let user = web::block(move || {
        let mut conn = app_state.pool.get()?;
        find_user_with_companies(&mut conn, user_id)
    })
    .await?
    .map_err(|err| ServiceError::NotFound(err.to_string()))?;

    Ok(HttpResponse::Ok().json(user))
}

// #[permissions("permissions.user.create")]
#[post("/user")]
pub async fn create_user(
    app_state: web::Data<AppState>,
    _jwt: jwt_auth::AuthenticatedUser,
    web::Json(body): web::Json<User>,
) -> Result<HttpResponse, Error> {
    web::block(move || {
        let mut conn = app_state.pool.get()?;
        if body.id.is_none() {
            insert_user(&mut conn, body)
        } else {
            update_user(&mut conn, body)
        }
    })
    .await?
    .map_err(|err| ServiceError::BadRequest(err.to_string()))?;

    Ok(HttpResponse::Ok().json("Saved User"))
}
