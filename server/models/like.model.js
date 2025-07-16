// =====================================
// Like Model - Defines the Like table structure in the database
// =====================================

module.exports = (sequelize, DataTypes) => {
  // Define the Like model with its fields
  const Like = sequelize.define('Like', {
    // ID of the user who liked
    userId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // ID of the post (nullable if like is for a comment)
    postId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    // ID of the comment (nullable if like is for a post)
    commentId: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
  });

  return Like;
};