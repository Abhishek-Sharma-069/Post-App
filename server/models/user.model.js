// =====================================
// User Model - Defines the User table structure in the database
// =====================================

module.exports = (sequelize, DataTypes) => {
  // Define the User model with its fields
  const User = sequelize.define('User', {
    // Username (must be unique)
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    // Hashed password
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  });

  return User;
};