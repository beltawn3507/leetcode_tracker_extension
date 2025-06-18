import { useEffect, useState } from "react";

function App() {
  const [users, setUsers] = useState([]);

  useEffect(() => {
    chrome.storage.local.get(["trackedUsers"], (result) => {
      if (result.trackedUsers) setUsers(result.trackedUsers);
    });
  }, []);

  const clearAll = () => {
    chrome.storage.local.set({ trackedUsers: [] }, () => setUsers([]));
  };

  return (
    <div className="p-4 w-64">
      <h1 className="text-lg font-bold mb-2">Tracked LeetCode Users</h1>
      {users.length === 0 ? (
        <p>No users tracked.</p>
      ) : (
        <ul className="list-disc pl-4">
          {users.map((link, i) => (
            <li key={i}>
              <a href={link} target="_blank" rel="noreferrer" className="text-blue-600">
                {link.split("/u/")[1].replace("/", "")}
              </a>
            </li>
          ))}
        </ul>
      )}
      {users.length > 0 && (
        <button onClick={clearAll} className="mt-3 bg-red-500 text-white p-1 px-2 rounded">
          Clear All
        </button>
      )}
    </div>
  );
}

export default App;
