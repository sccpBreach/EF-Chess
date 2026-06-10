# EFChess — Roadmap Polish 30 Hari (v1.0)

Disesuaikan dari analisis komparatif kamu ke kondisi nyata project: TanStack Start + React 19 + Tailwind v4, sudah ada sidebar, board SVG Cburnett, eval bar, movelist dummy, opening strip, transport bar. Belum ada Lovable Cloud, chess.js, Stockfish, atau auth.

Fokus: realistis untuk v1.0 satu developer. Fitur "wow" tetap ada tapi dipangkas yang butuh infra berat (real-time WS room, billing, AI LLM coach pakai API berbayar) ke v2.0+.

---

## Posisi sekarang vs target

| Area | Sekarang | Target v1.0 |
|---|---|---|
| Board | Static starting position, Cburnett SVG | Interaktif (chess.js), legal-move dots, drag/drop, flip |
| Engine | Toggle visual saja | Stockfish 17 WASM client-side, depth control, Multi-PV 3 |
| Movelist | Hardcoded 4 baris | Sinkron dengan chess.js, klik = jump, keyboard nav |
| Opening | Hardcoded "C20" | Lookup ECO dari mini-database (~500 opening) |
| Eval bar | Dummy 0.0 | Live dari Stockfish, animasi smooth |
| PGN | Tab Import kosong | Paste/upload PGN → parse → load ke board |
| Repertoire | List dummy | CRUD repertoire + deviation flag (butuh Cloud) |
| Auth | Tidak ada | Lovable Cloud + anonymous session, login optional |
| Dark mode | Sudah default ✅ | — |
| Responsive | Belum diuji mobile | Board <=512px, sticky controls, swipe nav |

---

## Yang DIBUANG dari analisis (tidak relevan / overkill v1.0)

- **Chrome extension overlay** — beda produk, beda repo
- **Real-time WS analysis room** — infra mahal, defer ke v2.0
- **LLM AI Coach** (DecodeChess-style) — butuh API berbayar, defer
- **Therapist mode** — fitur ide bagus tapi vague, defer setelah ada user feedback
- **Google Drive sync** — Cloud DB cukup
- **Billing/freemium gating** — semua free dulu, monetisasi nanti
- **Next.js 15 / NextAuth migration** — sudah TanStack Start, jangan ganti stack
- **PostHog self-hosted** — overkill, pakai analytics built-in dulu
- **30B+ game opening explorer** — pakai Lichess opening API (gratis) on-demand, bukan host database sendiri

---

## Roadmap 4 minggu

### Minggu 1 — Foundation: chess.js + interaktivitas
**Goal: papan jalan beneran, bisa main legal moves.**

1. `bun add chess.js` + buat `src/lib/chess/game.ts` (wrapper state)
2. Refactor `chess-board.tsx`: terima `fen` prop, render dari Chess instance
3. Klik square → highlight legal moves (dots putih), klik tujuan = move
4. Drag & drop piece (HTML5 DnD, no extra lib)
5. Dialog promosi (`PromotionDialog` — pilih Q/R/B/N) pakai shadcn Dialog
6. Modal game-over (checkmate/stalemate/draw) pakai shadcn AlertDialog
7. Flip board (button di transport bar bekerja)
8. Movelist sinkron: setiap move → push ke list, klik move = jump

### Minggu 2 — Engine + PGN
**Goal: Stockfish jalan, PGN import beneran.**

1. Tambah Stockfish 17 WASM via `lila-stockfish-web` atau `stockfish.wasm` (cek Worker compat — fallback ke web worker biasa kalau gagal)
2. `src/lib/engine/stockfish.ts` — Web Worker wrapper, UCI protocol
3. Toggle engine on/off → kirim FEN tiap move → terima `info depth N score cp X pv ...`
4. Update EvalBar live, stat strip (depth + eval), Top Lines (Multi-PV 3)
5. ImportTab: parse PGN pakai chess.js `.loadPgn()`, support multi-game
6. Fetch dari Lichess/Chess.com username (REST API publik, no auth needed): tombol "Pull last 10 games"
7. Color coding move: hijau (best), kuning (inaccuracy), merah (blunder) — threshold centipawn delta

