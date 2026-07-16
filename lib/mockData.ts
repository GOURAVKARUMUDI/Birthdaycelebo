export interface Memory {
  id: string;
  title: string;
  type: "image" | "video" | "letter" | "trip" | "date";
  url: string;
  caption: string;
  date: string;
}

export interface TimelineEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  mediaUrl?: string;
  mediaType?: "image" | "video";
}

export interface Song {
  id: string;
  title: string;
  artist: string;
  url: string;
}

export interface VoiceNote {
  id: string;
  title: string;
  url: string;
  duration: string;
}

export interface Gift {
  id: string;
  giftType: "photo" | "video" | "letter" | "voice_note" | "coupon" | "secret_message" | "qr_code" | "game";
  title: string;
  content: string;
  isOpened: boolean;
}

export interface ChatMessage {
  id: string;
  sender: "me" | "them";
  text: string;
  timestamp: string;
  reactions: string[];
}

export interface ProjectConfig {
  recipientName: string;
  title: string;
  mascot: "giraffe" | "panda" | "cat" | "koala";
  theme: "cute" | "luxury" | "romantic" | "minimal" | "galaxy";
  countdownDate: string;
  bgMusicUrl: string;
  passwords: {
    friend?: string;
    relationship?: string;
    family?: string;
  };
  letterContent: string;
  memories: Memory[];
  timeline: TimelineEvent[];
  playlist: Song[];
  voiceNotes: VoiceNote[];
  gifts: Gift[];
  chats: ChatMessage[];
}

