import { Card } from "../components/ui/card";
import { Trophy, Calendar, BookOpen, IndianRupee, Video, CheckCircle2, Lock, Download, Upload, Share2, Star, Github, Code2, RefreshCw, X, ExternalLink, TrendingUp, Award, Zap, Target, Flame, Activity, Users, Clock, Plus, Briefcase } from "lucide-react";
import { motion, AnimatePresence } from "motion/react";
import { useState, useEffect, useRef } from "react";
import html2canvas from "html2canvas";
import api from "../../lib/api";
import { Link } from "react-router";
import { useUser } from "../../lib/userContext";
import {
  getProfile,
  updateGitHubUsername,
  updateLeetCodeUsername,
  refreshGitHubData,
  refreshLeetCodeData,
  removeGitHubUsername,
  removeLeetCodeUsername,
} from "../../lib/profile";

interface GitHubData {
  profile: {
    username: string;
    name: string;
    avatar_url: string;
    bio: string;
    location: string;
    company: string;
    public_repos: number;
    followers: number;
    following: number;
  };
  repos: Array<{
    name: string;
    description: string;
    language: string;
    stars: number;
    forks: number;
    url: string;
  }>;
  activity: {
    recent_activity: Array<{ date: string; count: number }>;
  };
}

interface LeetCodeData {
  profile: {
    username: string;
    real_name: string;
    avatar: string;
    total_solved: number;
    easy_solved: number;
    medium_solved: number;
    hard_solved: number;
    contest_rating: number;
    contest_ranking: number;
    skill_level: string;
  };
  recent_submissions: Array<{
    title: string;
    statusDisplay: string;
    lang: string;
    timestamp: number;
  }>;
  contest_history: {
    current_rating: number;
    global_ranking: number;
    top_percentage: number;
    attended_contests: number;
    history: Array<{
      title: string;
      rating: number;
      ranking: number;
    }>;
  };
}

interface ProfileData {
  user: {
    id: string;
    name: string;
    email: string;
    college: string;
    trimind_score: number;
    streak_days: number;
  };
  github: {
    username: string | null;
    data: GitHubData | null;
    needs_refresh: boolean;
    fetched_at: string | null;
  };
  leetcode: {
    username: string | null;
    data: LeetCodeData | null;
    needs_refresh: boolean;
    fetched_at: string | null;
  };
}

