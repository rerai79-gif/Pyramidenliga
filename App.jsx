import { useMemo, useState } from 'react';

export default function App() {
  const [search, setSearch] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const players = [
    { rank: 1, name: 'Spieler A', level: 1, lastDefense: '08.05.2026', elo: 1880 },
    { rank: 2, name: 'Spieler B', level: 2, lastDefense: '05.05.2026', elo: 1810 },
    { rank: 3, name: 'Spieler C', level: 2, lastDefense: '01.05.2026', elo: 1790 },
    { rank: 4, name: 'Spieler D', level: 3, lastDefense: '09.05.2026', elo: 1720 },
    { rank: 5, name: 'Spieler E', level: 3, lastDefense: '30.04.2026', elo: 1690 },
    { rank: 6, name: 'Spieler F', level: 3, lastDefense: '02.05.2026', elo: 1650 },
    { rank: 7, name: 'Spieler G', level: 4, lastDefense: '07.05.2026', elo: 1600 },
    { rank: 8, name: 'Spieler H', level: 4, lastDefense: '06.05.2026', elo: 1560 },
    { rank: 9, name: 'Spieler I', level: 4, lastDefense: '03.05.2026', elo: 1510 },
    { rank: 10, name: 'Spieler J', level: 4, lastDefense: '29.04.2026', elo: 1490 },
  ];

  const grouped = useMemo(() => {
    const filtered = players.filter((p) =>
      p.name.toLowerCase().includes(search.toLowerCase())
    );

    return filtered.reduce((acc, player) => {
      if (!acc[player.level]) acc[player.level] = [];
      acc[player.level].push(player);
      return acc;
    }, {});
  }, [search]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-6">
      <div className="max-w-7xl mx-auto">

        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-10">
          <div>
            <h1 className="text-4xl font-bold">Pyramidenliga</h1>
            <p className="text-zinc-400 mt-2">
              Dauerwettbewerb mit Live-Rangliste
            </p>
          </div>

          <input
            type="text"
            placeholder="Spieler suchen..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 outline-none w-full md:w-72"
          />
        </div>

        <div className="space-y-6">
          {Object.keys(grouped).map((level) => (
            <div
              key={level}
              className="flex justify-center gap-4 flex-wrap"
            >
              {grouped[level].map((player) => (
                <div
                  key={player.rank}
                  className="bg-zinc-900 border border-zinc-800 rounded-3xl p-5 w-60 shadow-2xl"
                >
                  <div className="flex justify-between items-center mb-4">
                    <div className="text-sm text-zinc-400">
                      Platz #{player.rank}
                    </div>

                    <div className="bg-zinc-800 px-3 py-1 rounded-full text-xs">
                      ELO {player.elo}
                    </div>
                  </div>

                  <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                    {player.name.charAt(player.name.length - 1)}
                  </div>

                  <div className="text-center">
                    <div className="text-xl font-bold">
                      {player.name}
                    </div>

                    <div className="text-zinc-400 text-sm mt-1">
                      Ebene {player.level}
                    </div>
                  </div>

                  <div className="bg-zinc-800 rounded-2xl p-3 mt-5">
                    <div className="text-xs text-zinc-500 uppercase">
                      Letzte Platzverteidigung
                    </div>

                    <div className="text-emerald-400 mt-2 font-semibold">
                      {player.lastDefense}
                    </div>
                  </div>

                  <div className="flex flex-col gap-2 mt-5">
                    <button
                      onClick={() => setSelectedPlayer(player)}
                      className="bg-emerald-600 hover:bg-emerald-700 py-3 rounded-2xl transition-all"
                    >
                      Herausfordern
                    </button>

                    <button className="bg-zinc-700 hover:bg-zinc-600 py-3 rounded-2xl transition-all">
                      Profil ansehen
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>

        <div className="mt-10 grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-6">
              Mitgliederverwaltung
            </h2>

            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-2xl p-4 flex items-center justify-between">
                <div>
                  <div className="font-semibold">
                    Max Mustermann
                  </div>

                  <div className="text-sm text-zinc-400">
                    Spieler • Aktiv
                  </div>
                </div>

                <button className="bg-zinc-700 px-4 py-2 rounded-xl">
                  Verwalten
                </button>
              </div>

              <button className="w-full bg-emerald-600 hover:bg-emerald-700 py-4 rounded-2xl">
                Mitglied hinzufügen
              </button>
            </div>
          </div>

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
            <h2 className="text-2xl font-bold mb-6">
              Aktive Herausforderungen
            </h2>

            <div className="space-y-4">
              <div className="bg-zinc-800 rounded-2xl p-4 flex justify-between items-center">
                <div>
                  <div className="font-semibold">
                    Spieler H vs Spieler F
                  </div>

                  <div className="text-sm text-zinc-400">
                    10.05.2026
                  </div>
                </div>

                <div className="bg-orange-600 px-4 py-2 rounded-xl text-sm">
                  Offen
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedPlayer && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4">
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 w-full max-w-md">
              <h2 className="text-2xl font-bold mb-4">
                Herausforderung senden
              </h2>

              <div className="bg-zinc-800 rounded-2xl p-4 mb-5">
                <div className="text-lg font-semibold">
                  {selectedPlayer.name}
                </div>

                <div className="text-zinc-400 text-sm mt-1">
                  Rang #{selectedPlayer.rank}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 py-3 rounded-2xl"
                >
                  Abbrechen
                </button>

                <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-3 rounded-2xl">
                  Bestätigen
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}