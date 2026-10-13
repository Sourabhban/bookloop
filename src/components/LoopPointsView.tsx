import React from 'react';
import {
  Flame,
  Award,
  BookOpen,
  Calendar,
  ShieldCheck,
  CheckCircle2,
  Trophy,
  Users,
  Sparkles,
  Ticket,
  Lock,
} from 'lucide-react';
import { useBookLoop } from '../context/BookLoopContext';

export const LoopPointsView: React.FC = () => {
  const { user, badges, departments } = useBookLoop();

  // Calendar dates for reading streak (e.g. current month days 1 to 31)
  const daysInMonth = Array.from({ length: 31 }, (_, i) => i + 1);
  const activeStreakDays = [1, 2, 3, 4, 5, 6, 7, 12, 13, 14, 18, 19, 24, 25];

  const rewardsCatalog = [
    {
      id: 'rew-1',
      title: 'Dean’s Honor Roll Certificate',
      points: 500,
      description: 'Official academic circular contribution recognition signed by Faculty Council.',
      redeemable: user.points >= 500,
    },
    {
      id: 'rew-2',
      title: 'Priority Library Carrel Access',
      points: 350,
      description: 'Reserved quiet study carrel during mid-semester examination week.',
      redeemable: user.points >= 350,
    },
    {
      id: 'rew-3',
      title: 'Eco-Friendly Campus Bookplate Set',
      points: 200,
      description: 'Personalized embossed stamps to mark your donated books in circulation.',
      redeemable: user.points >= 200,
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <span className="text-xs font-bold uppercase tracking-wider text-amber-600">
            Non-Monetary Gamification
          </span>
          <h2 className="text-xl font-bold tracking-tight text-slate-900 mt-0.5">
            LoopPoints & Reading Rewards
          </h2>
          <p className="text-xs text-slate-500 mt-1 max-w-2xl">
            Rewarded strictly for verified community handovers and timely returns. Points cannot be earned merely for listing a book.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="text-right">
            <span className="text-[11px] text-slate-500 uppercase font-semibold">Your Balance</span>
            <div className="font-mono-numbers text-2xl font-bold text-slate-900">
              {user.points} <span className="text-xs font-normal text-slate-500">LoopPoints</span>
            </div>
          </div>
          <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center font-mono-numbers text-xl font-bold border border-amber-200">
            L{user.level}
          </div>
        </div>
      </div>

      {/* Beanstack Style Cards (Screenshot 2 Design) */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Beanstack Level & Challenge Progress */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between relative overflow-hidden">
          <div className="text-center space-y-4">
            <div className="inline-block relative">
              {/* Beanstack circular striped level ring */}
              <div className="w-28 h-28 rounded-full border-4 border-amber-400 p-1 flex items-center justify-center bg-gradient-to-tr from-amber-400 to-orange-400 shadow-md">
                <div className="w-full h-full rounded-full bg-white flex flex-col items-center justify-center text-slate-900">
                  <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                    Level
                  </span>
                  <span className="text-3xl font-bold font-mono-numbers text-amber-600">
                    {user.level}
                  </span>
                </div>
              </div>
              <div className="absolute bottom-0 right-1 w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center shadow">
                <CheckCircle2 className="w-4 h-4" />
              </div>
            </div>

            <div>
              <span className="text-xs text-slate-400 font-medium">Semester Target</span>
              <h3 className="text-lg font-bold text-slate-900">
                Shared {user.donatedBookIds.length + 3} Textbooks
              </h3>
              <p className="text-xs text-slate-500 mt-1">
                Completed Campus Sharing Challenge
              </p>
            </div>

            <div className="bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs font-semibold py-1.5 px-4 rounded-xl inline-block">
              {user.hoursRead} of 40 Hours Logged
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-slate-100 space-y-3">
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Current Reward</span>
              <span className="font-semibold text-slate-900">Sticker Pack & Badge</span>
            </div>
            <div className="flex items-center justify-between text-xs">
              <span className="text-slate-600 font-medium">Campus Tickets</span>
              <span className="font-mono-numbers font-bold text-amber-600">5 Tickets</span>
            </div>
          </div>
        </div>

        {/* Card 2: Streak & Calendar Log (Screenshot 2 Design) */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            {/* Beanstack Streak Banner */}
            <div className="bg-rose-50/80 border border-rose-100 rounded-2xl p-4 text-center space-y-1">
              <div className="flex items-center justify-center gap-1.5 text-rose-600">
                <Flame className="w-5 h-5 fill-rose-500" />
                <span className="text-xs font-bold uppercase tracking-wider">Active</span>
              </div>
              <div className="text-2xl font-bold font-mono-numbers text-slate-900">
                {user.currentStreak} Days
              </div>
              <div className="text-xs text-slate-500">Longest: {user.longestStreak} Days</div>
            </div>

            {/* Calendar Grid Representation */}
            <div className="mt-5 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold text-slate-700 px-1">
                <span>March 2026</span>
                <span className="text-slate-400 text-[10px]">Active Reading Days</span>
              </div>

              <div className="grid grid-cols-7 gap-1.5 text-center text-[10px] text-slate-400 font-medium py-1">
                <span>S</span>
                <span>M</span>
                <span>T</span>
                <span>W</span>
                <span>T</span>
                <span>F</span>
                <span>S</span>
              </div>

              <div className="grid grid-cols-7 gap-1.5 text-center text-xs">
                {daysInMonth.map((day) => {
                  const isActive = activeStreakDays.includes(day);
                  const isCurrent = day === 3;
                  return (
                    <div
                      key={day}
                      className={`h-7 rounded-lg flex items-center justify-center text-[11px] font-mono-numbers transition-all ${
                        isCurrent
                          ? 'bg-indigo-600 text-white font-bold shadow-xs'
                          : isActive
                          ? 'bg-rose-100 text-rose-800 font-semibold'
                          : 'text-slate-500 hover:bg-slate-100'
                      }`}
                    >
                      {day}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-100 text-center">
            <span className="text-[11px] text-slate-400">
              Read 20 mins daily or complete a verified handover to sustain streak
            </span>
          </div>
        </div>

        {/* Card 3: Department-Wise Challenge Leaderboard */}
        <div className="bg-white rounded-3xl p-6 border border-slate-200/90 shadow-sm flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <Trophy className="w-5 h-5 text-amber-500" />
                <h3 className="text-sm font-bold text-slate-900">
                  College Dept Leaderboard
                </h3>
              </div>
              <span className="text-[10px] text-slate-400 uppercase font-semibold">
                Sem 4 Standings
              </span>
            </div>

            <div className="space-y-2.5">
              {departments.map((dept) => (
                <div
                  key={dept.department}
                  className={`p-2.5 rounded-xl border flex items-center justify-between text-xs ${
                    dept.rank === 1
                      ? 'bg-amber-50/70 border-amber-200 text-slate-900 font-semibold'
                      : 'bg-slate-50/60 border-slate-200/80 text-slate-700'
                  }`}
                >
                  <div className="flex items-center gap-2.5 truncate">
                    <span
                      className={`w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0 ${
                        dept.rank === 1
                          ? 'bg-amber-500 text-white'
                          : dept.rank === 2
                          ? 'bg-slate-300 text-slate-700'
                          : 'bg-slate-200 text-slate-600'
                      }`}
                    >
                      {dept.rank}
                    </span>
                    <span className="truncate">{dept.department}</span>
                  </div>
                  <span className="font-mono-numbers font-bold text-slate-900 shrink-0 ml-2">
                    {dept.booksShared} shares
                  </span>
                </div>
              ))}
            </div>
          </div>

          <div className="pt-4 mt-4 border-t border-slate-100 text-xs text-slate-500 text-center">
            Your Dept: <span className="font-semibold text-slate-900">{user.department}</span> (#1 Rank)
          </div>
        </div>
      </div>

      {/* Achievement Badges Showcase */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Community Achievement Badges
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Unlocked upon transparent physical and digital milestones verified by campus nodes.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          {badges.map((b) => (
            <div
              key={b.id}
              className={`p-4 rounded-xl border transition-all flex flex-col justify-between ${
                b.unlocked
                  ? 'bg-indigo-50/50 border-indigo-200 text-slate-900'
                  : 'bg-slate-50 border-slate-200 text-slate-400'
              }`}
            >
              <div>
                <div className="flex items-center justify-between mb-2">
                  <div
                    className={`w-9 h-9 rounded-xl flex items-center justify-center ${
                      b.unlocked
                        ? 'bg-indigo-600 text-white shadow-xs'
                        : 'bg-slate-200 text-slate-400'
                    }`}
                  >
                    {b.unlocked ? <Award className="w-5 h-5" /> : <Lock className="w-4 h-4" />}
                  </div>
                  {b.unlocked && (
                    <span className="text-[10px] text-emerald-600 font-bold bg-emerald-50 px-1.5 py-0.5 rounded">
                      Earned
                    </span>
                  )}
                </div>

                <h4 className="text-xs font-bold text-slate-900">{b.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-snug">
                  {b.description}
                </p>
              </div>

              <div className="mt-4 pt-2 border-t border-slate-200/50">
                <div className="flex items-center justify-between text-[10px] text-slate-500 mb-1">
                  <span>Progress</span>
                  <span className="font-mono-numbers">
                    {b.progress}/{b.maxProgress}
                  </span>
                </div>
                <div className="w-full h-1.5 bg-slate-200 rounded-full overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all ${
                      b.unlocked ? 'bg-indigo-600' : 'bg-slate-400'
                    }`}
                    style={{ width: `${(b.progress / b.maxProgress) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Non-Monetary Rewards Redemption */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200/90 shadow-sm space-y-4">
        <div>
          <h3 className="text-base font-bold text-slate-900">
            Institutional Non-Monetary Perks
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Sanctioned academic recognitions and study privileges funded by campus library initiatives.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {rewardsCatalog.map((rew) => (
            <div
              key={rew.id}
              className="p-4 rounded-xl border border-slate-200 bg-slate-50/50 flex flex-col justify-between space-y-3"
            >
              <div>
                <div className="flex items-center justify-between">
                  <span className="font-mono-numbers text-xs font-bold text-amber-700 bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                    {rew.points} Points
                  </span>
                </div>
                <h4 className="text-xs font-bold text-slate-900 mt-2">{rew.title}</h4>
                <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">
                  {rew.description}
                </p>
              </div>

              <button
                disabled={!rew.redeemable}
                onClick={() => alert(`Privilege "${rew.title}" requested! Faculty coordinator will notify your student email.`)}
                className={`w-full py-1.5 text-xs font-semibold rounded-lg transition-colors cursor-pointer ${
                  rew.redeemable
                    ? 'bg-slate-900 text-white hover:bg-slate-800'
                    : 'bg-slate-200 text-slate-400 cursor-not-allowed'
                }`}
              >
                {rew.redeemable ? 'Redeem Privilege' : 'Insufficient Points'}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
