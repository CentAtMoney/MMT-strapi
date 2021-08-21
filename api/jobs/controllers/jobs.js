'use strict';
const { parseMultipartData, sanitizeEntity } = require('strapi-utils');


/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#core-controllers)
 * to customize this controller
 */

module.exports = {
	async create(ctx) {
		let entity;
		if (ctx.is('multipart')) {
			const { data, files } = parseMultipartData(ctx);
			data.author.id = ctx.state.user.id;
			entity = await strapi.services.jobs.create(data, { files });
		} else {
			ctx.request.body.author.id = ctx.state.user.id;
			entity = await strapi.services.jobs.create(ctx.request.body);
		}
		return sanitizeEntity(entity, { model: strapi.models.jobs });
	},
	async update(ctx) {
		const { id } = ctx.params;

		let entity;

		const [job] = await strapi.services.jobs.find({
			id: ctx.params.id,
			'author.id': ctx.state.user.id,
		});

		if (!job) {
			return ctx.unauthorized(`You can't update this entry`);
		}

		if (ctx.is('multipart')) {
			const { data, files } = parseMultipartData(ctx);
			entity = await strapi.services.jobs.update({ id }, data, {
				files,
			});
		} else {
			entity = await strapi.services.jobs.update({ id }, ctx.request.body);
		}

		return sanitizeEntity(entity, { model: strapi.models.jobs });
	},
	async delete(ctx) {

		const [job] = await strapi.services.jobs.find({
			id: ctx.params.id,
			'author.id': ctx.state.user.id,
		});

		if (!job) {
			return ctx.unauthorized(`You can't delete this entry`);
		}

		const entity = await strapi.services.jobs.delete({ id });

		return sanitizeEntity(entity, { model: strapi.models.jobs });
	}

};
