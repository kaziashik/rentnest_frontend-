import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/blogPosts";

export function BlogPreviewSection() {
  const posts = blogPosts.slice(0, 3);

  return (
    <section className="section-pad">
      <div className="container-page">
        <div className="mb-10 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="mb-2 text-sm font-semibold tracking-wide text-primary uppercase">
              From the blog
            </p>
            <h2 className="font-display text-3xl font-semibold tracking-tight">
              Rental tips & market insights
            </h2>
          </div>
          <Link href="/blog" className="text-sm font-medium text-primary hover:underline">
            Read all articles →
          </Link>
        </div>

        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {posts.map((post) => (
            <Link
              key={post.slug}
              href={`/blog/${post.slug}`}
              className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-0.5 hover:shadow-md"
            >
              <div className="relative h-44 w-full overflow-hidden">
                <Image
                  src={post.image}
                  alt={post.title}
                  fill
                  sizes="(max-width: 768px) 100vw, 33vw"
                  className="object-cover transition duration-500 group-hover:scale-105"
                />
              </div>
              <div className="flex flex-1 flex-col p-5">
                <p className="text-xs font-medium tracking-wide text-primary uppercase">
                  {post.category} · {post.date}
                </p>
                <h3 className="mt-2 text-lg font-semibold group-hover:text-primary">
                  {post.title}
                </h3>
                <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
                  {post.excerpt}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
