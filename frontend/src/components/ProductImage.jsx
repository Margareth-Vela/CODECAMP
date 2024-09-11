import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, IconButton, Typography, Badge, Box } from '@mui/material';


const ProductImage = ({ foto }) => {
    const [imageUrl, setImageUrl] = useState('');

    useEffect(() => {
        const convertToBase64 = async () => {
            if (foto) {
                const arrayBuffer = Uint8Array.from(foto.data);
                const base64 = arrayBufferToBase64(arrayBuffer);
                setImageUrl(`data:image/jpeg;base64,${base64}`);
            }
        };

        convertToBase64();
    }, [foto]);

    const arrayBufferToBase64 = (buffer) => {
        let binary = '';
        const bytes = new Uint8Array(buffer);
        const len = bytes.byteLength;
        for (let i = 0; i < len; i++) {
            binary += String.fromCharCode(bytes[i]);
        }
        return window.btoa(binary);
    };

    return (
        <div style={{ width: '200px', height: '200px', overflow: 'hidden', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: '#f5f5f5' }}>
            {imageUrl ? (
                <img src={imageUrl} alt="Product" style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
            ) : (
                <p>No image available</p>
            )}
        </div>
    );
};

export default ProductImage;
