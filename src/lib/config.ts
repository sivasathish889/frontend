export const BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000';
export const API_URL = `${BASE_URL}/api`;
export const UPLOADS_URL = `${BASE_URL}/uploads`;

export const getImageUrl = (path: string | undefined | null) => {
    if (!path) return null;
    if (path.startsWith('http')) return path;
    // Assuming path starts with /uploads/..., but our UPLOADS_URL is localhost:5000/uploads
    // If path is /uploads/foo.jpg, we want localhost:5000/uploads/foo.jpg.
    // If BASE_URL is localhost:5000, then BASE_URL + path works.
    return `${BASE_URL}${path.startsWith('/') ? '' : '/'}${path}`;
};
