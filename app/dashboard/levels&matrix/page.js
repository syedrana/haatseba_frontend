"use client";

import axios from "axios";
import { useEffect, useState } from "react";

export default function LevelPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [bonusAmounts, setBonusAmounts] = useState([]);
  const [achievedLevels, setAchievedLevels] = useState([]);

  useEffect(() => {
    const fetchBonuses = async () => {
      try {
        const token = localStorage.getItem("token");

        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_API_BASE}/getallbonusplans`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (res.status !== 200) {
          throw new Error(res.data?.message || "Failed to load bonus plans");
        }

        setBonusAmounts(res.data.plans);
        setAchievedLevels(res.data.bonusHistory.map(b => b.level));


      } catch (err) {
        console.error(err);
        setError("Failed to load bonus plan data");
      } finally {
        setLoading(false);
      }
    };

    fetchBonuses();
  }, []);

  if (loading) {
    return <p className="mt-10 text-sm text-gray-500">Loading bonus plans...</p>;
  }

  if (error) {
    return <p className="mt-10 text-sm text-red-500">{error}</p>;
  }

  return (
    <section className="mt-10">
      <h3 className="text-base md:text-lg font-semibold text-gray-900 dark:text-white mb-2">
        Levels & Matrix
      </h3>
      <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
        According to the bonus structure below, you can see how much bonus you
        will receive at each level and whether you have achieved it or not.
      </p>

      <div className="rounded-2xl border border-gray-100 dark:border-gray-700 bg-white/60 dark:bg-gray-800/60 backdrop-blur shadow-sm">
        {/* Desktop Header */}
        <div className="hidden md:grid grid-cols-4 gap-4 p-4 text-sm font-medium text-gray-500 dark:text-gray-400 border-b">
          <div>Level</div>
          <div>Bonus Reward</div>
          <div>Condition</div>
          <div>Status</div>
        </div>

        <div className="divide-y divide-gray-100 dark:divide-gray-700">
          {bonusAmounts.map((plan) => {
            const { level, bonusAmount, rewardType, condition } = plan;
            const achieved = achievedLevels.includes(level);

            const isNumber = !isNaN(Number(bonusAmount));
            const bonusText =
              rewardType === "cash"
                ? `BDT ${isNumber ? Number(bonusAmount).toLocaleString() : bonusAmount}`
                : rewardType === "product"
                ? `🎁 ${bonusAmount}`
                : bonusAmount;

            return (
              <div
                key={level}
                className="md:grid md:grid-cols-4 gap-4 p-4 text-sm flex flex-col"
              >
                {/* Desktop */}
                <div className="hidden md:block font-medium">
                  Level {level}
                </div>
                <div className="hidden md:block">{bonusText}</div>
                <div className="hidden md:block text-gray-500">
                  {condition}
                </div>
                <div className="hidden md:block">
                  {achieved ? (
                    <span className="bg-emerald-50 text-emerald-700 px-2 py-1 rounded-full text-xs">
                      ✅ Achieved
                    </span>
                  ) : (
                    <span className="bg-red-50 text-red-700 px-2 py-1 rounded-full text-xs">
                      ❌ Not Achieved
                    </span>
                  )}
                </div>

                {/* Mobile */}
                <div className="md:hidden bg-white dark:bg-gray-900 rounded-xl border p-3 mb-3">
                  <div className="flex justify-between font-semibold">
                    <span>Level {level}</span>
                    <span>{bonusText}</span>
                  </div>
                  <div className="flex justify-between mt-2 text-xs text-gray-500">
                    <span>{condition}</span>
                    <span>
                      {achieved ? "✅ Achieved" : "❌ Not Achieved"}
                    </span>
                  </div>
                </div>
              </div>
            );
          })}

          {bonusAmounts.length === 0 && (
            <p className="p-4 text-sm text-gray-500 text-center">
              No bonus plans found.
            </p>
          )}
        </div>
      </div>
    </section>
  );
}
