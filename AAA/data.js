// すべて一次公式データ（世界銀行・国連・WHO・ITU・Pew Research Center・Ethnologue）に基づく定義

const WORLD_DATA = {
  heroStats: [
    {
      label: "世界の総人口",
      value: "約83.0億人",
      sub: "2026年推計（UN WPP 2024）"
    },
    {
      label: "安全に管理された飲み水",
      value: "74人 / 100人",
      sub: "74%（2024年 WHO/UNICEF JMP）"
    },
    {
      label: "成人識字率（15歳以上）",
      value: "88人 / 100人",
      sub: "87.74%（2024年 UNESCO/WB）"
    },
    {
      label: "インターネット利用者",
      value: "76人 / 100人",
      sub: "76%（2026年 ITU）"
    },
    {
      label: "平均寿命（参考値）",
      value: "73.3歳",
      sub: "女性76.1歳 / 男性70.6歳（2023年 WHO）"
    }
  ],

  // 5歳階級（UN WPP 2024・2026年・世界合計 = 99.999% ≒ 100%）
  age5yr2026: [
    { min: 0, max: 4, label: "0〜4歳", pct: 7.739 },
    { min: 5, max: 9, label: "5〜9歳", pct: 8.042 },
    { min: 10, max: 14, label: "10〜14歳", pct: 8.304 },
    { min: 15, max: 19, label: "15〜19歳", pct: 8.027 },
    { min: 20, max: 24, label: "20〜24歳", pct: 7.578 },
    { min: 25, max: 29, label: "25〜29歳", pct: 7.294 },
    { min: 30, max: 34, label: "30〜34歳", pct: 7.174 },
    { min: 35, max: 39, label: "35〜39歳", pct: 7.285 },
    { min: 40, max: 44, label: "40〜44歳", pct: 6.673 },
    { min: 45, max: 49, label: "45〜49歳", pct: 5.919 },
    { min: 50, max: 54, label: "50〜54歳", pct: 5.574 },
    { min: 55, max: 59, label: "55〜59歳", pct: 5.213 },
    { min: 60, max: 64, label: "60〜64歳", pct: 4.573 },
    { min: 65, max: 69, label: "65〜69歳", pct: 3.564 },
    { min: 70, max: 74, label: "70〜74歳", pct: 2.933 },
    { min: 75, max: 79, label: "75〜79歳", pct: 2.012 },
    { min: 80, max: 84, label: "80〜84歳", pct: 1.142 },
    { min: 85, max: 89, label: "85〜89歳", pct: 0.634 },
    { min: 90, max: 94, label: "90〜94歳", pct: 0.250 },
    { min: 95, max: 99, label: "95〜99歳", pct: 0.061 },
    { min: 100, max: 150, label: "100歳以上", pct: 0.008 }
  ],

  // 100人グリッドで切り替えられるレンズ（合計100人に最大剰余法で配分）
  lenses: [
    {
      id: "region",
      title: "地域分布",
      year: "2026年",
      sourceName: "UN World Population Prospects 2024",
      sourceUrl: "https://population.un.org/wpp/",
      profileKey: "region",
      note: "オセアニアは0.57%（約0.6人）のため、合計100人の整数表示では最大剰余法により0人（1人未満）となります。",
      items: [
        { key: "asia", label: "アジア", count: 59, pct: 58.59, color: "#0f766e" },
        { key: "africa", label: "アフリカ", count: 19, pct: 19.09, color: "#d97706" },
        { key: "europe", label: "ヨーロッパ", count: 9, pct: 8.96, color: "#2563eb" },
        { key: "lac", label: "ラテンアメリカ・カリブ海", count: 8, pct: 8.10, color: "#7c3aed" },
        { key: "na", label: "北アメリカ（米国・カナダ等）", count: 5, pct: 4.69, color: "#db2777" },
        { key: "oceania", label: "オセアニア", count: 0, pct: 0.57, color: "#64748b", note: "約0.6人" }
      ]
    },
    {
      id: "age",
      title: "年齢構成",
      year: "2026年",
      sourceName: "UN World Population Prospects 2024",
      sourceUrl: "https://population.un.org/wpp/",
      profileKey: "ageGroup",
      note: "世界全体の中央年齢は31.1歳。65歳以上は10.60%（最大剰余法により10人表示）です。",
      items: [
        { key: "0-14", label: "0〜14歳（子ども）", count: 24, pct: 24.09, color: "#f59e0b" },
        { key: "15-24", label: "15〜24歳（若年層）", count: 16, pct: 15.61, color: "#10b981" },
        { key: "25-64", label: "25〜64歳（生産・成年層）", count: 50, pct: 49.70, color: "#0284c7" },
        { key: "65+", label: "65歳以上（高齢層）", count: 10, pct: 10.60, color: "#6366f1" }
      ]
    },
    {
      id: "sex",
      title: "性別",
      year: "2026年",
      sourceName: "UN World Population Prospects 2024",
      sourceUrl: "https://population.un.org/wpp/",
      profileKey: "sex",
      note: "UN WPP 2024の2026年推計は男性50.26%・女性49.74%です。",
      items: [
        { key: "male", label: "男性", count: 50, pct: 50.26, color: "#2563eb" },
        { key: "female", label: "女性", count: 50, pct: 49.74, color: "#db2777" }
      ]
    },
    {
      id: "urban",
      title: "都市・農村",
      year: "2025年",
      sourceName: "世界銀行 WDI (SP.URB.TOTL.IN.ZS)",
      sourceUrl: "https://api.worldbank.org/v2/country/WLD/indicator/SP.URB.TOTL.IN.ZS?format=json",
      profileKey: "urban",
      note: "世界人口の約6割近くが都市部に暮らしています。",
      items: [
        { key: "urban", label: "都市部", count: 58, pct: 57.83, color: "#0284c7" },
        { key: "rural", label: "農村部", count: 42, pct: 42.17, color: "#65a30d" }
      ]
    },
    {
      id: "income",
      title: "1日の生活費",
      year: "2024年",
      sourceName: "世界銀行 PIP (2021年PPP基準)",
      sourceUrl: "https://pip.worldbank.org/",
      profileKey: "incomeBracket",
      note: "物価差を調整した2021年PPP（購買力平価）米ドル基準。極度の貧困ライン（$3.00未満）は10.12%です。",
      items: [
        { key: "lt3", label: "$3.00未満 / 日（極度の貧困）", count: 10, pct: 10.12, color: "#dc2626" },
        { key: "3to8.3", label: "$3.00〜$8.30未満 / 日", count: 36, pct: 36.04, color: "#ea580c" },
        { key: "8.3to20", label: "$8.30〜$20.00未満 / 日", count: 26, pct: 26.23, color: "#eab308" },
        { key: "20to50", label: "$20.00〜$50.00未満 / 日", count: 17, pct: 16.50, color: "#16a34a" },
        { key: "ge50", label: "$50.00以上 / 日", count: 11, pct: 11.11, color: "#0f766e" }
      ]
    },
    {
      id: "water",
      title: "飲み水",
      year: "2024年",
      sourceName: "WHO/UNICEF JMP",
      sourceUrl: "https://www.who.int/news-room/fact-sheets/detail/drinking-water",
      profileKey: "water",
      note: "「基本的のみ（18人）」は改善水源から往復30分以内だが安全管理基準（敷地内・常時・汚染なし）を満たさない層、「基本未満（8人）」は30分超・未改善水源・表流水を含みます。",
      items: [
        { key: "safely_managed", label: "安全に管理された飲み水", count: 74, pct: 73.74, color: "#0284c7" },
        { key: "basic_only", label: "基本的な飲み水（安全管理外）", count: 18, pct: 17.73, color: "#38bdf8" },
        { key: "unimproved", label: "基本サービス未満（水不足・未改善等）", count: 8, pct: 8.53, color: "#94a3b8" }
      ]
    },
    {
      id: "sanitation",
      title: "衛生施設（トイレ）",
      year: "2024年",
      sourceName: "WHO / UNICEF JMP",
      sourceUrl: "https://www.who.int/news-room/fact-sheets/detail/sanitation",
      profileKey: "sanitation",
      note: "安全に管理された衛生施設（58.5%）と基本的衛生施設以上（82.0%）から3区分で表示しています。",
      items: [
        { key: "safely_managed", label: "安全に管理された衛生施設", count: 58, pct: 58.50, color: "#0f766e" },
        { key: "basic_only", label: "基本的な衛生施設（安全管理外）", count: 24, pct: 23.51, color: "#34d399" },
        { key: "below_basic", label: "基本サービス未満（共用・未改善・野外等）", count: 18, pct: 17.99, color: "#a8a29e" }
      ]
    },
    {
      id: "literacy",
      title: "読み書き（成人）",
      year: "2024年",
      sourceName: "UNESCO UIS / 世界銀行 WDI",
      sourceUrl: "https://api.worldbank.org/v2/country/WLD/indicator/SE.ADT.LITR.ZS?format=json",
      profileKey: "literacy",
      note: "15歳以上の成人識字率（87.74%）に基づきます。",
      items: [
        { key: "literate", label: "読み書きができる", count: 88, pct: 87.74, color: "#0f766e" },
        { key: "illiterate", label: "読み書きが難しい・できない", count: 12, pct: 12.26, color: "#94a3b8" }
      ]
    },
    {
      id: "internet",
      title: "インターネット",
      year: "2026年",
      sourceName: "ITU Facts and Figures 2026",
      sourceUrl: "https://www.itu.int/en/ITU-D/Statistics/Pages/facts/default.aspx",
      profileKey: "internet",
      note: "世界人口の約4分の3以上がオンライン（約63億人）ですが、約20億人（24人）は依然オフラインです。",
      items: [
        { key: "online", label: "インターネットを利用", count: 76, pct: 76.0, color: "#2563eb" },
        { key: "offline", label: "インターネット未利用", count: 24, pct: 24.0, color: "#cbd5e1" }
      ]
    },
    {
      id: "electricity",
      title: "電力アクセス",
      year: "2024年",
      sourceName: "世界銀行 WDI (EG.ELC.ACCS.ZS)",
      sourceUrl: "https://api.worldbank.org/v2/country/WLD/indicator/EG.ELC.ACCS.ZS?format=json",
      profileKey: "electricity",
      note: "約92人が電気を利用できる一方、約8人は電気のない暮らしをしています。",
      items: [
        { key: "access", label: "電気が利用できる", count: 92, pct: 91.93, color: "#eab308" },
        { key: "no_access", label: "電気が利用できない", count: 8, pct: 8.07, color: "#64748b" }
      ]
    },
    {
      id: "religion",
      title: "宗教",
      year: "2020年",
      sourceName: "Pew Research Center (2025年公表)",
      sourceUrl: "https://www.pewresearch.org/religion/2025/06/09/how-the-global-religious-landscape-changed-from-2010-to-2020/",
      profileKey: "religion",
      note: "Pewの最新世界調査の確定基準年は2020年です。ユダヤ教は0.2%（1,000人あたり約2人）のため、100人整数では0人となります。",
      items: [
        { key: "christian", label: "キリスト教", count: 29, pct: 28.8, color: "#2563eb" },
        { key: "muslim", label: "イスラム教", count: 26, pct: 25.6, color: "#16a34a" },
        { key: "unaffiliated", label: "無宗教（特定の宗教に属さない）", count: 24, pct: 24.2, color: "#64748b" },
        { key: "hindu", label: "ヒンドゥー教", count: 15, pct: 14.9, color: "#ea580c" },
        { key: "buddhist", label: "仏教", count: 4, pct: 4.1, color: "#eab308" },
        { key: "other", label: "その他の宗教（神道・民間信仰等）", count: 2, pct: 2.2, color: "#7c3aed" },
        { key: "jewish", label: "ユダヤ教", count: 0, pct: 0.2, color: "#0ea5e9", note: "約0.2人" }
      ]
    }
  ],

  // Ethnologue 2026（無料公開範囲のみ）
  ethnologueTop10L1L2: [
    { key: "eng", name: "英語", speakers: 1493000000, pct: 17.99, people: 18 },
    { key: "cmn", name: "中国語（北京官話）", speakers: 1183000000, pct: 14.25, people: 14 },
    { key: "hin", name: "ヒンディー語", speakers: 611000000, pct: 7.36, people: 7 },
    { key: "spa", name: "スペイン語", speakers: 561000000, pct: 6.76, people: 7 },
    { key: "arb", name: "標準アラビア語", speakers: 335000000, pct: 4.04, people: 4 },
    { key: "fra", name: "フランス語", speakers: 334000000, pct: 4.02, people: 4 },
    { key: "ben", name: "ベンガル語", speakers: 274000000, pct: 3.30, people: 3 },
    { key: "por", name: "ポルトガル語", speakers: 269000000, pct: 3.24, people: 3 },
    { key: "ind", name: "インドネシア語", speakers: 255000000, pct: 3.07, people: 3 },
    { key: "urd", name: "ウルドゥー語", speakers: 246000000, pct: 2.96, people: 3 }
  ],

  // テーマ別詳細カード
  themeCards: [
    {
      icon: "🌍",
      title: "人口・地域・世代",
      year: "2026年 / 2025年",
      rows: [
        { label: "アジア", val: "59人 (58.59%)", pct: 58.59, color: "#0f766e" },
        { label: "アフリカ", val: "19人 (19.09%)", pct: 19.09, color: "#d97706" },
        { label: "ヨーロッパ", val: "9人 (8.96%)", pct: 8.96, color: "#2563eb" },
        { label: "ラテンアメリカ・カリブ海", val: "8人 (8.10%)", pct: 8.10, color: "#7c3aed" },
        { label: "北アメリカ", val: "5人 (4.69%)", pct: 4.69, color: "#db2777" },
        { label: "オセアニア", val: "約0.6人 (0.57%)", pct: 0.57, color: "#64748b" },
        { label: "都市部居住（2025年）", val: "58人 (57.83%)", pct: 57.83, color: "#0284c7" }
      ],
      note: "性別は男性50人(50.26%)・女性50人(49.74%)。0〜14歳が24人、65歳以上が11人（10.60%）で、世界の中央年齢は31.1歳です。",
      sourceText: "UN World Population Prospects 2024 / 世界銀行 WDI",
      sourceUrl: "https://population.un.org/wpp/"
    },
    {
      icon: "💰",
      title: "所得・1日の生活費（2021年PPP基準）",
      year: "2024年",
      rows: [
        { label: "1日 $3.00未満（極度の貧困）", val: "10人 (10.12%)", pct: 10.12, color: "#dc2626" },
        { label: "1日 $3.00〜$8.30未満", val: "36人 (36.04%)", pct: 36.04, color: "#ea580c" },
        { label: "1日 $8.30〜$20.00未満", val: "26人 (26.23%)", pct: 26.23, color: "#eab308" },
        { label: "1日 $20.00〜$50.00未満", val: "17人 (16.50%)", pct: 16.50, color: "#16a34a" },
        { label: "1日 $50.00以上", val: "11人 (11.11%)", pct: 11.11, color: "#0f766e" }
      ],
      note: "世界全体で1日$8.30未満（高中所得国の貧困ライン）で暮らす人は約46人（46.16%）、1日$10未満は約53人（52.87%）です。",
      sourceText: "世界銀行 Poverty and Inequality Platform (PIP)",
      sourceUrl: "https://pip.worldbank.org/"
    },
    {
      icon: "💧",
      title: "健康・水・栄養",
      year: "2024年 / 2023年",
      rows: [
        { label: "安全に管理された飲み水", val: "74人 (74%)", pct: 74, color: "#0284c7" },
        { label: "少なくとも基本的な飲み水", val: "91人 (91.47%)", pct: 91.47, color: "#38bdf8" },
        { label: "安全に管理された衛生施設", val: "58人 (58.50%)", pct: 58.50, color: "#0f766e" },
        { label: "成人の過体重（18歳以上）", val: "45人 (45%)", pct: 45, color: "#f59e0b" },
        { label: "全人口の肥満（約7人に1人）", val: "14人 (約14%)", pct: 14, color: "#ea580c" },
        { label: "慢性的な栄養不足人口", val: "8人 (8.1%)", pct: 8.1, color: "#dc2626" }
      ],
      note: "平均寿命は73.3歳（女性76.1歳・男性70.6歳、WHO 2023年）。100人中約9人（8.53%）は基本的な飲み水サービスすら利用できていません。",
      sourceText: "WHO Fact Sheets / WHO GHO / 世界銀行 WDI",
      sourceUrl: "https://www.who.int/news-room/fact-sheets/detail/drinking-water"
    },
    {
      icon: "📚",
      title: "教育・情報・電力",
      year: "2026年 / 2024年",
      rows: [
        { label: "電力アクセス（2024年）", val: "92人 (91.93%)", pct: 91.93, color: "#eab308" },
        { label: "初等教育修了率（2024年）", val: "88人 (88.02%)", pct: 88.02, color: "#10b981" },
        { label: "成人識字率 15歳以上（2024年）", val: "88人 (87.74%)", pct: 87.74, color: "#0f766e" },
        { label: "インターネット利用（2026年）", val: "76人 (76%)", pct: 76, color: "#2563eb" },
        { label: "高等教育総就学率（2024年）", val: "44人 (43.62%)", pct: 43.62, color: "#6366f1" }
      ],
      note: "15歳以上で読み書きができない人は約12人（12.26%）、インターネット未利用者は約24人（約20億人）います。",
      sourceText: "ITU Facts & Figures 2026 / 世界銀行 WDI (UNESCO UIS)",
      sourceUrl: "https://www.itu.int/en/ITU-D/Statistics/Pages/facts/default.aspx"
    },
    {
      icon: "🕊️",
      title: "宗教",
      year: "2020年",
      rows: [
        { label: "キリスト教", val: "29人 (28.8%)", pct: 28.8, color: "#2563eb" },
        { label: "イスラム教", val: "26人 (25.6%)", pct: 25.6, color: "#16a34a" },
        { label: "無宗教（特定の宗教なし）", val: "24人 (24.2%)", pct: 24.2, color: "#64748b" },
        { label: "ヒンドゥー教", val: "15人 (14.9%)", pct: 14.9, color: "#ea580c" },
        { label: "仏教", val: "4人 (4.1%)", pct: 4.1, color: "#eab308" },
        { label: "その他の宗教", val: "2人 (2.2%)", pct: 2.2, color: "#7c3aed" },
        { label: "ユダヤ教", val: "約0.2人 (0.2%)", pct: 0.2, color: "#0ea5e9" }
      ],
      note: "2025年6月公表のPew Research Centerレポートによる最新確定値（2020年基準）。神道・道教・シク教・民間信仰等は「その他の宗教」に含まれます。",
      sourceText: "Pew Research Center (2025)",
      sourceUrl: "https://www.pewresearch.org/religion/2025/06/09/how-the-global-religious-landscape-changed-from-2010-to-2020/"
    },
    {
      icon: "🗣️",
      title: "言語（総話者数トップ10・重複あり）",
      year: "2026年",
      rows: [
        { label: "英語（L1+L2）", val: "約18人 (17.99% / 14.93億人)", pct: 17.99, color: "#2563eb" },
        { label: "中国語・北京官話（L1+L2）", val: "約14人 (14.25% / 11.83億人)", pct: 14.25, color: "#dc2626" },
        { label: "ヒンディー語（L1+L2）", val: "約7人 (7.36% / 6.11億人)", pct: 7.36, color: "#ea580c" },
        { label: "スペイン語（L1+L2）", val: "約7人 (6.76% / 5.61億人)", pct: 6.76, color: "#eab308" },
        { label: "標準アラビア語（L1+L2）", val: "約4人 (4.04% / 3.35億人)", pct: 4.04, color: "#16a34a" },
        { label: "フランス語（L1+L2）", val: "約4人 (4.02% / 3.34億人)", pct: 4.02, color: "#0284c7" },
        { label: "ベンガル語 / ポルトガル語 / インドネシア語 / ウルドゥー語", val: "各 約3人 (2.46〜2.74億人)", pct: 3.30, color: "#7c3aed" }
      ],
      note: "無料公開版Ethnologue 200では母語(L1)単独の言語別数値と11位以下（日本語等）が非公開。母語全体では「上位20言語で37億人超・上位200言語で88%超」と公表されています。",
      sourceText: "Ethnologue (2026, 29th edition)",
      sourceUrl: "https://www.ethnologue.com/insights/ethnologue200/"
    }
  ],

  sourcesTable: [
    { cat: "人口・地域・年齢・性別", name: "総人口・6地域・年齢階級・男女比", year: "2026年推計", org: "国連 (UN WPP 2024)", url: "https://population.un.org/wpp/" },
    { cat: "人口", name: "都市部人口比率 (SP.URB.TOTL.IN.ZS)", year: "2025年", org: "世界銀行 WDI", url: "https://api.worldbank.org/v2/country/WLD/indicator/SP.URB.TOTL.IN.ZS?format=json" },
    { cat: "所得", name: "1日の生活費・貧困ライン分布 (2021 PPP)", year: "2024年", org: "世界銀行 PIP", url: "https://pip.worldbank.org/" },
    { cat: "健康", name: "安全な飲み水 / 基本的な飲み水", year: "2024年", org: "WHO / UNICEF JMP", url: "https://www.who.int/news-room/fact-sheets/detail/drinking-water" },
    { cat: "健康", name: "安全な衛生施設 / 基本的衛生施設", year: "2024年", org: "WHO / UNICEF JMP", url: "https://www.who.int/news-room/fact-sheets/detail/sanitation" },
    { cat: "健康", name: "肥満・過体重 (成人45%・全人口約1/7)", year: "2024年", org: "WHO", url: "https://www.who.int/news-room/fact-sheets/detail/obesity-and-overweight" },
    { cat: "健康", name: "栄養不足人口割合 (SN.ITK.DEFC.ZS)", year: "2024年", org: "FAO / 世界銀行 WDI", url: "https://api.worldbank.org/v2/country/WLD/indicator/SN.ITK.DEFC.ZS?format=json" },
    { cat: "健康", name: "出生時平均余命 (73.3歳)", year: "2023年", org: "WHO Global Health Observatory", url: "https://www.who.int/data/gho/data/themes/mortality-and-global-health-estimates/ghe-life-expectancy-and-healthy-life-expectancy" },
    { cat: "教育", name: "成人識字率 (SE.ADT.LITR.ZS)", year: "2024年", org: "UNESCO UIS / 世界銀行 WDI", url: "https://api.worldbank.org/v2/country/WLD/indicator/SE.ADT.LITR.ZS?format=json" },
    { cat: "教育", name: "初等教育修了率 / 高等教育総就学率", year: "2024年", org: "UNESCO UIS / 世界銀行 WDI", url: "https://api.worldbank.org/v2/country/WLD/indicator/SE.PRM.CMPT.ZS?format=json" },
    { cat: "情報", name: "インターネット利用率 (76%)", year: "2026年", org: "ITU Facts and Figures 2026", url: "https://www.itu.int/en/ITU-D/Statistics/Pages/facts/default.aspx" },
    { cat: "インフラ", name: "電力アクセス率 (EG.ELC.ACCS.ZS)", year: "2024年", org: "世界銀行 WDI", url: "https://api.worldbank.org/v2/country/WLD/indicator/EG.ELC.ACCS.ZS?format=json" },
    { cat: "宗教", name: "世界の宗教構成", year: "2020年 (2025年公表)", org: "Pew Research Center", url: "https://www.pewresearch.org/religion/2025/06/09/how-the-global-religious-landscape-changed-from-2010-to-2020/" },
    { cat: "言語", name: "Ethnologue 200 (L1+L2上位10言語)", year: "2026年 (第29版)", org: "Ethnologue", url: "https://www.ethnologue.com/insights/ethnologue200/" },
    { cat: "言語", name: "上位20言語の母語話者規模・希少言語割合", year: "2026年", org: "Ethnologue", url: "https://www.ethnologue.com/insights/how-many-languages/" }
  ]
};
