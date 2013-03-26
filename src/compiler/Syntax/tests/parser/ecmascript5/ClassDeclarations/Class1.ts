    export class NullLogger implements ILogger {
        public information(): bool { return false; }
        public debug(): bool { return false; }
        public warning(): bool { return false; }
        public error(): bool { return false; }
        public fatal(): bool { return false; }
        public log(s: string): void {
        }
    }