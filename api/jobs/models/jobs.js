'use strict';

/**
 * Read the documentation (https://strapi.io/documentation/developer-docs/latest/development/backend-customization.html#lifecycle-hooks)
 * to customize this model
 */
const index = 'jobs';

module.exports = {
  lifecycles: {
    afterCreate(result, data) {
      if(result.listed) {
        strapi.services.algolia.saveObject(result, index);
      }
    },
    afterUpdate(result, params, data) {
      if(result.listed) {
        strapi.services.algolia.saveObject(result, index);
      }
    },
    afterDelete(result, params) {
	    if(result.listed) {
      strapi.services.algolia.deleteObject(result.id, index);
	    }
    },
  },
};
