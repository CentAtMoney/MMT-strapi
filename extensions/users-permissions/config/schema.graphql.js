//// extensions/users-permissions/config/schema.graphql.js
module.exports = {
  definition: `
    extend type UsersPermissionsMe {
      user: UsersPermissionsUser
    }
  `,
  type: {
    // these fields are "protected" (only visible to owner)
    // the User controller also removes these 
    UsersPermissionsUser: {
      username: false,
      email: false,
      provider: false,
      confirmed: false,
      blocked: false
    }
  },
  resolver: {
    UsersPermissionsMe: {
      user: user => user
    },
  },
}
