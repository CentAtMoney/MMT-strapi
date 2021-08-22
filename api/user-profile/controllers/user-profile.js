'use strict';

 const { sanitizeEntity } = require('strapi-utils');
 
 const sanitizeUser = user =>
   sanitizeEntity(user, {
     model: strapi.query('user', 'users-permissions').model,
   });
 
module.exports = {
    async updateMe(ctx) {
        const { id } = ctx.state.user;

        let updateData = {
            ...ctx.request.body,
        };

        const data = await strapi.plugins['users-permissions'].services.user.edit({ id }, updateData);

        ctx.send(sanitizeUser(data));
    },
};
