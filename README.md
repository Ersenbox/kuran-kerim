# Kuran-ı Kerim PWA — Deployment Guide

## 📁 Dosya Yapısı

```
/
├── index.html          ← Güncellenmiş HTML (PWA meta tags + responsive CSS)
├── manifest.json       ← Web App Manifest (PWABuilder uyumlu)
├── sw.js               ← Service Worker (offline cache + install prompt)
├── wrangler.toml       ← Cloudflare Workers config
├── icons/
│   ├── icon-72.png
│   ├── icon-96.png
│   ├── icon-128.png
│   ├── icon-144.png
│   ├── icon-152.png
│   ├── icon-192.png     ← Ana ikon
│   ├── icon-384.png
│   ├── icon-512.png     ← Store ikonu
│   ├── maskable-192.png ← Android adaptive icon
│   └── maskable-512.png
└── screenshots/
    ├── screenshot-phone.png    ← 1080×1920 (PlayStore için)
    └── screenshot-tablet.png  ← 1280×800 (PlayStore için)
```

---

## 🚀 Cloudflare Workers'a Deploy

### Adım 1 — GitHub'a yükle
Tüm dosyaları kuran repo'na yükle (aynı klasör yapısıyla).

### Adım 2 — Cloudflare Pages ayarı
Cloudflare Dashboard → Pages → kuran-kerim projesi:
- Build command: (boş bırak)
- Output directory: `.` (root)

### Adım 3 — Test
Deploy tamamlandıktan sonra: https://pwabuilder.com
Site URL: `kuran-kerim.bakiciersen.workers.dev`
Beklenen skor: **45+ / 45** (tüm kritik hatalar düzeldi)

---

## 📱 PWABuilder → APK Adımları

1. https://pwabuilder.com git
2. Site URL'ini gir → skor **45+** görmelisin
3. "Package for Stores" → **Android** seç
4. APK indirip Google Play'e yükleyebilirsin

---

## 📱 Tablet & Responsive Durum

| Ekran | Boyut | Durum |
|-------|-------|-------|
| Small Phone | 320-375px | ✅ Tek kolon, optimize edildi |
| Normal Phone | 375-768px | ✅ 2 kolon grid, bottom nav |
| Landscape Phone | max-height 500px | ✅ Kompakt nav |
| Tablet Portrait | 768-1024px | ✅ 3 kolon grid, büyük nav |
| Tablet Landscape | 1024px+ | ✅ 4 kolon, header nav aktif |
| Desktop | 1025px+ | ✅ Full layout, bottom nav gizli |

---

## ✅ PWABuilder Sorun Çözüm Özeti

| Sorun | Durum |
|-------|-------|
| Fix the links to your icons | ✅ Tüm ikonlar doğru path ile manifest'e eklendi |
| Fix the icon types | ✅ type: "image/png" eklendi |
| Add a service worker | ✅ sw.js oluşturuldu, cache + offline |
| Fix the icon sizes | ✅ 72,96,128,144,152,192,384,512 hepsi mevcut |
| Add screenshots | ✅ Phone + Tablet screenshots eklendi |
| Maskable icons | ✅ maskable-192.png ve maskable-512.png eklendi |

**Beklenen yeni skor: 45/45 🎯**