### Minggu 3 — Cloud + Repertoire + Opening
**Goal: simpan repertoire, deteksi opening, deviation.**

1. Enable Lovable Cloud (anonymous session default, login Google optional)
2. Tabel `repertoires` (id, user_id, name, color, root_pgn, created_at) + `repertoire_moves` (tree structure)
3. RepertoireTab CRUD: create/edit/delete, view as tree
4. ECO opening detection: bundle `eco.json` (~500 entries, ~50KB) → match by move sequence
5. OpeningStrip live update: "Ruy Lopez · C84"
6. Deviation finder: saat main, kalau move keluar dari repertoire → flag merah + tombol "Add to review"
7. FSRS spaced repetition (`ts-fsrs` package) untuk review queue — daily training mode

### Minggu 4 — Polish, responsif, SEO
**Goal: rapi di mobile, fast, shareable.**

1. Responsive: board `clamp(280px, 90vw, 640px)`, panel kanan stack di bawah <lg
2. Sticky transport bar di mobile, swipe ←/→ untuk prev/next move
3. Keyboard nav: ←/→ move, ↑/↓ variation, F flip, E engine toggle
4. Skeleton loaders saat engine init, PGN parse, Cloud fetch
5. Route split: `/analysis`, `/repertoire`, `/import` (sekarang semua di `/` via tab) — lebih SEO + shareable URL
6. Per-route `head()`: title, description, og:image (screenshot board sebagai og:image untuk shared position)
7. Color tokens audit: pastikan `--blunder`, `--mistake`, `--good`, `--brilliant` di `styles.css` (bukan hex inline)
8. Lighthouse pass: target ≥85 perf, fix CLS dari board mount

---

## Technical notes

- **chess.js v1.0** API: `new Chess()`, `.move({from,to,promotion})`, `.fen()`, `.history({verbose:true})`, `.isGameOver()`, `.isCheckmate()`, dst
- **Stockfish WASM**: pakai Web Worker, postMessage UCI strings. Mobile: set `Hash 16` MB, `Threads 1`. Cek apakah `SharedArrayBuffer` tersedia (butuh COOP/COEP headers di TanStack Start config — kalau tidak, fallback single-thread version)
- **ECO database**: ambil dari `lichess-org/chess-openings` (TSV public domain), convert ke JSON saat build time
- **Lichess API**: `https://lichess.org/api/games/user/{username}?max=10&pgnInJson=true` — no auth, rate limit cukup longgar
- **Chess.com API**: `https://api.chess.com/pub/player/{username}/games/{YYYY}/{MM}` — public, no auth
- **Cloud schema** (Minggu 3): tabel `repertoires`, `repertoire_moves`, `review_cards` (FSRS state: due, stability, difficulty, reps). RLS by `user_id = auth.uid()`. Grants `authenticated` only.
- **Tidak diubah**: design system (gold + warm charcoal + serif display), Cburnett piece set, sidebar layout

---

## Yang tidak masuk v1.0 (catat untuk v2.0)

- LLM-based move explanation (butuh AI Gateway, biaya per-call)
- 7-piece Syzygy tablebase (besar, butuh CDN khusus atau pakai Lichess API)
- Collaborative rooms (WebSocket presence)
- Mobile native app / PWA installable (Service Worker setup terpisah)
- i18n EN/ID (sekarang bilingual mixed, bisa diformalkan nanti)
- Stripe billing

---

## Deliverable per minggu

| Minggu | Demo bisa diliat |
|---|---|
| 1 | Main catur lawan diri sendiri, klik movelist navigate, promosi & game-over jalan |
| 2 | Stockfish nyala, eval bar gerak, paste PGN game pro → review move-by-move |
| 3 | Buat repertoire "Ruy Lopez putih", main game → otomatis flag deviasi, review SRS besoknya |
| 4 | Buka di HP nyaman, share link posisi (FEN di URL) ke teman, Lighthouse hijau |

Mau aku mulai dari **Minggu 1 (chess.js + interaktivitas)** sebagai milestone pertama? Atau kamu mau urut beda — misal langsung Stockfish dulu karena itu yang paling "wow"?
