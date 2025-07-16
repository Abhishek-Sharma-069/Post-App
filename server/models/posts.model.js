// =====================================
// Post Model - Defines the Post table structure in the database
// =====================================

module.exports = (sequelize, DataTypes) => {
  // Define the Post model with its fields
  const Post = sequelize.define('Post', {
    // Title of the post
    title: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Content/body of the post
    postText: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    // Username of the post creator
    username: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    // Optional image URL
    imageUrl: {
      type: DataTypes.STRING,
      allowNull: true,
    },
  });

  // Association
  Post.associate = (models) => {
    Post.hasMany(models.Comment, { foreignKey: 'PostId', onDelete: 'CASCADE' });
  };

  return Post;
};