/**
 * 6 chân dung thám tử noir — SVG vẽ tay (SPEC §3 "Chân dung thám tử").
 * Flat noir: bóng tối + viền hổ phách, prop riêng từng archetype.
 * Dùng CSS vars → tự theo theme sáng/tối.
 */
import type { AvatarId } from "../../types/game";

export const AVATAR_META: {
  id: AvatarId;
  title: { vi: string; en: string };
  flavor: { vi: string; en: string };
  motto: { vi: string; en: string };
}[] = [
  {
    id: "avatar-cop",
    title: { vi: "Cựu cảnh sát", en: "Ex-cop" },
    flavor: {
      vi: "20 năm ngoài đường phố. Nghe giọng ai là biết có nói thật không.",
      en: "20 years on the street. One sentence and he knows if it's the truth.",
    },
    motto: {
      vi: "Đường phố dạy tôi: ai cũng nói dối một chút.",
      en: "The street taught me: everyone lies a little.",
    },
  },
  {
    id: "avatar-journalist",
    title: { vi: "Phóng viên điều tra", en: "Investigative journalist" },
    flavor: {
      vi: "Chuyên moi hồ sơ cũ và nghe lén họp báo. Nguồn tin là mạng sống.",
      en: "Digs old files and eavesdrops on pressers. Sources are life.",
    },
    motto: {
      vi: "Không có nguồn tin xấu — chỉ có câu hỏi chưa đúng.",
      en: "No bad source — only the wrong question.",
    },
  },
  {
    id: "avatar-audio",
    title: { vi: "Chuyên gia giám định âm thanh", en: "Audio forensic expert" },
    flavor: {
      vi: "Đeo tai nghe cả ngày. Nhìn waveform là biết ai đang giấu.",
      en: "Headphones on all day. The waveform betrays who is hiding.",
    },
    motto: {
      vi: "Âm thanh không biết nói dối. Con người thì có.",
      en: "Sound cannot lie. People can.",
    },
  },
  {
    id: "avatar-pi",
    title: { vi: "Thám tử tư", en: "Private eye" },
    flavor: {
      vi: "Nhận vụ không ai nhận. Kính lúp, tẩu thuốc, và sự kiên nhẫn.",
      en: "Takes the cases nobody wants. Magnifier, pipe, patience.",
    },
    motto: {
      vi: "Sự thật luôn ở đó. Chỉ là đang nói rất khẽ.",
      en: "The truth is always there. It just speaks softly.",
    },
  },
  {
    id: "avatar-hacker",
    title: { vi: "Hacker mũ xám", en: "Gray-hat hacker" },
    flavor: {
      vi: "Bẻ khoá file audio cũ, truy vết metadata. Không phải lúc nào cũng hợp pháp.",
      en: "Cracks old audio files, chases metadata. Not always legal.",
    },
    motto: {
      vi: "Mọi file đều để lại dấu. Mọi người cũng vậy.",
      en: "Every file leaves a trace. So does everyone.",
    },
  },
  {
    id: "avatar-reporter",
    title: { vi: "Nhà báo", en: "Reporter" },
    flavor: {
      vi: "Sổ tay không rời tay. Ghi lại từng chữ — kể cả chữ người ta nuốt mất.",
      en: "Notebook never leaves her hand. Writes every word — even swallowed ones.",
    },
    motto: {
      vi: "Câu trả lời nằm trong câu hỏi tôi chưa kịp ghi.",
      en: "The answer hides in the question I didn't write down.",
    },
  },
];

const skin = "var(--color-amber)";
const dark = "var(--color-ink)";
const deep = "var(--color-void)";

function Frame({ children }: { children: React.ReactNode }) {
  return (
    <svg
      viewBox="0 0 200 200"
      className="h-full w-full"
      role="img"
      aria-hidden="true"
    >
      <rect width="200" height="200" fill={deep} />
      <circle cx="100" cy="96" r="86" fill={dark} />
      <circle
        cx="100"
        cy="96"
        r="86"
        fill="none"
        stroke={skin}
        strokeOpacity="0.35"
        strokeWidth="2"
      />
      {children}
    </svg>
  );
}

