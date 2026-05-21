import React, { useEffect, useRef, useState } from 'react'
import {navbarStyles} from '../assets/dummyStyles';
import logo from '../assets/logo.png';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, ListChecks, Menu, PlusCircle, X } from 'lucide-react';

const Navbar = () => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isVisible, setIsVisible] = useState(true);
    const location = useLocation();
    const menuRef = useRef(null);

    const menuItems = [
        { id: "dashboard", label: "Dashboard", icon: LayoutDashboard, path: "/" },
        {
        id: "addcourse",
        label: "Add Course",
        icon: PlusCircle,
        path: "/addcourse",
        },
        {
        id: "listcourse",
        label: "List Courses",
        icon: ListChecks,
        path: "/listcourse",
        },
        { id: "bookings", label: "Bookings", icon: ListChecks, path: "/bookings" },
    ];

    // hide navbar on scrolling down
      useEffect(() => {
        let lastScrollY = window.scrollY;
        const handleScroll = () => {
        if (window.scrollY > lastScrollY && window.scrollY > 80) {
            setIsVisible(false);
        } else {
            setIsVisible(true);
        }
        lastScrollY = window.scrollY;
        };

        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    // close menu when clicked outside of the nav
    useEffect(() => {
        const handleClickOutside = (event) => {
        if (menuRef.current && !menuRef.current.contains(event.target)) {
            setIsMenuOpen(false);
        }
        };

        if (isMenuOpen) {
        document.addEventListener("click", handleClickOutside);
        } else {
        document.removeEventListener("click", handleClickOutside);
        }

        return () => document.removeEventListener("click", handleClickOutside);
    }, [isMenuOpen]);
    
    return (
        <>
            <nav className={navbarStyles.nav(isVisible)}>
                <div className={navbarStyles.navContainer}>
                    <div ref={menuRef} className={navbarStyles.navInner(isMenuOpen)}>
                    <div className={navbarStyles.glowEffect}></div>

                    <div className={navbarStyles.navbarContent}>
                        <div className={navbarStyles.logoContainer}>
                        <img src={logo} alt="logo" className={navbarStyles.logoImage} />
                        <div className=" leading-[0.95]">
                            <div className={navbarStyles.logoText}>SkillForge</div>
                        </div>
                        </div>

                        {/* desktop links */}
                        <div className={navbarStyles.desktopNav}>
                            <div className={navbarStyles.desktopNavInner}>
                                {menuItems.map(({id, label, icon: Icon, path}) => {
                                    const isActive = location.pathname === path;
                                    return (
                                        <Link
                                            key={id}
                                            to={path}
                                            className={navbarStyles.desktopNavItem(isActive)}
                                            >
                                            <Icon className=" w-4 h-4" />
                                            <span className=" lg:text-md xl:text-lg md:text-xs">
                                                {label}
                                            </span>

                                            {isActive && (
                                               <span className={navbarStyles.desktopActiveGlow}/> 
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>
                        </div>

                        {/* mobile toggle */}
                        <div className={navbarStyles.mobileToggleContainer}>
                            <button
                                onClick={(e) => {
                                    e.stopPropagation();
                                    setIsMenuOpen(!isMenuOpen);
                                }}
                                className={navbarStyles.mobileToggleButton}
                            >
                                {isMenuOpen ? (
                                    <X className={navbarStyles.mobileToggleIcon} />
                                ) : (
                                    <Menu className={navbarStyles.mobileToggleIcon} />
                                )}
                            </button>
                        </div>
                    </div>

                    {/* mobile navigations */}
                    <div className={navbarStyles.mobileMenu(isMenuOpen)}>
                        <div className={navbarStyles.mobileMenuInner}>
                            {menuItems.map(({ id, label, icon: Icon, path }) => {
                                const isActive = location.pathname === path;
                                return (
                                    <Link
                                        key={id}
                                        to={path}
                                        onClick={() => setIsMenuOpen(false)}
                                        className={navbarStyles.mobileMenuItem(isActive)}
                                    >
                                        <Icon className={navbarStyles.mobileMenuIcon} />
                                        <span className={navbarStyles.mobileMenuText}>
                                            {label}
                                        </span>
                                    </Link>
                                );
                            })}
                        </div>
                    </div>
                    </div>
                </div>
            </nav>
        </>
    )
}

export default Navbar
