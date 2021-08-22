
module.exports = {
    definition: `
        input updateMeInput {
            data: editMeInput!
        }
        input editMeInput {
            email: String
            user: editUserInput
        }
    `,
    mutation: `updateMe(input: updateMeInput!): UsersPermissionsMe!`,
    type: {
        editMeInput: {
            email: 'User\'s Email',
            password: 'User\'s password',
            user: 'User\'s public info'
        }

    },
    Mutation: {
        description: 'Update a user\'s personal fields',
        resolver: 'application::user-profile.user-profile.updateMe'
    }
}