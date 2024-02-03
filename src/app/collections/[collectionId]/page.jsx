'use client';
import { getUserMedia } from '@/service/users';
import React, { useEffect } from 'react';

const Collection = () => {
    useEffect(() => {
        const fetchData = async () => {
            const user = await getUserMedia({ mediaType: 'collections', username: 'neom' });
            console.log('user', user);
        };
        fetchData();
    }, []);
    return <div>Collection</div>;
};

export default Collection;
