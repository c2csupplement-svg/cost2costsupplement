// lib/seo.js

export function getSEOMetadata(seo) {
  if (!seo) {
    console.warn("SEO data not provided");
    return {};
  }

  const robotsObj = {
    index: true,
    follow: true,
  };

  if (seo.robots) {
    seo.robots.split(",").forEach((item) => {
      const key = item.trim().toLowerCase();

      if (key === "index") {
        robotsObj.index = true;
      }

      if (key === "noindex") {
        robotsObj.index = false;
      }

      if (key === "follow") {
        robotsObj.follow = true;
      }

      if (key === "nofollow") {
        robotsObj.follow = false;
      }
    });
  }

  return {
    title: seo.title || "",
    description: seo.description || "",
    keywords: seo.keywords || "",

    ...(seo.canonical && {
      alternates: {
        canonical: seo.canonical,
      },
    }),

    ...(seo.author && {
      authors: [
        {
          name: seo.author,
        },
      ],
    }),

    ...(seo.publisher && {
      publisher: seo.publisher,
    }),

    openGraph: {
      title: seo.og?.title || seo.title || "",
      description:
        seo.og?.description ||
        seo.description ||
        "",
      url:
        seo.og?.url ||
        seo.canonical ||
        "",
      siteName: seo.og?.site_name || "",
      locale: seo.og?.locale || "en_US",
      type: seo.og?.type || "website",

      ...(seo.og?.image && {
        images: [
          {
            url: seo.og.image,
            alt:
              seo.og.image_alt ||
              seo.og.title ||
              seo.title ||
              "",
          },
        ],
      }),
    },

    twitter: {
      card:
        seo.twitter?.card ||
        "summary_large_image",

      title:
        seo.twitter?.title ||
        seo.title ||
        "",

      description:
        seo.twitter?.description ||
        seo.description ||
        "",

      ...(seo.twitter?.image && {
        images: [seo.twitter.image],
      }),

      ...(seo.twitter?.creator && {
        creator: seo.twitter.creator,
      }),

      ...(seo.twitter?.site && {
        site: seo.twitter.site,
      }),
    },
    
    robots: {
      index: robotsObj.index,
      follow: robotsObj.follow,

      googleBot: {
        index: robotsObj.index,
        follow: robotsObj.follow,
      },
    },

    other: {
      ...(seo.language && {
        language: seo.language,
      }),

      ...(seo.publisher && {
        publisher: seo.publisher,
      }),

      ...(seo.distribution && {
        distribution: seo.distribution,
      }),

      ...(seo.rating && {
        rating: seo.rating,
      }),

      ...(seo.revisit_after && {
        "revisit-after": seo.revisit_after,
      }),

      ...(seo.googlebot && {
        googlebot: seo.googlebot,
      }),

      ...(seo.bingbot && {
        bingbot: seo.bingbot,
      }),

      ...(seo.geo?.region && {
        "geo.region": seo.geo.region,
      }),

      ...(seo.geo?.placename && {
        "geo.placename": seo.geo.placename,
      }),
    },
  };
}


export function getJSONLD(seo) {
  if (!seo?.ldjson) {
    return null;
  }

  return JSON.stringify(
    Array.isArray(seo.ldjson)
      ? seo.ldjson
      : [seo.ldjson]
  );
}