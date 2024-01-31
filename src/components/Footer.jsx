import Link from 'next/link';
import React from 'react';
import { FaFacebook, FaGithub, FaInstagram } from 'react-icons/fa';

const Footer = () => {
    return (
        <div className="border-t pt-4 mb-12 px-3 flex items-start gap-5 justify-center">
            <img src="./myLogo.png" alt="" className="w-32" />
            <div className="flex flex-col gap-2">
                <h5 className="text-xl font-semibold">Contact</h5>
                <div className="flex flex-col">
                    <span>
                        Phone:{' '}
                        <Link className="hover:underline" href="#">
                            038_____1
                        </Link>
                    </span>
                    <span>
                        Email:{' '}
                        <Link className="hover:underline" href="#">
                            namhoang___@gmail.com
                        </Link>
                    </span>
                </div>
            </div>
            <div className="flex flex-col gap-2">
                <h5 className="text-xl font-semibold">Social Media</h5>
                <p>Follow me on social media to find out the latest updated on our progress</p>
                <div className="flex gap-3">
                    {SOCIAL_LINK.map((item) => (
                        <Link
                            key={item.to}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-2xl hover:scale-110"
                            href={item.to}
                        >
                            {item.icon}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Footer;
const SOCIAL_LINK = [
    {
        to: 'https://www.facebook.com/profile.php?id=100039924610879',
        icon: <FaFacebook />,
    },
    {
        to: 'https://github.com/RoyalNam',
        icon: <FaGithub />,
    },
    { to: 'https://www.instagram.com/nam.royal_', icon: <FaInstagram /> },
];
