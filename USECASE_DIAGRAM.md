# Use Case Diagram - Sistem RFID Feedback Berbasis IoT

## Deskripsi Sistem

Sistem adalah aplikasi pembelajaran interaktif berbasis IoT yang menggunakan:
- **Input 1: Tombol Fisik** - Untuk memilih pertanyaan/rambu lalu lintas
- **Input 2: Kartu RFID** - Untuk memberikan jawaban dengan mencocokkan kartu yang benar

---

## Use Case Diagram (PlantUML)

```plantuml
@startuml RFID_Feedback_System
!theme plain
title Use Case Diagram - Sistem RFID Feedback IoT

left to right direction

actor "User/Peserta" as User
actor "Tombol Fisik\n(IoT Button)" as Button
actor "Kartu RFID\n(RFID Card)" as RFIDCard
actor "Speaker\n(Audio Output)" as Speaker
actor "Display/Monitor\n(Video Output)" as Monitor

rectangle "Sistem RFID Feedback" {
  usecase "UC1: Memilih Slot\n(Pertanyaan/Rambu)" as UC1
  usecase "UC2: Memutar Clue Audio\n(Petunjuk Suara)" as UC2
  usecase "UC3: Menampilkan Video\nPetunjuk Visual" as UC3
  usecase "UC4: Membaca Kartu RFID" as UC4
  usecase "UC5: Memvalidasi Jawaban\n(RFID Matching)" as UC5
  usecase "UC6: Memutar Success Sound\n(Suara Benar)" as UC6
  usecase "UC7: Menampilkan Video\nJawaban Benar" as UC7
  usecase "UC8: Memutar Error Sound\n(Suara Salah)" as UC8
  usecase "UC9: Reset ke Status Idle" as UC9
}

User --> Button
Button --> UC1
UC1 --> UC2
UC2 --> Speaker

UC1 --> UC3
UC3 --> Monitor

User --> RFIDCard
RFIDCard --> UC4
UC4 --> UC5

UC5 -->|Jawaban Benar| UC6
UC6 --> Speaker
UC6 --> UC7
UC7 --> Monitor

UC5 -->|Jawaban Salah| UC8
UC8 --> Speaker
UC8 --> UC9

UC7 --> UC9
UC9 --> UC1

note right of UC1
  State: idle -> listening
  Beralih ke slot pertanyaan
  yang dipilih
end note

note right of UC2
  Memutar file audio clue
  sesuai slot yang dipilih
  Format: /sounds/clue-*.mp3
end note

note right of UC3
  Menampilkan video petunjuk
  saat user mendengarkan clue
  Playback rate: 0.6x
end note

note right of UC4
  Membaca data kartu RFID
  Contoh ID: CARD_RAMBU,
  CARD_PUTAR
end note

note right of UC5
  Membandingkan ID kartu RFID
  dengan correctCardId slot
  Validasi matching
end note

note right of UC6
  State: success_waiting -> success
  Audio success: /sounds/success.m4a
end note

note right of UC7
  Memutar video jawaban benar
  File: /videos/rambu-benar.mp4
  File: /videos/rambu-benar2.mp4
end note

note right of UC8
  State: error
  Audio error: /sounds/error.mp3
  Playback rate: 1.25x
end note

note right of UC9
  State kembali ke idle
  Siap menerima input berikutnya
end note
```

---

## Flow State Machine

```
┌─────────────────────────────────────────────────────────────┐
│                    State Diagram                             │
└─────────────────────────────────────────────────────────────┘

                    ┌─────────┐
                    │  IDLE   │◄─────────────────┐
                    └────┬────┘                  │
                         │                       │
            [Tombol ditekan]                     │
                         │                       │
                         ▼                       │
                ┌──────────────────┐             │
                │   LISTENING      │             │
                │ (Clue Audio + Video)           │
                └────┬─────────────┘             │
                     │                           │
        [Audio Clue selesai]                     │
                     │                           │
                     ▼                           │
              ┌──────────────┐                   │
              │ Ready RFID   │                   │
              │  Scan Wait   │                   │
              └──┬───────┬───┘                   │
                 │       │                       │
    [RFID Match] │       │ [RFID No Match]       │
                 │       │                       │
                 ▼       ▼                       │
          ┌──────────┐ ┌─────────┐              │
          │ SUCCESS_ │ │ ERROR   │              │
          │ WAITING  │ └────┬────┘              │
          └────┬─────┘      │                   │
               │     [Error Sound]              │
               │      [selesai]                 │
               │            │                   │
               ▼            │                   │
          ┌──────────┐      │                   │
          │ SUCCESS  │      │                   │
          │ (Play    │      │                   │
          │  Video)  │      │                   │
          └────┬─────┘      │                   │
               │            │                   │
          [Video End]       │                   │
               │            │                   │
               └────────┬───┘                   │
                        │                       │
                        └───────────────────────┘
```

---

## Functional Requirements Matrix

