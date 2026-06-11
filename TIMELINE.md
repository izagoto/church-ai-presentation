# Timeline Project

Update status implementasi untuk aplikasi **Persekutuan Oikumene SII / Worship Presentation App**.

Legend:
- `[x]` sudah diimplementasikan
- `[-]` sudah ada sebagian / masih perlu penyempurnaan
- `[ ]` belum diimplementasikan

## A. Task yang sedang berjalan / perlu dibereskan dulu

### 1. Fix tombol Edit Item di Service Planner
- [x] Store punya `updateItem()`
- [x] Tombol Pencil memanggil `onEditItem(item)`
- [x] `EditItemModal` dirender di `PresentationPage`
- [x] `useEffect` sudah di-import
- [x] `Save Changes` meng-update item

Status: **sudah stabil**

### 2. Rapikan full `PresentationPage.tsx`
- [x] Preview dinamis
- [x] Search Item modal
- [x] Quick Add
- [x] Move Up / Move Down
- [x] Edit Item modal
- [x] Delete item
- [x] Duplicate item
- [x] Selected item state

Status: **sudah difinalisasi untuk flow saat ini**

## B. Task fitur Presentation / Service Planner

### 3. Reorder item dengan drag and drop
- [x] Drag and drop reorder
- [x] Fallback `Move Up`
- [x] Fallback `Move Down`

Status: **sudah**

### 4. Clear semua item Service Planner
- [x] `clearItems` sudah ada di store
- [x] Tombol `Clear Service` di UI
- [x] Konfirmasi sebelum clear

Status: **sudah**

### 5. Save Service Plan
- [x] Save service ke store history
- [x] Simpan nama ibadah, tanggal, pastor, tema, dan item
- [x] Setelah save, bisa masuk ke History

Status: **sudah**

### 6. Load service dari History
- [x] History bisa load plan lama
- [x] Reuse service mengembalikan plan ke Presentation Planner

Status: **sudah**

### 7. Service Info editable
- [x] Service Name editable
- [x] Date editable
- [x] Pastor editable
- [x] Sermon Theme editable

Status: **sudah editable langsung di halaman**

### 8. Slide aktif belum punya konsep “per halaman slide”
- [x] Multi-slide untuk lagu
- [x] Split ayat panjang menjadi beberapa slide

Status: **sudah implementasi awal**

### 9. Previous / Next masih pindah antar item, belum antar slide detail
- [x] Next/Previous antar item planner
- [x] Next/Previous antar slide internal lagu/ayat

Status: **sudah slide-aware**

### 10. Blank screen / Live / Fullscreen belum real
- [x] Blank screen state
- [x] Toggle live/blank dari operator
- [x] Fullscreen projector window
- [x] Open projector window
- [x] Open second display terpilih

Status: **sudah**

## C. Task Songs Page

### 11. Tombol Add to Presentation dari Songs
- [x] Klik `Add to Presentation`
- [x] Item masuk Service Planner
- [-] Tidak duplicate source yang sama
- [x] Item otomatis selected
- [x] Preview berubah

Catatan: duplicate prevention masih bergantung ke perilaku store saat ini dan belum dipisahkan sebagai flow library yang lebih ketat.

### 12. Search lagu masih dummy
- [x] Search by title
- [x] Search by lyric
- [x] Search by category
- [-] Search by key
- [x] Filter lagu

Status: **sudah pakai local song database, belum full advanced search**

### 13. Add song baru
- [x] Form tambah lagu ke library

### 14. Edit song library
- [x] Edit data lagu dari library

### 15. Delete song library
- [x] Hapus lagu dari library

## D. Task Bible Page

### 16. Tombol Add to Presentation dari Bible
- [x] Klik `Add to Presentation`
- [x] Ayat masuk Service Planner
- [x] Item otomatis selected
- [x] Preview berubah

### 17. Bible search masih dummy
- [x] Search by reference
- [x] Search by topic
- [x] Search by keyword
- [x] Pilih translation

Status: **sudah pakai local verse database dan translation selector**

### 18. Data Bible belum lengkap
- [-] Sudah ada local database multi-translation dengan cakupan topik lebih luas
- [ ] Database Alkitab lengkap

### 19. AI Context masih dummy
- [ ] Ringkasan konteks tersambung AI

Status: **masih statis**

## E. Task Settings Page

