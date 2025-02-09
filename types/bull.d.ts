// This file tells TypeScript to treat the 'bull' module as having an "any" type.
declare module 'bull' {
  interface JobOptions {
    priority?: number;
    attempts?: number;
    delay?: number;
  }

  interface QueueOptions {
    redis?: {
      host?: string;
      port?: number;
      password?: string;
    };
    limiter?: {
      max: number;
      duration: number;
    };
  }

  interface Job<T = any> {
    id: string;
    data: T;
    opts: JobOptions;
  }

  class Queue<T = any> {
    constructor(name: string, options?: QueueOptions);
    process(callback: (job: Job<T>) => Promise<any>): void;
    add(data: T, opts?: JobOptions): Promise<Job<T>>;
    on(event: 'failed', callback: (job: Job<T>, error: Error) => void): void;
    on(event: string, callback: (...args: any[]) => void): void;
  }

  // Export the namespace
  namespace Bull {
    export type Job<T> = Job<T>;
  }
} 