import React, { memo } from "react";
import { Skeleton as BoneSkeleton } from "boneyard-js/react";



// bone shimmer
const Bone = ({ className }) => (
  <div className={`animate-[shimmer_2s_ease-in-out_infinite] rounded bg-white/[0.07] ${className}`} />
);

// full page skeleton
function PageSkeleton({ label }) {
  return (
    <div className="min-h-screen bg-zinc-950">

      <div className="sticky top-0 z-40 flex h-14 items-center justify-between border-b border-white/[0.06] bg-zinc-950/90 px-4 sm:px-6">
        <div className="flex items-center gap-2">
          <Bone className="h-8 w-8 !rounded-lg" />
          <Bone className="hidden h-4 w-24 sm:block" />
        </div>
        <div className="flex items-center gap-2">
          <Bone className="h-8 w-16 !rounded-lg" />
          <Bone className="h-8 w-8 !rounded-full" />
        </div>
      </div>


      <main className="mx-auto w-full max-w-6xl px-4 pt-6 pb-10 sm:px-6 sm:pt-10 sm:pb-12">

        <div className="mb-6 sm:mb-8">
          <Bone className="mb-2 h-3 w-20" />
          <Bone className="mb-2 h-8 w-64 sm:h-10 sm:w-80" />
          <Bone className="h-3 w-48" />
        </div>


        <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 sm:grid-cols-3 sm:gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="flex items-center gap-3 rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-4 sm:gap-4 sm:p-5">
              <Bone className="h-10 w-10 !rounded-xl" />
              <div className="space-y-2 flex-1">
                <Bone className="h-6 w-14" />
                <Bone className="h-3 w-24" />
              </div>
            </div>
          ))}
        </div>


        <div className="mb-6 grid grid-cols-1 gap-3 sm:mb-8 md:grid-cols-3 md:gap-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-5 sm:p-7">
              <Bone className="mb-4 h-10 w-10 !rounded-xl sm:mb-5 sm:h-12 sm:w-12" />
              <Bone className="mb-2 h-5 w-40" />
              <Bone className="mb-2 h-3 w-full" />
              <Bone className="mb-4 h-3 w-11/12 sm:mb-5" />
              <Bone className="h-4 w-24" />
            </div>
          ))}
        </div>


        <div className="rounded-2xl border border-white/[0.06] bg-zinc-900/50 p-4 sm:p-6">
          <Bone className="mb-4 h-5 w-36 sm:mb-5" />
          <div className="space-y-2 sm:space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex flex-col gap-1.5 rounded-xl border border-white/[0.06] bg-white/[0.02] px-3 py-3 sm:flex-row sm:items-center sm:gap-4 sm:px-5 sm:py-4">
                <Bone className="h-3 w-24" />
                <Bone className="h-3 w-40 sm:flex-1" />
                <Bone className="hidden h-3 w-20 sm:block" />
              </div>
            ))}
          </div>
        </div>
        <span className="sr-only">{label}</span>
      </main>
    </div>
  );
}

// stat card
function StatSkeleton({ label }) {
  return (
    <BoneSkeleton name="stat-card" loading animate="shimmer" transition={200} className="w-full"
      fallback={
        <div className="flex items-center gap-4 rounded-2xl border border-white/[0.06] bg-zinc-900 p-5">
          <Bone className="h-10 w-10 !rounded-xl" />
          <div className="space-y-2">
            <Bone className="h-7 w-14" />
            <Bone className="h-3 w-24" />
          </div>
          <span className="sr-only">{label}</span>
        </div>
      }
    >
      <div />
    </BoneSkeleton>
  );
}

