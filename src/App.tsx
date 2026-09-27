import { useEffect } from "react";
import { I18nProvider } from "@app/i18n";
import { usePath } from "@app/lib/router";
import { Home } from "@app/pages/Home";
import { Admin } from "@app/pages/Admin";
import { Toaster } from "@/components/ui/sonner";

function Router() {
  const path = usePath();

  useEffect(() => {
    if (!window.location.hash) window.scrollTo({ top: 0 });
  }, [path]);

  if (path.replace(/\/+$/, "") === "/admin") return <Admin />;
  return <Home />;
}

export default function App() {
  return (
    <I18nProvider>
      <Router />
      <Toaster position="top-center" />
    </I18nProvider>
  );
}
