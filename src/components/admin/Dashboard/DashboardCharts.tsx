"use client";

import { formatDistanceToNow } from "date-fns";
import { motion } from "framer-motion";
import {
  ArrowDownRight,
  ArrowUpRight,
  BookOpen,
  Calendar,
  CheckCircle2,
  Clock,
  Code2,
  Eye,
  FolderOpen,
  GitFork,
  Github,
  ImageOff,
  MessageSquare,
  Minus,
  Sparkles,
  Star,
  TrendingUp,
  Zap,
} from "lucide-react";
import {
  Area,
  AreaChart,
  Cell,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const COLORS = {
  primary: "#6366f1",
  accent: "#06b6d4",
  green: "#22c55e",
  yellow: "#eab308",
  pink: "#ec4899",
  orange: "#f97316",
};

const CATEGORY_COLORS = [
  COLORS.primary,
  COLORS.accent,
  COLORS.green,
  COLORS.yellow,
  COLORS.pink,
  COLORS.orange,
];

function DeltaBadge({ delta }: { delta: number }) {
  if (delta === 0)
    return (
      <span className="flex items-center gap-0.5 text-gray-500 text-xs">
        <Minus size={11} /> 0%
      </span>
    );
  const up = delta > 0;
  return (
    <span
      className={`flex items-center gap-0.5 text-xs font-semibold ${up ? "text-green-400" : "text-red-400"}`}
    >
      {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {Math.abs(delta)}%
    </span>
  );
}

function SectionTitle({
  icon,
  title,
  sub,
}: {
  icon: React.ReactNode;
  title: string;
  sub?: string;
}) {
  return (
    <div className="flex items-center gap-2 mb-5">
      <div className="text-primary-400">{icon}</div>
      <div>
        <h3 className="text-white font-bold text-sm">{title}</h3>
        {sub && <p className="text-gray-500 text-xs">{sub}</p>}
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }: any) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 shadow-xl text-xs">
      <p className="text-gray-400 mb-1">{label}</p>
      {payload.map((p: any, i: number) => (
        <p key={i} style={{ color: p.color }} className="font-semibold">
          {p.name}: {p.value}
        </p>
      ))}
    </div>
  );
}

const colorMap = {
  primary:
    "from-primary-500/15 to-transparent border-primary-500/20 text-primary-400",
  accent: "from-cyan-500/15 to-transparent border-cyan-500/20 text-cyan-400",
  green: "from-green-500/15 to-transparent border-green-500/20 text-green-400",
  yellow:
    "from-yellow-500/15 to-transparent border-yellow-500/20 text-yellow-400",
  pink: "from-pink-500/15 to-transparent border-pink-500/20 text-pink-400",
};

function StatCard({
  label,
  value,
  sub,
  icon,
  color = "primary",
  delay = 0,
  delta,
}: {
  label: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  color?: keyof typeof colorMap;
  delay?: number;
  delta?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay, duration: 0.4 }}
      className={`relative bg-gradient-to-br ${colorMap[color]} border rounded-2xl p-5 overflow-hidden`}
    >
      <div className="flex items-start justify-between">
        <div className="flex-1 min-w-0">
          <p className="text-xs text-gray-500 font-medium uppercase tracking-wider mb-1">
            {label}
          </p>
          <p className="text-3xl font-black text-white tabular-nums">{value}</p>
          <div className="flex items-center gap-2 mt-1">
            {sub && <p className="text-xs text-gray-500">{sub}</p>}
            {delta !== undefined && <DeltaBadge delta={delta} />}
          </div>
        </div>
        <div
          className={`p-2.5 rounded-xl bg-gray-900/50 shrink-0 ${colorMap[color].split(" ").pop()}`}
        >
          {icon}
        </div>
      </div>
      <div className="absolute -bottom-4 -right-4 w-20 h-20 rounded-full bg-white/[0.02]" />
    </motion.div>
  );
}

function ComparisonCard({
  title,
  icon,
  week,
  month,
  delay,
}: {
  title: string;
  icon: React.ReactNode;
  week: { current: number; delta: number };
  month: { current: number; delta: number };
  delay?: number;
}) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: delay ?? 0 }}
      className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
    >
      <div className="flex items-center gap-2 mb-4">
        <div className="text-primary-400">{icon}</div>
        <h3 className="text-white font-bold text-sm">{title}</h3>
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="bg-gray-800/50 rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">This week</p>
          <p className="text-xl font-black text-white tabular-nums">
            {week.current}
          </p>
          <DeltaBadge delta={week.delta} />
        </div>
        <div className="bg-gray-800/50 rounded-xl p-3">
          <p className="text-xs text-gray-500 mb-1">This month</p>
          <p className="text-xl font-black text-white tabular-nums">
            {month.current}
          </p>
          <DeltaBadge delta={month.delta} />
        </div>
      </div>
    </motion.div>
  );
}

