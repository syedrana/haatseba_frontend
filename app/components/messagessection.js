"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

const messagessection = ({ messages }) => {
  const [openYear, setOpenYear] = useState(null);

  const groupedMessages = messages?.reduce((acc, msg) => {
    const year = new Date(msg.createdAt).getFullYear();
    if (!acc[year]) acc[year] = [];
    acc[year].push(msg);
    return acc;
  }, {});

  const toggleYear = (year) => {
    setOpenYear(openYear === year ? null : year);
  };

  return (
    <div className="bg-white rounded-2xl shadow-xl p-4 sm:p-6 md:p-8">
      <h2 className="text-2xl font-bold text-white bg-gradient-to-r from-indigo-500 to-purple-600 p-4 rounded-t-2xl mb-4 shadow-md">
        Contact Messages
      </h2>

      {groupedMessages &&
        Object.keys(groupedMessages)
          .sort((a, b) => b - a)
          .map((year) => (
            <div key={year} className="mb-6 border rounded-lg shadow-md">
              <button
                onClick={() => toggleYear(year)}
                className="w-full flex justify-between items-center bg-gradient-to-r from-indigo-100 to-purple-100 hover:from-indigo-200 hover:to-purple-200 px-4 py-3 font-semibold text-indigo-800 text-lg rounded-t-lg transition-all duration-200"
              >
                <span>{year}</span>
                {openYear === year ? <ChevronUp /> : <ChevronDown />}
              </button>

              {openYear === year && (
                <div className="p-4 bg-gray-50 rounded-b-lg">
                  {groupedMessages[year].map((msg) => (
                    <div
                      key={msg._id}
                      className="mb-4 p-4 bg-white rounded-lg shadow hover:shadow-md transition"
                    >
                      <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                        <h4 className="font-bold text-indigo-700">{msg.name}</h4>
                        <p className="text-sm text-gray-500">
                          {new Date(msg.createdAt).toLocaleString("en-US", {
                            dateStyle: "medium",
                            timeStyle: "short",
                          })}
                        </p>
                      </div>
                      <p className="text-gray-800 mt-1">
                        <span className="font-semibold">Email:</span> {msg.email}
                      </p>
                      <p className="text-gray-800 mt-1">
                        <span className="font-semibold">Mobile:</span> {msg.mobile}
                      </p>
                      <p className="text-gray-800 mt-2">{msg.message}</p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}
    </div>
  );
};

export default messagessection;
