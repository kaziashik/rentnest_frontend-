import Link from "next/link";
import Image from "next/image";
import { blogPosts } from "@/lib/blogPosts";

export default function BlogPage() {
  return (
    <div className="container-page space-y-10 px-4 py-12 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-2xl text-center">
        <p className="mb-2 text-sm font-semibold tracking-wide text-primary uppercase">Blog</p>
        <h1 className="font-display text-3xl font-semibold tracking-tight sm:text-4xl">
          Guides for renters & landlords
        </h1>
        <p className="mt-3 text-muted-foreground">
          Practical advice on finding homes, managing listings, and paying rent securely in Malaysia.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {blogPosts.map((post) => (
          <Link
            key={post.slug}
            href={`/blog/${post.slug}`}
            className="group flex h-full flex-col overflow-hidden rounded-2xl border bg-card transition hover:-translate-y-0.5 hover:shadow-md"
          >
            <div className="relative h-52 w-full">
              <Image
                src={post.image}
                alt={post.title}
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="flex flex-1 flex-col p-6">
              <p className="text-xs font-medium tracking-wide text-primary uppercase">
                {post.category} · {post.readTime}
              </p>
              <h2 className="mt-2 text-xl font-semibold group-hover:text-primary">{post.title}</h2>
              <p className="mt-2 flex-1 text-sm text-muted-foreground">{post.excerpt}</p>
              <p className="mt-4 text-xs text-muted-foreground">
                {post.author} · {post.date}
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
