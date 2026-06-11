import test from "node:test";
import assert from "node:assert/strict";

import { createBibleStore } from "../src/stores/bible.store";

test("bible store exposes and switches available translations", () => {
  const store = createBibleStore();

  assert.deepEqual(store.getState().availableTranslations, ["TB", "FAYH"]);
  assert.equal(store.getState().activeTranslation, "TB");
  assert.deepEqual(store.getState().verses, []);

  store.getState().setActiveTranslation("FAYH");

  assert.equal(store.getState().activeTranslation, "FAYH");
  assert.deepEqual(store.getState().verses, []);
});
