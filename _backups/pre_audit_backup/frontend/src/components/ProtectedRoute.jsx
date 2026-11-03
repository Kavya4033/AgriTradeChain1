
import React from 'react';
import { Navigate } from 'react-router-dom';

function ProtectedRoute({ children, role }) {
    const user = JSON.parse(localStorage.getItem('agriUser'));

    if (!user) {
        return <Navigate to="/login" replace />;
    }

    if (user.role?.toLowerCase() !== role.toLowerCase()) {
        return <Navigate to="/login" replace />;
    }

    return children;
}

export default ProtectedRoute;
