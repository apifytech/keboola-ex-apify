const { ACTIONS, ACTION_TYPES } = require('../constants');

function parseConfig(configObject) {
    const config = {
        action: configObject.get('action') || ACTIONS.run,
        userId: configObject.get('parameters:userId'),
        token: configObject.get('parameters:#token'),
        datasetId: configObject.get('parameters:datasetId'),
        actId: configObject.get('parameters:actId'),
        input: configObject.get('parameters:input'),
        memory: configObject.get('parameters:memory'),
        build: configObject.get('parameters:build'),
        executionId: configObject.get('parameters:executionId'),
        crawlerId: configObject.get('parameters:crawlerId'),
        crawlerSettings: configObject.get('parameters:crawlerSettings') || {},
        timeout: configObject.get('parameters:timeout'),
    };
    if (config.action === ACTIONS.run) {
        config.actionType = configObject.get('parameters:actionType') || ACTION_TYPES.runExecution;
    }
    return config;
}

/**
 * Checks whether the input configuration is valid.
 * If so, the particular object with relevant parameters is returned.
 * If not, throw error.
 */
function parseConfigurationOrThrow(configObject) {
    const config = parseConfig(configObject);
    if (config.action === ACTIONS.listCrawlers || config.action === ACTIONS.listActors) {
        // These actions don't need any other parameters
        if (!config.userId) throw new Error('Parameter userId is not defined!');
        if (!config.token) throw new Error('Parameter token is not defined!');
    } else if (config.action === ACTIONS.run) {
        if (config.actionType === ACTION_TYPES.getDatasetItems ||
            config.actionType === ACTION_TYPES.runActor) {
            if (!config.userId) throw new Error('Parameter userId is not defined!');
            if (!config.token) throw new Error('Parameter token is not defined!');
        }
        if (config.actionType === ACTION_TYPES.getDatasetItems) {
            if (!config.datasetId) throw new Error('Parameter datasetId is not defined!');
        } else if (config.actionType === ACTION_TYPES.runActor) {
            if (!config.actId) throw new Error('Parameter actId is not defined!');
        } else {
            if (!config.executionId && !config.userId) throw new Error('Parameter userId is not defined!');
            if (!config.executionId && !config.token) throw new Error('Parameter token is not defined!');
            if (!config.executionId && !config.crawlerId) throw new Error('Parameter crawlerId and executionId is not defined!');
        }
    } else {
        throw new Error('Unknown action!');
    }
    return config;
}

module.exports = {
    parseConfigurationOrThrow,
};