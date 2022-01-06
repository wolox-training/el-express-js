const { weetData } = require('../factory/weet_factory');

jest.mock('../../app/services/numbers');
const { getSentence } = require('../../app/services/numbers');

getSentence.mockImplementation(() => Promise.resolve(weetData.newWeet.content));
