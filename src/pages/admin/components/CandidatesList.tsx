import { useState } from 'react';
import { type Candidate } from '../../../services/candidateService';

interface CandidatesListProps {
    candidates: Candidate[];
    isPreview?: boolean;
}

const CandidatesList = ({ candidates, isPreview = false }: CandidatesListProps) => {
    const [selectedCategory, setSelectedCategory] = useState<'all' | 'miss' | 'master'>('all');
    const [sortBy, setSortBy] = useState<'points' | 'votes' | 'name'>('points');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');

    // Filter and sort candidates
    const filteredCandidates = candidates
        .filter(candidate => {
            if (selectedCategory === 'all') return true;
            return candidate.category === selectedCategory;
        })
        .sort((a, b) => {
            let comparison = 0;

            switch (sortBy) {
                case 'points':
                    comparison = (a.points || 0) - (b.points || 0);
                    break;
                case 'votes':
                    comparison = a.votes - b.votes;
                    break;
                case 'name':
                    comparison = a.name.localeCompare(b.name);
                    break;
            }

            return sortOrder === 'desc' ? -comparison : comparison;
        });

    // Limit results for preview
    const displayCandidates = isPreview ? filteredCandidates.slice(0, 5) : filteredCandidates;

    const CandidateCard = ({ candidate, rank }: { candidate: Candidate; rank: number }) => {
        const getRankIcon = (rank: number) => {
            switch (rank) {
                case 1: return '🥇';
                case 2: return '🥈';
                case 3: return '🥉';
                default: return `#${rank}`;
            }
        };

        const getCategoryIcon = (category: string) => {
            return category === 'miss' ? '👸' : '🤴';
        };

        const getCategoryColor = (category: string) => {
            return category === 'miss' ? 'pink' : 'blue';
        };

        return (
            <div className="bg-white rounded-lg shadow-md p-4 border hover:shadow-lg transition-shadow">
                <div className="flex items-center space-x-4">
                    {/* Rank */}
                    <div className="flex-shrink-0 text-2xl font-bold text-gray-600 w-12 text-center">
                        {getRankIcon(rank)}
                    </div>

                    {/* Candidate Image */}
                    <div className="relative flex-shrink-0">
                        <img
                            src={candidate.image}
                            alt={candidate.name}
                            className="w-16 h-16 rounded-full object-cover border-2 border-gray-200"
                        />
                        <div className="absolute -bottom-1 -right-1 text-lg">
                            {getCategoryIcon(candidate.category)}
                        </div>
                    </div>

                    {/* Candidate Info */}
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2">
                            <h3 className="text-lg font-semibold text-gray-800 truncate">
                                {candidate.name}
                            </h3>
                            <span className={`px-2 py-1 rounded-full text-xs font-medium ${getCategoryColor(candidate.category) === 'pink'
                                ? 'bg-pink-100 text-pink-800'
                                : 'bg-blue-100 text-blue-800'
                                }`}>
                                {candidate.category.toUpperCase()}
                            </span>
                            {!candidate.isActive && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-600">
                                    INACTIF
                                </span>
                            )}
                        </div>

                        {candidate.city && (
                            <p className="text-sm text-gray-600 mt-1">📍 {candidate.city}</p>
                        )}

                        {candidate.age && (
                            <p className="text-sm text-gray-600">🎂 {candidate.age} ans</p>
                        )}
                    </div>

                    {/* Stats */}
                    <div className="flex-shrink-0 text-right">
                        <div className="flex flex-col space-y-1">
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Points:</span>
                                <span className="bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-sm font-bold">
                                    {(candidate.points || 0).toLocaleString()}
                                </span>
                            </div>
                            <div className="flex items-center space-x-2">
                                <span className="text-sm text-gray-600">Votes:</span>
                                <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm font-bold">
                                    {(candidate.votes || 0).toLocaleString()}
                                </span>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Additional Info (only in full view) */}
                {!isPreview && candidate.description && (
                    <div className="mt-4 pt-4 border-t border-gray-100">
                        <p className="text-sm text-gray-600 line-clamp-2">
                            {candidate.description}
                        </p>
                    </div>
                )}
            </div>
        );
    };

    return (
        <div className="space-y-6">
            {/* Controls (only in full view) */}
            {!isPreview && (
                <div className="bg-white rounded-lg shadow-md p-4">
                    <div className="flex flex-wrap items-center justify-between gap-4">
                        {/* Category Filter */}
                        <div className="flex items-center space-x-2">
                            <label className="text-sm font-medium text-gray-700">Catégorie:</label>
                            <select
                                value={selectedCategory}
                                onChange={(e) => setSelectedCategory(e.target.value as 'all' | 'miss' | 'master')}
                                className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                <option value="all">Toutes</option>
                                <option value="miss">Miss</option>
                                <option value="master">Master</option>
                            </select>
                        </div>

                        {/* Sort Controls */}
                        <div className="flex items-center space-x-4">
                            <div className="flex items-center space-x-2">
                                <label className="text-sm font-medium text-gray-700">Trier par:</label>
                                <select
                                    value={sortBy}
                                    onChange={(e) => setSortBy(e.target.value as 'points' | 'votes' | 'name')}
                                    className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-orange-500"
                                >
                                    <option value="points">Points</option>
                                    <option value="votes">Votes</option>
                                    <option value="name">Nom</option>
                                </select>
                            </div>

                            <button
                                onClick={() => setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc')}
                                className="px-3 py-1 border border-gray-300 rounded-md text-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-orange-500"
                            >
                                {sortOrder === 'desc' ? '↓' : '↑'}
                            </button>
                        </div>

                        {/* Results Count */}
                        <div className="text-sm text-gray-600">
                            {displayCandidates.length} candidat{displayCandidates.length > 1 ? 's' : ''}
                            {selectedCategory !== 'all' && ` (${selectedCategory})`}
                        </div>
                    </div>
                </div>
            )}

            {/* Candidates List */}
            <div className="space-y-4">
                {displayCandidates.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-md p-8 text-center">
                        <div className="text-gray-400 text-4xl mb-4">🏆</div>
                        <p className="text-gray-600">Aucun candidat trouvé</p>
                    </div>
                ) : (
                    displayCandidates.map((candidate, index) => (
                        <CandidateCard
                            key={candidate.id}
                            candidate={candidate}
                            rank={index + 1}
                        />
                    ))
                )}
            </div>

            {/* Show More Link (only in preview) */}
            {isPreview && filteredCandidates.length > 5 && (
                <div className="text-center">
                    <p className="text-sm text-gray-600">
                        Et {filteredCandidates.length - 5} autre{filteredCandidates.length - 5 > 1 ? 's' : ''} candidat{filteredCandidates.length - 5 > 1 ? 's' : ''}...
                    </p>
                </div>
            )}
        </div>
    );
};

export default CandidatesList;