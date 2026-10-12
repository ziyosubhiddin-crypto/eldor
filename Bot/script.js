/**
 * VORTEX TENNIS CLUB - CORE JAVASCRIPT ENGINE
 * Features:
 * 1. Multilingual Support (Uzbek / English)
 * 2. Interactive Court Booking Wizard & Dynamic Calculation
 * 3. Live Grand Slam Point Simulator & Animated Scoreboard
 * 4. Playable Canvas Tennis Rally Mini-Game with Sound FX
 * 5. Pro Shop Catalog, Filter & Slide-out Cart Drawer
 * 6. Web Audio API Synthetic Sound Engine
 */

// ==========================================
// 1. SOUND FX SYNTHESIS ENGINE (Web Audio API)
// ==========================================
class SoundFX {
  constructor() {
    this.enabled = true;
    this.ctx = null;
  }

  init() {
    if (!this.ctx) {
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (AudioCtx) this.ctx = new AudioCtx();
    }
  }

  // Realistic Tennis ball hit "pock" sound
  playHit() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;
    
    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;

      osc.type = 'triangle';
      osc.frequency.setValueAtTime(320, now);
      osc.frequency.exponentialRampToValueAtTime(110, now + 0.08);

      gain.gain.setValueAtTime(0.7, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.08);

      osc.connect(gain);
      gain.connect(this.ctx.destination);

      osc.start(now);
      osc.stop(now + 0.09);
    } catch (e) {}
  }

  // Score point chime
  playPoint() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const now = this.ctx.currentTime;
      [523.25, 659.25, 783.99].forEach((freq, idx) => {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + idx * 0.08);
        gain.gain.setValueAtTime(0.3, now + idx * 0.08);
        gain.gain.exponentialRampToValueAtTime(0.01, now + idx * 0.08 + 0.2);
        osc.connect(gain);
        gain.connect(this.ctx.destination);
        osc.start(now + idx * 0.08);
        osc.stop(now + idx * 0.08 + 0.22);
      });
    } catch (e) {}
  }

  // Out / Error buzz
  playOut() {
    if (!this.enabled) return;
    this.init();
    if (!this.ctx) return;

    try {
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const now = this.ctx.currentTime;
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(140, now);
      osc.frequency.linearRampToValueAtTime(80, now + 0.25);
      gain.gain.setValueAtTime(0.35, now);
      gain.gain.exponentialRampToValueAtTime(0.01, now + 0.25);
      osc.connect(gain);
      gain.connect(this.ctx.destination);
      osc.start(now);
      osc.stop(now + 0.26);
    } catch (e) {}
  }
}

const sfx = new SoundFX();

