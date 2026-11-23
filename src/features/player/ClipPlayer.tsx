/**
 * Clip player — quấn YouTube IFrame, tọa độ clip-relative (ms).
 *
 * A–B loop tự dựng bằng seek + timer (YouTube không có sẵn) — SPEC §2.
 * `timeMs` sống trong external store để waveform đọc được ở 8Hz mà không
 * re-render cả cây micro-loop.
 */
import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useSyncExternalStore,
  type ReactNode,
  type RefObject,
} from "react";
import {
  createYouTubePlayer,
  fitPlayerFrame,
  loadYouTubeApi,
  type YTPlayerInstance,
} from "../../lib/youtube";

export const RATES = [0.75, 1, 1.25] as const;
export type Rate = (typeof RATES)[number];

export type LoopSpan = { startMs: number; endMs: number };

export type ClipPlayerApi = {
  play(): void;
  pause(): void;
  toggle(): void;
  /** seek tới mốc clip-relative */
  seekMs(ms: number): void;
  /**
   * Phát [startMs, endMs].
   * - `loop: true` (mặc định) — lặp A–B: dành cho "nghe đoạn đó" ±1s.
   * - `loop: false` — phát 1 lần rồi tự dừng ở endMs: dành cho "nghe cả câu".
   */
  playSpan(startMs: number, endMs: number, opts?: { loop?: boolean }): void;
  clearLoop(): void;
  setRate(rate: Rate): void;
};

export type ClipPlayerView = {
  status: "loading" | "ready" | "error";
  error: string | null;
  playing: boolean;
  rate: Rate;
  loop: LoopSpan | null;
};

export type ClipPlayerController = {
  containerRef: RefObject<HTMLDivElement | null>;
  api: ClipPlayerApi;
  view: ClipPlayerView;
  /** đọc thời điểm hiện tại (clip-relative ms) — không gây re-render */
  getTimeMs(): number;
  subscribeTime(listener: () => void): () => void;
};

function createTimeStore() {
  let value = 0;
  const listeners = new Set<() => void>();
  return {
    get: () => value,
    set(next: number) {
      value = next;
      listeners.forEach((l) => l());
    },
    subscribe(listener: () => void) {
      listeners.add(listener);
      return () => {
        listeners.delete(listener);
      };
    },
  };
}

const TICK_MS = 120;

