export const state = {
	
};

export const getters = {
	
};

export const mutations = {
	
};

export const actions = {
	updateModel({ commit, getters }, {model, mutation, filterType = 'filter', outFilter, noCache}){
		let filter = getters[filterType] || {};
		
		if(outFilter){
			filter = Object.assign({}, filter, outFilter);
		}

		model.setFilter(filter);
		
		return model.update(noCache).then( data => {
			commit(mutation, data);

			return data
		});
	},
	updateActions({ dispatch }, actions){
		let promises = actions.map( action => dispatch(action) );

		return Promise.all(promises)
	}
};