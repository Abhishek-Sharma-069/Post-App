import { useEffect , useState, useCallback } from 'react'
import { useParams, useNavigate, Link } from 'react-router-dom'
import { getPostById, updatePost, deletePost as deletePostApi } from '../api/posts';
import { getCommentsByPostId, createComment as createCommentApi, updateComment as updateCommentApi, deleteComment as deleteCommentApi } from '../api/comments';
import { getPostLikes, togglePostLike, getCommentLikes, toggleCommentLike } from '../api/likes';
import { MdDelete, MdEdit, MdCheck, MdClose, MdFavorite, MdFavoriteBorder } from 'react-icons/md'
import CommentItem from '../components/CommentItem';
import Loading from '../components/Loading';
import useAuthCheck from '../hooks/useAuthCheck';

const Post = () => {
    let { id } = useParams()
    const [post, setPost] = useState(null)
    const [comments, setComments] = useState([])
    const [loading, setLoading] = useState(true)
    const [currentUser, setCurrentUser] = useState(null)
    const [editPostMode, setEditPostMode] = useState(false)
    const [editPostTitle, setEditPostTitle] = useState("")
    const [editPostText, setEditPostText] = useState("")
    const [editCommentId, setEditCommentId] = useState(null)
    const [editCommentText, setEditCommentText] = useState("")
    const [postLike, setPostLike] = useState({ count: 0, liked: false })
    const [commentLikes, setCommentLikes] = useState({})
    const navigate = useNavigate();
    const { user: authUser } = useAuthCheck();

    useEffect(() => {
        setCurrentUser(authUser);
    }, [authUser]);

    useEffect(() => {
        // Auth check remains via useAuthCheck in parent, or you can import checkAuth if needed

        const fetchPost = async () => {
            try {
                const res = await getPostById(id);
                setPost(res.data.post);
            } catch (error) {
                console.error('Error fetching post:', error);
            } finally {
                setLoading(false);
            }
        };
        const fetchComments = async () => {
            try {
                const res = await getCommentsByPostId(id);
                const data = res.data;
                if (Array.isArray(data)) {
                    setComments(data);
                } else if (Array.isArray(data.comments)) {
                    setComments(data.comments);
                } else {
                    setComments([]);
                }
            } catch (error) {
                console.error('Error fetching comments:', error);
            }
        };
        const fetchPostLike = async () => {
            try {
                const res = await getPostLikes(id);
                setPostLike(res.data);
            } catch (error) {
                setPostLike({ count: 0, liked: false });
            }
        };
        const fetchCommentLikes = async (commentsList) => {
            const likesObj = {};
            await Promise.all(
                commentsList.map(async (comment) => {
                    try {
                        const res = await getCommentLikes(comment.id);
                        likesObj[comment.id] = res.data;
                    } catch {
                        likesObj[comment.id] = { count: 0, liked: false };
                    }
                })
            );
            setCommentLikes(likesObj);
        };
        fetchPost();
        fetchComments().then(() => {
            fetchPostLike();
        });
    }, [id])

    useEffect(() => {
        // Fetch comment likes whenever comments change
        if (comments.length > 0) {
            (async () => {
                const likesObj = {};
                await Promise.all(
                    comments.map(async (comment) => {
                        try {
                            const res = await getCommentLikes(comment.id);
                            likesObj[comment.id] = res.data;
                        } catch {
                            likesObj[comment.id] = { count: 0, liked: false };
                        }
                    })
                );
                setCommentLikes(likesObj);
            })();
        }
    }, [comments]);

    const [newComment, setNewComment] = useState("");
    const [commentLoading, setCommentLoading] = useState(false);

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!newComment.trim()) return;
        setCommentLoading(true);
        try {
            const res = await createCommentApi(newComment, Number(id));
            if (res.status !== 200) {
                throw new Error(res.data?.error || "Failed to create comment");
            }
            setNewComment("");
            const commentsRes = await getCommentsByPostId(id);
            setComments(commentsRes.data);
        } catch (error) {
            alert("Error posting comment: " + (error.message || error));
            console.error("Error posting comment:", error);
        } finally {
            setCommentLoading(false);
        }
    };

    // Like/unlike post
    const handleTogglePostLike = async () => {
        try {
            const res = await togglePostLike(id);
            setPostLike((prev) => ({
                count: prev.count + (res.data.liked ? 1 : -1),
                liked: res.data.liked
            }));
        } catch (error) {
            alert('Error liking post: ' + (error.response?.data?.error || error.message));
        }
    };

    // Like/unlike comment
    const handleToggleCommentLike = useCallback(async (commentId) => {
        try {
            const res = await toggleCommentLike(commentId);
            setCommentLikes((prev) => ({
                ...prev,
                [commentId]: {
                    count: prev[commentId].count + (res.data.liked ? 1 : -1),
                    liked: res.data.liked
                }
            }));
        } catch (error) {
            alert('Error liking comment: ' + (error.response?.data?.error || error.message));
        }
    }, []);

    // Delete post
    const handleDeletePost = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await deletePostApi(id);
            navigate('/');
        } catch (error) {
            alert('Error deleting post: ' + (error.response?.data?.error || error.message));
        }
    };

    // Edit post
    const handleEditPost = () => {
        setEditPostMode(true);
        setEditPostTitle(post.title);
        setEditPostText(post.postText);
    };
    const handleCancelEditPost = () => {
        setEditPostMode(false);
    };
    const handleSaveEditPost = async () => {
        try {
            const res = await updatePost(id, {
                title: editPostTitle,
                postText: editPostText
            });
            setPost(res.data.post);
            setEditPostMode(false);
        } catch (error) {
            alert('Error updating post: ' + (error.response?.data?.error || error.message));
        }
    };

    // Delete comment
    const handleDeleteComment = useCallback(async (commentId) => {
        try {
            await deleteCommentApi(commentId);
            const commentsRes = await getCommentsByPostId(id);
            setComments(commentsRes.data);
        } catch (error) {
            alert('Error deleting comment: ' + (error.response?.data?.error || error.message));
        }
    }, [id]);

    // Edit comment
    const handleEditComment = useCallback((commentId, commentBody) => {
        setEditCommentId(commentId);
        setEditCommentText(commentBody);
    }, []);
    const handleCancelEditComment = () => {
        setEditCommentId(null);
        setEditCommentText("");
    };
    const handleSaveEditComment = async (commentId) => {
        try {
            await updateCommentApi(commentId, editCommentText);
            const commentsRes = await getCommentsByPostId(id);
            setComments(commentsRes.data);
            setEditCommentId(null);
            setEditCommentText("");
        } catch (error) {
            alert('Error updating comment: ' + (error.response?.data?.error || error.message));
        }
    };

    if (loading || !post) {
        return <Loading />
    }

    return (
        <div className="container mx-auto px-2 py-4 md:px-4 md:py-8">
            <div className="flex flex-col md:flex-row gap-4 md:gap-8">
                {/* Left column - Post content */}
                <div className="w-full md:flex-1 mb-4 md:mb-0">
                    <div className="bg-amber-300 rounded-lg shadow-md p-4 md:p-6">
                        <div className="mb-4 flex flex-col md:flex-row justify-between items-start md:items-center gap-2">
                            <Link to={`/profile/${post.username}`} className="text-sm text-amber-600 hover:underline">{post.username}</Link>
                            {currentUser && post.username === currentUser.username && (
                                <div className="flex gap-2 mt-2 md:mt-0">
                                    {editPostMode ? (
                                        <>
                                            <button
                                                onClick={handleSaveEditPost}
                                                className="text-green-600 hover:text-green-800 p-1 rounded-full bg-white shadow"
                                                title="Save Post"
                                                aria-label="Save Post"
                                            >
                                                <MdCheck size={22} />
                                            </button>
                                            <button
                                                onClick={handleCancelEditPost}
                                                className="text-gray-600 hover:text-gray-800 p-1 rounded-full bg-white shadow"
                                                title="Cancel Edit"
                                                aria-label="Cancel Edit"
                                            >
                                                <MdClose size={22} />
                                            </button>
                                        </>
                                    ) : (
                                        <>
                                            <button
                                                onClick={handleEditPost}
                                                className="text-blue-600 hover:text-blue-800 p-1 rounded-full bg-white shadow"
                                                title="Edit Post"
                                                aria-label="Edit Post"
                                            >
                                                <MdEdit size={22} />
                                            </button>
                                            <button
                                                onClick={handleDeletePost}
                                                className="text-red-600 hover:text-red-800 p-1 rounded-full bg-white shadow"
                                                title="Delete Post"
                                                aria-label="Delete Post"
                                            >
                                                <MdDelete size={22} />
                                            </button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4 gap-2">
                            {editPostMode ? (
                                <input
                                    type="text"
                                    value={editPostTitle}
                                    onChange={e => setEditPostTitle(e.target.value)}
                                    className="text-2xl font-bold w-full mb-2 px-2 py-1 rounded border"
                                />
                            ) : (
                                <h2 className="text-2xl font-bold break-words w-full">{post.title}</h2>
                            )}
                            <span className="text-sm text-gray-600 whitespace-nowrap">
                                {new Date(post.createdAt).toLocaleString("en-US", {
                                    year: "numeric",
                                    month: "2-digit",
                                    day: "2-digit",
                                    hour: "2-digit",
                                    minute: "2-digit",
                                })}
                            </span>
                        </div>
                        {editPostMode ? (
                            <textarea
                                value={editPostText}
                                onChange={e => setEditPostText(e.target.value)}
                                className="w-full mb-4 px-2 py-1 rounded border"
                                rows={3}
                            />
                        ) : (
                            <p className="text-lg mb-4 break-words">{post.postText}</p>
                        )}
                        {post.imageUrl && (
                            <div className="mt-4">
                                <img
                                    src={`${import.meta.env.VITE_BACKEND_URL}${post.imageUrl}`}
                                    alt="Post image"
                                    className="max-w-full rounded-lg shadow-md"
                                />
                            </div>
                        )}
                        <div className="flex items-center mt-4 text-gray-600 text-sm">
                            <button
                                onClick={handleTogglePostLike}
                                className="flex items-center"
                                title={postLike.liked ? "Unlike Post" : "Like Post"}
                                aria-label={postLike.liked ? "Unlike Post" : "Like Post"}
                            >
                                {postLike.liked ? <MdFavorite size={20} className="text-red-500" /> : <MdFavoriteBorder size={20} />}
                                <span>{postLike.count}</span>
                            </button>
                        </div>
                    </div>
                </div>

                {/* Right column - Comments section */}
                <div className="w-full md:w-1/3 min-w-0 md:min-w-[300px]">
                    <div className="bg-white rounded-lg shadow-md p-4 md:p-6 mt-4 md:mt-0">
                        <h3 className="text-xl font-semibold mb-4">Comments</h3>
                        {/* Comment input form */}
                        <form onSubmit={handleCommentSubmit} className="mb-6">
                            <div className="flex flex-col gap-2">
                                <input
                                    type="text"
                                    placeholder="Add a comment..."
                                    autoComplete="off"
                                    value={newComment}
                                    onChange={e => setNewComment(e.target.value)}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-500 focus:border-transparent"
                                    disabled={commentLoading}
                                />
                                <button 
                                    type="submit" 
                                    className="bg-amber-500 hover:bg-amber-600 text-white px-6 py-2 rounded-lg font-semibold transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                                    disabled={commentLoading}
                                >
                                    {commentLoading ? "Posting..." : "Comment"}
                                </button>
                            </div>
                        </form>
                        {/* Comments list */}
                        <div className="space-y-4 max-h-[50vh] md:max-h-[calc(100vh-300px)] overflow-y-auto hide-scrollbar">
                            {comments.length === 0 ? (
                                <div className="text-gray-500 text-center py-4">No comments yet. Be the first to comment!</div>
                            ) : (
                                comments.map((comment, key) => (
                                    <div key={key}>
                                        <CommentItem 
                                            comment={comment}
                                            currentUser={currentUser}
                                            onEdit={(commentId, text) => handleEditComment(commentId, text)}
                                            onDelete={handleDeleteComment}
                                        />
                                        {editCommentId === comment.id && (
                                            <div className="flex gap-2 mt-2">
                                                <input
                                                    type="text"
                                                    value={editCommentText}
                                                    onChange={e => setEditCommentText(e.target.value)}
                                                    className="w-full px-2 py-1 rounded border"
                                                    placeholder="Edit comment"
                                                />
                                                <button onClick={() => handleSaveEditComment(comment.id)} className="text-green-600" title="Save"><MdCheck size={20} /></button>
                                                <button onClick={handleCancelEditComment} className="text-gray-500" title="Cancel"><MdClose size={20} /></button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Post
