# Authenticator — Telefona Kurulum Rehberi

Cihazda lokal çalışan TOTP doğrulayıcı (RFC 6238). Anahtarlar **cihazdan çıkmaz**, hiçbir ağ isteği yapılmaz.

Paket içeriği:
```
index.html              → uygulama
manifest.json           → PWA tanımı (ikon, isim, tam ekran)
sw.js                   → service worker (çevrimdışı çalışma)
icon.svg / icon-*.png   → ikonlar
apple-touch-icon.png    → iOS ana ekran ikonu
```

---

## Yol 1 — PWA olarak kur (Android + iOS, en kolay)

Service worker `file://` üzerinde çalışmaz, HTTPS ister. En kolay ücretsiz HTTPS barındırma: **GitHub Pages**.

1. github.com/EMRECAN-1907 hesabında yeni bir repo aç (örn. `authenticator`). Public olsun.
2. Bu klasördeki **tüm dosyaları** repoya yükle (Add file → Upload files → sürükle-bırak → Commit).
3. Repo → **Settings → Pages** → "Build and deployment" → Source: **Deploy from a branch** → Branch: `main` / klasör: `/ (root)` → Save.
4. 1–2 dakika sonra adresin hazır: `https://emrecan-1907.github.io/authenticator/`
5. Bu adresi **telefonun tarayıcısında** aç:
   - **Android (Chrome):** Menü (⋮) → **Uygulamayı yükle** / **Ana ekrana ekle**.
   - **iOS (Safari):** Paylaş düğmesi → **Ana Ekrana Ekle**.

Artık ikonu olan, tam ekran, **çevrimdışı** çalışan bir uygulaman var. İlk açılıştan sonra interneti kapatsan bile kodlar üretilir.

> İpucu: Uygulamada değişiklik yapınca `sw.js` içindeki `authenticator-v1` sürümünü `v2` yap; yoksa telefon eski sürümü önbellekten gösterir.

---

## Yol 2 — Gerçek APK (yalnızca Android)

Tamamen çevrimdışı, barındırma gerektirmeyen kurulu uygulama istersen:

**A) Capacitor (HTML doğrudan APK'nin içine gömülür)** — Windows + Android Studio
```bash
npm create @capacitor/app
# www/ klasörüne bu paketteki dosyaları kopyala
npm i
npx cap add android
npx cap sync
npx cap open android   # Android Studio açılır → Build > Build APK
```

**B) PWABuilder (en hızlı)** — Önce Yol 1 ile PWA adresini yayınla, sonra:
1. https://www.pwabuilder.com adresine PWA adresini gir.
2. **Package For Stores → Android** → APK indir.
3. APK'yi telefona at, "Bilinmeyen kaynaklar"a izin verip kur.

---

## iOS için not

Windows makinen olduğu için gerçek `.ipa` üretmek/sideload etmek (Mac + Xcode gerektirir) pratik değil. iOS'ta önerilen yol **Yol 1 → Safari → Ana Ekrana Ekle**. Görünüm ve davranış kurulu uygulama gibidir.

iOS bazen kullanılmayan PWA'ların depolamasını temizleyebilir; bu yüzden ileride **şifreli yedek/dışa aktarma** eklemek iyi olur (anahtarları kaybetmemek için).

---

## Güvenlik

- Uygulama hiçbir ağ isteği yapmaz; host etsen bile gizli anahtarlar tarayıcının lokal deposunda kalır.
- Anahtarlar şu an **düz** saklanıyor. İstersen PIN/parola ile kasayı kilitleyebiliriz (Web Crypto: PBKDF2 + AES-GCM).
