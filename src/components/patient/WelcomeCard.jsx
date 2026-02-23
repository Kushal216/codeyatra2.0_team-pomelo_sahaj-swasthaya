export default function WelcomeCard({ user }) {
  return (
    <div className="card border-l-4 border-l-blue-700">
      <p className="text-xs text-gray-400 mb-1">Welcome back</p>
      <h2
        className="text-xl font-semibold text-gray-900"
        style={{ fontFamily: 'Fraunces,serif' }}
      >
        {user.name}
      </h2>
      <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-600">
        <span>
          ID: <strong className="text-gray-800">{user._id}</strong>
        </span>
        <span>
          Phone: <strong className="text-gray-800">{user.phone}</strong>
        </span>
      </div>
    </div>
  );
}
