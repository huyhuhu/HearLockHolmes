/**
 * YouTube IFrame API loader + kiểu player tối thiểu.
 * Web KHÔNG host audio/video (SPEC §2) — chỉ seek trong iframe.
 */

interface YTPlayerInstance {
  playVideo(): void;
  pauseVideo(): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  getPlayerState(): number;
  setPlaybackRate(rate: number): void;
  getPlaybackRate(): number;
  getAvailablePlaybackRates(): number[];
  destroy(): void;
}

type YTPlayerConstructor = new (
  element: HTMLElement,
  options: {
    videoId: string;
    width?: number | string;
    height?: number | string;
    playerVars?: Record<string, string | number>;
    events?: {
      onReady?: (e: { target: YTPlayerInstance }) => void;
      onStateChange?: (e: { data: number }) => void;
      onError?: (e: { data: number }) => void;
    };
  },
) => YTPlayerInstance;

interface YTNamespace {
  Player: YTPlayerConstructor;
  PlayerState: {
    UNSTARTED: number;
    ENDED: number;
    PLAYING: number;
    PAUSED: number;
    BUFFERING: number;
    CUED: number;
  };
}

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

export type { YTPlayerInstance };

const API_SRC = "https://www.youtube.com/iframe_api";

let apiPromise: Promise<void> | null = null;

/** Nạp IFrame API một lần; gọi lại sau khi fail sẽ thử lại. */
export function loadYouTubeApi(): Promise<void> {
  if (window.YT?.Player) return Promise.resolve();
  if (apiPromise) return apiPromise;

  apiPromise = new Promise<void>((resolve, reject) => {
    const done = () => resolve();
    const prev = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      prev?.();
      done();
    };

    const script = document.createElement("script");
    script.src = API_SRC;
    script.async = true;
    script.onerror = () => {
      apiPromise = null;
      reject(new Error("YouTube IFrame API failed to load"));
    };
    document.head.appendChild(script);

    window.setTimeout(() => {
      if (window.YT?.Player) {
        done();
      } else {
        apiPromise = null;
        reject(new Error("YouTube IFrame API timed out"));
      }
    }, 15000);
  });

  return apiPromise;
}

/**
 * Ép iframe YouTube lấp đầy container.
 * YT.Player mặc định tạo iframe 640×390 — nếu không ép thì video bị crop
 * và tràn đè lên waveform ở desktop.
 */
export function fitPlayerFrame(container: HTMLElement | null): void {
  const frame = container?.querySelector("iframe");
  if (!frame) return;
  frame.style.position = "absolute";
  frame.style.inset = "0";
  frame.style.width = "100%";
  frame.style.height = "100%";
  frame.style.border = "0";
  frame.style.maxWidth = "none";
}

export function createYouTubePlayer(
  element: HTMLElement,
  options: {
    videoId: string;
    startSeconds: number;
    onReady?: (player: YTPlayerInstance) => void;
    onStateChange?: (playing: boolean) => void;
  },
): YTPlayerInstance {
  const YT = window.YT;
  if (!YT?.Player) throw new Error("YouTube IFrame API is not loaded");

  return new YT.Player(element, {
    videoId: options.videoId,
    // lấp container — không thì iframe ra 640×390 và bị cắt
    width: "100%",
    height: "100%",
    playerVars: {
      start: Math.floor(options.startSeconds),
      autoplay: 0,
      // không phụ đề — "nghe mù" là luật (SPEC §1)
      cc_load_policy: 0,
      rel: 0,
      modestbranding: 1,
      playsinline: 1,
      iv_load_policy: 3,
      origin: window.location.origin,
    },
    events: {
      onReady: (e) => {
        fitPlayerFrame(element.parentElement);
        options.onReady?.(e.target);
      },
      onStateChange: (e) =>
        options.onStateChange?.(e.data === YT.PlayerState.PLAYING),
    },
  });
}
