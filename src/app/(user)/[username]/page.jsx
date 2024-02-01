'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { FaGlobe, FaInstagram, FaTwitter } from 'react-icons/fa';
import ErrorDisplay from '@/components/ErrorDisplay';
import { getPhotosByUser, getUserProfile } from '@/service/users';
import PhotosGrid from '@/components/PhotosGrid';

const Users = () => {
    const { username } = useParams();
    const [userData, setUser] = useState(null);
    const [error, setError] = useState(null);
    const [likedPhotos, setLikedPhotos] = useState([]);
    const [uploadedPhotos, setUploadedPhotos] = useState([]);
    const [isTapCreated, setTapCreated] = useState(true);
    const [loading, setLoading] = useState(false);
    const [uploadedPage, setUploadedPage] = useState(1);
    const [likedPage, setLikedPage] = useState(1);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getUserProfile(username);
                if (user) {
                    setUser(user);
                    setError(null);
                    const uploaded = await getPhotosByUser({ username: user.username });
                    const liked = await getPhotosByUser({ type: 'likes', username: user.username });

                    setUploadedPhotos(uploaded);
                    setLikedPhotos(liked);
                }
            } catch (error) {
                setError('An error occurred while fetching data. Please try again later.');
            }
        };

        fetchData();
    }, [username]);

    useEffect(() => {
        const handleScroll = () => {
            const scrollHeight = document.documentElement.scrollHeight;
            const scrollTop = window.scrollY;
            const clientHeight = window.innerHeight;

            if (scrollHeight - scrollTop <= clientHeight + 350 && !loading) {
                loadMorePhotos();
            }
        };

        window.addEventListener('scroll', handleScroll);

        return () => {
            window.removeEventListener('scroll', handleScroll);
        };
    }, [loading, isTapCreated]);

    const loadMorePhotos = async () => {
        setLoading(true);

        try {
            let newPhotos;
            if (isTapCreated) {
                newPhotos = await getPhotosByUser({ username: username, page: uploadedPage + 1 });
                setUploadedPhotos((prev) => [...prev, ...newPhotos]);
                setUploadedPage((prev) => prev + 1);
            } else {
                newPhotos = await getPhotosByUser({ type: 'likes', username: username, page: likedPage + 1 });
                setLikedPhotos((prev) => [...prev, ...newPhotos]);
                setLikedPage((prev) => prev + 1);
            }
        } catch (error) {
            console.error('Error loading more photos:', error);
        }

        setLoading(false);
    };

    const renderSocial = (to, icon) => (
        <Link target="_blank" rel="noopener noreferrer" className="text-xl hover:scale-110" href={to}>
            {icon}
        </Link>
    );

    return error ? (
        <ErrorDisplay error={error} />
    ) : (
        userData && (
            <div className="my-8">
                <div className="flex flex-col items-center gap-4">
                    <img src={userData.profile_image.large} alt={userData.username} className="rounded-full" />
                    <div className="flex flex-col text-center items-center">
                        <h5 className="text-xl font-medium">{userData.name}</h5>
                        <p className="line-clamp-2 mb-2 font-light text-sm">{userData.bio}</p>
                        <div className="flex gap-3 my-2">
                            {userData.portfolio_url && (userData.portfolio_url, (<FaGlobe />))}
                            {userData.instagram_username &&
                                renderSocial(
                                    `https://www.instagram.com/${userData.instagram_username}`,
                                    <FaInstagram />,
                                )}
                            {userData.twitter_username &&
                                renderSocial(`https://twitter.com/${userData.twitter_username}`, <FaTwitter />)}
                        </div>
                        <div className="flex gap-2">
                            <span className="relative pr-3">
                                {userData.followers_count} followers
                                <span className="absolute w-1 h-1 right-0 top-1/2 -translate-y-1/2  bg-current rounded-full" />
                            </span>
                            <span>{userData.following_count} following</span>
                        </div>
                    </div>
                </div>
                <div className="mt-8">
                    <div className="flex gap-6 justify-center font-medium mb-5">
                        <button className={isTapCreated ? 'border-b' : ''} onClick={() => setTapCreated(true)}>
                            Uploaded
                        </button>
                        <button className={!isTapCreated ? 'border-b' : ''} onClick={() => setTapCreated(false)}>
                            Liked
                        </button>
                    </div>
                    {isTapCreated ? <PhotosGrid photos={uploadedPhotos} /> : <PhotosGrid photos={likedPhotos} />}
                </div>
            </div>
        )
    );
};

export default Users;
