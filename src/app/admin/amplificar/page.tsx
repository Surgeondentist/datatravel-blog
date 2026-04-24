import { client } from "@/sanity/lib/client";
import { postsQuery } from "@/sanity/lib/queries";
import AmplificarPanel from "./AmplificarPanel";
import NewsletterBroadcastForm from "./NewsletterBroadcastForm";

type Post = { _id: string; title: string; slug: { current: string } };

export const dynamic = "force-dynamic";

export default async function AmplificarPage() {
  const posts: Post[] = await client.fetch(postsQuery);
  return (
    <div className="space-y-12">
      <AmplificarPanel posts={posts} />
      <NewsletterBroadcastForm />
    </div>
  );
}
