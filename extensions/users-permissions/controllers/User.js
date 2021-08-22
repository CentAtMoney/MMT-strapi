const { sanitizeEntity } = require('strapi-utils');

const sanitizeUser = user =>
	sanitizeEntity(user, {
		model: strapi.query('user', 'users-permissions').model,
	});



const protectedFields = [
"username",
"email",
"provider",
"confirmed",
"blocked"
];

module.exports = {
	async findOne(ctx) {
		const { id } = ctx.params;

		let data = await strapi.plugins['users-permissions'].services.user.fetch({
			id,
		});

		if (data) {
			data = sanitizeUser(data);
			const user = ctx.state.user;
			if(!user || (user.id !== id)) {
				//remove protected fields
				for(const field of protectedFields) {
					data[field] = undefined;
				}
			}
		}


		// Send 200 `ok`
		ctx.body = data;
	},
};
