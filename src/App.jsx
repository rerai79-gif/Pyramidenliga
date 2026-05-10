import { useState } from 'react';

export default function App() {
  const [members, setMembers] = useState([
    {
      name: 'Admin',
      role: 'Administrator',
    },
    {
      name: 'Max',
      role: 'Spieler',
    },
  ]);

  const [newMember, setNewMember] = useState('');

  return (
    <div className="min-h-screen bg-black text-white p-6">
      <h1 className="text-4xl font-bold mb-8">
        Pyramiden Liga
      </h1>

      <div className="bg-zinc-900 p-6 rounded-3xl">
        <h2 className="text-2xl font-bold mb-4">
          Mitgliederverwaltung
        </h2>

        <div className="flex gap-3 mb-6">
          <input
            value={newMember}
            onChange={(e) =>
              setNewMember(e.target.value)
            }
            placeholder="Mitglied hinzufügen"
            className="flex-1 bg-zinc-800 px-4 py-3 rounded-2xl"
          />

          <button
            onClick={() => {
              if (!newMember) return;

              setMembers([
                ...members,
                {
                  name: newMember,
                  role: 'Spieler',
                },
              ]);

              setNewMember('');
            }}
            className="bg-emerald-600 px-5 rounded-2xl"
          >
            Hinzufügen
          </button>
        </div>

        <div className="space-y-3">
          {members.map((member, index) => (
            <div
              key={index}
              className="bg-zinc-800 p-4 rounded-2xl flex justify-between"
            >
              <div>
                <div>{member.name}</div>

                <div className="text-zinc-400 text-sm">
                  {member.role}
                </div>
              </div>

              <button
                onClick={() => {
                  setMembers(
                    members.filter(
                      (_, i) => i !== index
                    )
                  );
                }}
                className="bg-red-600 px-4 rounded-xl"
              >
                Entfernen
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}