// action card
function ActionSkeleton({ label }) {
  return (
    <BoneSkeleton name="action-card" loading animate="shimmer" transition={200} className="w-full"
      fallback={
        <div className="w-full rounded-2xl border border-white/[0.06] bg-zinc-900 p-7">
          <Bone className="mb-5 h-12 w-12 !rounded-xl" />
          <Bone className="mb-2 h-5 w-44" />
          <Bone className="mb-2 h-3 w-full" />
          <Bone className="mb-5 h-3 w-11/12" />
          <Bone className="h-4 w-24" />
          <span className="sr-only">{label}</span>
        </div>
      }
    >
      <div />
    </BoneSkeleton>
  );
}

// avatar skeleton
function AvatarSkeleton({ label }) {
  return (
    <BoneSkeleton name="avatar-card" loading animate="shimmer" transition={200} className="w-full"
      fallback={
        <div className="w-full rounded-2xl border border-white/[0.06] bg-zinc-900 p-4">
          <div className="flex items-center gap-4">
            <Bone className="h-14 w-14 !rounded-full" />
            <div className="min-w-0 flex-1 space-y-2">
              <Bone className="h-4 w-40" />
              <Bone className="h-3 w-24" />
              <Bone className="h-3 w-56" />
            </div>
          </div>
          <span className="sr-only">{label}</span>
        </div>
      }
    >
      <div />
    </BoneSkeleton>
  );
}

// inline button
function ButtonSkeleton() {
  return (
    <span className="flex w-full items-center justify-center gap-2" aria-hidden="true">
      <span className="h-4 w-4 animate-[shimmer_2s_ease-in-out_infinite] rounded-full bg-white/30" />
      <span className="h-3 w-28 animate-[shimmer_2s_ease-in-out_infinite] rounded bg-white/30" />
    </span>
  );
}

// table row
function RowSkeleton({ count = 1, label }) {
  return (
    <BoneSkeleton name="table-rows" loading animate="shimmer" transition={200} className="w-full"
      fallback={
        <div className="space-y-3">
          {Array.from({ length: count }, (_, i) => (
            <div key={i} className="flex items-center justify-between gap-4 rounded-2xl border border-white/[0.06] bg-zinc-900 px-6 py-5">
              <Bone className="h-3 w-24" />
              <Bone className="h-3 w-40" />
              <Bone className="h-3 w-20" />
            </div>
          ))}
          <span className="sr-only">{label}</span>
        </div>
      }
    >
      <div />
    </BoneSkeleton>
  );
}

// text block
function TextSkeleton({ lines = 3, label }) {
  return (
    <div className="space-y-2">
      {Array.from({ length: lines }, (_, i) => (
        <Bone
          key={i}
          className={`h-3 ${i === 0 ? "w-3/4" : i === lines - 1 ? "w-1/2" : "w-full"}`}
        />
      ))}
      <span className="sr-only">{label}</span>
    </div>
  );
}

// generic card
function CardSkeleton({ count = 1, label }) {
  return (
    <BoneSkeleton name="generic-card" loading animate="shimmer" transition={200} className="w-full"
      fallback={
        <div className="space-y-3">
          {Array.from({ length: count }, (_, i) => (
            <Bone key={i} className="h-28 !rounded-2xl" />
          ))}
          <span className="sr-only">{label}</span>
        </div>
      }
    >
      <div />
    </BoneSkeleton>
  );
}

// router
function SkeletonRouter({ type = "card", count = 1, lines = 3, srLabel }) {
  const label = srLabel || "Loading…";

  switch (type) {
    case "page":
      return <PageSkeleton label={label} />;
    case "stat":
      return <StatSkeleton label={label} />;
    case "action":
      return <ActionSkeleton label={label} />;
    case "avatar":
      return <AvatarSkeleton label={label} />;
    case "button":
      return <ButtonSkeleton />;
    case "row":
      return <RowSkeleton count={count} label={label} />;
    case "text":
      return <TextSkeleton lines={lines} label={label} />;
    case "card":
    default:
      return <CardSkeleton count={count} label={label} />;
  }
}

export const Skeleton = memo(SkeletonRouter);
export default Skeleton;
