import cyberpunkHeroImg from '../assets/images/vudu_hero_cyberpunk_1791236259484.jpg';
import cartoonAdventureImg from '../assets/images/vudu_cartoon_adventure_1791236271998.jpg';
import musicConcertImg from '../assets/images/vudu_music_concert_1791236282122.jpg';
import movieThrillerImg from '../assets/images/vudu_movie_thriller_1791236292711.jpg';

export interface EpisodeData {
  id: string;
  episodeNumber: number;
  title: string;
  duration: string;
  synopsis: string;
  thumbnailUrl: string;
  videoUrl: string;
}

export interface SeasonData {
  seasonNumber: number;
  title: string;
  episodes: EpisodeData[];
}

export interface MediaItem {
  id: string;
  title: string;
  type: 'movie' | 'cartoon' | 'music';
  genres: string[];
  year: number;
  duration: string;
  rating: number;
  ageRating: string;
  badge: string;
  matchScore: number;
  synopsis: string;
  posterUrl: string;
  backdropUrl: string;
  videoUrl?: string;
  artist?: string;
  album?: string;
  cast?: string[];
  director?: string;
  featured?: boolean;
  lyrics?: string[];
  isSeries?: boolean;
  seasons?: SeasonData[];
}

export const GENRE_LIST = [
  'All Genres',
  'Action',
  'Sci-Fi',
  'Animation',
  'Fantasy',
  'Mystery',
  'Thriller',
  'Electronic',
  'Synthwave',
  'Hip-Hop',
  'Rock',
  'Pop',
  'Adventure'
];

