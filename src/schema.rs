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
    id -> Integer,
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