export default function ProfileDashboard() {
  const { user } = useUser();
  const [profileData, setProfileData] = useState<ProfileData | null>(null);
  const [dashData, setDashData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState<'github' | 'leetcode' | null>(null);
  const [error, setError] = useState<string | null>(null);
  const profileCardRef = useRef<HTMLDivElement>(null);
  const [downloading, setDownloading] = useState(false);

  // Goals state
  const [goals, setGoals] = useState<any[]>([]);
  const [goalsLoading, setGoalsLoading] = useState(true);
  const [showAddGoal, setShowAddGoal] = useState(false);
  const [newGoalTitle, setNewGoalTitle] = useState('');
  const [newGoalAmount, setNewGoalAmount] = useState('');
  const [addingGoal, setAddingGoal] = useState(false);

  // Modal states
  const [showGitHubModal, setShowGitHubModal] = useState(false);
  const [showLeetCodeModal, setShowLeetCodeModal] = useState(false);
  const [githubInput, setGithubInput] = useState('');
  const [leetcodeInput, setLeetCodeInput] = useState('');

  useEffect(() => {
    fetchProfileData();
    fetchGoals();
  }, []);

  const fetchGoals = async () => {
    try {
      const res = await api.get('/finance/goals');
      setGoals(res.data.data.goals || []);
    } catch (err) {
      console.error('Failed to load goals', err);
    } finally {
      setGoalsLoading(false);
    }
  };

  const handleAddGoal = async () => {
    if (!newGoalTitle.trim() || !newGoalAmount) return;
    setAddingGoal(true);
    try {
      await api.post('/finance/goals', {
        title: newGoalTitle.trim(),
        target_amount_paise: Math.round(parseFloat(newGoalAmount) * 100),
      });
      setNewGoalTitle('');
      setNewGoalAmount('');
      setShowAddGoal(false);
      fetchGoals();
    } catch (err) {
      console.error('Failed to add goal', err);
      alert('Failed to add goal. Try again.');
    } finally {
      setAddingGoal(false);
    }
  };

  const fetchProfileData = async () => {
    try {
      setLoading(true);
      setError(null);
      const [profileRes, dashRes] = await Promise.all([
        getProfile(),
        api.get('/dashboard').then(r => r.data.data).catch(() => null),
      ]);
      setProfileData(profileRes);
      setDashData(dashRes);
      if (profileRes.github?.username) setGithubInput(profileRes.github.username);
      if (profileRes.leetcode?.username) setLeetCodeInput(profileRes.leetcode.username);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to load profile data');
    } finally {
      setLoading(false);
    }
  };

  const handleDownloadProfile = async () => {
    if (!profileCardRef.current) return;
    setDownloading(true);
    try {
      const canvas = await html2canvas(profileCardRef.current, {
        scale: 2,
        backgroundColor: '#ffffff',
        useCORS: true,
      });
      const link = document.createElement('a');
      link.download = `TriMind_Profile_${userData?.name?.replace(/\s+/g, '_') || 'Card'}.png`;
      link.href = canvas.toDataURL('image/png', 1.0);
      link.click();
    } catch (err) {
      console.error('Download failed', err);
      alert('Download failed. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  const handleWhatsAppShare = () => {
    const name = userData?.name || 'Student';
    const score = userData?.trimind_score || 0;
    const streak = userData?.streak_days || 0;
    const leetSolved = profileData?.leetcode?.data?.profile?.total_solved || 0;
    const budgetUsed = dashData?.finance?.budget_used_percent || 0;
    const interviewSessions = dashData?.interview?.sessions_this_week || 0;

    const message = `📊 *${name}'s TriMind Weekly Report*\n\n` +
      `🏆 Life Score: *${score}/1000*\n` +
      `🔥 Study Streak: *${streak} days*\n` +
      `💻 LeetCode Solved: *${leetSolved} problems*\n` +
      `💰 Budget Used: *${budgetUsed}% this month*\n` +
      `🎤 Interview Sessions: *${interviewSessions} this week*\n\n` +
      `Tracked by TriMind AI — Your Student Life OS 🚀`;

    const url = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  const handleGitHubConnect = async () => {
    try {
      await updateGitHubUsername(githubInput);
      setShowGitHubModal(false);
      await fetchProfileData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to connect GitHub account');
    }
  };

  const handleLeetCodeConnect = async () => {
    try {
      await updateLeetCodeUsername(leetcodeInput);
      setShowLeetCodeModal(false);
      await fetchProfileData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to connect LeetCode account');
    }
  };

  const handleRefreshGitHub = async () => {
    try {
      setRefreshing('github');
      await refreshGitHubData();
      await fetchProfileData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to refresh GitHub data');
    } finally {
      setRefreshing(null);
    }
  };

  const handleRefreshLeetCode = async () => {
    try {
      setRefreshing('leetcode');
      await refreshLeetCodeData();
      await fetchProfileData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to refresh LeetCode data');
    } finally {
      setRefreshing(null);
    }
  };

  const handleRemoveGitHub = async () => {
    try {
      await removeGitHubUsername();
      await fetchProfileData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove GitHub account');
    }
  };

  const handleRemoveLeetCode = async () => {
    try {
      await removeLeetCodeUsername();
      await fetchProfileData();
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to remove LeetCode account');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-violet"></div>
      </div>
    );
  }

  const userData = profileData?.user || user;
  const trimindScore = userData?.trimind_score || 0;
  const streakDays = userData?.streak_days || 0;

  // Calculate level based on score
  const level = Math.floor(trimindScore / 100) + 1;
  const xp = trimindScore % 100;
  const nextXp = 100;
  const progress = (xp / nextXp) * 100;

  // Generate activity heatmap from GitHub data
  let heatmap = Array.from({ length: 364 }, () => 0);
  if (profileData?.github?.data?.activity?.recent_activity) {
    const recent = profileData.github.data.activity.recent_activity.map((a) => a.count);
    const paddingCount = Math.max(0, 364 - recent.length);
    heatmap = [...Array.from({ length: paddingCount }, () => 0), ...recent];
  } else if (!profileData?.github?.username) {
    // Show a sparse sample pattern for unconnected users
    heatmap = Array.from({ length: 364 }, () => Math.random() > 0.8 ? Math.floor(Math.random() * 3) + 1 : 0);
  }

  return (
    <div className="space-y-8 pb-10">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-rose/10 border border-rose/20 text-rose px-4 py-3 rounded-lg flex items-center gap-3"
        >
          <X className="w-5 h-5 cursor-pointer" onClick={() => setError(null)} />
          <span className="text-sm font-medium">{error}</span>
        </motion.div>
      )}

      {/* Profile Header */}
      <Card className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-surface p-8 relative overflow-hidden border-border-default border-t-[3px] border-t-violet">
        <div className="relative shrink-0 z-10">
          <div className="w-24 h-24 rounded-full bg-surface border border-border-default overflow-hidden shadow-sm">
            <img
              src={profileData?.github?.data?.profile?.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=150&auto=format&fit=crop"}
              alt="Profile"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="absolute -bottom-2 -right-2 bg-saffron text-surface font-mono text-sm font-bold w-10 h-10 rounded-full flex items-center justify-center border-[3px] border-surface shadow-sm z-20">
            {level}
          </div>
        </div>

        <div className="flex-1 flex flex-col items-center md:items-start z-10 w-full pt-1">
          <div className="flex items-center gap-3 mb-2">
            <h1 className="font-display text-[28px] text-text-primary leading-none">
              {profileData?.github?.data?.profile?.name || userData?.name || 'User'}
            </h1>
            <span className="bg-violet/10 text-violet px-2.5 py-1 rounded-md text-[10px] font-bold uppercase tracking-widest border border-violet/20">
              Pro Plan
            </span>
          </div>
          <p className="text-text-secondary font-sans text-sm font-medium mb-6">
            {userData?.college || 'Student'}
          </p>

          <div className="w-full max-w-md bg-primary-bg p-4 rounded-xl border border-border-default shadow-sm group">
            <div className="flex justify-between font-mono text-xs mb-3 font-medium">
              <span className="text-text-primary">
                {xp.toLocaleString()} <span className="text-text-secondary">/ {nextXp.toLocaleString()} XP to Level {level + 1}</span>
              </span>
              <span className="text-saffron font-bold">{Math.round(progress)}%</span>
            </div>
            <div className="h-2 w-full bg-border-default rounded-full overflow-hidden">
              <motion.div
                className="h-full bg-saffron"
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Stats Cards */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-5">
        <Card className="p-5 flex items-center gap-4 group bg-surface border-t-[3px] border-t-emerald hover:bg-elevated transition-colors border-l-border-default border-r-border-default border-b-border-default">
          <div className="w-12 h-12 rounded-xl bg-emerald/10 flex items-center justify-center text-emerald">
            <BookOpen className="w-6 h-6" />
          </div>
          <div>
            <div className="font-display text-2xl text-text-primary">{streakDays}d</div>
            <div className="text-[11px] uppercase tracking-wider text-text-secondary font-bold">Current Streak</div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 group bg-surface border-t-[3px] border-t-violet hover:bg-elevated transition-colors border-l-border-default border-r-border-default border-b-border-default">
          <div className="w-12 h-12 rounded-xl bg-violet/10 flex items-center justify-center text-violet">
            <Video className="w-6 h-6" />
          </div>
          <div>
            <div className="font-display text-2xl text-text-primary">
              {profileData?.leetcode?.data?.profile?.contest_rating || 'N/A'}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-text-secondary font-bold">LeetCode Rating</div>
          </div>
        </Card>
        <Card className="p-5 flex items-center gap-4 group bg-surface border-t-[3px] border-t-saffron hover:bg-elevated transition-colors border-l-border-default border-r-border-default border-b-border-default">
          <div className="w-12 h-12 rounded-xl bg-saffron/10 flex items-center justify-center text-saffron">
            <Trophy className="w-6 h-6" />
          </div>
          <div>
            <div className="font-display text-2xl text-text-primary">
              {profileData?.leetcode?.data?.profile?.total_solved || 0}
            </div>
            <div className="text-[11px] uppercase tracking-wider text-text-secondary font-bold">Problems Solved</div>
          </div>
        </Card>
      </section>

      {/* GitHub & LeetCode Integration Cards */}
      <section className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* GitHub Card */}
        <Card className="p-6 bg-surface border border-border-default">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-gray-900 flex items-center justify-center text-white">
                <Github className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-[16px] text-text-primary">GitHub</h3>
                {profileData?.github?.username && (
                  <p className="text-xs text-text-secondary">@{profileData.github.username}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {profileData?.github?.username ? (
                <>
                  <button
                    onClick={handleRefreshGitHub}
                    disabled={refreshing === 'github'}
                    className="p-2 rounded-lg hover:bg-elevated transition-colors text-text-secondary hover:text-text-primary disabled:opacity-50"
                    title="Refresh data"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing === 'github' ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={handleRemoveGitHub}
                    className="p-2 rounded-lg hover:bg-rose/10 text-text-secondary hover:text-rose transition-colors"
                    title="Disconnect"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowGitHubModal(true)}
                  className="px-3 py-1.5 bg-violet text-surface rounded-lg text-sm font-semibold hover:bg-violet/90 transition-colors"
                >
                  Connect
                </button>
              )}
            </div>
          </div>

          {profileData?.github?.data ? (
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <img
                  src={profileData.github.data.profile.avatar_url}
                  alt={profileData.github.data.profile.name}
                  className="w-12 h-12 rounded-full"
                />
                <div>
                  <p className="font-semibold text-text-primary">{profileData.github.data.profile.name}</p>
                  <p className="text-sm text-text-secondary">{profileData.github.data.profile.bio || 'No bio'}</p>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-primary-bg rounded-lg">
                  <div className="font-display text-lg text-text-primary">{profileData.github.data.profile.public_repos}</div>
                  <div className="text-xs text-text-secondary">Repos</div>
                </div>
                <div className="text-center p-3 bg-primary-bg rounded-lg">
                  <div className="font-display text-lg text-text-primary">{profileData.github.data.profile.followers}</div>
                  <div className="text-xs text-text-secondary">Followers</div>
                </div>
                <div className="text-center p-3 bg-primary-bg rounded-lg">
                  <div className="font-display text-lg text-text-primary">{profileData.github.data.profile.following}</div>
                  <div className="text-xs text-text-secondary">Following</div>
                </div>
              </div>

              {profileData.github.data.repos.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-3">Top Repositories</h4>
                  <div className="space-y-2">
                    {profileData.github.data.repos.slice(0, 3).map((repo) => (
                      <a
                        key={repo.name}
                        href={repo.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center justify-between p-3 bg-primary-bg rounded-lg hover:bg-elevated transition-colors group"
                      >
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-text-primary truncate">{repo.name}</p>
                          <p className="text-xs text-text-secondary truncate">{repo.description || 'No description'}</p>
                        </div>
                        <div className="flex items-center gap-3 text-text-secondary">
                          {repo.language && (
                            <span className="text-xs flex items-center gap-1">
                              <span className="w-2 h-2 rounded-full bg-emerald"></span>
                              {repo.language}
                            </span>
                          )}
                          <span className="text-xs flex items-center gap-1">
                            <Star className="w-3 h-3" />
                            {repo.stars}
                          </span>
                          <ExternalLink className="w-4 h-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                      </a>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Github className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
              <p className="text-sm text-text-secondary mb-4">Connect your GitHub account to display your repositories and activity</p>
            </div>
          )}
        </Card>

        {/* LeetCode Card */}
        <Card className="p-6 bg-surface border border-border-default">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-orange-500 flex items-center justify-center text-white">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="font-heading font-semibold text-[16px] text-text-primary">LeetCode</h3>
                {profileData?.leetcode?.username && (
                  <p className="text-xs text-text-secondary">@{profileData.leetcode.username}</p>
                )}
              </div>
            </div>
            <div className="flex gap-2">
              {profileData?.leetcode?.username ? (
                <>
                  <button
                    onClick={handleRefreshLeetCode}
                    disabled={refreshing === 'leetcode'}
                    className="p-2 rounded-lg hover:bg-elevated transition-colors text-text-secondary hover:text-text-primary disabled:opacity-50"
                    title="Refresh data"
                  >
                    <RefreshCw className={`w-4 h-4 ${refreshing === 'leetcode' ? 'animate-spin' : ''}`} />
                  </button>
                  <button
                    onClick={handleRemoveLeetCode}
                    className="p-2 rounded-lg hover:bg-rose/10 text-text-secondary hover:text-rose transition-colors"
                    title="Disconnect"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => setShowLeetCodeModal(true)}
                  className="px-3 py-1.5 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors"
                >
                  Connect
                </button>
              )}
            </div>
          </div>

          {profileData?.leetcode?.data ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold text-text-primary">{profileData.leetcode.data.profile.real_name || profileData.leetcode.data.profile.username}</p>
                  <p className="text-sm text-text-secondary">
                    {profileData.leetcode.data.profile.skill_level || 'Beginner'}
                  </p>
                </div>
                {profileData.leetcode.data.profile.contest_rating && (
                  <div className="text-right">
                    <div className="font-display text-2xl text-orange-500">{profileData.leetcode.data.profile.contest_rating}</div>
                    <div className="text-xs text-text-secondary">Contest Rating</div>
                  </div>
                )}
              </div>

              <div className="grid grid-cols-3 gap-4">
                <div className="text-center p-3 bg-emerald/10 rounded-lg border border-emerald/20">
                  <div className="font-display text-lg text-emerald">{profileData.leetcode.data.profile.easy_solved}</div>
                  <div className="text-xs text-text-secondary">Easy</div>
                </div>
                <div className="text-center p-3 bg-yellow-500/10 rounded-lg border border-yellow-500/20">
                  <div className="font-display text-lg text-yellow-600">{profileData.leetcode.data.profile.medium_solved}</div>
                  <div className="text-xs text-text-secondary">Medium</div>
                </div>
                <div className="text-center p-3 bg-rose/10 rounded-lg border border-rose/20">
                  <div className="font-display text-lg text-rose">{profileData.leetcode.data.profile.hard_solved}</div>
                  <div className="text-xs text-text-secondary">Hard</div>
                </div>
              </div>

              {profileData.leetcode.data.recent_submissions.length > 0 && (
                <div>
                  <h4 className="text-sm font-semibold text-text-primary mb-3">Recent Submissions</h4>
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {profileData.leetcode.data.recent_submissions.slice(0, 5).map((sub, idx) => (
                      <div key={idx} className="flex items-center justify-between p-2 bg-primary-bg rounded-lg">
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium text-text-primary truncate">{sub.title}</p>
                          <p className="text-xs text-text-secondary">{sub.lang}</p>
                        </div>
                        <span
                          className={`text-xs px-2 py-1 rounded ${
                            sub.statusDisplay === 'Accepted'
                              ? 'bg-emerald/10 text-emerald'
                              : 'bg-rose/10 text-rose'
                          }`}
                        >
                          {sub.statusDisplay}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <Code2 className="w-12 h-12 text-text-tertiary mx-auto mb-3" />
              <p className="text-sm text-text-secondary mb-4">Connect your LeetCode account to display your stats and submissions</p>
            </div>
          )}
        </Card>
      </section>

      {/* Life Score Breakdown */}
      <Card className="p-6 bg-surface border border-border-default flex flex-col md:flex-row items-center gap-8 justify-between">
        <div className="flex-1 w-full space-y-5">
          <h3 className="font-heading font-bold text-lg text-text-primary mb-2">Life Score Breakdown</h3>
          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                <span className="text-emerald">Academic</span>
                <span className="font-mono text-text-primary">{Math.round(trimindScore * 0.4)}</span>
              </div>
              <div className="h-2 bg-primary-bg rounded-full border border-border-default overflow-hidden">
                <div className="h-full bg-emerald w-[74%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                <span className="text-saffron">Financial</span>
                <span className="font-mono text-text-primary">{Math.round(trimindScore * 0.3)}</span>
              </div>
              <div className="h-2 bg-primary-bg rounded-full border border-border-default overflow-hidden">
                <div className="h-full bg-saffron w-[61%]"></div>
              </div>
            </div>
            <div>
              <div className="flex justify-between text-xs font-bold uppercase tracking-wider mb-2">
                <span className="text-violet">Interview</span>
                <span className="font-mono text-text-primary">{Math.round(trimindScore * 0.3)}</span>
              </div>
              <div className="h-2 bg-primary-bg rounded-full border border-border-default overflow-hidden">
                <div className="h-full bg-violet w-[81%]"></div>
              </div>
            </div>
          </div>
        </div>
        <div className="flex flex-col items-center shrink-0 w-48 relative">
          <div className="w-32 h-32 rounded-full border-[8px] border-primary-bg flex items-center justify-center relative shadow-sm">
            <svg className="absolute inset-[-8px] w-[calc(100%+16px)] h-[calc(100%+16px)] -rotate-90" viewBox="0 0 100 100">
              <circle cx="50" cy="50" r="46" fill="none" stroke="#E8E6DF" strokeWidth="8" />
              <circle cx="50" cy="50" r="46" fill="none" stroke="#5B47E0" strokeWidth="8" strokeDasharray="289" strokeDashoffset={289 - (289 * trimindScore / 1000)} strokeLinecap="round" />
            </svg>
            <div className="font-display text-4xl text-text-primary">{trimindScore}</div>
          </div>
          <span className="text-xs font-mono font-bold text-text-secondary mt-3">/ 1000</span>
          <span className="mt-2 bg-emerald/10 text-emerald text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-md">
            Top {Math.max(1, 100 - Math.floor(trimindScore / 10))}%
          </span>
        </div>
      </Card>

      {/* Activity Log */}
      <section>
        <Card className="p-6 border-border-default bg-surface">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-heading font-bold text-text-primary text-lg">Activity Log</h3>
            <div className="flex gap-2 items-center text-text-secondary text-sm font-medium">
              <Calendar className="w-4 h-4" />
              <span>364 days of activity</span>
            </div>
          </div>
          <div className="text-xs font-medium text-text-tertiary mb-2 flex justify-between px-2">
            <span>Jan</span><span>Feb</span><span>Mar</span><span>Apr</span><span>May</span><span>Jun</span><span>Jul</span><span>Aug</span><span>Sep</span><span>Oct</span><span>Nov</span><span>Dec</span>
          </div>
          <div className="grid grid-rows-7 grid-flow-col gap-1.5 overflow-x-auto pb-2 hide-scrollbar">
            {heatmap.map((val, i) => (
              <div
                key={i}
                className={`w-3 h-3 rounded-sm transition-colors cursor-pointer ${
                  val === 0 ? 'bg-primary-bg border border-border-default' :
                  val === 1 ? 'bg-[#D1FAE5] border border-[#A7F3D0]' :
                  val === 2 ? 'bg-[#34D399] border border-[#10B981]' :
                  val === 3 ? 'bg-[#059669] border border-[#047857]' :
                  'bg-[#0EA882] shadow-sm'
                }`}
                title={`${val} activities on this day`}
              />
            ))}
          </div>
          <div className="flex items-center justify-end mt-4 gap-2 text-xs text-text-tertiary uppercase tracking-wider font-semibold">
            <span>Less</span>
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-[2px] bg-primary-bg border border-border-default" />
              <div className="w-3 h-3 rounded-[2px] bg-[#D1FAE5]" />
              <div className="w-3 h-3 rounded-[2px] bg-[#34D399]" />
              <div className="w-3 h-3 rounded-[2px] bg-[#0EA882]" />
            </div>
            <span>More</span>
          </div>
        </Card>
      </section>

      {/* Achievement Shelf */}
      <section>
        <Card className="p-6 bg-surface border border-border-default">
          <h3 className="font-heading font-bold text-text-primary text-lg mb-6">Achievement Shelf</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {[
              { name: "7-Day Streak", icon: Trophy, earned: streakDays >= 7, color: "text-saffron", bg: "bg-saffron/10", border: "border-saffron/20" },
              { name: "30-Day Streak", icon: Flame, earned: streakDays >= 30, color: "text-orange-500", bg: "bg-orange-500/10", border: "border-orange-500/20" },
              { name: "Code Master", icon: Code2, earned: (profileData?.leetcode?.data?.profile?.total_solved || 0) >= 100, color: "text-emerald", bg: "bg-emerald/10", border: "border-emerald/20" },
              { name: "Interview Ace", icon: Video, earned: true, color: "text-violet", bg: "bg-violet/10", border: "border-violet/20" },
              { name: "GitHub Star", icon: Github, earned: (profileData?.github?.data?.profile?.followers || 0) >= 10, color: "text-gray-700", bg: "bg-gray-700/10", border: "border-gray-700/20" },
              { name: "Problem Solver", icon: Zap, earned: (profileData?.leetcode?.data?.profile?.hard_solved || 0) >= 10, color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20" },
              { name: "Contest Warrior", icon: Award, earned: (profileData?.leetcode?.data?.contest_history?.attended_contests || 0) >= 5, color: "text-purple-500", bg: "bg-purple-500/10", border: "border-purple-500/20" },
              { name: "Top Coder", icon: TrendingUp, earned: (profileData?.leetcode?.data?.profile?.contest_rating || 0) >= 1500, color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20" },
            ].map((badge, i) => (
              <div key={i} className={`p-4 rounded-xl flex flex-col items-center justify-center gap-3 text-center transition-colors border ${badge.earned ? `${badge.bg} ${badge.border} hover:bg-elevated shadow-sm` : 'bg-primary-bg border-border-default grayscale opacity-60'}`}>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${badge.earned ? 'bg-surface shadow-sm' : 'bg-border-default'} ${badge.color || 'text-text-tertiary'}`}>
                  {badge.earned ? <badge.icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
                </div>
                <div className={`font-semibold text-sm ${badge.earned ? 'text-text-primary' : 'text-text-tertiary'}`}>{badge.earned ? badge.name : 'Locked'}</div>
              </div>
            ))}
          </div>
        </Card>
      </section>

      {/* Goals and Other Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <Card className="p-6 bg-surface border border-border-default flex flex-col">
          <div className="flex items-center justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-lg bg-emerald/10 flex items-center justify-center text-emerald">
                <Trophy className="w-5 h-5" />
              </div>
              <h3 className="font-heading font-semibold text-[16px] text-text-primary">My Savings Goals</h3>
            </div>
            <button
              onClick={() => setShowAddGoal(s => !s)}
              className="p-2 rounded-lg bg-emerald/10 text-emerald hover:bg-emerald/20 transition-colors"
              title="Add goal"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>

          {/* Add Goal inline form */}
          <AnimatePresence>
            {showAddGoal && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="overflow-hidden"
              >
                <div className="bg-primary-bg border border-border-default rounded-xl p-4 mb-4 space-y-3">
                  <input
                    type="text"
                    value={newGoalTitle}
                    onChange={e => setNewGoalTitle(e.target.value)}
                    placeholder="Goal title (e.g. New Laptop)"
                    className="w-full bg-surface border border-border-default rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald transition-colors"
                  />
                  <input
                    type="number"
                    value={newGoalAmount}
                    onChange={e => setNewGoalAmount(e.target.value)}
                    placeholder="Target amount (₹)"
                    className="w-full bg-surface border border-border-default rounded-lg px-3 py-2 text-sm outline-none focus:border-emerald transition-colors"
                  />
                  <div className="flex gap-2">
                    <button onClick={() => setShowAddGoal(false)} className="flex-1 py-2 text-xs font-bold bg-surface border border-border-default rounded-lg text-text-secondary hover:bg-elevated transition-colors">Cancel</button>
                    <button
                      onClick={handleAddGoal}
                      disabled={addingGoal || !newGoalTitle.trim() || !newGoalAmount}
                      className="flex-1 py-2 text-xs font-bold bg-emerald text-white rounded-lg hover:bg-emerald/90 transition-colors disabled:opacity-50"
                    >
                      {addingGoal ? 'Saving...' : 'Add Goal'}
                    </button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="space-y-3 mb-6 flex-1">
            {goalsLoading ? (
              <div className="text-center text-text-tertiary py-6 text-sm">Loading goals...</div>
            ) : goals.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-10 h-10 text-text-tertiary mx-auto mb-3 opacity-50" />
                <p className="text-sm text-text-secondary">No savings goals yet.</p>
                <p className="text-xs text-text-tertiary mt-1">Click + to add your first goal!</p>
              </div>
            ) : (
              goals.map((goal) => {
                const pct = goal.target_amount_paise > 0
                  ? Math.min(100, Math.round((goal.saved_amount_paise / goal.target_amount_paise) * 100))
                  : 0;
                return (
                  <div key={goal.id} className="border border-border-default rounded-xl p-3">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium text-sm text-text-primary truncate max-w-[160px]" title={goal.title}>{goal.title}</span>
                      <span className="font-mono text-xs font-bold text-emerald">{pct}%</span>
                    </div>
                    <div className="h-1.5 bg-primary-bg rounded-full overflow-hidden">
                      <div className="h-full bg-emerald rounded-full transition-all" style={{ width: `${pct}%` }} />
                    </div>
                    <div className="flex justify-between text-[11px] text-text-tertiary mt-1.5">
                      <span>₹{Math.round(goal.saved_amount_paise / 100).toLocaleString()} saved</span>
                      <span>₹{Math.round(goal.target_amount_paise / 100).toLocaleString()} target</span>
                    </div>
                  </div>
                );
              })
            )}
          </div>
          <Link
            to="/app/finance"
            className="w-full py-2.5 rounded-lg border border-border-default text-sm font-semibold text-text-secondary hover:text-text-primary hover:bg-primary-bg transition-colors mt-auto flex items-center justify-center gap-2"
          >
            <IndianRupee className="w-4 h-4" /> Manage in Finance
          </Link>
        </Card>

        <Card className="p-6 bg-surface border border-border-default flex flex-col hover:bg-elevated transition-colors">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-violet/10 flex items-center justify-center text-violet">
              <Star className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-semibold text-[16px] text-text-primary">Download Profile Card</h3>
          </div>
          <div ref={profileCardRef} className="bg-gradient-to-br from-[#1A0B2E] to-[#1A1D2E] border border-violet/30 p-5 rounded-xl mb-4 min-h-[120px] relative overflow-hidden">
            <div className="flex items-center gap-3 mb-4">
              <img
                src={profileData?.github?.data?.profile?.avatar_url || "https://images.unsplash.com/photo-1599566150163-29194dcaad36?q=80&w=80&auto=format&fit=crop"}
                alt="Avatar"
                crossOrigin="anonymous"
                className="w-12 h-12 rounded-full border-2 border-violet/50"
              />
              <div>
                <div className="font-bold text-white text-sm">{userData?.name || 'Student'}</div>
                <div className="text-violet font-mono text-[10px] uppercase tracking-widest">{userData?.college || 'TriMind Student'}</div>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-2">
              <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <div className="font-bold text-white text-sm">{userData?.trimind_score || 0}</div>
                <div className="text-[9px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>Score</div>
              </div>
              <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <div className="font-bold text-white text-sm">{userData?.streak_days || 0}d</div>
                <div className="text-[9px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>Streak</div>
              </div>
              <div className="text-center p-2 rounded-lg" style={{ backgroundColor: 'rgba(255,255,255,0.08)' }}>
                <div className="font-bold text-white text-sm">{profileData?.leetcode?.data?.profile?.total_solved || 0}</div>
                <div className="text-[9px] uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.5)' }}>Solved</div>
              </div>
            </div>
            <div className="mt-3 text-center text-[9px] font-mono uppercase tracking-widest" style={{ color: 'rgba(255,255,255,0.3)' }}>@TriMind_AI</div>
          </div>
          <button
            onClick={handleDownloadProfile}
            disabled={downloading}
            className="w-full py-2.5 bg-violet text-surface rounded-lg text-sm font-bold shadow-sm hover:bg-violet/90 transition-colors flex items-center justify-center gap-2 mt-auto disabled:opacity-60"
          >
            <Download className="w-4 h-4" /> {downloading ? 'Generating...' : 'Download Profile Card'}
          </button>
        </Card>

        <Card className="p-6 bg-surface border border-border-default flex flex-col">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-saffron/10 flex items-center justify-center text-saffron">
              <Briefcase className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-heading font-semibold text-[16px] text-text-primary">Resume Gap Detector</h3>
              <p className="text-xs text-text-secondary">AI-powered career gap analysis</p>
            </div>
          </div>

          <div className="flex-1 space-y-3 mb-4">
            <div className="bg-saffron/5 border border-saffron/20 rounded-xl p-4">
              <p className="text-xs font-bold text-saffron uppercase tracking-widest mb-2">What it does</p>
              <ul className="text-sm text-text-secondary space-y-1.5">
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald shrink-0 mt-0.5" /> Compares your resume to any company's requirements</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald shrink-0 mt-0.5" /> Identifies critical skill gaps by priority</li>
                <li className="flex items-start gap-2"><CheckCircle2 className="w-4 h-4 text-emerald shrink-0 mt-0.5" /> Generates a personalized 30-day action plan</li>
              </ul>
            </div>
            <div className="grid grid-cols-3 gap-2 text-center">
              <div className="bg-primary-bg rounded-lg p-2">
                <div className="font-bold text-text-primary text-sm">Google</div>
                <div className="text-[10px] text-text-tertiary">SWE</div>
              </div>
              <div className="bg-primary-bg rounded-lg p-2">
                <div className="font-bold text-text-primary text-sm">Meta</div>
                <div className="text-[10px] text-text-tertiary">Frontend</div>
              </div>
              <div className="bg-primary-bg rounded-lg p-2">
                <div className="font-bold text-text-primary text-sm">Stripe</div>
                <div className="text-[10px] text-text-tertiary">Backend</div>
              </div>
            </div>
          </div>

          <Link
            to="/app/tools/resume-gap"
            className="w-full py-2.5 bg-saffron text-surface rounded-lg text-sm font-bold shadow-sm hover:bg-saffron/90 transition-colors flex items-center justify-center gap-2 mt-auto"
          >
            <Briefcase className="w-4 h-4" /> Detect My Gaps
          </Link>
        </Card>

        <Card className="p-6 bg-emerald/10 border border-emerald/20 flex flex-col hover:bg-emerald/20 transition-colors shadow-sm">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 rounded-lg bg-surface flex items-center justify-center text-emerald shadow-sm">
              <Share2 className="w-5 h-5" />
            </div>
            <h3 className="font-heading font-bold text-[16px] text-emerald">Parent Dashboard Share</h3>
          </div>
          <div className="bg-white/60 dark:bg-surface border border-emerald/20 rounded-xl p-4 mb-4 space-y-2">
            <p className="text-xs font-bold text-emerald uppercase tracking-widest mb-2">Live Preview</p>
            <p className="text-sm font-medium text-text-primary leading-relaxed">
              📊 <strong>{userData?.name || 'Student'}</strong> — TriMind Score: <strong>{userData?.trimind_score || 0}</strong>
            </p>
            <p className="text-sm text-text-secondary">🔥 Streak: <strong>{userData?.streak_days || 0} days</strong></p>
            <p className="text-sm text-text-secondary">💰 Budget used: <strong>{dashData?.finance?.budget_used_percent || 0}%</strong></p>
            <p className="text-sm text-text-secondary">🎤 Interviews this week: <strong>{dashData?.interview?.sessions_this_week || 0}</strong></p>
          </div>
          <button
            onClick={handleWhatsAppShare}
            className="w-full py-3 bg-[#25D366] text-white rounded-lg text-sm font-bold shadow-md hover:bg-[#1DA851] transition-colors flex items-center justify-center gap-2 mt-auto"
          >
            <Share2 className="w-4 h-4" /> Share to WhatsApp
          </button>
        </Card>
      </div>

      {/* GitHub Modal */}
      <AnimatePresence>
        {showGitHubModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-bold text-lg text-text-primary">Connect GitHub</h3>
                <button onClick={() => setShowGitHubModal(false)} className="p-2 hover:bg-elevated rounded-lg transition-colors">
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">GitHub Username</label>
                  <input
                    type="text"
                    value={githubInput}
                    onChange={(e) => setGithubInput(e.target.value)}
                    placeholder="e.g., octocat"
                    className="w-full bg-primary-bg border border-border-default rounded-lg px-4 py-3 text-sm outline-none focus:border-violet transition-colors"
                  />
                  <p className="text-xs text-text-secondary mt-2">
                    Your GitHub profile must be public to fetch data.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowGitHubModal(false)}
                    className="flex-1 py-2.5 bg-primary-bg border border-border-default text-text-primary rounded-lg text-sm font-semibold hover:bg-border-default transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleGitHubConnect}
                    disabled={!githubInput}
                    className="flex-1 py-2.5 bg-violet text-surface rounded-lg text-sm font-semibold hover:bg-violet/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* LeetCode Modal */}
      <AnimatePresence>
        {showLeetCodeModal && (
          <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="bg-surface rounded-2xl p-6 w-full max-w-md shadow-2xl"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="font-heading font-bold text-lg text-text-primary">Connect LeetCode</h3>
                <button onClick={() => setShowLeetCodeModal(false)} className="p-2 hover:bg-elevated rounded-lg transition-colors">
                  <X className="w-5 h-5 text-text-secondary" />
                </button>
              </div>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-text-primary mb-2">LeetCode Username</label>
                  <input
                    type="text"
                    value={leetcodeInput}
                    onChange={(e) => setLeetCodeInput(e.target.value)}
                    placeholder="e.g., leetcode_user"
                    className="w-full bg-primary-bg border border-border-default rounded-lg px-4 py-3 text-sm outline-none focus:border-orange-500 transition-colors"
                  />
                  <p className="text-xs text-text-secondary mt-2">
                    Your LeetCode profile must be public to fetch data.
                  </p>
                </div>
                <div className="flex gap-3">
                  <button
                    onClick={() => setShowLeetCodeModal(false)}
                    className="flex-1 py-2.5 bg-primary-bg border border-border-default text-text-primary rounded-lg text-sm font-semibold hover:bg-border-default transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleLeetCodeConnect}
                    disabled={!leetcodeInput}
                    className="flex-1 py-2.5 bg-orange-500 text-white rounded-lg text-sm font-semibold hover:bg-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    Connect
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
