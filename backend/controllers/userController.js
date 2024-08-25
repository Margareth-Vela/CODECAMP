const sequelize = require('../config/database.js');
const { generateToken } = require('../config/auth.js');
const bcrypt = require('bcryptjs');

// Ruta para leer usuarios  
exports.getAllUsers = async (req, res) => {
  try {
    const users = await sequelize.query("SELECT * FROM VistaUsuarios");
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


// Ruta para crear un usuario REGISTER
exports.createUser = async (req, res) => {
    const { idRol, idEstados, Correo, Nombre_completo, password, telefono, fecha_nacimiento } = req.body;

    try {
        // Encriptar la contraseña antes de guardarla
        const hashedPassword = await bcrypt.hash(password, 10);

        await sequelize.query(`
            EXEC InsertarUsuario @idRol=:idRol, @idEstados=:idEstados, @Correo=:Correo, 
            @Nombre_completo=:Nombre_completo, @password=:password, @telefono=:telefono, @fecha_nacimiento=:fecha_nacimiento
        `, {
            replacements: { idRol, idEstados, Correo, Nombre_completo, password: hashedPassword, telefono, fecha_nacimiento }
        });

        res.status(201).json({ message: 'Usuario creado exitosamente.' });
    } catch (error) {
        console.error('Error al crear usuario:', error);
        res.status(500).json({ error: 'Error al crear el usuario.' });
    }
};


// Ruta para actualizar un usuario 
exports.updateUser = async (req, res) => {
    const { idUsuarios } = req.params;
    const { idRol, idEstados, Correo, Nombre_completo, password, telefono, fecha_nacimiento } = req.body;

    try {
        // Encriptar la contraseña antes de actualizarla si se proporciona una nueva
        let hashedPassword = null;
        if (password) {
            hashedPassword = await bcrypt.hash(password, 10);
        }

        await sequelize.query(`
            EXEC ActualizarUsuario @idUsuarios=:idUsuarios, @idRol=:idRol, @idEstados=:idEstados, 
            @Correo=:Correo, @Nombre_completo=:Nombre_completo, 
            @password=${hashedPassword ? ':password' : 'NULL'}, 
            @telefono=:telefono, @fecha_nacimiento=:fecha_nacimiento
        `, {
            replacements: { 
                idUsuarios, idRol, idEstados, Correo, Nombre_completo, 
                password: hashedPassword, telefono, fecha_nacimiento 
            }
        });

        res.status(200).json({ message: 'Usuario actualizado exitosamente.' });
    } catch (error) {
        console.error('Error al actualizar usuario:', error);
        res.status(500).json({ error: 'Error al actualizar el usuario.' });
    }
};

// Ruta para leer un usuario LOGIN
exports.loginUser = async (req, res) => {
    const { Correo, password } = req.body;
    try {
        // Busca el usuario por correo
        const [results] = await sequelize.query(`
            SELECT idUsuarios, idRol, idEstados, Correo, Nombre_completo, password
            FROM Usuarios
            WHERE Correo = :Correo
        `, {
            replacements: { Correo }
        });

        if (results.length === 0) {
            return res.status(401).json({ error: 'Correo incorrecto.' });
        }

        const user = results[0];

        // Compara la contraseña proporcionada con la almacenada en la base de datos
        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            return res.status(401).json({ error: 'Contraseña incorrecta.' });
        }

        // Generación del token
        const token = generateToken(user);

        res.status(200).json({ message: 'Inicio de sesión exitoso.', userId: user.idUsuarios, userName: user.Nombre_completo, token });
    } catch (error) {
        console.error('Error al intentar iniciar sesión:', error);
        res.status(500).json({ error: 'Error al intentar iniciar sesión.' });
    }
};

// Ruta para leer un usuario LOGOUT
exports.logoutUser = async (req, res) => {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token) return res.status(400).json({ message: 'Token no proporcionado' });
  
    try {
      // Agregar el token a la lista negra en la base de datos
      await sequelize.query(`
        INSERT INTO RevokedTokens (token)
        VALUES (:token)
      `, {
        replacements: { token }
      });
  
      res.status(200).json({ message: 'Logout exitoso' });
    } catch (error) {
      console.error('Error al realizar logout:', error);
      res.status(500).json({ message: 'Error en el logout' });
    }
  };