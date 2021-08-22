'use strict';
const { sanitizeEntity } = require('strapi-utils');


module.exports = {

	async create(ctx) {
		let entity;
		if (ctx.is('multipart')) {
			const { data, files } = parseMultipartData(ctx);
			// not sure if all author fields need to be set or if just setting id
			// is good enough security wise
			// shouldn't be getting author via bookings anyway
			data.author.id = ctx.state.user.id;
			entity = await strapi.services.bookings.create(data, { files });
		} else {
			ctx.request.body.author.id = ctx.state.user.id;
			entity = await strapi.services.bookings.create(ctx.request.body);
		}
		return sanitizeEntity(entity, { model: strapi.models.bookings });
	},
	async update(ctx) {

		let entity;

		const [booking] = await strapi.services.bookings.find({
			id: ctx.params.id,
			'author.id': ctx.state.user.id,
		});

		if (!booking) {
			return ctx.unauthorized(`You can't update this entry`);
		}

		if (ctx.is('multipart')) {
			const { data, files } = parseMultipartData(ctx);
			entity = await strapi.services.bookings.update({ id: ctx.params.id }, data, {
				files,
			});
		} else {
			entity = await strapi.services.bookings.update({ id: ctx.params.id }, ctx.request.body);
		}

		return sanitizeEntity(entity, { model: strapi.models.bookings });
	},
	async delete(ctx) {

		const [booking] = await strapi.services.bookings.find({
			id: ctx.params.id,
			'author.id': ctx.state.user.id,
		});

		if(!booking) {
			return ctx.unauthorized(`You can't delete this entry`);
		}

		const entity = await strapi.services.bookings.delete({ id: ctx.params.id });

		return sanitizeEntity(entity, { model: strapi.models.bookings });
	},
	async find(ctx) {
		let entities;
		if (ctx.query._q) {
			entities = await strapi.services.bookings.search(ctx.query);
		} else {
			entities = await strapi.services.bookings.find(ctx.query);
		}

		//still O(n) bitch
		 return entities.map(entity => {
			if((entity.job.author.id === ctx.state.user.id) || (entity.author.id === ctx.state.user.id)) {

				return sanitizeEntity(entity, { model: strapi.models.bookings });
			}
			return null;
		}).filter((entity) => {
			return entity != null;
		});
	},
	async findOne(ctx) {

		const entity = await strapi.services.bookings.findOne({ id: ctx.params.id });

		if((entity.job.author.id === ctx.state.user.id) || (entity.author.id === ctx.state.user.id)) {

			return sanitizeEntity(entity, { model: strapi.models.bookings });
		}
		return ctx.unauthorized(`You can't view this entry`);

	},
	async accept(ctx) {
		const entity = await strapi.services.bookings.findOne({ id: ctx.params.id });
		if(entity.status !== "Pending") {
			return ctx.unauthorized(`You can't accept this booking`);
		}
		if((entity.job.author.id === ctx.state.user.id)) {
			entity.status = "Booked";
			return sanitizeEntity(entity, { model: strapi.models.bookings });
		}
		return ctx.unauthorized(`You can't update this entry`);

	}
};
