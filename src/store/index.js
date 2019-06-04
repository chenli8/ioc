/**
 * Store入口文件
 */
import Vue from 'vue';
import Vuex from 'vuex';
import createLogger from 'vuex/dist/logger';
import {
    state,
    getters,
    mutations,
    actions
} from './base.js';
import cityInfo from './modules/cityInfo.js';
import totalPopulation from './modules/totalPopulation.js';
import populationOverview from './modules/populationOverview.js';
import residentFlow from './modules/residentFlow.js';
import workerFlow from './modules/workerFlow.js';
import populationSource from './modules/populationSource.js';
import workLive from './modules/workLive.js';
import populationStructure from './modules/populationStructure.js';
import commuting from './modules/commuting.js';

const DEBUG = process.env.NODE_ENV !== 'production';

const STORE_CONFIG = {
    state,
    getters,
    mutations,
    actions,
    modules: {
        cityInfo,
        totalPopulation,
        populationOverview,
        residentFlow,
        workerFlow,
        populationSource,
        workLive,
        populationStructure,
        commuting
    },
    strict: DEBUG,
    plugins: false ? [createLogger()] : []
};

Vue.use(Vuex);
// Store配置
let store = new Vuex.Store(STORE_CONFIG);

export default store