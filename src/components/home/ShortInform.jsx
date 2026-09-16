
"use client";

import { useState } from "react";
import { ChevronDown, BadgeCheck } from "lucide-react";

function WhyChooseC2C() {
    const reasons = [
        {
            title: "Genuine Products",
            body: "We source only from trusted manufacturers and verified suppliers, so every bottle you open is exactly what the label promises.",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                    <path
                        d="M12 3l7 3v5c0 4.5-3 8-7 10-4-2-7-5.5-7-10V6l7-3z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                    />
                    <path
                        d="M9 12l2 2 4-4.5"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
        },
        {
            title: "Fair Pricing",
            body: "Cutting out unnecessary markups lets us keep top-quality supplements priced honestly, without cutting corners on what's inside.",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                    <path
                        d="M20 12L12 4H5a1 1 0 00-1 1v7l8 8a1 1 0 001.4 0l6.6-6.6a1 1 0 000-1.4z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                    />
                    <circle cx="8.5" cy="8.5" r="1.4" fill="currentColor" />
                </svg>
            ),
        },
        {
            title: "Customer First",
            body: "From safe packaging to on-time delivery, every order is handled the way we'd want our own family's to be handled.",
            icon: (
                <svg viewBox="0 0 24 24" fill="none" className="w-6 h-6">
                    <path
                        d="M12 20s-7-4.35-9.5-9A5.5 5.5 0 0112 6.5 5.5 5.5 0 0121.5 11c-2.5 4.65-9.5 9-9.5 9z"
                        stroke="currentColor"
                        strokeWidth="1.6"
                        strokeLinejoin="round"
                    />
                </svg>
            ),
        },
    ];

    return (
        <section className="w-full bg-slate-50 px-4 py-10">
            <div className="max-w-5xl mx-auto flex flex-col items-center gap-5 md:gap-10">
                <div className="flex flex-col items-center gap-4 text-center max-w-2xl">
                    <h1 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                        Why choose Cost2Cost supplements?
                    </h1>
                    <h2 className="text-slate-600 text-[15px] md:text-lg leading-relaxed">
                        With endless options online, finding a supplement store you can actually
                        trust is hard. Cost2Cost stands on three things: real products, honest
                        pricing, and customers who come back.
                    </h2>
                </div>

                <div className="w-full grid grid-cols-1 md:grid-cols-3 divide-y md:divide-y-0 md:divide-x divide-slate-200 gap-4">
                    {reasons.map((reason) => (
                        <div
                            key={reason.title}
                            className="flex flex-col items-center text-center gap-3 px-6"
                        >
                            <div className="flex justify-center items-center gap-2">
                                <div className="w-10 h-10 flex items-center justify-center rounded-full bg-red-600 text-white">
                                    {reason.icon}
                                </div>
                                <p className="text-lg font-semibold text-slate-900">
                                    {reason.title}
                                </p>
                            </div>
                            <p className="text-sm text-slate-600 leading-relaxed max-w-full">
                                {reason.body}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function ProductRange() {
    const productRangeName = ["Daily Nutrients", "Bone and Joint Support", "Cardiovascular Fitness", "Men's and Women's Wellness",
        "Sports Nutrition", "Immune Support", "Herbal Supplements", "Energy and Endurance", "Brain and Cognitive Support",
        "Weight Management", "Skin, Hair and Nails Support",
    ];

    return (
        <section className="w-full bg-slate-50 py-10 px-4">
            <div className="max-w-5xl mx-auto flex flex-col items-center gap-10">
                <div className="flex flex-col items-center gap-4 text-center max-w-2xl">
                    <p className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                        Wide range of products
                    </p>
                    <p className="text-slate-600 text-[15px] md:text-lg leading-relaxed">
                        We offer products across many fitness and wellness categories, including:
                    </p>
                </div>

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {productRangeName.map((item, index) => (
                        <div
                            key={index}
                            className="flex items-center gap-3 bg-white border border-slate-200 border-l-4 border-l-red-600 rounded-lg px-4 py-3 transition-shadow hover:shadow-md"
                        >
                            <p className="text-sm md:text-[15px] font-medium text-slate-800">
                                {item}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}


function Quality() {

    const qualityArray = ["Safe products", "Transparency of information", "Consistent formulas",
        "Transparent pricing", "Great customer support",
    ];

    return (
        <section className="w-full bg-slate-50 px-4 pt-10 sm:px-6 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mx-auto max-w-3xl text-center">
                    <span className="mb-3 inline-flex items-center rounded-full bg-red-50 px-4 py-1.5 text-xs font-semibold uppercase tracking-wider text-red-600">
                        Our Standards
                    </span>

                    <p className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        Our Commitment to{" "}
                        <span className="text-red-600">Quality</span>
                    </p>

                    <h3 className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base md:text-lg">
                        Quality is the heart of everything we do. Cost2Cost Supplement
                        provides carefully selected supplements based on ingredient
                        quality and manufacturing standards.
                    </h3>

                    <p className="mt-2 text-sm font-medium text-slate-800 sm:text-base">
                        We believe customers should have:
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {qualityArray.map((item, index) => (
                        <div
                            key={index}
                            className="group flex items-center gap-4 rounded-xl border border-slate-200 bg-white px-5 py-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-md"
                        >
                            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 transition-colors duration-300 group-hover:bg-red-600">
                                <BadgeCheck
                                    className="text-red-600 transition-colors duration-300 group-hover:text-white"
                                    size={21}
                                    strokeWidth={2.3}
                                />
                            </div>

                            <span className="text-sm font-semibold text-slate-800 sm:text-[15px]">
                                {item}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="mt-12">
                    <div className="mx-auto h-px w-full bg-slate-200" />

                    <div className="mx-auto mt-6 max-w-4xl text-center">
                        <div className="mb-3 flex justify-center">
                            <div className="flex h-8 w-8 items-center justify-center rounded-full bg-red-600">
                                <BadgeCheck
                                    className="text-white"
                                    size={18}
                                    strokeWidth={2.5}
                                />
                            </div>
                        </div>

                        <p className="text-sm leading-7 text-slate-600 sm:text-base">
                            Our commitment is to help customers make informed decisions
                            without making any false claims or exaggerated promises.
                        </p>
                    </div>
                </div>
            </div>
        </section>
    );
}

function LifeStyle() {
    const liftStyleData = [{
        title: "Bone and Joint Wellness",
        des: "If you want to stay active, you need strong bones and flexible joints. Supplements to support your bones may help provide key nutrients that support overall skeletal health."
    },
    {
        title: "Heart Health",
        des: "Heart wellness is an essential part of long-term health. Nutritional support can be a supplement to a well-balanced diet and healthy lifestyle."
    },
    {
        title: "Support of the Immune System",
        des: "A healthy immune system keeps your body working as it should. Vitamins, minerals, and herbal supplements may help support daily nutritional needs."
    },
    {
        title: "Sports Nutrition",
        des: "Many fitness enthusiasts and athletes need additional nutrition to support their training schedules and active lifestyles."
    },
    {
        title: "Daily Wellness",
        des: "A multivitamin and nutritional supplements can fill dietary voids and promote overall health."
    }
    ];

    const inform = [{
        title: "Supporting your journey of health",
        des: "Health is not about quick fixes. It’s about consistently making informed decisions over time. The Cost2Cost Supplement is here to help you on your journey to wellness with products that support a balanced lifestyle. A healthy lifestyle includes:",
        points: ["A balanced diet", "Exercise regularly", "Good rest", "Coping with stress", "Adequate hydration", "Regular health check-ups"],
        short: "Supplements are meant to supplement these healthy habits, not take their place."
    },
    {
        title: "Why Nutrition Matters",
        des: "In today’s fast-paced lifestyle, getting the best nutrition can be difficult. Things such as:",
        points: ["Demanding work schedules", "Consumption of fast food", "Reduced physical activity", "work pressure", "Environmental Pollution"],
        short: "Nutritional needs change with age, which can make it harder to get balanced nutrition through diet alone."
    }
    ]

    return (
        <section className="w-full bg-slate-50 px-4 pt-10 sm:px-6 sm:py-10 lg:px-8">
            <div className="mx-auto max-w-6xl">

                <div className="mx-auto max-w-3xl text-center">
                    <p className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        Health Supplements for All{" "}
                        <span className="text-red-600">Lifestyles</span>
                    </p>

                    <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base md:text-lg">
                        Everybody’s nutritional needs are different. Proper nutrition is an
                        important part of everyday health, whether you are a student, working
                        professional, athlete, senior citizen, or someone concerned with
                        preventive wellness. Our supplement categories are formulated to
                        support different health goals.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {liftStyleData.map((item, index) => (
                        <div
                            key={index}
                            className="group rounded-2xl border border-slate-200 bg-white p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
                        >
                            <div className="mb-3 flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-600">
                                    <span className="text-sm font-bold">{index + 1}</span>
                                </div>

                                <h3 className="text-[17px] font-bold text-slate-900">
                                    {item.title}
                                </h3>
                            </div>

                            <p className="text-sm leading-6 text-slate-600 sm:text-[15px]">
                                {item.des}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-10 grid grid-cols-1 gap-5 md:grid-cols-2">
                    {inform.map((item, index) => (
                        <div
                            key={index}
                            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
                        >
                            <div className="mb-5 flex items-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600">
                                    <span className="text-lg font-bold text-white">
                                        {index + 1}
                                    </span>
                                </div>

                                <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                                    {item.title}
                                </h3>
                            </div>

                            <p className="mb-5 text-sm leading-6 text-slate-600 sm:text-[15px]">
                                {item.des}
                            </p>

                            <div className="space-y-3">
                                {item.points.map((point, pointIndex) => (
                                    <div
                                        key={pointIndex}
                                        className="flex items-start gap-3 rounded-lg"
                                    >
                                        <div className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-red-600" />

                                        <p className="text-sm font-medium leading-5 text-slate-700">
                                            {point}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-5 border-t border-slate-200 pt-4">
                                <p className="text-sm font-medium leading-6 text-slate-600">
                                    {item.short}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Trusted() {
    const trustPointArray = [
        {
            title: "Easy Product Selection",
            des: "Browse products by categories and health issues.",
        },
        {
            title: "Secure Payment",
            des: "Safe and convenient ways to pay.",
        },
        {
            title: "Dependable Delivery",
            des: "On-time delivery so your customers receive their goods on time.",
        },
        {
            title: "Customer Support",
            des: "Our team is available to help with product information and ordering questions.",
        },
    ];

    return (
        <section className="w-full bg-slate-50 px-4 pt-10 sm:px-6 sm:py-10 lg:px-8">
            <div className="mx-auto max-w-6xl">

                <div className="mx-auto max-w-4xl text-center">
                    <p className="text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        Trusted Shopping{" "}
                        <span className="text-red-600">Experience</span>
                    </p>

                    <h5 className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 sm:text-base">
                        Shopping for supplements should be easy and safe. At Cost2Cost Supplement, we take into consideration providing :
                    </h5>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
                    {trustPointArray.map((trust, index) => (
                        <div
                            key={trust.title}
                            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
                        >
                            <div className="flex items-center gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-red-50 transition-colors duration-300 group-hover:bg-red-600">
                                    <span className="text-base font-bold text-red-600 transition-colors duration-300 group-hover:text-white">
                                        {index + 1}
                                    </span>
                                </div>

                                <p className="flex-1 text-left text-base font-bold leading-6 text-slate-900 sm:text-lg">
                                    {trust.title}
                                </p>
                            </div>

                            {/* Description */}
                            <p className="mt-4 text-left text-sm leading-6 text-slate-600">
                                {trust.des}
                            </p>
                        </div>
                    ))}
                </div>

                <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="mb-5 flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600">
                                <span className="text-lg font-bold text-white">01</span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                                Benefits of Shopping with Cost2Cost Supplement
                            </h3>
                        </div>

                        <p className="text-sm leading-7 text-slate-600 sm:text-base">
                            At Cost2Cost Supplement, we are committed to creating
                            accessible, reliable, and affordable health and wellness
                            products for everyone. Our goal is not just to sell supplements,
                            but to create a reliable platform where customers can shop
                            confidently and make informed decisions about their wellness.
                        </p>

                        {/* <div className="mt-5 rounded-xl bg-slate-50 p-4">
              <p className="text-sm font-medium leading-6 text-slate-700">
                Discover quality products, transparent information, and a
                shopping experience designed around your needs.
              </p>
            </div> */}
                    </div>

                    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
                        <div className="mb-5 flex items-center gap-4">
                            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-red-600">
                                <span className="text-lg font-bold text-white">02</span>
                            </div>

                            <h3 className="text-xl font-bold text-slate-900 sm:text-2xl">
                                Affordable Price
                            </h3>
                        </div>

                        <p className="text-sm leading-7 text-slate-600 sm:text-base">
                            We believe top-quality health supplements should be available at an honest price.
                            Cost2Cost Supplement works to reduce
                            unnecessary costs and offer customers better products at
                            competitive prices.
                        </p>

                        {/* <div className="mt-5 rounded-xl bg-red-50 p-4">
              <p className="text-sm font-semibold leading-6 text-red-700">
                Quality products at competitive prices, helping you invest in
                your health without unnecessary overspending.
              </p>
            </div> */}
                    </div>
                </div>

            </div>
        </section>
    );
}

function Categories() {
    const categoryArray = [
        {
            name: "Vitamins & Minerals",
            des: "Vitamins and minerals form the foundation of good health and play a key role in supporting overall wellbeing. Our range is designed to complement a balanced diet and help meet the everyday nutritional needs of people of all ages.",
        },
        {
            name: "Herbal Supplements",
            des: "Our line of herbal supplements unites the benefits of traditional herbal ingredients with modern nutritional practices. These plant-based wellness products are carefully curated to support a healthy, balanced life.",
        },
        {
            name: "Bone Health Supplements",
            des: "Healthy joints and strong bones are the secret to staying active at every stage of life. Our bone health range contains nutrition products that support mobility, strength, and overall skeletal wellness.",
        },
        {
            name: "Heart Health",
            des: "A healthy heart is an important part of overall wellness. Our hand-picked collection of products supports a heart-healthy lifestyle and a balanced nutrition plan.",
        },
        {
            name: "Sports Nutrition",
            des: "Our sports nutrition range includes quality products to support training, exercise routines, and performance goals, whether you're a professional athlete, fitness enthusiast, or someone with an active lifestyle.",
        },
        {
            name: "Energy Support",
            des: "Busy schedules and demanding lifestyles often need extra nutritional support. Our energy products are designed to support normal day-to-day energy levels and fit into an active lifestyle.",
        },
        {
            name: "Immunity Products",
            des: "Supporting overall wellness all year long is an important part of a healthy lifestyle. Our immunity category features essential supplements that promote balanced nutrition and daily wellness habits.",
        },
        {
            name: "Men's & Women's Health",
            des: "Nutritional needs vary across life stages. Cost2Cost Supplement specializes in wellness solutions for men and women, with products designed to meet their specific health and lifestyle needs.",
        },
    ];

    return (
        <section className="w-full bg-slate-50 pt-10 px-4 sm:py-10">
            <div className="max-w-6xl mx-auto flex flex-col items-center gap-10">
                <div className="flex flex-col items-center gap-4 text-center max-w-2xl">
                    <p className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                        Our Product Categories
                    </p>
                    <h4 className="text-slate-600 text-[15px] md:text-lg leading-relaxed">
                        At Cost2Cost Supplement, we believe everyone has unique fitness and
                        wellness goals. Whether you're maintaining a daily diet, supporting an
                        active lifestyle, or focusing on a specific area of fitness, our
                        carefully curated range is designed to meet a wide variety of
                        nutritional needs, so you can make informed choices for a healthier
                        life.
                    </h4>
                </div>

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                    {categoryArray.map((category, index) => (
                        <div
                            key={category.name}
                            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
                        >
                            <div className="flex items-center justify-center gap-3">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-50 transition-colors duration-300 group-hover:bg-red-600">
                                    <span className="text-sm font-bold text-red-600 transition-colors duration-300 group-hover:text-white">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </div>

                                <p className="text-lg font-semibold leading-6 text-slate-900 transition-colors duration-300 group-hover:text-red-600">
                                    {category.name}
                                </p>
                            </div>

                            <p className="mt-2 text-sm text-slate-600 leading-relaxed">
                                {category.des}
                            </p>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Brands() {
    const brandsArray = [
        {
            title: "NOW® Food",
            des: "With over 50 years of experience in the industry, NOW Foods has earned a worldwide reputation for quality, consistency, and innovation. Customers around the world trust NOW Foods. With strict manufacturing standards and third-party testing practices, NOW Foods offers a large variety of vitamins, minerals, herbal supplements, and wellness products.",
            best: "Basic vitamins, essential minerals, everyday wellness supplements, immune support, and long-term nutritional health.",
        },
        {
            title: "Earthmaa",
            des: "Earthmaa is a wellness brand that aims to provide essential nutrition through accessible, effective, and thoughtful products. Its products are designed to support practical everyday wellness and nutritional balance.",
            best: "Ashwagandha, vitamin D3, vitamin B12, magnesium, and various daily fitness needs that support general health and nutritional balance.",
        },
        {
            title: "Promolecule",
            des: "Designed for serious athletes and performance-focused individuals, Promolecule focuses on advanced sports nutrients and performance supplements. The brand develops formulations intended to support training intensity, endurance, recovery, and athletic performance.",
            best: "Pre-workout, thermogenic supplements, performance enhancers, ATP support formulas, and advanced sports nutrition products.",
        },
        {
            title: "Grainly",
            des: "Grainly offers modern nutrition solutions for active lifestyles with a focus on clean, convenient, and practical nutrition. Its products are designed to provide dependable energy and support active lifestyles.",
            best: "Instant rice cream, fast-absorbing carbohydrate sources, pre-training nutrition, post-training nutrition, and convenient energy support.",
        },
        {
            title: "Puritan's Pride",
            des: "Puritan's Pride is a wellness brand with decades of experience in nutritional supplements. The company provides a broad range of vitamins, minerals, herbs, and specialty nutrition products for general wellness.",
            best: "Daily vitamins, immune support, heart health, joint support, and overall wellness.",
        },
    ];

    const inform = [
        {
            title: "Easy and Convenient Shopping",
            des: "Buying supplements should be simple. At Cost2Cost Supplement, customers can:",
            points: ["Browse products effortlessly", "Search by category", "Explore by fitness goal",
                "Compare products side by side", "Read detailed descriptions", "Shop safely",
                "Track orders reliably", "Get customer support",
            ],
            short:
                "Our goal is to make online shopping a smooth and hassle-free experience.",
        },
        {
            title: "Why Product Comparisons Matter",
            des: "Not all supplements are the same. Different products may vary in:",
            points: ["Ingredients", "Serving sizes", "Nutrient forms", "Product categories",
                "Dietary preferences", "Brand reputation", "Price points",
            ],
            short:
                "Cost2Cost Supplement encourages customers to compare products and select options that align with their personal preferences and wellness goals.",
        },
    ];

    return (
        <section className="w-full bg-slate-50 px-4 pt-10 sm:px-6 sm:py-10 lg:px-8">
            <div className="mx-auto max-w-6xl">
                <div className="mx-auto max-w-4xl text-center">
                    <span className="inline-block rounded-full bg-red-50 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-red-600">
                        Our Brand Partners
                    </span>

                    <h4 className="mt-4 text-3xl font-bold leading-tight text-slate-900 sm:text-4xl lg:text-5xl">
                        The Brands You'll Find at{" "}
                        <span className="text-red-600">Cost2Cost Supplement</span>
                    </h4>

                    <p className="mx-auto mt-5 max-w-3xl text-sm leading-7 text-slate-600 sm:text-base md:text-lg">
                        At Cost2Cost Supplement, we believe customers should have access
                        to trusted brands, transparent product information, and quality
                        supplements that meet their individual health and wellness goals.
                        That's why we have handpicked a range of reputable Indian and
                        international supplement brands so you can compare products and
                        find the right solution for you.
                    </p>
                </div>

                <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
                    {brandsArray.map((brand, index) => (
                        <div
                            key={brand.title}
                            className="group flex flex-col rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg"
                        >
                            <div className="mb-5 flex items-center justify-between">
                                <div className="flex justify-center items-center w-full gap-2">
                                    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-red-50 transition-colors duration-300 group-hover:bg-red-600">
                                        <span className="text-sm font-bold text-red-600 transition-colors duration-300 group-hover:text-white">
                                            {String(index + 1).padStart(2, "0")}
                                        </span>
                                    </div>
                                    <p className="text-xl font-bold text-slate-900 transition-colors duration-300 group-hover:text-red-600">
                                        {brand.title}
                                    </p>
                                </div>

                                <span className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-500">
                                    Brand
                                </span>
                            </div>


                            <p className="mt-3 text-sm leading-6 text-slate-600">
                                {brand.des}
                            </p>

                            <div className="mt-5 rounded-xl bg-slate-50 p-4">
                                <p className="text-xs font-bold uppercase tracking-wide text-red-600">
                                    Best For
                                </p>

                                <p className="mt-2 text-sm leading-6 text-slate-700">
                                    {brand.best}
                                </p>
                            </div>
                        </div>
                    ))}

                    <div className="flex flex-col justify-center rounded-2xl border border-dashed border-red-300 bg-red-50/60 p-6 text-center">
                        {/* <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-red-600">
                            <span className="text-lg font-bold text-white">50+</span>
                        </div> */}

                        <h2 className="mt-4 text-lg font-bold text-slate-900">
                            Plus 50+ Verified Brands
                        </h2>

                        <p className="mt-2 text-sm leading-6 text-slate-600">
                            Cost2Cost Supplement also carries products from 50+ carefully
                            selected Indian and global manufacturers, each assessed for
                            authenticity and trustworthiness.
                        </p>
                    </div>
                </div>

                <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
                    {inform.map((item, index) => (
                        <div
                            key={index}
                            className="group rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-lg sm:p-8"
                        >
                            <div className="flex items-start gap-4">
                                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-red-600">
                                    <span className="text-sm font-bold text-white">
                                        {String(index + 1).padStart(2, "0")}
                                    </span>
                                </div>

                                <div>
                                    <p className="text-xl font-bold leading-tight text-slate-900 sm:text-2xl">
                                        {item.title}
                                    </p>

                                    <p className="mt-3 text-sm leading-6 text-slate-600">
                                        {item.des}
                                    </p>
                                </div>
                            </div>

                            <div className="mt-6 grid grid-cols-1 gap-2 sm:grid-cols-2">
                                {item.points.map((point, pointIndex) => (
                                    <div
                                        key={pointIndex}
                                        className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3 py-2.5"
                                    >
                                        <BadgeCheck
                                            className="text-red-600 shrink-0"
                                            size={16}
                                            strokeWidth={2.5}
                                        />

                                        <p className="text-sm leading-5 text-slate-700">
                                            {point}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="mt-6 border-t border-slate-200 pt-4">
                                <p className="text-sm font-medium leading-6 text-slate-600">
                                    {item.short}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}

function Promise() {
    const promiseArray = ["Trusted brands", "Genuine products", "Transparent information", "Competitive prices",
        "Safe purchase", "Reliable delivery", "Customer support", "Expanding product range", "Wellness education",
        "Customer satisfaction",
    ];

    return (
        <section className="w-full bg-slate-50 pt-10 px-4">
            <div className="max-w-5xl mx-auto flex flex-col items-center gap-10">
                <div className="flex flex-col items-center gap-4 text-center max-w-2xl">
                    <h6 className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                        The Cost2Cost Supplement Promise
                    </h6>
                    <p className="text-slate-600 text-[15px] md:text-lg leading-relaxed">
                        You can expect Cost2Cost Supplement to provide:
                    </p>
                </div>

                <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {promiseArray.map((promise) => (
                        <div
                            key={promise}
                            className="flex items-center gap-3 bg-white border border-slate-200 border-l-4 border-l-red-600 rounded-lg px-4 py-3"
                        >
                            <BadgeCheck
                                className="text-red-600 shrink-0"
                                size={20}
                                strokeWidth={2.5}
                            />
                            <span className="text-sm md:text-[15px] font-medium text-slate-800">
                                {promise}
                            </span>
                        </div>
                    ))}
                </div>

                <div className="w-full max-w-3xl border-l-4 border-red-600 bg-white rounded-r-xl shadow-sm px-5 py-5 md:px-8 md:py-6">
                    <p className="text-[15px] md:text-lg text-slate-700 leading-relaxed">
                        Our promise is to keep building a platform that lets customers shop
                        with confidence and clarity as they work toward their wellness goals.
                        Explore our growing collection of health and wellness products and
                        find the best way to shop for supplements.
                    </p>
                </div>
            </div>
        </section>
    );
}


function FAQ() {
    const [openIndex, setOpenIndex] = useState(0);

    const FAQArray = [
        {
            question: "What is Cost2Cost Supplement?",
            answer: "Cost2Cost Supplement is a multi-brand online marketplace offering a wide range of genuine health, wellness, and sports nutrition products. We bring together trusted Indian and global supplement manufacturers so customers can easily discover, compare, and buy premium products — all in one place.",
        },
        {
            question: "Why should I choose Cost2Cost Supplement?",
            answer: "Cost2Cost Supplement is built around honesty, transparency, and customer trust. We offer access to a wide range of brands, competitive pricing, clear product information, consistent quality, and reliable customer service to help you make informed health decisions.",
        },
        {
            question: "Are the supplements sold on Cost2Cost Supplement genuine?",
            answer: "Yes. We source products only from reputable manufacturers, authorized dealers, and trusted brands, so you can shop with confidence that what you receive is authentic.",
        },
        {
            question: "What types of supplements are available at Cost2Cost Supplement?",
            answer: "We offer products across a wide range of health categories, including:",
            point: [
                "Vitamins and minerals",
                "Herbal supplements",
                "Sports nutrition",
                "Bone and joint support",
                "Cardiovascular fitness",
                "Energy support",
                "Men's and women's health",
                "Daily nutrients",
                "General fitness and lifestyle guides",
            ],
        },
        {
            question: "Which brands are available on Cost2Cost Supplement?",
            answer: "We carry products from leading Indian and global manufacturers, including NOW Foods, Earthmaa, Puritan's Pride, Nutrex Research, Ronnie Coleman, Promolecule, Insane Labz, GAT Sport, JNX Sports, Grainly, and many other trusted names. We're constantly expanding our collection to give customers more choice.",
        },
        {
            question: "How do I choose the best supplement for my needs?",
            answer: "You can browse products by health goal, wellness category, or lifestyle preference. Product descriptions and category pages are there to help you make an informed decision. For specific health concerns, we recommend speaking with your healthcare professional.",
        },
        {
            question: "What makes Cost2Cost Supplement different from other supplement stores?",
            answer: "Unlike many online stores, Cost2Cost Supplement brings together multiple trusted brands, authentic products, educational content, transparent information, and customer-first service, all on one convenient platform.",
        },
    ];

    const toggle = (index) => {
        setOpenIndex((prev) => (prev === index ? -1 : index));
    };

    return (
        <section className="w-full bg-slate-50 py-14 px-4 sm:py-10">
            <div className="max-w-3xl mx-auto flex flex-col items-center gap-10">
                <div className="flex flex-col items-center gap-4 text-center max-w-2xl">
                    <p className="text-3xl md:text-4xl font-bold text-slate-900 leading-tight">
                        Frequently Asked Questions
                    </p>
                    <p className="text-slate-600 text-[15px] md:text-lg leading-relaxed">
                        Everything you need to know about shopping with Cost2Cost Supplement.
                    </p>
                </div>

                <div className="w-full flex flex-col gap-3">
                    {FAQArray.map((faq, index) => {
                        const isOpen = openIndex === index;
                        return (
                            <div
                                key={faq.question}
                                className={`w-full bg-white border border-slate-200 border-l-4 rounded-lg overflow-hidden transition-colors duration-300 ${isOpen ? "border-l-red-600" : "border-l-slate-200"
                                    }`}
                            >
                                <button
                                    type="button"
                                    onClick={() => toggle(index)}
                                    aria-expanded={isOpen}
                                    className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left"
                                >
                                    <span className="text-sm md:text-base font-semibold text-slate-900">
                                        {faq.question}
                                    </span>
                                    <ChevronDown
                                        size={20}
                                        className={`shrink-0 text-red-600 transition-transform duration-300 ${isOpen ? "rotate-180" : ""
                                            }`}
                                    />
                                </button>

                                {isOpen && (
                                    <div className="px-5 pb-5">
                                        <p className="text-sm md:text-[15px] text-slate-600 leading-relaxed">
                                            {faq.answer}
                                        </p>

                                        {faq.point && (
                                            <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                                                {faq.point.map((item) => (
                                                    <div
                                                        key={item}
                                                        className="flex items-center gap-2.5 rounded-lg bg-slate-50 px-3 py-2.5"
                                                    >
                                                        <BadgeCheck
                                                            className="text-red-600 shrink-0"
                                                            size={16}
                                                            strokeWidth={2.5}
                                                        />
                                                        <p className="text-sm leading-5 text-slate-700">
                                                            {item}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>
        </section>
    );
}


export function ShortInform() {
    const [isExpanded, setIsExpanded] = useState(false);

    return (
        <div className="w-full bg-white">

            <div className="w-full bg-red-600 px-4 py-3.5 text-center text-white">
                <p className="text-sm font-semibold tracking-tight sm:text-base md:text-lg">
                    Cost2Cost Supplement — Your Personalized Gym Store for Healthy
                    Lifestyle Enthusiasts
                </p>
            </div>

            <section className="w-full bg-gradient-to-b from-white to-slate-50 px-4 py-12 sm:px-6 sm:py-10 lg:px-8">
                <div className="mx-auto flex max-w-6xl flex-col items-center">

                    <div className="mx-auto max-w-4xl">
                        <div className="relative rounded-2xl border-l-4 border-red-600 bg-white p-6 shadow-sm sm:p-8">

                            {/* <div className="absolute left-0 top-6 h-12 w-1 rounded-r-full bg-red-600 sm:top-8" /> */}

                            <p className="text-sm leading-7 text-slate-700 sm:text-base md:text-lg md:leading-8">
                                Cost2Cost Supplement was founded on a simple mission: make
                                high-quality health and sports nutrition affordable by cutting
                                out the excessive costs of traditional distribution. Customers
                                are often paying for expensive marketing, celebrity
                                endorsements, and layers of middlemen rather than the quality
                                of the product itself. We believe your money should go into
                                better ingredients and trusted formulations instead.
                            </p>
                        </div>
                    </div>

                    {isExpanded && (
                        <div className="mt-5 grid w-full max-w-4xl grid-cols-1 gap-4 md:grid-cols-2">
                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-md">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                                        <span className="text-sm font-bold text-red-600">
                                            01
                                        </span>
                                    </div>

                                    <h3 className="text-base font-bold text-slate-900">
                                        Trusted Products
                                    </h3>
                                </div>

                                <p className="text-sm leading-6 text-slate-600">
                                    We handpick products from trusted brands and authorized
                                    suppliers to ensure authenticity, quality, and peace of mind
                                    — sourced ethically and delivered with a promise of
                                    transparency and reliability.
                                </p>
                            </div>

                            <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-red-200 hover:shadow-md">
                                <div className="mb-4 flex items-center gap-3">
                                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-red-50">
                                        <span className="text-sm font-bold text-red-600">
                                            02
                                        </span>
                                    </div>

                                    <h3 className="text-base font-bold text-slate-900">
                                        Complete Nutrition
                                    </h3>
                                </div>

                                <p className="text-sm leading-6 text-slate-600">
                                    Our range spans nutrients, minerals, sports nutrition,
                                    natural supplements, joint and bone support, immune support,
                                    cognitive health, and specialty formulas built for a fitter
                                    lifestyle across every category.
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            </section>

            {isExpanded && (
                <div className="w-full">
                    <WhyChooseC2C />
                    <ProductRange />
                    <Quality />
                    <LifeStyle />
                    <Trusted />
                    <Categories />
                    <Brands />
                    <Promise />
                    <FAQ />
                </div>
            )}

            <div className="flex justify-center bg-slate-50 px-4 pb-12 pt-2 sm:pb-16">
                <button
                    type="button"
                    onClick={() => setIsExpanded(!isExpanded)}
                    className="group flex items-center gap-2 rounded-xl bg-red-600 px-7 py-3 text-sm font-semibold text-white shadow-md transition-all duration-300 hover:-translate-y-0.5 hover:bg-red-700 hover:shadow-lg active:translate-y-0 sm:px-8 sm:py-3.5 sm:text-base"
                >
                    <span>{isExpanded ? "Read Less" : "Read More"}</span>

                    <svg
                        className={`h-4 w-4 transition-transform duration-300 ${isExpanded ? "rotate-180" : ""
                            }`}
                        viewBox="0 0 24 24"
                        fill="none"
                        stroke="currentColor"
                        strokeWidth="2.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                    >
                        <path d="m6 9 6 6 6-6" />
                    </svg>
                </button>
            </div>
        </div>
    );
}
