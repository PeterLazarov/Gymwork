// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import m0000 from "./0000_cheerful_old_lace.sql"
import m0001 from "./0001_store_settings_preferences.sql"
import m0002 from "./0002_amused_nightcrawler.sql"
import m0003 from "./0003_fix_exercise_records_view.sql"
import m0004 from "./0004_track_weak_ass_records_view.sql"
import m0005 from "./0005_colorful_wendell_vaughn.sql"
import m0006 from "./0006_add_skipped_version.sql"
import m0007 from "./0007_add_duration_format.sql"
import journal from "./meta/_journal.json"

export default {
  journal,
  migrations: {
    m0000,
    m0001,
    m0002,
    m0003,
    m0004,
    m0005,
    m0006,
    m0007,
  },
}
