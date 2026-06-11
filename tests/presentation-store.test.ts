import test from "node:test";
import assert from "node:assert/strict";

import { createPresentationStore } from "../src/stores/presentation.store";

test("presentation store supports add edit duplicate move and delete", () => {
  const store = createPresentationStore();
  const state = store.getState();

  state.clearItems();
  assert.equal(store.getState().items.length, 0);

  store.getState().addItem({
    sourceId: "test_song_1",
    type: "song",
    title: "Song A",
    subtitle: "Key C",
    content: "Line 1\nLine 2",
  });

  store.getState().addItem({
    sourceId: "test_song_2",
    type: "song",
    title: "Song B",
    subtitle: "Key D",
    content: "Verse 1",
  });

  assert.equal(store.getState().items.length, 2);
  assert.equal(store.getState().items[1]?.title, "Song B");

  const firstItemId = store.getState().items[0]?.id;
  assert.ok(firstItemId);

  store.getState().updateItem(firstItemId, {
    title: "Song A Edited",
    subtitle: "Key E",
  });

  assert.equal(store.getState().items[0]?.title, "Song A Edited");
  assert.equal(store.getState().items[0]?.subtitle, "Key E");

  store.getState().duplicateItem(firstItemId);
  assert.equal(store.getState().items.length, 3);
  assert.equal(store.getState().items[1]?.title, "Song A Edited");
  assert.notEqual(store.getState().items[1]?.id, firstItemId);

  const duplicatedItemId = store.getState().items[1]?.id;
  assert.ok(duplicatedItemId);

  store.getState().moveItemDown(firstItemId);
  assert.equal(store.getState().items[1]?.id, firstItemId);

  store.getState().moveItemUp(firstItemId);
  assert.equal(store.getState().items[0]?.id, firstItemId);

  store.getState().removeItem(duplicatedItemId);
  assert.equal(store.getState().items.length, 2);
  assert.ok(
    store.getState().items.every((item) => item.id !== duplicatedItemId),
  );
});

test("presentation store navigates internal slides before switching items", () => {
  const store = createPresentationStore();
  store.getState().clearItems();

  store.getState().addItem({
    sourceId: "song_multislide",
    type: "song",
    title: "Song Multi Slide",
    subtitle: "Tester · C",
    content: "Line 1\nLine 2\nLine 3\nLine 4",
  });

  store.getState().addItem({
    sourceId: "bible_short",
    type: "bible",
    title: "Yohanes 3:16",
    subtitle: "TB",
    reference: "Yohanes 3:16",
    content: "Karena begitu besar kasih Allah akan dunia ini.",
  });

  const firstItemId = store.getState().items[0]?.id;
  const secondItemId = store.getState().items[1]?.id;
  assert.ok(firstItemId);
  assert.ok(secondItemId);

  store.getState().selectItem(firstItemId);
  assert.equal(store.getState().selectedSlideIndex, 0);

  store.getState().selectNextItem();
  assert.equal(store.getState().selectedItemId, firstItemId);
  assert.equal(store.getState().selectedSlideIndex, 1);

  store.getState().selectNextItem();
  assert.equal(store.getState().selectedItemId, secondItemId);
  assert.equal(store.getState().selectedSlideIndex, 0);

  store.getState().selectPreviousItem();
  assert.equal(store.getState().selectedItemId, firstItemId);
  assert.equal(store.getState().selectedSlideIndex, 1);
});

test("presentation store moves item directly to target index", () => {
  const store = createPresentationStore();
  store.getState().clearItems();

  store.getState().addItem({
    sourceId: "item_1",
    type: "song",
    title: "Song 1",
    subtitle: "Key C",
    content: "Verse 1",
  });

  store.getState().addItem({
    sourceId: "item_2",
    type: "song",
    title: "Song 2",
    subtitle: "Key D",
    content: "Verse 2",
  });

  store.getState().addItem({
    sourceId: "item_3",
    type: "bible",
    title: "Roma 8:28",
    subtitle: "TB",
    reference: "Roma 8:28",
    content: "Allah turut bekerja dalam segala sesuatu.",
  });

  const firstId = store.getState().items[0]?.id;
  const lastIndex = store.getState().items.length - 1;

  assert.ok(firstId);

  store.getState().moveItemToIndex(firstId, lastIndex);

  assert.equal(store.getState().items[lastIndex]?.id, firstId);
  assert.equal(store.getState().selectedItemId, firstId);
});
