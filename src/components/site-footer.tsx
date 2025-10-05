import { MapPin } from "lucide-react";
import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="bg-black text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* Brand */}
          <div>
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <MapPin className="w-4 h-4 text-black" />
              </div>
              <span className="text-lg font-semibold text-white">
                YourMapArt
              </span>
            </div>
            <p className="text-gray-400 text-sm max-w-xs">
              Create beautiful personalized map art and custom designs. Transform your favorite locations into stunning wall art.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Quick Links</h4>
            <div className="space-y-2">
              <Link
                href="/mpg-templates"
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                Create Design
              </Link>
              <Link
                href="/dashboard"
                className="block text-gray-400 hover:text-white transition-colors text-sm"
              >
                Dashboard
              </Link>
            </div>
          </div>

          {/* Support & Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4 text-sm">Support & Info</h4>
            <div className="space-y-2">
              <a href="mailto:support@yourmapart.com" className="block text-gray-400 hover:text-white transition-colors text-sm">
                Contact & Help
              </a>
              <div className="flex space-x-4 mt-4">
                <a href="/privacy" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                  Privacy
                </a>
                <a href="/terms" className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                  Terms
                </a>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Copyright */}
        <div className="border-t border-gray-800 pt-6 text-center">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} YourMapArt.com. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}
