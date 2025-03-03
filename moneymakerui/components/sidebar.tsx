import { FaChartLine, FaUserAlt } from 'react-icons/fa';

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 p-6 text-white flex flex-col">
      <h3 className="text-2xl font-semibold mb-8 text-center">Dashboard</h3>
      <ul className="space-y-4">
      <li>
          <a
            href="/dashboard"
            className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-md transition-colors"
          >
            <FaChartLine className="mr-3 text-xl" />
            Dashboard
          </a>
        </li>
        <li>
          <a
            href="/dashboard/stocks"
            className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-md transition-colors"
          >
            <FaChartLine className="mr-3 text-xl" />
            Stocks
          </a>
        </li>
        <li>
          <a
            href="/dashboard/profile"
            className="flex items-center text-lg hover:bg-gray-700 p-2 rounded-md transition-colors"
          >
            <FaUserAlt className="mr-3 text-xl" />
            Profile
          </a>
        </li>
        {/* Add more links as needed */}
      </ul>
    </div>
  );
};

export default Sidebar;
