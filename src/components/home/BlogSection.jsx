"use client";

import Link from "next/link";
import { useEffect, useRef } from "react";
import { ArrowUpRight, Clock } from "lucide-react";
import { useGetBlogsQuery } from "@/services/productsApi";

function BlogCard({ article }) {
return ( <Link
   href={article.href}
   className="
     group
     relative
     flex
     min-h-[325px]
     h-full
     flex-col
     overflow-hidden
     rounded-2xl
     border
     border-border
     bg-card
     shadow-[0_6px_25px_rgba(0,0,0,0.04)]
     transition-all
     duration-300
     hover:-translate-y-1.5
     hover:border-primary
     hover:shadow-[0_18px_40px_rgba(229,35,35,0.10)]
     sm:min-h-[460px]
   "
 >
{/* IMAGE */} <div className="relative h-[145px] overflow-hidden bg-surface-muted sm:h-auto sm:aspect-[16/9]"> <img
       src={article.image}
       alt={article.title}
       className="
         h-full
         w-full
         object-cover
         transition-all
         duration-700
         group-hover:scale-105
       "
     />

 
    {/* Image overlay */}
    <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent opacity-70" />

    {/* Category */}
    <span
      className="
        absolute
        left-3
        top-3
        rounded-md
        bg-primary
        px-2.5
        py-1.5
        text-[9px]
        font-black
        uppercase
        tracking-[0.16em]
        text-white
        shadow-sm
        sm:left-4
        sm:top-4
        sm:px-3
        sm:text-[10px]
      "
    >
      {article.category}
    </span>

    {/* Image arrow */}
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
        shadow-lg
        transition-all
        duration-300
        group-hover:opacity-100
        sm:bottom-4
        sm:right-4
        sm:h-10
        sm:w-10
      "
    >
      <ArrowUpRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
    </div>
  </div>

  {/* CONTENT */}
  <div className="flex flex-1 flex-col p-4 sm:p-6">
    {/* Meta */}
    <div
      className="
        flex
        items-center
        gap-2
        text-[9px]
        font-bold
        uppercase
        tracking-[0.12em]
        text-text-muted
        sm:gap-3
        sm:text-[10px]
      "
    >
      <span>{article.date}</span>

      <span className="h-1 w-1 rounded-full bg-primary" />

      <span className="flex items-center gap-1">
        <Clock className="h-3 w-3" />
        {article.readTime}
      </span>
    </div>

    {/* Title */}
    <h3
      className="
        mt-3
        line-clamp-2
        text-[17px]
        font-black
        leading-[1.2]
        tracking-tight
        text-text-primary
        transition-colors
        duration-300
        group-hover:text-primary
        sm:mt-4
        sm:text-xl
        sm:leading-[1.15]
      "
    >
      {article.title}
    </h3>

    {/* Description */}
    <p
      className="
        mt-2
        line-clamp-2
        text-[13px]
        leading-5
        text-text-muted
        sm:mt-3
        sm:text-sm
        sm:leading-6
      "
    >
      {article.description}
    </p>

    {/* Read article */}
    <div className="mt-auto pt-4 sm:pt-6">
      <div
        className="
          inline-flex
          items-center
          gap-2
          text-[11px]
          font-black
          uppercase
          tracking-[0.12em]
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
            sm:h-4
            sm:w-4
          "
        />
      </div>
    </div>
  </div>

  {/* Bottom accent */}
  <div className="absolute bottom-0 left-0 h-[3px] w-0 bg-primary transition-all duration-500 group-hover:w-full" />
</Link>
 

);
}