// ==========================================
// 2. MULTILINGUAL DICTIONARY (UZ / EN)
// ==========================================
const translations = {
  uz: {
    nav_home: "Bosh sahifa",
    nav_booking: "Kort band qilish",
    nav_scores: "Jonli Natijalar",
    nav_academy: "Akademiya",
    nav_shop: "Pro Do'kon",
    nav_game: "Mini O'yin 🎾",
    nav_pricing: "Narxlar",
    book_now_btn: "Kortni Band Qilish",
    hero_badge: "O'ZBEKISTONDAGI №1 ELITA TENNIS MAJMUASI",
    hero_title: `Chempionlar Maydoni. <br><span class="text-gradient">O'z O'yiningizni</span> Yangi Bosqichga Ko'taring.`,
    hero_desc: "Wimbledon sifatidagi tabiiy chim, professional tuproq (clay) va xalqaro standartdagi qattiq kortlar. Tajribali ATP murabbiylari hamda zamonaviy tennis infratuzilmasi.",
    hero_cta_book: "Kortni Band Qilish",
    hero_cta_game: "🎾 Tennis Mini-O'yin",
    weather_lbl: "Ob-havo:",
    courts_open_lbl: "Mavjud Kortlar:",
    hours_lbl: "Ish Vaqti:",
    stat_courts: "Professional Kortlar",
    stat_coaches: "ATP Sertifikatli Murabbiylar",
    stat_members: "Doimiy A'zolar",
    stat_rating: "Xalqaro Baholash",
    booking_tag: "ONLINE BAND QILISH",
    booking_title: "O'z Kortingizni Tanlang va Band Qiling",
    booking_subtitle: "Har xil qoplamali xalqaro standartdagi kortlar. Qulay vaqtni tanlang va 1 daqiqada tasdiqlang.",
    step1_title: "Kort turini tanlang",
    step2_title: "Sana va vaqtni belgilang",
    date_label: "O'yin kuni:",
    date_today: "Bugun",
    date_tomorrow: "Ertaga",
    time_label: "Vaqt oralig'i (1.5 soat):",
    addons_label: "Qo'shimcha xizmatlar:",
    addon_racket: "Babolat / Wilson Racketka ijarasi",
    addon_coach: "Shaxsiy murabbiy yordami (1 soat)",
    addon_balls: "Yangi to'plar savati (6 dona)",
    sum_court: "Tanlangan kort:",
    sum_slot: "Vaqt:",
    sum_total: "Jami to'lov:",
    confirm_booking_btn: "Band Qilishni Tasdiqlash",
    scores_tag: "ATP & WTA ARENA",
    scores_title: "Jonli Tennis Matchlari & Natijalari",
    scores_subtitle: "Real vaqtdagi Grand Slam to'qnashuvlari va klub o'rtasidagi chempionatlar hisobi.",
    sim_point_btn: "⚡ O'yinni Jonli Tebrating",
    game_tag: "INTERAKTIV O'YIN",
    game_title: "🎾 VORTEX TENNIS RALLY CHALLENGE",
    game_subtitle: "Sichqoncha yoki barmoq bilan raketkangizni boshqaring. Rallini buzmasdan eng yuqori ochkoni yig'ing!",
    game_score_lbl: "Ochko:",
    game_streak_lbl: "Zarbalar Rallisi:",
    game_best_lbl: "Eng Yaxshi Rekord:",
    start_game_btn: "O'yinni Boshlash 🚀",
    restart_game_btn: "Qaytadan O'ynash 🎾",
    academy_tag: "VORTEX ACADEMY",
    academy_title: "Bolalar va Kattalar Uchun Professional Ta'lim",
    academy_desc: "Bizning murabbiylarimiz xalqaro ATP/ITF standartlariga ega bo'lib, noldan boshlovchilardan tortib professional musobaqa ishtirokchilarigacha professional dastur asosida dars beradi.",
    academy_enroll_btn: "Sinov Darsiga Yozilish",
    shop_tag: "PRO SHOP",
    shop_title: "Professional Tennis Anjomlari",
    shop_subtitle: "Dunyoning yetakchi brendlari — Wilson, Babolat, Head mahsulotlari 100% kafolat bilan.",
    filter_all: "Barchasi",
    filter_rackets: "Racketkalar",
    filter_balls: "To'plar",
    filter_apparel: "Kiyim & Sumkalar",
    filter_acc: "Aksessuarlar",
    pricing_tag: "A'ZOLIK TARIFLARI",
    pricing_title: "O'zingizga Mos Klub A'zoligini Tanlang",
    pricing_subtitle: "Moslashuvchan paketlar, bepul dush va sauna, ustuvor kort band qilish huquqi.",
    plan_monthly: "Oylik to'lov",
    per_month: "/oy",
    plan_select_btn: "Tanlash",
    cart_title: "Xarid Savatchasi",
    cart_empty: "Savatchangiz hozircha bo'sh",
    cart_subtotal: "Jami summa:",
    cart_checkout_btn: "Buyurtmani Rasmiylashtirish",
    cart_clear_btn: "Savatni tozalash"
  },
  en: {
    nav_home: "Home",
    nav_booking: "Book Court",
    nav_scores: "Live Scores",
    nav_academy: "Academy",
    nav_shop: "Pro Shop",
    nav_game: "Mini Game 🎾",
    nav_pricing: "Pricing",
    book_now_btn: "Book a Court",
    hero_badge: "#1 ELITE TENNIS COMPLEX IN UZBEKISTAN",
    hero_title: `Where Champions Are Made. <br><span class="text-gradient">Elevate Your Game</span> to New Heights.`,
    hero_desc: "Wimbledon-standard pristine grass, Roland Garros clay, and championship hard courts. Elite ATP certified coaching and world-class luxury sports amenities.",
    hero_cta_book: "Book Court Now",
    hero_cta_game: "🎾 Play Mini-Tennis",
    weather_lbl: "Weather:",
    courts_open_lbl: "Open Courts:",
    hours_lbl: "Hours:",
    stat_courts: "Championship Courts",
    stat_coaches: "ATP Certified Coaches",
    stat_members: "Active Members",
    stat_rating: "Global Rating",
    booking_tag: "ONLINE RESERVATION",
    booking_title: "Select Your Surface & Book Your Slot",
    booking_subtitle: "World-class tournament courts. Choose your preferred time and confirm in 60 seconds.",
    step1_title: "Choose Court Surface",
    step2_title: "Select Date & Time",
    date_label: "Play Date:",
    date_today: "Today",
    date_tomorrow: "Tomorrow",
    time_label: "Session Slot (1.5 hrs):",
    addons_label: "Extra Services & Gear:",
    addon_racket: "Babolat / Wilson Racket Rental",
    addon_coach: "Private Coach Session (1 hr)",
    addon_balls: "Fresh Balls Basket (6 balls)",
    sum_court: "Selected Court:",
    sum_slot: "Time Slot:",
    sum_total: "Total Amount:",
    confirm_booking_btn: "Confirm & Reserve Court",
    scores_tag: "ATP & WTA LIVE",
    scores_title: "Championship Live Scores",
    scores_subtitle: "Real-time Grand Slam scores and Vortex club tournament trackers.",
    sim_point_btn: "⚡ Simulate Live Point",
    game_tag: "INTERACTIVE ARCADE",
    game_title: "🎾 VORTEX TENNIS RALLY CHALLENGE",
    game_subtitle: "Control your racket with mouse or finger. Keep the rally alive to beat your high score!",
    game_score_lbl: "Score:",
    game_streak_lbl: "Rally Streak:",
    game_best_lbl: "High Score:",
    start_game_btn: "Start Game 🚀",
    restart_game_btn: "Play Again 🎾",
    academy_tag: "VORTEX ACADEMY",
    academy_title: "Elite Coaching for Adults & Juniors",
    academy_desc: "Our coaches carry ATP and ITF accreditation, delivering tailored instruction from junior beginners to competitive tournament players.",
    academy_enroll_btn: "Book a Trial Lesson",
    shop_tag: "PRO SHOP",
    shop_title: "Championship Equipment",
    shop_subtitle: "Authentic gear from Wilson, Babolat, Head and Nike with 100% guarantee.",
    filter_all: "All Gear",
    filter_rackets: "Rackets",
    filter_balls: "Balls",
    filter_apparel: "Apparel & Bags",
    filter_acc: "Accessories",
    pricing_tag: "MEMBERSHIP PLANS",
    pricing_title: "Select Your Club Membership",
    pricing_subtitle: "Flexible packages, access to luxury showers, sauna, and priority booking.",
    plan_monthly: "Monthly Plan",
    per_month: "/mo",
    plan_select_btn: "Choose Plan",
    cart_title: "Shopping Cart",
    cart_empty: "Your cart is currently empty",
    cart_subtotal: "Subtotal:",
    cart_checkout_btn: "Proceed to Checkout",
    cart_clear_btn: "Clear Cart"
  }
};

