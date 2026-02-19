"use client";

interface Entry {
  id: string;
  date: string;
  category: string;
  activity: string;
  time_spent: number;
  notes: string;
}

interface Props {
  activity: string;
  setActivity: (value: string) => void;
  category: string;
  setCategory: (value: string) => void;
  startTime: string;
  setStartTime: (value: string) => void;
  endTime: string;
  setEndTime: (value: string) => void;
  notes: string;
  setNotes: (value: string) => void;
  onAddEntry: () => void;
  entries: Entry[];
  onDeleteEntry: (id: string) => void;
}

export default function EntryForm({
  activity,
  setActivity,
  category,
  setCategory,
  startTime,
  setStartTime,
  endTime,
  setEndTime,
  notes,
  setNotes,
  onAddEntry,
  entries,
  onDeleteEntry,
}: Props) {
  return (
    <div>
      {/* Add Entry Form */}
      <div className="bg-white p-4 rounded shadow mb-6">
        <h2 className="text-lg font-semibold mb-4">Add Daily Entry</h2>

        <input
          type="text"
          placeholder="Activity"
          value={activity}
          onChange={(e) => setActivity(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        >
          <option value="">Select Category</option>
          <option value="Work">Work</option>
          <option value="Study">Study</option>
          <option value="Gym">Gym</option>
          <option value="Personal">Personal</option>
        </select>

        <input
          type="datetime-local"
          value={startTime}
          onChange={(e) => setStartTime(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <input
          type="datetime-local"
          value={endTime}
          onChange={(e) => setEndTime(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <textarea
          placeholder="Notes"
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          className="w-full mb-3 p-2 border rounded"
        />

        <button
          onClick={onAddEntry}
          className="px-4 py-2 bg-black text-white rounded"
        >
          Add Entry
        </button>
      </div>

      {/* Entries List */}
      <div className="bg-white p-4 rounded shadow">
        <h2 className="text-lg font-semibold mb-4">Your Entries</h2>

        {entries.length === 0 && <p>No entries yet.</p>}

        {entries.map((entry) => (
          <div
            key={entry.id}
            className="border-b py-2"
          >
            <p className="font-medium">{entry.activity}</p>
            <p className="text-sm text-gray-600">
              {entry.category} | {entry.time_spent} mins
            </p>
            <p className="text-sm">{entry.notes}</p>
            <button
              onClick={() => onDeleteEntry(entry.id)}
              className="text-red-500 text-sm mt-2"
            >
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
