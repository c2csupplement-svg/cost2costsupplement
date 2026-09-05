"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { ArrowUpRight, Clock } from "lucide-react";

import { getAllBlogs } from "@/redux/features/blogs/blogAction";

function BlogCard({ article }) {
  return (
    <Link
      href={article.href}
      className="
        group
        relative
        flex
        h-full
        min-h-[280px]
        flex-col
        overflow-hidden
        rounded-xl
        border
        border-border
        bg-card
        transition-all
        duration-300
        hover:-translate-y-1
        hover:border-primary
      "
    >
      <div className="relative h-[130px] overflow-hidden bg-surface-muted sm:h-auto sm:aspect-[16/9]">
        {article.image ? (
          <img
            src={article.image}
            alt={article.title || "Blog article"}
            className="
              h-full
              w-full
              object-cover
              transition-transform
              duration-500
              group-hover:scale-105
            "
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center bg-surface-muted">
            <span className="text-xs text-text-muted">
              No Image
            </span>
          </div>
        )}

        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />

        {article.category && (
          <span
            className="
              absolute
              left-3
              top-3
              rounded-md
              bg-primary
              px-2
              py-1
              text-[9px]
              font-black
              uppercase
              tracking-wider
              text-white
              sm:left-4
              sm:top-4
            "
          >
            {article.category}
          </span>
        )}

        <div
          className="
            absolute
            bottom-3
            right-3
            flex
            h-8
            w-8
            items-center
            justify-center
            rounded-full
            bg-white
            text-black
            opacity-0
            shadow-md
            transition-opacity
            duration-300
            group-hover:opacity-100
            sm:h-9
            sm:w-9
          "
        >
          <ArrowUpRight className="h-4 w-4" />
        </div>
      </div>

      <div className="flex flex-1 flex-col p-3 sm:p-4">
        <div
          className="
            flex
            items-center
            gap-2
            text-[9px]
            font-bold
            uppercase
            tracking-wider
            text-text-muted
            sm:text-[10px]
          "
        >
          {article.date && <span>{article.date}</span>}

          {article.date && article.readTime && (
            <span className="h-1 w-1 shrink-0 rounded-full bg-primary" />
          )}

          {article.readTime && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {article.readTime}
            </span>
          )}
        </div>

        <h3
          className="
            mt-2
            line-clamp-2
            text-[16px]
            font-black
            leading-[1.2]
            tracking-tight
            text-text-primary
            transition-colors
            duration-300
            group-hover:text-primary
            sm:mt-3
            sm:text-lg
          "
        >
          {article.title}
        </h3>

        {article.description && (
          <p
            className="
              mt-1.5
              line-clamp-2
              text-[12px]
              leading-5
              text-text-muted
              sm:mt-2
              sm:text-sm
            "
          >
            {article.description}
          </p>
        )}

        <div className="mt-auto pt-3 sm:pt-4">
          <div
            className="
              inline-flex
              items-center
              gap-2
              text-[10px]
              font-black
              uppercase
              tracking-wider
              text-text-primary
              transition-colors
              duration-300
              group-hover:text-primary
              sm:text-xs
            "
          >
            <span className="border-b-2 border-primary pb-1">
              Read Article
            </span>

            <ArrowUpRight
              className="
                h-3.5
                w-3.5
                transition-transform
                duration-300
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
              "
            />
          </div>
        </div>
      </div>

      <div
        className="
          absolute
          bottom-0
          left-0
          h-[2px]
          w-0
          bg-primary
          transition-all
          duration-300
          group-hover:w-full
        "
      />
    </Link>
  );
}