export const MEDIA_CATALOG: MediaItem[] = [
  // 1. Cyberfall 2099 (Movie - Featured)
  {
    id: 'cyberfall-2099',
    title: 'Cyberfall 2099',
    type: 'movie',
    genres: ['Action', 'Sci-Fi', 'Thriller'],
    year: 2026,
    duration: '2h 14m',
    rating: 4.9,
    ageRating: 'PG-13',
    badge: '4K Ultra HD',
    matchScore: 99,
    synopsis: 'In a rain-drenched neon metropolis run by synthetic dynasties, a rogue augmented courier uncovers an omnipotent AI sequence that could sever humanity’s neural interface forever.',
    posterUrl: cyberpunkHeroImg,
    backdropUrl: cyberpunkHeroImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    cast: ['Kaelen Vance', 'Lyra Sterling', 'David Zhao', 'Elena Rostova'],
    director: 'Marcus Thorne',
    featured: true
  },

  // 2. Chronicles of Aetheria (Series with Seasons & Episodes)
  {
    id: 'chronicles-of-aetheria',
    title: 'Chronicles of Aetheria',
    type: 'cartoon',
    isSeries: true,
    genres: ['Animation', 'Fantasy', 'Adventure'],
    year: 2026,
    duration: '2 Seasons · 16 Eps',
    rating: 4.9,
    ageRating: 'TV-PG',
    badge: 'HDR10+',
    matchScore: 98,
    synopsis: 'A fearless sky-forger apprentice and her sentient crystal automaton soar through the celestial floating islands of Aetheria to stop a dormant eclipse dragon from awakening.',
    posterUrl: cartoonAdventureImg,
    backdropUrl: cartoonAdventureImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    cast: ['Aria Montgomery', 'Finnian Cruz', 'Talia Voss'],
    director: 'Julian Delacroix',
    featured: true,
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Awakening of the Sky Forge',
        episodes: [
          {
            id: 'aetheria-s1-e1',
            episodeNumber: 1,
            title: 'The Spark Above Clouds',
            duration: '28m',
            synopsis: 'Aria discovers an ancient sentient chronos crystal buried within the forbidden floating mines of Sol.',
            thumbnailUrl: cartoonAdventureImg,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          {
            id: 'aetheria-s1-e2',
            episodeNumber: 2,
            title: 'Winds of the Iron Citadel',
            duration: '26m',
            synopsis: 'Sky-pirate raiders ambush the floating sanctuary; Aria and Finnian must unleash their glider prototypes.',
            thumbnailUrl: cartoonAdventureImg,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          },
          {
            id: 'aetheria-s1-e3',
            episodeNumber: 3,
            title: 'Song of the Crystal Heart',
            duration: '31m',
            synopsis: 'Deep inside the crystalline vortex, the guardian dragon begins to stir from centuries of deep stasis.',
            thumbnailUrl: cartoonAdventureImg,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          },
          {
            id: 'aetheria-s1-e4',
            episodeNumber: 4,
            title: 'Flight of the Eclipse Wing',
            duration: '34m',
            synopsis: 'The season finale battle over the celestial rift decides the fate of all sky colonies.',
            thumbnailUrl: cartoonAdventureImg,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          },
        ],
      },
      {
        seasonNumber: 2,
        title: 'Season 2: The Abyssal Horizon',
        episodes: [
          {
            id: 'aetheria-s2-e1',
            episodeNumber: 1,
            title: 'Beyond the Cloud Barrier',
            duration: '30m',
            synopsis: 'Aria leads an expedition below the cloud layer to search for lost sky-forgers of the First Dynasty.',
            thumbnailUrl: cartoonAdventureImg,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          {
            id: 'aetheria-s2-e2',
            episodeNumber: 2,
            title: 'Echoes of the Sun Realm',
            duration: '29m',
            synopsis: 'The team encounters an uncharted civilization powered by dark solar magnetic flares.',
            thumbnailUrl: cartoonAdventureImg,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          },
          {
            id: 'aetheria-s2-e3',
            episodeNumber: 3,
            title: 'Celestial Convergence',
            duration: '35m',
            synopsis: 'Two worlds collide as the ancient engines of Aetheria activate simultaneously.',
            thumbnailUrl: cartoonAdventureImg,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          },
        ],
      },
    ],
  },

  // 3. Electric Symphony Live (Music - Featured)
  {
    id: 'electric-symphony-live',
    title: 'Electric Symphony (Live at Neo-Tokyo)',
    type: 'music',
    genres: ['Electronic', 'Synthwave', 'Pop'],
    year: 2026,
    duration: '1h 42m',
    rating: 4.8,
    ageRating: 'All Ages',
    badge: 'Dolby Atmos',
    matchScore: 97,
    synopsis: 'The Midnight Circuit transforms 80,000 stadium fans into an ocean of pulse-synchronized light in this record-breaking visual concert extravaganza.',
    posterUrl: musicConcertImg,
    backdropUrl: musicConcertImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    artist: 'The Midnight Circuit',
    album: 'Live at Neo-Tokyo Dome',
    featured: true,
    lyrics: [
      'Neon veins across the avenue',
      'Electric shadows falling into you',
      'Feel the bassline tear the night in two',
      'We will never sleep under skies of blue',
      'Hold the lightning, feel the thunder spark!'
    ]
  },

  // 4. Shadows of Nocturne (Movie - Thriller)
  {
    id: 'shadows-of-nocturne',
    title: 'Shadows of Nocturne',
    type: 'movie',
    genres: ['Mystery', 'Thriller', 'Action'],
    year: 2025,
    duration: '1h 56m',
    rating: 4.8,
    ageRating: 'TV-MA',
    badge: '4K Ultra HD',
    matchScore: 95,
    synopsis: 'A seasoned private investigator unravels a cryptic web of high-level blackmail and vanished memories amidst rain-slicked Venetian streets.',
    posterUrl: movieThrillerImg,
    backdropUrl: movieThrillerImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    cast: ['Vincent Morales', 'Camille Laurent', 'Sean O’Connor'],
    director: 'Claire Beaumont',
    featured: false
  },

  // 5. Apex Horizon: Deep Orbit (Movie)
  {
    id: 'apex-horizon',
    title: 'Apex Horizon: Deep Orbit',
    type: 'movie',
    genres: ['Sci-Fi', 'Adventure'],
    year: 2025,
    duration: '2h 28m',
    rating: 4.7,
    ageRating: 'PG-13',
    badge: 'IMAX Enhanced',
    matchScore: 94,
    synopsis: 'Deep space explorers stationed at Saturn’s outer rings encounter a gravitational anomaly broadcasting mathematical prime sequences from another galaxy.',
    posterUrl: cyberpunkHeroImg,
    backdropUrl: cyberpunkHeroImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    cast: ['Maya Lin', 'Caleb Mercer', 'Dr. Soren Drake'],
    director: 'Hans Veldt',
    featured: false
  },

  // 6. Mecha Kittens: Hyperdrive (Series)
  {
    id: 'mecha-kittens',
    title: 'Mecha Kittens: Hyperdrive',
    type: 'cartoon',
    isSeries: true,
    genres: ['Animation', 'Sci-Fi', 'Action'],
    year: 2026,
    duration: '2 Seasons · 8 Eps',
    rating: 4.9,
    ageRating: 'TV-Y7',
    badge: 'HDR10+',
    matchScore: 96,
    synopsis: 'Four hyper-intelligent cybernetic felines pilot gigantic defense mechs to safeguard the galaxy from cosmic laser-pointer invasions.',
    posterUrl: cartoonAdventureImg,
    backdropUrl: cartoonAdventureImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    cast: ['Sparky', 'Gears', 'Luna', 'Whiskers'],
    director: 'Kimberly Vance',
    featured: false,
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Launch Sequence',
        episodes: [
          {
            id: 'kittens-s1-e1',
            episodeNumber: 1,
            title: 'Paws on the Controls',
            duration: '22m',
            synopsis: 'The feline academy awakens four experimental titanium mechas when robotic yarn asteroids approach Earth orbit.',
            thumbnailUrl: cartoonAdventureImg,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          {
            id: 'kittens-s1-e2',
            episodeNumber: 2,
            title: 'The Catnip Singularity',
            duration: '23m',
            synopsis: 'Gears accidentally overclocked the warp engine with synthetic catnip extract, hurtling the squad into the Andromeda galaxy.',
            thumbnailUrl: cartoonAdventureImg,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
          },
        ],
      },
      {
        seasonNumber: 2,
        title: 'Season 2: Intergalactic Purr-suit',
        episodes: [
          {
            id: 'kittens-s2-e1',
            episodeNumber: 1,
            title: 'Nine Lives in Deep Space',
            duration: '24m',
            synopsis: 'Commander Whiskers faces off against Emperor Canine aboard the Dreadnought Bark.',
            thumbnailUrl: cartoonAdventureImg,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
          },
        ],
      },
    ],
  },

  // 7. Starlight Frequency (Music)
  {
    id: 'starlight-frequency',
    title: 'Starlight Frequency',
    type: 'music',
    genres: ['Pop', 'Electronic'],
    year: 2026,
    duration: '3m 48s',
    rating: 4.9,
    ageRating: 'All Ages',
    badge: 'Hi-Res Lossless',
    matchScore: 98,
    synopsis: 'A dreamlike voyage through cascading synth pads, punchy analogue drums, and crystalline vocal harmonies.',
    posterUrl: musicConcertImg,
    backdropUrl: musicConcertImg,
    artist: 'Nova Astra',
    album: 'Cosmic Constellations',
    lyrics: [
      'Catch the signal floating in the haze',
      'Lost inside a violet starry maze',
      'Dancing on the edge of space and time',
      'Every chord you play aligns with mine'
    ]
  },

  // 8. Cyber Samurai: Neon Ronin (Cartoon / Anime)
  {
    id: 'cyber-samurai',
    title: 'Cyber Samurai: Neon Ronin',
    type: 'cartoon',
    genres: ['Animation', 'Action', 'Sci-Fi'],
    year: 2025,
    duration: 'Movie · 1h 45m',
    rating: 4.8,
    ageRating: 'TV-14',
    badge: '4K Ultra HD',
    matchScore: 97,
    synopsis: 'Armed with plasma katanas and high-frequency reflex armor, a lone master warrior defends a forgotten sector from rogue android syndicates.',
    posterUrl: cyberpunkHeroImg,
    backdropUrl: cyberpunkHeroImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
    cast: ['Ren Kusanagi', 'Sora Tanaka'],
    director: 'Kenji Takahashi',
    featured: false
  },

  // 9. Gravity Waves (Music)
  {
    id: 'gravity-waves',
    title: 'Gravity Waves (Overdrive VIP)',
    type: 'music',
    genres: ['Electronic', 'Rock'],
    year: 2026,
    duration: '4m 12s',
    rating: 4.7,
    ageRating: 'All Ages',
    badge: 'Spatial Audio',
    matchScore: 93,
    synopsis: 'High-octane fusion of distorted bass guitar riffs, breakbeat rhythms, and thunderous sub drops designed for mainstage sound systems.',
    posterUrl: musicConcertImg,
    backdropUrl: musicConcertImg,
    artist: 'Pulse 99 feat. Iron弦',
    album: 'Kinetic Energy LP',
    lyrics: [
      'Break the frequency, break the wall',
      'Watch the gravitational barriers fall',
      'Speed of sound, sound of fury',
      'No appeal, no judge, no jury!'
    ]
  },

  // 10. The Velocity Protocol (Movie)
  {
    id: 'velocity-protocol',
    title: 'The Velocity Protocol',
    type: 'movie',
    genres: ['Action', 'Thriller'],
    year: 2025,
    duration: '1h 58m',
    rating: 4.6,
    ageRating: 'PG-13',
    badge: '4K Ultra HD',
    matchScore: 92,
    synopsis: 'An international team of precision drivers and tech hackers execute an impossible heist across bullet trains speeding through Alpine tunnels.',
    posterUrl: movieThrillerImg,
    backdropUrl: movieThrillerImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/Sintel.mp4',
    cast: ['Damian Cross', 'Zoe Becker', 'Javier Santos'],
    director: 'Antony Ward',
    featured: false
  },

  // 11. Cosmo Quest: Tiny Explorers (Series)
  {
    id: 'cosmo-quest',
    title: 'Cosmo Quest: Tiny Explorers',
    type: 'cartoon',
    isSeries: true,
    genres: ['Animation', 'Adventure', 'Fantasy'],
    year: 2026,
    duration: 'Season 1 · 4 Eps',
    rating: 4.8,
    ageRating: 'All Ages',
    badge: 'HDR10+',
    matchScore: 94,
    synopsis: 'Three curious alien critters travel aboard an origami starship mapping friendly planetary wonders across the Milky Way.',
    posterUrl: cartoonAdventureImg,
    backdropUrl: cartoonAdventureImg,
    videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    cast: ['Pip', 'Squeak', 'Orion'],
    director: 'Marlon Grey',
    featured: false,
    seasons: [
      {
        seasonNumber: 1,
        title: 'Season 1: Origami Starlight',
        episodes: [
          {
            id: 'cosmo-s1-e1',
            episodeNumber: 1,
            title: 'Departure from Paper Moon',
            duration: '18m',
            synopsis: 'Pip and Squeak fold the dimensional engines and blast off on their cosmic atlas mission.',
            thumbnailUrl: cartoonAdventureImg,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
          },
          {
            id: 'cosmo-s1-e2',
            episodeNumber: 2,
            title: 'The Nebula of Lost Toys',
            duration: '19m',
            synopsis: 'A cosmic playground with zero gravity leads to friendly encounters with galactic star-dolphins.',
            thumbnailUrl: cartoonAdventureImg,
            videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
          },
        ],
      },
    ],
  },

  // 12. Bassline Dynasty (Music)
  {
    id: 'bassline-dynasty',
    title: 'Bassline Dynasty',
    type: 'music',
    genres: ['Hip-Hop', 'Electronic'],
    year: 2026,
    duration: '3m 22s',
    rating: 4.9,
    ageRating: 'Explicit',
    badge: 'Dolby Atmos',
    matchScore: 98,
    synopsis: 'Heavy 808 glides, crisp metallic snares, and razor-sharp verses celebrating late-night underground cyphers.',
    posterUrl: musicConcertImg,
    backdropUrl: musicConcertImg,
    artist: 'K-Rhythm & Ghost Flow',
    album: 'Concrete Crown',
    lyrics: [
      'Roll up with the squad, crown gleaming bright',
      'Turn the city purple in the dead of night',
      'Eight-oh-eight vibrating through the asphalt floor',
      'Never knock twice when we kick down the door'
    ]
  }
];
