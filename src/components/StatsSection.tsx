
const StatsSection = () => {
  return (
    <div className="bg-white py-4 border-b">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex flex-wrap justify-center gap-8 text-center">
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
              <span className="text-blue-600 text-sm">🏛️</span>
            </div>
            <span className="text-gray-700 font-medium">6000+ Institutions</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
              <span className="text-green-600 text-sm">📝</span>
            </div>
            <span className="text-gray-700 font-medium">200+ Exams</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-purple-100 rounded-full flex items-center justify-center">
              <span className="text-purple-600 text-sm">📚</span>
            </div>
            <span className="text-gray-700 font-medium">1000+ Courses</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-8 h-8 bg-orange-100 rounded-full flex items-center justify-center">
              <span className="text-orange-600 text-sm">💻</span>
            </div>
            <span className="text-gray-700 font-medium">200+ Online Courses</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSection;
