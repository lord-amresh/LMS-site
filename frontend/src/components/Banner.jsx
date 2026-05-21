import React, { useState } from 'react'
import { CircleCheckBig, Sparkle, X } from 'lucide-react';
import { bannerStyles, customStyles } from '../assets/dummyStyles';
import { features, floatingIcons } from "../assets/dummyBanner";
import bannerImg from '../assets/Bannerimage.jpg';
import video from '../assets/BannerVideo.mp4';

const Banner = () => {
    const [showVideo, setShowVideo] = useState(false);
  return (
    <div className={bannerStyles.container}>
        {/* Floating Icons Wrapper */}
      <div className={bannerStyles.floatingIconsWrapper}>
        {floatingIcons.map((icon, i) => (
          <img
            key={i}
            src={icon.src}
            alt={icon.alt || ""}
            className={`${bannerStyles.floatingIcon} ${icon.pos}`}
            style={{
              animationDelay: `${i * 0.35}s`,
              willChange: "transform, opacity",
            }}
          />
        ))}
    </div>

    <div className={bannerStyles.mainContent}>
        <div className={bannerStyles.grid}>
            <div className={bannerStyles.leftContent}>
                <span className={bannerStyles.badge}>
                    <Sparkle className={bannerStyles.badgeIcon} />
                        New Features Available
                </span>

                <h1 className={bannerStyles.heading}>
                    <span className={bannerStyles.headingSpan1}>Build Amazing</span>
                    <span className={bannerStyles.headingSpan2}>Digital Products</span>
                </h1>

                <p className={bannerStyles.description}>
                    Create beautiful, responsive web applications with our powerful
                    tools and components. start building your next project today.
                </p>

                {/* Features */}
                <div className={bannerStyles.featuresGrid}>
                    {features.map((feature, i) => (
                        <div key={i} className={bannerStyles.featureItem}>
                        <div className={bannerStyles.featureIconContainer}>
                            <span
                            className={`${bannerStyles.featureIcon} text-${feature.color}-500`}
                            >
                            <CircleCheckBig size={16} />
                            </span>
                        </div>
                        <span className={bannerStyles.featureText}>
                            {feature.text}
                        </span>
                        </div>
                    ))}
                </div>

                {/* btns */}
                <div className={bannerStyles.buttonsContainer}>
                    <a href='/courses' className={bannerStyles.buttonGetStarted}>
                        Get Started
                    </a>
                    <button className={bannerStyles.buttonViewDemo}
                    onClick={() => setShowVideo(true)}
                    >
                        View Demo
                    </button>
                </div>
            </div>

            <div className={bannerStyles.imageContainer}>
            <img src={bannerImg} alt='bannerimg' className={bannerStyles.image} />
            </div>
        </div>
      </div>

      {/* video modal */}
      {showVideo && (
        <div className={bannerStyles.videoModal.overlay}>
            <div className={bannerStyles.videoModal.container}>
            <iframe
                src={video}
                className={bannerStyles.videoModal.iframe}
                title="Demo Video"
                allow="autoplay; encrypted-media"
                allowFullScreen
            ></iframe>

            <button onClick={() => setShowVideo(false)} className={bannerStyles.videoModal.closeButton}>
                <span>
                <X className={bannerStyles.videoModal.closeIcon} />
                </span>
            </button>
            </div>
        </div>
        )}

        <style jsx> {customStyles} </style>

         {/* Inline Animations */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-out forwards;
        }
      `}</style>
    </div>
  );
};

export default Banner;