"use client";

import { useEffect, useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAllBlogs } from "@/redux/features/blogs/blogAction";
import Image from "next/image";
import Link from "next/link";
import {
  ArrowRight,
  ChevronRight,
  Clock,
  Search,
  X,
} from "lucide-react";

export default function BlogsPage() {
  const dispatch = useDispatch();

  const {
    blog,
    loading: isLoading,
    error,
    loaded,
  } = useSelector((state) => state.blog || {});

  const [selectedCategory, setSelectedCategory] = useState("All Articles");
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    if (!loaded && !isLoading) {
      dispatch(getAllBlogs());
    }
  }, [dispatch, loaded, isLoading]);

  const blogsData = blog?.data ?? blog ?? {};

  const posts = useMemo(() => {
    if (Array.isArray(blogsData)) {
      return blogsData;
    }

    if (Array.isArray(blogsData?.blogs)) {
      return blogsData.blogs;
    }

    if (Array.isArray(blogsData?.data)) {
      return blogsData.data;
    }

    return [];
  }, [blogsData]);

  const totalPages = Math.max(
    1,
    Number(blogsData?.totalPages) || 1
  );

  const goToPage = (page) => {
    if (page < 1 || page > totalPages) return;

    setCurrentPage(page);

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  const categories = useMemo(() => {
    const apiCategories = [
      ...new Set(
        posts
          .map((post) => post?.category)
          .filter(Boolean)
      ),
    ];

    return ["All Articles", ...apiCategories];
  }, [posts]);

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory =
        selectedCategory === "All Articles" ||
        post?.category === selectedCategory;

      const query = searchQuery.toLowerCase().trim();

      const matchesSearch =
        !query ||
        (post?.title || "").toLowerCase().includes(query) ||
        (post?.excerpt || "").toLowerCase().includes(query) ||
        (post?.category || "").toLowerCase().includes(query);

      return matchesCategory && matchesSearch;
    });
  }, [posts, selectedCategory, searchQuery]);

  const featuredPost = posts[0];

  if (isLoading && !blog) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-background text-text-primary">
        <div className="text-center">
          <p className="font-oxanium text-sm text-text-secondary">
            Loading articles...
          </p>
        </div>
      </section>
    );
  }

  if (error && !blog) {
    return (
      <section className="flex min-h-screen items-center justify-center bg-background px-5 text-text-primary">
        <div className="text-center">
          <Search className="mx-auto h-8 w-8 text-text-muted" />

          <h1 className="mt-4 font-bebas text-4xl uppercase tracking-wide">
            Unable to load articles
          </h1>

          <p className="mt-2 font-oxanium text-sm text-text-secondary">
            {error}
          </p>

          <button
            type="button"
            onClick={() => dispatch(getAllBlogs())}
            className="mt-5 rounded-md bg-primary px-5 py-2.5 font-oxanium text-sm font-semibold text-white transition hover:bg-primary-hover"
          >
            Try Again
          </button>
        </div>
      </section>
    );
  }

  return (
    <section className="min-h-screen bg-background text-text-primary">
      <div className="border-b border-border">
        <div className="mx-auto max-w-[1440px] px-5 py-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-2 font-oxanium text-xs uppercase tracking-[0.14em]">
            <Link
              href="/"
              className="text-primary transition hover:text-primary-hover"
            >
              Home
            </Link>

            <ChevronRight className="h-3.5 w-3.5 text-text-muted" />

            <span className="text-text-muted">
              Blogs
            </span>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 pb-10 pt-12 sm:px-8 lg:px-10 lg:pb-14 lg:pt-16">
        <div className="max-w-3xl">
          <p className="mb-3 font-oxanium text-xs font-semibold uppercase tracking-[0.22em] text-primary">
            C2C Nutrition Journal
          </p>

          <h1 className="font-bebas text-5xl uppercase leading-[0.95] tracking-wide text-text-primary sm:text-6xl lg:text-7xl">
            Nutrition & Fitness
            <br />
            <span className="text-primary">
              Decoded.
            </span>
          </h1>

          <p className="mt-5 max-w-2xl font-oxanium text-sm leading-7 text-text-secondary sm:text-base">
            Practical guides, supplement education, training insights and
            evidence-informed nutrition advice to help you make better
            decisions for your health and performance.
          </p>
        </div>
      </div>

      {featuredPost && (
        <div className="mx-auto max-w-[1440px] px-5 pb-12 sm:px-8 lg:px-10 lg:pb-16">
          <Link
            href={`/blogs/${featuredPost.slug}`}
            className="group grid overflow-hidden rounded-2xl border border-border bg-card shadow-[0_8px_35px_rgba(0,0,0,0.05)] transition-all duration-300 hover:border-primary/40 lg:grid-cols-2"
          >
            <div className="relative min-h-[300px] overflow-hidden bg-surface sm:min-h-[380px] lg:min-h-[460px]">
              {featuredPost.featuredImage && (
                <Image
                  src={featuredPost.featuredImage}
                  alt={featuredPost.title || "Featured article"}
                  fill
                  sizes="(max-width: 1024px) 100vw, 50vw"
                  className="object-cover transition duration-700 group-hover:scale-105"
                />
              )}

              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent" />

              <div className="absolute left-5 top-5">
                <span className="rounded-full bg-primary px-3 py-1.5 font-oxanium text-[10px] font-bold uppercase tracking-[0.14em] text-white shadow-sm">
                  Featured
                </span>
              </div>
            </div>

            <div className="flex flex-col justify-center p-7 sm:p-10 lg:p-14">
              <div className="flex items-center gap-3 font-oxanium text-xs font-semibold uppercase tracking-[0.14em]">
                <span className="text-primary">
                  {featuredPost.category}
                </span>

                <span className="h-1 w-1 rounded-full bg-text-muted" />

                <span className="text-text-muted">
                  {featuredPost.date}
                </span>
              </div>

              <h2 className="mt-5 font-bebas text-3xl uppercase leading-tight tracking-wide text-text-primary transition group-hover:text-primary sm:text-4xl lg:text-5xl">
                {featuredPost.title}
              </h2>

              <p className="mt-5 font-oxanium text-sm leading-7 text-text-secondary sm:text-base">
                {featuredPost.excerpt}
              </p>

              <div className="mt-8 flex items-center gap-5">
                <span className="flex items-center gap-2 font-oxanium text-xs text-text-muted">
                  <Clock className="h-4 w-4" />
                  {featuredPost.readTime}
                </span>

                <span className="flex items-center gap-2 font-oxanium text-sm font-semibold text-text-primary">
                  Read Article

                  <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      )}

      <div className="border-y border-border bg-surface">
        <div className="mx-auto max-w-[1440px] px-5 py-8 sm:px-8 lg:px-10">
          <div className="flex flex-col gap-5 lg:flex-row lg:items-center lg:justify-between">
            <div className="overflow-x-auto">
              <div className="flex min-w-max gap-2">
                {categories.map((category) => {
                  const active =
                    selectedCategory === category;

                  return (
                    <button
                      key={category}
                      type="button"
                      onClick={() => {
                        setSelectedCategory(category);
                        setCurrentPage(1);
                      }}
                      className={`
                        rounded-full
                        border
                        px-4
                        py-2.5
                        font-oxanium
                        text-xs
                        font-semibold
                        uppercase
                        tracking-wide
                        transition-all
                        ${
                          active
                            ? "border-primary bg-primary text-white shadow-[0_5px_15px_rgba(229,35,35,0.15)]"
                            : "border-border bg-card text-text-secondary hover:border-primary hover:text-primary"
                        }
                      `}
                    >
                      {category}
                    </button>
                  );
                })}
              </div>
            </div>

            <div className="flex h-11 w-full max-w-sm items-center rounded-lg border border-border bg-white px-3 transition focus-within:border-primary focus-within:ring-2 focus-within:ring-primary/10">
              <Search className="h-4 w-4 shrink-0 text-text-muted" />

              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Search articles..."
                className="h-full w-full bg-transparent px-3 font-oxanium text-sm text-text-primary outline-none placeholder:text-text-muted"
              />

              {searchQuery && (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery("");
                    setCurrentPage(1);
                  }}
                  className="text-text-muted transition hover:text-primary"
                  aria-label="Clear search"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-5 py-12 sm:px-8 lg:px-10 lg:py-16">
        <div className="mb-8 flex items-end justify-between">
          <div>
            <p className="font-oxanium text-xs font-semibold uppercase tracking-[0.2em] text-primary">
              Latest Articles
            </p>

            <h2 className="mt-2 font-bebas text-4xl uppercase tracking-wide text-text-primary sm:text-5xl">
              Explore Our Guides
            </h2>
          </div>

          <p className="hidden font-oxanium text-sm text-text-muted sm:block">
            {filteredPosts.length} articles
          </p>
        </div>

        {posts.length === 0 ? (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-border bg-card text-center shadow-[0_6px_25px_rgba(0,0,0,0.03)]">
            <Search className="h-8 w-8 text-text-muted" />

            <h3 className="mt-4 font-bebas text-3xl uppercase tracking-wide text-text-primary">
              No blogs right now
            </h3>

            <p className="mt-2 font-oxanium text-sm text-text-secondary">
              Check back soon for new articles and guides.
            </p>
          </div>
        ) : filteredPosts.length > 0 ? (
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {filteredPosts.map((post, index) => (
              <BlogCard
                key={post.id || post._id || post.slug || index}
                post={post}
              />
            ))}
          </div>
        ) : (
          <div className="flex min-h-[350px] flex-col items-center justify-center rounded-xl border border-border bg-card text-center shadow-[0_6px_25px_rgba(0,0,0,0.03)]">
            <Search className="h-8 w-8 text-text-muted" />

            <h3 className="mt-4 font-bebas text-3xl uppercase tracking-wide text-text-primary">
              No articles found
            </h3>

            <p className="mt-2 font-oxanium text-sm text-text-secondary">
              Try another search term or category.
            </p>

            <button
              type="button"
              onClick={() => {
                setSearchQuery("");
                setSelectedCategory("All Articles");
                setCurrentPage(1);
              }}
              className="mt-5 rounded-md bg-primary px-5 py-2.5 font-oxanium text-sm font-semibold text-white transition hover:bg-primary-hover"
            >
              Clear Filters
            </button>
          </div>
        )}

        {!isLoading &&
          !error &&
          posts.length > 0 &&
          totalPages > 1 && (
            <div className="mt-12 flex flex-wrap items-center justify-center gap-2 border-t border-border pt-8">
              <button
                type="button"
                onClick={() => goToPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="flex h-10 items-center justify-center rounded-md border border-border bg-card px-4 font-oxanium text-sm text-text-secondary transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Previous
              </button>

              {Array.from(
                { length: totalPages },
                (_, index) => index + 1
              ).map((page) => (
                <button
                  key={page}
                  type="button"
                  onClick={() => goToPage(page)}
                  className={`
                    flex
                    h-10
                    w-10
                    items-center
                    justify-center
                    rounded-md
                    border
                    font-oxanium
                    text-sm
                    font-bold
                    transition
                    ${
                      currentPage === page
                        ? "border-primary bg-primary text-white"
                        : "border-border bg-card text-text-secondary hover:border-primary hover:text-primary"
                    }
                  `}
                >
                  {page}
                </button>
              ))}

              <button
                type="button"
                onClick={() => goToPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className="flex h-10 items-center justify-center rounded-md border border-border bg-card px-4 font-oxanium text-sm text-text-secondary transition hover:border-primary hover:text-primary disabled:cursor-not-allowed disabled:opacity-40"
              >
                Next

                <ChevronRight className="ml-1 h-4 w-4" />
              </button>
            </div>
          )}
      </div>
    </section>
  );
}

function BlogCard({ post }) {
  return (
    <Link
      href={`/blogs/${post.slug}`}
      className="group overflow-hidden rounded-xl border border-border bg-card shadow-[0_6px_25px_rgba(0,0,0,0.04)] transition-all duration-300 hover:-translate-y-1 hover:border-primary/50 hover:shadow-[0_12px_35px_rgba(0,0,0,0.08)]"
    >
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        {post.featuredImage && (
          <Image
            src={post.featuredImage}
            alt={post.title || "Blog article"}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className="object-cover transition duration-700 group-hover:scale-105"
          />
        )}

        <div className="absolute left-4 top-4">
          <span className="rounded-full bg-white/95 px-3 py-1.5 font-oxanium text-[10px] font-bold uppercase tracking-[0.12em] text-primary shadow-sm backdrop-blur">
            {post.category}
          </span>
        </div>
      </div>

      <div className="p-5">
        <div className="flex items-center gap-3 font-oxanium text-[11px] text-text-muted">
          <span>{post.date}</span>

          <span className="h-1 w-1 rounded-full bg-border-strong" />

          <span>{post.readTime}</span>
        </div>

        <h3 className="mt-3 line-clamp-2 font-bebas text-2xl uppercase leading-snug tracking-wide text-text-primary transition group-hover:text-primary">
          {post.title}
        </h3>

        <p className="mt-3 line-clamp-3 font-oxanium text-sm leading-6 text-text-secondary">
          {post.excerpt}
        </p>

        <div className="mt-5 flex items-center gap-2 font-oxanium text-xs font-bold uppercase tracking-wide text-text-primary transition group-hover:text-primary">
          Read More

          <ArrowRight className="h-4 w-4 text-primary transition-transform group-hover:translate-x-1" />
        </div>
      </div>
    </Link>
  );
}