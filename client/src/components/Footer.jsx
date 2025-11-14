import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="mt-12 bg-slate-900 text-white">
      <div className="max-w-6xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          {/* Brand Section */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-2 mb-3">
              <div className="h-10 w-10 rounded-2xl bg-brand-primary text-white flex items-center justify-center font-bold">
                NA
              </div>
              <div>
                <p className="text-white font-semibold">Nutrition Advisor</p>
                <p className="text-xs text-slate-400">Sri Lankan Diets</p>
              </div>
            </div>
            <p className="text-sm text-slate-300 max-w-md">
              Transform your health journey with culturally-aware nutrition. 
              Discover authentic Sri Lankan meals and connect with expert advisors.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3">Quick Links</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/dashboard" className="text-sm text-slate-300 hover:text-brand-light transition">
                  Dashboard
                </Link>
              </li>
              <li>
                <Link to="/foods" className="text-sm text-slate-300 hover:text-brand-light transition">
                  Foods
                </Link>
              </li>
              <li>
                <Link to="/meals" className="text-sm text-slate-300 hover:text-brand-light transition">
                  Meals
                </Link>
              </li>
              <li>
                <Link to="/advisors" className="text-sm text-slate-300 hover:text-brand-light transition">
                  Advisors
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h4 className="font-semibold text-white mb-3">Support</h4>
            <ul className="space-y-2">
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-brand-light transition">
                  Help Center
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-brand-light transition">
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-brand-light transition">
                  Privacy Policy
                </a>
              </li>
              <li>
                <a href="#" className="text-sm text-slate-300 hover:text-brand-light transition">
                  Terms of Service
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-700 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-400">
            © {new Date().getFullYear()} Nutrition Advisor. All rights reserved.
          </p>
          <div className="flex items-center gap-4">
            <span className="text-sm text-slate-400">Made with ❤️ for Sri Lanka</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

