import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaLinkedinIn,
} from "react-icons/fa";

export default function Footer() {
  return (
    <footer className="bg-gray-800 text-gray-300 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* About Section */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-white">About Us</h3>
          <p className="text-sm text-gray-400">
            Practice Project Store is a demo e-commerce app to showcase React,
            Redux, and Tailwind skills.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-white">Quick Links</h3>
          <ul className="space-y-2 text-gray-400">
            <li
              className="hover:text-white transition cursor-pointer"
              onClick={() => window.scrollTo(0, 0)}
            >
              Home
            </li>
            <li className="hover:text-white transition cursor-pointer">
              Products
            </li>
            <li className="hover:text-white transition cursor-pointer">Cart</li>
            <li className="hover:text-white transition cursor-pointer">
              Sign In
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-white">Support</h3>
          <ul className="space-y-2 text-gray-400">
            <li className="hover:text-white transition cursor-pointer">
              Contact Us
            </li>
            <li className="hover:text-white transition cursor-pointer">FAQs</li>
            <li className="hover:text-white transition cursor-pointer">
              Shipping
            </li>
            <li className="hover:text-white transition cursor-pointer">
              Returns
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="space-y-3">
          <h3 className="text-xl font-bold text-white">Follow Us</h3>
          <div className="flex gap-4 mt-2">
            <a href="#" className="hover:text-white transition">
              <FaFacebookF size={20} />
            </a>
            <a href="#" className="hover:text-white transition">
              <FaTwitter size={20} />
            </a>
            <a href="#" className="hover:text-white transition">
              <FaInstagram size={20} />
            </a>
            <a href="#" className="hover:text-white transition">
              <FaLinkedinIn size={20} />
            </a>
          </div>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-gray-700 mt-8"></div>

      {/* Bottom */}
      <div className="max-w-6xl mx-auto px-6 py-4 text-center text-gray-500 text-sm">
        &copy; {new Date().getFullYear()} Practice Project Store. All rights
        reserved.
      </div>
    </footer>
  );
}
