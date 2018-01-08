import ApifyClient from 'apify-client';
import path from 'path';

import command from './helpers/cliHelper';
import getConfig from './helpers/configHelper';
import { parseConfiguration } from './helpers/keboolaHelper';
import { CONFIG_FILE } from './constants';

import runAction from './actions/run';
import listCrawlersAction from './actions/listCrawlers';

/**
 * Main part of the program.
 */
(async () => {
    try {
        const {
            action,
            userId,
            token,
            crawlerId,
            crawlerSettings,
            timeout,
            executionId
        } = await parseConfiguration(getConfig(path.join(command.data, CONFIG_FILE)));

        const apifyClient = new ApifyClient({ userId, token });

        switch (action) {
            case 'run':
                await runAction(apifyClient, executionId, crawlerId, crawlerSettings, timeout);
                break;
            case 'listCrawlers':
                await listCrawlersAction(apifyClient);
                break;
            default:
                throw new Error(`Error: Unknown Action ${action}`);
        }

        process.exit(0);
    } catch (error) {
        console.log(error);
        process.exit(1);
    }
})();
