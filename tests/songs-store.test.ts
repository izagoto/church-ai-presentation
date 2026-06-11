import test from "node:test";
import assert from "node:assert/strict";

import { createSongsStore } from "../src/stores/songs.store";

test("songs store supports add edit and delete song", () => {
  const store = createSongsStore();
  const initialCount = store.getState().songs.length;

  const createdSong = store.getState().addSong({
    title: "Test Song",
    author: "Test Author",
    category: "Testing",
    songKey: "C",
    bpm: 90,
    timeSignature: "4/4",
    tags: ["test", "automation"],
    lyrics: "Line one\nLine two",
    chords: ["C", "G", "Am", "F"],
  });

  assert.equal(store.getState().songs.length, initialCount + 1);
  assert.equal(store.getState().songs[0]?.title, "Test Song");
  assert.match(store.getState().songs[0]?.lyricPreview ?? "", /Line one/);

  store.getState().updateSong(createdSong.id, {
    title: "Updated Song",
    category: "Updated Category",
  });

  const updatedSong = store
    .getState()
    .songs.find((song) => song.id === createdSong.id);

  assert.equal(updatedSong?.title, "Updated Song");
  assert.equal(updatedSong?.category, "Updated Category");

  store.getState().deleteSong(createdSong.id);

  assert.equal(store.getState().songs.length, initialCount);
  assert.equal(
    store.getState().songs.some((song) => song.id === createdSong.id),
    false,
  );
});
