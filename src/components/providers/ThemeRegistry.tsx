"use client";

import * as React from "react";
import { useServerInsertedHTML } from "next/navigation";
import createCache from "@emotion/cache";
import { CacheProvider } from "@emotion/react";
import { CssBaseline, ThemeProvider } from "@mui/material";

import theme, { roboto } from "../../styles/theme";

type Props = {
  children: React.ReactNode;
};

function createEmotionCache() {
  const cache = createCache({
    key: "mui",
    prepend: true,
  });

  cache.compat = true;

  return cache;
}

export function ThemeRegistry({ children }: Props) {
  const [{ cache, flush }] = React.useState(() => {
    const cache = createEmotionCache();
    const previousInsert = cache.insert;
    let injected: string[] = [];

    cache.insert = (...args) => {
      const serialized = args[1];

      if (cache.inserted[serialized.name] === undefined) {
        injected.push(serialized.name);
      }

      return previousInsert(...args);
    };

    const flush = () => {
      const prev = injected;
      injected = [];
      return prev;
    };

    return { cache, flush };
  });

  useServerInsertedHTML(() => {
    const names = flush();

    if (names.length === 0) {
      return null;
    }

    let styles = "";
    for (const name of names) {
      styles += cache.inserted[name];
    }

    return (
      <style
        key={cache.key}
        data-emotion={`${cache.key} ${names.join(" ")}`}
        dangerouslySetInnerHTML={{ __html: styles }}
      />
    );
  });

  return (
    <CacheProvider value={cache}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <div className={roboto.variable}>{children}</div>
      </ThemeProvider>
    </CacheProvider>
  );
}
