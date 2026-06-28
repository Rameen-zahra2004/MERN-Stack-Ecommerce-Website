import { FaFacebookF, FaInstagram, FaWhatsapp } from "react-icons/fa";
import { HiOutlineMail } from "react-icons/hi";

export default function Footer() {
  const socialLinks = {
    facebook:
      "https://m.facebook.com/profile.php?id=100077390211777&ref=ig_profile_ac&almsg=a2w&wtsid=rdr_0M6kN07ehfvI50Mey&refsrc=deprecated&_rdr",
    instagram:
      "https://www.instagram.com/the999box?utm_source=qr&igsh=NWs2M2Z4NjBoY2p2",
    whatsapp: "https://wa.me/9203136962264", // replace with your real number
    email: "aimsbaloch@gmail.com",
  };

  return (
    <footer className="bg-white text-gray-600 border-t border-pink-100 mt-12">
      <div className="max-w-6xl mx-auto px-6 py-10 grid grid-cols-1 md:grid-cols-4 gap-8">
        {/* Brand / About Section */}
        <div className="space-y-3">
          <h3 className="text-2xl font-extrabold text-pink-600 tracking-wide">
            THE 999 BOX
          </h3>
          <p className="text-sm text-gray-500 leading-relaxed">
            Curated boutique essentials, delivered with love. Shop the
            collection that feels as good as it looks.
          </p>
        </div>

        {/* Quick Links */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-800">Quick Links</h3>
          <ul className="space-y-2 text-gray-500">
            <li
              className="hover:text-pink-600 transition cursor-pointer"
              onClick={() => window.scrollTo(0, 0)}
            >
              Home
            </li>
            <li className="hover:text-pink-600 transition cursor-pointer">
              Products
            </li>
            <li className="hover:text-pink-600 transition cursor-pointer">
              Cart
            </li>
            <li className="hover:text-pink-600 transition cursor-pointer">
              Sign In
            </li>
          </ul>
        </div>

        {/* Support Links */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-800">Support</h3>
          <ul className="space-y-2 text-gray-500">
            <li className="hover:text-pink-600 transition cursor-pointer">
              Contact Us
            </li>
            <li className="hover:text-pink-600 transition cursor-pointer">
              FAQs
            </li>
            <li className="hover:text-pink-600 transition cursor-pointer">
              Shipping
            </li>
            <li className="hover:text-pink-600 transition cursor-pointer">
              Returns
            </li>
          </ul>
        </div>

        {/* Social Media */}
        <div className="space-y-3">
          <h3 className="text-lg font-bold text-gray-800">Follow Us</h3>
          <div className="flex gap-3 mt-2">
            <a
              href={socialLinks.facebook}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white transition shadow-sm"
            >
              <FaFacebookF size={16} />
            </a>
            <a
              href={socialLinks.instagram}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white transition shadow-sm"
            >
              <FaInstagram size={16} />
            </a>
            <a
              href={socialLinks.whatsapp}
              target="_blank"
              rel="noopener noreferrer"
              aria-label="WhatsApp"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white transition shadow-sm"
            >
              <FaWhatsapp size={16} />
            </a>
            <a
              href={socialLinks.email}
              aria-label="Email"
              className="w-10 h-10 flex items-center justify-center rounded-full bg-pink-50 text-pink-600 hover:bg-pink-600 hover:text-white transition shadow-sm"
            >
              <HiOutlineMail size={18} />
            </a>
          </div>
          <p className="text-xs text-gray-400 pt-1">aimsbaloch@gmail.com</p>
        </div>
      </div>

      {/* Divider */}
      <div className="border-t border-pink-100"></div>

      {/* Bottom */}
      <div className="max-w-6xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-center justify-between gap-2 text-center text-gray-500 text-sm">
        <p>
          &copy; {new Date().getFullYear()}{" "}
          <span className="text-pink-600 font-semibold">THE 999 BOX</span>. All
          rights reserved.
        </p>
        <p className="text-gray-400">Made with 🤍 for boutique lovers.</p>
      </div>
    </footer>
  );
}
