import { createClient } from "npm:@supabase/supabase-js@2.57.4";
import { serveSite } from "./adapter.mjs";
import { handleApp } from "./handler.mjs";

const env = (name: string) => Deno.env.get(name);

Deno.serve(serveSite(
  (deps: { request: Request; supabase: unknown }) =>
    handleApp({ ...deps, env }) as Promise<Response>,
  { createClient, env },
));
