import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { AppIcon } from "../assets/icons/AppIcons";
import meetConnectLogo from "../assets/images/MeetConnect.png";
import ActionCard from "../components/dashboard/ActionCard";
import JoinMeetingModal from "../components/dashboard/JoinMeetingModal";
import ProfileMenu from "../components/dashboard/ProfileMenu";
import StatCard from "../components/dashboard/StatCard";
import { useAuth } from "../hooks/useAuth";
import { generateMeetingCode } from "../utils/meetingUtils";

const formatDate = (value) => {
	if (!value) return "No meetings yet";
	const date = new Date(value);
	if (Number.isNaN(date.getTime())) return "No meetings yet";
	return date.toLocaleDateString("en-IN", {
		day: "2-digit",
		month: "short",
		year: "numeric",
	});
};

export default function Dashboard() {
	const navigate = useNavigate();
	const { user, logout, getHistoryOfUser, addMeetingToHistory } = useAuth();

	const [isProfileOpen, setIsProfileOpen] = useState(false);
	const [isJoinModalOpen, setIsJoinModalOpen] = useState(false);
	const [history, setHistory] = useState([]);
	const [loadingHistory, setLoadingHistory] = useState(true);

	useEffect(() => {
		let active = true;

		const loadHistory = async () => {
			setLoadingHistory(true);
			try {
				const payload = await getHistoryOfUser();
				if (!active) return;
				setHistory(Array.isArray(payload) ? payload : []);
			} catch {
				if (!active) return;
				setHistory([]);
			} finally {
				if (active) setLoadingHistory(false);
			}
		};

		loadHistory();
		return () => {
			active = false;
		};
	}, [getHistoryOfUser]);

	const sortedHistory = useMemo(() => {
		return [...history].sort((a, b) => {
			const left = new Date(a?.date || a?.createdAt || 0).getTime();
			const right = new Date(b?.date || b?.createdAt || 0).getTime();
			return right - left;
		});
	}, [history]);

	const stats = useMemo(() => {
		const total = sortedHistory.length;
		const sevenDaysAgo = Date.now() - 7 * 24 * 60 * 60 * 1000;
		const thisWeek = sortedHistory.filter((item) => {
			const time = new Date(item?.date || item?.createdAt || 0).getTime();
			return Number.isFinite(time) && time >= sevenDaysAgo;
		}).length;
		const latestDate = sortedHistory[0]?.date || sortedHistory[0]?.createdAt || null;

		return { total, thisWeek, latestDate };
	}, [sortedHistory]);

	const handleLogout = async () => {
		await logout();
		sessionStorage.setItem("postLogoutToast", "1");
		navigate("/?logout=1", { replace: true });
	};

	const handleCreateMeeting = async () => {
		const code = generateMeetingCode();
		try {
			await addMeetingToHistory(code);
		} catch {
		}
		navigate(`/videomeet?code=${code}`);
	};

	const handleJoinMeeting = async (code) => {
		try {
			await addMeetingToHistory(code);
		} catch {
		}
		setIsJoinModalOpen(false);
		navigate(`/videomeet?code=${code}`);
	};

	return (
		<div className="min-h-screen bg-zinc-950 text-white">
			<header className="sticky top-0 z-40 border-b border-white/10 bg-zinc-950/90 backdrop-blur-xl">
				<div className="mx-auto flex h-14 w-full max-w-6xl items-center justify-between px-6">
					<div className="flex items-center gap-2.5">
						<div className="flex h-8 w-8 items-center justify-center overflow-hidden rounded-lg">
							<img src={meetConnectLogo} alt="MeetConnect logo" className="h-full w-full scale-225 object-contain" />
						</div>
						<span className="text-sm font-semibold tracking-tight">MeetConnect</span>
					</div>

					<div className="flex items-center gap-2">
						<button
							className="inline-flex items-center gap-1.5 rounded-lg border border-white/15 px-3 py-1.5 text-xs font-semibold text-white/80 hover:bg-white/10"
							onClick={() => navigate("/history")}
							type="button"
						>
							<AppIcon name="clock" size={13} />
							History
						</button>

						<button
							className="inline-flex items-center gap-1.5 rounded-lg bg-blue-600 px-3 py-1.5 text-xs font-semibold text-white hover:bg-blue-500"
							onClick={handleCreateMeeting}
							type="button"
						>
							<AppIcon name="plus" size={13} />
							New meeting
						</button>

						<div className="relative ml-1">
							<button
								className="inline-flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white/90 ring-1 ring-white/15 hover:bg-white/20"
								onClick={() => setIsProfileOpen((current) => !current)}
								type="button"
							>
								{(user?.username || user?.email || "U").charAt(0).toUpperCase()}
							</button>

							{isProfileOpen ? (
								<ProfileMenu
									user={user}
									onClose={() => setIsProfileOpen(false)}
									onLogout={handleLogout}
									onOpenSettings={() => {
										setIsProfileOpen(false);
										navigate("/account-settings");
									}}
								/>
							) : null}
						</div>
					</div>
				</div>
			</header>

			<main className="mx-auto w-full max-w-6xl px-6 pb-12 pt-10">
				<section className="mb-8">
					<p className="mb-2 text-xs font-semibold uppercase tracking-[0.15em] text-white/35">Dashboard</p>
					<h1 className="text-4xl font-bold tracking-tight">
						Welcome back, {" "}
						<span className="bg-linear-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">
							{user?.username || "there"}
						</span>
					</h1>
					<p className="mt-1 text-sm text-white/45">Start, join, and manage your meetings from one place.</p>
				</section>

				<section className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
					<StatCard
						value={stats.total}
						label="Total meetings"
						icon={<img src={meetConnectLogo} alt="MeetConnect logo" className="h-4 w-4 scale-225 object-contain" />}
					/>
					<StatCard
						value={stats.thisWeek}
						label="This week"
						icon={<AppIcon name="calendar" size={16} />}
					/>
					<StatCard
						value={formatDate(stats.latestDate)}
						label="Last meeting"
						icon={<AppIcon name="clock" size={16} />}
					/>
				</section>

				<section className="mb-8 grid grid-cols-1 gap-4 md:grid-cols-3">
					<ActionCard
						icon={<img src={meetConnectLogo} alt="MeetConnect logo" className="h-5 w-5 scale-225 object-contain" />}
						title="Start instant meeting"
						description="Create a room and join immediately with your own secure meeting code."
						cta="Start now"
						onClick={handleCreateMeeting}
						accentClass="bg-blue-500/15"
					/>

					<ActionCard
						icon={<AppIcon name="link" size={20} className="text-emerald-300" />}
						title="Join with code"
						description="Enter a 6-character code and jump directly into an existing meeting."
						cta="Join meeting"
						onClick={() => setIsJoinModalOpen(true)}
						accentClass="bg-emerald-500/15"
					/>

					<ActionCard
						icon={<AppIcon name="user" size={20} className="text-amber-300" />}
						title="Account settings"
						description="Update your profile details, password, and account security options."
						cta="Open settings"
						onClick={() => navigate("/account-settings")}
						accentClass="bg-amber-500/15"
					/>
				</section>

				<section className="rounded-2xl border border-white/10 bg-zinc-900 p-6">
					<div className="mb-4 flex items-center justify-between">
						<h2 className="text-lg font-semibold">Recent meetings</h2>
						<button
							className="text-xs font-semibold text-blue-400 hover:text-blue-300"
							onClick={() => navigate("/history")}
							type="button"
						>
							View all
						</button>
					</div>

					{loadingHistory ? (
						<div className="space-y-3">
							<div className="h-12 animate-pulse rounded-xl bg-white/5" />
							<div className="h-12 animate-pulse rounded-xl bg-white/5" />
							<div className="h-12 animate-pulse rounded-xl bg-white/5" />
						</div>
					) : sortedHistory.length === 0 ? (
						<div className="rounded-xl border border-white/10 bg-white/5 px-4 py-10 text-center">
							<p className="text-sm font-semibold text-white/60">No meetings yet</p>
							<p className="mt-1 text-xs text-white/40">Create your first meeting to see activity here.</p>
						</div>
					) : (
						<div className="space-y-2">
							{sortedHistory.slice(0, 5).map((meeting, index) => {
								const code = meeting?.meetingCode || meeting?.code || "-";
								const date = meeting?.date || meeting?.createdAt;
								return (
									<div
										key={`${code}-${index}`}
										className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-white/10 bg-zinc-950 px-4 py-3"
									>
										<div className="min-w-[120px]">
											<p className="text-[11px] uppercase tracking-[0.12em] text-white/35">Code</p>
											<p className="font-mono text-sm font-semibold tracking-[0.16em]">{code}</p>
										</div>
										<div className="min-w-[160px] text-sm text-white/60">{formatDate(date)}</div>
										<button
											className="rounded-lg bg-blue-600/20 px-3 py-1.5 text-xs font-semibold text-blue-300 hover:bg-blue-600 hover:text-white"
											onClick={() => navigate(`/videomeet?code=${code}`)}
											type="button"
										>
											Rejoin
										</button>
									</div>
								);
							})}
						</div>
					)}
				</section>
			</main>

			<JoinMeetingModal
				open={isJoinModalOpen}
				onClose={() => setIsJoinModalOpen(false)}
				onJoin={handleJoinMeeting}
			/>
		</div>
	);
}
