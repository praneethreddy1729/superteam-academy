"use client";

import { useTheme } from "next-themes";
import { Highlight, themes } from "prism-react-renderer";
import { CodeCopyButton } from "@/components/shared/CodeCopyButton";

const languageMap: Record<string, string> = {
  js: "javascript",
  ts: "typescript",
  jsx: "jsx",
  tsx: "tsx",
  sh: "bash",
  shell: "bash",
  rs: "rust",
  py: "python",
};

export function ThemedCodeBlock({ code, language }: { code: string; language: string }) {
  const { resolvedTheme } = useTheme();
  const isDark = resolvedTheme !== "light";
  const prismLanguage = languageMap[language] ?? language ?? "text";

  return (
    <div className="group relative my-4">
      <div className="flex items-center justify-between rounded-t-lg bg-gray-100 px-4 py-2 text-xs text-muted-foreground dark:bg-[#1e1e2e]">
        <span className="font-mono">{language}</span>
        <CodeCopyButton code={code} />
      </div>
      <Highlight theme={isDark ? themes.vsDark : themes.vsLight} code={code} language={prismLanguage}>
        {({ className, style, tokens, getLineProps, getTokenProps }) => (
          <pre
            className={`${className} overflow-x-auto rounded-b-lg p-4 font-mono text-sm`}
            style={style}
          >
            {tokens.map((line, i) => (
              <div key={i} {...getLineProps({ line })}>
                {line.map((token, key) => (
                  <span key={key} {...getTokenProps({ token })} />
                ))}
              </div>
            ))}
          </pre>
        )}
      </Highlight>
    </div>
  );
}
