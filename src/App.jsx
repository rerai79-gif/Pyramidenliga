import { useEffect, useMemo, useState } from 'react';
import { supabase } from './lib/supabase';

export default function App() {
  const [members, setMembers] = useState([]);
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  const [memberForm, setMemberForm] = useState({
    name: '',
    username: '',
    role: 'Spieler',
  });

  async function loadMembers() {
    const { data, error } = await supabase
      .from('members')
      .select('*')
      .order('created_at', {
        ascending: true,
      });

    if (!error) {
      setMembers(data);
    }
  }

  async function loadResults() {
    const { data, error } = await supabase
      .from('results')
      .select('*')
      .order('created_at', {
        ascending: false,
      });

    if (!error) {
      setResults(data);
    }
  }

  useEffect(() => {
    async function loadData() {
      await loadMembers();
      await loadResults();
      setLoading(false);
    }

    loadData();
  }, []);

  async function addMember() {
    if (!memberForm.name) return;

    const { error } = await supabase
      .from('members')
      .insert([
        {
          name: memberForm.name,
          username: memberForm.username,
          role: memberForm.role,
          elo: 1500,
        },
      ]);

    if (!error) {
      setMemberForm({
        name: '',
        username: '',
        role: 'Spieler',
      });

      loadMembers();
    }
  }

  async function deleteMember(id) {
    await supabase
      .from('members')
      .delete()
      .eq('id', id);

    loadMembers();
  }

  async function addChallenge(challenger, defender) {
    await supabase
      .from('results')
      .insert([
        {
          challenger,
          defender,
        },
      ]);

    loadResults();
  }

  const grouped = useMemo(() => {
    const pyramid = {};

    let level = 1;
    let cells = 1;
    let index = 0;

    while (index < members.length) {
      pyramid[level] = members.slice(
        index,
        index + cells
      );

      index += cells;
      level += 1;
      cells += 1;
    }

    return pyramid;
  }, [members]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-3xl">
        Lade App...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-zinc-950 text-white p-4">

      <div className="max-w-7xl mx-auto">

        <h1 className="text-5xl font-bold mb-10">
          Pyramiden Liga
        </h1>

        <div className="bg-zinc-900 rounded-3xl p-6 mb-8">

          <h2 className="text-3xl font-bold mb-8">
            Pyramide
          </h2>

          <div className="space-y-6">

            {Object.keys(grouped).map((level) => (

              <div
                key={level}
                className="flex justify-center gap-4 flex-wrap"
              >

                {grouped[level].map((member) => (

                  <div
                    key={member.id}
                    className="bg-zinc-800 border border-zinc-700 rounded-3xl p-5 min-w-[220px]"
                  >

                    <div className="text-zinc-400 text-sm mb-2">
                      Ebene {level}
                    </div>

                    <div className="text-2xl font-bold">
                      {member.name}
                    </div>

                    <div className="text-zinc-400 mt-2">
                      {member.role}
                    </div>

                    <div className="text-sm mt-4">
                      ELO: {member.elo}
                    </div>

                    <button
                      onClick={() =>
                        addChallenge(
                          'Spieler',
                          member.name
                        )
                      }
                      className="w-full mt-5 bg-emerald-600 hover:bg-emerald-700 py-3 rounded-2xl"
                    >
                      Herausfordern
                    </button>

                  </div>

                ))}

              </div>

            ))}

          </div>

        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          <div className="bg-zinc-900 rounded-3xl p-6">

            <h2 className="text-2xl font-bold mb-6">
              Mitgliederverwaltung
            </h2>

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

              <button
                onClick={addMember}
                className="w-full bg-emerald-600 hover:bg-emerald-700 py-3 rounded-2xl"
              >
                Mitglied hinzufügen
              </button>

            </div>

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

                  <button
                    onClick={() =>
                      deleteMember(member.id)
                    }
                    className="bg-red-600 hover:bg-red-700 px-4 py-2 rounded-xl"
                  >
                    Entfernen
                  </button>

                </div>

              ))}

            </div>

          </div>

          <div className="bg-zinc-900 rounded-3xl p-6">

            <h2 className="text-2xl font-bold mb-6">
              Ergebnissdienst
            </h2>

            <div className="space-y-4">

              {results.map((result) => (

                <div
                  key={result.id}
                  className="bg-zinc-800 rounded-2xl p-4"
                >

                  <div className="font-semibold">
                    {result.challenger}
                  </div>

                  <div className="text-sm text-zinc-400 mt-2">
                    fordert {result.defender}
                  </div>

                </div>

              ))}

            </div>

          </div>

        </div>

      </div>

    </div>
  );
}