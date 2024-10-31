import type { ChildProcess } from 'node:child_process';
import process from 'node:process';

import { spawn } from 'cross-spawn';

import { promiseWithResolvers } from './utils.js';

interface NodeProcessOptions {
  spawnParams: Parameters<typeof spawn>;
  portRegex: RegExp;
}

export interface NodeProcess {
  serverPort: number;
  stopProcess: () => void;
}

export function createNodeProcess({
  portRegex,
  spawnParams,
}: NodeProcessOptions): Promise<NodeProcess> {
  const { promise, resolve, reject } = promiseWithResolvers<NodeProcess>();

  let serverProcess: ChildProcess | undefined = spawn(...spawnParams);

  serverProcess.stdout!.setEncoding('utf8');
  serverProcess.stdout!.on('data', (data: string) => {
    if (process.env.DEBUG_CHILD_PROCESSES) {
      process.stdout.write(data);
    }

    const regexResult = portRegex.exec(data);

    if (regexResult) {
      const serverPort = Number(regexResult.groups?.port);

      resolve({
        serverPort,
        stopProcess: () => {
          if (serverProcess) {
            serverProcess.kill();
          }
        },
      });
    }
  });

  serverProcess.stderr!.setEncoding('utf8');

  if (process.env.DEBUG_CHILD_PROCESSES) {
    serverProcess.stderr!.on('data', (data: string) => {
      process.stderr.write(data);
    });
  }

  serverProcess.on('close', (code) => {
    if (code !== 0) {
      reject(new Error(`Process exited with status code ${code}`));
    }

    serverProcess = undefined;
  });

  process.on('exit', () => {
    if (serverProcess) {
      serverProcess.kill();
    } else {
      serverProcess = undefined;
    }
  });

  return promise;
}
