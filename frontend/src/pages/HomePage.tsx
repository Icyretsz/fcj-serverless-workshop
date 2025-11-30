import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import AuthButton from "../component/AuthButton.tsx";
import { useAuth } from "react-oidc-context";
import { apiClient } from "../services/apiClient.ts";
import { User } from "../types";

const HomePage: React.FC = () => {
    const [loading, setLoading] = useState<boolean>(true);
    const [error, setError] = useState<string | null>(null);
    const [users, setUsers] = useState<User[] | null>(null);

    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuth();

    useEffect(() => {
        const fetchUsers = async () => {
            if (!isAuthenticated || !user) {
                setLoading(false);
                return;
            }

            const token = user.id_token;

            const response = await apiClient.getAll<User[]>("/users", token);

            if (!response.success) {
                setError(response.error || "Failed to load users.");
            } else {
                setUsers(response.data || null);
            }

            setLoading(false);
        };

        fetchUsers();
    }, [isAuthenticated, user]);

    if (loading) {
        return (
            <div style={{ padding: '20px', textAlign: 'center' }}>
                <p>Loading...</p>
            </div>
        );
    }

    return (
        <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto' }}>
            <h1>Welcome to Serverless Application Deployment Demo</h1>

            <AuthButton />

            {error && (
                <p style={{ color: 'red', marginTop: '20px' }}>
                    Error: {error}
                </p>
            )}

            {users && (
                <div style={{ marginTop: '20px' }}>
                    <h2>Users from API:</h2>
                    <pre>{JSON.stringify(users, null, 2)}</pre>
                </div>
            )}
        </div>
    );
};

export default HomePage;
