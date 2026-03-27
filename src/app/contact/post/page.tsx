"use client";

import axios from "axios";
import { useEffect, useState } from "react";
import styles from "./page.module.css";

type Post = {
  userId: number;
  id: number;
  title: string;
  body: string;
};

export default function PostPage() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [selectedPost, setSelectedPost] = useState<Post | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await axios.get<Post[]>("https://jsonplaceholder.typicode.com/posts");
        setPosts(response.data.slice(0, 10));
      } catch {
        setError("Failed to fetch posts");
      } finally {
        setIsLoading(false);
      }
    };

    fetchPosts();
  }, []);

  return (
    <div className={styles.pageContainer}>
      <h1 className={styles.pageTitle}>Posts</h1>
      {isLoading && <p className={styles.statusText}>Loading posts...</p>}
      {error && <p className={styles.errorText}>{error}</p>}
      <table className={styles.postsTable}>
        <thead>
          <tr>
            <th className={styles.tableHeaderCell}>ID</th>
            <th className={styles.tableHeaderCell}>Title</th>
            <th className={styles.tableHeaderCell}>Details</th>
          </tr>
        </thead>
        <tbody>
          {posts.map((post) => (
            <tr key={post.id}>
              <td className={styles.tableCell}>{post.id}</td>
              <td className={styles.tableCell}>{post.title}</td>
              <td className={styles.tableCell}>
                <button
                  type="button"
                  onClick={() => setSelectedPost(post)}
                  className={styles.detailsButton}
                >
                  Show details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {selectedPost && (
        <div onClick={() => setSelectedPost(null)} className={styles.modalBackdrop}>
          <div
            onClick={(event) => event.stopPropagation()}
            className={styles.modalCard}
          >
            <h2 className={styles.modalTitle}>
              Post #{selectedPost.id} | User ID: {selectedPost.userId}
            </h2>
            <hr className={styles.modalDivider} />
            <p className={styles.modalPostTitle}>{selectedPost.title}</p>
            <p className={styles.modalPostBody}>{selectedPost.body}</p>
            <hr className={styles.modalDivider} />
            <button
              type="button"
              onClick={() => setSelectedPost(null)}
              className={styles.closeButton}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
}