export function useClipPlayerController(args: {
  videoId: string;
  startOffsetMs: number;
  /** độ dài clip (ms) — dùng clamp loop + waveform */
  clipDurationMs: number;
}): ClipPlayerController {
  const { videoId, startOffsetMs, clipDurationMs } = args;

  const containerRef = useRef<HTMLDivElement | null>(null);
  const playerRef = useRef<YTPlayerInstance | null>(null);
  const loopRef = useRef<LoopSpan | null>(null);
  /** mốc dừng cho kiểu "phát 1 lần rồi dừng" */
  const stopAtRef = useRef<number | null>(null);
  const rateRef = useRef<Rate>(1);
  const timeStore = useMemo(createTimeStore, []);
  const mountedRef = useRef(true);

  const [status, setStatus] = useState<ClipPlayerView["status"]>("loading");
  const [error, setError] = useState<string | null>(null);
  const [playing, setPlaying] = useState(false);
  const [rate, setRateState] = useState<Rate>(1);
  const [loop, setLoopState] = useState<LoopSpan | null>(null);

  useEffect(() => {
    mountedRef.current = true;
    return () => {
      mountedRef.current = false;
    };
  }, []);

  // tạo/hủy player — YT.Player thay node mount bằng iframe nên ta tự tạo node đó
  useEffect(() => {
    let disposed = false;
    let instance: YTPlayerInstance | null = null;

    setStatus("loading");
    setError(null);

    loadYouTubeApi()
      .then(() => {
        if (disposed || !containerRef.current) return;
        const container = containerRef.current;
        // node YT sẽ thay thế — phải có kích thước thật trước khi Player đọc
        const mount = document.createElement("div");
        mount.style.position = "absolute";
        mount.style.inset = "0";
        mount.style.width = "100%";
        mount.style.height = "100%";
        container.appendChild(mount);
        instance = createYouTubePlayer(mount, {
          videoId,
          startSeconds: startOffsetMs / 1000,
          onReady: () => {
            if (disposed) return;
            fitPlayerFrame(container);
            try {
              instance?.setPlaybackRate(1);
            } catch {
              /* video chưa sẵn sàng nhận rate — bỏ qua */
            }
            setStatus("ready");
          },
          onStateChange: (isPlaying) => {
            if (!disposed) setPlaying(isPlaying);
          },
        });
        playerRef.current = instance;
        fitPlayerFrame(container);
      })
      .catch((err: unknown) => {
        if (disposed) return;
        setStatus("error");
        setError(err instanceof Error ? err.message : String(err));
      });

    return () => {
      disposed = true;
      playerRef.current = null;
      loopRef.current = null;
      stopAtRef.current = null;
      try {
        instance?.destroy();
      } catch {
        /* player đã bị gỡ trước đó */
      }
      const node = containerRef.current;
      if (node) while (node.firstChild) node.removeChild(node.firstChild);
    };
  }, [videoId, startOffsetMs]);

  // tick: đọc giờ + thực thi vòng A–B (seek + timer)
  useEffect(() => {
    const id = window.setInterval(() => {
      const player = playerRef.current;
      if (!player) return;

      let videoMs = 0;
      try {
        videoMs = player.getCurrentTime() * 1000;
      } catch {
        return;
      }
      const clipMs = Math.max(0, Math.min(clipDurationMs, videoMs - startOffsetMs));

      const active = loopRef.current;
      if (active && clipMs >= active.endMs) {
        try {
          player.seekTo((startOffsetMs + active.startMs) / 1000, true);
          player.playVideo();
        } catch {
          /* bỏ qua seek lỗi trong lúc tải */
        }
        timeStore.set(active.startMs);
        return;
      }

      // phát 1 lần: chạm endMs thì dừng, không lặp
      const stopAt = stopAtRef.current;
      if (stopAt !== null && clipMs >= stopAt) {
        stopAtRef.current = null;
        try {
          player.pauseVideo();
        } catch {
          /* player chưa sẵn sàng */
        }
        timeStore.set(stopAt);
        return;
      }

      timeStore.set(clipMs);
    }, TICK_MS);
    return () => window.clearInterval(id);
  }, [startOffsetMs, clipDurationMs, timeStore]);

  const api = useMemo<ClipPlayerApi>(
    () => ({
      play() {
        playerRef.current?.playVideo();
      },
      pause() {
        playerRef.current?.pauseVideo();
      },
      toggle() {
        const player = playerRef.current;
        if (!player) return;
        if (player.getPlayerState() === 1) player.pauseVideo();
        else player.playVideo();
      },
      seekMs(ms: number) {
        const clamped = Math.max(0, Math.min(clipDurationMs, ms));
        playerRef.current?.seekTo((startOffsetMs + clamped) / 1000, true);
        timeStore.set(clamped);
      },
      playSpan(startMs: number, endMs: number, opts?: { loop?: boolean }) {
        const a = Math.max(0, Math.min(clipDurationMs, startMs));
        const b = Math.max(a + 1, Math.min(clipDurationMs, endMs));
        const shouldLoop = opts?.loop !== false;

        if (shouldLoop) {
          loopRef.current = { startMs: a, endMs: b };
          stopAtRef.current = null;
          setLoopState({ startMs: a, endMs: b });
        } else {
          loopRef.current = null;
          stopAtRef.current = b;
          setLoopState(null);
        }

        const player = playerRef.current;
        if (!player) return;
        try {
          player.seekTo((startOffsetMs + a) / 1000, true);
          player.setPlaybackRate(rateRef.current);
          player.playVideo();
        } catch {
          /* player chưa sẵn sàng */
        }
        timeStore.set(a);
      },
      clearLoop() {
        loopRef.current = null;
        stopAtRef.current = null;
        setLoopState(null);
      },
      setRate(next: Rate) {
        rateRef.current = next;
        setRateState(next);
        try {
          playerRef.current?.setPlaybackRate(next);
        } catch {
          /* video chưa sẵn sàng */
        }
      },
    }),
    [clipDurationMs, startOffsetMs, timeStore],
  );

  useEffect(() => {
    rateRef.current = rate;
  }, [rate]);

  const view = useMemo<ClipPlayerView>(
    () => ({ status, error, playing, rate, loop }),
    [status, error, playing, rate, loop],
  );

  return useMemo(
    () => ({
      containerRef,
      api,
      view,
      getTimeMs: timeStore.get,
      subscribeTime: timeStore.subscribe,
    }),
    [api, view, timeStore],
  );
}

type ClipPlayerContextValue = ClipPlayerController | null;

const ClipPlayerContext = createContext<ClipPlayerContextValue>(null);

export function ClipPlayerProvider({
  controller,
  children,
}: {
  controller: ClipPlayerController;
  children: ReactNode;
}) {
  return (
    <ClipPlayerContext.Provider value={controller}>
      {children}
    </ClipPlayerContext.Provider>
  );
}

export function useClipPlayer(): ClipPlayerController {
  const ctx = useContext(ClipPlayerContext);
  if (!ctx) throw new Error("useClipPlayer must be used within ClipPlayerProvider");
  return ctx;
}

/** Thời điểm hiện tại (clip ms) — chỉ component nào cần thì re-render. */
export function usePlayerTimeMs(): number {
  const { getTimeMs, subscribeTime } = useClipPlayer();
  return useSyncExternalStore(subscribeTime, getTimeMs, getTimeMs);
}