function Bust({
  children,
  collar = true,
}: {
  children?: React.ReactNode;
  collar?: boolean;
}) {
  return (
    <>
      {/* vai + cổ áo */}
      <path
        d="M28 200 C34 152 62 132 100 132 C138 132 166 152 172 200 Z"
        fill={dark}
        stroke={skin}
        strokeOpacity="0.55"
        strokeWidth="2.5"
      />
      {collar ? (
        <path
          d="M100 132 L78 168 L100 152 L122 168 Z"
          fill={deep}
          stroke={skin}
          strokeOpacity="0.4"
          strokeWidth="1.5"
        />
      ) : null}
      {/* đầu */}
      <ellipse cx="100" cy="88" rx="38" ry="44" fill={dark} stroke={skin} strokeOpacity="0.55" strokeWidth="2.5" />
      {children}
    </>
  );
}

function Rim() {
  return (
    <path
      d="M132 62 C142 78 142 104 130 122"
      fill="none"
      stroke={skin}
      strokeOpacity="0.8"
      strokeWidth="3"
      strokeLinecap="round"
    />
  );
}

export function DetectiveAvatar({ id, className }: { id: AvatarId; className?: string }) {
  return (
    <div className={className ?? "aspect-square w-full"}>
      {id === "avatar-cop" ? (
        <Frame>
          <Bust>
            {/* fedora */}
            <path d="M52 66 C56 34 144 34 148 66 L142 70 C132 56 68 56 58 70 Z" fill={deep} stroke={skin} strokeOpacity="0.5" strokeWidth="2" />
            <path d="M46 68 C60 58 140 58 154 68 L152 76 C132 66 68 66 48 76 Z" fill={dark} stroke={skin} strokeOpacity="0.5" strokeWidth="2" />
            {/* mắt cú vọ + hàm vuông */}
            <rect x="74" y="88" width="18" height="5" rx="2" fill={skin} opacity="0.9" />
            <rect x="108" y="88" width="18" height="5" rx="2" fill={skin} opacity="0.9" />
            <path d="M84 118 L116 118 L112 130 L88 130 Z" fill={deep} stroke={skin} strokeOpacity="0.35" strokeWidth="1.5" />
            <Rim />
          </Bust>
        </Frame>
      ) : id === "avatar-journalist" ? (
        <Frame>
          <Bust>
            {/* mũ nhà báo + thẻ */}
            <path d="M56 62 C64 40 136 40 144 62 L138 68 C128 52 72 52 62 68 Z" fill={deep} stroke={skin} strokeOpacity="0.5" strokeWidth="2" />
            <rect x="86" y="46" width="28" height="10" rx="2" fill={skin} opacity="0.85" />
            {/* camera */}
            <rect x="70" y="150" width="34" height="24" rx="4" fill={deep} stroke={skin} strokeOpacity="0.6" strokeWidth="2" />
            <circle cx="87" cy="162" r="8" fill={dark} stroke={skin} strokeOpacity="0.7" strokeWidth="2" />
            <rect x="104" y="144" width="14" height="8" rx="2" fill={dark} stroke={skin} strokeOpacity="0.5" strokeWidth="1.5" />
            {/* mắt tinh tường */}
            <circle cx="85" cy="92" r="4" fill={skin} />
            <circle cx="115" cy="92" r="4" fill={skin} />
            <path d="M78 84 L92 82 M108 82 L122 84" stroke={skin} strokeOpacity="0.8" strokeWidth="2.5" strokeLinecap="round" />
            <Rim />
          </Bust>
        </Frame>
      ) : id === "avatar-audio" ? (
        <Frame>
          <Bust collar={false}>
            {/* headphone */}
            <path d="M56 92 C56 48 144 48 144 92" fill="none" stroke={skin} strokeOpacity="0.75" strokeWidth="5" strokeLinecap="round" />
            <rect x="44" y="84" width="22" height="36" rx="9" fill={deep} stroke={skin} strokeOpacity="0.7" strokeWidth="2.5" />
            <rect x="134" y="84" width="22" height="36" rx="9" fill={deep} stroke={skin} strokeOpacity="0.7" strokeWidth="2.5" />
            {/* waveform trước ngực */}
            <g stroke={skin} strokeOpacity="0.85" strokeWidth="3" strokeLinecap="round">
              <line x1="78" y1="160" x2="78" y2="172" />
              <line x1="88" y1="152" x2="88" y2="180" />
              <line x1="98" y1="146" x2="98" y2="186" />
              <line x1="108" y1="152" x2="108" y2="180" />
              <line x1="118" y1="158" x2="118" y2="174" />
            </g>
            {/* mắt nhắm nghe */}
            <path d="M78 96 C82 90 90 90 94 96 M106 96 C110 90 118 90 122 96" fill="none" stroke={skin} strokeOpacity="0.9" strokeWidth="2.5" strokeLinecap="round" />
            <Rim />
          </Bust>
        </Frame>
      ) : id === "avatar-pi" ? (
        <Frame>
          <Bust>
            {/* fedora + tẩu */}
            <path d="M54 64 C60 36 140 36 146 64 L140 70 C130 54 70 54 60 70 Z" fill={deep} stroke={skin} strokeOpacity="0.5" strokeWidth="2" />
            <path d="M48 70 C64 60 136 60 152 70 L150 78 C130 68 70 68 50 78 Z" fill={dark} stroke={skin} strokeOpacity="0.5" strokeWidth="2" />
            <path d="M82 122 C90 126 102 126 110 120" fill="none" stroke={skin} strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
            <path d="M112 118 C124 112 132 108 138 100" stroke={skin} strokeOpacity="0.7" strokeWidth="3" strokeLinecap="round" fill="none" />
            {/* kính lúp */}
            <circle cx="146" cy="146" r="18" fill="none" stroke={skin} strokeOpacity="0.85" strokeWidth="3.5" />
            <line x1="158" y1="160" x2="176" y2="180" stroke={skin} strokeOpacity="0.85" strokeWidth="5" strokeLinecap="round" />
            <circle cx="146" cy="146" r="10" fill={skin} opacity="0.12" />
            <rect x="76" y="88" width="16" height="4" rx="2" fill={skin} opacity="0.9" />
            <rect x="108" y="88" width="16" height="4" rx="2" fill={skin} opacity="0.9" />
            <Rim />
          </Bust>
        </Frame>
      ) : id === "avatar-hacker" ? (
        <Frame>
          <Bust collar={false}>
            {/* hoodie */}
            <path d="M52 78 C52 40 148 40 148 78 L148 118 L132 100 C120 88 80 88 68 100 L52 118 Z" fill={deep} stroke={skin} strokeOpacity="0.5" strokeWidth="2" />
            {/* ánh màn hình lên mặt */}
            <ellipse cx="100" cy="104" rx="26" ry="18" fill={skin} opacity="0.14" />
            <rect x="80" y="96" width="40" height="3" rx="1.5" fill={skin} opacity="0.85" />
            <rect x="86" y="106" width="28" height="3" rx="1.5" fill={skin} opacity="0.55" />
            <rect x="92" y="116" width="16" height="3" rx="1.5" fill={skin} opacity="0.35" />
            {/* terminal ở ngực */}
            <rect x="72" y="150" width="56" height="34" rx="4" fill={dark} stroke={skin} strokeOpacity="0.6" strokeWidth="2" />
            <path d="M82 162 L92 170 L82 178" fill="none" stroke={skin} strokeOpacity="0.9" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" />
            <line x1="98" y1="178" x2="118" y2="178" stroke={skin} strokeOpacity="0.7" strokeWidth="2.5" strokeLinecap="round" />
            <Rim />
          </Bust>
        </Frame>
      ) : (
        <Frame>
          <Bust>
            {/* tóc búi + bút chì */}
            <circle cx="100" cy="46" r="16" fill={dark} stroke={skin} strokeOpacity="0.5" strokeWidth="2" />
            <path d="M62 70 C68 44 132 44 138 70" fill={dark} stroke={skin} strokeOpacity="0.45" strokeWidth="2" />
            <line x1="132" y1="38" x2="148" y2="26" stroke={skin} strokeOpacity="0.8" strokeWidth="3.5" strokeLinecap="round" />
            {/* mắt tinh + môi cười nhẹ */}
            <circle cx="85" cy="92" r="3.5" fill={skin} />
            <circle cx="115" cy="92" r="3.5" fill={skin} />
            <path d="M90 116 C96 122 106 122 112 116" fill="none" stroke={skin} strokeOpacity="0.8" strokeWidth="2.5" strokeLinecap="round" />
            {/* sổ tay */}
            <rect x="66" y="150" width="42" height="32" rx="3" fill={deep} stroke={skin} strokeOpacity="0.65" strokeWidth="2" />
            <line x1="74" y1="160" x2="98" y2="160" stroke={skin} strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
            <line x1="74" y1="168" x2="94" y2="168" stroke={skin} strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
            <line x1="74" y1="176" x2="88" y2="176" stroke={skin} strokeOpacity="0.5" strokeWidth="2" strokeLinecap="round" />
            <line x1="118" y1="148" x2="134" y2="180" stroke={skin} strokeOpacity="0.85" strokeWidth="3.5" strokeLinecap="round" />
            <Rim />
          </Bust>
        </Frame>
      )}
    </div>
  );
}
