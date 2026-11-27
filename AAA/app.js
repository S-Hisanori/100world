// 入力状態はすべてメモリ内のみで管理し、localStorage / sessionStorage / Cookie へは一切保存しません。
const state = {
  activeLensId: "region",
  profile: {
    age: "",
    sex: "",
    region: "",
    urban: "",
    incomeBracket: "",
    incomeUsd: "",
    water: "",
    literacy: "",
    internet: "",
    religion: "",
    language: ""
  }
};

const PERSON_SVG = `<svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="12" cy="7" r="4"/><path d="M5 20a7 7 0 0 1 14 0v1H5v-1z"/></svg>`;

function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");
}

function getAgeGroupFromAge(ageNum) {
  if (ageNum <= 14) return "0-14";
  if (ageNum <= 24) return "15-24";
  if (ageNum <= 64) return "25-64";
  return "65+";
}

function getIncomeBracketFromUsd(usd) {
  if (usd < 3) return "lt3";
  if (usd < 8.3) return "3to8.3";
  if (usd < 20) return "8.3to20";
  if (usd < 50) return "20to50";
  return "ge50";
}

function getResolvedProfileKeys() {
  const p = state.profile;
  const ageNum = p.age !== "" && !Number.isNaN(Number(p.age)) ? Number(p.age) : null;
  const usdNum = p.incomeUsd !== "" && !Number.isNaN(Number(p.incomeUsd)) ? Number(p.incomeUsd) : null;

  return {
    ageGroup: ageNum !== null && ageNum >= 0 && ageNum <= 120 ? getAgeGroupFromAge(ageNum) : "",
    sex: p.sex,
    region: p.region,
    urban: p.urban,
    incomeBracket: usdNum !== null && usdNum >= 0 ? getIncomeBracketFromUsd(usdNum) : p.incomeBracket,
    water: p.water,
    literacy: p.literacy,
    internet: p.internet,
    religion: p.religion
  };
}

function renderHeroStats() {
  const el = document.getElementById("hero-stats");
  el.innerHTML = WORLD_DATA.heroStats
    .map(
      (s) => `
      <div class="hero-stat">
        <span class="hero-stat-label">${escapeHtml(s.label)}</span>
        <div class="hero-stat-val">${escapeHtml(s.value)}</div>
        <div class="hero-stat-sub">${escapeHtml(s.sub)}</div>
      </div>`
    )
    .join("");
}

function renderLensTabs() {
  const el = document.getElementById("lens-tabs");
  el.innerHTML = WORLD_DATA.lenses
    .map(
      (l) => `
      <button type="button"
        class="lens-tab ${l.id === state.activeLensId ? "active" : ""}"
        data-lens="${escapeHtml(l.id)}"
        role="tab"
        aria-selected="${l.id === state.activeLensId}">
        ${escapeHtml(l.title)}
      </button>`
    )
    .join("");

  el.querySelectorAll(".lens-tab").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.activeLensId = btn.dataset.lens;
      renderLensTabs();
      renderVillageView();
    });
  });
}

