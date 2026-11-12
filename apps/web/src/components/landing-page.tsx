"use client";

import { useEffect, useState } from "react";
import { Link } from "@/i18n/navigation";
import { useTranslations } from "next-intl";
import { useSearchParams } from "next/navigation";
import {
    ArrowRight,
    CloudSun,
    Droplets,
    Leaf,
    Map,
    Sprout,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ThemeToggle } from "@/components/theme-toggle";
import { LanguageSwitcher } from "@/components/language-switcher";
import { SignInModal } from "@/components/sign-in-modal";
import { FieldRaster, IMAGERY } from "@/components/marketing/scene";

const FEATURES = [
    { key: "monitoring", icon: Map },
    { key: "weather", icon: CloudSun },
    { key: "soil", icon: Droplets },
    { key: "crops", icon: Sprout },
];

export function LandingPage({ isAuthenticated = false }: { isAuthenticated?: boolean }) {
    const t = useTranslations("landing");
    const tc = useTranslations("common");
    const searchParams = useSearchParams();
    const [signInOpen, setSignInOpen] = useState(false);

    useEffect(() => {
        if (searchParams.get("signin") === "true" && !isAuthenticated) {
            setSignInOpen(true);
        }
    }, [searchParams, isAuthenticated]);

    const openApp = () => setSignInOpen(true);

    return (
        <div className="flex min-h-screen flex-col bg-background text-foreground">
            {!isAuthenticated && <SignInModal open={signInOpen} onOpenChange={setSignInOpen} />}

            <header className="sticky top-0 z-50 border-b bg-background/95 backdrop-blur">
                <nav className="mx-auto flex h-16 w-full max-w-6xl items-center justify-between gap-4 px-5 sm:px-6">
                    <Link href="/" className="flex items-center gap-2 text-[17px] font-bold tracking-tight">
                        <Leaf className="h-5 w-5 text-primary" strokeWidth={2} />
                        AgriTech Africa
                    </Link>

                    <div className="flex items-center gap-2 sm:gap-4">
                        <div className="hidden items-center gap-4 text-[13px] text-muted-foreground sm:flex">
                            <a href="#home" className="transition-colors hover:text-foreground">{t("navHome")}</a>
                            <a href="#about" className="transition-colors hover:text-foreground">{t("navAbout")}</a>
                            <a href="#features" className="transition-colors hover:text-foreground">{t("navFeatures")}</a>
                        </div>
                        <LanguageSwitcher side="bottom" align="end" />
                        <ThemeToggle />
                        {isAuthenticated ? (
                            <Button size="sm" asChild>
                                <Link href="/dashboard">{tc("dashboard")}</Link>
                            </Button>
                        ) : (
                            <Button size="sm" onClick={openApp}>{tc("signIn")}</Button>
                        )}
                    </div>
                </nav>
            </header>

            <main>
                <section id="home" className="relative isolate overflow-hidden border-b">
                    <div
                        className="absolute inset-0 opacity-30"
                        style={{ backgroundImage: IMAGERY }}
                        aria-hidden="true"
                    />
                    <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/90 to-background" aria-hidden="true" />
                    <div className="relative mx-auto grid w-full max-w-6xl items-center gap-10 px-5 py-16 sm:px-6 sm:py-20 lg:grid-cols-[1.05fr_0.95fr] lg:gap-16 lg:py-28">
                        <div>
                            <div className="inline-flex items-center gap-2 rounded-full border bg-background/90 px-3 py-1.5 text-[12px] text-muted-foreground">
                                <span className="h-1.5 w-1.5 rounded-full bg-primary" aria-hidden="true" />
                                {t("badge")}
                            </div>
                            <h1 className="mt-5 max-w-[12ch] text-4xl font-bold leading-[1.08] tracking-tight sm:text-5xl lg:text-6xl">
                                {t("heroTitle")}
                            </h1>
                            <p className="mt-5 max-w-[50ch] text-base leading-relaxed text-muted-foreground sm:text-lg">
                                {t("heroDesc")}
                            </p>
                            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                                {isAuthenticated ? (
                                    <Button size="lg" asChild>
                                        <Link href="/dashboard">
                                            {t("getStarted")}
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                ) : (
                                    <Button size="lg" onClick={openApp}>
                                        {t("getStarted")}
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Button>
                                )}
                                {isAuthenticated ? (
                                    <Button variant="outline" size="lg" asChild>
                                        <Link href="/dashboard">{tc("dashboard")}</Link>
                                    </Button>
                                ) : (
                                    <Button variant="outline" size="lg" onClick={openApp}>
                                        {tc("signIn")}
                                    </Button>
                                )}
                            </div>
                        </div>

                        <div className="relative mx-auto w-full max-w-md overflow-hidden rounded-xl border bg-surface-3/95 p-4 shadow-panel">
                            <div className="flex items-center justify-between border-b pb-3">
                                <div>
                                    <p className="text-sm font-semibold">{t("visualTitle")}</p>
                                    <p className="mt-0.5 text-xs text-muted-foreground">{t("visualDesc")}</p>
                                </div>
                                <Leaf className="h-5 w-5 text-primary" />
                            </div>
                            <div className="relative mt-4 h-64 overflow-hidden rounded-lg border bg-muted">
                                <FieldRaster cols={8} rows={10} className="absolute inset-0 h-full w-full" />
                                <div className="absolute inset-x-4 bottom-4 rounded-lg border bg-background/95 p-3 shadow-sm">
                                    <p className="text-xs font-semibold">{t("visualCardTitle")}</p>
                                    <p className="mt-1 text-xs leading-relaxed text-muted-foreground">{t("visualCardDesc")}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>

                <section id="about" className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">{t("aboutTag")}</p>
                        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{t("aboutTitle")}</h2>
                        <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t("aboutDesc")}</p>
                    </div>
                </section>

                <section id="features" className="border-y bg-surface-2">
                    <div className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
                        <div className="max-w-2xl">
                            <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">{t("featuresTag")}</p>
                            <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{t("featuresTitle")}</h2>
                            <p className="mt-4 text-base leading-relaxed text-muted-foreground">{t("featuresDesc")}</p>
                        </div>
                        <div className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                            {FEATURES.map(({ key, icon: Icon }) => (
                                <div key={key} className="rounded-lg border bg-card p-5">
                                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary-subtle">
                                        <Icon className="h-5 w-5 text-primary" />
                                    </div>
                                    <h3 className="mt-4 text-base font-semibold">{t(`feature_${key}_title`)}</h3>
                                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`feature_${key}_desc`)}</p>
                                </div>
                            ))}
                        </div>
                    </div>
                </section>

                <section className="mx-auto w-full max-w-6xl px-5 py-16 sm:px-6 sm:py-20">
                    <div className="max-w-2xl">
                        <p className="text-xs font-semibold uppercase tracking-[0.1em] text-primary">{t("howTag")}</p>
                        <h2 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{t("howTitle")}</h2>
                    </div>
                    <div className="mt-8 grid gap-4 md:grid-cols-3">
                        {[1, 2, 3].map((step) => (
                            <div key={step} className="rounded-lg border bg-card p-5">
                                <span className="font-mono text-sm font-semibold text-primary">0{step}</span>
                                <h3 className="mt-4 text-base font-semibold">{t(`step${step}Title`)}</h3>
                                <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{t(`step${step}Desc`)}</p>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="border-t bg-primary-subtle">
                    <div className="mx-auto flex w-full max-w-6xl flex-col items-start justify-between gap-6 px-5 py-14 sm:px-6 md:flex-row md:items-center">
                        <div className="max-w-2xl">
                            <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("ctaTitle")}</h2>
                            <p className="mt-3 text-base leading-relaxed text-muted-foreground">{t("ctaDesc")}</p>
                        </div>
                        {isAuthenticated ? (
                            <Button size="lg" asChild>
                                <Link href="/dashboard">{t("getStarted")}<ArrowRight className="ml-2 h-4 w-4" /></Link>
                            </Button>
                        ) : (
                            <Button size="lg" onClick={openApp}>{t("getStarted")}<ArrowRight className="ml-2 h-4 w-4" /></Button>
                        )}
                    </div>
                </section>
            </main>

            <footer className="border-t">
                <div className="mx-auto flex w-full max-w-6xl flex-wrap items-center justify-between gap-4 px-5 py-6 text-[13px] text-muted-foreground sm:px-6">
                    <span className="flex items-center gap-2"><Leaf className="h-4 w-4 text-primary" />AgriTech Africa · © 2026</span>
                    <span>{t("footerTagline")}</span>
                </div>
            </footer>
        </div>
    );
}
