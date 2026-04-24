import { client } from "@/sanity/lib/client";
import { postsQuery } from "@/sanity/lib/queries";
import AmplificarPanel from "./AmplificarPanel";

type Post = { _id: string; title: string; slug: { current: string } };

export const dynamic = "force-dynamic";

export default async function AmplificarPage() {
  const posts: Post[] = await client.fetch(postsQuery);
  return <AmplificarPanel posts={posts} />;
}
