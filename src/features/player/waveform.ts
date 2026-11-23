/**
 * Sóng âm "bằng chứng sống" — sinh từ word-timestamp của transcript.
 * Ô càng nhiều lời nói thì càng cao; khoảng lặng = đáy băng.
 * (Không phân tích audio YouTube — cross-origin; dữ liệu thời gian từ là nguồn thật.)
 */
import type { Sentence } from "../../types/content";

export function buildWaveformBins(
  sentences: Sentence[],
  durationMs: number,
  bins = 64,
): number[] {
  const out = new Array<number>(bins).fill(0);
  if (durationMs <= 0) return out.map(() => 0.18);

  for (const sentence of sentences) {
    for (const word of sentence.words) {
      const a = Math.max(0, word.s);
      const b = Math.min(durationMs, Math.max(a + 1, word.e));
      const i0 = Math.floor((a / durationMs) * bins);
      const i1 = Math.min(bins - 1, Math.floor((b / durationMs) * bins));
      for (let i = i0; i <= i1; i += 1) out[i] += 1;
    }
  }

  // làm mượt 1 nhịp để sóng không lởm chởm
  const smoothed = out.map((v, i) => {
    const prev = out[i - 1] ?? v;
    const next = out[i + 1] ?? v;
    return (prev + v * 2 + next) / 4;
  });

  const peak = Math.max(1, ...smoothed);
  return smoothed.map((v) => 0.2 + 0.8 * (v / peak));
}