function renderVillageView() {
  const lens = WORLD_DATA.lenses.find((l) => l.id === state.activeLensId) || WORLD_DATA.lenses[0];
  const resolved = getResolvedProfileKeys();
  const userMatchKey = lens.profileKey ? resolved[lens.profileKey] : "";

  document.getElementById("lens-meta").innerHTML =
    `基準年: <strong>${escapeHtml(lens.year)}</strong> ／ 出典: <a href="${escapeHtml(lens.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(lens.sourceName)}</a>`;

  // 100人のスロット配列を作成
  const slots = [];
  lens.items.forEach((item) => {
    for (let i = 0; i < item.count; i += 1) {
      slots.push(item);
    }
  });
  while (slots.length < 100) {
    slots.push(lens.items[lens.items.length - 1]);
  }

  // ユーザーが該当するカテゴリの最初の1人（もし0人枠ならその注記付きで先頭付近）を「あなた」としてハイライト
  let youIndex = -1;
  if (userMatchKey) {
    youIndex = slots.findIndex((s) => s.key === userMatchKey);
  }

  const gridEl = document.getElementById("village-grid");
  gridEl.innerHTML = slots
    .slice(0, 100)
    .map((item, idx) => {
      const isYou = idx === youIndex;
      const titleText = `${idx + 1}人目: ${item.label}（${item.count}人 / ${item.pct}%）${isYou ? " ★あなた" : ""}`;
      return `<div class="villager ${isYou ? "is-you" : ""}" style="background:${item.color}" title="${escapeHtml(titleText)}">${PERSON_SVG}</div>`;
    })
    .join("");

  let footnote = lens.note || "";
  if (userMatchKey && youIndex === -1) {
    const matched = lens.items.find((i) => i.key === userMatchKey);
    if (matched) {
      footnote = `※あなたの区分「${matched.label}」は世界の${matched.pct}%（100人換算で1人未満）のため、上の100人アイコン上には整数枠がありません。 ${footnote}`;
    }
  }
  document.getElementById("grid-footnote").textContent = footnote;

  const legendEl = document.getElementById("village-legend-panel");
  legendEl.innerHTML = lens.items
    .map((item) => {
      const isMatch = userMatchKey && item.key === userMatchKey;
      const extraNote = item.note ? `（${item.note}）` : "";
      return `
        <div class="legend-item ${isMatch ? "is-user-match" : ""}">
          <div class="legend-left">
            <span class="legend-swatch" style="background:${item.color}"></span>
            <div>
              <span class="legend-name">${escapeHtml(item.label)}</span>
              ${isMatch ? '<span class="legend-you-tag">あなた</span>' : ""}
            </div>
          </div>
          <div class="legend-right">
            <span class="legend-count">${item.count}人</span>
            <span class="legend-pct">${item.pct}%${escapeHtml(extraNote)}</span>
          </div>
        </div>`;
    })
    .join("");
}

