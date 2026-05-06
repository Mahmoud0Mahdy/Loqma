import { Card } from "../../../components/ui/card";

// استخدمنا any هنا عشان نتفادى أي مشكلة لو نوع Post مش متعرف في AppContext
interface PostStatsProps {
  posts: any[];
}

export function PostStats({ posts }: PostStatsProps) {
  const totalVotes = posts.reduce((acc, post) => acc + (post.votes || 0), 0);
  const totalComments = posts.reduce(
    (acc, post) => acc + (post.commentsCount || 0),
    0,
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <Card className="p-4">
        <p className="text-gray-600 text-sm">Total Posts</p>
        <p className="text-2xl font-semibold">{posts.length}</p>
      </Card>

      <Card className="p-4">
        <p className="text-gray-600 text-sm">Total Votes</p>
        <p className="text-2xl text-red-600 font-semibold">{totalVotes}</p>
      </Card>

      <Card className="p-4">
        <p className="text-gray-600 text-sm">Total Comments</p>
        <p className="text-2xl text-blue-600 font-semibold">{totalComments}</p>
      </Card>
    </div>
  );
}
