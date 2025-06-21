import { useEffect, useState } from "react";
import axios from "axios";

export default function App() {
  const [users, setUsers] = useState([]);
  const [showDetails, setShowDetails] = useState(false);
  const [selectedUser, setSelectedUser] = useState("");
  const [userDetail, setUserDetail] = useState(null);

  useEffect(() => {
    chrome.storage.local.get(["trackedUsers"], (result) => {
      if (result.trackedUsers) setUsers(result.trackedUsers);
    });
  }, []);

  const clearAll = () => {
    chrome.storage.local.set({ trackedUsers: [] }, () => setUsers([]));
  };

  const handleDelete = (username) => {
    const updated = users.filter((u) => u !== username);
    setUsers(updated);
    chrome.storage.local.set({ trackedUsers: updated });
  };

  const showUserDetails = async (username) => {
    setShowDetails(true);
    setSelectedUser(username);
    try {
      const { data } = await axios.get(
        `https://leetcode-stats-api.herokuapp.com/${username}`
      );
      setUserDetail(data);
    } catch {
      setUserDetail(null);
    }
  };

  const closeDetails = () => {
    setShowDetails(false);
    setUserDetail(null);
    setSelectedUser("");
  };

  return (
    <div className="p-6 w-80 bg-white rounded-2xl shadow-lg font-sans">
      {!showDetails ? (
        <>
          <h2 className="font-serif text-2xl font-semibold mb-4">Tracked Users</h2>
          {users.length === 0 ? (
            <p className="text-gray-500 italic">No users tracked.</p>
          ) : (
            <ul className="space-y-2">
              {users.map((url) => {
                const name = url.split("/u/")[1].replace("/", "");
                return (
                  <li key={name} className="flex justify-between items-center">
                    <a
                      href={url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-blue-600 hover:underline font-mono"
                    >
                      {name}
                    </a>
                    <div className="space-x-1">
                      <button
                        onClick={() => showUserDetails(name)}
                        className="px-2 py-1 bg-indigo-500 text-white rounded-lg hover:bg-indigo-600 transition font-medium"
                      >
                        Details
                      </button>
                      <button
                        onClick={() => handleDelete(url)}
                        className="px-2 py-1 bg-red-500 text-white rounded-lg hover:bg-red-600 transition font-medium"
                      >
                        Delete
                      </button>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
          {users.length > 0 && (
            <button
              onClick={clearAll}
              className="mt-4 w-full px-3 py-2 bg-red-400 text-white rounded-lg hover:bg-red-500 transition font-medium"
            >
              Clear All
            </button>
          )}
        </>
      ) : (
        <div className="relative bg-gray-50 p-4 rounded-xl shadow-inner font-sans">
          <button
            onClick={closeDetails}
            className="absolute top-3 right-3 text-gray-400 hover:text-gray-600 text-xl font-bold"
          >
            ✕
          </button>
          <h2 className="font-serif text-xl font-semibold mb-3">{selectedUser}</h2>
          {!userDetail ? (
            <p className="text-gray-500 italic">Loading...</p>
          ) : (
            <div className="space-y-2 text-gray-800 font-mono">
              <p>
                <span className="font-medium text-green-600">Easy:</span> {userDetail.easySolved} / {userDetail.totalEasy}
              </p>
              <p>
                <span className="font-medium text-yellow-500">Medium:</span> {userDetail.mediumSolved} / {userDetail.totalMedium}
              </p>
              <p>
                <span className="font-medium text-red-600">Hard:</span> {userDetail.hardSolved} / {userDetail.totalHard}
              </p>
              <p>
                <span className="font-medium">Total Solved:</span> {userDetail.totalSolved}
              </p>
              <p>
                <span className="font-medium">Ranking:</span> {userDetail.ranking}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
