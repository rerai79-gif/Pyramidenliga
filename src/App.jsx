import { useEffect, useMemo, useState } from 'react';

export default function PyramidLeagueApp() {
  const [isLoggedIn, setIsLoggedIn] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedPlayer, setSelectedPlayer] = useState(null);

  const [players, setPlayers] = useState([
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
  ]);

  const [matches] = useState([
    {
      challenger: 'Spieler H',
      opponent: 'Spieler F',
      date: '10.05.2026',
      status: 'Offen',
    },
    {
      challenger: 'Spieler D',
      opponent: 'Spieler C',
      date: '12.05.2026',
      status: 'Bestätigt',
    },
  ]);

  const [members, setMembers] = useState(() => {
    const savedMembers = localStorage.getItem('pyramidenliga-members');
    return savedMembers
      ? JSON.parse(savedMembers)
      : [
    {
      name: 'Max Mustermann',
      role: 'Spieler',
      status: 'Aktiv',
      username: 'max',
      password: '1234',
    },
    {
      name: 'Lisa Beispiel',
      role: 'Administrator',
      status: 'Online',
      username: 'admin',
      password: 'admin123',
    },
    ];
  });

  const [editingIndex, setEditingIndex] = useState(null);

  const [newMember, setNewMember] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [loggedInUser, setLoggedInUser] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      'pyramidenliga-members',
      JSON.stringify(members)
    );
  }, [members]);

  useEffect(() => {
    const updatedPlayers = players.map((player, index) => ({
      ...player,
      name:
        members[index]?.name || player.name,
    }));

    setPlayers(updatedPlayers);
  }, [members]);

  const notifications = [
    'Neue Herausforderung von Spieler D',
    'Platzverteidigung erfolgreich',
    'Admin hat Rangliste aktualisiert',
  ];

  const currentUser = {
    name: 'Max Mustermann',
    rank: 8,
    elo: 1560,
    streak: 5,
  };

  const filteredPlayers = useMemo(() => {
    return players.filter((player) =>
      player.name.toLowerCase().includes(search.toLowerCase())
    );
  }, [players, search]);

  const grouped = useMemo(() => {
    return filteredPlayers.reduce((acc, player) => {
      if (!acc[player.level]) acc[player.level] = [];
      acc[player.level].push(player);
      return acc;
    }, {});
  }, [filteredPlayers]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4 pb-24">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">Pyramiden Liga</h1>
            <p className="text-zinc-400 mt-2">
              Dauerwettbewerb mit Live-Rangliste
            </p>
          </div>

          <div className="flex gap-3 flex-wrap">
            {!loggedInUser ? (
              <div className="flex flex-col md:flex-row gap-3 w-full lg:w-auto">
                <input
                  type="text"
                  placeholder="Benutzername"
                  value={loginUsername}
                  onChange={(e) => setLoginUsername(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 outline-none"
                />

                <input
                  type="password"
                  placeholder="Passwort"
                  value={loginPassword}
                  onChange={(e) => setLoginPassword(e.target.value)}
                  className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3 outline-none"
                />

                <button
                  onClick={() => {
                    const foundUser = members.find(
                      (member) =>
                        member.username === loginUsername &&
                        member.password === loginPassword
                    );

                    if (foundUser) {
                      setLoggedInUser(foundUser);
                      setIsLoggedIn(true);
                    } else {
                      alert('Login fehlgeschlagen');
                    }
                  }}
                  className="bg-emerald-600 hover:bg-emerald-700 px-5 py-3 rounded-2xl font-semibold transition-all"
                >
                  Login
                </button>
              </div>
            ) : (
              <>
                <div className="bg-zinc-800 px-5 py-3 rounded-2xl">
                  Eingeloggt als {loggedInUser.name}
                </div>

                <button
                  className="bg-emerald-600 hover:bg-emerald-700 px-5 py-3 rounded-2xl font-semibold transition-all"
                >
                  Herausforderung senden
                </button>

                <button
                  onClick={() => {
                    setLoggedInUser(null);
                    setIsLoggedIn(false);
                  }}
                  className="bg-zinc-800 hover:bg-zinc-700 px-5 py-3 rounded-2xl font-semibold transition-all"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-2xl">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-8">
              <h2 className="text-2xl font-bold">Pyramiden-Rangliste</h2>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Spieler suchen..."
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
                      className="bg-gradient-to-br from-zinc-800 to-zinc-900 border border-zinc-700 rounded-3xl p-5 min-w-[220px] shadow-xl hover:scale-105 transition-all"
                    >
                      <div className="flex items-center justify-between mb-4">
                        <div className="text-sm text-zinc-400">
                          Platz #{player.rank}
                        </div>

                        <div className="text-xs bg-zinc-700 px-3 py-1 rounded-full">
                          ELO {player.elo}
                        </div>
                      </div>

                      <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                        {player.name.charAt(player.name.length - 1)}
                      </div>

                      <div className="text-center">
                        <div className="text-xl font-bold">{player.name}</div>

                        <div className="text-sm text-zinc-400 mt-1">
                          Ebene {player.level}
                        </div>
                      </div>

                      <div className="mt-5 bg-zinc-950/40 border border-zinc-700 rounded-2xl p-3">
                        <div className="text-xs uppercase tracking-wide text-zinc-500">
                          Letzte Platzverteidigung
                        </div>

                        <div className="text-emerald-400 font-semibold mt-1">
                          {player.lastDefense}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2 mt-5">
                        <button
                          onClick={() => setSelectedPlayer(player)}
                          className="bg-emerald-600 hover:bg-emerald-700 py-3 rounded-2xl font-semibold transition-all"
                        >
                          Herausfordern
                        </button>

                        <button className="bg-zinc-700 hover:bg-zinc-600 py-3 rounded-2xl font-semibold transition-all">
                          Profil ansehen
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-gradient-to-br from-emerald-500 to-green-700 rounded-3xl p-6 shadow-2xl">
              <div className="text-sm uppercase tracking-wider opacity-80 mb-2">
                Live Saisonstatus
              </div>

              <div className="text-4xl font-bold mb-2">Dauerbetrieb</div>

              <div className="text-sm opacity-90">
                Echtzeit-Rangliste mit automatischer Synchronisierung
              </div>

              <div className="grid grid-cols-3 gap-3 mt-6">
                <div className="bg-white/10 rounded-2xl p-3 text-center">
                  <div className="text-2xl font-bold">128</div>
                  <div className="text-xs">Spieler</div>
                </div>

                <div className="bg-white/10 rounded-2xl p-3 text-center">
                  <div className="text-2xl font-bold">432</div>
                  <div className="text-xs">Matches</div>
                </div>

                <div className="bg-white/10 rounded-2xl p-3 text-center">
                  <div className="text-2xl font-bold">24/7</div>
                  <div className="text-xs">Live</div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-2xl">
              <h3 className="text-xl font-bold mb-5">Mein Profil</h3>

              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-2xl font-bold">
                  M
                </div>

                <div>
                  <div className="text-xl font-semibold">
                    {currentUser.name}
                  </div>
                  <div className="text-zinc-400 text-sm">
                    Aktuell Platz #{currentUser.rank}
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-zinc-800 rounded-2xl p-4 text-center">
                  <div className="text-sm text-zinc-400">ELO</div>
                  <div className="text-3xl font-bold text-emerald-400 mt-2">
                    {currentUser.elo}
                  </div>
                </div>

                <div className="bg-zinc-800 rounded-2xl p-4 text-center">
                  <div className="text-sm text-zinc-400">Serie</div>
                  <div className="text-3xl font-bold text-orange-400 mt-2">
                    {currentUser.streak}
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-2xl">
              <h3 className="text-xl font-bold mb-5">Push-Mitteilungen</h3>

              <div className="space-y-3">
                {notifications.map((notification, index) => (
                  <div
                    key={index}
                    className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 text-sm"
                  >
                    {notification}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-2xl">
            <h2 className="text-2xl font-bold mb-6">
              Aktive Herausforderungen
            </h2>

            <div className="space-y-4">
              {loggedInUser?.role === 'Administrator' && (
                <div className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 space-y-3 mb-5">
                  <input
                    type="text"
                    placeholder="Mitgliedsname"
                    value={newMember}
                    onChange={(e) => setNewMember(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 outline-none"
                  />

                  <input
                    type="text"
                    placeholder="Benutzername"
                    value={newUsername}
                    onChange={(e) => setNewUsername(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 outline-none"
                  />

                  <input
                    type="password"
                    placeholder="Passwort"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-700 rounded-2xl px-4 py-3 outline-none"
                  />

                  <button
                    onClick={() => {
                      if (!newMember || !newUsername || !newPassword) return;

                      if (editingIndex !== null) {
                        const updatedMembers = [...members];

                        updatedMembers[editingIndex] = {
                          ...updatedMembers[editingIndex],
                          name: newMember,
                          username: newUsername,
                          password: newPassword,
                        };

                        setMembers(updatedMembers);
                        setEditingIndex(null);
                      } else {
                        setMembers([
                          ...members,
                          {
                            name: newMember,
                            role: 'Spieler',
                            status: 'Aktiv',
                            username: newUsername,
                            password: newPassword,
                          },
                        ]);
                      }

                      setNewMember('');
                      setNewUsername('');
                      setNewPassword('');
                    }}
                    className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-2xl font-semibold transition-all"
                  >
                    {editingIndex !== null
                      ? 'Mitglied speichern'
                      : 'Mitglied hinzufügen'}
                  </button>
                </div>
              )}

              {members.map((member, index) => (
                <div
                  key={index}
                  className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 flex items-center justify-between"
                >
                  <div>
                    <div className="font-semibold">{member.name}</div>
                    <div className="text-sm text-zinc-400">
                      {member.role} • {member.status}
                    </div>
                  </div>

                  {loggedInUser?.role === 'Administrator' ? (
                    <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setNewMember(member.name);
                        setNewUsername(member.username);
                        setNewPassword(member.password);
                        setEditingIndex(index);
                      }}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm transition-all"
                    >
                      Bearbeiten
                    </button>

                    <button
                      onClick={() => {
                        setMembers(
                          members.filter((_, i) => i !== index)
                        );
                      }}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm transition-all"
                    >
                      Entfernen
                    </button>
                  ) : (
                    <div className="text-xs text-zinc-500">
                      Nur Ansicht
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-zinc-900 rounded-3xl border border-zinc-800 p-6 shadow-2xl">
          <h2 className="text-2xl font-bold mb-6">
            Erweiterungen integriert
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-zinc-800 rounded-2xl p-5">
              <div className="text-lg font-bold mb-2">Echtzeit-Updates</div>
              <div className="text-sm text-zinc-400">
                Live-Synchronisierung aller Ranglistenänderungen.
              </div>
            </div>

            <div className="bg-zinc-800 rounded-2xl p-5">
              <div className="text-lg font-bold mb-2">Push-Mitteilungen</div>
              <div className="text-sm text-zinc-400">
                Benachrichtigungen bei Herausforderungen und Ergebnissen.
              </div>
            </div>

            <div className="bg-zinc-800 rounded-2xl p-5">
              <div className="text-lg font-bold mb-2">ELO-System</div>
              <div className="text-sm text-zinc-400">
                Dynamische Spielerwertung zusätzlich zur Platzierung.
              </div>
            </div>

            <div className="bg-zinc-800 rounded-2xl p-5">
              <div className="text-lg font-bold mb-2">Adminsteuerung</div>
              <div className="text-sm text-zinc-400">
                Zentrale Verwaltung mit Rollenrechten.
              </div>
            </div>
          </div>

          <div className="mt-6 text-sm text-zinc-500 leading-relaxed">
            Die Architektur ist vorbereitet für Firebase Realtime Database,
            Firestore, Push-Mitteilungen, Cloud Functions und PWA Mobile Apps.
          </div>
        </div>

        {selectedPlayer && (
          <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
            <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-6 w-full max-w-md">
              <h3 className="text-2xl font-bold mb-4">
                Herausforderung senden
              </h3>

              <div className="bg-zinc-800 rounded-2xl p-4 mb-5">
                <div className="text-lg font-semibold">
                  {selectedPlayer.name}
                </div>

                <div className="text-sm text-zinc-400 mt-1">
                  Rang #{selectedPlayer.rank}
                </div>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setSelectedPlayer(null)}
                  className="flex-1 bg-zinc-700 hover:bg-zinc-600 py-3 rounded-2xl font-semibold transition-all"
                >
                  Abbrechen
                </button>

                <button className="flex-1 bg-emerald-600 hover:bg-emerald-700 py-3 rounded-2xl font-semibold transition-all">
                  Bestätigen
                </button>
              </div>
            </div>
          </div>
        )}

        <nav className="fixed bottom-0 left-0 right-0 bg-zinc-900 border-t border-zinc-800 p-4 flex justify-around lg:hidden">
          <button className="text-emerald-400 font-semibold">
            Rangliste
          </button>
          <button>Matches</button>
          <button>Mitglieder</button>
          <button>Profil</button>
        </nav>
      </div>
    </div>
  );
}
