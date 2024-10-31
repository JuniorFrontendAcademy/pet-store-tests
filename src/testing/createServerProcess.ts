import path from 'node:path';
import process from 'node:process';
import { fileURLToPath } from 'node:url';

import { createNodeProcess } from './createNodeProcess.js';

// eslint-disable-next-line @typescript-eslint/naming-convention,no-underscore-dangle
const __dirname = path.dirname(fileURLToPath(import.meta.url));

export async function createServerProcess() {
  const serverPath = path.join(__dirname, 'server.js');

  const nodeProcess = await createNodeProcess({
    spawnParams: ['node', [serverPath], {}],
    portRegex: /Listening on port (?<port>\d+)\./,
  });

  return {
    bePort: nodeProcess.serverPort,
    stopBeProcess: nodeProcess.stopProcess,
  };
}

export async function createFEProcess(serverPort: number) {
  const nodeProcess = await createNodeProcess({
    spawnParams: [
      'npm',
      ['run', 'start:vanilla-js'],
      {
        cwd: path.join(
          __dirname,
          '../../../../',
          'pet-store-reference-implementation'
        ),
        env: {
          ...process.env,
          SERVER_PORT: String(serverPort),
        },
      },
    ],

    // eslint-disable-next-line no-control-regex
    portRegex: /Local: \[35mhttp:\/\/localhost:(?<port>\d+)/,
  });

  return {
    fePort: nodeProcess.serverPort,
    stopFeProcess: nodeProcess.stopProcess,
  };
}