function buildCompareItems() {
  const p = state.profile;
  const items = [];

  // 1. 年齢
  if (p.age !== "" && !Number.isNaN(Number(p.age))) {
    const age = Math.max(0, Math.min(120, Math.floor(Number(p.age))));
    const bracket = WORLD_DATA.age5yr2026.find((b) => age >= b.min && age <= b.max);
    let youngerPct = 0;
    let olderPct = 0;
    WORLD_DATA.age5yr2026.forEach((b) => {
      if (b.max < age) youngerPct += b.pct;
      else if (b.min > age) olderPct += b.pct;
    });
    const approxYounger = Math.round(youngerPct + (bracket ? bracket.pct * 0.5 : 0));
    const approxOlder = Math.max(0, 100 - approxYounger);
    items.push({
      title: `年齢：${age}歳（${bracket ? bracket.label : ""}）`,
      badge: `同年代 約${Math.round(bracket ? bracket.pct : 0)}人`,
      pct: bracket ? bracket.pct : 0,
      desc: `同じ5歳階級（${bracket.label}）は100人中約${bracket.pct.toFixed(1)}人です。村の約${approxYounger}人があなたより年下世代、約${approxOlder}人が年上世代（世界の中央年齢は31.1歳・2026年UN WPP）。`
    });
  }

  // 2. 性別
  if (p.sex) {
    const isFemale = p.sex === "female";
    items.push({
      title: `性別：${isFemale ? "女性" : "男性"}`,
      badge: `50人 (${isFemale ? "49.74" : "50.26"}%)`,
      pct: isFemale ? 49.74 : 50.26,
      desc: `村の100人のうち、女性は50人（49.74%）、男性は50人（50.26%）です（2026年 UN WPP 2024）。`
    });
  }

  // 3. 地域
  if (p.region) {
    const reg = WORLD_DATA.lenses.find((l) => l.id === "region").items.find((i) => i.key === p.region);
    items.push({
      title: `住んでいる地域：${reg.label}`,
      badge: `${reg.count === 0 ? "1人未満" : reg.count + "人"} (${reg.pct}%)`,
      pct: reg.pct,
      desc:
        reg.count === 0
          ? `オセアニアに暮らす人は世界の${reg.pct}%（100人あたり約0.6人）で、非常に少数派です（2026年 UN WPP 2024）。`
          : `村の100人のうち、${reg.label}に暮らしている仲間は${reg.count}人（${reg.pct}%）です（2026年 UN WPP 2024）。`
    });
  }

  // 4. 都市・農村
  if (p.urban) {
    const isUrban = p.urban === "urban";
    items.push({
      title: `居住エリア：${isUrban ? "都市部" : "農村部"}`,
      badge: `${isUrban ? "58人 (57.83%)" : "42人 (42.17%)"}`,
      pct: isUrban ? 57.83 : 42.17,
      desc: `100人のうち${isUrban ? "58人（57.83%）があなたと同じ都市部" : "42人（42.17%）があなたと同じ農村部"}に住んでいます（2025年 世界銀行 WDI）。`
    });
  }

  // 5. 1日の生活費
  const usdVal = p.incomeUsd !== "" && !Number.isNaN(Number(p.incomeUsd)) && Number(p.incomeUsd) >= 0 ? Number(p.incomeUsd) : null;
  const incKey = usdVal !== null ? getIncomeBracketFromUsd(usdVal) : p.incomeBracket;
  if (incKey) {
    const incLens = WORLD_DATA.lenses.find((l) => l.id === "income").items;
    const matched = incLens.find((i) => i.key === incKey);
    let belowDesc = "";
    if (usdVal !== null) {
      // PIP APIで取得済みの実測累積カーブから範囲テキストを作成（推測補間はしない）
      const thresholds = [
        { v: 3.0, pct: 10.12 },
        { v: 4.2, pct: 18.21 },
        { v: 8.3, pct: 46.16 },
        { v: 10.0, pct: 52.87 },
        { v: 15.0, pct: 65.16 },
        { v: 20.0, pct: 72.39 },
        { v: 30.0, pct: 80.67 },
        { v: 50.0, pct: 88.89 },
        { v: 100.0, pct: 96.68 }
      ];
      const exactOrNearest = thresholds.filter((t) => t.v <= usdVal).pop();
      const nextT = thresholds.find((t) => t.v > usdVal);
      if (usdVal < 3.0) {
        belowDesc = `入力値（$${usdVal}/日）は世界銀行の極度の貧困ライン（$3.00未満：約10人・10.12%）の範囲内です。`;
      } else if (!nextT) {
        belowDesc = `入力値（$${usdVal}/日）は1日$100以上にあたり、世界人口の約97人（96.68%）より生活費水準が高く、上位約3人（3.32%）に入ります。`;
      } else {
        belowDesc = `世界銀行PIP（2024年）の実測集計では、1日$${exactOrNearest.v.toFixed(2)}未満が${exactOrNearest.pct}%（約${Math.round(exactOrNearest.pct)}人）、$${nextT.v.toFixed(2)}未満が${nextT.pct}%（約${Math.round(nextT.pct)}人）です。`;
      }
    } else {
      const cumMap = {
        lt3: "あなたより下位の層は少なく、村の約90人（89.88%）は$3.00以上で暮らしています。",
        "3to8.3": "村の約10人が$3.00未満、約54人（53.84%）が$8.30以上で暮らしています。",
        "8.3to20": "村の約46人（46.16%）があなたより低い$8.30未満、約28人（27.61%）が$20.00以上で暮らしています。",
        "20to50": "村の約72人（72.39%）があなたより低い$20.00未満で暮らしており、上位約28人の水準です。",
        ge50: "村の約89人（88.89%）は$50.00未満で暮らしており、あなたは世界で上位約11人に入ります。"
      };
      belowDesc = cumMap[incKey];
    }

    items.push({
      title: `1日の生活費：${matched.label}`,
      badge: `同じ層 ${matched.count}人 (${matched.pct}%)`,
      pct: matched.pct,
      desc: `${belowDesc}（2024年 世界銀行 PIP・2021年PPP米ドル基準）`
    });
  }

  // 6. 飲み水
  if (p.water) {
    const waterItem = WORLD_DATA.lenses.find((l) => l.id === "water").items.find((i) => i.key === p.water);
    items.push({
      title: `飲み水：${waterItem.label}`,
      badge: `${waterItem.count}人 (${waterItem.pct}%)`,
      pct: waterItem.pct,
      desc: `村の74人（73.74%）が敷地内で安全に管理された飲み水を利用でき、18人（17.73%）が基本的サービスのみ、8人（8.53%）は基本的飲み水にアクセスできていません（2024年 WHO/UNICEF JMP）。`
    });
  }

  // 7. 読み書き
  if (p.literacy) {
    const isLit = p.literacy === "literate";
    items.push({
      title: `読み書き：${isLit ? "できる" : "難しい・できない"}`,
      badge: `${isLit ? "88人 (87.74%)" : "12人 (12.26%)"}`,
      pct: isLit ? 87.74 : 12.26,
      desc: `15歳以上の成人のうち、88人（87.74%）が読み書きでき、12人（12.26%）はできません（2024年 UNESCO UIS / 世界銀行）。`
    });
  }

  // 8. インターネット
  if (p.internet) {
    const isOn = p.internet === "online";
    items.push({
      title: `インターネット：${isOn ? "利用している" : "利用していない"}`,
      badge: `${isOn ? "76人 (76%)" : "24人 (24%)"}`,
      pct: isOn ? 76 : 24,
      desc: `村の76人（76%）がインターネットを利用しており、24人（24%・約20億人）はオフラインです（2026年 ITU）。`
    });
  }

  // 9. 宗教
  if (p.religion) {
    const rel = WORLD_DATA.lenses.find((l) => l.id === "religion").items.find((i) => i.key === p.religion);
    items.push({
      title: `宗教：${rel.label}`,
      badge: `${rel.count === 0 ? "約0.2人" : rel.count + "人"} (${rel.pct}%)`,
      pct: rel.pct,
      desc:
        rel.count === 0
          ? `ユダヤ教は世界人口の0.2%（1,000人あたり約2人）です（Pew Research Center 2020年値）。`
          : `村の100人のうち、同じグループは${rel.count}人（${rel.pct}%）です（Pew Research Center 2020年確定値・2025年公表）。`
    });
  }

  // 10. 言語
  if (p.language) {
    const topLang = WORLD_DATA.ethnologueTop10L1L2.find((l) => l.key === p.language);
    if (topLang) {
      items.push({
        title: `言語：${topLang.name}（L1+L2総話者）`,
        badge: `約${topLang.people}人 (${topLang.pct}%) ※第2言語含む`,
        pct: topLang.pct,
        desc: `Ethnologue 2026無料公開の総話者数（母語＋第2言語）では約${(topLang.speakers / 1e8).toFixed(2)}億人（世界人口の${topLang.pct}%）。※母語(L1)単独の話者数は有料限定のため非掲載です。`
      });
    } else if (p.language === "other_top200") {
      items.push({
        title: "言語：トップ10以外の主要言語（日本語など）",
        badge: "個別比率は非公開（上位200言語は母語合計88%超）",
        pct: 88,
        desc: "Ethnologue 2026の無料公開版では11位以下および母語(L1)別の人数が有料限定のため正確な「何人」は表示できません。なお、上位200言語のいずれかを母語とする人は村の88人超にあたります。"
      });
    } else {
      items.push({
        title: "言語：上位200言語以外の希少言語",
        badge: "12人未満の少数派グループ",
        pct: 12,
        desc: "世界の言語の88%超の母語話者が上位200言語に集中しており、それ以外の約7,000近い言語を母語とする人は村全体で12人未満です（Ethnologue 2026）。"
      });
    }
  }

  return items;
}

