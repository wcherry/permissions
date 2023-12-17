use utoipa::OpenApi;

use crate::auth;
use crate::model;
use crate::users;
// use crate::permissions;
// use crate::roles;

#[derive(OpenApi)]
#[openapi(
    paths(
    // Auth
        // auth::register_user_handler, 
        auth::login_user_handler,
        auth::logout_handler,
    // Users
    users::get_user,
    users::get_users,
    // permissions::get_permissions,
    // permissions::get_permissions_for_user_and_company,
    // roles::get_role,
    // roles::get_all_roles,
    // companies::get_companies,
    // companies::create_company,
    // permissions::get_permissions_for_roles,
    // permissions::save_permissions_for_roles,
    // users::create_user,
    // auth::login_user_handler,
    // auth::logout_handler,
    // permissions::create_permission,

    // Roles
        // blocks::get_blocks_by_version_handler,
        // blocks::get_blocks_for_page_handler,
        // blocks::create_block_handler,
        // blocks::update_block_handler,
    ),
    components(
        schemas(
            // pages::dto::PageCreateDto, 
            // pages::dto::PageDto, 
            // pages::dto::PagePermissionCreateDto, 
            // shared::dto::UserDto, 
            auth::dto::RegisterUserDto, 
            auth::dto::LoginRequestDto, 
            auth::dto::LoginResponseDto,
            model::AuthUser,
            model::User,
            // shared::dto::UserProfileDto,
            // blocks::dto::BlockDto, 
            // blocks::dto::BlockRequest, 
        ),
    ),
    security(
        (),
        ("my_auth" = ["read:items", "edit:items"]),
        ("token_jwt" = [])
    ),
    tags(
        (name = "permissions::api", description = "Permissions API"),
    ),
    external_docs(url = "http://more.about.our.apis", description = "More about our APIs")
)]
pub struct ApiDoc;
