"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Calendar,
  Check,
  Clock,
  Copy,
  Share2,
} from "lucide-react";

import { getBlogBySlug } from "@/apiService/api";

function getBlogData(response) {
  if (!response) return null;

  if (response?.data?.blog) return response.data.blog;
  if (response?.data?.data) return response.data.data;
  if (response?.blog) return response.blog;

  if (
    response?.data &&
    typeof response.data === "object" &&
    !Array.isArray(response.data)
  ) {
    return response.data;
  }

  return response;
}

function getImage(image) {
  if (!image) return "";

  if (typeof image === "string") {
    return image.trim();
  }

  if (typeof image === "object") {
    return (
      image?.url ||
      image?.src ||
      image?.image ||
      image?.imageUrl ||
      ""
    );
  }

  return "";
}

function formatDate(dateValue) {
  if (!dateValue) return "";

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) return "";

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function sanitizeBlogHtml(html) {
  if (!html || typeof html !== "string") return html;

  return html
    .replace(/text-align\s*:\s*[^;"]+;?/gi, "")
    .replace(/\salign="[^"]*"/gi, "")
    .replace(/\sstyle="\s*"/gi, "");
}

function LoadingSkeleton() {
  return (
    <main className="min-h-screen bg-background">
      <div className="mx-auto max-w-[1440px] px-4 pb-16 pt-6 sm:px-8 sm:pt-10 lg:px-10">
        <div className="h-3 w-32 animate-pulse rounded-full bg-secondary" />

        <div className="mt-10 max-w-5xl space-y-4">
          <div className="h-5 w-28 animate-pulse rounded-full bg-secondary" />
          <div className="h-14 w-full animate-pulse rounded-xl bg-secondary sm:h-20 lg:h-24" />
          <div className="h-5 w-full max-w-2xl animate-pulse rounded-full bg-secondary" />
        </div>

        <div className="mt-10 aspect-[4/3] w-full animate-pulse rounded-3xl bg-secondary sm:aspect-[16/8]" />

        <div className="mx-auto mt-12 max-w-3xl space-y-4">
          <div className="h-4 animate-pulse rounded-full bg-secondary" />
          <div className="h-4 animate-pulse rounded-full bg-secondary" />
          <div className="h-4 w-5/6 animate-pulse rounded-full bg-secondary" />
          <div className="h-4 animate-pulse rounded-full bg-secondary" />
          <div className="h-4 w-4/6 animate-pulse rounded-full bg-secondary" />
        </div>
      </div>
    </main>
  );
}

function ErrorState({ error }) {
  return (
    <main className="flex min-h-[75vh] items-center justify-center bg-background px-4">
      <div className="relative w-full max-w-xl overflow-hidden rounded-[28px] border border-border bg-card p-8 text-center shadow-2xl sm:p-12">
        <div className="pointer-events-none absolute -right-20 -top-20 h-48 w-48 rounded-full bg-primary/10 blur-3xl" />

        <div className="relative">
          <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl border border-primary/20 bg-primary/10">
            <ArrowLeft className="h-7 w-7 text-primary" />
          </div>

          <p className="mt-7 font-oxanium text-[10px] font-bold uppercase tracking-[0.3em] text-primary">
            Article
          </p>

          <h1 className="mt-3 font-bebas text-5xl uppercase leading-none tracking-wide text-text-primary sm:text-6xl">
            Blog Not Found
          </h1>

          <p className="mx-auto mt-5 max-w-md font-oxanium text-sm leading-7 text-text-secondary">
            {error || "This article does not exist or is no longer available."}
          </p>

          <Link
            href="/blogs"
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3.5 font-oxanium text-xs font-bold uppercase tracking-[0.12em] text-white transition-all duration-300 hover:-translate-y-0.5 hover:bg-primary-hover hover:shadow-lg hover:shadow-primary/20"
          >
            <ArrowLeft className="h-4 w-4" />
            Back To Blogs
          </Link>
        </div>
      </div>
    </main>
  );
}

export default function BlogDetailsPage() {
  const params = useParams();

  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [copied, setCopied] = useState(false);

  const slug = Array.isArray(params?.slug)
    ? params.slug[0]
    : params?.slug;

  useEffect(() => {
    if (!slug) {
      setLoading(false);
      setError("Blog slug is missing.");
      return;
    }

    let mounted = true;

    const fetchBlog = async () => {
      try {
        setLoading(true);
        setError("");

        const response = await getBlogBySlug(slug);

        if (!mounted) return;

        const blogData = getBlogData(response);

        if (!blogData) {
          setBlog(null);
          setError("Blog article not found.");
          return;
        }

        setBlog(blogData);
      } catch (err) {
        console.error(
          "Blog API error:",
          err?.response?.data || err?.message || err
        );

        if (!mounted) return;

        setBlog(null);
        setError(
          err?.response?.data?.message ||
            err?.message ||
            "Unable to load this article."
        );
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchBlog();

    return () => {
      mounted = false;
    };
  }, [slug]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [slug]);

  const copyUrl = async () => {
    try {
      await navigator.clipboard.writeText(window.location.href);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error("Copy error:", err);
    }
  };

  const handleShare = async () => {
    try {
      const url = window.location.href;

      if (navigator.share) {
        await navigator.share({
          title: blog?.title || "Blog Article",
          text: blog?.excerpt || "",
          url,
        });

        return;
      }

      await copyUrl();
    } catch (err) {
      if (err?.name !== "AbortError") {
        console.error("Share error:", err);
      }
    }
  };

  if (loading) {
    return <LoadingSkeleton />;
  }

  if (error || !blog) {
    return <ErrorState error={error} />;
  }

  const title = blog?.title || "Untitled Article";

  const excerpt =
    blog?.excerpt ||
    blog?.description ||
    "";

  const category =
    blog?.category ||
    blog?.categoryName ||
    "Nutrition";

  const image = getImage(
    blog?.featuredImage ||
      blog?.image ||
      blog?.thumbnail ||
      blog?.coverImage
  );

  const date = formatDate(
    blog?.publishedAt ||
      blog?.createdAt ||
      blog?.date
  );

  const readTime = blog?.readTime
    ? String(blog.readTime).includes("min")
      ? blog.readTime
      : `${blog.readTime} min read`
    : "";

  const rawContent =
    blog?.content ||
    blog?.body ||
    blog?.article ||
    "";

  const content = sanitizeBlogHtml(rawContent);

  return (
    <main className="min-h-screen overflow-hidden bg-background text-text-primary">
      <section className="relative border-b border-border">
        <div className="pointer-events-none absolute inset-0 overflow-hidden">
          <div className="absolute -right-40 -top-40 h-[420px] w-[420px] rounded-full bg-primary/10 blur-[120px]" />
          <div className="absolute -left-40 bottom-0 h-[360px] w-[360px] rounded-full bg-primary/5 blur-[110px]" />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-2 overflow-x-auto whitespace-nowrap border-b border-border py-4 font-oxanium text-[10px] font-semibold uppercase tracking-[0.15em] text-text-muted">
            <Link
              href="/"
              className="shrink-0 transition-colors hover:text-primary"
            >
              Home
            </Link>

            <span className="text-border">/</span>

            <Link
              href="/blogs"
              className="shrink-0 transition-colors hover:text-primary"
            >
              Blogs
            </Link>

            <span className="text-border">/</span>

            <span className="truncate text-text-secondary">
              {title}
            </span>
          </div>

          <div className="max-w-[1150px] pb-8 pt-8 sm:pb-7 sm:pt-8 lg:pb-10 lg:pt-8">
            <Link
              href="/blogs"
              className="group inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-4 py-2.5 font-oxanium text-[10px] font-bold uppercase tracking-[0.16em] text-text-secondary backdrop-blur-md transition-all duration-300 hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
            >
              <ArrowLeft className="h-3.5 w-3.5 transition-transform duration-300 group-hover:-translate-x-1" />
              Back To Articles
            </Link>

            <div className="mt-8 flex flex-wrap items-center gap-3 sm:mt-10">
              {category && (
                <span className="rounded-full bg-primary px-4 py-2 font-oxanium text-[10px] font-bold uppercase tracking-[0.16em] text-white shadow-lg shadow-primary/10">
                  {category}
                </span>
              )}

              {date && (
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-2 font-oxanium text-[10px] font-medium text-text-muted backdrop-blur-md">
                  <Calendar className="h-3.5 w-3.5 text-primary" />
                  {date}
                </div>
              )}

              {readTime && (
                <div className="inline-flex items-center gap-2 rounded-full border border-border bg-card/60 px-3.5 py-2 font-oxanium text-[10px] font-medium text-text-muted backdrop-blur-md">
                  <Clock className="h-3.5 w-3.5 text-primary" />
                  {readTime}
                </div>
              )}
            </div>

            <h1 className="mt-7 max-w-6xl text-balance font-bebas text-[44px] uppercase leading-[0.88] tracking-[0.01em] text-text-primary sm:mt-8 sm:text-7xl md:text-8xl lg:text-[104px]">
              {title}
            </h1>

            {excerpt && (
              <p className="mt-7 max-w-3xl text-pretty font-oxanium text-sm leading-7 text-text-secondary sm:text-base sm:leading-8 lg:text-lg">
                {excerpt}
              </p>
            )}

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <button
                type="button"
                onClick={handleShare}
                className="group inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 font-oxanium text-[10px] font-bold uppercase tracking-[0.14em] text-text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
              >
                <Share2 className="h-4 w-4 transition-transform group-hover:scale-110" />
                Share Article
              </button>

              <button
                type="button"
                onClick={copyUrl}
                className="inline-flex items-center gap-2 rounded-xl border border-border bg-card px-4 py-3 font-oxanium text-[10px] font-bold uppercase tracking-[0.14em] text-text-primary transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary"
              >
                {copied ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}

                {copied ? "Copied" : "Copy Link"}
              </button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pt-6 sm:px-8 sm:pt-10 lg:px-10 lg:pt-12">
        <div className="group relative overflow-hidden rounded-[24px] border border-border bg-secondary shadow-2xl shadow-black/10 sm:rounded-[32px]">
          <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-black/25 via-transparent to-transparent opacity-70" />

          {image ? (
            <div className="relative aspect-[4/3] sm:aspect-[16/8]">
              <Image
                src={image}
                alt={title}
                fill
                priority
                sizes="(max-width: 768px) 100vw, 90vw"
                className="object-cover transition-transform duration-700 group-hover:scale-[1.02]"
              />
            </div>
          ) : (
            <div className="flex aspect-[4/3] items-center justify-center sm:aspect-[16/8]">
              <div className="text-center">
                <div className="mx-auto mb-4 h-px w-16 bg-primary/50" />

                <p className="font-bebas text-4xl uppercase tracking-wide text-text-muted sm:text-5xl">
                  No Image
                </p>

                <p className="mt-2 max-w-xs font-oxanium text-[9px] uppercase tracking-[0.2em] text-text-muted">
                  {title}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-10 sm:px-8 sm:py-14 lg:px-10 lg:py-20">
        <div className="grid items-start gap-10 lg:grid-cols-[minmax(0,820px)_1fr] lg:justify-center lg:gap-20">
          <article
            className="
              min-w-0
              font-oxanium
              text-[14px]
              leading-7
              text-text-secondary
              sm:text-base
              sm:leading-8

              [&_h1]:mb-6
              [&_h1]:mt-10
              [&_h1]:font-bebas
              [&_h1]:text-4xl
              [&_h1]:uppercase
              [&_h1]:leading-none
              [&_h1]:tracking-wide
              [&_h1]:text-text-primary
              sm:[&_h1]:text-5xl

              [&_h2]:mb-5
              [&_h2]:mt-12
              [&_h2]:font-bebas
              [&_h2]:text-3xl
              [&_h2]:uppercase
              [&_h2]:leading-none
              [&_h2]:tracking-wide
              [&_h2]:text-text-primary
              sm:[&_h2]:text-4xl

              [&_h3]:mb-4
              [&_h3]:mt-10
              [&_h3]:font-bebas
              [&_h3]:text-2xl
              [&_h3]:uppercase
              [&_h3]:leading-none
              [&_h3]:text-text-primary

              [&_p]:mb-6
              [&_p]:leading-7
              sm:[&_p]:leading-8

              [&_a]:font-semibold
              [&_a]:text-primary
              [&_a]:underline
              [&_a]:underline-offset-4
              [&_a]:decoration-primary/40
              [&_a]:transition-colors
              [&_a]:hover:text-primary-hover

              [&_strong]:font-bold
              [&_strong]:text-text-primary

              [&_em]:text-text-primary

              [&_blockquote]:relative
              [&_blockquote]:my-9
              [&_blockquote]:overflow-hidden
              [&_blockquote]:rounded-2xl
              [&_blockquote]:border
              [&_blockquote]:border-primary/20
              [&_blockquote]:border-l-4
              [&_blockquote]:border-l-primary
              [&_blockquote]:bg-card
              [&_blockquote]:px-6
              [&_blockquote]:py-6
              [&_blockquote]:font-medium
              [&_blockquote]:italic
              [&_blockquote]:text-text-primary
              sm:[&_blockquote]:px-8
              sm:[&_blockquote]:py-7

              [&_img]:my-9
              [&_img]:h-auto
              [&_img]:max-w-full
              [&_img]:rounded-2xl
              [&_img]:border
              [&_img]:border-border

              [&_ol]:my-7
              [&_ol]:list-decimal
              [&_ol]:space-y-3
              [&_ol]:pl-6

              [&_ul]:my-7
              [&_ul]:list-disc
              [&_ul]:space-y-3
              [&_ul]:pl-6

              [&_li]:pl-1
              [&_li]:leading-7
              sm:[&_li]:leading-8

              [&_hr]:my-10
              [&_hr]:border-border

              [&_table]:my-8
              [&_table]:block
              [&_table]:w-full
              [&_table]:overflow-x-auto
              [&_table]:rounded-xl
              [&_table]:border
              [&_table]:border-border

              [&_thead]:bg-secondary

              [&_td]:border
              [&_td]:border-border
              [&_td]:p-3

              [&_th]:border
              [&_th]:border-border
              [&_th]:bg-secondary
              [&_th]:p-3
              [&_th]:font-bold
              [&_th]:text-text-primary
            "
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />

          <aside className="hidden lg:block">
            <div className="sticky top-28">
              <div className="rounded-2xl border border-border bg-card/60 p-5 backdrop-blur-md">
                <p className="font-oxanium text-[9px] font-bold uppercase tracking-[0.25em] text-text-muted">
                  Article Tools
                </p>

                <div className="mt-4 space-y-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-left font-oxanium text-[10px] font-bold uppercase tracking-[0.12em] text-text-primary transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    <Share2 className="h-4 w-4" />
                    Share Article
                  </button>

                  <button
                    type="button"
                    onClick={copyUrl}
                    className="flex w-full items-center gap-3 rounded-xl border border-border px-4 py-3 text-left font-oxanium text-[10px] font-bold uppercase tracking-[0.12em] text-text-primary transition-all hover:border-primary/40 hover:bg-primary/5 hover:text-primary"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}

                    {copied ? "Link Copied" : "Copy Link"}
                  </button>
                </div>
              </div>

              <Link
                href="/blogs"
                className="group mt-4 flex items-center justify-between rounded-2xl border border-border bg-card/40 p-5 transition-all duration-300 hover:border-primary/30 hover:bg-primary/5"
              >
                <div>
                  <p className="font-oxanium text-[9px] font-bold uppercase tracking-[0.2em] text-text-muted">
                    Continue Reading
                  </p>

                  <p className="mt-1 font-bebas text-2xl uppercase text-text-primary">
                    More Articles
                  </p>
                </div>

                <ArrowLeft className="h-5 w-5 rotate-180 text-primary transition-transform duration-300 group-hover:translate-x-1" />
              </Link>
            </div>
          </aside>
        </div>
      </section>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4 px-4 py-6 sm:px-8 lg:px-10">
          <Link
            href="/blogs"
            className="group inline-flex items-center gap-2 font-oxanium text-[10px] font-bold uppercase tracking-[0.15em] text-text-muted transition-colors hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4 transition-transform group-hover:-translate-x-1" />
            All Articles
          </Link>

          <button
            type="button"
            onClick={handleShare}
            className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2.5 font-oxanium text-[10px] font-bold uppercase tracking-[0.12em] text-text-secondary transition-all hover:border-primary/40 hover:text-primary"
          >
            <Share2 className="h-3.5 w-3.5" />
            Share
          </button>
        </div>
      </div>
    </main>
  );
}