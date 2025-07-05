import { motion } from "framer-motion";

const SkeletonCard = ({ className = "" }: { className?: string }) => (
  <div className={`bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 ${className}`}>
    <div className="animate-pulse space-y-4">
      <div className="flex justify-between items-start">
        <div className="h-4 bg-gray-700/50 rounded w-24"></div>
        <div className="h-8 bg-gray-700/50 rounded w-16"></div>
      </div>
      <div className="h-8 bg-gray-700/50 rounded w-20"></div>
      <div className="flex items-center space-x-2">
        <div className="h-2 w-2 bg-gray-700/50 rounded-full"></div>
        <div className="h-3 bg-gray-700/50 rounded w-16"></div>
      </div>
    </div>
  </div>
);

const SkeletonChart = ({ height = "h-80" }: { height?: string }) => (
  <div className={`bg-gray-800/30 rounded-xl p-6 border border-gray-700/30 ${height}`}>
    <div className="animate-pulse space-y-4 h-full">
      <div className="flex justify-between items-center">
        <div className="h-6 bg-gray-700/50 rounded w-32"></div>
        <div className="h-8 bg-gray-700/50 rounded w-24"></div>
      </div>
      <div className="h-full bg-gray-700/30 rounded-lg flex items-end space-x-2 p-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="bg-gray-600/40 rounded-t flex-1"
            style={{ height: `${Math.random() * 60 + 20}%` }}
          />
        ))}
      </div>
    </div>
  </div>
);

const LoadingSkeleton = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white">
      {/* Header Skeleton */}
      <header className="sticky top-0 z-50 bg-black/80 backdrop-blur-md border-b border-gray-800/50 p-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-8 bg-gradient-to-r from-yellow-400/50 to-yellow-600/50 rounded w-40"></div>
            <div className="h-4 bg-gray-700/50 rounded w-48"></div>
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-8 bg-gray-700/50 rounded-full w-32"></div>
            <div className="h-4 bg-gray-700/50 rounded w-20"></div>
            <div className="flex space-x-2">
              <div className="h-9 w-9 bg-gray-700/50 rounded-lg"></div>
              <div className="h-9 w-9 bg-gray-700/50 rounded-lg"></div>
              <div className="h-9 w-9 bg-gray-700/50 rounded-lg"></div>
            </div>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-6 py-8 lg:px-8 lg:py-10 space-y-10">
        
        {/* Executive Summary Skeleton */}
        <motion.div
          className="bg-gray-800/30 rounded-2xl p-8 border border-gray-700/30"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="animate-pulse space-y-2">
                <div className="flex items-center space-x-2">
                  <div className="h-4 w-4 bg-gray-700/50 rounded"></div>
                  <div className="h-3 bg-gray-700/50 rounded w-24"></div>
                </div>
                <div className="h-8 bg-gray-700/50 rounded w-32"></div>
                <div className="h-3 bg-gray-700/50 rounded w-20"></div>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Metrics Grid Skeleton */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
        >
          <div className="flex items-center justify-between mb-6">
            <div className="h-8 bg-gray-700/50 rounded w-64 animate-pulse"></div>
            <div className="h-4 bg-gray-700/50 rounded w-48 animate-pulse"></div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {Array.from({ length: 10 }).map((_, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.05, duration: 0.3 }}
              >
                <SkeletonCard />
              </motion.div>
            ))}
          </div>
        </motion.section>

        {/* Chart Skeleton */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          <SkeletonChart />
        </motion.section>

        {/* Risk Panel Skeleton */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
        >
          <div className="h-8 bg-gray-700/50 rounded w-48 mb-6 animate-pulse"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <SkeletonCard key={i} />
            ))}
          </div>
        </motion.section>

        {/* Advanced Analytics Skeleton */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-8"
        >
          <div className="h-8 bg-gray-700/50 rounded w-48 animate-pulse"></div>
          <SkeletonChart height="h-64" />
          <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
            <SkeletonChart height="h-96" />
            <SkeletonChart height="h-96" />
          </div>
        </motion.section>

        {/* Portfolio Holdings Skeleton */}
        <motion.section
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <SkeletonChart height="h-80" />
        </motion.section>

        {/* Loading indicator */}
        <motion.div
          className="flex items-center justify-center py-8"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
        >
          <div className="flex items-center space-x-3">
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-yellow-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
            <span className="text-gray-400 text-sm ml-4">Loading portfolio data...</span>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default LoadingSkeleton;