let currentLang = 'uz';

function setLanguage(lang) {
  currentLang = lang;
  document.documentElement.lang = lang;
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if (translations[lang] && translations[lang][key]) {
      el.innerHTML = translations[lang][key];
    }
  });

  document.getElementById('langUzBtn').classList.toggle('active', lang === 'uz');
  document.getElementById('langEnBtn').classList.toggle('active', lang === 'en');
  updateBookingSummary();
}

// ==========================================
// 3. PRO SHOP PRODUCTS DATA & LOGIC
// ==========================================
const productsData = [
  {
    id: 1,
    name: "Babolat Pure Aero 2026",
    category: "racket",
    brand: "Babolat",
    price: 3200000,
    priceStr: "3,200,000 so'm",
    icon: "🎾",
    tag: "ATP Fav",
    rating: 4.9
  },
  {
    id: 2,
    name: "Wilson Pro Staff 97 v14",
    category: "racket",
    brand: "Wilson",
    price: 3450000,
    priceStr: "3,450,000 so'm",
    icon: "🎾",
    tag: "Federer Spec",
    rating: 5.0
  },
  {
    id: 3,
    name: "Head Speed MP Legend",
    category: "racket",
    brand: "Head",
    price: 2980000,
    priceStr: "2,980,000 so'm",
    icon: "🎾",
    tag: "Djokovic Choice",
    rating: 4.8
  },
  {
    id: 4,
    name: "Wilson US Open Extra Duty (4-to'p)",
    category: "balls",
    brand: "Wilson",
    price: 140000,
    priceStr: "140,000 so'm",
    icon: "🟡",
    tag: "Rasmiy to'p",
    rating: 4.9
  },
  {
    id: 5,
    name: "Babolat Pure 12-Racket Bag",
    category: "apparel",
    brand: "Babolat",
    price: 1850000,
    priceStr: "1,850,000 so'm",
    icon: "🎒",
    tag: "Termo-himoya",
    rating: 4.9
  },
  {
    id: 6,
    name: "NikeCourt Air Zoom Vapor 11",
    category: "apparel",
    brand: "Nike",
    price: 2100000,
    priceStr: "2,100,000 so'm",
    icon: "👟",
    tag: "All-Court",
    rating: 4.9
  },
  {
    id: 7,
    name: "Luxilon ALU Power 125 Tor",
    category: "accessories",
    brand: "Luxilon",
    price: 260000,
    priceStr: "260,000 so'm",
    icon: "🧵",
    tag: "Pro String",
    rating: 4.8
  },
  {
    id: 8,
    name: "Wilson Pro Overgrip (12-talik)",
    category: "accessories",
    brand: "Wilson",
    price: 190000,
    priceStr: "190,000 so'm",
    icon: "🩹",
    tag: "No-Slip",
    rating: 4.7
  }
];

let cart = [];

