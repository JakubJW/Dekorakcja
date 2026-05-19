import * as migration_20260519_011029 from './20260519_011029';

export const migrations = [
  {
    up: migration_20260519_011029.up,
    down: migration_20260519_011029.down,
    name: '20260519_011029'
  },
];
