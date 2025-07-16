import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getPostsByUsername, updatePost, deletePost } from '../api/posts';
import { checkAuth } from '../api/auth';
import { MdPerson, MdCheck, MdClose } from 'react-icons/md';
import PostCard from '../components/PostCard';
import Loading from '../components/Loading';
import useAuthCheck from '../hooks/useAuthCheck';

const Profile = () => {
  const { username: paramUsername } = useParams();
  const [username, setUsername] = useState('');
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const [editPostId, setEditPostId] = useState(null);
  const [editPostTitle, setEditPostTitle] = useState('');
  const [editPostText, setEditPostText] = useState('');
  const limit = 10;
  const loaderRef = useRef(null);
  const navigate = useNavigate();
  const { user: currentUser } = useAuthCheck();

  useEffect(() => {
    const fetchProfile = async () => {
      setLoading(true);
      try {
        let userToShow = paramUsername;
        if (typeof userToShow !== 'string' || userToShow.trim() === '') {
          // Get current user from backend
          const res = await checkAuth();
          userToShow = res.data.user.username;
        }
        setUsername(userToShow);
        // Fetch posts by username
        const postsRes = await getPostsByUsername(userToShow, 1, limit);
        setPosts(postsRes.data.listOfPosts || []);
        setHasMore((postsRes.data.listOfPosts || []).length === limit);
        setPage(1);
      } catch (error) {
        setPosts([]);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
    // eslint-disable-next-line
  }, [paramUsername]);

  // Infinite scroll: fetch more when loaderRef is visible
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !fetchingMore) {
          setFetchingMore(true);
          (async () => {
            let userToShow = paramUsername;
            if (typeof userToShow !== 'string' || userToShow.trim() === '') {
              const res = await checkAuth();
              userToShow = res.data.user.username;
            }
            const postsRes = await getPostsByUsername(userToShow, page + 1, limit);
            const newPosts = postsRes.data.listOfPosts || [];
            setPosts((prev) => [...prev, ...newPosts]);
            setPage((prev) => prev + 1);
            setHasMore(newPosts.length === limit);
            setFetchingMore(false);
          })();
        }
      },
      { threshold: 1 }
    );
    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }
    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
    // eslint-disable-next-line
  }, [hasMore, loading, fetchingMore, page, paramUsername]);

  const handleEditPost = (post) => {
    setEditPostId(post.id);
    setEditPostTitle(post.title);
    setEditPostText(post.postText);
  };
  const handleCancelEditPost = () => {
    setEditPostId(null);
    setEditPostTitle('');
    setEditPostText('');
  };
  const handleSaveEditPost = async (postId) => {
    try {
      const res = await updatePost(postId, {
        title: editPostTitle,
        postText: editPostText
      });
      setPosts((prev) => prev.map((p) => p.id === postId ? res.data.post : p));
      setEditPostId(null);
      setEditPostTitle('');
      setEditPostText('');
    } catch (error) {
      alert('Error updating post: ' + (error.response?.data?.error || error.message));
    }
  };
  const handleDeletePost = async (postId) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      await deletePost(postId);
      setPosts((prev) => prev.filter((p) => p.id !== postId));
    } catch (error) {
      alert('Error deleting post: ' + (error.response?.data?.error || error.message));
    }
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex flex-col items-center mb-8">
        <MdPerson size={60} className="text-amber-500 mb-2" />
        <h2 className="text-2xl font-bold mb-1">{username}</h2>
        <span className="text-gray-500">Profile</span>
      </div>
      <div>
        <h3 className="text-xl font-semibold mb-4">Posts by {username}</h3>
        {posts.length === 0 ? (
          <div className="text-gray-500">No posts yet.</div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {posts.map((post) => (
                <PostCard
                  key={post.id}
                  post={post}
                  onClick={() => navigate(`/post/${post.id}`)}
                  currentUser={currentUser}
                  onEdit={handleEditPost}
                  onDelete={handleDeletePost}
                >
                  {editPostId === post.id ? (
                    <div className="flex flex-col gap-2 mt-2">
                      <input
                        type="text"
                        value={editPostTitle}
                        onChange={e => setEditPostTitle(e.target.value)}
                        className="text-lg font-semibold px-2 py-1 rounded border"
                        placeholder="Title"
                      />
                      <textarea
                        value={editPostText}
                        onChange={e => setEditPostText(e.target.value)}
                        className="w-full px-2 py-1 rounded border"
                        rows={3}
                        placeholder="Post text"
                      />
                      <div className="flex gap-2 mt-1">
                        <button onClick={() => handleSaveEditPost(post.id)} className="text-green-600" title="Save"><MdCheck size={20} /></button>
                        <button onClick={handleCancelEditPost} className="text-gray-500" title="Cancel"><MdClose size={20} /></button>
                      </div>
                    </div>
                  ) : null}
                </PostCard>
              ))}
            </div>
            <div ref={loaderRef} className="flex justify-center mt-6 min-h-[40px]">
              {fetchingMore && hasMore && <Loading message="Loading more..." />}
              {!hasMore && <span className="text-gray-400">No more posts.</span>}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Profile;