export function DashboardCharts({ data }: { data: any }) {
  const {
    stats,
    projectViewsByDay,
    postViewsByDay,
    topProjects,
    topPosts,
    projectsByCategory,
    skillsByCategory,
    projectsWithoutImage,
    projectsWithoutViews,
    pendingCommentsList,
    githubStats,
    comparisons,
    activityFeed,
    recentProjectViews,
  } = data;

  const combinedViews = projectViewsByDay.map((d: any, i: number) => ({
    date: d.date,
    projects: d.views,
    posts: postViewsByDay[i]?.views ?? 0,
  }));

  const skillsRadial = skillsByCategory.map((s: any, i: number) => ({
    name: s.name,
    value: s.avgLevel * 10,
    count: s.count,
    fill: CATEGORY_COLORS[i % CATEGORY_COLORS.length],
  }));

  const rateData = [
    {
      name: "Projects",
      value: stats.publishedProjectsRate,
      fill: COLORS.primary,
    },
    { name: "Posts", value: stats.publishedPostsRate, fill: COLORS.accent },
  ];

  const activityIcons: Record<string, React.ReactNode> = {
    project: <FolderOpen size={13} className="text-primary-400" />,
    post: <BookOpen size={13} className="text-cyan-400" />,
    comment: <MessageSquare size={13} className="text-yellow-400" />,
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          label="Projects"
          value={stats.publishedProjects}
          sub={`${stats.totalProjects} total`}
          icon={<FolderOpen size={18} />}
          color="primary"
          delay={0}
          delta={comparisons.week.projectViews.delta}
        />
        <StatCard
          label="Posts"
          value={stats.publishedPosts}
          sub={`${stats.totalPosts} total`}
          icon={<BookOpen size={18} />}
          color="accent"
          delay={0.05}
        />
        <StatCard
          label="Project Views"
          value={stats.totalProjectViews.toLocaleString()}
          icon={<Eye size={18} />}
          color="green"
          delay={0.1}
          delta={comparisons.week.projectViews.delta}
        />
        <StatCard
          label="Comments"
          value={stats.pendingComments}
          sub="awaiting approval"
          icon={<MessageSquare size={18} />}
          color={stats.pendingComments > 0 ? "yellow" : "green"}
          delay={0.15}
        />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
        className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
      >
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-white font-bold text-sm">Views over time</h3>
            <p className="text-gray-500 text-xs mt-0.5">Last 14 days</p>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1 rounded-full bg-primary-500" />
              <span className="text-gray-400">Projects</span>
            </div>
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-1 rounded-full bg-cyan-500" />
              <span className="text-gray-400">Posts</span>
            </div>
          </div>
        </div>
        <ResponsiveContainer width="100%" height={220}>
          <AreaChart
            data={combinedViews}
            margin={{ top: 5, right: 5, left: -20, bottom: 0 }}
          >
            <defs>
              <linearGradient id="gradProjects" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor={COLORS.primary}
                  stopOpacity={0.3}
                />
                <stop offset="95%" stopColor={COLORS.primary} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradPosts" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.accent} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.accent} stopOpacity={0} />
              </linearGradient>
            </defs>
            <XAxis
              dataKey="date"
              tick={{ fill: "#6b7280", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              interval={2}
            />
            <YAxis
              tick={{ fill: "#6b7280", fontSize: 11 }}
              tickLine={false}
              axisLine={false}
              allowDecimals={false}
            />
            <Tooltip content={<CustomTooltip />} />
            <Area
              type="monotone"
              dataKey="projects"
              name="Projects"
              stroke={COLORS.primary}
              strokeWidth={2}
              fill="url(#gradProjects)"
              dot={false}
              activeDot={{ r: 4, fill: COLORS.primary }}
            />
            <Area
              type="monotone"
              dataKey="posts"
              name="Posts"
              stroke={COLORS.accent}
              strokeWidth={2}
              fill="url(#gradPosts)"
              dot={false}
              activeDot={{ r: 4, fill: COLORS.accent }}
            />
          </AreaChart>
        </ResponsiveContainer>
      </motion.div>

      <div className="grid sm:grid-cols-2 gap-4">
        <ComparisonCard
          title="Project Views"
          icon={<FolderOpen size={15} />}
          week={{
            current: comparisons.week.projectViews.current,
            delta: comparisons.week.projectViews.delta,
          }}
          month={{
            current: comparisons.month.projectViews.current,
            delta: comparisons.month.projectViews.delta,
          }}
          delay={0.25}
        />
        <ComparisonCard
          title="Post Views"
          icon={<BookOpen size={15} />}
          week={{
            current: comparisons.week.postViews.current,
            delta: comparisons.week.postViews.delta,
          }}
          month={{
            current: comparisons.month.postViews.current,
            delta: comparisons.month.postViews.delta,
          }}
          delay={0.3}
        />
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
        >
          <SectionTitle icon={<TrendingUp size={15} />} title="Top Projects" />
          <div className="space-y-3">
            {topProjects.map((p: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-mono text-gray-600 w-4 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-200 text-xs font-medium truncate">
                    {p.title}
                  </p>
                  <div className="mt-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(p.views / (topProjects[0]?.views || 1)) * 100}%`,
                      }}
                      transition={{ delay: 0.35 + i * 0.07, duration: 0.6 }}
                      className="h-full rounded-full bg-gradient-to-r from-primary-500 to-accent-500"
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-mono shrink-0">
                  {p.views}
                </span>
              </div>
            ))}
            {topProjects.length === 0 && (
              <p className="text-gray-600 text-xs text-center py-4">
                No data yet
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
        >
          <SectionTitle
            icon={<Sparkles size={15} />}
            title="Top Posts"
            sub={`avg ${stats.avgReadTime} min read`}
          />
          <div className="space-y-3">
            {topPosts.map((p: any, i: number) => (
              <div key={i} className="flex items-center gap-3">
                <span className="text-xs font-mono text-gray-600 w-4 shrink-0">
                  {i + 1}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="text-gray-200 text-xs font-medium truncate">
                    {p.title}
                  </p>
                  <div className="mt-1 h-1 bg-gray-800 rounded-full overflow-hidden">
                    <motion.div
                      initial={{ width: 0 }}
                      animate={{
                        width: `${(p.views / (topPosts[0]?.views || 1)) * 100}%`,
                      }}
                      transition={{ delay: 0.4 + i * 0.07, duration: 0.6 }}
                      className="h-full rounded-full bg-gradient-to-r from-cyan-500 to-primary-500"
                    />
                  </div>
                </div>
                <span className="text-xs text-gray-400 font-mono shrink-0">
                  {p.views}
                </span>
              </div>
            ))}
            {topPosts.length === 0 && (
              <p className="text-gray-600 text-xs text-center py-4">
                No data yet
              </p>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
        >
          <SectionTitle
            icon={<Code2 size={15} />}
            title="Projects by Category"
          />
          {projectsByCategory.length > 0 ? (
            <>
              <ResponsiveContainer width="100%" height={140}>
                <PieChart>
                  <Pie
                    data={projectsByCategory}
                    cx="50%"
                    cy="50%"
                    innerRadius={38}
                    outerRadius={60}
                    paddingAngle={3}
                    dataKey="value"
                  >
                    {projectsByCategory.map((_: any, i: number) => (
                      <Cell
                        key={i}
                        fill={CATEGORY_COLORS[i % CATEGORY_COLORS.length]}
                        stroke="transparent"
                      />
                    ))}
                  </Pie>
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      return (
                        <div className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs shadow-xl">
                          <p className="text-white font-semibold">
                            {payload[0].name}
                          </p>
                          <p className="text-gray-400">
                            {payload[0].value} projects
                          </p>
                        </div>
                      );
                    }}
                  />
                </PieChart>
              </ResponsiveContainer>
              <div className="grid grid-cols-2 gap-x-3 gap-y-1.5 mt-2">
                {projectsByCategory.map((cat: any, i: number) => (
                  <div key={i} className="flex items-center gap-1.5">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{
                        backgroundColor:
                          CATEGORY_COLORS[i % CATEGORY_COLORS.length],
                      }}
                    />
                    <span className="text-gray-400 text-xs truncate">
                      {cat.name}
                    </span>
                    <span className="text-gray-600 text-xs ml-auto">
                      {cat.value}
                    </span>
                  </div>
                ))}
              </div>
            </>
          ) : (
            <p className="text-gray-600 text-xs text-center py-8">
              No data yet
            </p>
          )}
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-2 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
        >
          <SectionTitle
            icon={<Zap size={15} />}
            title="Skills by Category"
            sub={`${stats.totalSkills} skills total`}
          />
          {skillsRadial.length > 0 ? (
            <div className="flex items-center gap-6">
              <ResponsiveContainer width={160} height={160}>
                <RadialBarChart
                  cx="50%"
                  cy="50%"
                  innerRadius={20}
                  outerRadius={70}
                  data={skillsRadial}
                  startAngle={90}
                  endAngle={-270}
                >
                  <RadialBar
                    dataKey="value"
                    cornerRadius={4}
                    background={{ fill: "#1f2937" }}
                  />
                  <Tooltip
                    content={({ active, payload }) => {
                      if (!active || !payload?.length) return null;
                      const d = payload[0].payload;
                      return (
                        <div className="bg-gray-900 border border-gray-700 rounded-xl px-3 py-2 text-xs shadow-xl">
                          <p className="text-white font-semibold">{d.name}</p>
                          <p className="text-gray-400">
                            Avg level: {(d.value / 10).toFixed(1)}
                          </p>
                          <p className="text-gray-400">{d.count} skills</p>
                        </div>
                      );
                    }}
                  />
                </RadialBarChart>
              </ResponsiveContainer>
              <div className="flex-1 space-y-2">
                {skillsRadial.map((s: any, i: number) => (
                  <div key={i} className="flex items-center gap-2">
                    <div
                      className="w-2 h-2 rounded-full shrink-0"
                      style={{ backgroundColor: s.fill }}
                    />
                    <span className="text-gray-300 text-xs flex-1 truncate">
                      {s.name}
                    </span>
                    <span className="text-gray-500 text-xs font-mono">
                      {s.count}
                    </span>
                    <span
                      className="text-xs font-mono"
                      style={{ color: s.fill }}
                    >
                      {(s.value / 10).toFixed(1)}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <p className="text-gray-600 text-xs text-center py-8">
              No skills yet
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45 }}
          className="bg-gray-900 rounded-2xl border border-gray-800 p-5 space-y-5"
        >
          <SectionTitle
            icon={<TrendingUp size={15} />}
            title="Publication Rate"
          />

          <div className="space-y-3">
            {rateData.map((item) => (
              <div key={item.name}>
                <div className="flex justify-between text-xs mb-1.5">
                  <span className="text-gray-400">{item.name}</span>
                  <span className="text-white font-mono font-bold">
                    {item.value}%
                  </span>
                </div>
                <div className="h-2 bg-gray-800 rounded-full overflow-hidden">
                  <motion.div
                    initial={{ width: 0 }}
                    animate={{ width: `${item.value}%` }}
                    transition={{ delay: 0.5, duration: 0.8, ease: "easeOut" }}
                    className="h-full rounded-full"
                    style={{ backgroundColor: item.fill }}
                  />
                </div>
              </div>
            ))}
          </div>

          <div className="pt-2 border-t border-gray-800">
            <div className="flex items-center gap-2 mb-3">
              <Github size={15} className="text-gray-400" />
              <span className="text-white font-bold text-sm">GitHub Stats</span>
            </div>
            <div className="grid grid-cols-3 gap-3">
              <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                <Star size={14} className="text-yellow-400 mx-auto mb-1" />
                <p className="text-white font-black text-lg tabular-nums">
                  {githubStats.totalStars}
                </p>
                <p className="text-gray-500 text-xs">Stars</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                <GitFork size={14} className="text-primary-400 mx-auto mb-1" />
                <p className="text-white font-black text-lg tabular-nums">
                  {githubStats.totalForks}
                </p>
                <p className="text-gray-500 text-xs">Forks</p>
              </div>
              <div className="bg-gray-800/50 rounded-xl p-3 text-center">
                <Clock size={14} className="text-cyan-400 mx-auto mb-1" />
                <p className="text-white font-black text-sm tabular-nums">
                  {githubStats.lastSync
                    ? formatDistanceToNow(new Date(githubStats.lastSync), {
                        addSuffix: true,
                      })
                    : "—"}
                </p>
                <p className="text-gray-500 text-xs">Last sync</p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>

      <div className="grid lg:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
          className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
        >
          <SectionTitle
            icon={<MessageSquare size={15} />}
            title="Pending Comments"
            sub={`${pendingCommentsList.length} awaiting approval`}
          />
          {pendingCommentsList.length > 0 ? (
            <div className="space-y-3">
              {pendingCommentsList.map((c: any) => (
                <div key={c.id} className="flex items-start gap-2.5">
                  <div className="w-6 h-6 rounded-full bg-yellow-500/10 border border-yellow-500/20 flex items-center justify-center shrink-0 mt-0.5">
                    <MessageSquare size={11} className="text-yellow-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-gray-200 text-xs font-medium truncate">
                      {c.name}
                    </p>
                    <p className="text-gray-500 text-xs truncate">
                      {c.content}
                    </p>
                    <a
                      href={`/admin/blog/comments`}
                      className="text-primary-400 text-xs hover:underline"
                    >
                      on: {c.post?.title}
                    </a>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-6 gap-2">
              <CheckCircle2 size={24} className="text-green-400" />
              <p className="text-gray-500 text-xs">All caught up!</p>
            </div>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55 }}
          className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
        >
          <SectionTitle icon={<Zap size={15} />} title="Needs Attention" />
          <div className="space-y-4">
            {projectsWithoutImage.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <ImageOff size={12} className="text-orange-400" />
                  <span className="text-xs text-orange-400 font-medium">
                    Missing image ({projectsWithoutImage.length})
                  </span>
                </div>
                <div className="space-y-1.5">
                  {projectsWithoutImage.slice(0, 3).map((p: any) => (
                    <div key={p.id} className="flex items-center gap-2 pl-4">
                      <div className="w-1 h-1 rounded-full bg-gray-600" />
                      <span className="text-gray-400 text-xs truncate">
                        {p.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {projectsWithoutViews.length > 0 && (
              <div>
                <div className="flex items-center gap-1.5 mb-2">
                  <Eye size={12} className="text-yellow-400" />
                  <span className="text-xs text-yellow-400 font-medium">
                    No views yet ({projectsWithoutViews.length})
                  </span>
                </div>
                <div className="space-y-1.5">
                  {projectsWithoutViews.slice(0, 3).map((p: any) => (
                    <div key={p.id} className="flex items-center gap-2 pl-4">
                      <div className="w-1 h-1 rounded-full bg-gray-600" />
                      <span className="text-gray-400 text-xs truncate">
                        {p.title}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
            {projectsWithoutImage.length === 0 &&
              projectsWithoutViews.length === 0 && (
                <div className="flex flex-col items-center justify-center py-6 gap-2">
                  <CheckCircle2 size={24} className="text-green-400" />
                  <p className="text-gray-500 text-xs">
                    Everything looks good!
                  </p>
                </div>
              )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
          className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
        >
          <SectionTitle icon={<Calendar size={15} />} title="Recent Activity" />
          <div className="relative">
            <div className="absolute left-3 top-0 bottom-0 w-px bg-gray-800" />
            <div className="space-y-4">
              {activityFeed.map((item: any, i: number) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: -8 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.65 + i * 0.05 }}
                  className="flex items-start gap-3 pl-2"
                >
                  <div className="w-6 h-6 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center shrink-0 z-10">
                    {activityIcons[item.type]}
                  </div>
                  <div className="flex-1 min-w-0 pt-0.5">
                    <p className="text-gray-400 text-xs">{item.label}</p>
                    <p className="text-gray-200 text-xs font-medium truncate">
                      {item.title}
                    </p>
                    <p className="text-gray-600 text-xs mt-0.5">
                      {formatDistanceToNow(new Date(item.date), {
                        addSuffix: true,
                      })}
                    </p>
                  </div>
                </motion.div>
              ))}
              {activityFeed.length === 0 && (
                <p className="text-gray-600 text-xs text-center py-4 pl-4">
                  No activity yet
                </p>
              )}
            </div>
          </div>
        </motion.div>
      </div>

      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.65 }}
        className="bg-gray-900 rounded-2xl border border-gray-800 p-5"
      >
        <SectionTitle
          icon={<Eye size={15} />}
          title="Recent Project Views"
          sub="Last 5 visits"
        />
        <div className="overflow-x-auto">
          <table className="w-full text-xs">
            <thead>
              <tr className="border-b border-gray-800">
                <th className="text-left py-2 px-3 text-gray-500 font-medium">
                  Project
                </th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">
                  IP
                </th>
                <th className="text-left py-2 px-3 text-gray-500 font-medium">
                  When
                </th>
              </tr>
            </thead>
            <tbody>
              {recentProjectViews.map((v: any, i: number) => (
                <tr
                  key={i}
                  className="border-b border-gray-800/50 hover:bg-gray-800/20 transition-colors"
                >
                  <td className="py-2.5 px-3 text-gray-200 font-medium truncate max-w-[160px]">
                    {v.project}
                  </td>
                  <td className="py-2.5 px-3 text-gray-500 font-mono">
                    {v.ip}
                  </td>
                  <td className="py-2.5 px-3 text-gray-500">
                    {formatDistanceToNow(new Date(v.date), { addSuffix: true })}
                  </td>
                </tr>
              ))}
              {recentProjectViews.length === 0 && (
                <tr>
                  <td colSpan={3} className="text-center py-6 text-gray-600">
                    No views yet
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </motion.div>
    </div>
  );
}