export const DEFAULT_PROJECT_CONFIG: ProjectConfig = {
  recipientName: "Gourav",
  title: "A Special Surprise For You ❤️",
  mascot: "giraffe",
  theme: "cute",
  countdownDate: new Date(Date.now() + 1000 * 60 * 60 * 24 * 5).toISOString(), // 5 days from now
  bgMusicUrl: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3", // Royalty-free instrumental
  passwords: {
    relationship: "love123",
    friend: "friend123",
    family: "family123",
  },
  letterContent: `Dear Gourav,

Happy Birthday! 🎂

I wanted to make something truly unique for you this year. This digital scrapbook is filled with some of our best memories, songs we love, messages we've shared, and minor surprises.

Thank you for always being there, for the late-night talks, the countless jokes, and the random adventures. You make every ordinary day feel like a special occasion.

I hope this brings a smile to your face today. Explore the cards, play the games, unlock the gifts, and enjoy your special day!

With love,
Balaji`,
  memories: [
    {
      id: "mem-1",
      title: "First Meeting Cafe",
      type: "date",
      url: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?q=80&w=800&auto=format&fit=crop",
      caption: "Where it all began. The coffee was cold, but the conversation lasted for hours.",
      date: "2024-04-12",
    },
    {
      id: "mem-2",
      title: "Beach Roadtrip Sunset",
      type: "trip",
      url: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?q=80&w=800&auto=format&fit=crop",
      caption: "Chasing waves and singing off-key to retro songs in the car.",
      date: "2024-08-20",
    },
    {
      id: "mem-3",
      title: "Late Night Coding Sessions",
      type: "image",
      url: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?q=80&w=800&auto=format&fit=crop",
      caption: "Solving compiler errors at 3 AM while drinking bubble tea.",
      date: "2025-01-15",
    },
    {
      id: "mem-4",
      title: "The Surprise Balloon Fight",
      type: "date",
      url: "https://images.unsplash.com/photo-1530103862676-de8c9debad1d?q=80&w=800&auto=format&fit=crop",
      caption: "You thought it was a formal dinner, but it was a water balloon battle!",
      date: "2025-05-04",
    },
  ],
  timeline: [
    {
      id: "time-1",
      title: "First Hello",
      date: "April 12, 2024",
      description: "We crossed paths at the local coffee house. We talked about web design and animations for hours.",
      mediaUrl: "https://images.unsplash.com/photo-1498804103079-a6351b050096?q=80&w=600&auto=format&fit=crop",
      mediaType: "image",
    },
    {
      id: "time-2",
      title: "First Roadtrip",
      date: "August 20, 2024",
      description: "Packed bags and drove 5 hours to see the ocean. We spent the night stargazing on the beach.",
      mediaUrl: "https://images.unsplash.com/photo-1469854523086-cc02fe5d8800?q=80&w=600&auto=format&fit=crop",
      mediaType: "image",
    },
    {
      id: "time-3",
      title: "The Major Milestone",
      date: "January 15, 2025",
      description: "Successfully shipped our first collaborative open-source project after three sleepless nights.",
      mediaUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=600&auto=format&fit=crop",
      mediaType: "image",
    },
    {
      id: "time-4",
      title: "Today",
      date: "July 16, 2026",
      description: "Celebrating your special day with this digital scrapbook. May this year bring you endless joy and code compiles on the first try!",
      mediaUrl: "https://images.unsplash.com/photo-1464349095431-e9a21285b5f3?q=80&w=600&auto=format&fit=crop",
      mediaType: "image",
    },
  ],
  playlist: [
    {
      id: "song-1",
      title: "Sunny Days (Lofi Edit)",
      artist: "ChilledCow / Lofi Girl",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-1.mp3",
    },
    {
      id: "song-2",
      title: "Midnight Walk",
      artist: "Pastel Dreams",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-2.mp3",
    },
    {
      id: "song-3",
      title: "Acoustic Smiles",
      artist: "Guitar Nomad",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-3.mp3",
    },
  ],
  voiceNotes: [
    {
      id: "vn-1",
      title: "A Wish For You",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-4.mp3",
      duration: "0:45",
    },
    {
      id: "vn-2",
      title: "Laughter Compilation",
      url: "https://www.soundhelix.com/examples/mp3/SoundHelix-Song-5.mp3",
      duration: "1:12",
    },
  ],
  gifts: [
    {
      id: "gift-1",
      giftType: "coupon",
      title: "Free Coffee Voucher",
      content: "Redeemable anytime for one massive double-shot iced latte with extra caramel at your favorite cafe! ☕",
      isOpened: false,
    },
    {
      id: "gift-2",
      giftType: "secret_message",
      title: "A Hidden Truth",
      content: "Secret Message: I actually accidentally deleted half of our first codebase, but spent the night rewriting it from memory so you wouldn't notice. Now you know! 😉",
      isOpened: false,
    },
    {
      id: "gift-3",
      giftType: "qr_code",
      title: "Golden Ticket QR",
      content: "https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=Golden+Ticket+Redeemed+:+Dinner+on+me!",
      isOpened: false,
    },
    {
      id: "gift-4",
      giftType: "photo",
      title: "Secret Polaroid",
      content: "https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?q=80&w=800&auto=format&fit=crop",
      isOpened: false,
    },
  ],
  chats: [
    {
      id: "chat-1",
      sender: "them",
      text: "Hey! Are you free today?",
      timestamp: "10:15 AM",
      reactions: ["👍"],
    },
    {
      id: "chat-2",
      sender: "me",
      text: "Yeah, just fixing some CSS animations. What's up?",
      timestamp: "10:16 AM",
      reactions: [],
    },
    {
      id: "chat-3",
      sender: "them",
      text: "I was thinking we should do a roadtrip this weekend. Beaches, lofi music, maybe code under the stars?",
      timestamp: "10:18 AM",
      reactions: ["❤️", "✨"],
    },
    {
      id: "chat-4",
      sender: "me",
      text: "OMG YES! I'll pack the bubble tea and the bug repellent.",
      timestamp: "10:20 AM",
      reactions: ["😂"],
    },
    {
      id: "chat-5",
      sender: "them",
      text: "Deal! See you tomorrow morning. Don't forget your headphones!",
      timestamp: "10:21 AM",
      reactions: ["🎉"],
    },
  ],
};
