#[macro_use]
extern crate diesel;

use actix_files::NamedFile;
use actix_web::{web, App, HttpRequest, HttpServer, Result};
use diesel::{
    r2d2::{self, ConnectionManager},
    MysqlConnection,
};
use std::{io, path::PathBuf};

mod common;
mod permissions;
mod roles;
mod schema;
mod users;

use crate::permissions::{
    get_permissions, get_permissions_for_roles, get_permissions_for_user_and_company,
    save_permissions_for_roles,
};
use crate::roles::{get_all_roles, get_role};
use crate::users::{create_user, get_user, get_users};

const CLIENT_PATH: &str = "./client/frontend/build/";

async fn index(req: HttpRequest) -> Result<NamedFile> {
    let mut filename: &str = req.match_info().query("filename"); //.parse().unwrap();
    let mut path: PathBuf = PathBuf::new();
    path.push(CLIENT_PATH);
    if filename.is_empty() {
        filename = "index.html";
    }
    path.push(filename);
    println!("{:?}", &path);
    Ok(NamedFile::open(path)?)
}

#[actix_web::main]
async fn main() -> io::Result<()> {
    dotenv::dotenv().ok();
    env_logger::init_from_env(env_logger::Env::new().default_filter_or("info"));

    // set up database connection pool
    let conn_spec = std::env::var("DATABASE_URL").expect("DATABASE_URL");
    println!("{}", conn_spec);
    let manager = ConnectionManager::<MysqlConnection>::new(conn_spec);
    // Create connection pool
    let pool = r2d2::Pool::builder()
        .build(manager)
        .expect("Failed to create pool.");

    // Start HTTP server
    HttpServer::new(move || {
        App::new()
            .service(
                web::scope("/api")
                    .service(get_user)
                    .service(get_users)
                    .service(get_permissions)
                    .service(get_permissions_for_user_and_company)
                    .service(get_role)
                    .service(get_all_roles)
                    .service(get_permissions_for_roles)
                    .service(save_permissions_for_roles)
                    .service(create_user)
                    .app_data(web::Data::new(pool.clone())),
            )
            .route("/{filename:.*}", web::get().to(index))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
