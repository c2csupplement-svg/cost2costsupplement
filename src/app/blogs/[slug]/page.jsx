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

const PLACEHOLDER_IMAGE = "/placeholder-blog.svg";

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
    return PLACEHOLDER_IMAGE;
  }

  if (typeof image === "string") {
    return image.trim() || PLACEHOLDER_IMAGE;
  }

  if (typeof image === "object") {
    return (
      image?.url ||
      image?.src ||
      image?.image ||
      image?.imageUrl ||
      PLACEHOLDER_IMAGE
    );
  }

  return PLACEHOLDER_IMAGE;
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
    .replace(/text-align\s*:\s*[^;"]+;?/gi, "")

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

        const response = await getBlogBySlug(slug);

        if (!mounted) {
          return;
        }

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
          title: blog?.title || "Blog Article",
          text: blog?.excerpt || "",
          url,
        });

        return;
      }

      await navigator.clipboard.writeText(url);

      setCopied(true);

      setTimeout(() => {
        setCopied(false);
      }, 2000);
    } catch (err) {
      if (err?.name !== "AbortError") {
        console.error("Share error:", err);
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
      console.error("Copy error:", err);
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-background">
        <div className="mx-auto max-w-[1200px] px-4 pb-16 pt-6 sm:px-8 sm:pt-10 lg:px-10">
          <div className="h-4 w-24 animate-pulse rounded-full bg-secondary sm:w-28" />

          <div className="mt-6 h-5 w-28 animate-pulse rounded-full bg-secondary sm:mt-8 sm:w-32" />

          <div className="mt-4 h-10 w-full animate-pulse rounded-lg bg-secondary sm:mt-5 sm:h-16 lg:h-24" />

          <div className="mt-4 h-5 w-3/4 animate-pulse rounded-lg bg-secondary sm:mt-5" />

          <div className="mt-8 aspect-[4/3] animate-pulse rounded-2xl bg-secondary sm:mt-10 sm:aspect-[16/8] sm:rounded-3xl" />

          <div className="mx-auto mt-8 max-w-3xl space-y-4 sm:mt-10">
            <div className="h-4 animate-pulse rounded bg-secondary" />
            <div className="h-4 animate-pulse rounded bg-secondary" />
            <div className="h-4 w-5/6 animate-pulse rounded bg-secondary" />
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
            {error || "This article does not exist."}
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
    blog?.title || "Untitled Article";

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
      {/* HERO */}
      <section className="relative border-b border-border bg-card/40">
        <div className="pointer-events-none absolute inset-0">
          <div className="absolute -right-24 -top-24 h-64 w-64 rounded-full bg-primary/10 blur-[90px] sm:-right-32 sm:-top-32 sm:h-96 sm:w-96 sm:blur-[120px]" />
          <div className="absolute -left-24 bottom-0 h-56 w-56 rounded-full bg-primary/5 blur-[80px] sm:-left-32 sm:h-72 sm:w-72 sm:blur-[110px]" />
        </div>

        <div className="relative mx-auto max-w-[1440px] px-4 sm:px-8 lg:px-10">
          {/* Breadcrumb */}
          <div className="flex items-center gap-1.5 overflow-x-auto whitespace-nowrap border-b border-border py-3.5 font-oxanium text-[10px] font-semibold uppercase tracking-[0.1em] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-2 sm:py-4 sm:text-xs sm:tracking-[0.12em]">
            <Link
              href="/"
              className="shrink-0 text-text-muted transition hover:text-primary"
            >
              Home
            </Link>

            <span className="shrink-0 text-border">/</span>

            <Link
              href="/blogs"
              className="shrink-0 text-text-muted transition hover:text-primary"
            >
              Blogs
            </Link>

            <span className="shrink-0 text-border">/</span>

            <span className="min-w-0 max-w-[140px] truncate text-text-secondary sm:max-w-[420px]">
              {title}
            </span>
          </div>

          <div className="mx-auto max-w-[1120px] pb-8 pt-6 sm:pb-14 sm:pt-12 lg:pb-16 lg:pt-16">
            <Link
              href="/blogs"
              className="group inline-flex items-center gap-2 font-oxanium text-[11px] font-bold uppercase tracking-[0.16em] text-text-secondary transition hover:text-primary"
            >
              <ArrowLeft className="h-4 w-4 transition-transform duration-300 group-hover:-translate-x-1" />
              Back To Articles
            </Link>

            {/* Meta row */}
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
          <Image
            src={image}
            alt={title}
            fill
            priority
            sizes="(max-width: 768px) 100vw, (max-width: 1440px) 90vw, 1440px"
            className="object-cover"
            onError={(event) => {
              if (
                event.currentTarget.src.includes(
                  PLACEHOLDER_IMAGE
                )
              ) {
                return;
              }

              event.currentTarget.src =
                PLACEHOLDER_IMAGE;
            }}
          />

          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />

          <div className="absolute bottom-3 left-3 sm:bottom-4 sm:left-4 lg:bottom-6 lg:left-6">
            <div className="rounded-full border border-white/20 bg-black/30 px-3 py-1.5 backdrop-blur-md sm:px-4 sm:py-2">
              <span className="font-oxanium text-[9px] font-bold uppercase tracking-[0.16em] text-white sm:text-[10px] sm:tracking-[0.2em]">
                Cost2Cost Supplement
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* CONTENT + SIDEBAR */}
      <section className="mx-auto grid max-w-[1200px] gap-10 px-4 py-10 sm:gap-8 sm:px-8 sm:py-14 lg:grid-cols-[minmax(0,1fr)_260px] lg:gap-14 lg:px-10 lg:py-16">
        <div className="min-w-0 order-2 lg:order-1">
          <div className="mb-7 flex items-center gap-3 lg:hidden">
            <div className="h-px flex-1 bg-border" />

            <span className="shrink-0 font-oxanium text-[10px] font-bold uppercase tracking-[0.2em] text-text-muted">
              Article
            </span>

            <div className="h-px flex-1 bg-border" />
          </div>

          <div
            className="
              blog-content
              font-oxanium
              text-[14px]
              leading-7
              text-text-secondary
              sm:text-base
              sm:leading-8
              [&_[style*='background']]:!text-white
              [&_mark]:!text-white
              [&_mark]:!bg-primary

              [&_a]:font-semibold
              [&_a]:text-primary
              [&_a]:underline
              [&_a]:underline-offset-4
              [&_a]:break-words
              [&_blockquote]:my-7
              [&_blockquote]:border-l-4
              [&_blockquote]:border-primary
              [&_blockquote]:bg-primary/[0.04]
              [&_blockquote]:py-4
              [&_blockquote]:pl-4
              [&_blockquote]:pr-4
              [&_blockquote]:font-semibold
              [&_blockquote]:italic
              [&_blockquote]:!text-text-primary
              sm:[&_blockquote]:my-8
              sm:[&_blockquote]:pl-5
              [&_code]:break-words
              [&_code]:rounded
              [&_code]:bg-secondary
              [&_code]:px-1.5
              [&_code]:py-0.5
              [&_code]:!text-primary
              [&_h2]:mb-4
              [&_h2]:mt-10
              [&_h2]:text-balance
              [&_h2]:font-bebas
              [&_h2]:text-[26px]
              [&_h2]:uppercase
              [&_h2]:leading-tight
              [&_h2]:tracking-wide
              [&_h2]:!text-text-primary
              sm:[&_h2]:mt-12
              sm:[&_h2]:text-3xl
              [&_h3]:mb-3
              [&_h3]:mt-8
              [&_h3]:text-balance
              [&_h3]:font-bebas
              [&_h3]:text-xl
              [&_h3]:uppercase
              [&_h3]:leading-tight
              [&_h3]:tracking-wide
              [&_h3]:!text-text-primary
              sm:[&_h3]:mt-9
              sm:[&_h3]:text-2xl
              [&_h4]:mb-3
              [&_h4]:mt-6
              [&_h4]:font-bold
              [&_h4]:!text-text-primary
              sm:[&_h4]:mt-7
              [&_img]:my-7
              [&_img]:h-auto
              [&_img]:w-full
              [&_img]:max-w-full
              [&_img]:rounded-xl
              sm:[&_img]:my-8
              [&_li]:ml-5
              [&_li]:my-1
              [&_li]:list-disc
              [&_ol]:my-6
              [&_ol]:space-y-2
              [&_p]:mb-5
              sm:[&_p]:mb-6
              [&_pre]:my-6
              [&_pre]:overflow-x-auto
              [&_pre]:rounded-xl
              [&_pre]:bg-secondary
              [&_pre]:p-4
              sm:[&_pre]:my-7
              sm:[&_pre]:p-5
              [&_strong]:font-bold
              [&_strong]:!text-text-primary
              [&_table]:my-7
              [&_table]:block
              [&_table]:w-full
              [&_table]:overflow-x-auto
              sm:[&_table]:my-8
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
              [&_ul]:my-6
              [&_ul]:space-y-2
            "
            dangerouslySetInnerHTML={{
              __html: content,
            }}
          />
        </div>

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

                  {copied ? "Copied" : "Copy"}
                </button>
              </div>

              <div className="mt-6 border-t border-border pt-5">
                <Link
                  href="/blogs"
                  className="group flex items-center justify-between font-oxanium text-xs font-bold uppercase tracking-wide text-text-primary transition hover:text-primary"
                >
                  <span>More Articles</span>

                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full border border-border transition group-hover:border-primary">
                    <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </div>
            </div>

            <div className="mt-4 rounded-2xl border border-border bg-primary p-5 sm:p-6 lg:block">
              <p className="font-oxanium text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">
                Cost2Cost
              </p>

              <p className="mt-2 font-bebas text-2xl uppercase leading-none text-white sm:text-3xl">
                Fuel Your Potential
              </p>

              <Link
                href="/products"
                className="group mt-5 inline-flex items-center gap-2 font-oxanium text-[10px] font-bold uppercase tracking-wide text-white"
              >
                Shop Supplements
                <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </Link>
            </div>
          </div>
        </aside>
      </section>

      {/* KEEP READING */}
      <section className="border-t border-border bg-card/40">
        <div className="mx-auto flex max-w-[1200px] flex-col gap-5 px-4 py-8 sm:px-8 sm:py-10 md:flex-row md:items-center md:justify-between lg:px-10">
          <div>
            <p className="font-oxanium text-[10px] font-bold uppercase tracking-[0.2em] text-primary">
              Keep Reading
            </p>

            <h2 className="mt-2 font-bebas text-3xl uppercase leading-none text-text-primary sm:text-4xl">
              Explore More Articles
            </h2>
          </div>

          <Link
            href="/blogs"
            className="group inline-flex w-fit items-center gap-3 rounded-xl border border-border bg-background px-5 py-3 font-oxanium text-xs font-bold uppercase tracking-wide text-text-primary transition hover:border-primary hover:text-primary"
          >
            View All Blogs

            <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </section>
    </main>
  );
}