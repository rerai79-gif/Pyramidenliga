import { useEffect, useMemo, useState } from 'react';

export default function App() {
  const defaultMembers = [
    {
      id: 1,
      name: 'Administrator',
      username: 'admin',
      password: 'admin123',
      role: 'Administrator',
      elo: 2000,
      lastDefense: '11.05.2026',
    },
    {
      id: 2,
      name: 'Max',
      username: 'max',
      password: '1234',
      role: 'Spieler',
      elo: 1800,
      lastDefense: '10.05.2026',
    },
    {
      id: 3,
      name: 'Chris',
      username: 'chris',
      password: '1234',
      role: 'Spieler',
      elo: 1750,
      lastDefense: '09.05.2026',
    },
  ];

  const [members, setMembers] = useState(() => {
    const saved = localStorage.getItem(
      'pyramidenliga-members'
    );

    return saved
      ? JSON.parse(saved)
      : defaultMembers;
  });

  const [results, setResults] = useState(() => {
    const saved = localStorage.getItem(
      'pyramidenliga-results'
    );

    return saved ? JSON.parse(saved) : [];
  });

  const [loggedInUser, setLoggedInUser] =
    useState(null);

  const [loginUsername, setLoginUsername] =
    useState('');

  const [loginPassword, setLoginPassword] =
    useState('');

  const [search, setSearch] = useState('');

  const [memberForm, setMemberForm] = useState({
    name: '',
    username: '',
    password: '',
    role: 'Spieler',
  });

  const [editingId, setEditingId] =
    useState(null);

  useEffect(() => {
    localStorage.setItem(
      'pyramidenliga-members',
      JSON.stringify(members)
    );
  }, [members]);

  useEffect(() => {
    localStorage.setItem(
      'pyramidenliga-results',
      JSON.stringify(results)
    );
  }, [results]);

  const grouped = useMemo(() => {
    const filtered = members.filter((member) =>
      member.name
        .toLowerCase()
        .includes(search.toLowerCase())
    );

    const pyramid = {};

    let level = 1;
    let playersInLevel = 1;
    let index = 0;

    while (index < filtered.length) {
      pyramid[level] = filtered.slice(
        index,
        index + playersInLevel
      );

      index += playersInLevel;
      level += 1;
      playersInLevel += 1;
    }

    return pyramid;
  }, [members, search]);

  function login() {
    const found = members.find(
      (member) =>
        member.username === loginUsername &&
        member.password === loginPassword
    );

    if (found) {
      setLoggedInUser(found);
    } else {
      alert('Login fehlgeschlagen');
    }
  }

  function saveMember() {
    if (
      !memberForm.name ||
      !memberForm.username ||
      !memberForm.password
    ) {
      return;
    }

    if (editingId) {
      setMembers(
        members.map((member) =>
          member.id === editingId
            ? {
                ...member,
                ...memberForm,
              }
            : member
        )
      );
    } else {
      setMembers([
        ...members,
        {
          id: Date.now(),
          ...memberForm,
          elo: 1500,
          lastDefense:
            new Date().toLocaleDateString(),
        },
      ]);
    }

    setMemberForm({
      name: '',
      username: '',
      password: '',
      role: 'Spieler',
    });

    setEditingId(null);
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4">
      <div className="max-w-7xl mx-auto">

        <header className="flex flex-col lg:flex-row lg:justify-between gap-4 mb-8">

          <div>
            <h1 className="text-4xl font-bold">
              Pyramiden Liga
            </h1>

            <p className="text-zinc-400 mt-2">
              Dauerwettbewerb
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
                onClick={login}
                className="bg-emerald-600 hover:bg-emerald-700 px-5 py-3 rounded-2xl"
              >
                Login
              </button>

            </div>
          ) : (
            <div className="flex gap-3 items-center">

              <div className="bg-zinc-800 px-5 py-3 rounded-2xl">
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

          <div className="flex justify-between items-center mb-8">

            <h2 className="text-2xl font-bold">
              Pyramide
            </h2>

            <input
              type="text"
              placeholder="Spieler suchen"
              value={search}
              onChange={(e) =>
                setSearch(e.target.value)
              }
              className="bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3"
            />

          </div>

          <div className="space-y-6">

            {Object.keys(grouped).map((level) => (

              <div
                key={level}
                className="flex justify-center gap-4 flex-wrap"
              >

                {grouped[level].map(
                  (member, index) => {

                    const currentLevel =
                      Number(level);

                    const canChallenge =
                      loggedInUser &&
                      loggedInUser.id !== member.id &&
                      currentLevel >= 2;

                    return (

                      <div
                        key={member.id}
                        className="bg-zinc-800 border border-zinc-700 rounded-3xl p-5 min-w-[220px]"
                      >

                        <div className="flex justify-between mb-4">

                          <div className="text-zinc-400 text-sm">
                            Ebene {level}
                          </div>

                          <div className="text-xs bg-zinc-700 px-3 py-1 rounded-full">
                            ELO {member.elo}
                          </div>

                        </div>

                        <div className="w-16 h-16 rounded-full bg-emerald-500 flex items-center justify-center text-2xl font-bold mx-auto mb-4">
                          {index + 1}
                        </div>

                        <div className="text-center text-xl font-bold">
                          {member.name}
                        </div>

                        <div className="text-center text-zinc-400 mt-2">
                          {member.role}
                        </div>

                        <div className="bg-zinc-900 rounded-2xl p-3 mt-4 text-sm">
                          Letzte Verteidigung:
                          <br />
                          {member.lastDefense}
                        </div>

                        {canChallenge && (
                          <button
                            onClick={() => {
                              setResults([
                                {
                                  challenger:
                                    loggedInUser.name,
                                  defender:
                                    member.name,
                                  date:
                                    new Date().toLocaleDateString(),
                                },
                                ...results,
                              ]);
                            }}
                            className="w-full mt-4 bg-emerald-600 hover:bg-emerald-700 py-3 rounded-2xl"
                          >
                            Herausfordern
                          </button>
                        )}

                      </div>

                    );
                  }
                )}

              </div>

            ))}

          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6">

            <h2 className="text-2xl font-bold mb-6">
              Ergebnissdienst
            </h2>

            <div className="space-y-4">

              {results.map((result, index) => (

                <div
                  key={index}
                  className="bg-zinc-800 rounded-2xl p-4"
                >

                  <div className="font-semibold">
                    {result.challenger}
                  </div>

                  <div className="text-zinc-400 text-sm mt-1">
                    fordert {result.defender}
                  </div>

                  <div className="text-xs text-zinc-500 mt-2">
                    {result.date}
                  </div>

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
                  placeholder="Name"
                  value={memberForm.name}
                  onChange={(e) =>
                    setMemberForm({
                      ...memberForm,
                      name: e.target.value,
                    })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3"
                />

                <input
                  type="text"
                  placeholder="Benutzername"
                  value={memberForm.username}
                  onChange={(e) =>
                    setMemberForm({
                      ...memberForm,
                      username: e.target.value,
                    })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3"
                />

                <input
                  type="password"
                  placeholder="Passwort"
                  value={memberForm.password}
                  onChange={(e) =>
                    setMemberForm({
                      ...memberForm,
                      password: e.target.value,
                    })
                  }
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-2xl px-4 py-3"
                />

                <button
                  onClick={saveMember}
                  className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-2xl"
                >
                  {editingId
                    ? 'Mitglied speichern'
                    : 'Mitglied hinzufügen'}
                </button>

              </div>

            )}

            <div className="space-y-4">

              {members.map((member) => (

                <div
                  key={member.id}
                  className="bg-zinc-800 rounded-2xl p-4 flex justify-between items-center"
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
                          setEditingId(member.id);

                          setMemberForm({
                            name: member.name,
                            username:
                              member.username,
                            password:
                              member.password,
                            role: member.role,
                          });
                        }}
                        className="bg-blue-600 hover:bg-blue-700 px-4 py-2 rounded-xl"
                      >
                        Bearbeiten
                      </button>

                      <button
                        onClick={() => {
                          setMembers(
                            members.filter(
                              (m) =>
                                m.id !== member.id
                            )
                          );
                        }}
                        className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl"
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
    </div>
  );
}