function renderShop(filter = 'all') {
  const grid = document.getElementById('productsGrid');
  if (!grid) return;
  grid.innerHTML = '';

  const filtered = filter === 'all' 
    ? productsData 
    : productsData.filter(p => p.category === filter);

  filtered.forEach(p => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.innerHTML = `
      <div class="product-thumb">
        <span class="product-tag">${p.tag}</span>
        <span>${p.icon}</span>
      </div>
      <span class="product-brand">${p.brand}</span>
      <h4 class="product-title">${p.name}</h4>
      <div class="product-meta-row">
        <div>
          <div class="product-price">${p.price.toLocaleString()} <small style="font-size:0.7rem;color:#8e9e97;">so'm</small></div>
          <div style="font-size:0.75rem; color:#f59e0b;">⭐ ${p.rating}</div>
        </div>
        <button class="btn btn-sm btn-primary add-to-cart-btn" data-id="${p.id}">
          + Savatga
        </button>
      </div>
    `;
    grid.appendChild(card);
  });

  // Attach button events
  grid.querySelectorAll('.add-to-cart-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const id = parseInt(e.currentTarget.getAttribute('data-id'));
      addToCart(id);
    });
  });
}

function addToCart(productId) {
  const product = productsData.find(p => p.id === productId);
  if (!product) return;

  const existing = cart.find(item => item.id === productId);
  if (existing) {
    existing.qty++;
  } else {
    cart.push({ ...product, qty: 1 });
  }

  sfx.playHit();
  updateCartUI();
  showToast(`"${product.name}" savatchaga qo'shildi! 🎾`);
}

function updateCartUI() {
  const countBadge = document.getElementById('cartCountBadge');
  const cartList = document.getElementById('cartItemsList');
  const subtotalEl = document.getElementById('cartSubtotalAmount');
  const emptyMsg = document.getElementById('cartEmptyMsg');

  const totalCount = cart.reduce((acc, item) => acc + item.qty, 0);
  const totalPrice = cart.reduce((acc, item) => acc + (item.price * item.qty), 0);

  countBadge.textContent = totalCount;
  subtotalEl.textContent = `${totalPrice.toLocaleString()} so'm`;

  if (cart.length === 0) {
    cartList.innerHTML = `
      <div class="cart-empty-msg" id="cartEmptyMsg">
        <div class="empty-cart-icon">🛒</div>
        <p>${currentLang === 'uz' ? "Savatchangiz hozircha bo'sh" : "Your cart is currently empty"}</p>
      </div>
    `;
  } else {
    cartList.innerHTML = '';
    cart.forEach(item => {
      const row = document.createElement('div');
      row.className = 'cart-item-row';
      row.innerHTML = `
        <div class="cart-item-icon">${item.icon}</div>
        <div class="cart-item-info">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">${(item.price * item.qty).toLocaleString()} so'm</div>
        </div>
        <div class="cart-item-actions">
          <button class="qty-btn" onclick="window.changeCartQty(${item.id}, -1)">-</button>
          <span style="font-size:0.9rem; font-weight:700; width:16px; text-align:center;">${item.qty}</span>
          <button class="qty-btn" onclick="window.changeCartQty(${item.id}, 1)">+</button>
        </div>
      `;
      cartList.appendChild(row);
    });
  }
}

window.changeCartQty = function(id, delta) {
  const itemIndex = cart.findIndex(i => i.id === id);
  if (itemIndex > -1) {
    cart[itemIndex].qty += delta;
    if (cart[itemIndex].qty <= 0) {
      cart.splice(itemIndex, 1);
    }
  }
  updateCartUI();
};

window.filterShop = function(cat) {
  document.querySelectorAll('.shop-filter-btn').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-category') === cat);
  });
  renderShop(cat);
};

// ==========================================
// 4. INTERACTIVE COURT BOOKING WIZARD
// ==========================================
let bookingState = {
  courtType: 'grass',
  courtName: "Wimbledon Chim Korti",
  basePrice: 200000,
  dateOffset: 0,
  dateLabel: "Bugun",
  timeSlot: "10:00 - 11:30",
  addons: 20000 // default checked 6 balls
};

