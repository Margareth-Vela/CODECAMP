const express = require('express');
const router = express.Router();
const sequelize = require('../config/database');

// Ruta para leer un producto
exports.getAllProducts = async (req, res) => {
    try {
      const users = await sequelize.query("SELECT * FROM Productos_activos");
      res.status(200).json(users);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  };

// Ruta para crear un producto
exports.createProduct = async (req, res) => {
    const { idCategoriaProductos, idUsuarios, nombre, marca, codigo, stock, idEstados, precio, foto } = req.body;

    // Si foto no está presente, enviar null
    const fotoValue = foto ? foto : null;

    try {
        await sequelize.query(`
            EXEC InsertarProductos @idCategoriaProductos =:idCategoriaProductos, @idUsuarios=:idUsuarios, 
            @nombre=:nombre, @marca=:marca, @codigo=:codigo, @stock=:stock, 
            @idEstados=:idEstados, @precio=:precio, @foto=:foto`, 
        {
            replacements: { idCategoriaProductos, idUsuarios, nombre, marca, codigo, stock, idEstados, precio, foto: fotoValue }
        });
        res.status(201).json({ message: 'Producto creado exitosamente.' });
    } catch (error) {
        console.error('Error al crear producto:', error);
        res.status(500).json({ error: 'Error al crear el producto.' });
    }
};

// Ruta para actualizar un producto
exports.updateProduct = async (req, res) => {
    const { idProductos } = req.params;
    const { idCategoriaProductos, idUsuarios, nombre, marca, codigo, stock, idEstados, precio, foto } = req.body;

    // Si foto no está presente, enviar null
    const fotoValue = foto ? foto : null;

    try {
        await sequelize.query(`
            EXEC ActualizarProductos @idProductos=:idProductos, @idCategoriaProductos=:idCategoriaProductos, @idUsuarios=:idUsuarios, 
            @nombre=:nombre, @marca=:marca, @codigo=:codigo, @stock=:stock, 
            @idEstados=:idEstados, @precio=:precio, @foto=:foto`,
        {
            replacements: { idProductos, idCategoriaProductos, idUsuarios, nombre, marca, codigo, stock, idEstados, precio, foto: fotoValue }
        });
        res.status(200).json({ message: 'Producto actualizado exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar producto:', error);
        res.status(500).json({ error: 'Error al actualizar el producto.' });
    }
};

