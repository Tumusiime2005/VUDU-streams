import React, { useState } from 'react';
import { Bell, Check, Play, Sparkles, Calendar, Film } from 'lucide-react';
import { UpcomingTitle } from '../types/userAndHistory';

interface ComingSoonSectionProps {
  onPlayTrailer: (title: string, videoUrl: string) => void;
}

export const ComingSoonSection: React.FC<ComingSoonSectionProps> = ({ onPlayTrailer }) => {
  const [reminders, setReminders] = useState<string[]>([]);
  const [alertText, setAlertText] = useState<string>('');

  const upcomingTitles: UpcomingTitle[] = [
    {
      id: 'up-1',
      title: 'Solaris Protocol: Zero Dawn',
      releaseDate: 'Coming This Friday',
      synopsis: 'When a terraforming station on Jupiter’s moon Ganymede goes dark, a squad of deep-orbital engineers uncovers an intelligent crystalline ecosystem.',
      backdropUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?auto=format&fit=crop&w=1200&q=80',
      type: 'movie',
      badge: '4K Ultra HD · VUDU Original',
      genres: ['Sci-Fi', 'Mystery'],
    },
    {
      id: 'up-2',
      title: 'Dragon Knights: The Nether Forge',
      releaseDate: 'Coming Next Month',
      synopsis: 'The highly anticipated animated fantasy adventure follows three novice dragon tamers who must forge an alliance with ancient magma drakes.',
      backdropUrl: 'https://images.unsplash.com/photo-1534447677768-be436bb09401?auto=format&fit=crop&w=1200&q=80',
      type: 'series',
      badge: 'HDR10+ · Season 1 Premiere',
      genres: ['Animation', 'Fantasy'],
    },
  ];

  const toggleReminder = (id: string, title: string) => {
    if (reminders.includes(id)) {
      setReminders((prev) => prev.filter((r) => r !== id));
      setAlertText(`Reminder removed for ${title}`);
    } else {
      setReminders((prev) => [...prev, id]);
      setAlertText(`Reminder set! You will be notified when ${title} premieres on VUDU.`);
    }
    setTimeout(() => setAlertText(''), 3000);
  };

  return (
    <section className="my-10 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto select-none">
      <div className="flex items-center justify-between mb-4">
        <div>
          <div className="flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-violet-400" />
            <h2 className="text-xl sm:text-2xl font-black text-white font-display tracking-tight">
              New & Coming Soon to VUDU
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-400 mt-0.5">
            Exclusive upcoming cinema premieres and original series
          </p>
        </div>

        {alertText && (
          <div className="px-3 py-1 rounded-lg bg-violet-900/80 border border-violet-400 text-white text-xs font-semibold animate-in fade-in">
            {alertText}
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {upcomingTitles.map((item) => {
          const isReminded = reminders.includes(item.id);

          return (
            <div
              key={item.id}
              className="relative rounded-2xl overflow-hidden bg-[#121218] border border-white/[0.08] hover:border-violet-500/40 transition-all p-5 flex flex-col justify-between"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-violet-600/30 border border-violet-500/30 text-violet-300 text-[11px] font-bold">
                    <Calendar className="w-3.5 h-3.5" />
                    <span>{item.releaseDate}</span>
                  </div>

                  <span className="text-[10px] font-mono text-slate-400">{item.badge}</span>
                </div>

                <h3 className="text-lg sm:text-xl font-black font-display text-white mb-2">
                  {item.title}
                </h3>
                <p className="text-xs text-slate-300 leading-relaxed line-clamp-3 mb-4">
                  {item.synopsis}
                </p>

                <div className="flex items-center gap-2 text-[11px] text-violet-400 font-medium">
                  {item.genres.join(' · ')}
                </div>
              </div>

              <div className="flex items-center justify-between pt-4 mt-4 border-t border-white/[0.06]">
                <button
                  onClick={() =>
                    onPlayTrailer(
                      `${item.title} (Official Teaser)`,
                      'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4'
                    )
                  }
                  className="flex items-center gap-1.5 text-xs font-bold text-white hover:text-violet-300 transition-colors cursor-pointer"
                >
                  <Play className="w-3.5 h-3.5 fill-white" />
                  <span>Watch Teaser Trailer</span>
                </button>

                <button
                  onClick={() => toggleReminder(item.id, item.title)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                    isReminded
                      ? 'bg-emerald-600 text-white shadow-md'
                      : 'bg-white/10 hover:bg-white/20 text-slate-200'
                  }`}
                >
                  {isReminded ? <Check className="w-3.5 h-3.5" /> : <Bell className="w-3.5 h-3.5" />}
                  <span>{isReminded ? 'Reminder Set' : 'Remind Me'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
};
