'use client';
import React, { useEffect, useState } from 'react';
import { FaAngleDoubleUp } from 'react-icons/fa';

const ScrollToTopButton = () => {
    const [isShowReturnBtn, setShowReturnBtn] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrollTop = window.scrollY;
            setShowReturnBtn(scrollTop > 500);
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, []);
    const handleScrollToTop = () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    };

    return (
        <div className="fixed bottom-10 right-10 z-30">
            <button
                title="On top"
                onClick={handleScrollToTop}
                className={`bg-blue-400 px-4 py-2 rounded-full text-xl ${
                    isShowReturnBtn ? 'visible opacity-100' : 'invisible opacity-0'
                } transition-all duration-300`}
            >
                <FaAngleDoubleUp />
            </button>
        </div>
    );
};

export default ScrollToTopButton;
