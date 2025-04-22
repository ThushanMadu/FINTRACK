import { DollarSign } from 'lucide-react';

const LoadingScreen = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 mb-4 bg-primary-500 text-white rounded-full animate-pulse-slow">
          <DollarSign size={32} />
        </div>
        <h1 className="text-xl font-semibold text-gray-800 mb-2">Loading FinTrack</h1>
        <p className="text-gray-500">Please wait a moment...</p>
      </div>
    </div>
  );
};

export default LoadingScreen;