#[macro_use]
extern crate diesel;

use actix_files::NamedFile;
use actix_web::{web, App, HttpRequest, HttpServer, Result};
use diesel::{
    r2d2::{self, ConnectionManager},
    MysqlConnection,
};
use std::{io, path::PathBuf};
use config::Config;

mod common;
mod companies;
mod permissions;
mod roles;
mod schema;
mod users;
mod auth;
mod config;
mod model;

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

    let config = Config::init();

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
            .app_data(web::Data::new(common::AppState {
                pool: pool.clone(),
                config: config.clone(),
            }))
            .service(
                web::scope("/api")
                    .service(users::get_user)
                    .service(users::get_users)
                    .service(permissions::get_permissions)
                    .service(permissions::get_permissions_for_user_and_company)
                    .service(roles::get_role)
                    .service(roles::get_all_roles)
                    .service(companies::get_companies)
                    .service(permissions::get_permissions_for_roles)
                    .service(permissions::save_permissions_for_roles)
                    .service(users::create_user)
                    // .service(auth::register_user_handler)
                    .service(auth::login_user_handler)
                    .service(auth::logout_handler)
                    .service(permissions::create_permission)
            )
            .route("/{filename:.*}", web::get().to(index))
    })
    .bind(("127.0.0.1", 8080))?
    .run()
    .await
}