function renderComparisonResults() {
  const el = document.getElementById("compare-results");
  const items = buildCompareItems();

  if (items.length === 0) {
    el.innerHTML = `
      <div class="compare-empty">
        <p><strong>左のフォームから気になる項目を選んでみてください。</strong></p>
        <p>選んだ項目だけがここに表示され、上の「100人の村ビジュアライザー」にもあなたの位置が反映されます。</p>
      </div>`;
    return;
  }

  el.innerHTML = `
    <div class="compare-summary-banner">
      <strong>${items.length}項目</strong>を比較中（未入力の項目はスキップ中・保存なし）
    </div>
    ${items
      .map(
        (it) => `
      <div class="compare-item">
        <div class="compare-item-head">
          <span class="compare-item-title">${escapeHtml(it.title)}</span>
          <span class="compare-item-badge">${escapeHtml(it.badge)}</span>
        </div>
        <div class="compare-bar-track">
          <div class="compare-bar-fill" style="width:${Math.min(100, Math.max(1, it.pct))}%"></div>
        </div>
        <p class="compare-item-desc">${escapeHtml(it.desc)}</p>
      </div>`
      )
      .join("")}`;
}

function renderThemeCards() {
  const el = document.getElementById("themes-grid");
  el.innerHTML = WORLD_DATA.themeCards
    .map(
      (card) => `
      <article class="theme-card">
        <div class="theme-card-head">
          <h3 class="theme-card-title"><span>${card.icon}</span>${escapeHtml(card.title)}</h3>
          <span class="year-tag">${escapeHtml(card.year)}</span>
        </div>
        ${card.rows
          .map(
            (r) => `
          <div class="metric-row">
            <div class="metric-label-row">
              <span>${escapeHtml(r.label)}</span>
              <span class="metric-val">${escapeHtml(r.val)}</span>
            </div>
            <div class="metric-bar">
              <span style="width:${Math.min(100, Math.max(1, r.pct))}%; background:${r.color}"></span>
            </div>
          </div>`
          )
          .join("")}
        <p class="theme-note">${escapeHtml(card.note)}</p>
        <div class="theme-source">
          出典: <a href="${escapeHtml(card.sourceUrl)}" target="_blank" rel="noopener noreferrer">${escapeHtml(card.sourceText)}</a>
        </div>
      </article>`
    )
    .join("");
}

