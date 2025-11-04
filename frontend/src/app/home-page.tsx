export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-6 py-16">
        <nav className="flex items-center justify-between mb-16">
          <div className="flex items-center space-x-2">
            <span className="text-3xl">🚀</span>
            <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              GrowPilot
            </span>
          </div>
        </nav>

        <div className="text-center max-w-4xl mx-auto mb-20">
          <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Let AI Run Your Marketing
            <br />
            <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              While You Run Your Business
            </span>
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            GrowPilot is an AI-powered SaaS that automates content creation, ads, SEO, 
            and influencer campaigns for startups and small businesses.
          </p>
        </div>
      </div>

      <footer className="border-t border-gray-200 mt-20 py-12">
        <div className="container mx-auto px-6 text-center text-gray-600">
          <p>&copy; 2024 GrowPilot. Built with ❤️ for marketers everywhere.</p>
        </div>
      </footer>
    </div>
  );
}
