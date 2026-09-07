"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  ArrowRight,
  Calendar,
  Clock,
  Share2,
  Copy,
  Check,
} from "lucide-react";

import { getBlogBySlug } from "@/apiService/api";

function getBlogData(response) {
  if (!response) {
    return null;
  }

  if (response?.data?.blog) {
    return response.data.blog;
  }

  if (response?.data?.data) {
    return response.data.data;
  }

  if (response?.blog) {
    return response.blog;
  }

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
  if (!image) {
    return "";
  }

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
  if (!dateValue) {
    return "";
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return "";
  }

  return date.toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function sanitizeBlogHtml(html) {
  if (!html || typeof html !== "string") {
    return html;
  }

  return html
    .replace(
      /text-align\s*:\s*[^;"]+;?/gi,
      ""
    )
    .replace(/\salign="[^"]*"/gi, "")
    .replace(/\sstyle="\s*"/gi, "");
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

        const response =
          await getBlogBySlug(slug);

        if (!mounted) {
          return;
        }

        const blogData =
          getBlogData(response);

        if (!blogData) {
          setBlog(null);
          setError(
            "Blog article not found."
          );
          return;
        }

        setBlog(blogData);
      } catch (err) {
        console.error(
          "Blog API error:",
          err?.response?.data ||
            err?.message ||
            err
        );

        if (!mounted) {
          return;
        }

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

  const handleShare = async () => {
    try {
      const url = window.location.href;

      if (navigator.share) {
        await navigator.share({
          title:
            blog?.title ||
            "Blog Article",
          text:
            blog?.excerpt ||
            "",
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(
        url
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      if (err?.name !== "AbortError") {
        console.error(
          "Share error:",
          err
        );
      }
    }
  };

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(
        window.location.href
      );

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      console.error(
        "Copy error:",
        err
      );
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-[1200px] px-4 pb-16 pt-6 sm:px-8 sm:pt-10 lg:px-10">
          <div className="h-4 w-24 animate-pulse rounded-full bg-secondary sm:w-28" />

          <div className="mt-6 h-5 w-28 animate-pulse rounded-full bg-secondary" />

          <div className="mt-5 h-14 w-full max-w-4xl animate-pulse rounded-xl bg-secondary sm:h-20 lg:h-24" />

          <div className="mt-4 h-5 w-full max-w-2xl animate-pulse rounded-full bg-secondary" />

          <div className="mt-8 aspect-[4/3] w-full animate-pulse rounded-2xl bg-secondary sm:mt-10 sm:aspect-[16/9] sm:rounded-3xl" />

          <div className="mt-8 grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px]">
            <div className="space-y-4">
              <div className="h-5 w-full animate-pulse rounded-full bg-secondary" />
              <div className="h-5 w-full animate-pulse rounded-full bg-secondary" />
              <div className="h-5 w-5/6 animate-pulse rounded-full bg-secondary" />
              <div className="h-5 w-full animate-pulse rounded-full bg-secondary" />
              <div className="h-5 w-4/6 animate-pulse rounded-full bg-secondary" />
            </div>

            <div className="h-64 animate-pulse rounded-2xl bg-secondary" />
          </div>
        </div>
      </main>
    );
  }

  if (error || !blog) {
    return (
      <main className="flex min-h-[70vh] items-center justify-center bg-background px-4 sm:px-5">
        <div className="w-full max-w-lg rounded-3xl border border-border bg-card p-6 text-center sm:p-8 lg:p-12">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 sm:h-16 sm:w-16">
            <ArrowLeft className="h-6 w-6 text-primary sm:h-7 sm:w-7" />
          </div>

          <p className="mt-5 font-oxanium text-[11px] font-bold uppercase tracking-[0.25em] text-primary sm:mt-6 sm:text-xs">
            Article
          </p>

          <h1 className="mt-3 font-bebas text-4xl uppercase leading-none text-text-primary sm:text-5xl">
            Blog Not Found
          </h1>

          <p className="mx-auto mt-4 max-w-md font-oxanium text-sm leading-6 text-text-secondary">
            {error ||
              "This article does not exist."}
          </p>

          <Link
            href="/blogs"
            className="mt-7 inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 font-oxanium text-xs font-bold uppercase tracking-wide text-white transition hover:bg-primary-hover"
          >
            <ArrowLeft className="h-4 w-4" />
            Back To Blogs
          </Link>
        </div>
      </main>
    );
  }

  const title =
    blog?.title ||
    "Untitled Article";

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
    ? String(
        blog.readTime
      ).includes("min")
      ? blog.readTime
      : `${blog.readTime} min read`
    : "";

  const rawContent =
    blog?.content ||
    blog?.body ||
    blog?.article ||
    "";

  const content =
    sanitizeBlogHtml(
      rawContent
    );

  return (
    <main className="min-h-screen overflow-hidden bg-background text-text-primary">
      <section className="relative border-b border-border bg-card/40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-[90px] sm:-right-32 sm:-top-32 sm:h-96 sm:w-96 sm:blur-[120px]" />

          <div className="absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-primary/5 blur-[80px] sm:-left-32 sm:h-72 sm:w-72 sm:blur-[110px]" />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10">
          <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap border-b border-border py-3.5 font-oxanium text-[10px] font-semibold uppercase tracking-[0.16em] text-text-muted">
            <Link
              href="/"
              className="transition hover:text-primary"
            >
              Home
            </Link>

            <span>/</span>

            <Link
              href="/blogs"
              className="transition hover:text-primary"
            >
              Blogs
            </Link>

            <span>/</span>

            <span className="truncate text-text-secondary">
              {title}
            </span>
          </div>

          <div className="pb-8 pt-6 sm:pb-14 sm:pt-12 lg:pb-16 lg:pt-16">
            <Link
              href="/blogs"
              className="group inline-flex items-center gap-2 font-oxanium text-[11px] font-bold uppercase tracking-[0.16em] text-text-secondary transition hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back To Articles
            </Link>

            <div className="mt-6 flex flex-wrap items-center gap-x-3 gap-y-2 sm:mt-10 sm:gap-x-3">
              {category && (
                <span className="rounded-full bg-primary px-3 py-1.5 font-oxanium text-[10px] font-bold uppercase tracking-[0.14em] text-white sm:px-3.5">
                  {category}
                </span>
              )}

              {date && (
                <span className="inline-flex items-center gap-1.5 font-oxanium text-[11px] text-text-muted sm:gap-2 sm:text-xs">
                  <Calendar className="h-3.5 w-3.5 shrink-0" />
                  {date}
                </span>
              )}

              {readTime && (
                <>
                  <span className="hidden h-1 w-1 shrink-0 rounded-full bg-border sm:inline-block" />

                  <span className="inline-flex items-center gap-1.5 font-oxanium text-[11px] text-text-muted sm:gap-2 sm:text-xs">
                    <Clock className="h-3.5 w-3.5 shrink-0" />
                    {readTime}
                  </span>
                </>
              )}
            </div>

            <h1 className="mt-5 max-w-5xl text-balance font-bebas text-[42px] uppercase leading-[0.95] tracking-[0.01em] text-text-primary sm:mt-6 sm:text-6xl md:text-7xl lg:text-[88px] lg:leading-[0.9]">
              {title}
            </h1>

            {excerpt && (
              <p className="mt-5 max-w-3xl text-pretty font-oxanium text-[13px] leading-6 text-text-secondary sm:mt-6 sm:text-base sm:leading-7 lg:text-lg lg:leading-8">
                {excerpt}
              </p>
            )}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 pt-5 sm:px-8 sm:pt-8 lg:px-10 lg:pt-10">
        <div className="relative aspect-[4/3] overflow-hidden rounded-2xl border border-border bg-secondary sm:aspect-[16/9] sm:rounded-3xl lg:aspect-[16/8]">
          {image ? (
            <Image
              src={image}
              alt={title}
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1440px) 90vw, 1440px"
              className="object-cover"
            />
          ) : (
            <div className="flex h-full w-full items-center justify-center">
              <div className="text-center">
                <p className="font-bebas text-3xl uppercase tracking-wide text-text-muted sm:text-4xl">
                  No Image
                </p>

                <p className="mt-1 font-oxanium text-[10px] uppercase tracking-[0.2em] text-text-muted">
                  {title}
                </p>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto max-w-[1440px] px-4 py-8 sm:px-8 sm:py-12 lg:px-10 lg:py-16">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-12">
          <article
            className="
              min-w-0
              font-oxanium
              text-sm
              leading-7
              text-text-secondary

              [&_h1]:mb-5
              [&_h1]:font-bebas
              [&_h1]:text-4xl
              [&_h1]:uppercase
              [&_h1]:leading-none
              [&_h1]:text-text-primary

              [&_h2]:mb-4
              [&_h2]:mt-10
              [&_h2]:font-bebas
              [&_h2]:text-3xl
              [&_h2]:uppercase
              [&_h2]:leading-none
              [&_h2]:text-text-primary

              [&_h3]:mb-3
              [&_h3]:mt-8
              [&_h3]:font-bebas
              [&_h3]:text-2xl
              [&_h3]:uppercase
              [&_h3]:leading-none
              [&_h3]:text-text-primary

              [&_p]:mb-5
              [&_p]:leading-7

              [&_a]:font-semibold
              [&_a]:text-primary
              [&_a]:underline
              [&_a]:underline-offset-2

              [&_strong]:font-bold
              [&_strong]:text-text-primary

              [&_blockquote]:my-7
              [&_blockquote]:border-l-4
              [&_blockquote]:border-primary
              [&_blockquote]:bg-card
              [&_blockquote]:px-5
              [&_blockquote]:py-4
              [&_blockquote]:italic

              [&_img]:my-7
              [&_img]:h-auto
              [&_img]:max-w-full
              [&_img]:rounded-2xl

              [&_ol]:my-6
              [&_ol]:list-decimal
              [&_ol]:space-y-2
              [&_ol]:pl-6

              [&_ul]:my-6
              [&_ul]:list-disc
              [&_ul]:space-y-2
              [&_ul]:pl-6

              [&_li]:leading-7

              [&_table]:my-7
              [&_table]:block
              [&_table]:w-full
              [&_table]:overflow-x-auto

              [&_td]:border
              [&_td]:border-border
              [&_td]:p-2.5
              sm:[&_td]:p-3

              [&_th]:border
              [&_th]:border-border
              [&_th]:bg-secondary
              [&_th]:p-2.5
              [&_th]:font-bold
              [&_th]:!text-text-primary
              sm:[&_th]:p-3

              sm:text-base
              sm:leading-8
            "
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />

          <aside className="order-1 lg:order-2 lg:relative">
            <div className="lg:sticky lg:top-28">
              <div className="rounded-2xl border border-border bg-card p-5 sm:p-6">
                <div className="flex items-center justify-between gap-3">
                  <div className="min-w-0">
                    <p className="font-oxanium text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
                      Article
                    </p>

                    <p className="mt-1 truncate font-oxanium text-sm font-semibold text-text-primary">
                      Share this story
                    </p>
                  </div>

                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-primary/10">
                    <Share2 className="h-4 w-4 text-primary" />
                  </div>
                </div>

                <div className="mt-5 grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={handleShare}
                    className="group flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background font-oxanium text-[10px] font-bold uppercase tracking-wide text-text-secondary transition hover:border-primary hover:text-primary"
                  >
                    <Share2 className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                    Share
                  </button>

                  <button
                    type="button"
                    onClick={handleCopy}
                    className="group flex h-11 items-center justify-center gap-2 rounded-xl border border-border bg-background font-oxanium text-[10px] font-bold uppercase tracking-wide text-text-secondary transition hover:border-primary hover:text-primary"
                  >
                    {copied ? (
                      <Check className="h-4 w-4 shrink-0 text-primary" />
                    ) : (
                      <Copy className="h-4 w-4 shrink-0 transition-transform group-hover:scale-110" />
                    )}

                    {copied
                      ? "Copied"
                      : "Copy"}
                  </button>
                </div>

                <div className="mt-6 border-t border-border pt-5">
                  <Link
                    href="/blogs"
                    className="group flex items-center justify-between font-oxanium text-xs font-bold uppercase tracking-wide text-text-primary transition hover:text-primary"
                  >
                    <span>
                      More Articles
                    </span>

                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border transition group-hover:border-primary">
                      <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </span>
                  </Link>
                </div>
              </div>

              <div className="mt-4 rounded-2xl border border-border bg-primary p-5 sm:p-6">
                <p className="font-oxanium text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                  Cost2Cost
                </p>

                <p className="mt-2 font-bebas text-2xl uppercase leading-none text-white sm:text-3xl">
                  Knowledge
                  That
                  Moves
                </p>

                <p className="mt-3 font-oxanium text-xs leading-5 text-white/80">
                  Explore more
                  articles,
                  insights and
                  useful
                  information.
                </p>

                <Link
                  href="/blogs"
                  className="mt-5 inline-flex items-center gap-2 rounded-lg bg-white px-4 py-2.5 font-oxanium text-[10px] font-bold uppercase tracking-wide text-primary transition hover:bg-white/90"
                >
                  Explore Blogs
                  <ArrowRight className="h-3.5 w-3.5" />
                </Link>
              </div>
            </div>
          </aside>
        </div>
      </section>
    </main>
  );
}