export default function BlogSection() {
  const dispatch = useDispatch();

  const {
    blog,
    loading: isLoading,
    error,
    loaded,
  } = useSelector((state) => state.blog || {});

  const sliderRef = useRef(null);
  const animationRef = useRef(null);
  const pausedRef = useRef(false);
  const lastTimeRef = useRef(0);

  useEffect(() => {
    if (!loaded && !isLoading) {
      dispatch(getAllBlogs());
    }
  }, [dispatch, loaded, isLoading]);

  const blogsData = blog?.data ?? blog ?? {};

  const blogs = Array.isArray(blogsData?.blogs)
    ? blogsData.blogs
    : Array.isArray(blogsData)
      ? blogsData
      : Array.isArray(blogsData?.data)
        ? blogsData.data
        : [];

  const articles = blogs.map((blogItem) => ({
    id:
      blogItem.id ||
      blogItem._id ||
      blogItem.slug,

    category:
      blogItem.category ||
      "Nutrition",

    title:
      blogItem.title ||
      "",

    description:
      blogItem.excerpt ||
      "",

    date: blogItem.publishedAt
      ? new Date(
          blogItem.publishedAt
        ).toLocaleDateString("en-US", {
          month: "short",
          day: "numeric",
          year: "numeric",
        })
      : blogItem.date || "",

    readTime: blogItem.readTime
      ? `${blogItem.readTime} min read`
      : "",

    image:
      blogItem.featuredImage ||
      "",

    href:
      `/blogs/${blogItem.slug}`,
  }));

  useEffect(() => {
    const slider = sliderRef.current;

    if (!slider || articles.length === 0) {
      return;
    }

    const speed = 22;

    const animate = (time) => {
      if (!lastTimeRef.current) {
        lastTimeRef.current = time;
      }

      const delta =
        time - lastTimeRef.current;

      lastTimeRef.current = time;

      if (!pausedRef.current) {
        slider.scrollLeft +=
          (delta / 1000) * speed;

        const halfWidth =
          slider.scrollWidth / 2;

        if (
          halfWidth > 0 &&
          slider.scrollLeft >= halfWidth
        ) {
          slider.scrollLeft -= halfWidth;
        }
      }

      animationRef.current =
        requestAnimationFrame(animate);
    };

    animationRef.current =
      requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(
          animationRef.current
        );
      }

      lastTimeRef.current = 0;
    };
  }, [articles.length]);

  const marqueeArticles = [
    ...articles,
    ...articles,
  ];

  return (
    <section
      className="
        relative
        overflow-hidden
        bg-background
        py-6
        sm:py-8
        lg:py-10
      "
    >
      <div
        className="
          pointer-events-none
          absolute
          -right-40
          top-1/2
          h-[350px]
          w-[350px]
          -translate-y-1/2
          rounded-full
          bg-primary/5
          blur-[100px]
        "
      />

      <div className="relative mx-auto max-w-[1440px]">
        <div
          className="
            mb-5
            flex
            items-end
            justify-between
            gap-4
            px-4
            sm:mb-7
            sm:px-6
            lg:px-8
          "
        >
          <div className="min-w-0">
            <div className="mb-2 flex items-center gap-2">
              <span className="h-[2px] w-5 bg-primary sm:w-7" />

              <p
                className="
                  text-[9px]
                  font-black
                  uppercase
                  tracking-[0.18em]
                  text-primary
                  sm:text-[10px]
                "
              >
                Learn. Train. Perform.
              </p>

              <span className="h-[2px] w-5 bg-primary sm:w-7" />
            </div>

            <h2
              className="
                text-3xl
                font-black
                uppercase
                leading-none
                tracking-[-0.03em]
                text-text-primary
                sm:text-4xl
                lg:text-5xl
              "
            >
              Featured Blogs
            </h2>

            <p
              className="
                mt-2
                max-w-xl
                text-[12px]
                leading-5
                text-text-secondary
                sm:mt-3
                sm:text-sm
              "
            >
              Expert-backed guides, supplement
              education and practical tips to
              help you get more from your
              training and nutrition.
            </p>
          </div>

          <Link
            href="/blogs"
            className="
              group
              hidden
              shrink-0
              items-center
              gap-2
              text-xs
              font-black
              uppercase
              tracking-wide
              text-text-primary
              sm:flex
            "
          >
            <span className="border-b-2 border-primary pb-1">
              View All
            </span>

            <ArrowUpRight
              className="
                h-4
                w-4
                text-primary
                transition-transform
                duration-300
                group-hover:-translate-y-0.5
                group-hover:translate-x-0.5
              "
            />
          </Link>
        </div>

        {isLoading && (
          <div
            className="
              flex
              gap-3
              overflow-hidden
              px-4
              pb-2
              sm:gap-4
              sm:px-6
              lg:px-8
            "
          >
            {[1, 2, 3].map((item) => (
              <div
                key={item}
                className="
                  h-[280px]
                  w-[245px]
                  min-w-[245px]
                  animate-pulse
                  rounded-xl
                  bg-surface-muted
                  sm:h-[360px]
                  sm:w-[340px]
                  sm:min-w-[340px]
                  lg:w-[380px]
                  lg:min-w-[380px]
                "
              />
            ))}
          </div>
        )}

        {!isLoading &&
          (error || articles.length === 0) && (
            <div className="px-4 sm:px-6 lg:px-8">
              <div className="rounded-xl border border-border bg-card p-6">
                <p className="text-sm text-text-muted">
                  No blogs available right now.
                </p>
              </div>
            </div>
          )}

        {!isLoading &&
          !error &&
          articles.length > 0 && (
            <div className="relative">
              <div
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  left-0
                  z-20
                  w-4
                  bg-gradient-to-r
                  from-background
                  to-transparent
                  sm:w-10
                  lg:w-16
                "
              />

              <div
                className="
                  pointer-events-none
                  absolute
                  inset-y-0
                  right-0
                  z-20
                  w-4
                  bg-gradient-to-l
                  from-background
                  to-transparent
                  sm:w-10
                  lg:w-16
                "
              />

              <div
                ref={sliderRef}
                onMouseEnter={() => {
                  pausedRef.current = true;
                }}
                onMouseLeave={() => {
                  pausedRef.current = false;
                }}
                onTouchStart={() => {
                  pausedRef.current = true;
                }}
                onTouchEnd={() => {
                  pausedRef.current = false;
                }}
                className="
                  flex
                  cursor-grab
                  gap-3
                  overflow-x-auto
                  px-4
                  pb-2
                  active:cursor-grabbing
                  sm:gap-4
                  sm:px-6
                  lg:gap-5
                  lg:px-8
                  [scrollbar-width:none]
                  [-ms-overflow-style:none]
                  [&::-webkit-scrollbar]:hidden
                "
              >
                {marqueeArticles.map(
                  (article, index) => (
                    <div
                      key={`${article.id}-${index}`}
                      className="
                        w-[245px]
                        min-w-[245px]
                        sm:w-[340px]
                        sm:min-w-[340px]
                        lg:w-[380px]
                        lg:min-w-[380px]
                      "
                    >
                      <BlogCard article={article} />
                    </div>
                  )
                )}
              </div>
            </div>
          )}

        <div className="mt-4 px-4 sm:hidden">
          <Link
            href="/blogs"
            className="
              group
              inline-flex
              items-center
              gap-2
              text-xs
              font-black
              uppercase
              tracking-wide
              text-text-primary
            "
          >
            <span className="border-b-2 border-primary pb-1">
              View All Articles
            </span>

            <ArrowUpRight className="h-4 w-4 text-primary" />
          </Link>
        </div>
      </div>
    </section>
  );
}