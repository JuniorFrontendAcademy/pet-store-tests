import { test } from '@playwright/test';

import { createFEProcess, createServerProcess } from './createServerProcess.js';

interface ServerInfo {
  baseURL: string;
}

export function useServer(): ServerInfo {
  // eslint-disable-next-line no-underscore-dangle
  let _stopServer: (() => void) | undefined;
  // eslint-disable-next-line no-underscore-dangle
  let _stopFe: (() => void) | undefined;

  const returnValue: ServerInfo = { baseURL: '' };

  test.beforeEach(async () => {
    const { bePort, stopBeProcess } = await createServerProcess();

    _stopServer = stopBeProcess;

    const { fePort, stopFeProcess } = await createFEProcess(bePort);

    _stopFe = stopFeProcess;

    returnValue.baseURL = `http://localhost:${fePort}`;
  });

  test.afterEach(() => {
    _stopFe?.();
    _stopServer?.();
  });

  return returnValue;
}