### 20. Settings belum tersimpan
- [x] Store/settings persistence untuk Language
- [x] Theme
- [x] Default font size
- [x] Selected monitor
- [x] Resolution
- [x] Fullscreen default
- [x] OpenAI API Key
- [x] Model
- [x] AI Search Mode

### 21. Reset to Default belum berfungsi
- [x] Reset to default action

### 22. Projector monitor selection belum real
- [x] `getDisplays()`
- [x] `selectDisplay()`
- [x] `openProjectorWindow()`

Status: **sudah**

### 23. API Key belum disimpan aman
- [x] Secure storage untuk API key

## F. Task History Page

### 24. History masih dummy
- [x] History tersambung ke data service yang disimpan
- [x] Seed data awal sudah dihapus

### 25. Detail history belum load item asli
- [x] Detail history load item asli dari service tersimpan

### 26. Reuse Service belum dibuat
- [x] Tombol `Reuse Service`

### 27. Delete history belum ada
- [x] Hapus riwayat service

## G. Task data/store/backend lokal

### 28. Struktur store utama belum lengkap
- [x] `presentation.store.ts`
- [x] `navigation.store.ts`
- [x] `history.store.ts`
- [x] `songs.store.ts`
- [x] `bible.store.ts`
- [x] `settings.store.ts`
- [ ] `projector.store.ts`

### 29. Local database belum dibuat
- [-] Sudah ada local data file berbasis TypeScript
- [ ] SQLite
- [ ] JSON local file persistable

Status: **baru tahap awal local structured data**

### 30. Persistence data belum ada
- [x] Presentation store persist
- [x] History store persist
- [x] Songs store persistence
- [x] Bible store persistence
- [x] Settings persistence

## H. Task Electron / Desktop App

### 31. Projector Window belum dibuat
- [x] Main Window untuk operator
- [x] Projector Window untuk output slide

### 32. IPC Electron belum dibuat
- [x] IPC untuk buka/tutup/toggle fullscreen projector
- [-] Sinkronisasi slide aktif masih mengandalkan shared persisted state, belum channel IPC khusus slide

### 33. Fullscreen ke monitor kedua
- [x] Baca display dan buka projector ke screen terpilih

### 34. Keyboard shortcut
- [x] `ArrowRight` next
- [x] `ArrowLeft` previous
- [x] `B` blank screen
- [ ] `F` fullscreen shortcut
- [-] `Esc` keluar fullscreen

Catatan: `Esc` saat ini dipakai untuk unblank, bukan exit fullscreen projector.

## I. Task UI polish

### 35. Konsistensi spacing semua halaman
- [-] Sebagian besar sudah rapi
- [ ] Final polish pass semua halaman

### 36. Responsive height kecil
- [-] Sebagian layout sudah lebih aman
- [ ] Test di beberapa ukuran layar

### 37. Empty state semua halaman
- [x] Songs search kosong
- [x] Bible search kosong
- [x] Service Planner kosong
- [x] History kosong
- [ ] Settings error/empty state

### 38. Modal style perlu diseragamkan
- [-] Search Item Modal dan Edit Item Modal sudah cukup dekat
- [ ] Final standardisasi spacing, max-height, dan action layout

## J. Task AI

### 39. AI song search belum real
- [x] AI song search berbasis OpenAI via Electron IPC
- [x] Hasil AI bisa dipilih langsung di Songs Page

Status: **sudah implementasi awal, masih ranking berbasis data lokal**

### 40. AI Bible topic search belum real
- [x] AI Bible topic search berbasis OpenAI via Electron IPC
- [x] Hasil AI bisa dipilih langsung di Bible Page

Status: **sudah implementasi awal, masih ranking berbasis data lokal**

### 41. AI sermon/service suggestion belum ada
- [x] Rekomendasi lagu dari tema
- [x] Rekomendasi ayat dari tema
- [x] Susun service flow otomatis per section
- [x] Apply hasil AI langsung ke planner

Status: **sudah implementasi awal dan sudah bisa apply flow ke planner, masih bisa diperkaya lagi**

## Prioritas Berikutnya

Urutan kerja yang sekarang paling masuk akal:

1. Tambahkan AI search untuk Songs/Bible.
2. Hubungkan monitor terpilih di Settings ke flow buka/fullscreen projector secara default.
3. Pertimbangkan `projector.store.ts` bila state output makin kompleks.