function initBooking() {
  // Court choices
  const courtChoices = document.querySelectorAll('.court-choice');
  courtChoices.forEach(card => {
    card.addEventListener('click', () => {
      courtChoices.forEach(c => c.classList.remove('active'));
      card.classList.add('active');
      bookingState.courtType = card.getAttribute('data-court');
      bookingState.basePrice = parseInt(card.getAttribute('data-price'));
      bookingState.courtName = card.querySelector('.court-name').textContent;
      sfx.playHit();
      updateBookingSummary();
    });
  });

  // Date chips
  const dateChips = document.querySelectorAll('.date-chip');
  dateChips.forEach(chip => {
    chip.addEventListener('click', () => {
      dateChips.forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      bookingState.dateOffset = parseInt(chip.getAttribute('data-date-offset'));
      bookingState.dateLabel = chip.querySelector('.day-name').textContent;
      sfx.playHit();
      updateBookingSummary();
    });
  });

  // Time slots
  const timeSlots = document.querySelectorAll('.time-slot:not(.occupied)');
  timeSlots.forEach(slot => {
    slot.addEventListener('click', () => {
      timeSlots.forEach(s => s.classList.remove('active'));
      slot.classList.add('active');
      bookingState.timeSlot = slot.getAttribute('data-time');
      sfx.playHit();
      updateBookingSummary();
    });
  });

  // Addons
  const addonCheckboxes = document.querySelectorAll('.addon-checkbox input');
  addonCheckboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      let addonSum = 0;
      addonCheckboxes.forEach(c => {
        if (c.checked) addonSum += parseInt(c.value);
      });
      bookingState.addons = addonSum;
      sfx.playHit();
      updateBookingSummary();
    });
  });

  // Confirm booking button
  const confirmBtn = document.getElementById('confirmBookingBtn');
  if (confirmBtn) {
    confirmBtn.addEventListener('click', handleBookingSubmit);
  }

  // Set real calendar days
  const today = new Date();
  const d0Str = `${today.getDate()} Okt`;
  const tomorrow = new Date(today);
  tomorrow.setDate(today.getDate() + 1);
  const d1Str = `${tomorrow.getDate()} Okt`;
  const dayAfter = new Date(today);
  dayAfter.setDate(today.getDate() + 2);
  const d2Str = `${dayAfter.getDate()} Okt`;

  const tEl = document.getElementById('todayDateStr');
  const tmEl = document.getElementById('tomorrowDateStr');
  const daEl = document.getElementById('dayAfterDateStr');
  if (tEl) tEl.textContent = d0Str;
  if (tmEl) tmEl.textContent = d1Str;
  if (daEl) daEl.textContent = d2Str;

  updateBookingSummary();
}

function updateBookingSummary() {
  const sumCourt = document.getElementById('sumCourtName');
  const sumTime = document.getElementById('sumTimeSlot');
  const sumTotal = document.getElementById('sumTotalPrice');

  const total = bookingState.basePrice + bookingState.addons;

  if (sumCourt) sumCourt.textContent = bookingState.courtName;
  if (sumTime) sumTime.textContent = `${bookingState.dateLabel}, ${bookingState.timeSlot}`;
  if (sumTotal) sumTotal.textContent = `${total.toLocaleString()} so'm`;
}

function handleBookingSubmit() {
  sfx.playPoint();
  const receiptBox = document.getElementById('bookingReceiptBox');
  const total = bookingState.basePrice + bookingState.addons;
  const bookingId = "VX-" + Math.floor(100000 + Math.random() * 900000);

  receiptBox.innerHTML = `
    <div class="receipt-row"><span>Bron ID:</span> <strong>#${bookingId}</strong></div>
    <div class="receipt-row"><span>Kort:</span> <strong>${bookingState.courtName}</strong></div>
    <div class="receipt-row"><span>Vaqt:</span> <strong>${bookingState.dateLabel}, ${bookingState.timeSlot}</strong></div>
    <div class="receipt-row"><span>Holat:</span> <strong style="color:var(--tennis-neon);">TASDIQLANDI ✓</strong></div>
    <div class="receipt-row" style="margin-top:0.75rem; border-top:1px dashed rgba(255,255,255,0.1); padding-top:0.5rem;">
      <span>To'langan summa:</span> <strong style="font-size:1.1rem; color:var(--tennis-neon);">${total.toLocaleString()} so'm</strong>
    </div>
  `;

  const modal = document.getElementById('bookingSuccessModal');
  modal.style.display = 'flex';
}

// ==========================================
// 5. LIVE GRAND SLAM POINT SIMULATOR
// ==========================================
let matchState = {
  p1Points: "40",
  p2Points: "30",
  p1Set: 5,
  p2Set: 4,
  p1Serving: true,
  rallyCount: 18
};

const tennisScores = ["0", "15", "30", "40", "AD", "GAME"];

function simulatePoint() {
  sfx.playHit();
  
  // Random winner of the point
  const p1Wins = Math.random() > 0.45;
  matchState.rallyCount = Math.floor(Math.random() * 22) + 4;

  const rallyEl = document.getElementById('liveRallyCounter');
  if (rallyEl) rallyEl.textContent = `${matchState.rallyCount} zarba`;

  if (p1Wins) {
    if (matchState.p1Points === "40" && matchState.p2Points !== "40") {
      matchState.p1Set++;
      matchState.p1Points = "0";
      matchState.p2Points = "0";
      matchState.p1Serving = !matchState.p1Serving;
      showToast("🏆 Carlos Alcaraz geymni yutdi!");
      sfx.playPoint();
    } else if (matchState.p1Points === "30") {
      matchState.p1Points = "40";
    } else if (matchState.p1Points === "15") {
      matchState.p1Points = "30";
    } else {
      matchState.p1Points = "15";
    }
  } else {
    if (matchState.p2Points === "40" && matchState.p1Points !== "40") {
      matchState.p2Set++;
      matchState.p1Points = "0";
      matchState.p2Points = "0";
      matchState.p1Serving = !matchState.p1Serving;
      showToast("🔥 Jannik Sinner geymni yutdi!");
      sfx.playPoint();
    } else if (matchState.p2Points === "30") {
      matchState.p2Points = "40";
    } else if (matchState.p2Points === "15") {
      matchState.p2Points = "30";
    } else {
      matchState.p2Points = "15";
    }
  }

  // Update DOM
  document.getElementById('p1Points').textContent = matchState.p1Points;
  document.getElementById('p2Points').textContent = matchState.p2Points;
  document.getElementById('p1CurrentSet').textContent = matchState.p1Set;
  document.getElementById('p2CurrentSet').textContent = matchState.p2Set;

  const p1Serve = document.getElementById('p1Serve');
  const p2Serve = document.getElementById('p2Serve');
  if (matchState.p1Serving) {
    p1Serve.classList.remove('hidden');
    p2Serve.classList.add('hidden');
  } else {
    p1Serve.classList.add('hidden');
    p2Serve.classList.remove('hidden');
  }
}

