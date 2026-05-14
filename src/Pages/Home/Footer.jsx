import React, { useEffect, useState } from "react";
import { Facebook, Twitter, Instagram, Github, Linkedin } from "lucide-react";
import Modal from "./Modal"; // Assuming the Modal component is available here

// Content for the modals
const MODAL_DATA = {
  "About Us": {
    title: "About CivicConnect",
    body: `CivicConnect is a community-driven digital platform designed to empower citizens to report, track, and resolve civic and social issues efficiently. 
We aim to bridge the gap between residents and local authorities by creating a transparent, accountable, and collaborative environment. 
From road damage to waste management, CivicConnect ensures every voice is heard and every issue matters.`,
  },

  "Our Mission": {
    title: "Our Mission",
    body: `Our mission is to improve urban living by enabling fast, transparent, and collaborative problem-solving between citizens and local authorities. 
We believe in smart cities, active citizens, and accountable governance.`,
  },

  "Our Vision": {
    title: "Our Vision",
    body: `To build a future where communities are cleaner, safer, and more connected through technology. 
We envision CivicConnect as the central hub for civic engagement and digital governance.`,
  },

  "How It Works": {
    title: "How CivicConnect Works",
    body: `1. Citizens report issues with details and images.
2. Authorities review and assign staff.
3. Progress is tracked through timelines.
4. Issues are resolved transparently.

This ensures accountability and real-time updates for everyone.`,
  },

  "Report Issue": {
    title: "How to Report an Issue",
    body: `To report a new issue, go to the 'Report Issue' page and fill in all required details such as title, category, location, and description. 
You can also upload an image to help authorities understand the problem better. 
Login is required to ensure authenticity and proper tracking.`,
  },

  "Why CivicConnect": {
    title: "Why Choose CivicConnect",
    body: `✔ Transparent issue tracking  
✔ Real-time status updates  
✔ Community-driven approach  
✔ Secure and reliable platform  
✔ Direct communication with authorities  

CivicConnect makes civic problem-solving simple and effective.`,
  },

  Features: {
    title: "Key Features",
    body: `• Issue Reporting with Images  
• Live Status Tracking  
• Priority Boosting  
• Admin & Staff Management  
• Timeline Updates  
• Secure Authentication  
• Community Engagement`,
  },

  "User Roles": {
    title: "User Roles in CivicConnect",
    body: `Citizen: Can report and track issues.  
Authority/Admin: Can manage, assign, and resolve issues.  
Staff: Handles on-ground resolution and updates status.`,
  },

  Contact: {
    title: "Contact Support",
    body: `📞 Phone: +880-1935841938  
📧 Email: support@civicconnect.org  

Our support team is available Sunday to Thursday, 9 AM – 6 PM. 
We are always ready to help you.`,
  },

  "Privacy Policy": {
    title: "Privacy Policy",
    body: `Your privacy is extremely important to us. All personal information is securely stored and used only for:
• Issue verification  
• Account authentication  
• Communication updates  

We do not sell, trade, or share your data with third parties.`,
  },

  "Terms & Conditions": {
    title: "Terms & Conditions",
    body: `By using CivicConnect, you agree to provide accurate information and avoid misuse of the platform. 
Any false reporting, spamming, or abusive behavior may result in account suspension.`,
  },

  "Community Guidelines": {
    title: "Community Guidelines",
    body: `We encourage respectful communication, genuine issue reporting, and positive engagement. 
Help us keep CivicConnect a safe and productive space for everyone.`,
  },

  FAQ: {
    title: "Frequently Asked Questions",
    body: `Q: Is CivicConnect free to use?  
A: Yes, completely free for citizens.

Q: Can I edit my reported issue?  
A: Yes, while the issue is still pending.

Q: How long does resolution take?  
A: Depends on the issue type and authority response.`,
  },
};

const Footer = () => {
  const [theme, setTheme] = useState(
    localStorage.getItem("theme") || "civicLight"
  );
  const [modalContent, setModalContent] = useState(null);

  useEffect(() => {
    const handleThemeChange = () => {
      const newTheme = localStorage.getItem("theme") || "civicLight";
      if (newTheme !== theme) {
        setTheme(newTheme);
      }
    };
    window.addEventListener("storage", handleThemeChange);
    return () => {
      window.removeEventListener("storage", handleThemeChange);
    };
  }, [theme]);

  const cardBgClass = theme === "civicLight" ? "bg-gray-200" : "bg-gray-900";
  const titleClass =
    theme === "civicLight" ? "text-blue-400" : "text-secondary";
  const linkHoverClass = "hover:text-white";
  const textClass =
    theme === "civicLight" ? "text-slate-800" : "text-slate-300";

  const openModal = (type) => {
    setModalContent(type);
  };

  const closeModal = () => {
    setModalContent(null);
  };

  const currentModalData = modalContent
    ? MODAL_DATA[modalContent]
    : { title: "", body: "" };

  return (
    <>
      <footer className={`${cardBgClass} text-white py-20`}>
        <div className="max-w-6xl mx-auto px-4 grid grid-cols-1 md:grid-cols-3 gap-8 text-sm">
          {/* About Section */}
          <div>
            <h3 className={`text-secondary font-semibold mb-2`}>
              About CivicConnect
            </h3>
            <p className={`${textClass}`}>
              CivicConnect empowers citizens to report and resolve social issues
              through community-driven action.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className={`text-secondary font-semibold mb-2`}>Quick Links</h3>
            <ul className={`${textClass} font-semibold space-y-1`}>
              {["About Us", "Report Issue", "Contact", "Privacy Policy"].map(
                (link, i) => (
                  <li key={i}>
                    <button
                      onClick={() => openModal(link)}
                      className={`${linkHoverClass} block text-left transition duration-200`}
                    >
                      {link}
                    </button>
                  </li>
                )
              )}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className={` text-secondary font-semibold mb-2`}>Connect</h3>
            <p className={`${textClass}`}>Email: support@civicconnect.org</p>
            <p className={`${textClass}`}>Phone: +880-1935841938</p>
            <div className={`mt-2 flex space-x-4 ${textClass}`}>
              <a
                href="https://www.facebook.com/fah20im04"
                aria-label="Facebook"
                className={linkHoverClass}
              >
                <Facebook size={18} />
              </a>
              <a
                href="https://github.com/fah20im04"
                aria-label="Github"
                className={linkHoverClass}
              >
                <Github size={18} />
              </a>
              <a
                href="https://www.instagram.com/fanion_04/"
                aria-label="Instagram"
                className={linkHoverClass}
              >
                <Instagram size={18} />
              </a>
              <a
                href="https://www.linkedin.com/in/fahim-ahmed-ayon/"
                aria-label="LinkedIn"
                className={linkHoverClass}
              >
                <Linkedin size={18} />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-8 border-t border-slate-700 pt-4 text-center text-slate-500 text-xs">
          © {new Date().getFullYear()} CivicConnect — All Rights Reserved
        </div>
      </footer>

      {/* Modal Renderer */}
      {modalContent && (
        <Modal
          title={currentModalData.title}
          body={currentModalData.body}
          isOpen={!!modalContent}
          onClose={closeModal}
        />
      )}
    </>
  );
};

export default Footer;
