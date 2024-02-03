'use client';
import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { FaGlobe, FaImages, FaInstagram, FaTwitter } from 'react-icons/fa';
import InfiniteScroll from 'react-infinite-scroll-component';
import ErrorDisplay from '@/components/ErrorDisplay';
import { getUserMedia, getUserProfile } from '@/service/users';
import PhotoGallery from '@/components/PhotoGallery';

const Users = () => {
    const router = useRouter();
    const { username } = useParams();
    const [userData, setUserData] = useState(null);
    const [error, setError] = useState(null);
    const [likedPhotos, setLikedPhotos] = useState([]);
    const [uploadedPhotos, setUploadedPhotos] = useState([]);
    const [collectionsPhotos, setCollectionsPhotos] = useState([]);
    const [mediaType, setMediaType] = useState('uploaded');
    const [page, setPage] = useState({ uploaded: 1, liked: 1, collections: 1 });
    const [isEndPage, setEndPage] = useState({ uploaded: false, liked: false, collections: false });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const user = await getUserProfile(username);
                if (user) {
                    setUserData(user);
                    setError(null);

                    const uploaded = await getUserMedia({ username: user.username });
                    const liked = await getUserMedia({ mediaType: 'likes', username: user.username });
                    const collections = await getUserMedia({ mediaType: 'collections', username: user.username });

                    setUploadedPhotos(uploaded);
                    setLikedPhotos(liked);
                    setCollectionsPhotos(collections);
                }
            } catch (error) {
                setError('An error occurred while fetching data. Please try again later.');
            }
        };

        fetchData();
    }, [username]);

    const loadMorePhotos = async () => {
        try {
            let newPhotos;

            if (mediaType === 'uploaded' && !isEndPage.uploaded) {
                newPhotos = await getUserMedia({ username: username, page: page.uploaded + 1 });
                if (newPhotos.length === 0) setEndPage((prev) => ({ ...prev, uploaded: true }));
                else {
                    setUploadedPhotos((prev) => [...prev, ...newPhotos]);
                    setPage((prev) => ({ ...prev, uploaded: prev.uploaded + 1 }));
                }
            } else if (mediaType === 'liked' && !isEndPage.liked) {
                newPhotos = await getUserMedia({ mediaType: 'likes', username: username, page: page.liked + 1 });
                if (newPhotos.length === 0) setEndPage((prev) => ({ ...prev, liked: true }));
                else {
                    setLikedPhotos((prev) => [...prev, ...newPhotos]);
                    setPage((prev) => ({ ...prev, liked: prev.liked + 1 }));
                }
            } else if (mediaType === 'collections' && !isEndPage.collections) {
                newPhotos = await getUserMedia({
                    mediaType: 'collections',
                    username: username,
                    page: page.collections + 1,
                });
                if (newPhotos.length === 0) setEndPage((prev) => ({ ...prev, collections: true }));
                else {
                    setCollectionsPhotos((prev) => [...prev, ...newPhotos]);
                    setPage((prev) => ({ ...prev, collections: prev.collections + 1 }));
                }
            }
        } catch (error) {
            console.error('Error loading more photos:', error);
        }
    };

    const handleMediaTypeChange = (type) => setMediaType(type);

    const renderSocialLink = (url, icon) => (
        <Link key={url} target="_blank" rel="noopener noreferrer" className="text-xl hover:scale-110" href={url}>
            {icon}
        </Link>
    );

    const renderMediaTypeButton = (type, label, count) => (
        <button className={mediaType === type ? 'border-b' : ''} onClick={() => handleMediaTypeChange(type)}>
            {label}(<span>{count}</span>)
        </button>
    );

    const renderUserInfo = () => (
        <div className="flex flex-col items-center gap-4">
            <img src={userData.profile_image.large} alt={userData.username} className="rounded-full" />
            <div className="flex flex-col text-center items-center">
                <h5 className="text-xl font-medium">{userData.name}</h5>
                <p className="line-clamp-2 mb-2 font-light text-sm">{userData.bio}</p>
                <div className="flex gap-3 my-2">
                    {userData.portfolio_url && renderSocialLink(userData.portfolio_url, <FaGlobe />)}
                    {userData.instagram_username &&
                        renderSocialLink(`https://www.instagram.com/${userData.instagram_username}`, <FaInstagram />)}
                    {userData.twitter_username &&
                        renderSocialLink(`https://twitter.com/${userData.twitter_username}`, <FaTwitter />)}
                </div>
                <div className="flex gap-2">
                    <span className="relative pr-3">
                        {userData.followers_count} followers
                        <span className="absolute w-1 h-1 right-0 top-1/2 -translate-y-1/2 bg-current rounded-full" />
                    </span>
                    <span>{userData.following_count} following</span>
                </div>
            </div>
        </div>
    );

    return error ? (
        <ErrorDisplay error={error} />
    ) : (
        userData && (
            <div className="my-8">
                {renderUserInfo()}
                <div className="mt-8">
                    <div className="flex gap-6 justify-center font-medium mb-5">
                        {renderMediaTypeButton('uploaded', 'Uploaded', userData.total_photos)}
                        {renderMediaTypeButton('liked', 'Liked', userData.total_likes)}
                        {renderMediaTypeButton('collections', 'Collections', userData.total_collections)}
                    </div>
                    {mediaType === 'uploaded' && (
                        <PhotoGallery title="uploaded" loadMore={loadMorePhotos} photos={uploadedPhotos} />
                    )}
                    {mediaType === 'liked' && (
                        <PhotoGallery title="liked" loadMore={loadMorePhotos} photos={likedPhotos} />
                    )}
                    {mediaType === 'collections' && (
                        <InfiniteScroll dataLength={collectionsPhotos.length} next={loadMorePhotos} hasMore={true}>
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
                                {collectionsPhotos.length > 0 ? (
                                    collectionsPhotos.map(
                                        (item) =>
                                            item.total_photos > 0 && (
                                                <div
                                                    key={item.id}
                                                    className="hover:opacity-90 cursor-pointer"
                                                    onClick={() => router.push(`/collections/${item.id}`)}
                                                >
                                                    <div className="grid grid-cols-2 gap-1 rounded-xl overflow-hidden">
                                                        {item.preview_photos.map((photo) => (
                                                            <img
                                                                key={photo.id}
                                                                src={photo.urls.small}
                                                                alt=""
                                                                className="aspect-square w-full object-cover"
                                                            />
                                                        ))}
                                                    </div>
                                                    <div className="flex justify-between flex-1 gap-2 mt-3">
                                                        <h5 className="line-clamp-1">{item.title}</h5>
                                                        <div className="flex items-center gap-1">
                                                            <FaImages className="text-xl" />
                                                            <span>{item.total_photos}</span>
                                                        </div>
                                                    </div>
                                                </div>
                                            ),
                                    )
                                ) : (
                                    <div className="text-red-500">
                                        <span>No collections found.</span>
                                    </div>
                                )}
                            </div>
                        </InfiniteScroll>
                    )}
                </div>
            </div>
        )
    );
};

export default Users;
