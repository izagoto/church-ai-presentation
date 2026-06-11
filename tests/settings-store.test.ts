import test from "node:test";
import assert from "node:assert/strict";

import { createSettingsStore } from "../src/stores/settings.store";

test("settings store updates and resets projector settings", () => {
  const store = createSettingsStore();

  store.getState().updateSettings({
    selectedMonitorId: 2,
    fullscreenDefault: false,
    language: "Indonesia",
  });

  assert.equal(store.getState().selectedMonitorId, 2);
  assert.equal(store.getState().fullscreenDefault, false);
  assert.equal(store.getState().language, "Indonesia");

  store.getState().resetSettings();

  assert.equal(store.getState().selectedMonitorId, null);
  assert.equal(store.getState().fullscreenDefault, true);
  assert.equal(store.getState().language, "English");
});
