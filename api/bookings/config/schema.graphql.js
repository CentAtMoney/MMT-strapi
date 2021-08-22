
module.exports = {
    mutation: `
        acceptBooking(id: ID!): Bookings!
    `,
    Mutation: {
        acceptBooking: {
            description: 'Update pending booking to Booked',
            policies: [],
            resolver: 'application::bookings.bookings.update'
        }
    }

}