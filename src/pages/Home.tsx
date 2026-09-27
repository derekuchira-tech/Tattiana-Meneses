import { useCallback, useEffect, useState } from "react";
import { Header } from "@app/components/site/Header";
import { Hero } from "@app/components/site/Hero";
import { About } from "@app/components/site/About";
import { Socials } from "@app/components/site/Socials";
import { Recommendations } from "@app/components/site/Recommendations";
import { Ebooks } from "@app/components/site/Ebooks";
import { Contact } from "@app/components/site/Contact";
import { Footer } from "@app/components/site/Footer";
import { fetchCatalog, type Catalog } from "@app/lib/catalog";

export function Home() {
  const [state, setState] = useState<"loading" | "ready" | "error">("loading");
  const [catalog, setCatalog] = useState<Catalog | null>(null);

  const load = useCallback((signal?: AbortSignal) => {
    setState("loading");
    fetchCatalog(signal)
      .then((data) => {
        setCatalog(data);
        setState("ready");
      })
      .catch((error) => {
        if (signal?.aborted) return;
        console.error("catalog load failed", error);
        setState("error");
      });
  }, []);

  useEffect(() => {
    const controller = new AbortController();
    load(controller.signal);
    return () => controller.abort();
  }, [load]);

  return (
    <>
      <Header />
      <main>
        <Hero />
        <About />
        <Socials />
        <Recommendations state={state} catalog={catalog} onRetry={() => load()} />
        <Ebooks />
        <Contact />
      </main>
      <Footer />
    </>
  );
}
