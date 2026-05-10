import { useEffect, useMemo, useState } from 'react';

export default function PyramidLeagueApp() {
  const [search, setSearch] = useState('');

  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem('members');

    return saved
      ? JSON.parse(saved)
      : [
          {
            name: 'Admin',
            username: 'admin',
            password: 'admin123',
            role: 'Administrator',
          },
          {
            name: 'Max',
            username: 'max',
            password: '1234',
            role: 'Spieler',
          },
        ];
  });

  const [loggedInUser, setLoggedInUser] = useState(null);

  const [loginUsername, setLoginUsername] = useState('');
  const [loginPassword, setLoginPassword] = useState('');

  const [newMember, setNewMember] = useState('');
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem(
      'members',
      JSON.stringify(members)
    );
  }, [members]);

  const players = useMemo(() => {
    return members.map((member, index) => ({
      rank: index + 1,
      level: Math.floor(index / 3) + 1,
      elo: 1800 - index * 25,
      lastDefense: '10.05.2026',
      name: member.name,
    }));
  }, [members]);

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4">
      <div className="max-w-7xl mx-auto">
        <header className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="text-4xl font-bold">
              Pyramiden Liga
            </h1>

            <p className="text-zinc-400 mt-2">
              Dauerwettbewerb mit Live-Rangliste
            </p>
          </div>

          {!loggedInUser ? (
            <div className="flex flex-col md:flex-row gap-3">
              <input
                type="text"
                placeholder="Benutzername"
                value={loginUsername}
                onChange={(e) =>
                  setLoginUsername(e.target.value)
                }
                className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3"
              />

              <input
                type="password"
                placeholder="Passwort"
                value={loginPassword}
                onChange={(e) =>
                  setLoginPassword(e.target.value)
                }
                className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3"
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
                  } else {
                    alert('Login fehlgeschlagen');
                  }
                }}
                className="bg-emerald-600 hover:bg-emerald-700 px-5 py-3 rounded-2xl font-semibold"
              >
                Login
              </button>
            </div>
          ) : (
            <div className="flex gap-3 items-center">
              <div className="bg-zinc-800 px-4 py-3 rounded-2xl">
                {loggedInUser.name}
              </div>

              <button
                onClick={() =>
                  setLoggedInUser(null)
                }
                className="bg-zinc-700 hover:bg-zinc-600 px-5 py-3 rounded-2xl"
              >
                Logout
              </button>
            </div>
          )}
        </header>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 mb-8">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-2xl font-bold">
              Pyramiden-Rangliste
            </h2>

            <input
              type="text"
              placeholder="Spieler suchen..."
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3"
            />
          </div>

          <div className="space-y-6">
            {Object.keys(
              players.reduce((acc, player) => {
                if (!acc[player.level]) {
                  acc[player.level] = [];
                }

                acc[player.level].push(player);

                return acc;
              }, {})
            ).map((level) => (
              <div
                key={level}
                className="flex justify-center gap-4 flex-wrap"
              >
                {players
                  .filter(
                    (player) =>
                      player.level === Number(level) &&
                      player.name
                        .toLowerCase()
                        .includes(
                          search.toLowerCase()
                        )
                  )
                  .map((player) => (
                    <div
                      key={player.rank}
                      className="bg-zinc-800 border border-zinc-700 rounded-3xl p-5 min-w-[220px]"
                    >
                      <div className="text-sm text-zinc-400 mb-3">
                        Platz #{player.rank}
                      </div>

                      <div className="text-xl font-bold text-center">
                        {player.name}
                      </div>

                      <div className="text-center text-zinc-400 mt-2">
                        Ebene {player.level}
                      </div>

                      <div className="mt-4 bg-zinc-900 rounded-2xl p-3">
                        <div className="text-xs text-zinc-500">
                          Letzte Platzverteidigung
                        </div>

                        <div className="text-emerald-400 mt-1">
                          {player.lastDefense}
                        </div>
                      </div>

                      <div className="mt-4 bg-zinc-900 rounded-2xl p-3">
                        ELO {player.elo}
                      </div>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>

        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">
          <h2 className="text-2xl font-bold mb-6">
            Mitgliederverwaltung
          </h2>

          {loggedInUser?.role ===
            'Administrator' && (
            <div className="space-y-3 mb-6">
              <input
                type="text"
                placeholder="Mitgliedsname"
                value={newMember}
                onChange={(e) =>
                  setNewMember(e.target.value)
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3"
              />

              <input
                type="text"
                placeholder="Benutzername"
                value={newUsername}
                onChange={(e) =>
                  setNewUsername(e.target.value)
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3"
              />

              <input
                type="password"
                placeholder="Passwort"
                value={newPassword}
                onChange={(e) =>
                  setNewPassword(e.target.value)
                }
                className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3"
              />

              <button
                onClick={() => {
                  if (
                    !newMember ||
                    !newUsername ||
                    !newPassword
                  ) {
                    return;
                  }

                  if (
                    editingIndex !== null
                  ) {
                    const updated =
                      [...members];

                    updated[
                      editingIndex
                    ] = {
                      ...updated[
                        editingIndex
                      ],
                      name: newMember,
                      username:
                        newUsername,
                      password:
                        newPassword,
                    };

                    setMembers(updated);

                    setEditingIndex(null);
                  } else {
                    setMembers([
                      ...members,
                      {
                        name: newMember,
                        username:
                          newUsername,
                        password:
                          newPassword,
                        role: 'Spieler',
                      },
                    ]);
                  }

                  setNewMember('');
                  setNewUsername('');
                  setNewPassword('');
                }}
                className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-2xl font-semibold"
              >
                {editingIndex !== null
                  ? 'Mitglied speichern'
                  : 'Mitglied hinzufügen'}
              </button>
            </div>
          )}

          <div className="space-y-4">
            {members.map((member, index) => (
              <div
                key={index}
                className="bg-zinc-800 border border-zinc-700 rounded-2xl p-4 flex items-center justify-between"
              >
                <div>
                  <div className="font-semibold">
                    {member.name}
                  </div>

                  <div className="text-sm text-zinc-400">
                    {member.role}
                  </div>
                </div>

                {loggedInUser?.role ===
                  'Administrator' && (
                  <div className="flex gap-2">
                    <button
                      onClick={() => {
                        setNewMember(
                          member.name
                        );

                        setNewUsername(
                          member.username
                        );

                        setNewPassword(
                          member.password
                        );

                        setEditingIndex(
                          index
                        );
                      }}
                      className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl text-sm"
                    >
                      Bearbeiten
                    </button>

                    <button
                      onClick={() => {
                        setMembers(
                          members.filter(
                            (_, i) =>
                              i !== index
                          )
                        );
                      }}
                      className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl text-sm"
                    >
                      Entfernen
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}