// ==========================================
// 6. PLAYABLE CANVAS TENNIS MINI-GAME (60 FPS)
// ==========================================
class TennisGame {
  constructor(canvas) {
    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.width = canvas.width;
    this.height = canvas.height;

    this.running = false;
    this.score = 0;
    this.streak = 0;
    this.highScore = parseInt(localStorage.getItem('vortex_tennis_highscore') || '0');

    // Player racket (Bottom)
    this.paddleWidth = 110;
    this.paddleHeight = 14;
    this.playerX = (this.width - this.paddleWidth) / 2;

    // AI bot racket (Top)
    this.botX = (this.width - this.paddleWidth) / 2;
    this.botSpeed = 4.2;

    // Ball
    this.ballRadius = 9;
    this.ballX = this.width / 2;
    this.ballY = this.height / 2;
    this.ballSpeedX = 4;
    this.ballSpeedY = -5;

    // Trail
    this.trail = [];

    this.bindEvents();
    this.updateScoreboard();
  }

  bindEvents() {
    // Mouse movement
    this.canvas.addEventListener('mousemove', (e) => {
      const rect = this.canvas.getBoundingClientRect();
      const scaleX = this.canvas.width / rect.width;
      const mouseX = (e.clientX - rect.left) * scaleX;
      this.playerX = Math.max(0, Math.min(this.width - this.paddleWidth, mouseX - this.paddleWidth / 2));
    });

    // Touch movement
    this.canvas.addEventListener('touchmove', (e) => {
      if (e.touches.length > 0) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const touchX = (e.touches[0].clientX - rect.left) * scaleX;
        this.playerX = Math.max(0, Math.min(this.width - this.paddleWidth, touchX - this.paddleWidth / 2));
      }
      e.preventDefault();
    }, { passive: false });
  }

  start() {
    this.running = true;
    this.score = 0;
    this.streak = 0;
    this.resetBall();
    this.updateScoreboard();
    document.getElementById('gameOverOverlay').style.display = 'none';
    document.getElementById('gameStartOverlay').style.display = 'none';
    requestAnimationFrame(() => this.loop());
  }

  resetBall() {
    this.ballX = this.width / 2;
    this.ballY = this.height / 2;
    this.ballSpeedY = 4.5 * (Math.random() > 0.5 ? 1 : -1);
    this.ballSpeedX = (Math.random() * 4 - 2);
  }

  update() {
    if (!this.running) return;

    // Ball motion
    this.ballX += this.ballSpeedX;
    this.ballY += this.ballSpeedY;

    // Trail effect
    this.trail.push({ x: this.ballX, y: this.ballY, alpha: 0.6 });
    if (this.trail.length > 8) this.trail.shift();

    // Side walls bounce
    if (this.ballX - this.ballRadius <= 40 || this.ballX + this.ballRadius >= this.width - 40) {
      this.ballSpeedX = -this.ballSpeedX;
      sfx.playHit();
    }

    // AI bot tracking (Smooth lerp)
    const botCenter = this.botX + this.paddleWidth / 2;
    if (this.ballY < this.height * 0.7) {
      if (botCenter < this.ballX - 10) {
        this.botX += this.botSpeed;
      } else if (botCenter > this.ballX + 10) {
        this.botX -= this.botSpeed;
      }
    }
    this.botX = Math.max(40, Math.min(this.width - 40 - this.paddleWidth, this.botX));

    // Collision with Player Racket (Bottom)
    const playerY = this.height - 35;
    if (
      this.ballY + this.ballRadius >= playerY &&
      this.ballY - this.ballRadius <= playerY + this.paddleHeight &&
      this.ballX >= this.playerX &&
      this.ballX <= this.playerX + this.paddleWidth &&
      this.ballSpeedY > 0
    ) {
      // Impact offset gives spin/angle
      const hitPoint = (this.ballX - (this.playerX + this.paddleWidth / 2)) / (this.paddleWidth / 2);
      this.ballSpeedX = hitPoint * 7.5;
      this.ballSpeedY = -Math.abs(this.ballSpeedY) * 1.04; // Slightly accelerate
      
      this.score += 10;
      this.streak++;
      if (this.score > this.highScore) {
        this.highScore = this.score;
        localStorage.setItem('vortex_tennis_highscore', this.highScore);
      }
      this.updateScoreboard();
      sfx.playHit();
    }

    // Collision with AI Bot Racket (Top)
    const botY = 30;
    if (
      this.ballY - this.ballRadius <= botY + this.paddleHeight &&
      this.ballY + this.ballRadius >= botY &&
      this.ballX >= this.botX &&
      this.ballX <= this.botX + this.paddleWidth &&
      this.ballSpeedY < 0
    ) {
      const hitPoint = (this.ballX - (this.botX + this.paddleWidth / 2)) / (this.paddleWidth / 2);
      this.ballSpeedX = hitPoint * 6.5;
      this.ballSpeedY = Math.abs(this.ballSpeedY);
      sfx.playHit();
    }

    // Ball out bottom (Player missed)
    if (this.ballY > this.height) {
      this.gameOver();
    }

    // Ball out top (Player won point against AI)
    if (this.ballY < 0) {
      this.score += 25;
      this.streak += 2;
      sfx.playPoint();
      this.resetBall();
      this.updateScoreboard();
    }
  }

  gameOver() {
    this.running = false;
    sfx.playOut();
    document.getElementById('overlayScore').textContent = this.score;
    document.getElementById('gameOverOverlay').style.display = 'flex';
  }

  updateScoreboard() {
    document.getElementById('gameScoreDisplay').textContent = this.score;
    document.getElementById('gameStreakDisplay').textContent = this.streak;
    document.getElementById('gameBestDisplay').textContent = this.highScore;
  }

  draw() {
    const ctx = this.ctx;

    // Grass Court Background
    const gradient = ctx.createLinearGradient(0, 0, 0, this.height);
    gradient.addColorStop(0, '#0c2e21');
    gradient.addColorStop(1, '#081f16');
    ctx.fillStyle = gradient;
    ctx.fillRect(0, 0, this.width, this.height);

    // Court White Lines
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
    ctx.lineWidth = 3;

    // Outer Court Boundary
    ctx.strokeRect(40, 20, this.width - 80, this.height - 40);

    // Service Lines & Singles lines
    ctx.strokeRect(100, 20, this.width - 200, this.height - 40);

    // Tennis Net (Middle)
    ctx.strokeStyle = '#fff';
    ctx.lineWidth = 4;
    ctx.beginPath();
    ctx.moveTo(35, this.height / 2);
    ctx.lineTo(this.width - 35, this.height / 2);
    ctx.stroke();

    // Center service line
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(this.width / 2, 70);
    ctx.lineTo(this.width / 2, this.height - 70);
    ctx.stroke();

    // Net mesh effect
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.15)';
    for (let x = 40; x < this.width - 40; x += 15) {
      ctx.beginPath();
      ctx.moveTo(x, this.height / 2 - 8);
      ctx.lineTo(x, this.height / 2 + 8);
      ctx.stroke();
    }

    // Ball Trail
    this.trail.forEach(t => {
      ctx.beginPath();
      ctx.arc(t.x, t.y, this.ballRadius * 0.8, 0, Math.PI * 2);
      ctx.fillStyle = `rgba(212, 252, 4, ${t.alpha})`;
      ctx.fill();
      t.alpha *= 0.85;
    });

    // Tennis Ball (Neon Volt with shadow)
    ctx.save();
    ctx.shadowColor = '#d4fc04';
    ctx.shadowBlur = 15;
    ctx.beginPath();
    ctx.arc(this.ballX, this.ballY, this.ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = '#d4fc04';
    ctx.fill();
    ctx.restore();

    // Player Racket (Bottom - Neon Volt)
    ctx.save();
    ctx.shadowColor = 'rgba(212, 252, 4, 0.5)';
    ctx.shadowBlur = 12;
    ctx.fillStyle = '#d4fc04';
    ctx.beginPath();
    ctx.roundRect(this.playerX, this.height - 35, this.paddleWidth, this.paddleHeight, 6);
    ctx.fill();
    ctx.restore();

    // AI Bot Racket (Top - Red/White Clay Pro)
    ctx.fillStyle = '#f87171';
    ctx.beginPath();
    ctx.roundRect(this.botX, 25, this.paddleWidth, this.paddleHeight, 6);
    ctx.fill();
  }

  loop() {
    this.update();
    this.draw();
    if (this.running) {
      requestAnimationFrame(() => this.loop());
    }
  }
}

