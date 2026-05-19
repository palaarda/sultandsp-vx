# Sultan V.X — Cihaz Görselleri

Bu klasör, sahnede gösterilen cihazların **arka plan görsellerini** içerir
(Amplitube tarzı: gerçek pedal/amp görseli + knoblar üstüne overlay).

## Dosya Adlandırma

Her dosyanın adı, `src/lib/data/fxLibrary.ts` içindeki `device.id` ile
**bire bir eşleşmeli**. Örneğin:

| device.id           | dosya adı                |
| ------------------- | ------------------------ |
| `boss-dd8`          | `boss-dd8.png`           |
| `ts808`             | `ts808.png`              |
| `rat-distortion`    | `rat-distortion.png`     |
| `nam-jcm800`        | `nam-jcm800.png`         |
| `cab-4x12-v30`      | `cab-4x12-v30.png`       |

## Görsel Standartları

- **Format**: PNG (şeffaf arka plan tercih edilir)
- **Çözünürlük**: En az **800 px** genişlik (retina display için)
- **Açı**: Düz (top-down) görünüm — knoblar, LED ve footswitch net görünmeli
- **Knoblar**: Görselde olabilir (süslü zemin) veya **boş yuvalar** olarak
  bırakılabilir. Bizim Knob bileşenimiz üstüne her hâlükârda overlay olacak.
- **Telif**: Telif hakkı bulunmayan, kendi render'larınız veya
  AI-generated görseller kullanın. Gerçek marka fotoğrafları sorun yaratabilir.

## Layout Tanımlama

Görseli koyduktan sonra `src/lib/data/deviceLayouts.ts` içinde knob
konumlarını yüzde olarak tanımlayın:

```ts
'boss-dd8': {
  image: bossDd8Image,
  aspectRatio: 0.65,
  knobDefaultSize: 42,
  paramPositions: {
    'time':     { x: 30, y: 22 },  // x,y = görselin yüzdesi (0-100)
    'feedback': { x: 70, y: 22 },
    // ...
  },
  led: { x: 50, y: 56, size: 8 },
  footswitch: { x: 50, y: 82, size: 50 },
},
```

Layout tanımlanmamış cihazlar otomatik olarak **eski jenerik** render'a
düşer (fallback). Yani bir cihazı acele etmeden, görsel hazır oldukça
ekleyebilirsiniz.
