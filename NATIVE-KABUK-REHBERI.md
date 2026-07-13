# 📱 Native Kabuk — Kapalıyken Çalan Ezan (Capacitor)

**Durum:** Kod tarafı HAZIR. `index.html`'e kapalıyken ezan kuran fonksiyon
(`scheduleNativeEzan`) zaten gömüldü — web'de sessizce atlanır, native'de çalışır.
`capacitor.config.json` ve `package.json` da hazır. Sana **sadece derleme** kaldı.

> ⚠️ Native app'i Claude derleyemez — bu, **senin bilgisayarında** Android Studio /
> Xcode ile yapılır. Aşağıdaki komutları sırayla çalıştıracaksın.

---

## Ne hazır (Claude tarafı)
- `index.html` → `scheduleNativeEzan(timings)` gömülü. `scheduleAllEzan` her çağrıldığında
  otomatik çalışır. `window.Capacitor.isNativePlatform()` false ise (web) hiçbir şey yapmaz.
  Native'de her vakit için `repeats:'day'` bildirim + ezan sesi kurar (kapalıyken bile).
- `capacitor.config.json` → appId `com.ersenbox.kurankerim`, webDir `www`.
- `package.json` → gerekli Capacitor paketleri.

## Senin yapacakların (bilgisayarında, tek sefer)

### 0) Gereksinim
- Node.js
- Android: **Android Studio** · iOS: **Mac + Xcode**

### 1) Klasoru kur
    mkdir kuran-native && cd kuran-native
    # Bu 2 dosyayi buraya koy: package.json, capacitor.config.json
    mkdir www
    # www/ icine: index.html + icons/ + public/ (audio dahil) - HEPSINI oldugu gibi kopyala
    npm install

### 2) Ezan ses dosyalarini ekle (ozel ses)
- **Android:** `android/app/src/main/res/raw/` icine koy: `ezan.wav` ve `sabah.wav`
  (kucuk harf, bosluksuz). Kodda bu isimler kullaniliyor.
- **iOS:** Xcode'da projeye `ezan.wav` / `sabah.wav` ekle (Target -> Build Phases ->
  Copy Bundle Resources).
- Not: Android bildirim sesi icin **.wav** en guvenlisidir.

### 3) Platformu ekle ve derle
    npx cap add android          # ve/veya:  npx cap add ios
    npx cap sync
    npx cap open android         # Android Studio acilir -> Run (telefonda test)
    # iOS:  npx cap open ios  -> Xcode -> gercek cihazda calistir

Ilk acilista uygulama bildirim izni ister -> ver. Sonra namaz sekmesini bir kez ac
(vakitler yuklensin) -> bildirimler kurulur. **Telefonu kilitle, uygulamayi kapat ->
vakit gelince ezan calar.**

### 4) Magazaya yukleme (opsiyonel)
- Android: Android Studio -> Build -> Generate Signed Bundle/APK -> imzala -> Google Play.
- iOS: Xcode -> Product -> Archive -> App Store Connect.

### 5) Kodu guncellersen
`www/index.html`'i yeni surumle degistir -> `npx cap sync` -> tekrar derle.

---

## Onemli gercekler (durust)
- **Web PWA'n aynen kalir** (Cloudflare); bu onun native ikizidir, ayni koddan cikar.
- Kapaliyken calan ezan **sadece bu native surumde** olur - Diyanet/Ezan Vakti gibi
  tum ezan uygulamalari da native'dir, PWA degil.
- iOS'ta Apple Developer hesabi ($99/yil) magazaya cikmak icin gerekir; kendi cihazinda
  test icin gerekmez.
- Ozel ezan sesinin bildirimde calmasi Android surumune gore degisebilir; kilit ekrani
  bildirim + ses kanali (channelId:'ezan') ayarini Android Studio'da dogrula.
