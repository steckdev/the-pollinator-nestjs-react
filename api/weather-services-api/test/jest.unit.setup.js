console.log = jest.fn();
const path = '.env.test';
// eslint-disable-next-line @typescript-eslint/no-require-imports
const dotenv = require('dotenv');

dotenv.config({ path });