| No | Use Case | Input | Actor | Output | Business Logic |
|----|----|----|----|----|----|
| UC1 | Memilih Slot | Tombol Fisik | User + Button | Slot Aktif | Ganti pertanyaan, play clue |
| UC2 | Memutar Clue Audio | Slot Selection | System | Suara (Speaker) | Load audio sesuai slot ID |
| UC3 | Video Petunjuk Visual | Slot Active | System | Video (Monitor) | Play video dengan kecepatan 0.6x |
| UC4 | Membaca Kartu RFID | Kartu RFID | RFIDCard | Card ID String | Capture RFID data |
| UC5 | Validasi Jawaban | Card ID + Slot | System | Boolean Match | Compare scannedCardId == correctCardId |
| UC6 | Success Sound | Valid RFID | System | Suara Success (Speaker) | Play /sounds/success.m4a |
| UC7 | Video Jawaban Benar | Valid RFID | System | Video Success (Monitor) | Play video sesuai slot |
| UC8 | Error Sound | Invalid RFID | System | Suara Error (Speaker) | Play /sounds/error.mp3 (1.25x) |
| UC9 | Reset Sistem | Video Selesai | System | State Idle | Return ke initial state |

---

## Komponen IoT yang Digunakan

```
┌──────────────────────────────────────────────────────┐
│           INPUT DEVICES (IoT)                        │
├──────────────────────────────────────────────────────┤
│ 1. Tombol Fisik (Physical Button)                    │
│    - Trigger: Memilih slot pertanyaan                │
│    - Signal: Digital input                           │
│    - Connection: GPIO/Serial ke Sistem               │
│                                                      │
│ 2. Reader RFID (RFID Reader)                         │
│    - Trigger: Scan kartu RFID                        │
│    - Output: Card ID (string)                        │
│    - Connection: Serial/USB ke Sistem                │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│           OUTPUT DEVICES (IoT)                       │
├──────────────────────────────────────────────────────┤
│ 1. Speaker (Audio Output)                            │
│    - Output: Clue Audio, Success Sound, Error Sound  │
│    - Format: MP3, M4A                                │
│    - Control: HTML5 Audio API                        │
│                                                      │
│ 2. Monitor/Display (Video Output)                    │
│    - Output: Video Petunjuk, Video Jawaban           │
│    - Format: MP4                                     │
│    - Control: HTML5 Video API                        │
└──────────────────────────────────────────────────────┘

┌──────────────────────────────────────────────────────┐
│           WEB APPLICATION (Interface)                │
├──────────────────────────────────────────────────────┤
│ - Next.js Frontend untuk kontrol dan orchestration   │
│ - Tidak ada simulasi (fokus pada device real)        │
│ - Handle state management & event orchestration      │
│ - Integrasi dengan hardware inputs melalui           │
│   serial communication atau USB connection           │
└──────────────────────────────────────────────────────┘
```

---

## Alur Proses Lengkap

### Skenario 1: Jawaban Benar
```
1. User menekan Tombol Fisik (Slot 1: "Dilarang Parkir")
   ↓
2. Sistem state berubah: idle → listening
   ↓
3. Sistem memutar audio clue: /sounds/clue-rambu.mp3
   ↓
4. Sistem menampilkan video visual di monitor (0.6x speed)
   ↓
5. Audio clue selesai → User siap scan kartu RFID
   ↓
6. User scan kartu RFID yang benar (CARD_RAMBU)
   ↓
7. Sistem validasi: scannedCardId == activeSlot.correctCardId ✓
   ↓
8. Sistem state: listening → success_waiting
   ↓
9. Sistem memutar success sound: /sounds/success.m4a
   ↓
10. Success sound selesai → Sistem state: success_waiting → success
    ↓
11. Sistem memutar video jawaban benar: /videos/rambu-benar.mp4
    ↓
12. Video selesai → Sistem state: success → idle
    ↓
13. Siap untuk input berikutnya
```

### Skenario 2: Jawaban Salah
```
1. User menekan Tombol Fisik (Slot 1: "Dilarang Parkir")
   ↓
2. Sistem memutar audio clue & menampilkan video
   ↓
3. User scan kartu RFID yang salah (CARD_PUTAR)
   ↓
4. Sistem validasi: scannedCardId != activeSlot.correctCardId ✗
   ↓
5. Sistem state: listening → error
   ↓
6. Sistem memutar error sound: /sounds/error.mp3 (1.25x speed)
   ↓
7. Error sound selesai → Sistem state: error → idle
   ↓
8. User dapat mencoba lagi dengan tombol yang sama atau tombol lain
```

---

## Notes

### ✅ Inclusion/Exclusion
- ✅ **Included**: Input device (Tombol + RFID), Audio output, Video output
- ❌ **Excluded**: Simulasi di web (fokus pada device real)
- ❌ **Excluded**: Manual trigger button di UI (hanya physical button)
- ❌ **Excluded**: Manual RFID input di UI (hanya physical reader)

### 🔧 Teknologi yang Digunakan
- **Frontend**: Next.js 16.1.1, React 19.2.3, TypeScript 5
- **Audio/Video API**: HTML5 Audio/Video elements
- **Hardware Interface**: Serial communication (via Node.js backend atau WebSerial API)
- **State Management**: React useState hooks

### 📱 Devices yang Terkoneksi
- Physical Button (GPIO/Serial Input)
- RFID Reader (Serial/USB Input) 
- Speaker (Audio Output)
- Monitor/Display (Video Output)
