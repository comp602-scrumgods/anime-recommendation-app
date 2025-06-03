import { useState } from "react";
import {
  collection,
  doc,
  getDocs,
  setDoc,
  query,
  where,
  Timestamp,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../firebase";

interface Comment {
  id: string;
  animeId: number;
  userEmail: string;
  text: string;
  timestamp: string;
}

const useComments = () => {
  const [comments, setComments] = useState<Comment[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  const parseTimestampString = (timestampStr: string): Date => {
    const regex = /Timestamp\(seconds=(\d+), nanoseconds=(\d+)\)/;
    const match = timestampStr.match(regex);
    if (!match) {
      throw new Error("Invalid timestamp format");
    }
    const seconds = parseInt(match[1], 10);
    const nanoseconds = parseInt(match[2], 10);
    const milliseconds = seconds * 1000 + Math.floor(nanoseconds / 1000000);
    return new Date(milliseconds);
  };

  const fetchComments = async (animeId: number) => {
    setLoading(true);
    try {
      const commentsQuery = query(
        collection(db, "comments"),
        where("animeId", "==", animeId)
      );
      const querySnapshot = await getDocs(commentsQuery);
      const fetchedComments: Comment[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const timestampStr = data.timestamp.toString();
        const timestampDate = parseTimestampString(timestampStr);
        fetchedComments.push({
          id: doc.id,
          animeId: data.animeId,
          userEmail: data.userEmail,
          text: data.text,
          timestamp: timestampDate.toLocaleString("en-US", {
            timeZone: "Pacific/Auckland",
          }),
        });
      });

      fetchedComments.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setComments(fetchedComments);
    } catch (err: any) {
      setError("Failed to fetch comments: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const fetchAllComments = async () => {
    setLoading(true);
    try {
      const commentsQuery = collection(db, "comments");
      const querySnapshot = await getDocs(commentsQuery);
      const fetchedComments: Comment[] = [];
      querySnapshot.forEach((doc) => {
        const data = doc.data();
        const timestampStr = data.timestamp.toString();
        const timestampDate = parseTimestampString(timestampStr);
        fetchedComments.push({
          id: doc.id,
          animeId: data.animeId,
          userEmail: data.userEmail,
          text: data.text,
          timestamp: timestampDate.toLocaleString("en-US", {
            timeZone: "Pacific/Auckland",
          }),
        });
      });

      fetchedComments.sort(
        (a, b) =>
          new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );

      setComments(fetchedComments);
    } catch (err: any) {
      setError("Failed to fetch all comments: " + err.message);
    } finally {
      setLoading(false);
    }
  };

  const addComment = async (
    animeId: number,
    userEmail: string,
    text: string
  ) => {
    setError(null);
    try {
      const commentId = Date.now().toString();
      const commentRef = doc(db, "comments", commentId);
      const newComment: Comment = {
        id: commentId,
        animeId,
        userEmail,
        text,
        timestamp: Timestamp.fromDate(new Date()).toString(),
      };

      await setDoc(commentRef, {
        animeId,
        userEmail,
        text,
        timestamp: Timestamp.fromDate(new Date()),
      });

      const timestampDate = parseTimestampString(newComment.timestamp);
      const updatedComments = [
        {
          ...newComment,
          timestamp: timestampDate.toLocaleString("en-US", {
            timeZone: "Pacific/Auckland",
          }),
        },
        ...comments,
      ];
      setComments(updatedComments);
      return true;
    } catch (err: any) {
      setError("Failed to add comment: " + err.message);
      return false;
    }
  };

  const deleteComment = async (commentId: string, userEmail: string) => {
    setError(null);
    try {
      const comment = comments.find((c) => c.id === commentId);
      if (!comment) {
        throw new Error("Comment not found");
      }
      if (comment.userEmail !== userEmail) {
        throw new Error("You can only delete your own comments");
      }

      const commentRef = doc(db, "comments", commentId);
      await deleteDoc(commentRef);

      const updatedComments = comments.filter((c) => c.id !== commentId);
      setComments(updatedComments);
      return true;
    } catch (err: any) {
      setError("Failed to delete comment: " + err.message);
      return false;
    }
  };

  return {
    comments,
    fetchComments,
    fetchAllComments,
    addComment,
    deleteComment,
    loading,
    error,
  };
};

export default useComments;
