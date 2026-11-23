/**
 * Seed content GĐ4 (T1.5) — 5 clip L1–L5 đã annotate + 1 vụ nhỏ + 1 boss.
 * Sinh từ tools/out/<clipId>/<clipId>.clip.json (pipeline GĐ2 + annotate GĐ4).
 * Không commit audio — chỉ dữ liệu transcript/annotate này.
 */
import type { SeedData } from "../../types/content";

export const gd4Seed = (
{
  "cases": [
    {
      "id": "case-gta-leak",
      "title": "The Leaked Build",
      "titleVi": "Bản build GTA 6 bị lộ",
      "level": 3,
      "type": "small",
      "clipIds": [
        "clip-ltt-01",
        "clip-b99-02",
        "clip-skillup-01"
      ],
      "synopsis": "A GTA 6 build leaked before launch. Three clues: a tech teardown of the build running on strange hardware (LTT), an internal meeting recording where the middleman's death is announced (B99), and a spoiler-free review that lets insider details slip (Skill Up). Chain the three testimonies to find who passed the build along.",
      "synopsisVi": "Một bản build GTA 6 bị rò rỉ trước ngày ra mắt. Ba manh mối: lời phân tích kỹ thuật về bản build chạy trên phần cứng lạ (LTT), bản ghi âm cuộc họp nội bộ nơi cái chết của người trung gian được loan báo (B99), và bài review 'không spoil' làm lộ thông tin nội bộ (Skill Up). Ghép ba lời khai để tìm kẻ đã tuồn bản build."
    },
    {
      "id": "case-boss-stream",
      "title": "Who Is the Mole?",
      "titleVi": "Ai là nội gián?",
      "level": 5,
      "type": "boss",
      "clipIds": [
        "clip-gtalive-01"
      ],
      "synopsis": "A live GTA 6 marathon stream, full speed, no subtitles — streamer chatter over game audio, people talking on top of each other. Find out who the streamer suspects is the mole before the window closes.",
      "synopsisVi": "Một stream marathon GTA 6 trực tiếp — full speed, không phụ đề: lời streamer chồng lên tiếng game, người nói đè lên nhau. Tìm xem streamer nghi ai là 'nội gián' trước khi cửa sổ đóng lại."
    }
  ],
  "clips": [
    {
      "id": "clip-ltt-01",
      "caseId": "case-gta-leak",
      "videoId": "f0KK_4AaqLQ",
      "youtubeUrl": "https://www.youtube.com/watch?v=f0KK_4AaqLQ",
      "startOffsetMs": 0,
      "title": "LTT — GTA 6 at 60 FPS with DLSS5",
      "durationSec": 44.99,
      "level": 1,
      "category": "tech",
      "gistQuestion": {
        "prompt": {
          "vi": "Bản dựng GTA 6 trong clip đang gặp vấn đề gì, và người nói xử lý ra sao?",
          "en": "What is wrong with this GTA 6 build, and how does the speaker fix it?"
        },
        "choices": [
          {
            "vi": "Chạy 30 FPS — anh ấy dùng DLSS 5 + frame-gen để nhân đôi frame rate",
            "en": "It runs at 30 FPS — he uses DLSS 5 + frame-gen to double the frame rate"
          },
          {
            "vi": "Bị crash giữa chừng — anh ấy cài lại driver",
            "en": "It crashes midway — he reinstalls the driver"
          },
          {
            "vi": "Đồ hoạ xấu — anh ấy nâng cấp lên PS5 Pro",
            "en": "The graphics look bad — he upgrades to a PS5 Pro"
          },
          {
            "vi": "Giá quá đắt — anh ấy chờ đợt giảm giá",
            "en": "It is too expensive — he waits for a discount"
          }
        ],
        "answerIndex": 0
      },
      "comprehension": [
        {
          "prompt": {
            "vi": "Vấn đề 'nhỏ' được nhắc đến ở đầu clip là gì?",
            "en": "What is the 'small issue' mentioned at the start of the clip?"
          },
          "choices": [
            {
              "vi": "30 FPS trong năm 2026",
              "en": "30 FPS in 2026"
            },
            {
              "vi": "Game không có chế độ multiplayer",
              "en": "The game has no multiplayer mode"
            },
            {
              "vi": "Bản build bị rò rỉ lên mạng",
              "en": "The build was leaked online"
            },
            {
              "vi": "PlayStation 5 không đủ mạnh",
              "en": "The PlayStation 5 is not powerful enough"
            }
          ],
          "answerIndex": 0
        },
        {
          "prompt": {
            "vi": "Hệ thống nào được dùng để 'sửa' vấn đề đó?",
            "en": "What system is used to 'fix' the problem?"
          },
          "choices": [
            {
              "vi": "PlayStation 5 nguyên bản",
              "en": "A stock PlayStation 5"
            },
            {
              "vi": "Nvidia DLSS 5 và frame-gen trên RTX 5090",
              "en": "Nvidia DLSS 5 and frame-gen on an RTX 5090"
            },
            {
              "vi": "Bản vá chính thức của Rockstar",
              "en": "An official Rockstar patch"
            },
            {
              "vi": "Xbox Series X",
              "en": "An Xbox Series X"
            }
          ],
          "answerIndex": 1
        },
        {
          "prompt": {
            "vi": "Manh mối kỹ thuật: hai hình ảnh được đặt cạnh nhau để so sánh là gì?",
            "en": "Technical clue: what two images are compared side by side?"
          },
          "choices": [
            {
              "vi": "Hình trước và sau khi bật HDR",
              "en": "Before and after turning on HDR"
            },
            {
              "vi": "Hình từ Xbox và hình từ PlayStation",
              "en": "An Xbox image and a PlayStation image"
            },
            {
              "vi": "Hình gốc từ PS5 và hình đã qua RTX 5090",
              "en": "The raw PS5 image and the RTX 5090-processed image"
            },
            {
              "vi": "Hình gameplay và hình cutscene",
              "en": "A gameplay image and a cutscene image"
            }
          ],
          "answerIndex": 2
        }
      ],
      "sentences": [
        {
          "id": "sent-01",
          "text": "GTA 6 may be the hottest game on the planet right now, getting showered with 10 out of 10s from basically everyone who reviewed it.",
          "startMs": 0,
          "endMs": 6720,
          "words": [
            {
              "w": "GTA",
              "s": 0,
              "e": 540
            },
            {
              "w": "6",
              "s": 540,
              "e": 780
            },
            {
              "w": "may",
              "s": 780,
              "e": 1080
            },
            {
              "w": "be",
              "s": 1080,
              "e": 1340
            },
            {
              "w": "the",
              "s": 1340,
              "e": 1700
            },
            {
              "w": "hottest",
              "s": 1700,
              "e": 2020
            },
            {
              "w": "game",
              "s": 2020,
              "e": 2240
            },
            {
              "w": "on",
              "s": 2240,
              "e": 2400
            },
            {
              "w": "the",
              "s": 2400,
              "e": 2540
            },
            {
              "w": "planet",
              "s": 2540,
              "e": 2740
            },
            {
              "w": "right",
              "s": 2740,
              "e": 3000
            },
            {
              "w": "now,",
              "s": 3000,
              "e": 3160
            },
            {
              "w": "getting",
              "s": 3160,
              "e": 3560
            },
            {
              "w": "showered",
              "s": 3560,
              "e": 4040
            },
            {
              "w": "with",
              "s": 4040,
              "e": 4260
            },
            {
              "w": "10",
              "s": 4260,
              "e": 4440
            },
            {
              "w": "out",
              "s": 4440,
              "e": 4580
            },
            {
              "w": "of",
              "s": 4580,
              "e": 4680
            },
            {
              "w": "10s",
              "s": 4680,
              "e": 4900
            },
            {
              "w": "from",
              "s": 4900,
              "e": 5100
            },
            {
              "w": "basically",
              "s": 5100,
              "e": 5620
            },
            {
              "w": "everyone",
              "s": 5620,
              "e": 6220
            },
            {
              "w": "who",
              "s": 6220,
              "e": 6480
            },
            {
              "w": "reviewed",
              "s": 6480,
              "e": 6720
            }
          ],
          "clusters": [
            {
              "id": "clu-01",
              "category": "reduced",
              "span": [
                3160,
                4040
              ],
              "cleanForms": [
                "getting showered",
                "get showered",
                "got showered",
                "getting showed"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'getting' → /ˈɡɛɾɪŋ/ — âm /t/ giữa hai nguyên âm thành flap /ɾ/, nghe như 'gerring' một nhịp.",
                "en": "'getting' → /ˈɡɛɾɪŋ/ — the /t/ between vowels becomes a flap /ɾ/, heard as one quick 'gerring'."
              }
            },
            {
              "id": "clu-02",
              "category": "reduced",
              "span": [
                4440,
                4680
              ],
              "cleanForms": [
                "out of",
                "out from",
                "out off",
                "off of"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'out of' → /aʊɾə/ — 'outta': /t/ thành flap rồi gộp hai từ thành một.",
                "en": "'out of' → /aʊɾə/ — 'outta': the /t/ flaps and the two words fuse into one."
              }
            }
          ]
        },
        {
          "id": "sent-02",
          "text": "But there is one small issue.",
          "startMs": 7360,
          "endMs": 10200,
          "words": [
            {
              "w": "But",
              "s": 7360,
              "e": 7560
            },
            {
              "w": "there",
              "s": 7560,
              "e": 7800
            },
            {
              "w": "is",
              "s": 7800,
              "e": 8300
            },
            {
              "w": "one",
              "s": 8300,
              "e": 8760
            },
            {
              "w": "small",
              "s": 8760,
              "e": 9540
            },
            {
              "w": "issue.",
              "s": 9540,
              "e": 10200
            }
          ],
          "clusters": [
            {
              "id": "clu-03",
              "category": "assimilation",
              "span": [
                7360,
                7800
              ],
              "cleanForms": [
                "But there",
                "But they",
                "But here",
                "The there"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'But there' → /bʌˈðɛr/ — /t/ trước /ð/ bị đồng hoá, nghe như 'budh-ere' dính một cụm.",
                "en": "'But there' → /bʌˈðɛr/ — the /t/ assimilates before /ð/, heard as one fused 'budh-ere'."
              }
            }
          ]
        },
        {
          "id": "sent-03",
          "text": "30 FPS? Really? In 2026?",
          "startMs": 10300,
          "endMs": 13360,
          "words": [
            {
              "w": "30",
              "s": 10300,
              "e": 10620
            },
            {
              "w": "FPS?",
              "s": 10620,
              "e": 11120
            },
            {
              "w": "Really?",
              "s": 11640,
              "e": 12000
            },
            {
              "w": "In",
              "s": 12440,
              "e": 12560
            },
            {
              "w": "2026?",
              "s": 12560,
              "e": 13360
            }
          ],
          "clusters": [
            {
              "id": "clu-04",
              "category": "linking",
              "span": [
                12440,
                13360
              ],
              "cleanForms": [
                "In 2026",
                "In 2025",
                "And 2026",
                "On 2026"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'In‿twenty-six' — /n/ nối thẳng vào nguyên âm /t/ của 'twenty', hai từ dính như một.",
                "en": "'In‿twenty-six' — /n/ links straight into the vowel of 'twenty', the two words fuse."
              }
            }
          ]
        },
        {
          "id": "sent-04",
          "text": "But don't worry, I can fix that.",
          "startMs": 14240,
          "endMs": 16540,
          "words": [
            {
              "w": "But",
              "s": 14240,
              "e": 14560
            },
            {
              "w": "don't",
              "s": 14560,
              "e": 14720
            },
            {
              "w": "worry,",
              "s": 14720,
              "e": 15020
            },
            {
              "w": "I",
              "s": 15440,
              "e": 15660
            },
            {
              "w": "can",
              "s": 15660,
              "e": 15860
            },
            {
              "w": "fix",
              "s": 15860,
              "e": 16060
            },
            {
              "w": "that.",
              "s": 16060,
              "e": 16540
            }
          ],
          "clusters": [
            {
              "id": "clu-05",
              "category": "elision",
              "span": [
                14560,
                15020
              ],
              "cleanForms": [
                "don't worry",
                "doesn't worry",
                "does worry",
                "don't wary"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'don't worry' → /doʊnˈwʌri/ — âm /t/ biến mất hẳn, chỉ còn /n/ + /w/.",
                "en": "'don't worry' → /doʊnˈwʌri/ — the /t/ elides completely, leaving only /n/ + /w/."
              }
            },
            {
              "id": "clu-06",
              "category": "reduced",
              "span": [
                15660,
                16540
              ],
              "cleanForms": [
                "can fix that",
                "can't fix that",
                "can fixed that",
                "could fix that"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'can' không nhấn → /kən/, 'fix that' → /fɪkˈsdhæt/ — cả cụm trôi thành một dải âm.",
                "en": "Unstressed 'can' → /kən/, and 'fix that' → /fɪkˈsdhæt/ — the whole phrase slides together."
              }
            }
          ]
        },
        {
          "id": "sent-05",
          "text": "With a little help from Nvidia's DLSS 5 and FrameGen, which—",
          "startMs": 17640,
          "endMs": 22680,
          "words": [
            {
              "w": "With",
              "s": 17640,
              "e": 17940
            },
            {
              "w": "a",
              "s": 17940,
              "e": 18160
            },
            {
              "w": "little",
              "s": 18160,
              "e": 18360
            },
            {
              "w": "help",
              "s": 18360,
              "e": 18840
            },
            {
              "w": "from",
              "s": 18840,
              "e": 19440
            },
            {
              "w": "Nvidia's",
              "s": 19440,
              "e": 20480
            },
            {
              "w": "DLSS",
              "s": 20480,
              "e": 21180
            },
            {
              "w": "5",
              "s": 21180,
              "e": 21560
            },
            {
              "w": "and",
              "s": 21560,
              "e": 22140
            },
            {
              "w": "FrameGen,",
              "s": 22140,
              "e": 22680
            }
          ],
          "clusters": [
            {
              "id": "clu-07",
              "category": "liaison",
              "span": [
                17640,
                19440
              ],
              "cleanForms": [
                "With a little help from",
                "With a little help of",
                "With little help from",
                "With a lot of help from"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'With‿a‿little‿help‿from' → /wɪðəˈlɪdl̩pfrɑm/ — năm từ nối thành một chuỗi, 'help from' dính /p/+/f/.",
                "en": "'With‿a‿little‿help‿from' → /wɪðəˈlɪdl̩pfrɑm/ — five words chain together; 'help from' fuses /p/+/f/."
              }
            }
          ]
        },
        {
          "id": "sent-06",
          "text": "Whaaat? Running on a PlayStation 5?",
          "startMs": 23980,
          "endMs": 26340,
          "words": [
            {
              "w": "Whaaat?",
              "s": 23980,
              "e": 24620
            },
            {
              "w": "Running",
              "s": 24860,
              "e": 25240
            },
            {
              "w": "on",
              "s": 25240,
              "e": 25520
            },
            {
              "w": "a",
              "s": 25520,
              "e": 25760
            },
            {
              "w": "PlayStation",
              "s": 25760,
              "e": 26340
            }
          ],
          "clusters": [
            {
              "id": "clu-08",
              "category": "linking",
              "span": [
                24860,
                25520
              ],
              "cleanForms": [
                "Running on",
                "Running an",
                "Running in",
                "Run on"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'Running‿on' → /ˈrʌnɪnɑn/ — đuôi /ŋ/ + âm cuối /n/ nối vào nguyên âm, mất ranh giới từ.",
                "en": "'Running‿on' → /ˈrʌnɪnɑn/ — the /ŋ/ + final /n/ link into the vowel; the word boundary disappears."
              }
            }
          ]
        },
        {
          "id": "sent-07",
          "text": "Yes! On this side, we've got the unaltered image coming straight out of the PlayStation 5,",
          "startMs": 27140,
          "endMs": 33020,
          "words": [
            {
              "w": "Yes!",
              "s": 27140,
              "e": 28320
            },
            {
              "w": "On",
              "s": 28960,
              "e": 29120
            },
            {
              "w": "this",
              "s": 29120,
              "e": 29340
            },
            {
              "w": "side",
              "s": 29340,
              "e": 29600
            },
            {
              "w": "we've",
              "s": 29600,
              "e": 29960
            },
            {
              "w": "got",
              "s": 29960,
              "e": 30060
            },
            {
              "w": "the",
              "s": 30060,
              "e": 30400
            },
            {
              "w": "unaltered",
              "s": 30400,
              "e": 30800
            },
            {
              "w": "image",
              "s": 30800,
              "e": 31060
            },
            {
              "w": "coming",
              "s": 31060,
              "e": 31360
            },
            {
              "w": "straight",
              "s": 31360,
              "e": 31800
            },
            {
              "w": "out",
              "s": 31800,
              "e": 31960
            },
            {
              "w": "of",
              "s": 31960,
              "e": 32080
            },
            {
              "w": "the",
              "s": 32080,
              "e": 32180
            },
            {
              "w": "PlayStation",
              "s": 32180,
              "e": 32540
            },
            {
              "w": "5",
              "s": 32540,
              "e": 33020
            }
          ],
          "clusters": [
            {
              "id": "clu-09",
              "category": "linking",
              "span": [
                29600,
                30060
              ],
              "cleanForms": [
                "we've got",
                "we got",
                "we've get",
                "we've gotten"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'we've‿got' → /wiːvˈɡɑt/ — 'have' chỉ còn âm /v/ dính vào 'got'.",
                "en": "'we've‿got' → /wiːvˈɡɑt/ — 'have' reduces to just a /v/ glued onto 'got'."
              }
            },
            {
              "id": "clu-10",
              "category": "reduced",
              "span": [
                31360,
                32080
              ],
              "cleanForms": [
                "straight out of",
                "straight off of",
                "straight out from",
                "right out of"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'out of' → 'outta' /aʊɾə/ — ba từ 'straight out of' trôi thành 'straightoutta'.",
                "en": "'out of' → 'outta' /aʊɾə/ — 'straight out of' slides into 'straightoutta'."
              }
            }
          ]
        },
        {
          "id": "sent-08",
          "text": "and on this side, we've piped it through an Nvidia RTX 5090 that's using neural rendering to add additional detail and double our frame rate.",
          "startMs": 33020,
          "endMs": 44120,
          "words": [
            {
              "w": "and",
              "s": 33020,
              "e": 33480
            },
            {
              "w": "on",
              "s": 33480,
              "e": 33740
            },
            {
              "w": "this",
              "s": 33740,
              "e": 34020
            },
            {
              "w": "side",
              "s": 34020,
              "e": 34380
            },
            {
              "w": "we've",
              "s": 34380,
              "e": 35140
            },
            {
              "w": "piped",
              "s": 35140,
              "e": 35440
            },
            {
              "w": "it",
              "s": 35440,
              "e": 35720
            },
            {
              "w": "through",
              "s": 35720,
              "e": 36000
            },
            {
              "w": "an",
              "s": 36000,
              "e": 36200
            },
            {
              "w": "Nvidia",
              "s": 36200,
              "e": 36500
            },
            {
              "w": "RTX",
              "s": 36500,
              "e": 37020
            },
            {
              "w": "5090",
              "s": 37020,
              "e": 38080
            },
            {
              "w": "that's",
              "s": 38080,
              "e": 38600
            },
            {
              "w": "using",
              "s": 38600,
              "e": 38780
            },
            {
              "w": "neural",
              "s": 38780,
              "e": 39180
            },
            {
              "w": "rendering",
              "s": 39180,
              "e": 39580
            },
            {
              "w": "to",
              "s": 39580,
              "e": 39920
            },
            {
              "w": "add",
              "s": 39920,
              "e": 40200
            },
            {
              "w": "additional",
              "s": 40200,
              "e": 40740
            },
            {
              "w": "detail",
              "s": 40740,
              "e": 41260
            },
            {
              "w": "and",
              "s": 41260,
              "e": 42540
            },
            {
              "w": "double",
              "s": 42540,
              "e": 43180
            },
            {
              "w": "our",
              "s": 43180,
              "e": 43600
            },
            {
              "w": "frame",
              "s": 43600,
              "e": 43860
            },
            {
              "w": "rate.",
              "s": 43860,
              "e": 44120
            }
          ],
          "clusters": [
            {
              "id": "clu-11",
              "category": "liaison",
              "span": [
                35140,
                36000
              ],
              "cleanForms": [
                "piped it through",
                "pipe it through",
                "piped through it",
                "piped it true"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'piped‿it‿through' → /paɪptɪtˈθruː/ — /d/ + /t/ của hai từ dính lại thành một âm tắc đôi.",
                "en": "'piped‿it‿through' → /paɪptɪtˈθruː/ — the /d/ + /t/ fuse into one doubled stop."
              }
            },
            {
              "id": "clu-12",
              "category": "liaison",
              "span": [
                39920,
                40740
              ],
              "cleanForms": [
                "add additional",
                "ad additional",
                "add addition",
                "adds additional"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'add‿additional' → /ædəˈdɪʃənl̩/ — /d/ đầu từ sau nối thẳng vào âm cuối, nghe như 'adadditional'.",
                "en": "'add‿additional' → /ædəˈdɪʃənl̩/ — the initial /d/ fuses with the preceding word, heard as 'adadditional'."
              }
            },
            {
              "id": "clu-13",
              "category": "linking",
              "span": [
                42540,
                43600
              ],
              "cleanForms": [
                "double our",
                "double hour",
                "doubles our",
                "double are"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'double‿our' → /dʌbəlɑɚ/ — /l/ nối vào nguyên âm của 'our', nghe như 'dub-lour'.",
                "en": "'double‿our' → /dʌbəlɑɚ/ — /l/ links into the vowel of 'our', heard as 'dub-lour'."
              }
            }
          ]
        },
        {
          "id": "sent-09",
          "text": "And the best part?",
          "startMs": 44120,
          "endMs": 44960,
          "words": [
            {
              "w": "And",
              "s": 44120,
              "e": 44580
            },
            {
              "w": "the",
              "s": 44580,
              "e": 44740
            },
            {
              "w": "best",
              "s": 44740,
              "e": 44880
            },
            {
              "w": "part?",
              "s": 44880,
              "e": 44960
            }
          ],
          "clusters": [
            {
              "id": "clu-14",
              "category": "reduced",
              "span": [
                44120,
                44740
              ],
              "cleanForms": [
                "And the",
                "And a",
                "An the",
                "And they"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'And the' → /ændə/ — 'the' không nhấn, chỉ còn âm /ə/ dính vào 'and'.",
                "en": "'And the' → /ændə/ — unstressed 'the' reduces to /ə/ glued onto 'and'."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "clip-b99-02",
      "caseId": "case-gta-leak",
      "videoId": "AS38I3esj0o",
      "youtubeUrl": "https://www.youtube.com/watch?v=AS38I3esj0o&t=38s",
      "startOffsetMs": 38000,
      "title": "B99 — Holt hears Wuntch is dead",
      "durationSec": 78.0,
      "level": 2,
      "category": "series",
      "gistQuestion": {
        "prompt": {
          "vi": "Cuộc họp này công bố tin gì?",
          "en": "What news is announced at this meeting?"
        },
        "choices": [
          {
            "vi": "Madeline Wuntch — người quen của họ — đã chết",
            "en": "Madeline Wuntch, someone they know, has died"
          },
          {
            "vi": "Sếp của họ vừa bị giáng chức",
            "en": "Their boss has just been demoted"
          },
          {
            "vi": "Họ tìm thấy chiếc cặp bị mất tích",
            "en": "They found the missing briefcase"
          },
          {
            "vi": "Cuộc họp bị huỷ vì lý do an ninh",
            "en": "The meeting is cancelled for security reasons"
          }
        ],
        "answerIndex": 0
      },
      "comprehension": [
        {
          "prompt": {
            "vi": "Phản ứng đầu tiên của người nói nam khi nghe tin là gì?",
            "en": "What is the man's first reaction to the news?"
          },
          "choices": [
            {
              "vi": "Tin ngay và rất buồn",
              "en": "He believes it at once and is very sad"
            },
            {
              "vi": "Không tin và cho rằng đó là trò lừa",
              "en": "He does not believe it and thinks it is a trick"
            },
            {
              "vi": "Rời phòng ngay lập tức",
              "en": "He leaves the room immediately"
            },
            {
              "vi": "Gọi điện cho cấp trên",
              "en": "He calls his superior"
            }
          ],
          "answerIndex": 1
        },
        {
          "prompt": {
            "vi": "Câu 'I'm not buying it' trong clip nghĩa là gì?",
            "en": "What does 'I'm not buying it' mean in this clip?"
          },
          "choices": [
            {
              "vi": "Anh ấy sẽ không mua lăn khử mùi",
              "en": "He will not buy the deodorant"
            },
            {
              "vi": "Anh ấy không tin lời thông báo",
              "en": "He does not believe the announcement"
            },
            {
              "vi": "Anh ấy không trả tiền vé",
              "en": "He will not pay for the tickets"
            },
            {
              "vi": "Anh ấy không mua bánh mì vòng",
              "en": "He will not buy the bagels"
            }
          ],
          "answerIndex": 1
        },
        {
          "prompt": {
            "vi": "Khi đã tin rằng tin đó là thật, người nói nam làm gì?",
            "en": "Once he believes the news, what does the man do?"
          },
          "choices": [
            {
              "vi": "Khóc và ôm đồng nghiệp",
              "en": "He cries and hugs his colleagues"
            },
            {
              "vi": "Im lặng rời phòng họp",
              "en": "He leaves the meeting room in silence"
            },
            {
              "vi": "Ăn mừng và hứa bánh mì vòng cho tất cả",
              "en": "He celebrates and promises bagels for everyone"
            },
            {
              "vi": "Gọi điện báo cảnh sát",
              "en": "He calls the police"
            }
          ],
          "answerIndex": 2
        }
      ],
      "sentences": [
        {
          "id": "sent-01",
          "text": "Okay, everyone. I have some news.",
          "startMs": 800,
          "endMs": 3080,
          "words": [
            {
              "w": "Okay,",
              "s": 800,
              "e": 1240
            },
            {
              "w": "everyone,",
              "s": 1440,
              "e": 1740
            },
            {
              "w": "I",
              "s": 2320,
              "e": 2520
            },
            {
              "w": "have",
              "s": 2520,
              "e": 2620
            },
            {
              "w": "some",
              "s": 2620,
              "e": 2860
            },
            {
              "w": "news.",
              "s": 2860,
              "e": 3080
            }
          ],
          "clusters": [
            {
              "id": "clu-01",
              "category": "reduced",
              "span": [
                2520,
                3080
              ],
              "cleanForms": [
                "have some news",
                "has some news",
                "had some news",
                "have the news"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'have' không nhấn → /həv/ gần như 'uhv', cả cụm 'have some news' trôi thành một dải.",
                "en": "Unstressed 'have' → /həv/, almost 'uhv'; the whole phrase 'have some news' slides together."
              }
            }
          ]
        },
        {
          "id": "sent-02",
          "text": "Madeline Wuntch is a Korean toilet ghost? Boring. We already knew that.",
          "startMs": 3220,
          "endMs": 7600,
          "words": [
            {
              "w": "The",
              "s": 3220,
              "e": 3360
            },
            {
              "w": "Madeline",
              "s": 3360,
              "e": 3680
            },
            {
              "w": "Wuntch",
              "s": 3680,
              "e": 3780
            },
            {
              "w": "is",
              "s": 3780,
              "e": 4080
            },
            {
              "w": "a",
              "s": 4080,
              "e": 4220
            },
            {
              "w": "Korean",
              "s": 4220,
              "e": 4660
            },
            {
              "w": "toilet",
              "s": 4660,
              "e": 5040
            },
            {
              "w": "ghost?",
              "s": 5040,
              "e": 5400
            },
            {
              "w": "Boring.",
              "s": 5900,
              "e": 6340
            },
            {
              "w": "We",
              "s": 6680,
              "e": 6880
            },
            {
              "w": "already",
              "s": 6880,
              "e": 7160
            },
            {
              "w": "knew",
              "s": 7160,
              "e": 7280
            },
            {
              "w": "that.",
              "s": 7280,
              "e": 7600
            }
          ],
          "clusters": [
            {
              "id": "clu-02",
              "category": "liaison",
              "span": [
                3780,
                4660
              ],
              "cleanForms": [
                "is a Korean",
                "is Korean",
                "is the Korean",
                "isn't a Korean"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'is‿a‿Korean' → /ɪzəkəˈriən/ — 'is' + 'a' gộp thành /ɪzə/, nối thẳng vào 'Korean'.",
                "en": "'is‿a‿Korean' → /ɪzəkəˈriən/ — 'is' + 'a' fuse into /ɪzə/ and link straight into 'Korean'."
              }
            },
            {
              "id": "clu-03",
              "category": "reduced",
              "span": [
                6680,
                7600
              ],
              "cleanForms": [
                "We already knew that",
                "We already know that",
                "We all ready knew that",
                "We had already knew that"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'We‿already' → /wiɔlˈrɛdi/ — hai từ dính nhau, 'already' bị nén lại khi nói nhanh.",
                "en": "'We‿already' → /wiɔlˈrɛdi/ — the two words fuse and 'already' compresses in fast speech."
              }
            }
          ]
        },
        {
          "id": "sent-03",
          "text": "Madeline Wuntch is dead.",
          "startMs": 7840,
          "endMs": 9500,
          "words": [
            {
              "w": "Madeline",
              "s": 7840,
              "e": 8280
            },
            {
              "w": "Wuntch",
              "s": 8280,
              "e": 8700
            },
            {
              "w": "is",
              "s": 8700,
              "e": 9180
            },
            {
              "w": "dead.",
              "s": 9180,
              "e": 9500
            }
          ],
          "clusters": [
            {
              "id": "clu-04",
              "category": "linking",
              "span": [
                8280,
                9500
              ],
              "cleanForms": [
                "Wuntch is dead",
                "Wuntch was dead",
                "Wuntch's dead",
                "Wuntch isn't dead"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'Wuntch‿is‿dead' → /ˈwʌntʃɪzˈdɛd/ — 'is' dính vào hai đầu, không còn ranh giới từ.",
                "en": "'Wuntch‿is‿dead' → /ˈwʌntʃɪzˈdɛd/ — 'is' glues to both neighbours; the word boundary is gone."
              }
            }
          ]
        },
        {
          "id": "sent-04",
          "text": "Say what now? Wait, Wuntch is dead?",
          "startMs": 10080,
          "endMs": 12340,
          "words": [
            {
              "w": "Say",
              "s": 10080,
              "e": 10260
            },
            {
              "w": "what",
              "s": 10260,
              "e": 10420
            },
            {
              "w": "now?",
              "s": 10420,
              "e": 10620
            },
            {
              "w": "Wait,",
              "s": 10960,
              "e": 11260
            },
            {
              "w": "Wuntch",
              "s": 11520,
              "e": 11780
            },
            {
              "w": "is",
              "s": 11780,
              "e": 12060
            },
            {
              "w": "dead?",
              "s": 12060,
              "e": 12340
            }
          ],
          "clusters": [
            {
              "id": "clu-05",
              "category": "elision",
              "span": [
                10260,
                10620
              ],
              "cleanForms": [
                "what now",
                "what's now",
                "what no",
                "now what"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'what‿now' → /ˈwʌˈnaʊ/ — âm /t/ cuối 'what' biến mất trước 'now', nghe như 'wha-now'.",
                "en": "'what‿now' → /ˈwʌˈnaʊ/ — the /t/ in 'what' drops before 'now', heard as 'wha-now'."
              }
            }
          ]
        },
        {
          "id": "sent-05",
          "text": "Yeah, the commissioner's office just notified us.",
          "startMs": 12520,
          "endMs": 15100,
          "words": [
            {
              "w": "Yeah,",
              "s": 12520,
              "e": 12900
            },
            {
              "w": "the",
              "s": 13120,
              "e": 13360
            },
            {
              "w": "commissioner's",
              "s": 13360,
              "e": 13860
            },
            {
              "w": "office",
              "s": 13860,
              "e": 14120
            },
            {
              "w": "just",
              "s": 14120,
              "e": 14460
            },
            {
              "w": "notified",
              "s": 14460,
              "e": 14840
            },
            {
              "w": "us.",
              "s": 14840,
              "e": 15100
            }
          ],
          "clusters": [
            {
              "id": "clu-06",
              "category": "elision",
              "span": [
                14120,
                14840
              ],
              "cleanForms": [
                "just notified",
                "just notified us",
                "only notified",
                "just now notified"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'just' → /dʒʌs/ — âm /t/ bị bỏ trước 'notified', chỉ còn /s/ + /n/ dính nhau.",
                "en": "'just' → /dʒʌs/ — the /t/ is dropped before 'notified', leaving /s/ + /n/ stuck together."
              }
            }
          ]
        },
        {
          "id": "sent-06",
          "text": "No way that's true. As Wuntch says, when she sees deodorant, I'm not buying it.",
          "startMs": 15140,
          "endMs": 19200,
          "words": [
            {
              "w": "No",
              "s": 15140,
              "e": 15460
            },
            {
              "w": "way",
              "s": 15460,
              "e": 15640
            },
            {
              "w": "that's",
              "s": 15640,
              "e": 15900
            },
            {
              "w": "true.",
              "s": 15900,
              "e": 16180
            },
            {
              "w": "As",
              "s": 16240,
              "e": 16460
            },
            {
              "w": "Wuntch",
              "s": 16460,
              "e": 16660
            },
            {
              "w": "says,",
              "s": 16660,
              "e": 16880
            },
            {
              "w": "when",
              "s": 17010,
              "e": 17040
            },
            {
              "w": "she",
              "s": 17040,
              "e": 17260
            },
            {
              "w": "sees",
              "s": 17260,
              "e": 17400
            },
            {
              "w": "deodorant,",
              "s": 17400,
              "e": 17960
            },
            {
              "w": "I'm",
              "s": 18420,
              "e": 18580
            },
            {
              "w": "not",
              "s": 18580,
              "e": 18780
            },
            {
              "w": "buying",
              "s": 18780,
              "e": 18980
            },
            {
              "w": "it.",
              "s": 18980,
              "e": 19200
            }
          ],
          "clusters": [
            {
              "id": "clu-07",
              "category": "assimilation",
              "span": [
                17010,
                17260
              ],
              "cleanForms": [
                "when she",
                "when he",
                "then she",
                "when the"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'when‿she' → /wɛnˈʃiː/ — /n/ + /ʃ/ đồng hoá thành một tiếng 'whenshe'.",
                "en": "'when‿she' → /wɛnˈʃiː/ — /n/ + /ʃ/ assimilate into a single 'whenshe'."
              }
            },
            {
              "id": "clu-08",
              "category": "elision",
              "span": [
                18580,
                19200
              ],
              "cleanForms": [
                "not buying it",
                "not buy it",
                "not buying that",
                "not buyin it"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'buying‿it' → /ˈbaɪɪnɪt/ — âm /ŋ/ hạ xuống /n/ (bỏ đuôi -ng) rồi dính vào 'it'.",
                "en": "'buying‿it' → /ˈbaɪɪnɪt/ — the /ŋ/ lowers to /n/ (g-dropping) and fuses with 'it'."
              }
            }
          ]
        },
        {
          "id": "sent-07",
          "text": "Ha. Ha. Sir, she's dead. Oh, Terry. Zombies can't die?",
          "startMs": 19360,
          "endMs": 23340,
          "words": [
            {
              "w": "Ha",
              "s": 19360,
              "e": 19460
            },
            {
              "w": "Ha.",
              "s": 19460,
              "e": 19640
            },
            {
              "w": "Sir,",
              "s": 19740,
              "e": 20000
            },
            {
              "w": "she's",
              "s": 20000,
              "e": 20440
            },
            {
              "w": "dead.",
              "s": 20440,
              "e": 20740
            },
            {
              "w": "Oh,",
              "s": 20800,
              "e": 21240
            },
            {
              "w": "Terry.",
              "s": 21380,
              "e": 21620
            },
            {
              "w": "Zombies",
              "s": 22020,
              "e": 22460
            },
            {
              "w": "can't",
              "s": 22460,
              "e": 23020
            },
            {
              "w": "die?",
              "s": 23020,
              "e": 23340
            }
          ],
          "clusters": [
            {
              "id": "clu-09",
              "category": "liaison",
              "span": [
                19740,
                20440
              ],
              "cleanForms": [
                "Sir, she's",
                "Sir, she was",
                "Sur, she's",
                "Sir, his"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'Sir‿she's' → /sɜːrˈʃiːz/ — âm cuối /r/ của 'Sir' nối thẳng vào 'she's', nghe như một từ.",
                "en": "'Sir‿she's' → /sɜːrˈʃiːz/ — the /r/ of 'Sir' links straight into 'she's', heard as one word."
              }
            },
            {
              "id": "clu-10",
              "category": "elision",
              "span": [
                22460,
                23340
              ],
              "cleanForms": [
                "can't die",
                "can die",
                "can't lie",
                "can't died"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'can't‿die' → /ˈkænˈdaɪ/ — âm /t/ trong 'can't' bay mất trước /d/ của 'die'.",
                "en": "'can't‿die' → /ˈkænˈdaɪ/ — the /t/ in 'can't' vanishes before the /d/ of 'die'."
              }
            }
          ]
        },
        {
          "id": "sent-08",
          "text": "This is some sort of scam. If she were dead, we would be hearing the sounds of children singing in the streets.",
          "startMs": 23460,
          "endMs": 28340,
          "words": [
            {
              "w": "This",
              "s": 23460,
              "e": 23660
            },
            {
              "w": "is",
              "s": 23660,
              "e": 23840
            },
            {
              "w": "some",
              "s": 23840,
              "e": 24060
            },
            {
              "w": "sort",
              "s": 24060,
              "e": 24240
            },
            {
              "w": "of",
              "s": 24240,
              "e": 24440
            },
            {
              "w": "scam.",
              "s": 24440,
              "e": 24660
            },
            {
              "w": "If",
              "s": 24780,
              "e": 24920
            },
            {
              "w": "she",
              "s": 24920,
              "e": 25220
            },
            {
              "w": "were",
              "s": 25220,
              "e": 25460
            },
            {
              "w": "dead,",
              "s": 25460,
              "e": 25820
            },
            {
              "w": "we",
              "s": 25920,
              "e": 26140
            },
            {
              "w": "would",
              "s": 26140,
              "e": 26320
            },
            {
              "w": "be",
              "s": 26320,
              "e": 26520
            },
            {
              "w": "hearing",
              "s": 26520,
              "e": 26640
            },
            {
              "w": "the",
              "s": 26640,
              "e": 26860
            },
            {
              "w": "sounds",
              "s": 26860,
              "e": 27000
            },
            {
              "w": "of",
              "s": 27000,
              "e": 27240
            },
            {
              "w": "children",
              "s": 27240,
              "e": 27460
            },
            {
              "w": "singing",
              "s": 27460,
              "e": 27820
            },
            {
              "w": "in",
              "s": 27820,
              "e": 28000
            },
            {
              "w": "the",
              "s": 28000,
              "e": 28140
            },
            {
              "w": "streets.",
              "s": 28140,
              "e": 28340
            }
          ],
          "clusters": [
            {
              "id": "clu-11",
              "category": "reduced",
              "span": [
                24060,
                24440
              ],
              "cleanForms": [
                "sort of",
                "sort off",
                "sort out",
                "short of"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'sort of' → /ˈsɔːɾə/ — 'sorta': /t/ thành flap rồi gộp, âm /f/ biến mất.",
                "en": "'sort of' → /ˈsɔːɾə/ — 'sorta': the /t/ flaps and fuses, and the /f/ disappears."
              }
            },
            {
              "id": "clu-12",
              "category": "liaison",
              "span": [
                26860,
                27240
              ],
              "cleanForms": [
                "sounds of",
                "sound of",
                "sounds off",
                "sound off"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'sounds‿of' → /ˈsaʊndzəv/ — âm /z/ cuối 'sounds' dính vào 'of' thành một cụm.",
                "en": "'sounds‿of' → /ˈsaʊndzəv/ — the final /z/ of 'sounds' fuses with 'of'."
              }
            }
          ]
        },
        {
          "id": "sent-09",
          "text": "I don't know, sir. You didn't believe it when we told you that Disco Strangler died, either.",
          "startMs": 28380,
          "endMs": 32300,
          "words": [
            {
              "w": "I",
              "s": 28380,
              "e": 28580
            },
            {
              "w": "don't",
              "s": 28580,
              "e": 28740
            },
            {
              "w": "know,",
              "s": 28740,
              "e": 28920
            },
            {
              "w": "sir.",
              "s": 29020,
              "e": 29160
            },
            {
              "w": "You",
              "s": 29160,
              "e": 29300
            },
            {
              "w": "didn't",
              "s": 29300,
              "e": 29580
            },
            {
              "w": "believe",
              "s": 29580,
              "e": 29860
            },
            {
              "w": "it",
              "s": 29860,
              "e": 30020
            },
            {
              "w": "when",
              "s": 30020,
              "e": 30140
            },
            {
              "w": "we",
              "s": 30140,
              "e": 30320
            },
            {
              "w": "told",
              "s": 30320,
              "e": 30520
            },
            {
              "w": "you",
              "s": 30520,
              "e": 30680
            },
            {
              "w": "that",
              "s": 30680,
              "e": 30880
            },
            {
              "w": "Disco",
              "s": 30880,
              "e": 31240
            },
            {
              "w": "Strangler",
              "s": 31240,
              "e": 31700
            },
            {
              "w": "died,",
              "s": 31700,
              "e": 32000
            },
            {
              "w": "either.",
              "s": 32260,
              "e": 32300
            }
          ],
          "clusters": [
            {
              "id": "clu-13",
              "category": "elision",
              "span": [
                29300,
                29860
              ],
              "cleanForms": [
                "didn't believe",
                "did believe",
                "didn't believed",
                "doesn't believe"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'didn't‿believe' → /ˈdɪdn̩ bɪˈliːv/ — âm /t/ trong 'didn't' bị bỏ hẳn trước 'believe'.",
                "en": "'didn't‿believe' → /ˈdɪdn̩ bɪˈliːv/ — the /t/ in 'didn't' is dropped entirely before 'believe'."
              }
            },
            {
              "id": "clu-14",
              "category": "assimilation",
              "span": [
                30320,
                30680
              ],
              "cleanForms": [
                "told you",
                "told your",
                "told ya",
                "tell you"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'told‿you' → /ˈtoʊldʒuː/ — /d/ + /j/ đồng hoá thành /dʒ/, nghe như 'tol-joo'.",
                "en": "'told‿you' → /ˈtoʊldʒuː/ — /d/ + /j/ assimilate into /dʒ/, heard as 'tol-joo'."
              }
            }
          ]
        },
        {
          "id": "sent-10",
          "text": "Then I was right — he was faking it. Maybe she's alive.",
          "startMs": 32360,
          "endMs": 34200,
          "words": [
            {
              "w": "Then",
              "s": 32360,
              "e": 32440
            },
            {
              "w": "I",
              "s": 32440,
              "e": 32520
            },
            {
              "w": "was",
              "s": 32520,
              "e": 32700
            },
            {
              "w": "right,",
              "s": 32700,
              "e": 32840
            },
            {
              "w": "he",
              "s": 32840,
              "e": 32960
            },
            {
              "w": "was",
              "s": 32960,
              "e": 33100
            },
            {
              "w": "faking",
              "s": 33100,
              "e": 33320
            },
            {
              "w": "it.",
              "s": 33320,
              "e": 33380
            },
            {
              "w": "Maybe",
              "s": 33440,
              "e": 33640
            },
            {
              "w": "she's",
              "s": 33640,
              "e": 33940
            },
            {
              "w": "alive.",
              "s": 33940,
              "e": 34200
            }
          ],
          "clusters": [
            {
              "id": "clu-15",
              "category": "reduced",
              "span": [
                32840,
                33100
              ],
              "cleanForms": [
                "he was",
                "he were",
                "she was",
                "he wasn't"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'he‿was' → /iˈwʌz/ — 'he' mất /h/ khi không nhấn, dính vào 'was' thành 'ee-wuz'.",
                "en": "'he‿was' → /iˈwʌz/ — unstressed 'he' drops its /h/ and fuses with 'was' into 'ee-wuz'."
              }
            },
            {
              "id": "clu-16",
              "category": "liaison",
              "span": [
                33100,
                33380
              ],
              "cleanForms": [
                "faking it",
                "fake it",
                "faking that",
                "faking its"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'faking‿it' → /ˈfeɪkɪŋɪt/ — /ŋ/ cuối 'faking' dính thẳng vào nguyên âm của 'it'.",
                "en": "'faking‿it' → /ˈfeɪkɪŋɪt/ — the final /ŋ/ of 'faking' links straight into the vowel of 'it'."
              }
            }
          ]
        },
        {
          "id": "sent-11",
          "text": "Why would Wuntch fake her own death?",
          "startMs": 34300,
          "endMs": 35780,
          "words": [
            {
              "w": "Why",
              "s": 34300,
              "e": 34560
            },
            {
              "w": "would",
              "s": 34560,
              "e": 34880
            },
            {
              "w": "Wuntch",
              "s": 34880,
              "e": 35060
            },
            {
              "w": "fake",
              "s": 35060,
              "e": 35280
            },
            {
              "w": "her",
              "s": 35280,
              "e": 35480
            },
            {
              "w": "own",
              "s": 35480,
              "e": 35680
            },
            {
              "w": "death?",
              "s": 35680,
              "e": 35780
            }
          ],
          "clusters": [
            {
              "id": "clu-17",
              "category": "elision",
              "span": [
                35060,
                35480
              ],
              "cleanForms": [
                "fake her",
                "fake the",
                "fake a",
                "faked her"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'fake‿her' → /ˈfeɪkˈɜːr/ — âm /h/ của 'her' biến mất trong lời nói tự nhiên ('fake 'er').",
                "en": "'fake‿her' → /ˈfeɪkˈɜːr/ — the /h/ of 'her' disappears in natural speech ('fake 'er')."
              }
            }
          ]
        },
        {
          "id": "sent-12",
          "text": "Same reason she visits Mexico once a year and sucks the blood from all the goats, for kicks.",
          "startMs": 35880,
          "endMs": 40540,
          "words": [
            {
              "w": "Same",
              "s": 35880,
              "e": 36160
            },
            {
              "w": "reason",
              "s": 36160,
              "e": 36440
            },
            {
              "w": "she",
              "s": 36440,
              "e": 36580
            },
            {
              "w": "visits",
              "s": 36580,
              "e": 36880
            },
            {
              "w": "Mexico",
              "s": 36880,
              "e": 37360
            },
            {
              "w": "once",
              "s": 37360,
              "e": 37600
            },
            {
              "w": "a",
              "s": 37600,
              "e": 37780
            },
            {
              "w": "year",
              "s": 37780,
              "e": 37920
            },
            {
              "w": "and",
              "s": 37920,
              "e": 38080
            },
            {
              "w": "sucks",
              "s": 38080,
              "e": 38320
            },
            {
              "w": "the",
              "s": 38320,
              "e": 38600
            },
            {
              "w": "blood",
              "s": 38600,
              "e": 38840
            },
            {
              "w": "from",
              "s": 38840,
              "e": 39020
            },
            {
              "w": "all",
              "s": 39020,
              "e": 39240
            },
            {
              "w": "the",
              "s": 39240,
              "e": 39440
            },
            {
              "w": "goats,",
              "s": 39440,
              "e": 39720
            },
            {
              "w": "for",
              "s": 40080,
              "e": 40300
            },
            {
              "w": "kicks.",
              "s": 40300,
              "e": 40540
            }
          ],
          "clusters": [
            {
              "id": "clu-18",
              "category": "liaison",
              "span": [
                37360,
                37920
              ],
              "cleanForms": [
                "once a year",
                "once in year",
                "once the year",
                "one a year"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'once‿a‿year' → /wʌnsəˈjɪr/ — ba từ nối thành một chuỗi âm, /s/ + /ə/ + /j/ dính nhau.",
                "en": "'once‿a‿year' → /wʌnsəˈjɪr/ — three words chain into one sound stream, /s/ + /ə/ + /j/ fused."
              }
            },
            {
              "id": "clu-19",
              "category": "reduced",
              "span": [
                37920,
                38320
              ],
              "cleanForms": [
                "and sucks",
                "and suck",
                "then sucks",
                "an sucks"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'and' không nhấn → /ən/, gần như 'n' — 'and sucks' nghe như 'nsucks'.",
                "en": "Unstressed 'and' → /ən/, almost just 'n' — 'and sucks' is heard as 'nsucks'."
              }
            }
          ]
        },
        {
          "id": "sent-13",
          "text": "Look, I don't know what to tell you, but she's dead. What do you want — to open up her coffin and check for yourself?",
          "startMs": 40640,
          "endMs": 45080,
          "words": [
            {
              "w": "Look,",
              "s": 40640,
              "e": 40780
            },
            {
              "w": "I",
              "s": 40780,
              "e": 40860
            },
            {
              "w": "don't",
              "s": 40860,
              "e": 41020
            },
            {
              "w": "know",
              "s": 41020,
              "e": 41080
            },
            {
              "w": "what",
              "s": 41080,
              "e": 41180
            },
            {
              "w": "to",
              "s": 41180,
              "e": 41380
            },
            {
              "w": "tell",
              "s": 41380,
              "e": 41520
            },
            {
              "w": "you,",
              "s": 41520,
              "e": 41900
            },
            {
              "w": "but",
              "s": 41920,
              "e": 42060
            },
            {
              "w": "she's",
              "s": 42060,
              "e": 42400
            },
            {
              "w": "dead.",
              "s": 42400,
              "e": 42640
            },
            {
              "w": "But",
              "s": 42700,
              "e": 42860
            },
            {
              "w": "what",
              "s": 42860,
              "e": 43000
            },
            {
              "w": "do",
              "s": 43000,
              "e": 43100
            },
            {
              "w": "you",
              "s": 43100,
              "e": 43280
            },
            {
              "w": "want,",
              "s": 43280,
              "e": 43380
            },
            {
              "w": "to",
              "s": 43400,
              "e": 43620
            },
            {
              "w": "open",
              "s": 43620,
              "e": 43780
            },
            {
              "w": "up",
              "s": 43780,
              "e": 43940
            },
            {
              "w": "her",
              "s": 43940,
              "e": 44140
            },
            {
              "w": "coffin",
              "s": 44140,
              "e": 44340
            },
            {
              "w": "and",
              "s": 44340,
              "e": 44480
            },
            {
              "w": "check",
              "s": 44480,
              "e": 44640
            },
            {
              "w": "for",
              "s": 44640,
              "e": 44800
            },
            {
              "w": "yourself?",
              "s": 44800,
              "e": 45080
            }
          ],
          "clusters": [
            {
              "id": "clu-20",
              "category": "reduced",
              "span": [
                40860,
                41080
              ],
              "cleanForms": [
                "don't know",
                "didn't know",
                "doesn't know",
                "don't now"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'don't know' → 'dunno' /dəˈnoʊ/ — /t/ + /k/ bay mất, hai từ gộp thành một.",
                "en": "'don't know' → 'dunno' /dəˈnoʊ/ — /t/ + /k/ vanish and the two words fuse into one."
              }
            },
            {
              "id": "clu-21",
              "category": "reduced",
              "span": [
                41080,
                41380
              ],
              "cleanForms": [
                "what to",
                "what do",
                "what's to",
                "what you"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'what‿to' → /wʌɾə/ — 'whadda': /t/ giữa hai nguyên âm thành flap rồi gộp.",
                "en": "'what‿to' → /wʌɾə/ — 'whadda': the /t/ between vowels flaps and fuses."
              }
            },
            {
              "id": "clu-22",
              "category": "reduced",
              "span": [
                42860,
                43380
              ],
              "cleanForms": [
                "what do you want",
                "what did you want",
                "what do you wanted",
                "what does you want"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'what do you' → /ˈwʌdjə/ — 'whaddya': /t/ nuốt, ba từ thành một âm tiết rưỡi.",
                "en": "'what do you' → /ˈwʌdjə/ — 'whaddya': the /t/ is swallowed, three words collapse into a syllable and a half."
              }
            }
          ]
        },
        {
          "id": "sent-14",
          "text": "Oh, she's very dead. Ding dong! The Wuntch is dead! Bagels for everyone!",
          "startMs": 46240,
          "endMs": 53440,
          "words": [
            {
              "w": "Oh,",
              "s": 46240,
              "e": 46600
            },
            {
              "w": "she's",
              "s": 46600,
              "e": 46960
            },
            {
              "w": "very",
              "s": 46960,
              "e": 47200
            },
            {
              "w": "dead.",
              "s": 47200,
              "e": 47460
            },
            {
              "w": "Ding,",
              "s": 48580,
              "e": 48940
            },
            {
              "w": "dong,",
              "s": 49140,
              "e": 49460
            },
            {
              "w": "the",
              "s": 49540,
              "e": 49840
            },
            {
              "w": "Wuntch",
              "s": 49840,
              "e": 50200
            },
            {
              "w": "is",
              "s": 50200,
              "e": 50740
            },
            {
              "w": "dead!",
              "s": 50740,
              "e": 51180
            },
            {
              "w": "Bagels,",
              "s": 52040,
              "e": 52400
            },
            {
              "w": "for",
              "s": 52400,
              "e": 52760
            },
            {
              "w": "everyone!",
              "s": 52760,
              "e": 53440
            }
          ],
          "clusters": [
            {
              "id": "clu-23",
              "category": "liaison",
              "span": [
                46600,
                47200
              ],
              "cleanForms": [
                "she's very",
                "she very",
                "she's vary",
                "his very"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'she's‿very' → /ʃiːzˈvɛri/ — /z/ cuối 'she's' dính vào nguyên âm của 'very'.",
                "en": "'she's‿very' → /ʃiːzˈvɛri/ — the /z/ of 'she's' links into the vowel of 'very'."
              }
            },
            {
              "id": "clu-24",
              "category": "linking",
              "span": [
                49840,
                51180
              ],
              "cleanForms": [
                "Wuntch is dead",
                "Wuntch was dead",
                "Wuntch's dead",
                "Wuntch isn't dead"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'Wuntch‿is‿dead' — 'is' bị kẹp giữa hai từ và gộp thành /ɪz/, không tách được ranh giới.",
                "en": "'Wuntch‿is‿dead' — 'is' is squeezed between neighbours and reduced to /ɪz/, erasing the boundary."
              }
            },
            {
              "id": "clu-25",
              "category": "reduced",
              "span": [
                52400,
                53440
              ],
              "cleanForms": [
                "for everyone",
                "for every one",
                "from everyone",
                "for everyone's"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'for‿everyone' → /fɚˈɛvriwʌn/ — 'for' không nhấn, chỉ còn /fər/ dính vào 'everyone'.",
                "en": "'for‿everyone' → /fɚˈɛvriwʌn/ — unstressed 'for' reduces to /fər/ and fuses with 'everyone'."
              }
            }
          ]
        },
        {
          "id": "sent-15",
          "text": "So I guess you believe it now? Yep, wanna see the selfies I took? Actually, yes. I'll share the album with you.",
          "startMs": 53720,
          "endMs": 57920,
          "words": [
            {
              "w": "So",
              "s": 53720,
              "e": 54000
            },
            {
              "w": "I",
              "s": 54000,
              "e": 54030
            },
            {
              "w": "guess",
              "s": 54030,
              "e": 54200
            },
            {
              "w": "you",
              "s": 54200,
              "e": 54420
            },
            {
              "w": "believe",
              "s": 54420,
              "e": 54560
            },
            {
              "w": "it",
              "s": 54560,
              "e": 54740
            },
            {
              "w": "now?",
              "s": 54740,
              "e": 54860
            },
            {
              "w": "Yep,",
              "s": 54940,
              "e": 55140
            },
            {
              "w": "wanna",
              "s": 55280,
              "e": 55440
            },
            {
              "w": "see",
              "s": 55440,
              "e": 55600
            },
            {
              "w": "the",
              "s": 55600,
              "e": 55760
            },
            {
              "w": "selfies",
              "s": 55760,
              "e": 55900
            },
            {
              "w": "I",
              "s": 55900,
              "e": 56100
            },
            {
              "w": "took?",
              "s": 56100,
              "e": 56180
            },
            {
              "w": "Actually,",
              "s": 56340,
              "e": 56700
            },
            {
              "w": "yes.",
              "s": 56740,
              "e": 56940
            },
            {
              "w": "I'll",
              "s": 57000,
              "e": 57180
            },
            {
              "w": "share",
              "s": 57180,
              "e": 57280
            },
            {
              "w": "the",
              "s": 57280,
              "e": 57480
            },
            {
              "w": "album",
              "s": 57480,
              "e": 57660
            },
            {
              "w": "with",
              "s": 57660,
              "e": 57820
            },
            {
              "w": "you.",
              "s": 57820,
              "e": 57920
            }
          ],
          "clusters": [
            {
              "id": "clu-26",
              "category": "assimilation",
              "span": [
                54030,
                54420
              ],
              "cleanForms": [
                "guess you",
                "guess your",
                "guess ya",
                "guess youth"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'guess‿you' → /ˈɡɛʃuː/ — /s/ + /j/ đồng hoá thành /ʃ/, nghe như 'gessh-you'.",
                "en": "'guess‿you' → /ˈɡɛʃuː/ — /s/ + /j/ assimilate into /ʃ/, heard as 'gessh-you'."
              }
            },
            {
              "id": "clu-27",
              "category": "reduced",
              "span": [
                55280,
                55440
              ],
              "cleanForms": [
                "want to",
                "wanted to",
                "want you",
                "wants to"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'want to' → 'wanna' /ˈwɑːnə/ — hai từ gộp, âm /t/ hoàn toàn biến mất.",
                "en": "'want to' → 'wanna' /ˈwɑːnə/ — the two words fuse and the /t/ disappears completely."
              }
            },
            {
              "id": "clu-28",
              "category": "assimilation",
              "span": [
                57660,
                57920
              ],
              "cleanForms": [
                "with you",
                "with your",
                "with ya",
                "without you"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'with‿you' → /ˈwɪtʃuː/ — /θ/ + /j/ đồng hoá thành /tʃ/, nghe như 'witch-you'.",
                "en": "'with‿you' → /ˈwɪtʃuː/ — /θ/ + /j/ assimilate into /tʃ/, heard as 'witch-you'."
              }
            }
          ]
        },
        {
          "id": "sent-16",
          "text": "Oh my God. I just heard about Wuntch. She was so young. For a redwood tree?",
          "startMs": 57920,
          "endMs": 63120,
          "words": [
            {
              "w": "Oh,",
              "s": 57920,
              "e": 58300
            },
            {
              "w": "my",
              "s": 58430,
              "e": 58460
            },
            {
              "w": "God.",
              "s": 58460,
              "e": 58640
            },
            {
              "w": "I",
              "s": 58780,
              "e": 58880
            },
            {
              "w": "just",
              "s": 58880,
              "e": 59100
            },
            {
              "w": "heard",
              "s": 59100,
              "e": 59260
            },
            {
              "w": "about",
              "s": 59260,
              "e": 59620
            },
            {
              "w": "Wuntch.",
              "s": 59620,
              "e": 60140
            },
            {
              "w": "She",
              "s": 60500,
              "e": 60700
            },
            {
              "w": "was",
              "s": 60700,
              "e": 60940
            },
            {
              "w": "so",
              "s": 60940,
              "e": 61300
            },
            {
              "w": "young.",
              "s": 61300,
              "e": 61660
            },
            {
              "w": "For",
              "s": 61760,
              "e": 62080
            },
            {
              "w": "a",
              "s": 62080,
              "e": 62440
            },
            {
              "w": "redwood",
              "s": 62440,
              "e": 62860
            },
            {
              "w": "tree?",
              "s": 62860,
              "e": 63120
            }
          ],
          "clusters": [
            {
              "id": "clu-29",
              "category": "liaison",
              "span": [
                59100,
                59620
              ],
              "cleanForms": [
                "heard about",
                "heard of",
                "hear about",
                "heard out"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'heard‿about' → /hɜːrdəˈbaʊt/ — /d/ cuối 'heard' dính vào 'about', nghe như 'heardabout'.",
                "en": "'heard‿about' → /hɜːrdəˈbaʊt/ — the final /d/ of 'heard' fuses with 'about', heard as 'heardabout'."
              }
            },
            {
              "id": "clu-30",
              "category": "reduced",
              "span": [
                61760,
                62860
              ],
              "cleanForms": [
                "For a redwood",
                "For the redwood",
                "Four a redwood",
                "For a red wood"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'For‿a' → /fərə/ — 'for' không nhấn thành /fər/, gộp với 'a' thành một âm mở đầu.",
                "en": "'For‿a' → /fərə/ — unstressed 'for' reduces to /fər/ and merges with 'a' into one opening sound."
              }
            }
          ]
        },
        {
          "id": "sent-17",
          "text": "I don't understand what's going on. Why are you crying?",
          "startMs": 63680,
          "endMs": 65520,
          "words": [
            {
              "w": "I",
              "s": 63680,
              "e": 63900
            },
            {
              "w": "don't",
              "s": 63900,
              "e": 64060
            },
            {
              "w": "understand",
              "s": 64060,
              "e": 64240
            },
            {
              "w": "what's",
              "s": 64240,
              "e": 64480
            },
            {
              "w": "going",
              "s": 64480,
              "e": 64640
            },
            {
              "w": "on.",
              "s": 64640,
              "e": 64800
            },
            {
              "w": "Why",
              "s": 64840,
              "e": 65020
            },
            {
              "w": "are",
              "s": 65020,
              "e": 65100
            },
            {
              "w": "you",
              "s": 65100,
              "e": 65280
            },
            {
              "w": "crying?",
              "s": 65280,
              "e": 65520
            }
          ],
          "clusters": [
            {
              "id": "clu-31",
              "category": "elision",
              "span": [
                63900,
                64240
              ],
              "cleanForms": [
                "don't understand",
                "do understand",
                "don't understood",
                "doesn't understand"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'don't‿understand' → /ˈdoʊn ʌndɚˈstænd/ — âm /t/ bị bỏ, chỉ còn /n/ + /ʌ/ dính nhau.",
                "en": "'don't‿understand' → /ˈdoʊn ʌndɚˈstænd/ — the /t/ is dropped, leaving /n/ + /ʌ/ stuck together."
              }
            },
            {
              "id": "clu-32",
              "category": "assimilation",
              "span": [
                65020,
                65280
              ],
              "cleanForms": [
                "are you",
                "are ya",
                "are your",
                "our you"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'are‿you' → /ˈɑːrjə/ — 'arya': /r/ + /j/ dính lại, gần như mất 'you'.",
                "en": "'are‿you' → /ˈɑːrjə/ — 'arya': /r/ + /j/ fuse, nearly swallowing 'you'."
              }
            }
          ]
        },
        {
          "id": "sent-18",
          "text": "A person is dead. I feel sad. That's insane. You don't feel sad when a monster dies in a monster movie.",
          "startMs": 65700,
          "endMs": 71900,
          "words": [
            {
              "w": "A",
              "s": 65700,
              "e": 65900
            },
            {
              "w": "person",
              "s": 65900,
              "e": 66260
            },
            {
              "w": "is",
              "s": 66260,
              "e": 66660
            },
            {
              "w": "dead.",
              "s": 66660,
              "e": 66840
            },
            {
              "w": "I",
              "s": 66920,
              "e": 67240
            },
            {
              "w": "feel",
              "s": 67240,
              "e": 67560
            },
            {
              "w": "sad.",
              "s": 67560,
              "e": 68120
            },
            {
              "w": "That's",
              "s": 68220,
              "e": 68620
            },
            {
              "w": "insane.",
              "s": 68620,
              "e": 69100
            },
            {
              "w": "You",
              "s": 69320,
              "e": 69440
            },
            {
              "w": "don't",
              "s": 69440,
              "e": 69600
            },
            {
              "w": "feel",
              "s": 69600,
              "e": 69880
            },
            {
              "w": "sad",
              "s": 69880,
              "e": 70180
            },
            {
              "w": "when",
              "s": 70180,
              "e": 70380
            },
            {
              "w": "a",
              "s": 70380,
              "e": 70560
            },
            {
              "w": "monster",
              "s": 70560,
              "e": 70800
            },
            {
              "w": "dies",
              "s": 70800,
              "e": 71040
            },
            {
              "w": "in",
              "s": 71040,
              "e": 71200
            },
            {
              "w": "a",
              "s": 71200,
              "e": 71280
            },
            {
              "w": "monster",
              "s": 71280,
              "e": 71580
            },
            {
              "w": "movie.",
              "s": 71580,
              "e": 71900
            }
          ],
          "clusters": [
            {
              "id": "clu-33",
              "category": "liaison",
              "span": [
                65900,
                66660
              ],
              "cleanForms": [
                "person is",
                "person's",
                "persons is",
                "person was"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'person‿is' → /ˈpɜːrsənɪz/ — 'is' không nhấn, dính vào đuôi /n/ của 'person'.",
                "en": "'person‿is' → /ˈpɜːrsənɪz/ — unstressed 'is' fuses with the /n/ coda of 'person'."
              }
            },
            {
              "id": "clu-34",
              "category": "liaison",
              "span": [
                68220,
                69100
              ],
              "cleanForms": [
                "That's insane",
                "That insane",
                "That's in sane",
                "Thats insane"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'That's‿insane' → /ðætsɪnˈseɪn/ — /s/ + /ɪ/ dính nhau, không có khoảng nghỉ giữa hai từ.",
                "en": "'That's‿insane' → /ðætsɪnˈseɪn/ — /s/ + /ɪ/ fuse with no gap between the words."
              }
            },
            {
              "id": "clu-35",
              "category": "linking",
              "span": [
                70800,
                71280
              ],
              "cleanForms": [
                "dies in a",
                "die in a",
                "dies in the",
                "dies on a"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'dies‿in‿a' → /ˈdaɪzɪnə/ — ba từ nối thành một chuỗi, /z/ + /ɪ/ + /ə/ dính liền.",
                "en": "'dies‿in‿a' → /ˈdaɪzɪnə/ — three words chain together, /z/ + /ɪ/ + /ə/ fused."
              }
            }
          ]
        },
        {
          "id": "sent-19",
          "text": "In E.T., do you feel sad when E.T. dies? Yes! He wasn't a monster. He caused a real commotion.",
          "startMs": 72320,
          "endMs": 77580,
          "words": [
            {
              "w": "In",
              "s": 72320,
              "e": 72520
            },
            {
              "w": "E",
              "s": 72520,
              "e": 72640
            },
            {
              "w": ".T.",
              "s": 72640,
              "e": 72860
            },
            {
              "w": "Do",
              "s": 73040,
              "e": 73160
            },
            {
              "w": "you",
              "s": 73160,
              "e": 73300
            },
            {
              "w": "feel",
              "s": 73300,
              "e": 73500
            },
            {
              "w": "sad",
              "s": 73500,
              "e": 73820
            },
            {
              "w": "when",
              "s": 73820,
              "e": 74040
            },
            {
              "w": "E",
              "s": 74040,
              "e": 74360
            },
            {
              "w": ".T.",
              "s": 74360,
              "e": 74500
            },
            {
              "w": "dies?",
              "s": 74850,
              "e": 74880
            },
            {
              "w": "Yes.",
              "s": 75100,
              "e": 75460
            },
            {
              "w": "He",
              "s": 75690,
              "e": 75720
            },
            {
              "w": "wasn't",
              "s": 75720,
              "e": 76140
            },
            {
              "w": "a",
              "s": 76140,
              "e": 76280
            },
            {
              "w": "monster.",
              "s": 76280,
              "e": 76540
            },
            {
              "w": "He",
              "s": 76640,
              "e": 76760
            },
            {
              "w": "caused",
              "s": 76760,
              "e": 76900
            },
            {
              "w": "a",
              "s": 76900,
              "e": 77060
            },
            {
              "w": "real",
              "s": 77060,
              "e": 77200
            },
            {
              "w": "commotion.",
              "s": 77200,
              "e": 77580
            }
          ],
          "clusters": [
            {
              "id": "clu-36",
              "category": "assimilation",
              "span": [
                73040,
                73300
              ],
              "cleanForms": [
                "do you",
                "do ya",
                "does you",
                "did you"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'do‿you' → /ˈdʒuː/ — 'dyou': /d/ + /j/ đồng hoá thành /dʒ/, hai từ thành một âm.",
                "en": "'do‿you' → /ˈdʒuː/ — 'dyou': /d/ + /j/ assimilate into /dʒ/, two words become one sound."
              }
            },
            {
              "id": "clu-37",
              "category": "liaison",
              "span": [
                75720,
                76540
              ],
              "cleanForms": [
                "wasn't a monster",
                "wasn't the monster",
                "was a monster",
                "wasn't monsters"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'wasn't‿a' → /ˈwʌzəntə/ — âm /t/ + /ə/ dính nhau, nghe như 'wuzn-tuh'.",
                "en": "'wasn't‿a' → /ˈwʌzəntə/ — the /t/ + /ə/ fuse, heard as 'wuzn-tuh'."
              }
            },
            {
              "id": "clu-38",
              "category": "reduced",
              "span": [
                76640,
                77060
              ],
              "cleanForms": [
                "He caused a",
                "Because of",
                "He cause a",
                "He caused the"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'He‿caused‿a' → /iˈkɔːzə/ — 'he' mất /h/, 'caused a' gộp — cả cụm nghe như 'because of'.",
                "en": "'He‿caused‿a' → /iˈkɔːzə/ — 'he' drops its /h/ and 'caused a' fuses — the phrase sounds like 'because of'."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "clip-skillup-01",
      "caseId": "case-gta-leak",
      "videoId": "RFhRJaWtbYc",
      "youtubeUrl": "https://www.youtube.com/watch?v=RFhRJaWtbYc&t=819s",
      "startOffsetMs": 819000,
      "title": "Skill Up — GTA 6 choices, partner & endings",
      "durationSec": 39.0,
      "level": 3,
      "category": "game",
      "gistQuestion": {
        "prompt": {
          "vi": "Reviewer đang bàn về khía cạnh nào của trò chơi?",
          "en": "What aspect of the game is the reviewer discussing?"
        },
        "choices": [
          {
            "vi": "Câu chuyện, lựa chọn của người chơi và các kết thúc khác nhau",
            "en": "The story, player choices and the different endings"
          },
          {
            "vi": "Giá bán và ngày phát hành",
            "en": "The price and release date"
          },
          {
            "vi": "Đồ hoạ và hiệu năng trên console",
            "en": "The graphics and console performance"
          },
          {
            "vi": "Chế độ multiplayer trực tuyến",
            "en": "The online multiplayer mode"
          }
        ],
        "answerIndex": 0
      },
      "comprehension": [
        {
          "prompt": {
            "vi": "Vì sao reviewer từ chối nói về mối quan hệ giữa Jason và Lucia?",
            "en": "Why does the reviewer refuse to talk about Jason and Lucia's relationship?"
          },
          "choices": [
            {
              "vi": "Vì anh ấy chưa chơi hết game",
              "en": "Because he has not finished the game"
            },
            {
              "vi": "Vì nói ra sẽ làm hỏng (spoiler) cốt truyện",
              "en": "Because talking about it would spoil things"
            },
            {
              "vi": "Vì nhà phát hành yêu cầu không được nói",
              "en": "Because the publisher asked him not to"
            },
            {
              "vi": "Vì anh ấy không thích hai nhân vật đó",
              "en": "Because he dislikes those characters"
            }
          ],
          "answerIndex": 1
        },
        {
          "prompt": {
            "vi": "Reviewer đánh giá thế nào về quy mô câu chuyện?",
            "en": "How does the reviewer judge the scale of the story?"
          },
          "choices": [
            {
              "vi": "Nhỏ gọn và tập trung",
              "en": "Small and focused"
            },
            {
              "vi": "Mênh mông, đa dạng chủ đề, tông và bối cảnh — sẽ có thứ hợp với mọi người",
              "en": "Expansive, diverse in topic, tone and setting — something for everyone"
            },
            {
              "vi": "Lặp lại và nhàm chán",
              "en": "Repetitive and boring"
            },
            {
              "vi": "Vẫn chưa hoàn thiện",
              "en": "Still unfinished"
            }
          ],
          "answerIndex": 1
        },
        {
          "prompt": {
            "vi": "Manh mối nội dung: điều gì được xác nhận là CÓ trong game?",
            "en": "Content clue: what is confirmed to be IN the game?"
          },
          "choices": [
            {
              "vi": "Nhiều kết thúc khác nhau",
              "en": "Multiple endings"
            },
            {
              "vi": "Chế độ battle royale",
              "en": "A battle royale mode"
            },
            {
              "vi": "Bản đồ gấp đôi phần trước",
              "en": "A map twice the size of the previous game"
            },
            {
              "vi": "Hỗ trợ mod trên console",
              "en": "Mod support on consoles"
            }
          ],
          "answerIndex": 0
        }
      ],
      "sentences": [
        {
          "id": "sent-01",
          "text": "The sorta cutscenes that you get during your playthrough,",
          "startMs": 0,
          "endMs": 1880,
          "words": [
            {
              "w": "the",
              "s": 0,
              "e": 180
            },
            {
              "w": "sort",
              "s": 180,
              "e": 210
            },
            {
              "w": "of",
              "s": 210,
              "e": 380
            },
            {
              "w": "cutscenes",
              "s": 380,
              "e": 780
            },
            {
              "w": "that",
              "s": 780,
              "e": 920
            },
            {
              "w": "you",
              "s": 920,
              "e": 1020
            },
            {
              "w": "get",
              "s": 1020,
              "e": 1160
            },
            {
              "w": "during",
              "s": 1160,
              "e": 1420
            },
            {
              "w": "your",
              "s": 1420,
              "e": 1620
            },
            {
              "w": "playthrough,",
              "s": 1620,
              "e": 1880
            }
          ],
          "clusters": [
            {
              "id": "clu-01",
              "category": "reduced",
              "span": [
                180,
                380
              ],
              "cleanForms": [
                "sort of",
                "sort off",
                "sort out",
                "short of"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'sort of' → 'sorta' /ˈsɔːɾə/ — /t/ thành flap rồi gộp, âm /f/ biến mất.",
                "en": "'sort of' → 'sorta' /ˈsɔːɾə/ — the /t/ flaps and fuses, and the /f/ disappears."
              }
            },
            {
              "id": "clu-02",
              "category": "linking",
              "span": [
                1160,
                1620
              ],
              "cleanForms": [
                "during your",
                "during you",
                "during the",
                "during our"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'during‿your' → /ˈdʊrɪŋjɚ/ — /ŋ/ cuối 'during' dính vào /j/ của 'your', nghe như 'durin-yer'.",
                "en": "'during‿your' → /ˈdʊrɪŋjɚ/ — the final /ŋ/ of 'during' fuses with the /j/ of 'your', heard as 'durin-yer'."
              }
            }
          ]
        },
        {
          "id": "sent-02",
          "text": "the sorta decisions you can make about how much you wanna include or exclude your partner from missions,",
          "startMs": 2200,
          "endMs": 6520,
          "words": [
            {
              "w": "the",
              "s": 2200,
              "e": 2300
            },
            {
              "w": "sort",
              "s": 2300,
              "e": 2380
            },
            {
              "w": "of",
              "s": 2380,
              "e": 2600
            },
            {
              "w": "decisions",
              "s": 2600,
              "e": 2960
            },
            {
              "w": "you",
              "s": 2960,
              "e": 3120
            },
            {
              "w": "can",
              "s": 3120,
              "e": 3380
            },
            {
              "w": "make",
              "s": 3380,
              "e": 3580
            },
            {
              "w": "about",
              "s": 3580,
              "e": 3780
            },
            {
              "w": "how",
              "s": 3780,
              "e": 3980
            },
            {
              "w": "much",
              "s": 3980,
              "e": 4120
            },
            {
              "w": "you",
              "s": 4120,
              "e": 4200
            },
            {
              "w": "want",
              "s": 4200,
              "e": 4320
            },
            {
              "w": "to",
              "s": 4320,
              "e": 4640
            },
            {
              "w": "include",
              "s": 4640,
              "e": 5000
            },
            {
              "w": "or",
              "s": 5000,
              "e": 5300
            },
            {
              "w": "exclude",
              "s": 5300,
              "e": 5640
            },
            {
              "w": "your",
              "s": 5640,
              "e": 5840
            },
            {
              "w": "partner",
              "s": 5840,
              "e": 6060
            },
            {
              "w": "from",
              "s": 6060,
              "e": 6280
            },
            {
              "w": "missions,",
              "s": 6280,
              "e": 6520
            }
          ],
          "clusters": [
            {
              "id": "clu-03",
              "category": "reduced",
              "span": [
                4200,
                4640
              ],
              "cleanForms": [
                "want to",
                "wanted to",
                "want you",
                "wants to"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'want to' → 'wanna' /ˈwɑːnə/ — hai từ gộp, âm /t/ hoàn toàn biến mất.",
                "en": "'want to' → 'wanna' /ˈwɑːnə/ — the two words fuse and the /t/ disappears completely."
              }
            },
            {
              "id": "clu-04",
              "category": "reduced",
              "span": [
                2960,
                3580
              ],
              "cleanForms": [
                "you can make",
                "you can makes",
                "you could make",
                "you can making"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'can' không nhấn → /kən/ — 'you can make' trôi thành 'you-kin-make'.",
                "en": "Unstressed 'can' → /kən/ — 'you can make' slides into 'you-kin-make'."
              }
            }
          ]
        },
        {
          "id": "sent-03",
          "text": "and of course, which ending you get — because yes, there are multiple endings.",
          "startMs": 6820,
          "endMs": 9940,
          "words": [
            {
              "w": "and",
              "s": 6820,
              "e": 6920
            },
            {
              "w": "of",
              "s": 6920,
              "e": 7140
            },
            {
              "w": "course,",
              "s": 7140,
              "e": 7460
            },
            {
              "w": "which",
              "s": 7720,
              "e": 7860
            },
            {
              "w": "ending",
              "s": 7860,
              "e": 8040
            },
            {
              "w": "you",
              "s": 8040,
              "e": 8200
            },
            {
              "w": "get,",
              "s": 8200,
              "e": 8460
            },
            {
              "w": "because",
              "s": 8540,
              "e": 8700
            },
            {
              "w": "yes,",
              "s": 8700,
              "e": 8940
            },
            {
              "w": "there",
              "s": 8960,
              "e": 9100
            },
            {
              "w": "are",
              "s": 9100,
              "e": 9360
            },
            {
              "w": "multiple",
              "s": 9360,
              "e": 9680
            },
            {
              "w": "endings.",
              "s": 9680,
              "e": 9940
            }
          ],
          "clusters": [
            {
              "id": "clu-05",
              "category": "reduced",
              "span": [
                6820,
                7140
              ],
              "cleanForms": [
                "and of",
                "and off",
                "an of",
                "and from"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'and‿of' → /ənˈəv/ — 'and' không nhấn thành /ən/, hai từ gộp thành 'n-of'.",
                "en": "'and‿of' → /ənˈəv/ — unstressed 'and' reduces to /ən/ and the pair fuses into 'n-of'."
              }
            },
            {
              "id": "clu-06",
              "category": "reduced",
              "span": [
                8700,
                9100
              ],
              "cleanForms": [
                "there are",
                "there're",
                "there is",
                "there were"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'there‿are' → /ˈðɛrə/ — 'are' không nhấn, chỉ còn /ə/ dính vào 'there'.",
                "en": "'there‿are' → /ˈðɛrə/ — unstressed 'are' reduces to /ə/ and fuses with 'there'."
              }
            }
          ]
        },
        {
          "id": "sent-04",
          "text": "On the narrative side of things, the relationship between Jason and Lucia is literally impossible to talk about without spoiling things, so I'm not even gonna try.",
          "startMs": 10140,
          "endMs": 16700,
          "words": [
            {
              "w": "On",
              "s": 10140,
              "e": 10260
            },
            {
              "w": "the",
              "s": 10260,
              "e": 10400
            },
            {
              "w": "narrative",
              "s": 10400,
              "e": 10600
            },
            {
              "w": "side",
              "s": 10600,
              "e": 10760
            },
            {
              "w": "of",
              "s": 10760,
              "e": 10900
            },
            {
              "w": "things,",
              "s": 10900,
              "e": 11020
            },
            {
              "w": "the",
              "s": 11120,
              "e": 11160
            },
            {
              "w": "relationship",
              "s": 11160,
              "e": 11560
            },
            {
              "w": "between",
              "s": 11560,
              "e": 11900
            },
            {
              "w": "Jason",
              "s": 11900,
              "e": 12260
            },
            {
              "w": "and",
              "s": 12260,
              "e": 12480
            },
            {
              "w": "Lucia",
              "s": 12480,
              "e": 12780
            },
            {
              "w": "is",
              "s": 13240,
              "e": 13640
            },
            {
              "w": "literally",
              "s": 13640,
              "e": 14040
            },
            {
              "w": "impossible",
              "s": 14040,
              "e": 14440
            },
            {
              "w": "to",
              "s": 14440,
              "e": 14660
            },
            {
              "w": "talk",
              "s": 14660,
              "e": 14780
            },
            {
              "w": "about",
              "s": 14780,
              "e": 15000
            },
            {
              "w": "without",
              "s": 15000,
              "e": 15260
            },
            {
              "w": "spoiling",
              "s": 15260,
              "e": 15580
            },
            {
              "w": "things,",
              "s": 15580,
              "e": 15820
            },
            {
              "w": "so",
              "s": 15820,
              "e": 15960
            },
            {
              "w": "I'm",
              "s": 15960,
              "e": 16040
            },
            {
              "w": "not",
              "s": 16040,
              "e": 16160
            },
            {
              "w": "even",
              "s": 16160,
              "e": 16300
            },
            {
              "w": "gonna",
              "s": 16300,
              "e": 16440
            },
            {
              "w": "try.",
              "s": 16440,
              "e": 16700
            }
          ],
          "clusters": [
            {
              "id": "clu-07",
              "category": "liaison",
              "span": [
                10600,
                10900
              ],
              "cleanForms": [
                "side of",
                "side off",
                "sides of",
                "side from"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'side‿of' → /ˈsaɪdəv/ — /d/ cuối 'side' dính vào nguyên âm của 'of', nghe như 'si-dof'.",
                "en": "'side‿of' → /ˈsaɪdəv/ — the final /d/ of 'side' fuses with the vowel of 'of', heard as 'si-dof'."
              }
            },
            {
              "id": "clu-08",
              "category": "liaison",
              "span": [
                14660,
                15000
              ],
              "cleanForms": [
                "talk about",
                "talk about it",
                "talked about",
                "talk around"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'talk‿about' → /tɔːkəˈbaʊt/ — /k/ + /ə/ dính liền, hai từ thành 'talk-about' một cụm.",
                "en": "'talk‿about' → /tɔːkəˈbaʊt/ — /k/ + /ə/ fuse, and the two words become one chunk 'talk-about'."
              }
            },
            {
              "id": "clu-09",
              "category": "reduced",
              "span": [
                16300,
                16440
              ],
              "cleanForms": [
                "going to",
                "gonna",
                "gonna to",
                "going for"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'going to' → 'gonna' /ˈɡʌnə/ — hai từ gộp, âm /t/ hoàn toàn biến mất.",
                "en": "'going to' → 'gonna' /ˈɡʌnə/ — the two words fuse and the /t/ disappears completely."
              }
            }
          ]
        },
        {
          "id": "sent-05",
          "text": "I'll let you make up your own mind about that stuff, and we'll come back to it once you've all had a chance to play through it.",
          "startMs": 16900,
          "endMs": 20920,
          "words": [
            {
              "w": "I'll",
              "s": 16900,
              "e": 17100
            },
            {
              "w": "let",
              "s": 17100,
              "e": 17180
            },
            {
              "w": "you",
              "s": 17180,
              "e": 17300
            },
            {
              "w": "make",
              "s": 17300,
              "e": 17420
            },
            {
              "w": "up",
              "s": 17420,
              "e": 17560
            },
            {
              "w": "your",
              "s": 17560,
              "e": 17720
            },
            {
              "w": "own",
              "s": 17720,
              "e": 17880
            },
            {
              "w": "mind",
              "s": 17880,
              "e": 18040
            },
            {
              "w": "about",
              "s": 18040,
              "e": 18240
            },
            {
              "w": "that",
              "s": 18240,
              "e": 18460
            },
            {
              "w": "stuff",
              "s": 18460,
              "e": 18680
            },
            {
              "w": "and",
              "s": 18680,
              "e": 18780
            },
            {
              "w": "we'll",
              "s": 18780,
              "e": 18940
            },
            {
              "w": "come",
              "s": 18940,
              "e": 19140
            },
            {
              "w": "back",
              "s": 19140,
              "e": 19320
            },
            {
              "w": "to",
              "s": 19320,
              "e": 19420
            },
            {
              "w": "it",
              "s": 19420,
              "e": 19540
            },
            {
              "w": "once",
              "s": 19540,
              "e": 19700
            },
            {
              "w": "you've",
              "s": 19700,
              "e": 19880
            },
            {
              "w": "all",
              "s": 19880,
              "e": 19960
            },
            {
              "w": "had",
              "s": 19960,
              "e": 20080
            },
            {
              "w": "a",
              "s": 20080,
              "e": 20160
            },
            {
              "w": "chance",
              "s": 20160,
              "e": 20300
            },
            {
              "w": "to",
              "s": 20300,
              "e": 20480
            },
            {
              "w": "play",
              "s": 20480,
              "e": 20600
            },
            {
              "w": "through",
              "s": 20600,
              "e": 20780
            },
            {
              "w": "it.",
              "s": 20780,
              "e": 20920
            }
          ],
          "clusters": [
            {
              "id": "clu-10",
              "category": "assimilation",
              "span": [
                17180,
                17420
              ],
              "cleanForms": [
                "let you",
                "let ya",
                "lets you",
                "let your"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'let‿you' → /ˈlɛtʃuː/ — 'letchu': /t/ + /j/ đồng hoá thành /tʃ/.",
                "en": "'let‿you' → /ˈlɛtʃuː/ — 'letchu': /t/ + /j/ assimilate into /tʃ/."
              }
            },
            {
              "id": "clu-11",
              "category": "liaison",
              "span": [
                17300,
                17560
              ],
              "cleanForms": [
                "make up",
                "make up your",
                "made up",
                "make ups"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'make‿up' → /meɪˈkʌp/ — /k/ cuối 'make' dính vào nguyên âm của 'up', hai từ thành một.",
                "en": "'make‿up' → /meɪˈkʌp/ — the final /k/ of 'make' fuses with the vowel of 'up', two words become one."
              }
            },
            {
              "id": "clu-12",
              "category": "liaison",
              "span": [
                20600,
                20920
              ],
              "cleanForms": [
                "through it",
                "through that",
                "thru it",
                "through its"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'through‿it' → /ˈθruːwɪt/ — một âm lướt /w/ được chèn vào giữa 'through' và 'it'.",
                "en": "'through‿it' → /ˈθruːwɪt/ — a glide /w/ is inserted between 'through' and 'it'."
              }
            }
          ]
        },
        {
          "id": "sent-06",
          "text": "We'll just leave that for now. I will say this about the overall story, though.",
          "startMs": 21320,
          "endMs": 24320,
          "words": [
            {
              "w": "We'll",
              "s": 21320,
              "e": 21480
            },
            {
              "w": "just",
              "s": 21480,
              "e": 21660
            },
            {
              "w": "leave",
              "s": 21660,
              "e": 21740
            },
            {
              "w": "that",
              "s": 21740,
              "e": 21900
            },
            {
              "w": "for",
              "s": 21900,
              "e": 22020
            },
            {
              "w": "now.",
              "s": 22020,
              "e": 22220
            },
            {
              "w": "I",
              "s": 22380,
              "e": 22500
            },
            {
              "w": "will",
              "s": 22500,
              "e": 22700
            },
            {
              "w": "say",
              "s": 22700,
              "e": 22860
            },
            {
              "w": "this",
              "s": 22860,
              "e": 23140
            },
            {
              "w": "about",
              "s": 23140,
              "e": 23320
            },
            {
              "w": "the",
              "s": 23320,
              "e": 23560
            },
            {
              "w": "overall",
              "s": 23560,
              "e": 23760
            },
            {
              "w": "story",
              "s": 23760,
              "e": 24100
            },
            {
              "w": "though.",
              "s": 24100,
              "e": 24320
            }
          ],
          "clusters": [
            {
              "id": "clu-13",
              "category": "elision",
              "span": [
                21480,
                21740
              ],
              "cleanForms": [
                "just leave",
                "just leaves",
                "only leave",
                "just left"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'just‿leave' → /dʒʌsˈliːv/ — âm /t/ của 'just' bị bỏ trước /l/, chỉ còn 'jus-leave'.",
                "en": "'just‿leave' → /dʒʌsˈliːv/ — the /t/ of 'just' drops before /l/, leaving 'jus-leave'."
              }
            },
            {
              "id": "clu-14",
              "category": "liaison",
              "span": [
                23140,
                23760
              ],
              "cleanForms": [
                "about the overall",
                "about the over all",
                "about an overall",
                "about the overall's"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'about‿the‿overall' → /əˈbaʊˈðiːˈoʊvɚæl/ — 'the' chuyển sang /ðiː/ trước nguyên âm và ba từ nối liền.",
                "en": "'about‿the‿overall' → /əˈbaʊˈðiːˈoʊvɚæl/ — 'the' shifts to /ðiː/ before a vowel and the three words chain together."
              }
            }
          ]
        },
        {
          "id": "sent-07",
          "text": "What is here is so expansive and so diverse in topic, tone, characterization and setting, that there's gonna be something for everyone, I suspect.",
          "startMs": 24400,
          "endMs": 33000,
          "words": [
            {
              "w": "What",
              "s": 24400,
              "e": 24660
            },
            {
              "w": "is",
              "s": 24660,
              "e": 25140
            },
            {
              "w": "here",
              "s": 25140,
              "e": 25460
            },
            {
              "w": "is",
              "s": 25460,
              "e": 25860
            },
            {
              "w": "so",
              "s": 25860,
              "e": 26120
            },
            {
              "w": "expansive",
              "s": 26120,
              "e": 26760
            },
            {
              "w": "and",
              "s": 26760,
              "e": 27120
            },
            {
              "w": "so",
              "s": 27120,
              "e": 27440
            },
            {
              "w": "diverse",
              "s": 27440,
              "e": 27960
            },
            {
              "w": "in",
              "s": 27960,
              "e": 28280
            },
            {
              "w": "topic,",
              "s": 28280,
              "e": 28540
            },
            {
              "w": "tone,",
              "s": 28720,
              "e": 28940
            },
            {
              "w": "characterization",
              "s": 29200,
              "e": 29600
            },
            {
              "w": "and",
              "s": 29600,
              "e": 29900
            },
            {
              "w": "setting,",
              "s": 29900,
              "e": 30140
            },
            {
              "w": "that",
              "s": 30660,
              "e": 30720
            },
            {
              "w": "there's",
              "s": 30720,
              "e": 30980
            },
            {
              "w": "going",
              "s": 30980,
              "e": 31080
            },
            {
              "w": "to",
              "s": 31080,
              "e": 31260
            },
            {
              "w": "be",
              "s": 31260,
              "e": 31520
            },
            {
              "w": "something",
              "s": 31520,
              "e": 31860
            },
            {
              "w": "for",
              "s": 31860,
              "e": 32160
            },
            {
              "w": "everyone",
              "s": 32160,
              "e": 32380
            },
            {
              "w": "I",
              "s": 32380,
              "e": 32620
            },
            {
              "w": "suspect.",
              "s": 32620,
              "e": 33000
            }
          ],
          "clusters": [
            {
              "id": "clu-15",
              "category": "liaison",
              "span": [
                24660,
                25460
              ],
              "cleanForms": [
                "is here",
                "is hear",
                "is there",
                "it's here"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'is‿here' → /ɪzˈhɪr/ — /z/ cuối 'is' dính vào /h/ của 'here', không có khoảng nghỉ.",
                "en": "'is‿here' → /ɪzˈhɪr/ — the final /z/ of 'is' fuses with the /h/ of 'here', no gap between."
              }
            },
            {
              "id": "clu-16",
              "category": "reduced",
              "span": [
                30720,
                31260
              ],
              "cleanForms": [
                "there's going to",
                "there's gonna",
                "there is going to",
                "there's going"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'going to' → 'gonna' /ˈɡʌnə/ — 'there's going to be' trôi thành 'there's gonna be'.",
                "en": "'going to' → 'gonna' /ˈɡʌnə/ — 'there's going to be' slides into 'there's gonna be'."
              }
            },
            {
              "id": "clu-17",
              "category": "reduced",
              "span": [
                26760,
                27440
              ],
              "cleanForms": [
                "and so",
                "and so much",
                "an so",
                "and thus"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'and' không nhấn → /ən/ — 'and so' nghe như 'n-so'.",
                "en": "Unstressed 'and' → /ən/ — 'and so' is heard as 'n-so'."
              }
            }
          ]
        },
        {
          "id": "sent-08",
          "text": "Not every part of it will hit for everyone, but I do expect that big chunks of it will hit for a lot of people.",
          "startMs": 33140,
          "endMs": 38720,
          "words": [
            {
              "w": "Not",
              "s": 33140,
              "e": 33420
            },
            {
              "w": "every",
              "s": 33420,
              "e": 33800
            },
            {
              "w": "part",
              "s": 33800,
              "e": 34080
            },
            {
              "w": "of",
              "s": 34080,
              "e": 34200
            },
            {
              "w": "it",
              "s": 34200,
              "e": 34300
            },
            {
              "w": "will",
              "s": 34300,
              "e": 34600
            },
            {
              "w": "hit",
              "s": 34600,
              "e": 34800
            },
            {
              "w": "for",
              "s": 34800,
              "e": 35140
            },
            {
              "w": "everyone,",
              "s": 35140,
              "e": 35420
            },
            {
              "w": "but",
              "s": 35860,
              "e": 36000
            },
            {
              "w": "I",
              "s": 36000,
              "e": 36060
            },
            {
              "w": "do",
              "s": 36060,
              "e": 36260
            },
            {
              "w": "expect",
              "s": 36260,
              "e": 36540
            },
            {
              "w": "that",
              "s": 36540,
              "e": 36800
            },
            {
              "w": "big",
              "s": 36800,
              "e": 37020
            },
            {
              "w": "chunks",
              "s": 37020,
              "e": 37300
            },
            {
              "w": "of",
              "s": 37300,
              "e": 37460
            },
            {
              "w": "it",
              "s": 37460,
              "e": 37560
            },
            {
              "w": "will",
              "s": 37560,
              "e": 37780
            },
            {
              "w": "hit",
              "s": 37780,
              "e": 37940
            },
            {
              "w": "for",
              "s": 37940,
              "e": 38140
            },
            {
              "w": "a",
              "s": 38140,
              "e": 38170
            },
            {
              "w": "lot",
              "s": 38170,
              "e": 38260
            },
            {
              "w": "of",
              "s": 38260,
              "e": 38480
            },
            {
              "w": "people.",
              "s": 38480,
              "e": 38720
            }
          ],
          "clusters": [
            {
              "id": "clu-18",
              "category": "assimilation",
              "span": [
                33800,
                34300
              ],
              "cleanForms": [
                "part of it",
                "part of its",
                "parts of it",
                "part off it"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'part‿of‿it' → /ˈpɑːrɾəvɪt/ — /t/ giữa hai nguyên âm thành flap, ba từ thành 'par-dof-it'.",
                "en": "'part‿of‿it' → /ˈpɑːrɾəvɪt/ — the /t/ between vowels flaps, and three words become 'par-dof-it'."
              }
            },
            {
              "id": "clu-19",
              "category": "liaison",
              "span": [
                37020,
                37560
              ],
              "cleanForms": [
                "chunks of it",
                "chunk of it",
                "chunks off it",
                "chunks of its"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'chunks‿of‿it' → /ˈtʃʌŋksəvɪt/ — /s/ + /əv/ + /ɪt/ dính liền, mất ranh giới từ.",
                "en": "'chunks‿of‿it' → /ˈtʃʌŋksəvɪt/ — /s/ + /əv/ + /ɪt/ fuse together, erasing the word boundaries."
              }
            },
            {
              "id": "clu-20",
              "category": "assimilation",
              "span": [
                38170,
                38720
              ],
              "cleanForms": [
                "lot of people",
                "lot off people",
                "lots of people",
                "lot of the people"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'lot‿of‿people' → /ˈlɑːɾəˈpiːpl̩/ — /t/ thành flap + 'of' giảm còn /ə/, nghe như 'lodda people'.",
                "en": "'lot‿of‿people' → /ˈlɑːɾəˈpiːpl̩/ — the /t/ flaps and 'of' reduces to /ə/, heard as 'lodda people'."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "clip-afjm-01",
      "caseId": "case-drill-01",
      "videoId": "9FnO3igOkOk",
      "youtubeUrl": "https://www.youtube.com/watch?v=9FnO3igOkOk&t=32s",
      "startOffsetMs": 32000,
      "title": "A Few Good Men — the cross-examination",
      "durationSec": 90.0,
      "level": 4,
      "category": "film",
      "gistQuestion": {
        "prompt": {
          "vi": "Đoạn đối chất này xoay quanh câu hỏi gì?",
          "en": "What is this cross-examination about?"
        },
        "choices": [
          {
            "vi": "Ai đã ra lệnh 'Code Red' và ai chịu trách nhiệm về cái chết của Santiago",
            "en": "Who ordered the 'Code Red' and who is responsible for Santiago's death"
          },
          {
            "vi": "Ai đã đánh cắp hồ sơ mật của quân đội",
            "en": "Who stole the military's classified files"
          },
          {
            "vi": "Khi nào phiên toà sẽ kết thúc",
            "en": "When the trial will end"
          },
          {
            "vi": "Sĩ quan nào sẽ được thăng chức",
            "en": "Which officer will be promoted"
          }
        ],
        "answerIndex": 0
      },
      "comprehension": [
        {
          "prompt": {
            "vi": "Khi bị hỏi thẳng 'Did you order the Code Red?', người ta khuyên gì?",
            "en": "When he is asked 'Did you order the Code Red?', what is the advice given?"
          },
          "choices": [
            {
              "vi": "Nhận tội ngay tại toà",
              "en": "Plead guilty at once"
            },
            {
              "vi": "Không cần trả lời câu hỏi đó",
              "en": "He does not have to answer that question"
            },
            {
              "vi": "Gọi luật sư bào chữa",
              "en": "Call a defense lawyer"
            },
            {
              "vi": "Yêu cầu hoãn phiên xử",
              "en": "Ask for an adjournment"
            }
          ],
          "answerIndex": 1
        },
        {
          "prompt": {
            "vi": "Jessup cho rằng mình có trách nhiệm gì?",
            "en": "What responsibility does Jessup claim to have?"
          },
          "choices": [
            {
              "vi": "Huấn luyện tân binh ở trường quân sự",
              "en": "Training recruits at the academy"
            },
            {
              "vi": "Viết báo cáo cho toà án",
              "en": "Writing reports for the court"
            },
            {
              "vi": "Giữ bức tường bằng người có súng — và ông ấy 'được cần ở trên bức tường đó'",
              "en": "Guarding the wall with men with guns — and he is 'needed on that wall'"
            },
            {
              "vi": "Chăm sóc gia đình Santiago",
              "en": "Caring for Santiago's family"
            }
          ],
          "answerIndex": 2
        },
        {
          "prompt": {
            "vi": "Jessup nói ông ấy thà nghe câu gì từ người đối chất?",
            "en": "What would Jessup rather hear from the questioner?"
          },
          "choices": [
            {
              "vi": "Một lời xin lỗi",
              "en": "An apology"
            },
            {
              "vi": "Lời 'cảm ơn' rồi đi tiếp",
              "en": "'Thank you', and then go on his way"
            },
            {
              "vi": "Một lời thú tội",
              "en": "A confession"
            },
            {
              "vi": "Đơn xin thăng chức",
              "en": "A promotion request"
            }
          ],
          "answerIndex": 1
        }
      ],
      "sentences": [
        {
          "id": "sent-01",
          "text": "Colonel Jessup, did you order the Code Red?",
          "startMs": 1040,
          "endMs": 4060,
          "words": [
            {
              "w": "Colonel",
              "s": 1040,
              "e": 1520
            },
            {
              "w": "Jessup,",
              "s": 1520,
              "e": 2000
            },
            {
              "w": "did",
              "s": 2340,
              "e": 2580
            },
            {
              "w": "you",
              "s": 2580,
              "e": 2920
            },
            {
              "w": "order",
              "s": 2920,
              "e": 3240
            },
            {
              "w": "the",
              "s": 3240,
              "e": 3520
            },
            {
              "w": "Code",
              "s": 3520,
              "e": 3820
            },
            {
              "w": "Red?",
              "s": 3820,
              "e": 4060
            }
          ],
          "clusters": [
            {
              "id": "clu-01",
              "category": "assimilation",
              "span": [
                2340,
                2920
              ],
              "cleanForms": [
                "did you",
                "did ya",
                "does you",
                "did your"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'did‿you' → /ˈdɪdʒə/ — 'didja': /d/ + /j/ đồng hoá thành /dʒ/, hai từ thành một âm.",
                "en": "'did‿you' → /ˈdɪdʒə/ — 'didja': /d/ + /j/ assimilate into /dʒ/, two words become one sound."
              }
            }
          ]
        },
        {
          "id": "sent-02",
          "text": "You don't have to answer that question.",
          "startMs": 4220,
          "endMs": 5600,
          "words": [
            {
              "w": "You",
              "s": 4220,
              "e": 4380
            },
            {
              "w": "don't",
              "s": 4380,
              "e": 4600
            },
            {
              "w": "have",
              "s": 4600,
              "e": 4820
            },
            {
              "w": "to",
              "s": 4820,
              "e": 4900
            },
            {
              "w": "answer",
              "s": 4900,
              "e": 5060
            },
            {
              "w": "that",
              "s": 5060,
              "e": 5280
            },
            {
              "w": "question.",
              "s": 5280,
              "e": 5600
            }
          ],
          "clusters": [
            {
              "id": "clu-02",
              "category": "reduced",
              "span": [
                4600,
                4900
              ],
              "cleanForms": [
                "have to",
                "has to",
                "had to",
                "have too"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'have to' → 'hafta' /ˈhæftə/ — 'have' gộp thành /hæf/, âm /v/ biến mất.",
                "en": "'have to' → 'hafta' /ˈhæftə/ — 'have' collapses into /hæf/ and the /v/ disappears."
              }
            }
          ]
        },
        {
          "id": "sent-03",
          "text": "I'll answer the question.",
          "startMs": 5900,
          "endMs": 7180,
          "words": [
            {
              "w": "I'll",
              "s": 5900,
              "e": 6180
            },
            {
              "w": "answer",
              "s": 6180,
              "e": 6480
            },
            {
              "w": "the",
              "s": 6480,
              "e": 6780
            },
            {
              "w": "question.",
              "s": 6780,
              "e": 7180
            }
          ],
          "clusters": [
            {
              "id": "clu-03",
              "category": "reduced",
              "span": [
                5900,
                6480
              ],
              "cleanForms": [
                "I'll answer",
                "I will answer",
                "I'll answers",
                "I'm answer"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'I'll‿answer' → /aɪlˈænsɚ/ — 'I will' gộp thành 'I'll', âm /w/ bay mất hoàn toàn.",
                "en": "'I'll‿answer' → /aɪlˈænsɚ/ — 'I will' contracts to 'I'll' and the /w/ disappears entirely."
              }
            }
          ]
        },
        {
          "id": "sent-04",
          "text": "You want answers? I think I'm entitled.",
          "startMs": 8020,
          "endMs": 10000,
          "words": [
            {
              "w": "You",
              "s": 8020,
              "e": 8220
            },
            {
              "w": "want",
              "s": 8220,
              "e": 8400
            },
            {
              "w": "answers?",
              "s": 8400,
              "e": 8860
            },
            {
              "w": "I",
              "s": 9080,
              "e": 9220
            },
            {
              "w": "think",
              "s": 9220,
              "e": 9460
            },
            {
              "w": "I'm",
              "s": 9460,
              "e": 9660
            },
            {
              "w": "entitled",
              "s": 9660,
              "e": 10000
            }
          ],
          "clusters": [
            {
              "id": "clu-04",
              "category": "linking",
              "span": [
                8020,
                8860
              ],
              "cleanForms": [
                "want answers",
                "want answer",
                "wanted answers",
                "want an answer"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'want‿answers' → /wɑːnˈtænsɚz/ — /t/ cuối 'want' dính vào nguyên âm mở đầu 'answers'.",
                "en": "'want‿answers' → /wɑːnˈtænsɚz/ — the /t/ of 'want' fuses into the opening vowel of 'answers'."
              }
            },
            {
              "id": "clu-05",
              "category": "liaison",
              "span": [
                9080,
                9660
              ],
              "cleanForms": [
                "think I'm",
                "think I am",
                "thinking I'm",
                "think am"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'think‿I'm' → /ˈθɪŋkaɪm/ — ba âm dính liền: 'think' + 'I'm' nghe như một từ 'thinkim'.",
                "en": "'think‿I'm' → /ˈθɪŋkaɪm/ — three sounds fuse: 'think' + 'I'm' sound like one word 'thinkim'."
              }
            }
          ]
        },
        {
          "id": "sent-05",
          "text": "You want answers?! I want the truth!",
          "startMs": 10020,
          "endMs": 12260,
          "words": [
            {
              "w": "You",
              "s": 10020,
              "e": 10360
            },
            {
              "w": "want",
              "s": 10360,
              "e": 10800
            },
            {
              "w": "answers?",
              "s": 10800,
              "e": 11200
            },
            {
              "w": "I",
              "s": 11220,
              "e": 11420
            },
            {
              "w": "want",
              "s": 11420,
              "e": 11680
            },
            {
              "w": "the",
              "s": 11680,
              "e": 12020
            },
            {
              "w": "truth!",
              "s": 12020,
              "e": 12260
            }
          ],
          "clusters": [
            {
              "id": "clu-06",
              "category": "elision",
              "span": [
                11420,
                12260
              ],
              "cleanForms": [
                "want the truth",
                "want to truth",
                "wanted the truth",
                "want that truth"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'want‿the' → /wɑːnˈðə/ — âm /t/ trong 'want' bị bỏ trước 'the', nghe như 'wan-the'.",
                "en": "'want‿the' → /wɑːnˈðə/ — the /t/ in 'want' drops before 'the', heard as 'wan-the'."
              }
            }
          ]
        },
        {
          "id": "sent-06",
          "text": "You can't handle the truth!",
          "startMs": 12460,
          "endMs": 14280,
          "words": [
            {
              "w": "You",
              "s": 12460,
              "e": 12700
            },
            {
              "w": "can't",
              "s": 12700,
              "e": 13140
            },
            {
              "w": "handle",
              "s": 13140,
              "e": 13520
            },
            {
              "w": "the",
              "s": 13520,
              "e": 13860
            },
            {
              "w": "truth!",
              "s": 13860,
              "e": 14280
            }
          ],
          "clusters": [
            {
              "id": "clu-07",
              "category": "elision",
              "span": [
                12700,
                13520
              ],
              "cleanForms": [
                "can't handle",
                "can handle",
                "can't handles",
                "can't handled"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'can't‿handle' → /ˈkænˈhændl̩/ — âm /t/ biến mất trước /h/, chỉ còn /n/ + /h/ dính nhau.",
                "en": "'can't‿handle' → /ˈkænˈhændl̩/ — the /t/ vanishes before /h/, leaving /n/ + /h/ stuck together."
              }
            }
          ]
        },
        {
          "id": "sent-07",
          "text": "Son, we live in a world that has walls, and those walls have to be guarded by men with guns.",
          "startMs": 15980,
          "endMs": 20180,
          "words": [
            {
              "w": "Son,",
              "s": 15980,
              "e": 16160
            },
            {
              "w": "we",
              "s": 16240,
              "e": 16360
            },
            {
              "w": "live",
              "s": 16360,
              "e": 16480
            },
            {
              "w": "in",
              "s": 16480,
              "e": 16600
            },
            {
              "w": "a",
              "s": 16600,
              "e": 16740
            },
            {
              "w": "world",
              "s": 16740,
              "e": 16900
            },
            {
              "w": "that",
              "s": 16900,
              "e": 17140
            },
            {
              "w": "has",
              "s": 17140,
              "e": 17420
            },
            {
              "w": "walls,",
              "s": 17420,
              "e": 17740
            },
            {
              "w": "and",
              "s": 17860,
              "e": 17900
            },
            {
              "w": "those",
              "s": 17900,
              "e": 18220
            },
            {
              "w": "walls",
              "s": 18220,
              "e": 18420
            },
            {
              "w": "have",
              "s": 18420,
              "e": 18640
            },
            {
              "w": "to",
              "s": 18640,
              "e": 18780
            },
            {
              "w": "be",
              "s": 18780,
              "e": 18940
            },
            {
              "w": "guarded",
              "s": 18940,
              "e": 19140
            },
            {
              "w": "by",
              "s": 19140,
              "e": 19380
            },
            {
              "w": "men",
              "s": 19380,
              "e": 19580
            },
            {
              "w": "with",
              "s": 19580,
              "e": 19820
            },
            {
              "w": "guns.",
              "s": 19820,
              "e": 20180
            }
          ],
          "clusters": [
            {
              "id": "clu-08",
              "category": "liaison",
              "span": [
                16360,
                16740
              ],
              "cleanForms": [
                "live in a",
                "live in",
                "living in a",
                "live in the"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'live‿in‿a' → /ˈlɪvɪnə/ — ba từ nối thành 'liv-ina', /v/ + /ɪ/ + /n/ + /ə/ dính liền.",
                "en": "'live‿in‿a' → /ˈlɪvɪnə/ — three words chain into 'liv-ina', /v/ + /ɪ/ + /n/ + /ə/ fused."
              }
            },
            {
              "id": "clu-09",
              "category": "reduced",
              "span": [
                18420,
                18940
              ],
              "cleanForms": [
                "have to be",
                "has to be",
                "had to be",
                "have to been"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'have to' → 'hafta' /ˈhæftə/ — 'have to be' trôi thành 'hafta be' khi nói nhanh.",
                "en": "'have to' → 'hafta' /ˈhæftə/ — 'have to be' slides into 'hafta be' in fast speech."
              }
            }
          ]
        },
        {
          "id": "sent-08",
          "text": "Who's gonna do it? You? You, Lieutenant Weinberg?",
          "startMs": 20480,
          "endMs": 23900,
          "words": [
            {
              "w": "Who's",
              "s": 20480,
              "e": 20800
            },
            {
              "w": "gonna",
              "s": 20800,
              "e": 20940
            },
            {
              "w": "do",
              "s": 20940,
              "e": 21160
            },
            {
              "w": "it?",
              "s": 21160,
              "e": 21400
            },
            {
              "w": "You?",
              "s": 21720,
              "e": 22200
            },
            {
              "w": "You,",
              "s": 22460,
              "e": 22800
            },
            {
              "w": "Lieutenant",
              "s": 22920,
              "e": 23260
            },
            {
              "w": "Weinberg?",
              "s": 23260,
              "e": 23900
            }
          ],
          "clusters": [
            {
              "id": "clu-10",
              "category": "reduced",
              "span": [
                20800,
                20940
              ],
              "cleanForms": [
                "going to",
                "gonna",
                "gonna to",
                "going for"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'going to' → 'gonna' /ˈɡʌnə/ — hai từ gộp, âm /t/ hoàn toàn biến mất.",
                "en": "'going to' → 'gonna' /ˈɡʌnə/ — the two words fuse and the /t/ disappears completely."
              }
            },
            {
              "id": "clu-11",
              "category": "linking",
              "span": [
                20940,
                21400
              ],
              "cleanForms": [
                "do it",
                "do them",
                "do its",
                "doing it"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'do‿it' → /ˈduːwɪt/ — một âm lướt /w/ được chèn vào giữa, hai từ dính như 'doo-wit'.",
                "en": "'do‿it' → /ˈduːwɪt/ — a glide /w/ is inserted between, and the words fuse as 'doo-wit'."
              }
            }
          ]
        },
        {
          "id": "sent-09",
          "text": "I have a greater responsibility than you can possibly fathom.",
          "startMs": 25060,
          "endMs": 28520,
          "words": [
            {
              "w": "I",
              "s": 25060,
              "e": 25360
            },
            {
              "w": "have",
              "s": 25360,
              "e": 25520
            },
            {
              "w": "a",
              "s": 25520,
              "e": 25680
            },
            {
              "w": "greater",
              "s": 25680,
              "e": 25940
            },
            {
              "w": "responsibility",
              "s": 25940,
              "e": 26800
            },
            {
              "w": "than",
              "s": 26800,
              "e": 27000
            },
            {
              "w": "you",
              "s": 27000,
              "e": 27200
            },
            {
              "w": "can",
              "s": 27200,
              "e": 27500
            },
            {
              "w": "possibly",
              "s": 27500,
              "e": 28020
            },
            {
              "w": "fathom.",
              "s": 28020,
              "e": 28520
            }
          ],
          "clusters": [
            {
              "id": "clu-12",
              "category": "liaison",
              "span": [
                25360,
                25680
              ],
              "cleanForms": [
                "have a",
                "have the",
                "hav a",
                "have an"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'have‿a' → /hævə/ — 'have' + 'a' dính thành 'hava', âm /v/ chạm nguyên âm /ə/.",
                "en": "'have‿a' → /hævə/ — 'have' + 'a' fuse into 'hava', the /v/ touching the vowel /ə/."
              }
            },
            {
              "id": "clu-13",
              "category": "liaison",
              "span": [
                26800,
                27200
              ],
              "cleanForms": [
                "than you",
                "then you",
                "than your",
                "than ya"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'than‿you' → /ˈðænjuː/ — /n/ + /j/ dính nhau, nghe như 'thanyoo'.",
                "en": "'than‿you' → /ˈðænjuː/ — /n/ + /j/ fuse together, heard as 'thanyoo'."
              }
            }
          ]
        },
        {
          "id": "sent-10",
          "text": "You weep for Santiago, and you curse the Marines.",
          "startMs": 28520,
          "endMs": 32020,
          "words": [
            {
              "w": "You",
              "s": 28520,
              "e": 29280
            },
            {
              "w": "weep",
              "s": 29280,
              "e": 29700
            },
            {
              "w": "for",
              "s": 29700,
              "e": 29960
            },
            {
              "w": "Santiago,",
              "s": 29960,
              "e": 30560
            },
            {
              "w": "and",
              "s": 30730,
              "e": 30760
            },
            {
              "w": "you",
              "s": 30760,
              "e": 31060
            },
            {
              "w": "curse",
              "s": 31060,
              "e": 31320
            },
            {
              "w": "the",
              "s": 31320,
              "e": 31600
            },
            {
              "w": "Marines.",
              "s": 31600,
              "e": 32020
            }
          ],
          "clusters": [
            {
              "id": "clu-14",
              "category": "linking",
              "span": [
                29280,
                29960
              ],
              "cleanForms": [
                "weep for",
                "weep four",
                "wept for",
                "weep far"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'weep‿for' → /ˈwiːp fɚ/ — phụ âm /p/ cuối chạm phụ âm /f/ đầu, hai từ dính thành một cụm.",
                "en": "'weep‿for' → /ˈwiːp fɚ/ — the final /p/ meets the initial /f/, and the words stick as one chunk."
              }
            },
            {
              "id": "clu-15",
              "category": "reduced",
              "span": [
                30730,
                31060
              ],
              "cleanForms": [
                "and you",
                "an you",
                "and ya",
                "and your"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'and' không nhấn → /ən/, gần như biến mất — 'and you' nghe như 'nyoo'.",
                "en": "Unstressed 'and' → /ən/, nearly vanishing — 'and you' is heard as 'nyoo'."
              }
            }
          ]
        },
        {
          "id": "sent-11",
          "text": "You have that luxury. You have the luxury of not knowing what I know.",
          "startMs": 32620,
          "endMs": 36380,
          "words": [
            {
              "w": "You",
              "s": 32620,
              "e": 32760
            },
            {
              "w": "have",
              "s": 32760,
              "e": 32960
            },
            {
              "w": "that",
              "s": 32960,
              "e": 33240
            },
            {
              "w": "luxury.",
              "s": 33240,
              "e": 33700
            },
            {
              "w": "You",
              "s": 34040,
              "e": 34200
            },
            {
              "w": "have",
              "s": 34200,
              "e": 34420
            },
            {
              "w": "the",
              "s": 34420,
              "e": 34620
            },
            {
              "w": "luxury",
              "s": 34620,
              "e": 35000
            },
            {
              "w": "of",
              "s": 35000,
              "e": 35160
            },
            {
              "w": "not",
              "s": 35160,
              "e": 35380
            },
            {
              "w": "knowing",
              "s": 35380,
              "e": 35620
            },
            {
              "w": "what",
              "s": 35620,
              "e": 35820
            },
            {
              "w": "I",
              "s": 35820,
              "e": 36100
            },
            {
              "w": "know.",
              "s": 36100,
              "e": 36380
            }
          ],
          "clusters": [
            {
              "id": "clu-16",
              "category": "liaison",
              "span": [
                34620,
                35160
              ],
              "cleanForms": [
                "luxury of",
                "luxury off",
                "luxuries of",
                "luxury or"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'luxury‿of' → /ˈlʌkʃɚiəv/ — nguyên âm cuối 'luxury' nối thẳng vào 'of', mất ranh giới từ.",
                "en": "'luxury‿of' → /ˈlʌkʃɚiəv/ — the final vowel of 'luxury' links straight into 'of', erasing the boundary."
              }
            },
            {
              "id": "clu-17",
              "category": "assimilation",
              "span": [
                35620,
                36100
              ],
              "cleanForms": [
                "what I",
                "what a",
                "what he",
                "what my"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'what‿I' → /wʌˈdaɪ/ — /t/ giữa hai nguyên âm thành flap /ɾ/, nghe như 'whad-I'.",
                "en": "'what‿I' → /wʌˈdaɪ/ — the /t/ between vowels becomes a flap /ɾ/, heard as 'whad-I'."
              }
            }
          ]
        },
        {
          "id": "sent-12",
          "text": "That Santiago's death, while tragic, probably saved lives.",
          "startMs": 36580,
          "endMs": 40440,
          "words": [
            {
              "w": "That",
              "s": 36580,
              "e": 36780
            },
            {
              "w": "Santiago's",
              "s": 36780,
              "e": 37660
            },
            {
              "w": "death,",
              "s": 37660,
              "e": 37800
            },
            {
              "w": "while",
              "s": 37800,
              "e": 38120
            },
            {
              "w": "tragic,",
              "s": 38120,
              "e": 38600
            },
            {
              "w": "probably",
              "s": 39080,
              "e": 39480
            },
            {
              "w": "saved",
              "s": 39480,
              "e": 39900
            },
            {
              "w": "lives.",
              "s": 39900,
              "e": 40440
            }
          ],
          "clusters": [
            {
              "id": "clu-18",
              "category": "reduced",
              "span": [
                39080,
                39900
              ],
              "cleanForms": [
                "probably saved",
                "probly saved",
                "probably save",
                "properly saved"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'probably' → 'prob'ly' /ˈprɑːbli/ — âm tiết 'ab' bị nuốt khi nói nhanh.",
                "en": "'probably' → 'prob'ly' /ˈprɑːbli/ — the syllable 'ab' is swallowed in fast speech."
              }
            }
          ]
        },
        {
          "id": "sent-13",
          "text": "And my existence, while grotesque and incomprehensible to you, saves lives.",
          "startMs": 40680,
          "endMs": 46080,
          "words": [
            {
              "w": "And",
              "s": 40680,
              "e": 40820
            },
            {
              "w": "my",
              "s": 40820,
              "e": 41100
            },
            {
              "w": "existence,",
              "s": 41100,
              "e": 41560
            },
            {
              "w": "while",
              "s": 41680,
              "e": 41840
            },
            {
              "w": "grotesque",
              "s": 41840,
              "e": 42640
            },
            {
              "w": "and",
              "s": 42640,
              "e": 42880
            },
            {
              "w": "incomprehensible",
              "s": 42880,
              "e": 43820
            },
            {
              "w": "to",
              "s": 43820,
              "e": 44240
            },
            {
              "w": "you,",
              "s": 44240,
              "e": 44640
            },
            {
              "w": "saves",
              "s": 44840,
              "e": 45320
            },
            {
              "w": "lives.",
              "s": 45320,
              "e": 46080
            }
          ],
          "clusters": [
            {
              "id": "clu-19",
              "category": "reduced",
              "span": [
                40680,
                41100
              ],
              "cleanForms": [
                "And my",
                "An my",
                "And mine",
                "And may"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'And‿my' → /ənˈmaɪ/ — 'and' không nhấn thành /ən/, dính vào 'my' thành 'n-my'.",
                "en": "'And‿my' → /ənˈmaɪ/ — unstressed 'and' reduces to /ən/ and fuses with 'my' into 'n-my'."
              }
            },
            {
              "id": "clu-20",
              "category": "reduced",
              "span": [
                43820,
                44640
              ],
              "cleanForms": [
                "to you",
                "to ya",
                "too you",
                "to your"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'to‿you' → /təˈjuː/ — 'to' không nhấn chỉ còn /tə/, dính vào 'you' thành 't'ya'.",
                "en": "'to‿you' → /təˈjuː/ — unstressed 'to' reduces to /tə/ and fuses with 'you' into 't'ya'."
              }
            }
          ]
        },
        {
          "id": "sent-14",
          "text": "You don't want the truth because deep down in places you don't talk about at parties.",
          "startMs": 46700,
          "endMs": 50560,
          "words": [
            {
              "w": "You",
              "s": 46700,
              "e": 46860
            },
            {
              "w": "don't",
              "s": 46860,
              "e": 47020
            },
            {
              "w": "want",
              "s": 47020,
              "e": 47140
            },
            {
              "w": "the",
              "s": 47140,
              "e": 47360
            },
            {
              "w": "truth",
              "s": 47360,
              "e": 47500
            },
            {
              "w": "because",
              "s": 47500,
              "e": 47800
            },
            {
              "w": "deep",
              "s": 47800,
              "e": 48120
            },
            {
              "w": "down",
              "s": 48120,
              "e": 48340
            },
            {
              "w": "in",
              "s": 48340,
              "e": 48600
            },
            {
              "w": "places",
              "s": 48600,
              "e": 48840
            },
            {
              "w": "you",
              "s": 48840,
              "e": 49040
            },
            {
              "w": "don't",
              "s": 49040,
              "e": 49260
            },
            {
              "w": "talk",
              "s": 49260,
              "e": 49620
            },
            {
              "w": "about",
              "s": 49620,
              "e": 49880
            },
            {
              "w": "at",
              "s": 49880,
              "e": 50120
            },
            {
              "w": "parties.",
              "s": 50120,
              "e": 50560
            }
          ],
          "clusters": [
            {
              "id": "clu-21",
              "category": "reduced",
              "span": [
                46860,
                47360
              ],
              "cleanForms": [
                "don't want the",
                "don't wanted the",
                "doesn't want the",
                "don't want to"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'don't want' → /ˈdoʊn wɑːn/ — 'dunwant': /t/ của 'don't' + /t/ của 'want' đều bay mất.",
                "en": "'don't want' → /ˈdoʊn wɑːn/ — 'dunwant': the /t/ of both words disappears."
              }
            },
            {
              "id": "clu-22",
              "category": "assimilation",
              "span": [
                49620,
                50120
              ],
              "cleanForms": [
                "about at",
                "about it",
                "about that",
                "about as"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'about‿at' → /əˈbaʊɾæt/ — /t/ giữa hai nguyên âm thành flap, hai từ dính như 'abou-dat'.",
                "en": "'about‿at' → /əˈbaʊɾæt/ — the /t/ between vowels flaps, and the words fuse as 'abou-dat'."
              }
            }
          ]
        },
        {
          "id": "sent-15",
          "text": "You want me on that wall. You need me on that wall.",
          "startMs": 50960,
          "endMs": 54900,
          "words": [
            {
              "w": "You",
              "s": 50960,
              "e": 51260
            },
            {
              "w": "want",
              "s": 51260,
              "e": 51560
            },
            {
              "w": "me",
              "s": 51560,
              "e": 51840
            },
            {
              "w": "on",
              "s": 51840,
              "e": 52040
            },
            {
              "w": "that",
              "s": 52040,
              "e": 52380
            },
            {
              "w": "wall.",
              "s": 52380,
              "e": 52660
            },
            {
              "w": "You",
              "s": 53000,
              "e": 53340
            },
            {
              "w": "need",
              "s": 53340,
              "e": 53680
            },
            {
              "w": "me",
              "s": 53680,
              "e": 54000
            },
            {
              "w": "on",
              "s": 54000,
              "e": 54160
            },
            {
              "w": "that",
              "s": 54160,
              "e": 54540
            },
            {
              "w": "wall.",
              "s": 54540,
              "e": 54900
            }
          ],
          "clusters": [
            {
              "id": "clu-23",
              "category": "elision",
              "span": [
                51260,
                51840
              ],
              "cleanForms": [
                "want me",
                "wanted me",
                "want my",
                "wants me"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'want‿me' → /ˈwɑːnˈmiː/ — âm /t/ cuối 'want' bị bỏ trước /m/, nghe như 'wan-me'.",
                "en": "'want‿me' → /ˈwɑːnˈmiː/ — the final /t/ of 'want' drops before /m/, heard as 'wan-me'."
              }
            },
            {
              "id": "clu-24",
              "category": "linking",
              "span": [
                52040,
                52660
              ],
              "cleanForms": [
                "on that",
                "on the",
                "on at",
                "on this"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'on‿that' → /ɑːnˈðæt/ — /n/ cuối 'on' dính vào phụ âm đầu 'that', hai từ thành một nhịp.",
                "en": "'on‿that' → /ɑːnˈðæt/ — the /n/ of 'on' fuses with the onset of 'that', one beat for two words."
              }
            }
          ]
        },
        {
          "id": "sent-16",
          "text": "We use words like honor, code, loyalty.",
          "startMs": 55700,
          "endMs": 58680,
          "words": [
            {
              "w": "We",
              "s": 55700,
              "e": 56220
            },
            {
              "w": "use",
              "s": 56220,
              "e": 56580
            },
            {
              "w": "words",
              "s": 56580,
              "e": 56900
            },
            {
              "w": "like",
              "s": 56900,
              "e": 57240
            },
            {
              "w": "honor,",
              "s": 57240,
              "e": 58020
            },
            {
              "w": "code,",
              "s": 58280,
              "e": 58680
            }
          ],
          "clusters": [
            {
              "id": "clu-25",
              "category": "linking",
              "span": [
                56580,
                57240
              ],
              "cleanForms": [
                "words like",
                "word like",
                "words likes",
                "words alike"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'words‿like' → /ˈwɜːrdzlaɪk/ — /z/ + /l/ dính nhau, không có khoảng nghỉ giữa hai từ.",
                "en": "'words‿like' → /ˈwɜːrdzlaɪk/ — /z/ + /l/ fuse with no gap between the words."
              }
            }
          ]
        },
        {
          "id": "sent-17",
          "text": "We use these words as the backbone of a life spent defending something. You use them as a punchline.",
          "startMs": 60640,
          "endMs": 65920,
          "words": [
            {
              "w": "We",
              "s": 60640,
              "e": 60780
            },
            {
              "w": "use",
              "s": 60780,
              "e": 61020
            },
            {
              "w": "these",
              "s": 61020,
              "e": 61340
            },
            {
              "w": "words",
              "s": 61340,
              "e": 61520
            },
            {
              "w": "as",
              "s": 61520,
              "e": 61680
            },
            {
              "w": "the",
              "s": 61680,
              "e": 61880
            },
            {
              "w": "backbone",
              "s": 61880,
              "e": 62260
            },
            {
              "w": "of",
              "s": 62260,
              "e": 62440
            },
            {
              "w": "a",
              "s": 62440,
              "e": 62560
            },
            {
              "w": "life",
              "s": 62560,
              "e": 62760
            },
            {
              "w": "spent",
              "s": 62760,
              "e": 63100
            },
            {
              "w": "defending",
              "s": 63100,
              "e": 63580
            },
            {
              "w": "something.",
              "s": 63580,
              "e": 64060
            },
            {
              "w": "You",
              "s": 64380,
              "e": 64560
            },
            {
              "w": "use",
              "s": 64560,
              "e": 64780
            },
            {
              "w": "them",
              "s": 64780,
              "e": 64920
            },
            {
              "w": "as",
              "s": 64920,
              "e": 65140
            },
            {
              "w": "a",
              "s": 65140,
              "e": 65300
            },
            {
              "w": "punchline.",
              "s": 65300,
              "e": 65920
            }
          ],
          "clusters": [
            {
              "id": "clu-26",
              "category": "liaison",
              "span": [
                61880,
                62560
              ],
              "cleanForms": [
                "backbone of a",
                "backbone of the",
                "back bone of a",
                "backbone off a"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'backbone‿of‿a' → /ˈbækboʊnəvə/ — ba từ nối thành một chuỗi âm /n/ + /əv/ + /ə/.",
                "en": "'backbone‿of‿a' → /ˈbækboʊnəvə/ — three words chain into one sound stream /n/ + /əv/ + /ə/."
              }
            },
            {
              "id": "clu-27",
              "category": "elision",
              "span": [
                64560,
                64920
              ],
              "cleanForms": [
                "use them",
                "use em",
                "used them",
                "use they"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'them' → /əm/ ('em') — âm /ð/ biến mất hoàn toàn trong lời nói tự nhiên.",
                "en": "'them' → /əm/ ('em') — the /ð/ disappears completely in natural speech."
              }
            }
          ]
        },
        {
          "id": "sent-18",
          "text": "I have neither the time nor the inclination to explain myself to a man who rises and sleeps under the blanket of the very freedom that I provide, and then questions the manner in which I provide it.",
          "startMs": 66380,
          "endMs": 77280,
          "words": [
            {
              "w": "I",
              "s": 66380,
              "e": 66520
            },
            {
              "w": "have",
              "s": 66520,
              "e": 66740
            },
            {
              "w": "neither",
              "s": 66740,
              "e": 66960
            },
            {
              "w": "the",
              "s": 66960,
              "e": 67320
            },
            {
              "w": "time",
              "s": 67320,
              "e": 67740
            },
            {
              "w": "nor",
              "s": 67740,
              "e": 67980
            },
            {
              "w": "the",
              "s": 67980,
              "e": 68300
            },
            {
              "w": "inclination",
              "s": 68300,
              "e": 68760
            },
            {
              "w": "to",
              "s": 68760,
              "e": 69000
            },
            {
              "w": "explain",
              "s": 69000,
              "e": 69460
            },
            {
              "w": "myself",
              "s": 69460,
              "e": 70040
            },
            {
              "w": "to",
              "s": 70040,
              "e": 70420
            },
            {
              "w": "a",
              "s": 70420,
              "e": 70580
            },
            {
              "w": "man",
              "s": 70580,
              "e": 70720
            },
            {
              "w": "who",
              "s": 70720,
              "e": 70940
            },
            {
              "w": "rises",
              "s": 70940,
              "e": 71240
            },
            {
              "w": "and",
              "s": 71240,
              "e": 71660
            },
            {
              "w": "sleeps",
              "s": 71660,
              "e": 71960
            },
            {
              "w": "under",
              "s": 71960,
              "e": 72340
            },
            {
              "w": "the",
              "s": 72340,
              "e": 72580
            },
            {
              "w": "blanket",
              "s": 72580,
              "e": 72800
            },
            {
              "w": "of",
              "s": 72800,
              "e": 73000
            },
            {
              "w": "the",
              "s": 73000,
              "e": 73140
            },
            {
              "w": "very",
              "s": 73140,
              "e": 73380
            },
            {
              "w": "freedom",
              "s": 73380,
              "e": 73580
            },
            {
              "w": "that",
              "s": 73580,
              "e": 73760
            },
            {
              "w": "I",
              "s": 73760,
              "e": 73980
            },
            {
              "w": "provide",
              "s": 73980,
              "e": 74400
            },
            {
              "w": "and",
              "s": 74400,
              "e": 74740
            },
            {
              "w": "then",
              "s": 74740,
              "e": 75000
            },
            {
              "w": "questions",
              "s": 75000,
              "e": 75360
            },
            {
              "w": "the",
              "s": 75360,
              "e": 75640
            },
            {
              "w": "manner",
              "s": 75640,
              "e": 75860
            },
            {
              "w": "in",
              "s": 75860,
              "e": 76180
            },
            {
              "w": "which",
              "s": 76180,
              "e": 76360
            },
            {
              "w": "I",
              "s": 76360,
              "e": 76720
            },
            {
              "w": "provide",
              "s": 76720,
              "e": 77020
            },
            {
              "w": "it.",
              "s": 77020,
              "e": 77280
            }
          ],
          "clusters": [
            {
              "id": "clu-28",
              "category": "reduced",
              "span": [
                70040,
                70720
              ],
              "cleanForms": [
                "to a man",
                "to the man",
                "too a man",
                "to a men"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'to‿a' → /tə/ — 'to' + 'a' gộp thành 'tuh', rồi dính vào 'man'.",
                "en": "'to‿a' → /tə/ — 'to' + 'a' collapse into 'tuh', then fuse with 'man'."
              }
            },
            {
              "id": "clu-29",
              "category": "assimilation",
              "span": [
                73580,
                73980
              ],
              "cleanForms": [
                "that I",
                "that a",
                "than I",
                "that my"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'that‿I' → /ðæˈtaɪ/ — /t/ giữa hai nguyên âm thành flap, nghe như 'that-I' một cụm.",
                "en": "'that‿I' → /ðæˈtaɪ/ — the /t/ between vowels flaps, heard as one chunk 'that-I'."
              }
            },
            {
              "id": "clu-30",
              "category": "reduced",
              "span": [
                74400,
                75000
              ],
              "cleanForms": [
                "and then",
                "an then",
                "and than",
                "and them"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'and‿then' → /ənˈðɛn/ — 'and' không nhấn chỉ còn /n/, dính vào 'then'.",
                "en": "'and‿then' → /ənˈðɛn/ — unstressed 'and' reduces to just /n/ and fuses with 'then'."
              }
            }
          ]
        },
        {
          "id": "sent-19",
          "text": "I would rather you just said thank you and went on your way.",
          "startMs": 77420,
          "endMs": 80540,
          "words": [
            {
              "w": "I",
              "s": 77420,
              "e": 77600
            },
            {
              "w": "would",
              "s": 77600,
              "e": 77780
            },
            {
              "w": "rather",
              "s": 77780,
              "e": 77960
            },
            {
              "w": "you",
              "s": 77960,
              "e": 78180
            },
            {
              "w": "just",
              "s": 78180,
              "e": 78440
            },
            {
              "w": "said",
              "s": 78440,
              "e": 78600
            },
            {
              "w": "thank",
              "s": 78600,
              "e": 78980
            },
            {
              "w": "you",
              "s": 78980,
              "e": 79320
            },
            {
              "w": "and",
              "s": 79320,
              "e": 79520
            },
            {
              "w": "went",
              "s": 79520,
              "e": 79720
            },
            {
              "w": "on",
              "s": 79720,
              "e": 79940
            },
            {
              "w": "your",
              "s": 79940,
              "e": 80180
            },
            {
              "w": "way.",
              "s": 80180,
              "e": 80540
            }
          ],
          "clusters": [
            {
              "id": "clu-31",
              "category": "elision",
              "span": [
                78180,
                78600
              ],
              "cleanForms": [
                "just said",
                "just say",
                "just says",
                "only said"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'just‿said' → /dʒʌsˈsɛd/ — âm /t/ của 'just' bị bỏ trước /s/, chỉ còn 'jus-said'.",
                "en": "'just‿said' → /dʒʌsˈsɛd/ — the /t/ of 'just' drops before /s/, leaving 'jus-said'."
              }
            },
            {
              "id": "clu-32",
              "category": "assimilation",
              "span": [
                78600,
                79320
              ],
              "cleanForms": [
                "thank you",
                "thank ya",
                "thanks you",
                "thank your"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'thank‿you' → /ˈθæŋkjuː/ — /k/ + /j/ dính liền, hai từ thành 'thankyou' một nhịp.",
                "en": "'thank‿you' → /ˈθæŋkjuː/ — /k/ + /j/ fuse, and the two words become one beat 'thankyou'."
              }
            }
          ]
        },
        {
          "id": "sent-20",
          "text": "Otherwise, I suggest you pick up a weapon and stand a post.",
          "startMs": 80720,
          "endMs": 84280,
          "words": [
            {
              "w": "Otherwise,",
              "s": 80720,
              "e": 81160
            },
            {
              "w": "I",
              "s": 81280,
              "e": 81460
            },
            {
              "w": "suggest",
              "s": 81460,
              "e": 81780
            },
            {
              "w": "you",
              "s": 81780,
              "e": 82000
            },
            {
              "w": "pick",
              "s": 82000,
              "e": 82200
            },
            {
              "w": "up",
              "s": 82200,
              "e": 82400
            },
            {
              "w": "a",
              "s": 82400,
              "e": 82560
            },
            {
              "w": "weapon",
              "s": 82560,
              "e": 82860
            },
            {
              "w": "and",
              "s": 82860,
              "e": 83360
            },
            {
              "w": "stand",
              "s": 83360,
              "e": 83700
            },
            {
              "w": "a",
              "s": 83700,
              "e": 83920
            },
            {
              "w": "post.",
              "s": 83920,
              "e": 84280
            }
          ],
          "clusters": [
            {
              "id": "clu-33",
              "category": "liaison",
              "span": [
                82000,
                82560
              ],
              "cleanForms": [
                "pick up a",
                "pick up the",
                "picks up a",
                "pick up an"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'pick‿up‿a' → /ˈpɪkʌpə/ — ba từ thành 'pick-uppa', /k/ + /ʌ/ + /p/ + /ə/ dính liền.",
                "en": "'pick‿up‿a' → /ˈpɪkʌpə/ — three words become 'pick-uppa', /k/ + /ʌ/ + /p/ + /ə/ fused."
              }
            },
            {
              "id": "clu-34",
              "category": "linking",
              "span": [
                83360,
                84280
              ],
              "cleanForms": [
                "stand a post",
                "stand the post",
                "stands a post",
                "stand a post office"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'stand‿a‿post' → /ˈstændəˈpoʊst/ — 'a' bị kẹp giữa hai từ và gộp, nghe như 'stan-də-post'.",
                "en": "'stand‿a‿post' → /ˈstændəˈpoʊst/ — the squeezed 'a' merges with its neighbours, heard as 'stan-də-post'."
              }
            }
          ]
        },
        {
          "id": "sent-21",
          "text": "Either way, I don't give a damn what you think you are entitled to!",
          "startMs": 84280,
          "endMs": 89320,
          "words": [
            {
              "w": "Either",
              "s": 84280,
              "e": 85120
            },
            {
              "w": "way,",
              "s": 85120,
              "e": 85540
            },
            {
              "w": "I",
              "s": 85740,
              "e": 85900
            },
            {
              "w": "don't",
              "s": 85900,
              "e": 86200
            },
            {
              "w": "give",
              "s": 86200,
              "e": 86340
            },
            {
              "w": "a",
              "s": 86340,
              "e": 86600
            },
            {
              "w": "damn",
              "s": 86600,
              "e": 86980
            },
            {
              "w": "what",
              "s": 86980,
              "e": 87460
            },
            {
              "w": "you",
              "s": 87460,
              "e": 87740
            },
            {
              "w": "think",
              "s": 87740,
              "e": 87960
            },
            {
              "w": "you",
              "s": 87960,
              "e": 88180
            },
            {
              "w": "are",
              "s": 88180,
              "e": 88400
            },
            {
              "w": "entitled",
              "s": 88400,
              "e": 88940
            },
            {
              "w": "to!",
              "s": 88940,
              "e": 89320
            }
          ],
          "clusters": [
            {
              "id": "clu-35",
              "category": "elision",
              "span": [
                85900,
                86340
              ],
              "cleanForms": [
                "don't give",
                "don't gave",
                "doesn't give",
                "dont give"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'don't‿give' → /ˈdoʊnˈɡɪv/ — âm /t/ biến mất trước /ɡ/, nghe như 'don-give'.",
                "en": "'don't‿give' → /ˈdoʊnˈɡɪv/ — the /t/ vanishes before /ɡ/, heard as 'don-give'."
              }
            },
            {
              "id": "clu-36",
              "category": "assimilation",
              "span": [
                86980,
                87740
              ],
              "cleanForms": [
                "what you",
                "what ya",
                "what your",
                "what youth"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'what‿you' → /ˈwʌtʃə/ — 'whatcha': /t/ + /j/ đồng hoá thành /tʃ/.",
                "en": "'what‿you' → /ˈwʌtʃə/ — 'whatcha': /t/ + /j/ assimilate into /tʃ/."
              }
            }
          ]
        }
      ]
    },
    {
      "id": "clip-gtalive-01",
      "caseId": "case-boss-stream",
      "videoId": "sh-64G5jlic",
      "youtubeUrl": "https://www.youtube.com/watch?v=sh-64G5jlic&t=134s",
      "startOffsetMs": 134000,
      "title": "GTA stream — who is the mole?",
      "durationSec": 42.0,
      "level": 5,
      "category": "stream",
      "gistQuestion": {
        "prompt": {
          "vi": "Cuộc stream đang nghi ngờ điều gì?",
          "en": "What suspicion is being discussed on the stream?"
        },
        "choices": [
          {
            "vi": "Ai là 'nội gián' — liệu có phải anh nhân viên nhận hành lý",
            "en": "Who the 'mole' is — maybe the baggage claim guy"
          },
          {
            "vi": "Game nào sẽ ra mắt vào tuần sau",
            "en": "Which game launches next week"
          },
          {
            "vi": "Ai sẽ thắng trận đấu tối nay",
            "en": "Who will win tonight's match"
          },
          {
            "vi": "Giá vé sự kiện là bao nhiêu",
            "en": "How much the event tickets cost"
          }
        ],
        "answerIndex": 0
      },
      "comprehension": [
        {
          "prompt": {
            "vi": "Người streamer đùa rằng 'nội gián' là ai?",
            "en": "Who does the streamer joke is the 'mole'?"
          },
          "choices": [
            {
              "vi": "Anh nhân viên nhận hành lý",
              "en": "The baggage claim guy"
            },
            {
              "vi": "Bạn cùng phòng của anh ấy",
              "en": "His roommate"
            },
            {
              "vi": "Người lái xe tải",
              "en": "The truck driver"
            },
            {
              "vi": "Cô phục vụ trong quán",
              "en": "The waitress"
            }
          ],
          "answerIndex": 0
        },
        {
          "prompt": {
            "vi": "Nếu nghi vấn đó là thật, phản ứng của anh ấy sẽ là gì?",
            "en": "If that suspicion were true, what would his reaction be?"
          },
          "choices": [
            {
              "vi": "Giận dữ và báo cảnh sát",
              "en": "Anger and calling the police"
            },
            {
              "vi": "Buồn bã cả ngày",
              "en": "Being sad all day"
            },
            {
              "vi": "Cười rất to — 'tôi sẽ cười lăn'",
              "en": "Laughing very hard — 'I would laugh so hard'"
            },
            {
              "vi": "Tắt stream ngay lập tức",
              "en": "Ending the stream immediately"
            }
          ],
          "answerIndex": 2
        },
        {
          "prompt": {
            "vi": "Cuộc hội thoại ở cuối đoạn nói về chủ đề gì?",
            "en": "What is the conversation at the end of the clip about?"
          },
          "choices": [
            {
              "vi": "Một cô gái Ý và chuyện đã 'có vợ' ở bữa tối",
              "en": "An Italian chick and being 'wifed up' at dinner"
            },
            {
              "vi": "Một đơn hàng bị giao nhầm",
              "en": "A wrongly delivered package"
            },
            {
              "vi": "Kế hoạch đi nghỉ mát",
              "en": "Holiday plans"
            },
            {
              "vi": "Giá xăng tăng",
              "en": "Rising gas prices"
            }
          ],
          "answerIndex": 0
        }
      ],
      "sentences": [
        {
          "id": "sent-01",
          "text": "…surprises on the… Oh my god. What if the mole is the — is the baggage claim guy?",
          "startMs": 970,
          "endMs": 5330,
          "words": [
            {
              "w": "He",
              "s": 970,
              "e": 1390
            },
            {
              "w": "surprises",
              "s": 1390,
              "e": 1770
            },
            {
              "w": "on",
              "s": 1770,
              "e": 2030
            },
            {
              "w": "oh",
              "s": 2030,
              "e": 2170
            },
            {
              "w": "my",
              "s": 2170,
              "e": 2370
            },
            {
              "w": "god.",
              "s": 2370,
              "e": 2470
            },
            {
              "w": "What",
              "s": 2470,
              "e": 2690
            },
            {
              "w": "if",
              "s": 2690,
              "e": 2870
            },
            {
              "w": "the",
              "s": 2870,
              "e": 3150
            },
            {
              "w": "mole",
              "s": 3150,
              "e": 3430
            },
            {
              "w": "is",
              "s": 3430,
              "e": 3910
            },
            {
              "w": "the",
              "s": 3910,
              "e": 4270
            },
            {
              "w": "is",
              "s": 4270,
              "e": 4330
            },
            {
              "w": "the",
              "s": 4330,
              "e": 4570
            },
            {
              "w": "baggage",
              "s": 4570,
              "e": 4810
            },
            {
              "w": "claim",
              "s": 4810,
              "e": 5010
            },
            {
              "w": "guy?",
              "s": 5010,
              "e": 5330
            }
          ],
          "clusters": [
            {
              "id": "clu-01",
              "category": "reduced",
              "span": [
                2470,
                3150
              ],
              "cleanForms": [
                "What if the",
                "What if",
                "What of the",
                "What if a"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'What‿if' → /wʌˈdɪf/ — /t/ giữa hai nguyên âm thành flap, 'what if' nghe như 'wha-dif'.",
                "en": "'What‿if' → /wʌˈdɪf/ — the /t/ between vowels flaps, and 'what if' sounds like 'wha-dif'."
              }
            },
            {
              "id": "clu-02",
              "category": "liaison",
              "span": [
                3150,
                4270
              ],
              "cleanForms": [
                "mole is the",
                "mole is a",
                "mole was the",
                "mole isn't the"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'mole‿is‿the' → /ˈmoʊlɪzˈðə/ — 'is' gộp thành /ɪz/ dính cả hai đầu, mất ranh giới từ.",
                "en": "'mole‿is‿the' → /ˈmoʊlɪzˈðə/ — 'is' reduces to /ɪz/ and glues both sides, erasing the boundary."
              }
            }
          ]
        },
        {
          "id": "sent-02",
          "text": "Dude, I would laugh so hard if the baggage claim guy is the rol—is the rat.",
          "startMs": 6870,
          "endMs": 12110,
          "words": [
            {
              "w": "Dude",
              "s": 6870,
              "e": 7430
            },
            {
              "w": "I",
              "s": 7430,
              "e": 7990
            },
            {
              "w": "would",
              "s": 7990,
              "e": 8250
            },
            {
              "w": "laugh",
              "s": 8250,
              "e": 8430
            },
            {
              "w": "so",
              "s": 8430,
              "e": 8710
            },
            {
              "w": "hard",
              "s": 8710,
              "e": 8810
            },
            {
              "w": "if",
              "s": 8810,
              "e": 9090
            },
            {
              "w": "the",
              "s": 9090,
              "e": 9690
            },
            {
              "w": "baggage",
              "s": 9690,
              "e": 9950
            },
            {
              "w": "claim",
              "s": 9950,
              "e": 10150
            },
            {
              "w": "guy",
              "s": 10150,
              "e": 10510
            },
            {
              "w": "is",
              "s": 10510,
              "e": 10810
            },
            {
              "w": "the",
              "s": 10810,
              "e": 11090
            },
            {
              "w": "rol—",
              "s": 11090,
              "e": 11310
            },
            {
              "w": "is",
              "s": 11310,
              "e": 11670
            },
            {
              "w": "the",
              "s": 11670,
              "e": 11830
            },
            {
              "w": "rat",
              "s": 11830,
              "e": 12110
            }
          ],
          "clusters": [
            {
              "id": "clu-03",
              "category": "reduced",
              "span": [
                7430,
                8250
              ],
              "cleanForms": [
                "I would",
                "I'd",
                "I will",
                "I would have"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'I would' → 'I'd' /aɪd/ — hai từ gộp thành một âm tiết, 'would' chỉ còn âm /d/.",
                "en": "'I would' → 'I'd' /aɪd/ — the two words collapse into one syllable, 'would' leaving only /d/."
              }
            },
            {
              "id": "clu-04",
              "category": "liaison",
              "span": [
                8810,
                9690
              ],
              "cleanForms": [
                "if the",
                "if a",
                "in the",
                "if their"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'if‿the' → /ɪˈðə/ — /f/ cuối 'if' dính vào /ð/ của 'the', hai từ thành 'if-the' một cụm.",
                "en": "'if‿the' → /ɪˈðə/ — the final /f/ of 'if' fuses with the /ð/ of 'the', one chunk 'if-the'."
              }
            }
          ]
        },
        {
          "id": "sent-03",
          "text": "Please, please let it be him.",
          "startMs": 17430,
          "endMs": 19300,
          "words": [
            {
              "w": "Please",
              "s": 17430,
              "e": 17990
            },
            {
              "w": "please",
              "s": 17990,
              "e": 18530
            },
            {
              "w": "let",
              "s": 18530,
              "e": 18650
            },
            {
              "w": "it",
              "s": 18650,
              "e": 18810
            },
            {
              "w": "be",
              "s": 18810,
              "e": 19010
            },
            {
              "w": "him.",
              "s": 19010,
              "e": 19300
            }
          ],
          "clusters": [
            {
              "id": "clu-05",
              "category": "assimilation",
              "span": [
                18530,
                19010
              ],
              "cleanForms": [
                "let it be",
                "let it be him",
                "lets it be",
                "let it been"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'let‿it‿be' → /ˈlɛɾɪbi/ — /t/ giữa hai nguyên âm thành flap, ba từ thành 'le-di-bee'.",
                "en": "'let‿it‿be' → /ˈlɛɾɪbi/ — the /t/ between vowels flaps, and three words become 'le-di-bee'."
              }
            }
          ]
        },
        {
          "id": "sent-04",
          "text": "…banging on metal at bitches like a few years ago. So? So I'm saying…",
          "startMs": 28690,
          "endMs": 34770,
          "words": [
            {
              "w": "Banging",
              "s": 28690,
              "e": 29250
            },
            {
              "w": "on",
              "s": 29250,
              "e": 29570
            },
            {
              "w": "metal",
              "s": 29570,
              "e": 29810
            },
            {
              "w": "at",
              "s": 29810,
              "e": 30010
            },
            {
              "w": "bitches",
              "s": 30010,
              "e": 30210
            },
            {
              "w": "like",
              "s": 30210,
              "e": 30570
            },
            {
              "w": "a",
              "s": 30570,
              "e": 30950
            },
            {
              "w": "few",
              "s": 30950,
              "e": 31090
            },
            {
              "w": "years",
              "s": 31090,
              "e": 31450
            },
            {
              "w": "ago,",
              "s": 31450,
              "e": 32110
            },
            {
              "w": "so",
              "s": 32210,
              "e": 32890
            },
            {
              "w": "so",
              "s": 32890,
              "e": 33690
            },
            {
              "w": "I'm",
              "s": 33690,
              "e": 34330
            },
            {
              "w": "saying",
              "s": 34330,
              "e": 34770
            }
          ],
          "clusters": [
            {
              "id": "clu-06",
              "category": "linking",
              "span": [
                28690,
                29570
              ],
              "cleanForms": [
                "Banging on",
                "Banging an",
                "Banged on",
                "Banging in"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'banging‿on' → /ˈbæŋɪnɑn/ — âm /g/ của đuôi -ng biến mất (g-dropping), /n/ nối vào 'on'.",
                "en": "'banging‿on' → /ˈbæŋɪnɑn/ — the /g/ of the -ng ending drops (g-dropping) and /n/ links into 'on'."
              }
            },
            {
              "id": "clu-07",
              "category": "liaison",
              "span": [
                33690,
                34770
              ],
              "cleanForms": [
                "I'm saying",
                "I saying",
                "I'm say",
                "I was saying"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'I'm‿saying' → /aɪmˈseɪɪŋ/ — 'I'm' dính vào 'saying', không có khoảng nghỉ giữa hai từ.",
                "en": "'I'm‿saying' → /aɪmˈseɪɪŋ/ — 'I'm' fuses with 'saying', no gap between the words."
              }
            }
          ]
        },
        {
          "id": "sent-05",
          "text": "What's up, man? What's going on with that Italian chick? I thought you were all wifed up at dinner the other night.",
          "startMs": 36690,
          "endMs": 41550,
          "words": [
            {
              "w": "What's",
              "s": 36690,
              "e": 37050
            },
            {
              "w": "up,",
              "s": 37050,
              "e": 37110
            },
            {
              "w": "man?",
              "s": 37350,
              "e": 37470
            },
            {
              "w": "What's",
              "s": 37730,
              "e": 37970
            },
            {
              "w": "going",
              "s": 37970,
              "e": 38090
            },
            {
              "w": "on",
              "s": 38090,
              "e": 38210
            },
            {
              "w": "with",
              "s": 38210,
              "e": 38330
            },
            {
              "w": "that",
              "s": 38330,
              "e": 38510
            },
            {
              "w": "Italian",
              "s": 38510,
              "e": 38890
            },
            {
              "w": "chick?",
              "s": 38890,
              "e": 39130
            },
            {
              "w": "I",
              "s": 39410,
              "e": 39510
            },
            {
              "w": "thought",
              "s": 39510,
              "e": 39630
            },
            {
              "w": "you",
              "s": 39630,
              "e": 39810
            },
            {
              "w": "were",
              "s": 39810,
              "e": 39950
            },
            {
              "w": "all",
              "s": 39950,
              "e": 40190
            },
            {
              "w": "wifed",
              "s": 40190,
              "e": 40530
            },
            {
              "w": "up",
              "s": 40530,
              "e": 40670
            },
            {
              "w": "at",
              "s": 40670,
              "e": 40810
            },
            {
              "w": "dinner",
              "s": 40810,
              "e": 40990
            },
            {
              "w": "the",
              "s": 40990,
              "e": 41170
            },
            {
              "w": "other",
              "s": 41170,
              "e": 41290
            },
            {
              "w": "night.",
              "s": 41290,
              "e": 41550
            }
          ],
          "clusters": [
            {
              "id": "clu-08",
              "category": "reduced",
              "span": [
                36690,
                37110
              ],
              "cleanForms": [
                "What's up",
                "What up",
                "What is up",
                "What's ups"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'What's‿up' → /ˈwʌˈsʌp/ — 'wassup': /t/ biến mất, hai từ gộp thành một âm.",
                "en": "'What's‿up' → /ˈwʌˈsʌp/ — 'wassup': the /t/ disappears and the two words fuse into one sound."
              }
            },
            {
              "id": "clu-09",
              "category": "linking",
              "span": [
                37970,
                38210
              ],
              "cleanForms": [
                "going on",
                "go on",
                "going in",
                "going an"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'going‿on' → /ˈɡoʊɪnɑn/ — âm /g/ của -ng biến mất (g-dropping), /n/ nối vào 'on'.",
                "en": "'going‿on' → /ˈɡoʊɪnɑn/ — the /g/ of the -ng ending drops (g-dropping) and /n/ links into 'on'."
              }
            },
            {
              "id": "clu-10",
              "category": "assimilation",
              "span": [
                39510,
                39810
              ],
              "cleanForms": [
                "thought you",
                "thought ya",
                "thought your",
                "thought youth"
              ],
              "answerIndex": 0,
              "note": {
                "vi": "'thought‿you' → /ˈθɔːtʃuː/ — 'thaw-chu': /t/ + /j/ đồng hoá thành /tʃ/.",
                "en": "'thought‿you' → /ˈθɔːtʃuː/ — 'thaw-chu': /t/ + /j/ assimilate into /tʃ/."
              }
            }
          ]
        }
      ]
    }
  ]
}
) satisfies SeedData;
