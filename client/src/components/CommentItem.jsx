import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCommentLikes, toggleCommentLike } from '../api/likes';
import { FaHeart, FaRegHeart } from 'react-icons/fa';
import { MdEdit, MdDelete, MdCheck, MdClose } from 'react-icons/md';

const CommentItem = React.memo(function CommentItem({ comment, currentUser, onEdit, onDelete }) {
  const [likeCount, setLikeCount] = useState(0);
  const [liked, setLiked] = useState(false);
  const [loading, setLoading] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editText, setEditText] = useState(comment.commentBody);

  useEffect(() => {
    let mounted = true;
    async function fetchLikes() {
      try {
        const res = await getCommentLikes(comment.id);
        if (mounted) {
          setLikeCount(res.data.count);
          setLiked(res.data.liked);
        }
      } catch (e) {
        // Optionally handle error
      }
    }
    fetchLikes();
    return () => { mounted = false; };
  }, [comment.id]);

  const handleLike = async () => {
    setLoading(true);
    try {
      const res = await toggleCommentLike(comment.id);
      setLikeCount(res.data.count);
      setLiked(res.data.liked);
    } catch (e) {
      // Optionally handle error
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = () => {
    setEditMode(true);
    setEditText(comment.commentBody);
  };
  const handleCancelEdit = () => {
    setEditMode(false);
    setEditText(comment.commentBody);
  };
  const handleSaveEdit = () => {
    if (onEdit && editText.trim()) {
      onEdit(comment.id, editText);
      setEditMode(false);
    }
  };
  const handleDelete = (e) => {
    e.stopPropagation();
    if (window.confirm('Are you sure you want to delete this comment?')) {
      onDelete && onDelete(comment.id);
    }
  };

  const isAuthor = currentUser && currentUser.username === comment.username;

  return (
    <div className="bg-gray-50 rounded-lg p-4 flex justify-between items-center ">
      <div className="flex-1">
        <Link to={`/profile/${comment.username}`} className="text-xs text-amber-600 hover:underline block mb-1">
          {comment.username}
        </Link>
        {editMode ? (
          <>
            <textarea
              className="w-full text-gray-700 text-sm mb-1 border rounded p-1"
              value={editText}
              onChange={e => setEditText(e.target.value)}
              rows={2}
            />
            <div className="flex gap-2 mt-1">
              <button onClick={handleSaveEdit} className="text-green-600" title="Save"><MdCheck size={18} /></button>
              <button onClick={handleCancelEdit} className="text-gray-500" title="Cancel"><MdClose size={18} /></button>
            </div>
          </>
        ) : (
          <div className="text-gray-700 text-sm mb-1">{comment.commentBody}</div>
        )}
        <div className="text-xs text-gray-400">{new Date(comment.createdAt).toLocaleString()}</div>
      </div>
      <div className="flex flex-col items-center ml-2">
        <button
          onClick={handleLike}
          disabled={loading}
          className="focus:outline-none"
          aria-label={liked ? 'Unlike comment' : 'Like comment'}
        >
          {liked ? (
            <FaHeart className="text-amber-500" size={20} />
          ) : (
            <FaRegHeart className="text-gray-400" size={20} />
          )}
        </button>
        <span className="text-xs text-gray-500 mt-1">{likeCount} {likeCount === 1 ? 'like' : 'likes'}</span>
        {isAuthor && !editMode && (
          <div className="flex gap-2 mt-2">
            <button onClick={handleEdit} className="text-blue-500" title="Edit"><MdEdit size={18} /></button>
            <button type="button" onClick={handleDelete} className="text-red-500" title="Delete"><MdDelete size={18} /></button>
          </div>
        )}
      </div>
    </div>
  );
});

export default CommentItem; 