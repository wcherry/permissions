# Permissions

_version 0.1.0_

## Installation

Requires Rust edition 2021 or later

### Build

1. Clone the project locally
2. Build the backend: run `cargo build --release`
3. Build the frontend: run `cd ./client/frontend` and then `yarn build`

### Run

1. Use the scripts in the sql directory to migrate and bootstrap the database
2. Create a .env file from the .env.example file replacing
3. DATABASE_URL with the database username, password, hostname and port, and schema
4. Run `cargo run` to build and run locally -or-
5. Run `target/permission` to run the production deployable

### Development

Run `cargo run` to run the backend -or-
Use the docker-compose.yaml file to run the application and all of it dependencies

#### Modifying and Contributing Code

The backend is located in the src directory, it is written in Rust and currently uses the Actix web framework, the Diesel ORM framework, and Serde for JSON parsing.
The backend currently only works with a MySQL/MariaDB database.

The frontend code is meant as an example of how to access the backend and has two parts.

1. client/frontend is written in React/Typescript and is used to create users, roles, and permissions.
2. client/usages is a collection of frontend and backend examples of usages <TBD>

#### What's missing

- No authorization or authentication is provided
- Only works with MySQL/MariaDB
- No caching (Redis, etc)
- No unit tests
- Need to refactor to be more idiomatic Rust code
- Universal message format, mainly completed for errors
- Create library to use as middleware for Rust web frameworks
