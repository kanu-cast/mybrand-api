const DatauriParser = require('datauri/parser');
const parser = new DatauriParser();

export const dataUri = (file) =>parser.format('jpeg', file.buffer);