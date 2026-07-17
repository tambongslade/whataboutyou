import type { Candidate } from '../../../services/candidateService';

// Sort by votes and recompute rankings so the leaderboard is always consistent
export const rankByVotes = (list: Candidate[]): Candidate[] =>
  [...list]
    .map((candidate) => ({
      ...candidate,
      id: candidate._id || candidate.id,
      votes: candidate.votes ?? candidate.points ?? 0
    }))
    .sort((a, b) => (b.votes || 0) - (a.votes || 0))
    .map((candidate, index) => ({ ...candidate, ranking: index + 1 }));
