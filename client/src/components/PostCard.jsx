import React, { useEffect, useState } from 'react';
import { MdEdit, MdDelete } from 'react-icons/md';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { getPostLikes, togglePostLike } from '../api/likes';

const PostCard = React.memo(function PostCard({ post, onClick, children, currentUser, onEdit, onDelete }) {
  const isAuthor = currentUser && currentUser.username === post.username;
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [likeLoading, setLikeLoading] = useState(false);

  useEffect(() => {
    let mounted = true;
    async function fetchLikes() {
      try {
        const res = await getPostLikes(post.id);
        if (mounted) {
          setLikeCount(res.data.count);
          setLiked(res.data.liked);
        }
      } catch (e) {
        setLikeCount(0);
        setLiked(false);
      }
    }
    fetchLikes();
    return () => { mounted = false; };
  }, [post.id]);

  const handleEdit = (e) => {
    e.stopPropagation();
    onEdit && onEdit(post);
  };
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this post?')) {
      onDelete && onDelete(post.id);
    }
  };

  const handleLike = async (e) => {
    e.stopPropagation();
    setLikeLoading(true);
    try {
      const res = await togglePostLike(post.id);
      setLikeCount(res.data.count);
      setLiked(res.data.liked);
    } catch (e) {
      // Optionally handle error
    } finally {
      setLikeLoading(false);
    }
  };

  return (
    <div
      className="border p-4 rounded-md bg-amber-300 cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={e => {
        if ((e.key === 'Enter' || e.key === ' ') && onClick) {
          e.preventDefault();
          onClick(e);
        }
      }}
      aria-label={`View post by ${post.username}: ${post.title}`}
    >
      <div className="flex justify-between items-center mb-2">
        <span className="text-sm text-gray-700">{post.username}</span>
        {isAuthor && (
          <div className="flex gap-2">
            <button onClick={handleEdit} className="text-blue-500" title="Edit"><MdEdit size={18} /></button>
            <button onClick={handleDelete} className="text-red-500" title="Delete"><MdDelete size={18} /></button>
          </div>
        )}
      </div>
      <div className="flex justify-between mb-2">
        <h2 className="text-xl font-semibold">{post.title}</h2>
        <span className="text-sm text-gray-600">
          {new Date(post.createdAt).toLocaleString("en-US", {
            year: "numeric",
            month: "2-digit",
            day: "2-digit",
            hour: "2-digit",
            minute: "2-digit",
          })}
        </span>
      </div>
      <p>{post.postText}</p>
      <div className="flex items-center gap-2 mt-2">
        <button
          onClick={handleLike}
          disabled={likeLoading}
          className="focus:outline-none"
          aria-label={liked ? 'Unlike post' : 'Like post'}
        >
          {liked ? (
            <FaHeart className="text-red-500" size={20} />
          ) : (
            <FaRegHeart className="text-gray-400" size={20} />
          )}
        </button>
        <span className="text-xs text-gray-700">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
      </div>
      {children}
    </div>
  );
});

export default PostCard; 