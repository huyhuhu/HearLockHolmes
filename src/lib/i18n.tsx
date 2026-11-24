import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";

export type Lang = "vi" | "en";

const dict = {
  vi: {
    tagline: "Mọi âm thanh đều để lại manh mối.",
    "nav.cases": "Sổ vụ án",
    "nav.daily": "Nhiệm vụ ngày",
    "nav.profile": "Hồ sơ",
    "nav.cases.short": "Vụ án",
    "nav.daily.short": "Nhiệm vụ",
    "nav.profile.short": "Hồ sơ",
    "auth.login": "Đăng nhập Google",
    "auth.logout": "Đăng xuất",
    "auth.notConfigured":
      "Firebase chưa cấu hình — copy .env.example thành .env.local và điền config để bật đăng nhập.",
    "auth.signedInAs": "Thám tử",
    "auth.anonymous": "Khách lạ (chưa đăng nhập)",
    "sync.synced": "Đã đồng bộ",
    "sync.syncing": "Đang đồng bộ…",
    "sync.offline": "Ngoại tuyến — sẽ lưu & đồng bộ khi có mạng",
    "sync.error": "Chưa đồng bộ được — sẽ thử lại",
    "sync.title": "Đồng bộ đa thiết bị",
    "sync.sub": "Đăng nhập để tiến độ học được sao lưu và đồng bộ qua mọi thiết bị.",
    "home.headline": "HEARLOCK HOLMES",
    "home.sub": "Nghe hiểu tiếng bản xứ tốc độ thật — chính là phá án.",
    "home.caseFiles": "Mở Sổ vụ án",
    "home.caseFilesSoon":
      "Hồ sơ vụ án đang được lập…",
    "home.caseFilesSoonSub":
      "Vụ đầu tiên sẽ xuất hiện tại đây sau khi kho tư liệu được thu thập.",
    "home.start": "Bắt đầu điều tra",
    "home.startSub": "Đi một câu thoại trọn vòng: nghe mù → mổ xẻ → giải mã → nghe lại.",
    "lang.label": "Ngôn ngữ",
    "theme.toLight": "Chuyển ban ngày",
    "theme.toDark": "Chuyển đêm",
    "login.title": "Vào phòng làm việc",
    "login.sub": "Đăng nhập để hồ sơ thám tử của bạn được lưu lại.",

    "clip.eyebrow": "HỒ SƠ BẰNG CHỨNG",
    "clip.notFound": "Không tìm thấy clip này.",
    "clip.backHome": "Về trang chủ",

    "loop.stage.blind": "Hiện trường",
    "loop.stage.dissect": "Phòng thí nghiệm",
    "loop.stage.decode": "Giải mã",
    "loop.stage.relisten": "Ghi hồ sơ",
    "loop.stage.done": "Đã xong",

    "loop.blind.eyebrow": "NGHE MÙ — KHÔNG CHỮ",
    "loop.blind.hint":
      "Nghe ở tốc độ thật. Chưa có transcript — chỉ có âm thanh.",
    "loop.blind.gate": "CÂU HỎI HIỆN TRƯỜNG",
    "loop.blind.gateHint":
      "Trả lời để mở khóa Phòng thí nghiệm. Đúng hay sai đều mở khóa — chỉ là hương vị.",
    "loop.blind.hit": "Đoán trúng.",
    "loop.blind.miss": "Trượt — nhưng hiện trường đã mở khóa.",
    "loop.blind.enter": "Vào Phòng thí nghiệm",

    "loop.dissect.eyebrow": "MỔ XẺ — CHẠM CỤM ĐỂ NGHE ĐOẠN ĐÓ",
    "loop.dissect.hint":
      "Cụm bị nuốt/nối được đánh dấu. Chạm để nghe đúng đoạn đó ±1s.",
    "loop.dissect.playSentence": "Nghe cả câu",
    "loop.dissect.clusterHint": "Nghe đoạn này ±1s",
    "loop.dissect.noClusters":
      "Câu này không có cụm bị nuốt — không có gì phải giải mã.",
    "loop.dissect.toDecode": "Giải mã cụm này",
    "loop.dissect.toRelisten": "Sang nghe lại",

    "loop.decode.eyebrow": "NHIỆM VỤ GIẢI MÃ — CHỌN DẠNG SẠCH",
    "loop.decode.hint":
      "Bạn nghe ra gì? Chọn dạng sạch của cụm âm trong 3–4 lựa chọn.",
    "loop.decode.prompt": "Dạng sạch của cụm này là gì?",
    "loop.decode.correct": "Trúng — đây là dạng sạch.",
    "loop.decode.wrong": "Chưa phải. Nghe lại đoạn đó rồi chọn lại.",
    "loop.decode.note": "Vì sao nghe không ra",
    "loop.decode.hear": "Nghe đoạn đó",
    "loop.decode.report": "BẢN TƯỜNG TRÌNH",
    "loop.decode.reportHint":
      "3 câu hiểu nghĩa — gắn manh mối với ngữ cảnh vụ án.",
    "loop.decode.next": "Câu sau",
    "loop.decode.toRelisten": "Nghe lại & ghi hồ sơ",
    "loop.decode.remaining": "Còn {n} cụm chưa giải mã xong.",

    "loop.relisten.eyebrow": "NGHE LẠI — GHI VÀO SỔ TAY",
    "loop.relisten.hint":
      "Nghe lại sau khi đã hiểu vì sao nghe không ra. Rồi ghi manh mối.",
    "loop.relisten.clear": "Nghe rõ rồi",
    "loop.relisten.fuzzy": "Vẫn còn mơ",
    "loop.relisten.save": "Ghi manh mối vào sổ tay",
    "loop.relisten.saved": "Đã ghi {n} manh mối vào sổ tay.",
    "loop.relisten.finish": "Đóng hồ sơ",
    "loop.relisten.noClusters": "Câu này không có manh mối để ghi.",

    "loop.nav.prev": "Câu trước",
    "loop.nav.next": "Câu sau",
    "loop.nav.sentence": "Câu {i}/{n}",
    "loop.nav.jumpClusters": "Nhảy tới câu có cụm",

    "loop.done.title": "Hồ sơ đã đóng",
    "loop.done.sub":
      "Manh mối đã ghi vào sổ tay. Sự thật nằm trong âm thanh.",
    "loop.done.clues": "Manh mối đã ghi",
    "loop.done.decoded": "Cụm đã giải mã",
    "loop.done.again": "Điều tra lại",
    "loop.done.home": "Về Sổ vụ án",

    "player.play": "Phát",
    "player.pause": "Tạm dừng",
    "player.replay": "Nghe lại",
    "player.hide": "Ẩn điều khiển",
    "player.show": "Hiện điều khiển",
    "player.rate": "Tốc độ",
    "player.abClear": "Bỏ vòng",
    "player.loading": "Đang nạp máy băng…",
    "player.error": "Không nạp được video YouTube. Kiểm tra mạng rồi thử lại.",
    "player.waveform": "Băng tần âm thanh",

    "cat.liaison": "Nối âm",
    "cat.reduced": "Nuốt/gọn",
    "cat.elision": "Bỏ âm",
    "cat.linking": "Nối phụ âm–nguyên âm",
    "cat.assimilation": "Đồng hóa",

    "rank.trainee": "Thám tử tập sự",
    "rank.veteran": "Thám tử kỳ cựu",
    "rank.legend": "Thám tử lừng danh",

    "home.hello": "Chào Thám tử {name}.",
    "home.subDetective": "Bàn làm việc đã mở. Hôm nay ta nghe gì?",
    "home.createDetective": "Lập hồ sơ thám tử",
    "home.daily": "Nhiệm vụ ngày {done}/{total}",
    "home.examReady": "Kỳ sát hạch sẵn sàng",
    "home.rankChip": "XH · {rank}",
    "home.levelChip": "Cấp {level} · {xp} XP",
    "home.noDetective": "Chưa lập hồ sơ",
    "home.rankHint":
      "Xếp hạng: Thám tử tập sự → kỳ cựu (≥{next} XP) → lừng danh (≥4000 XP) — mỗi bậc qua 1 kỳ sát hạch.",

    "case.locked": "Vụ này bị niêm phong — phá vụ nhỏ trước để mở khoá.",
    "case.smallCracked": "Vụ đã phá. Ba lời khai đã khớp nhau.",
    "case.bossCracked": "Boss đã hạ. Stream cuối cùng cũng hé lộ nội gián.",
    "case.smallNeed":
      "Điều kiện phá án: hiểu nghĩa ≥70% mỗi clip + giải mã ≥1 cụm/clip.",
    "case.bossNeed":
      "Điều kiện phá án: hiểu nghĩa ≥70% + giải mã ≥60% số cụm. Full speed, không phụ đề.",
    "case.drill": "LUYỆN TẬP",

    "daily.sub": "{name} ơi, đây là nhật ký điều tra hôm nay — không tính chuỗi, không phạt nghỉ.",
    "daily.subAnon": "Nhật ký điều tra hôm nay — không tính chuỗi, không phạt nghỉ.",
    "daily.progress": "{done}/{target} hoàn tất",
    "daily.done": "✓ Đã xong — XP tự cộng vào hồ sơ.",
    "daily.allDone": "TRỌN NGÀY — 3/3 NHIỆM VỤ",
    "daily.allDoneSub": "Hôm nay xong việc. Mai phá án tiếp, Thám tử.",
    "daily.goListen": "Bắt đầu nghe",
    "daily.noStreak": "Không streak, không phạt nghỉ — chỉ là nhật ký điều tra.",

    "profile.noDetective": "Hồ sơ trống.",
    "profile.noDetectiveSub":
      "Lập hồ sơ thám tử để theo dõi rank, XP và thành tựu.",
    "profile.rank": "Xếp hạng",
    "profile.level": "Cấp",
    "profile.clues": "Manh mối",
    "profile.events": "Sự kiện",
    "profile.intoLevel": "{into}/{need} XP cấp này",
    "profile.nextRank": "Hạng kế: {rank} — cần ≥{threshold} XP + qua sát hạch.",
    "profile.maxRank": "Đã đạt hạng cao nhất. Vụ khó hơn vẫn còn đó.",
    "profile.achievements": "THÀNH TỰU",

    "profile.skills": "HỒ SƠ NĂNG LỰC",
    "profile.skillsHint":
      "Tỷ lệ mất dấu theo 5 loại âm — tính từ lần sai dạng sạch, tự chấm “vẫn còn mơ”, tua nghe lại và nghe lại.",
    "profile.loss": "mất dấu",
    "profile.noSignal": "chưa có dữ liệu",
    "profile.signalCount": "{n} tín hiệu",
    "profile.suggest": "GỢI ÁN TIẾP THEO",
    "profile.suggestGo": "Điều tra clip này",
    "profile.suggestWeak":
      "Clip này nặng {cat} — loại âm bạn đang mất dấu nhiều nhất.",
    "profile.suggestFresh":
      "Chưa đủ dấu vết thống kê. Bắt đầu từ clip bậc thấp nhất.",
    "profile.suggestRedo":
      "Đã đi hết kho tư liệu — luyện lại clip này để siết lại dấu.",

    "onboard.title": "Lập hồ sơ thám tử",
    "onboard.sub":
      "Trợ thủ Wren sẽ đồng hành cùng bạn. Chọn diện mạo — thế giới noir cần một gương mặt.",
    "onboard.nameTitle": "Thám tử tên gì?",
    "onboard.nameHint": "Tên này sẽ xuất hiện trên hồ sơ, bảng vụ án và lời chào.",
    "onboard.namePlaceholder": "Ví dụ: Sherlock, Minh, Ace…",
    "onboard.avatarTitle": "Chọn chân dung noir",
    "onboard.avatarHint": "6 chân dung vẽ tay — chọn gương mặt cho thám tử.",
    "onboard.archTitle": "Chọn archetype",
    "onboard.archHint": "Mỗi archetype có 1 hồ sơ flavor riêng.",
    "onboard.motto": "MOTTO CỦA THÁM TỬ",
    "onboard.mottoPlaceholder": "1 câu nói để đời…",
    "onboard.back": "Quay lại",
    "onboard.next": "Tiếp tục",
    "onboard.finish": "Nhận hồ sơ",

    "exam.title": "KỲ SÁT HẠCH",
    "exam.ready": "Bạn đã đủ điều kiện thi lên {rank}.",
    "exam.locked": "Cần ≥{threshold} XP để thi lên {rank}.",
    "exam.maxed": "Đã hết hạng để thăng. Hãy phá thêm vụ khó.",
    "exam.enter": "Vào phòng thi",
    "exam.introTitle": "Sát hạch hàm {rank}",
    "exam.introSub":
      "Hiện tại bạn có {totalXp} XP. Bài thi gồm 1 đoạn audio full speed, KHÔNG phụ đề, không transcript.",
    "exam.rule1": "Nghe toàn bộ đoạn ở tốc độ thật (nghe lại tuỳ ý).",
    "exam.rule2": "Trả lời 3 câu hiểu nghĩa — không mở transcript.",
    "exam.rule3": "Đạt ≥70% để được phong hàm.",
    "exam.start": "Bắt đầu sát hạch",
    "exam.listenHint":
      "Nghe cho kỹ — sau khi bấm sang câu hỏi, bạn sẽ không được xem chữ.",
    "exam.toQuiz": "Xong — sang câu hỏi",
    "exam.submit": "Nộp bài",
    "exam.passed": "ĐẠT — phong hàm {rank}",
    "exam.passedSub": "Hồ sơ đã ghi nhận kỳ sát hạch. Chúc mừng, thám tử.",
    "exam.failed": "CHƯA ĐẠT",
    "exam.failedSub": "Nghe lại đoạn đó rồi thi lại. Không sao — mọi thám tử đều từng trượt.",
    "exam.seeRank": "Xem hồ sơ",
    "exam.retry": "Thi lại",

    "game.levelUp": "LÊN CẤP",
    "game.levelUpSub": "Cấp {from} → {to}. Hồ sơ thám tử của bạn dày thêm rồi.",
    "game.levelUpClose": "Tiếp tục điều tra",

    "companion.open": "Mở trợ thủ Wren",
    "companion.gotIt": "Rõ",
    "companion.next": "Mẹo khác",
    "companion.daily": "Nhiệm vụ ngày: {done}/{total} xong",
  },
  en: {
    tagline: "Every sound leaves a clue.",
    "nav.cases": "Case Files",
    "nav.daily": "Daily Investigation",
    "nav.profile": "Detective Profile",
    "nav.cases.short": "Cases",
    "nav.daily.short": "Daily",
    "nav.profile.short": "Profile",
    "auth.login": "Sign in with Google",
    "auth.logout": "Sign out",
    "auth.notConfigured":
      "Firebase is not configured — copy .env.example to .env.local and fill in the config to enable sign-in.",
    "auth.signedInAs": "Detective",
    "auth.anonymous": "Stranger (not signed in)",
    "sync.synced": "Synced",
    "sync.syncing": "Syncing…",
    "sync.offline": "Offline — will save & sync when online",
    "sync.error": "Sync failed — will retry",
    "sync.title": "Multi-device sync",
    "sync.sub": "Sign in to back up and sync your progress across devices.",
    "home.headline": "HEARLOCK HOLMES",
    "home.sub": "Understanding real-speed native speech is the investigation.",
    "home.caseFiles": "Open Case Files",
    "home.caseFilesSoon": "Case board is being prepared…",
    "home.caseFilesSoonSub":
      "The first case will appear here once the evidence archive is collected.",
    "home.start": "Start the investigation",
    "home.startSub":
      "Walk one line through the whole loop: blind listen → dissect → decode → relisten.",
    "lang.label": "Language",
    "theme.toLight": "Switch to day",
    "theme.toDark": "Switch to night",
    "login.title": "Enter the office",
    "login.sub": "Sign in so your detective record is kept.",

    "clip.eyebrow": "EVIDENCE FILE",
    "clip.notFound": "No such clip.",
    "clip.backHome": "Back home",

    "loop.stage.blind": "Crime scene",
    "loop.stage.dissect": "The lab",
    "loop.stage.decode": "Decode",
    "loop.stage.relisten": "File the clue",
    "loop.stage.done": "Done",

    "loop.blind.eyebrow": "BLIND LISTEN — NO TEXT",
    "loop.blind.hint":
      "Listen at real speed. No transcript yet — only the sound.",
    "loop.blind.gate": "FIELD QUESTION",
    "loop.blind.gateHint":
      "Answer to unlock the lab. Right or wrong, the lab opens — this is just flavor.",
    "loop.blind.hit": "Called it.",
    "loop.blind.miss": "Missed — but the scene is unlocked.",
    "loop.blind.enter": "Enter the lab",

    "loop.dissect.eyebrow": "DISSECT — TAP A CLUSTER TO HEAR IT",
    "loop.dissect.hint":
      "Swallowed / linked clusters are marked. Tap one to hear exactly that span ±1s.",
    "loop.dissect.playSentence": "Play the whole line",
    "loop.dissect.clusterHint": "Hear this span ±1s",
    "loop.dissect.noClusters":
      "No swallowed cluster in this line — nothing to decode.",
    "loop.dissect.toDecode": "Decode these clusters",
    "loop.dissect.toRelisten": "To relisten",

    "loop.decode.eyebrow": "DECODE — PICK THE CLEAN FORM",
    "loop.decode.hint":
      "What did you actually hear? Pick the clean form from 3–4 options.",
    "loop.decode.prompt": "What is the clean form of this cluster?",
    "loop.decode.correct": "Hit — that is the clean form.",
    "loop.decode.wrong": "Not yet. Hear that span again, then pick again.",
    "loop.decode.note": "Why it slipped",
    "loop.decode.hear": "Hear the span",
    "loop.decode.report": "THE REPORT",
    "loop.decode.reportHint":
      "3 comprehension questions — tie the clues to the case.",
    "loop.decode.next": "Next line",
    "loop.decode.toRelisten": "Relisten & file",
    "loop.decode.remaining": "{n} clusters still undecoded.",

    "loop.relisten.eyebrow": "RELISTEN — WRITE IT DOWN",
    "loop.relisten.hint":
      "Hear it again now that you know why it slipped. Then file the clue.",
    "loop.relisten.clear": "Loud and clear",
    "loop.relisten.fuzzy": "Still fuzzy",
    "loop.relisten.save": "File the clue",
    "loop.relisten.saved": "Filed {n} clues in the notebook.",
    "loop.relisten.finish": "Close the file",
    "loop.relisten.noClusters": "No clue to file on this line.",

    "loop.nav.prev": "Previous",
    "loop.nav.next": "Next",
    "loop.nav.sentence": "Line {i}/{n}",
    "loop.nav.jumpClusters": "Jump to a line with clusters",

    "loop.done.title": "File closed",
    "loop.done.sub": "Clues are in the notebook. The truth lives in the sound.",
    "loop.done.clues": "Clues filed",
    "loop.done.decoded": "Clusters decoded",
    "loop.done.again": "Reopen the case",
    "loop.done.home": "Back to case files",

    "player.play": "Play",
    "player.pause": "Pause",
    "player.replay": "Replay",
    "player.hide": "Hide controls",
    "player.show": "Show controls",
    "player.rate": "Speed",
    "player.abSetA": "Set A",
    "player.abSetB": "Set B",
    "player.abClear": "Clear",
    "player.loading": "Loading the deck…",
    "player.error": "YouTube video could not load. Check your connection.",
    "player.waveform": "Waveform",

    "cat.liaison": "Liaison",
    "cat.reduced": "Reduced speech",
    "cat.elision": "Elision",
    "cat.linking": "Linking",
    "cat.assimilation": "Assimilation",

    "rank.trainee": "Trainee detective",
    "rank.veteran": "Veteran detective",
    "rank.legend": "Legendary detective",

    "home.hello": "Good evening, Detective {name}.",
    "home.subDetective": "The desk is open. What are we listening to today?",
    "home.createDetective": "Create detective file",
    "home.daily": "Dailies {done}/{total}",
    "home.examReady": "Rank exam ready",
    "home.rankChip": "RANK · {rank}",
    "home.levelChip": "Level {level} · {xp} XP",
    "home.noDetective": "No file yet",
    "home.rankHint":
      "Ranks: Trainee → Veteran (≥{next} XP) → Legend (≥4000 XP) — each promotion needs one exam.",

    "case.locked": "This case is sealed — crack the small case first to unlock.",
    "case.smallCracked": "Case cracked. The three testimonies line up.",
    "case.bossCracked": "Boss down. The stream finally named the mole.",
    "case.smallNeed":
      "Crack conditions: comprehension ≥70% per clip + decode ≥1 cluster/clip.",
    "case.bossNeed":
      "Crack conditions: comprehension ≥70% + decode ≥60% of clusters. Full speed, no subtitles.",
    "case.drill": "PRACTICE",

    "daily.sub": "{name}, here is today's case journal — no streaks, no penalties.",
    "daily.subAnon": "Today's case journal — no streaks, no penalties.",
    "daily.progress": "{done}/{target} done",
    "daily.done": "✓ Done — XP filed to your record.",
    "daily.allDone": "FULL DAY — 3/3 MISSIONS",
    "daily.allDoneSub": "Today's work is done. Back to the hunt tomorrow, Detective.",
    "daily.goListen": "Start listening",
    "daily.noStreak": "No streaks, no penalties — just a case journal.",

    "profile.noDetective": "Empty file.",
    "profile.noDetectiveSub":
      "Create your detective file to track rank, XP, and achievements.",
    "profile.rank": "Rank",
    "profile.level": "Level",
    "profile.clues": "Clues",
    "profile.events": "Events",
    "profile.intoLevel": "{into}/{need} XP this level",
    "profile.nextRank": "Next rank: {rank} — needs ≥{threshold} XP + an exam.",
    "profile.maxRank": "Top rank reached. Harder cases remain.",
    "profile.achievements": "ACHIEVEMENTS",

    "profile.skills": "SOUND PROFILE",
    "profile.skillsHint":
      "Trail-loss rate across 5 sound types — from wrong clean forms, “still fuzzy” self-reports, span re-hears and replays.",
    "profile.loss": "lost",
    "profile.noSignal": "no signal yet",
    "profile.signalCount": "{n} signals",
    "profile.suggest": "NEXT CASE LEAD",
    "profile.suggestGo": "Investigate this clip",
    "profile.suggestWeak":
      "This clip is heavy on {cat} — the sound you lose most often.",
    "profile.suggestFresh":
      "Not enough traces yet. Start from the lowest-level clip.",
    "profile.suggestRedo":
      "Archive exhausted — re-run this clip to tighten your trail.",

    "onboard.title": "Create your detective",
    "onboard.sub":
      "Wren the sidekick will tag along. Pick a look — noir needs a face.",
    "onboard.nameTitle": "What's the detective's name?",
    "onboard.nameHint": "It shows on your file, the case board, and greetings.",
    "onboard.namePlaceholder": "e.g. Sherlock, Minh, Ace…",
    "onboard.avatarTitle": "Pick a noir portrait",
    "onboard.avatarHint": "Six hand-drawn portraits — choose a face.",
    "onboard.archTitle": "Pick an archetype",
    "onboard.archHint": "Each archetype has its own flavor profile.",
    "onboard.motto": "DETECTIVE'S MOTTO",
    "onboard.mottoPlaceholder": "One line to live by…",
    "onboard.back": "Back",
    "onboard.next": "Continue",
    "onboard.finish": "Take the file",

    "exam.title": "RANK EXAM",
    "exam.ready": "You are eligible to sit the {rank} exam.",
    "exam.locked": "You need ≥{threshold} XP to sit the {rank} exam.",
    "exam.maxed": "No further ranks. Go crack harder cases.",
    "exam.enter": "Enter the exam room",
    "exam.introTitle": "{rank} promotion exam",
    "exam.introSub":
      "You have {totalXp} XP. The exam is one full-speed passage — NO subtitles, no transcript.",
    "exam.rule1": "Listen to the whole passage at real speed (replays allowed).",
    "exam.rule2": "Answer 3 comprehension questions — no transcript.",
    "exam.rule3": "Score ≥70% to be promoted.",
    "exam.start": "Start the exam",
    "exam.listenHint":
      "Listen closely — once you move to the questions, no text is shown.",
    "exam.toQuiz": "Done — to the questions",
    "exam.submit": "Submit",
    "exam.passed": "PASSED — promoted to {rank}",
    "exam.passedSub": "The exam is on your record. Congratulations, Detective.",
    "exam.failed": "NOT YET",
    "exam.failedSub": "Hear it again and retake. Every detective has failed once.",
    "exam.seeRank": "See my file",
    "exam.retry": "Retake",

    "game.levelUp": "LEVEL UP",
    "game.levelUpSub": "Level {from} → {to}. Your detective file just got thicker.",
    "game.levelUpClose": "Back to the case",

    "companion.open": "Open Wren the sidekick",
    "companion.gotIt": "Got it",
    "companion.next": "Another tip",
    "companion.daily": "Dailies: {done}/{total} done",
  },
} as const;

export type MsgKey = keyof (typeof dict)["vi"];

type I18nValue = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  toggleLang: () => void;
  t: (key: MsgKey, params?: Record<string, string | number>) => string;
};

const I18nContext = createContext<I18nValue | null>(null);

const STORAGE_KEY = "hearlock.lang";

function readInitialLang(): Lang {
  const saved = localStorage.getItem(STORAGE_KEY);
  return saved === "en" || saved === "vi" ? saved : "vi";
}

export function I18nProvider({ children }: { children: ReactNode }) {
  const [lang, setLang] = useState<Lang>(readInitialLang);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, lang);
    document.documentElement.lang = lang;
  }, [lang]);

  const toggleLang = useCallback(() => {
    setLang((prev) => (prev === "vi" ? "en" : "vi"));
  }, []);

  const t = useCallback(
    (key: MsgKey, params?: Record<string, string | number>) => {
      const template = dict[lang][key] ?? dict.vi[key] ?? key;
      if (!params) return template;
      return template.replace(/\{(\w+)\}/g, (match, name: string) =>
        name in params ? String(params[name]) : match,
      );
    },
    [lang],
  );

  const value = useMemo(
    () => ({ lang, setLang, toggleLang, t }),
    [lang, toggleLang, t],
  );

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}
