table! {
  companies (id) {
    id -> Integer,
    name -> Text,
    active -> Bool,
  }
}
table! {
  users (id) {
      id -> Nullable<Integer>,
      name -> Text,
      active -> Bool,
  }
}
table! {
  roles (id) {
      id -> Integer,
      name -> Text,
      company_name -> Text,
      active -> Bool,
  }
}
table! {
  permissions (id) {
    id -> Nullable<Integer>,
    name -> Text,
    active -> Bool,
  }
}
table! {
  role_permissions (id) {
    id -> Integer,
    role_id -> Integer,
    permission_id -> Integer,
  }
}
table! {
  auth_users (id) {
    id -> Integer,
    name -> Text,
    email_address -> Text,
    password -> Text,
    active -> Bool,
    created_at -> Datetime,
    updated_at -> Datetime,
    created_by -> Integer,
    updated_by -> Integer,
  }
}
