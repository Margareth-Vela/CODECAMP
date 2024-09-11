import React, { useState } from 'react';
import { Controller } from 'react-hook-form';
import { Typography } from '@mui/material';


const ImageController = ({ name, control, setValue, errors }) => {
    const [imageBase64, setImageBase64] = useState('');

    // Función para convertir archivo a Base64
    const fileToBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = () => resolve(reader.result);
            reader.onerror = (error) => reject(error);
            reader.readAsDataURL(file);
        });
    };

    // Manejador del cambio de archivo
    const onFileChange = async (event) => {
        const file = event.target.files[0];
        if (file) {
            try {
                const base64 = await fileToBase64(file);
                setImageBase64(base64); // Guardar base64 en el estado
                setValue(name, base64); // Actualizar el campo en react-hook-form
            } catch (error) {
                console.error('Error al convertir archivo a Base64:', error);
            }
        }
    };

    return (
        <div>
            <Controller
                name={name}
                control={control}
                render={({ field }) => (
                    <input
                        type="file"
                        accept=".jpeg,.jpg,.png"
                        onChange={(e) => {
                            onFileChange(e);
                            field.onChange(e.target.files[0]);
                        }}
                        style={{ marginTop: '16px' }}
                    />
                )}
            />
            {errors[name] && (
                <Typography variant="body2" color="error">
                    {errors[name].message}
                </Typography>
            )}
            {imageBase64 && (
                <img
                    src={imageBase64}
                    alt="Preview"
                    style={{ width: '200px', height: '200px', objectFit: 'cover' }}
                />
            )}
        </div>
    );
};

export default ImageController;