// ==========================================
// 7. TOAST NOTIFICATION UTILITY
// ==========================================
function showToast(msg) {
  const container = document.getElementById('toast-container');
  if (!container) return;

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `<span>🎾</span> <span>${msg}</span>`;
  container.appendChild(toast);

  setTimeout(() => {
    toast.remove();
  }, 3000);
}

// ==========================================
// 8. INITIALIZATION & DOM EVENTS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
  // Init translations
  document.getElementById('langUzBtn').addEventListener('click', () => setLanguage('uz'));
  document.getElementById('langEnBtn').addEventListener('click', () => setLanguage('en'));

  // Sound toggle button
  const soundBtn = document.getElementById('soundToggleBtn');
  const soundOn = soundBtn.querySelector('.sound-icon-on');
  const soundOff = soundBtn.querySelector('.sound-icon-off');
  soundBtn.addEventListener('click', () => {
    sfx.enabled = !sfx.enabled;
    soundOn.style.display = sfx.enabled ? 'inline' : 'none';
    soundOff.style.display = sfx.enabled ? 'none' : 'inline';
    showToast(sfx.enabled ? "Ovozlar yoqildi 🔊" : "Ovozlar o'chirildi 🔇");
  });

  // Mobile navigation hamburger
  const mobileBtn = document.getElementById('mobileMenuBtn');
  const mainNav = document.getElementById('mainNav');
  mobileBtn.addEventListener('click', () => {
    mainNav.classList.toggle('open');
  });

  // Close mobile nav when clicking a link
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', () => {
      mainNav.classList.remove('open');
    });
  });

  // Cart Drawer
  const cartBtn = document.getElementById('cartBtn');
  const cartOverlay = document.getElementById('cartOverlay');
  const cartDrawer = document.getElementById('cartDrawer');
  const closeCartBtn = document.getElementById('closeCartBtn');
  const clearCartBtn = document.getElementById('clearCartBtn');
  const checkoutBtn = document.getElementById('checkoutBtn');

  function openCart() {
    cartOverlay.classList.add('open');
    cartDrawer.classList.add('open');
  }

  function closeCart() {
    cartOverlay.classList.remove('open');
    cartDrawer.classList.remove('open');
  }

  cartBtn.addEventListener('click', openCart);
  closeCartBtn.addEventListener('click', closeCart);
  cartOverlay.addEventListener('click', closeCart);

  clearCartBtn.addEventListener('click', () => {
    cart = [];
    updateCartUI();
    showToast("Savatcha tozalandi");
  });

  checkoutBtn.addEventListener('click', () => {
    if (cart.length === 0) {
      showToast("Savatchangiz bo'sh!");
      return;
    }
    sfx.playPoint();
    closeCart();
    showToast("Buyurtmangiz qabul qilindi! Menejerimiz tez orada bog'lanadi.");
    cart = [];
    updateCartUI();
  });

  // Category filter tabs
  document.querySelectorAll('.shop-filter-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const cat = e.currentTarget.getAttribute('data-category');
      window.filterShop(cat);
    });
  });

  // FAQ Accordion
  document.querySelectorAll('.acc-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.parentElement;
      item.classList.toggle('active');
    });
  });

  // Pricing toggle (Monthly vs Annual)
  const billingToggle = document.getElementById('billingPeriodToggle');
  billingToggle.addEventListener('change', () => {
    const isAnnual = billingToggle.checked;
    document.querySelectorAll('.pricing-card .amount').forEach(amountEl => {
      const val = isAnnual ? amountEl.getAttribute('data-annual') : amountEl.getAttribute('data-monthly');
      amountEl.textContent = val;
    });
  });

  // Plan select buttons
  document.querySelectorAll('.select-plan-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const plan = e.currentTarget.getAttribute('data-plan');
      sfx.playPoint();
      showToast(`"${plan}" tarifi tanlandi! Kort band qilishga o'tishingiz mumkin.`);
      document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
    });
  });

  // Coach booking buttons
  document.querySelectorAll('.coach-book-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      const coach = e.currentTarget.getAttribute('data-coach');
      sfx.playPoint();
      const coachCheckbox = document.getElementById('addonCoach');
      if (coachCheckbox) coachCheckbox.checked = true;
      showToast(`Murabbiy ${coach} mashg'ulotlar ro'yxatiga qo'shildi!`);
      document.getElementById('booking').scrollIntoView({ behavior: 'smooth' });
      initBooking();
    });
  });

  // Modal close
  document.getElementById('closeModalBtn').addEventListener('click', () => {
    document.getElementById('bookingSuccessModal').style.display = 'none';
  });

  // Match point simulation button
  const simBtn = document.getElementById('simulatePointBtn');
  if (simBtn) {
    simBtn.addEventListener('click', simulatePoint);
  }

  // Mini-game initialize
  const canvas = document.getElementById('tennisCanvas');
  const game = new TennisGame(canvas);
  document.getElementById('startGameBtn').addEventListener('click', () => game.start());
  document.getElementById('restartGameBtn').addEventListener('click', () => game.start());

  // Render initial components
  renderShop('all');
  initBooking();
});
