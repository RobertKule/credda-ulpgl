"use client";

import React from "react";
import { Award, BookOpen, Globe2, Users } from "lucide-react";
import StatCard from "@/components/ui/StatCard";

interface StatsSectionProps {
    stats: {
        totalResources: number;
        publications: number;
        clinicalArticles: number;
        researchArticles: number;
    };
}

export default function StatsSection({ stats }: StatsSectionProps) {
    const currentYear = new Date().getFullYear();
    const yearsOfExpertise = currentYear - 2008;

    const statItems = [
        {
            icon: Award,
            number: yearsOfExpertise,
            label: "Années d'Expertise",
        },
        {
            icon: BookOpen,
            number: stats.publications || 120, // Fallback if missing
            label: "Publications & Rapports",
        },
        {
            icon: Globe2,
            number: 15,
            label: "Partenaires Internationaux",
        },
        {
            icon: Users,
            number: "12 000+",
            label: "Bénéficiaires Clinique",
        }
    ];

    return (
        <section className="py-20 md:py-32 bg-slate-50 relative z-20">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-8">
                    {statItems.map((item, index) => (
                        <StatCard
                            key={index}
                            icon={item.icon}
                            number={item.number}
                            label={item.label}
                            delay={index * 0.1}
                        />
                    ))}
                </div>
            </div>
        </section>
    );
}