export default function BlogSection() {
const { data, isLoading, isError } = useGetBlogsQuery();

const sliderRef = useRef(null);
const animationRef = useRef(null);
const pausedRef = useRef(false);
const lastTimeRef = useRef(0);

const articles =
data?.blogs?.map((blog) => ({
id: blog.id,
category: blog.category,
title: blog.title,
description: blog.excerpt,
date: new Date(blog.publishedAt).toLocaleDateString("en-US", {
month: "short",
day: "numeric",
year: "numeric",
}),
readTime: `${blog.readTime} min read`,
image: blog.featuredImage,
href: `/blogs/${blog.slug}`,
})) || [];

useEffect(() => {
const slider = sliderRef.current;

 
if (!slider || articles.length === 0) return;

const speed = 28;

const animate = (time) => {
  if (!lastTimeRef.current) {
    lastTimeRef.current = time;
  }

  const delta = time - lastTimeRef.current;
  lastTimeRef.current = time;

  if (!pausedRef.current) {
    slider.scrollLeft += (delta / 1000) * speed;

    const halfWidth = slider.scrollWidth / 2;

    if (slider.scrollLeft >= halfWidth) {
      slider.scrollLeft -= halfWidth;
    }
  }

  animationRef.current = requestAnimationFrame(animate);
};

animationRef.current = requestAnimationFrame(animate);

return () => {
  cancelAnimationFrame(animationRef.current);
};
 

}, [articles.length]);

const marqueeArticles = [...articles, ...articles];

return ( <section className="relative overflow-hidden bg-background py-12 sm:py-20 lg:py-24">
{/* Background accent */} <div
     className="
       pointer-events-none
       absolute
       -right-48
       top-1/2
       h-[500px]
       w-[500px]
       -translate-y-1/2
       rounded-full
       bg-primary/5
       blur-[120px]
     "
   />

 
  <div className="relative mx-auto max-w-[1440px]">
    {/* HEADING */}
    <div className="mb-7 flex items-end justify-between gap-6 px-5 sm:mb-10 sm:px-8 lg:px-10">
      <div>
        <div className="mb-3 flex items-center gap-3">
          <span className="h-[2px] w-6 bg-primary sm:w-8" />

          <p className="text-[10px] font-black uppercase tracking-[0.22em] text-primary sm:text-xs sm:tracking-[0.28em]">
            Learn. Train. Perform.
          </p>

          <span className="h-[2px] w-6 bg-primary sm:w-8" />
        </div>

        <h2
          className="
            text-3xl
            font-black
            uppercase
            leading-none
            tracking-[-0.03em]
            text-text-primary
            sm:text-5xl
            lg:text-6xl
          "
        >
          Featured Blogs
        </h2>

        <p className="mt-3 max-w-xl text-[13px] leading-5 text-text-secondary sm:mt-4 sm:text-sm sm:leading-6">
          Expert-backed guides, supplement education and practical tips to
          help you get more from your training and nutrition.
        </p>
      </div>

      {/* Desktop CTA */}
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
          View All Articles
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

    {/* LOADING STATE */}
    {isLoading && (
      <div className="flex gap-4 overflow-hidden px-5 pb-4 sm:gap-6 sm:px-8 lg:gap-7 lg:px-10">
        {[1, 2, 3].map((item) => (
          <div
            key={item}
            className="
              h-[325px]
              w-[260px]
              min-w-[260px]
              animate-pulse
              rounded-2xl
              bg-surface-muted
              sm:h-[460px]
              sm:w-[380px]
              sm:min-w-[380px]
              lg:w-[420px]
              lg:min-w-[420px]
            "
          />
        ))}
      </div>
    )}

    {/* ERROR / EMPTY STATE */}
    {!isLoading && (isError || articles.length === 0) && (
      <div className="px-5 sm:px-8 lg:px-10">
        <p className="text-sm text-text-muted">
          No blogs available right now.
        </p>
      </div>
    )}

    {/* BLOG MARQUEE */}
    {!isLoading && !isError && articles.length > 0 && (
      <div className="relative">
        {/* Left fade */}
        <div className="pointer-events-none absolute inset-y-0 left-0 z-20 w-5 bg-gradient-to-r from-background to-transparent sm:w-16 lg:w-24" />

        {/* Right fade */}
        <div className="pointer-events-none absolute inset-y-0 right-0 z-20 w-5 bg-gradient-to-l from-background to-transparent sm:w-16 lg:w-24" />

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
            gap-4
            overflow-x-auto
            px-5
            pb-4
            active:cursor-grabbing
            sm:gap-6
            sm:px-8
            lg:gap-7
            lg:px-10
          "
        >
          {marqueeArticles.map((article, index) => (
            <div
              key={`${article.id}-${index}`}
              className="
                w-[260px]
                min-w-[260px]
                sm:w-[380px]
                sm:min-w-[380px]
                lg:w-[420px]
                lg:min-w-[420px]
              "
            >
              <BlogCard article={article} />
            </div>
          ))}
        </div>
      </div>
    )}

    {/* MOBILE CTA */}
    <div className="mt-5 px-5 sm:hidden">
      <Link
        href="/blogs"
        className="
          group
          inline-flex
          items-center
          gap-2
          text-sm
          font-black
          uppercase
          tracking-wide
          text-text-primary
        "
      >
        <span className="border-b-2 border-primary pb-1">
          View All Articles
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
  </div>
</section>
 

);
}
