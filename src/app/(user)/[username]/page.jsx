'use client';
import React, { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import ErrorDisplay from '@/components/ErrorDisplay';
import { getUserProfile } from '@/service/users';

const Users = () => {
    const { username } = useParams();
    const [userData, setUser] = useState();
    const [err, setErr] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            const user = await getUserProfile(username);
            if (user) {
                setUser(user);
                setErr(null);
                console.log('user', userData);
            } else {
                setError('An error occurred while fetching data. Please try again later.');
            }
        };
        fetchData();
    }, [username]);
    return err ? (
        <ErrorDisplay error={err} />
    ) : (
        <div>
            <h3>User</h3>
        </div>
    );
};

export default Users;
