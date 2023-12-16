use crate::common::DbError;
use crate::model::AuthUser;
use diesel::sql_types::VarChar;
use diesel::{prelude::*, sql_query, MysqlConnection};
// use log::info;

// use argon2::{
//     password_hash::{rand_core::OsRng, PasswordHasher, SaltString},
//     Argon2,
// };

pub fn find_user(conn: &mut MysqlConnection, username: String) -> Result<AuthUser, DbError> {
    let user = sql_query(
        "SELECT 
    u.id,
    u.name,
    u.password,
    u.email_address,
    u.created_at,
    u.updated_at,
    u.created_by,
    u.updated_by,
    u.active
FROM auth_users u 
WHERE name = ?",
    )
    .bind::<VarChar, _>(username)
    .get_result::<AuthUser>(conn)?;
    Ok(user)
}

// pub fn is_exists(conn: &mut MysqlConnection, email_address: String) -> Result<bool, DbError> {
//     // let exists: i64 = sql_query("SELECT count(*) id FROM users WHERE name = $1")
//     // .bind::<VarChar, _>(username)
//     // .get_result(conn)?;
//     use crate::schema::auth_users::dsl::*;
//     let exists: i64 = auth_users.filter(email_address.eq(email_address)).count().get_result(conn)?; // Result<i64, Error>

//     Ok(exists == 1)
// }

////
//// Create a new user given a username, email, and password (unhashed)
//// returns a user object
//// 
// pub fn create_user(
//     conn: &mut MysqlConnection,
//     username: String,
//     email: String,
//     password: String,
// ) -> Result<(), DbError> {
//     let salt = SaltString::generate(&mut OsRng);
//     let hashed_password = Argon2::default()
//         .hash_password(password.as_bytes(), &salt)
//         .expect("Error while hashing password")
//         .to_string();
//     // Create user object
//     sql_query( "INSERT INTO auth_users (name, email_address,password) VALUES (?, ?, ?)")
//         .bind::<VarChar, _>(&username)
//         .bind::<VarChar, _>(email)
//         .bind::<VarChar, _>(hashed_password)
//         .execute(conn)?;

//     Ok(())
// }
