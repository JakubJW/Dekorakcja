import * as migration_20260703_140004 from './20260703_140004';

export const migrations = [
  {
    up: migration_20260703_140004.up,
    down: migration_20260703_140004.down,
    name: '20260703_140004'
  },
];
