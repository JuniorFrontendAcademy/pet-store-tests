export class WaitHandle {
  private resolveCollection: (() => void)[] = [];

  release() {
    if (this.resolveCollection.length === 0) {
      throw new Error('WaitHandle: There was nothing to release!');
    }

    for (const resolve of this.resolveCollection) {
      resolve();
    }
    this.resolveCollection = [];
  }

  wait(): Promise<void> {
    return new Promise((resolve) => {
      this.resolveCollection.push(resolve);
    });
  }
}

interface PromiseResolvers<T> {
  promise: Promise<T>;
  resolve: (result: T) => void;
  reject: (error: Error) => void;
}

export function promiseWithResolvers<T>(): PromiseResolvers<T> {
  let resolve: PromiseResolvers<T>['resolve'] | undefined;
  let reject: PromiseResolvers<T>['reject'] | undefined;

  const promise = new Promise<T>((_resolve, _reject) => {
    resolve = _resolve;
    reject = _reject;
  });

  return { promise, resolve: resolve!, reject: reject! };
}
