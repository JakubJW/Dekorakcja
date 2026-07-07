import * as migration_20260703_140004 from './20260703_140004';
import * as migration_20260706_203734 from './20260706_203734';
import * as migration_20260706_205545 from './20260706_205545';
import * as migration_20260707_144936 from './20260707_144936';

export const migrations = [
  {
    up: migration_20260703_140004.up,
    down: migration_20260703_140004.down,
    name: '20260703_140004',
  },
  {
    up: migration_20260706_203734.up,
    down: migration_20260706_203734.down,
    name: '20260706_203734',
  },
  {
    up: migration_20260706_205545.up,
    down: migration_20260706_205545.down,
    name: '20260706_205545',
  },
  {
    up: migration_20260707_144936.up,
    down: migration_20260707_144936.down,
    name: '20260707_144936'
  },
];
