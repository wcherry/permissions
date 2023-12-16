use serde::{Deserialize, Serialize};

use crate::model::AuthUser;

use utoipa::ToSchema;

#[allow(non_snake_case)]
#[derive(Debug, Serialize)]
pub struct FilteredUser {
    pub id: String,
    pub name: String,
    pub email: String,
    pub role: String,
    pub createdAt: chrono::NaiveDateTime,
    pub updatedAt: chrono::NaiveDateTime,
}

#[derive(Debug, Serialize, Deserialize)]
pub struct TokenClaims {
    pub sub: String,
    pub iat: usize,
    pub exp: usize,
}

#[derive(Debug, Deserialize, ToSchema)]
pub struct RegisterUserDto {
    pub name: String,
    pub email: String,
    pub password: String,
}

#[derive(Serialize, Debug)]
pub struct UserData {
    pub user: FilteredUser,
}

#[derive(Serialize, Debug)]
pub struct UserResponse {
    pub status: String,
    pub data: UserData,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct LoginRequestDto {
    pub username: String,
    pub password: String,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct LoginResponseDto {
    // {"status": "success", "token": token, "user": user}
    pub status: String,
    pub token: String,
    pub user: AuthUser,
}

#[derive(Debug, Clone, Serialize, Deserialize, ToSchema)]
pub struct UserDto {
    pub id: i32,
    pub name: String,
    pub active: bool,
}

impl std::convert::From<AuthUser> for UserDto {
    fn from(user: AuthUser) -> Self {
        UserDto {
            id: user.id,
            name: user.name,
            active: user.active,
        }
    }
}

