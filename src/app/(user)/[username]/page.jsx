'use client';
import { useParams } from 'next/navigation';
import React, { useEffect } from 'react';

const Users = () => {
    const { username } = useParams();
    useEffect(() => {
        console.log('username', username);
    });
    return <div>Users</div>;
};

export default Users;
