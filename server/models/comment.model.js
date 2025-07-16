// =====================================
// Comment Model - Defines the Comment table structure in the database
// =====================================

module.exports = (sequelize, DataTypes) => {
  // Define the Comment model with its fields
  const Comment = sequelize.define('Comment', {
    // Content/body of the comment
    commentBody: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Username of the comment creator
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Foreign key to Post
    PostId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
  });

  // Association
  Comment.associate = (models) => {
    Comment.belongsTo(models.Post, { foreignKey: 'PostId', onDelete: 'CASCADE' });
  };

  return Comment;
};