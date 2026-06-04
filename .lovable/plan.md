## Tujuan

Polish layout EFChess mengikuti struktur referensi (chess.com-style), TAPI:
- **Ganti glyph Unicode dengan SVG piece set profesional** (Cburnett / Wikipedia standard — set yang dipakai Lichess, chess.com web)
- Pertahankan finishing dark premium (gold + warm charcoal + serif display) — buang background ungu mentah

## Piece Set

Pakai **Cburnett SVG set** (lisensi CC BY-SA 3.0, dipakai Lichess) — 12 file SVG:
`wK wQ wR wB wN wP bK bQ bR bB bN bP`

Sumber: `https://github.com/lichess-org/lila/tree/master/public/piece/cburnett`

Langkah:
1. Download 12 SVG via `curl` ke `/tmp/`
2. Upload masing-masing ke CDN via `lovable-assets create --file ... --filename wK.svg > src/assets/pieces/wK.svg.asset.json`
3. Buat `src/assets/pieces/index.ts` yang map `{ wK: wKAsset.url, ... }`
4. Hapus file SVG asli dari `/tmp` (pointer .asset.json sudah cukup)

## Perubahan layout (dari referensi)

### `src/components/chess-board.tsx`
- Render `<img src={pieceUrl[piece]} />` sebagai pengganti `<span>♜</span>`
- Drop shadow halus pada piece (`filter: drop-shadow(0 2px 2px oklch(0 0 0 / .35))`)
- Inner border ring untuk depth
- Coordinate label kontras tinggi (algebraic a-h, 1-8)

### `src/components/eval-bar.tsx` (baru)
- Bar vertikal tipis (6px) menempel di kiri papan
- Split putih/hitam proporsional ke eval
- Angka eval di ujung (white di bawah, black di atas)

### `src/routes/index.tsx` — restruktur panel kanan sesuai referensi
```
ANALYSIS  IMPORT  REPERTOIRE             ⚙
─────────────────────────────────────────
⏻ Engine off              Stockfish 16
─────────────────────────────────────────
ACCURACY  │   EVAL +0.0   │   DEPTH —
─────────────────────────────────────────
▸ King's Pawn Opening · C20          📋
─────────────────────────────────────────
White ▾ · Black                       ✎
─────────────────────────────────────────
 1.  e4         e5
 2. [Nf3]       Nc6     ← pill gold = aktif
 3.  Bb5         a6
─────────────────────────────────────────
       ⏮   ◀   ⟳   ▶   ⏭
```

### Komponen baru
- `src/components/eval-bar.tsx`
- `src/components/move-list.tsx` (dummy data: 1.e4 e5 2.Nf3 Nc6 3.Bb5 a6 4.Ba4 Nf6)
- `src/components/opening-strip.tsx` (hardcode "King's Pawn Opening · C20" + copy PGN button)
- `src/components/transport-bar.tsx` (5 tombol nav, gold accent untuk current)

### `src/styles.css`
- Util `.move-pill` (bg gold/15, text gold, radius sm)
- Token `--color-eval-white` / `--color-eval-black`
- Pastikan tidak ada warna ungu liar — semua via design token

## Tidak diimplementasi sekarang (tetap dummy)

- chess.js / CM-Chessboard interactivity (board statis starting position)
- Engine WASM (toggle hanya visual)
- Opening detection real (hardcode)
- Movelist navigation logic

## Tidak diubah

- Sidebar kiri, topbar, tab Import & Repertoire, routing, design tokens utama

## Hasil

Tampilan profesional 1:1 dengan vibe chess.com/Lichess — piece SVG asli (bukan Unicode), eval bar menempel papan, opening strip, movelist 2-kolom pill gold, transport bar — semuanya di-finish dengan dark+gold EFChess.
