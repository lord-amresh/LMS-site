import React from "react";
import {
  footerStyles,
  footerBackgroundStyles,
  contactIconGradients,
  iconColors,
  footerCustomStyles,
} from "../assets/dummyStyles";
import {
  socialIcons,
  quickLinks,
  supportLinks,
  contactInfo,
} from "../assets/dummyFooter";
import logo from '../assets/logo.png';
// Standard UI icons from Lucide
import {
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  BookOpen,
  Users,
  FileText,
  HelpCircle,
  Shield,
  HandHelping,
} from "lucide-react";

// Robust brand icons from React Icons (Font Awesome)
import { FaTwitter, FaInstagram, FaLinkedinIn, FaGithub } from "react-icons/fa";

const iconMap = {
  // Lucide Icons
  Mail,
  Phone,
  MapPin,
  ArrowRight,
  BookOpen,
  Users,
  FileText,
  HelpCircle,
  Shield,
  HandHelping,
  // Brand Icons
  Twitter: FaTwitter,
  Instagram: FaInstagram,
  Linkedin: FaLinkedinIn,
  Github: FaGithub,
};

const Footer = () => {
  return (
    <footer className={footerStyles.footer}>
      <div className={footerBackgroundStyles.backgroundContainer}>
        <div className={footerBackgroundStyles.floatingOrb1}></div>
        <div className={footerBackgroundStyles.floatingOrb2}></div>
        <div className={footerBackgroundStyles.floatingOrb3}></div>
        <div className={footerBackgroundStyles.floatingOrb4}></div>

        <div className={footerBackgroundStyles.gridOverlay}>
          <div
            className="w-full h-full"
            style={{
              backgroundImage: `linear-gradient(rgba(99, 102, 241, 0.1) 1px, transparent 1px),
                              linear-gradient(90deg, rgba(99, 102, 241, 0.1) 1px, transparent 1px)`,
              backgroundSize: "50px 50px",
            }}
          />
        </div>
      </div>

      <div className={footerStyles.container}>
        <div className={footerStyles.grid}>
          <div className={footerStyles.brandSection}>
            <div className={footerStyles.brandTransform}>
              <div className={footerStyles.brandContainer}>
                <div className={footerStyles.brandGradient}></div>
                <div className="relative font-serif flex items-center gap-3">
                  <img src={logo} alt="logo" className="w-12 h-12" />
                  <h3 className={footerStyles.brandTitle}>SkillForge</h3>
                </div>
              </div>
              <p className={footerStyles.brandDescription}>
                Transform your learning journey with interactive courses and
                cutting-edge educational technology designed for modern learners.
              </p>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className={`${footerStyles.sectionHeader} ${iconColors.cyan}`}>
              <ArrowRight className={footerStyles.sectionIcon} />
              Quick Links
            </h4>
            <ul className={footerStyles.linksList}>
              {quickLinks.map((link, index) => {
                const Icon = iconMap[link.iconKey] || ArrowRight;
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className={`${footerStyles.linkItem} ${iconColors.cyan}`}
                      style={{ transitionDelay: `${index * 80}ms` }}
                    >
                      <Icon className={`${footerStyles.linkIcon} ${iconColors.cyan}`} />
                      <span className="truncate">{link.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Support Links */}
          <div>
            <h4 className={`${footerStyles.sectionHeader} ${iconColors.purple}`}>
              <HandHelping className={footerStyles.sectionIcon} />
              Support
            </h4>
            <ul className={footerStyles.linksList}>
              {supportLinks.map((link, index) => {
                const Icon = iconMap[link.iconKey] || HelpCircle;
                return (
                  <li key={link.name}>
                    <a
                      href={link.href}
                      className={`${footerStyles.linkItem} ${iconColors.purple}`}
                      style={{ transitionDelay: `${index * 80}ms` }}
                    >
                      <Icon className={`${footerStyles.linkIcon} ${iconColors.purple}`} />
                      <span className="truncate">{link.name}</span>
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h4 className={`${footerStyles.sectionHeader} ${iconColors.emerald}`}>
              <Phone className={footerStyles.sectionIcon} />
              Contact Us
            </h4>
            <div className={footerStyles.contactSpace}>
              <div className={footerStyles.contactItem}>
                <div className={`${footerStyles.contactIconContainer} ${contactIconGradients.address}`}>
                  <MapPin className={`${footerStyles.contactIcon} ${iconColors.cyan600}`} />
                </div>
                <div className={footerStyles.contactTextContainer}>
                  <p className={footerStyles.contactTextPrimary}>{contactInfo.addressLine1}</p>
                  <p className={footerStyles.contactTextSecondary}>{contactInfo.city}</p>
                </div>
              </div>
              <div className={footerStyles.contactItem}>
                <div className={`${footerStyles.contactIconContainer} ${contactIconGradients.phone}`}>
                  <Phone className={`${footerStyles.contactIcon} ${iconColors.purple600}`} />
                </div>
                <div className={footerStyles.contactTextContainer}>
                  <p className={footerStyles.contactTextPrimary}>{contactInfo.phone}</p>
                  <p className={footerStyles.contactTextSecondary}>{contactInfo.phoneHours}</p>
                </div>
              </div>
              <div className={footerStyles.contactItem}>
                <div className={`${footerStyles.contactIconContainer} ${contactIconGradients.email}`}>
                  <Mail className={`${footerStyles.contactIcon} ${iconColors.emerald600}`} />
                </div>
                <div className={footerStyles.contactTextContainer}>
                  <p className={footerStyles.contactTextPrimary}>{contactInfo.email}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Social Section */}
        <div className={footerStyles.socialSection}>
          <div className={footerStyles.socialContainer}>
            <div className={footerStyles.socialIconsContainer}>
              {socialIcons.map((social, index) => {
                // Fallback to HelpCircle if mapping fails
                const IconComponent = iconMap[social.iconKey] || HelpCircle;
                return (
                  <a
                    key={social.name}
                    href={social.url}
                    aria-label={social.name}
                    className={footerStyles.socialIconLink}
                    style={{ animationDelay: `${index * 80}ms` }}
                  >
                    <div className={`${footerStyles.socialIconContainer} ${social.bgColor}`}>
                      <div className={footerStyles.socialIconInner}>
                        <IconComponent className={footerStyles.socialIcon} />
                      </div>
                      <div className={footerStyles.socialTooltip}>
                        {social.name}
                        <div className={footerStyles.socialTooltipArrow} />
                      </div>
                    </div>
                  </a>
                );
              })}
            </div>

            <div className={footerStyles.designCredit}>
                <div className={footerStyles.designCreditContainer}>
                    <div className={footerStyles.designCreditGradient}></div>
                    <p className={footerStyles.designCreditText}>
                    Designed by{" "}
                    <a
                        href={contactInfo.website}
                        target="_blank"
                        className={footerStyles.designCreditLink}
                    >
                        {contactInfo.designBy}
                    </a>
                    </p>
                </div>
                </div>

          </div>
        </div>
      </div>

      <style>{footerCustomStyles}</style>
    </footer>
  );
};

export default Footer;