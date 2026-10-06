import { MediaItem } from '../data/mediaData';
import { WatchHistoryRecord } from '../types/userAndHistory';

export interface SuggestedMediaItem extends MediaItem {
  suggestionReason: string;
  calculatedMatch: number;
}

export function generateWatchSuggestions(
  catalog: MediaItem[],
  history: WatchHistoryRecord[]
): SuggestedMediaItem[] {
  // If user has watched items, base recommendations on watched items
  const watchedIds = new Set(history.map((h) => h.id));
  const watchedItems = catalog.filter((item) => watchedIds.has(item.id));

  // Determine top genres from watch history
  const genreCounts: Record<string, number> = {};
  watchedItems.forEach((item) => {
    item.genres.forEach((g) => {
      genreCounts[g] = (genreCounts[g] || 0) + 1;
    });
  });

  const sortedFavoriteGenres = Object.entries(genreCounts)
    .sort((a, b) => b[1] - a[1])
    .map(([genre]) => genre);

  const mostRecentlyWatched = watchedItems[0];

  return catalog
    .map((item) => {
      let score = item.matchScore || 90;
      let reason = 'Trending on VUDU Today';

      // If user recently watched something similar
      if (mostRecentlyWatched && mostRecentlyWatched.id !== item.id) {
        const sharedGenres = item.genres.filter((g) =>
          mostRecentlyWatched.genres.includes(g)
        );
        if (sharedGenres.length > 0) {
          score = Math.min(99, score + sharedGenres.length * 2);
          reason = `Because you watched ${mostRecentlyWatched.title}`;
        }
      } else if (sortedFavoriteGenres.length > 0) {
        const favoriteOverlap = item.genres.filter((g) =>
          sortedFavoriteGenres.slice(0, 2).includes(g)
        );
        if (favoriteOverlap.length > 0) {
          score = Math.min(99, score + favoriteOverlap.length * 2);
          reason = `Recommended based on your love for ${favoriteOverlap[0]}`;
        }
      } else {
        if (item.rating >= 4.8) {
          reason = `Top Rated ${item.genres[0]} Masterpiece`;
        } else if (item.badge.includes('4K')) {
          reason = 'Ultra HD 4K Cinema Showcase';
        }
      }

      return {
        ...item,
        suggestionReason: reason,
        calculatedMatch: score,
      };
    })
    .sort((a, b) => b.calculatedMatch - a.calculatedMatch);
}
