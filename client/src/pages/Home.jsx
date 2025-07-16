import { useEffect, useState, useRef, useCallback } from "react";
import { useNavigate } from "react-router-dom";

import { getAllPosts } from "../api/posts";
import PostCard from "../components/PostCard";
import Loading from "../components/Loading";

function Home() {
  const [listOfPosts, setListOfPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [fetchingMore, setFetchingMore] = useState(false);
  const limit = 10;
  const loaderRef = useRef(null);
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    getAllPosts(1, limit)
      .then((response) => {
        setListOfPosts(response.data.listOfPosts || []);
        setHasMore((response.data.listOfPosts || []).length === limit);
        setPage(1);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      })
      .finally(() => setLoading(false));
    // eslint-disable-next-line
  }, []);

  // Infinite scroll: fetch more when loaderRef is visible
  useEffect(() => {
    if (!hasMore || loading) return;
    const observer = new window.IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !fetchingMore) {
          setFetchingMore(true);
          getAllPosts(page + 1, limit)
            .then((response) => {
              const newPosts = response.data.listOfPosts || [];
              setListOfPosts((prev) => [...prev, ...newPosts]);
              setPage((prev) => prev + 1);
              setHasMore(newPosts.length === limit);
            })
            .catch((error) => {
              console.error("Error fetching more posts:", error);
            })
            .finally(() => setFetchingMore(false));
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
  }, [hasMore, loading, fetchingMore, page]);

  const handleNavigateToCreate = useCallback(() => navigate("/createpost"), [navigate]);
  const handlePostClick = useCallback((postId) => () => navigate(`/post/${postId}`), [navigate]);

  return (
    <div className="max-h-screen bg-gray-50 px-6 py-4">
      <div className="flex justify-end mb-4">
        <button
          onClick={handleNavigateToCreate}
          className="bg-green-500 text-white px-4 py-2 rounded shadow font-bold"
        >
          + New Post
        </button>
      </div>

      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {listOfPosts.map((post, id) => (
              <PostCard
                key={id}
                post={post}
                onClick={handlePostClick(post.id)}
              />
            ))}
          </div>
          <div ref={loaderRef} className="flex justify-center mt-6 min-h-[40px]">
            {fetchingMore && hasMore && <Loading message="Loading more..." />}
            {!hasMore && <span className="text-gray-400">No more posts.</span>}
          </div>
        </>
      )}
    </div>
  );
}

export default Home;
