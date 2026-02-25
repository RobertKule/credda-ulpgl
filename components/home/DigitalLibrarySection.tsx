"use client";

import React from "react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Link } from "@/navigation";
import { BookOpen } from "lucide-react";
import { useTranslations } from "next-intl";

export default function DigitalLibrarySection() {
    const t = useTranslations('HomePage');

    return (
        <section className="py-16 sm:py-24 lg:py-32 bg-white relative overflow-hidden">
            <div className="container mx-auto px-4 sm:px-6 relative z-10">
                <div className="bg-slate-50 border border-slate-100 p-8 sm:p-12 lg:p-16 flex flex-col md:flex-row items-center justify-between gap-10">
                    <div className="max-w-2xl space-y-6">
                        <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 mb-6">
                            <BookOpen size={28} />
                        </div>
                        <h2 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-slate-900 leading-[1.1]">
                            <span dangerouslySetInnerHTML={{ __html: t.raw('library.title') }} />
                        </h2>
                        <p className="text-base sm:text-lg text-slate-500 font-light leading-relaxed">
                            {t('library.description')}
                        </p>
                        <div className="pt-4">
                            <Link href="/publications" className="group inline-flex items-center justify-center px-8 py-4 bg-slate-950 text-white font-black uppercase tracking-widest text-[10px] hover:bg-blue-600 transition-all rounded-none shadow-xl hover:shadow-2xl hover:-translate-y-1">
                                {t('library.cta')}
                            </Link>
                        </div>
                    </div>
                    <div className="relative w-full md:w-1/2 aspect-square max-w-md">
                        <div className="absolute inset-0 bg-gradient-to-tr from-blue-100 to-emerald-50 rounded-[40px] rotate-6 transform group-hover:rotate-12 transition-all duration-700" />
                        <div className="absolute inset-0 bg-white rounded-[40px] shadow-2xl p-6 transform -rotate-3 transition-all duration-700 hover:rotate-0 flex flex-col items-center justify-center border border-slate-100 overflow-hidden">
                            <Image src="/images/gallery/ppppppppp.png" alt="Bibliothèque CREDDA" width={300} height={300} className="object-cover opacity-80" />
                            <div className="absolute inset-0 bg-blue-900/10 mix-blend-multiply" />
                        </div>
                        {/* Decors flottants */}
                        <div className="absolute -top-6 -right-6 w-24 h-24 bg-blue-500/10 rounded-full blur-xl animate-pulse" />
                        <div className="absolute -bottom-8 -left-8 w-32 h-32 bg-emerald-500/10 rounded-full blur-xl animate-pulse delay-1000" />
                    </div>
                </div>
            </div>
        </section>
    );
}
