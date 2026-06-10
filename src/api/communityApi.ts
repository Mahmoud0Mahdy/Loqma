import axiosInstance from "./axiosInstance";

export const getAllPosts = async () => {
  const response = await axiosInstance.get("/Posts");
  return response.data;
};

export const createPost = async (data) => {
  const response = await axiosInstance.post("/Posts", data);
  return response.data;
};

export const getPostById = async (id) => {
  const response = await axiosInstance.get(`/Posts/${id}`);
  return response.data;
};

export const deletePost = async (id: number | string) => {
  const res = await axiosInstance.delete(`/Posts/${id}`);
  return res.data;
};

// ================= ADMIN POSTS =================

export const getAdminPosts = async () => {
  const response = await axiosInstance.get("/Posts/admin");
  return response.data;
};

export const updatePostStatus = async (
  postId: number | string,
  status: "Pending" | "Approved" | "Rejected"
) => {
  const response = await axiosInstance.put(
    `/Posts/${postId}/status`,
    {
      status,
    }
  );

  return response.data;
};

// ================= USER POSTS =================

export const getMyPosts = async () => {
  const response = await axiosInstance.get("/Posts/my-posts");
  return response.data;
};

export const savePost = async (postId) => {
  const response = await axiosInstance.post(`/posts/${postId}/save`);
  return response.data;
};

export const getSavedPosts = async () => {
  const response = await axiosInstance.get("/posts/saved");
  return response.data;
};

export const votePost = async (postId, voteType) => {
  const response = await axiosInstance.post(
    `/posts/${postId}/vote`,
    {
      voteType,
    }
  );

  return response.data;
};

export const getPostComments = async (postId) => {
  const response = await axiosInstance.get(
    `/posts/${postId}/comments`
  );
  return response.data;
};

export const createComment = async (
  postId,
  content
) => {
  const response = await axiosInstance.post(
    `/posts/${postId}/comments`,
    {
      content,
    }
  );

  return response.data;
};

export const deleteComment = async (
  postId,
  commentId
) => {
  await axiosInstance.delete(
    `/posts/${postId}/comments/${commentId}`
  );
};