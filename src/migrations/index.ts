import * as migration_20260703_140004 from './20260703_140004';
import * as migration_20260706_203734 from './20260706_203734';
import * as migration_20260706_205545 from './20260706_205545';
import * as migration_20260707_144936 from './20260707_144936';
import * as migration_20260707_171619 from './20260707_171619';
import * as migration_20260708_133958 from './20260708_133958';
import * as migration_20260718_130226 from './20260718_130226';
import * as migration_20260718_130438 from './20260718_130438';
import * as migration_20260803_140918 from './20260803_140918';

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
    name: '20260707_144936',
  },
  {
    up: migration_20260707_171619.up,
    down: migration_20260707_171619.down,
    name: '20260707_171619',
  },
  {
    up: migration_20260708_133958.up,
    down: migration_20260708_133958.down,
    name: '20260708_133958',
  },
  {
    up: migration_20260718_130226.up,
    down: migration_20260718_130226.down,
    name: '20260718_130226',
  },
  {
    up: migration_20260718_130438.up,
    down: migration_20260718_130438.down,
    name: '20260718_130438',
  },
  {
    up: migration_20260803_140918.up,
    down: migration_20260803_140918.down,
    name: '20260803_140918'
  },
];