function renderSourcesTable() {
  const tbody = document.getElementById("sources-tbody");
  tbody.innerHTML = WORLD_DATA.sourcesTable
    .map(
      (row) => `
      <tr>
        <td>${escapeHtml(row.cat)}</td>
        <td>${escapeHtml(row.name)}</td>
        <td>${escapeHtml(row.year)}</td>
        <td><a href="${escapeHtml(row.url)}" target="_blank" rel="noopener noreferrer">${escapeHtml(row.org)}</a></td>
      </tr>`
    )
    .join("");
}

function bindProfileInputs() {
  const map = [
    ["input-age", "age"],
    ["input-sex", "sex"],
    ["input-region", "region"],
    ["input-urban", "urban"],
    ["input-income-bracket", "incomeBracket"],
    ["input-income-usd", "incomeUsd"],
    ["input-water", "water"],
    ["input-literacy", "literacy"],
    ["input-internet", "internet"],
    ["input-religion", "religion"],
    ["input-language", "language"]
  ];

  map.forEach(([id, key]) => {
    const inputEl = document.getElementById(id);
    const eventName = inputEl.tagName === "INPUT" ? "input" : "change";
    inputEl.addEventListener(eventName, () => {
      state.profile[key] = inputEl.value.trim();
      // ドル額を手入力したらプルダウン側の生活費表示も連動同期（表示のみ、保存なし）
      if (key === "incomeUsd" && state.profile.incomeUsd !== "") {
        const usd = Number(state.profile.incomeUsd);
        if (!Number.isNaN(usd) && usd >= 0) {
          document.getElementById("input-income-bracket").value = getIncomeBracketFromUsd(usd);
        }
      } else if (key === "incomeBracket" && state.profile.incomeBracket !== "") {
        document.getElementById("input-income-usd").value = "";
        state.profile.incomeUsd = "";
      }
      renderVillageView();
      renderComparisonResults();
    });
  });

  document.getElementById("reset-profile-btn").addEventListener("click", () => {
    Object.keys(state.profile).forEach((k) => {
      state.profile[k] = "";
    });
    document.getElementById("profile-form").reset();
    renderVillageView();
    renderComparisonResults();
  });
}

function init() {
  renderHeroStats();
  renderLensTabs();
  renderVillageView();
  renderComparisonResults();
  renderThemeCards();
  renderSourcesTable();
  bindProfileInputs();
}

document.addEventListener("DOMContentLoaded", init);
