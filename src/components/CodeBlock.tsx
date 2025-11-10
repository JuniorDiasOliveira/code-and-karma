import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { useState } from 'react';

interface CodeBlockProps {
  language: string;
  children: string;
  title?: string;
  showLineNumbers?: boolean;
  className?: string;
}

// Neon color constants
const NEON_COLORS = {
  green: '#00F5A0',
  cyan: '#00D9F5', 
  magenta: '#FF00F5',
  gray: {
    light: '#E5E7EB',
    medium: '#6B7280',
  },
  error: '#EF4444',
  background: 'oklch(0.12 0.02 250)',
} as const;

// Base styles for consistent theming
const BASE_STYLES = {
  fontFamily: 'var(--font-mono)',
  fontSize: '0.95em',
  lineHeight: '1.6',
  tabSize: 2,
} as const;

// Custom neon theme for syntax highlighting
const createNeonTheme = () => ({
  'code[class*="language-"]': {
    color: NEON_COLORS.gray.light,
    background: 'none',
    ...BASE_STYLES,
    textAlign: 'left' as const,
    whiteSpace: 'pre' as const,
    wordSpacing: 'normal',
    wordBreak: 'normal' as const,
    wordWrap: 'normal' as const,
    hyphens: 'none' as const,
  },
  'pre[class*="language-"]': {
    color: NEON_COLORS.gray.light,
    background: NEON_COLORS.background,
    ...BASE_STYLES,
    textAlign: 'left' as const,
    whiteSpace: 'pre' as const,
    wordSpacing: 'normal',
    wordBreak: 'normal' as const,
    wordWrap: 'normal' as const,
    hyphens: 'none' as const,
    padding: '1.5em',
    margin: '0',
    overflow: 'auto',
    borderRadius: '0.5rem',
    border: 'none',
  },
  // Comments and metadata
  comment: { color: NEON_COLORS.gray.medium, fontStyle: 'italic' },
  prolog: { color: NEON_COLORS.gray.medium },
  doctype: { color: NEON_COLORS.gray.medium },
  cdata: { color: NEON_COLORS.gray.medium },
  
  // Punctuation and operators
  punctuation: { color: NEON_COLORS.gray.light },
  operator: { color: NEON_COLORS.gray.light },
  
  // Properties and tags (green theme)
  property: { color: NEON_COLORS.green },
  tag: { color: NEON_COLORS.green },
  inserted: { color: NEON_COLORS.green },
  entity: { color: NEON_COLORS.green, cursor: 'help' },
  variable: { color: NEON_COLORS.green },
  'class-name': { color: NEON_COLORS.green },
  
  // Values and constants (magenta theme)
  boolean: { color: NEON_COLORS.magenta },
  number: { color: NEON_COLORS.magenta },
  constant: { color: NEON_COLORS.magenta },
  symbol: { color: NEON_COLORS.magenta },
  atrule: { color: NEON_COLORS.magenta },
  function: { color: NEON_COLORS.magenta },
  keyword: { color: NEON_COLORS.magenta, fontWeight: 'bold' },
  important: { color: NEON_COLORS.magenta, fontWeight: 'bold' },
  
  // Strings and attributes (cyan theme)
  selector: { color: NEON_COLORS.cyan },
  'attr-name': { color: NEON_COLORS.cyan },
  string: { color: NEON_COLORS.cyan },
  char: { color: NEON_COLORS.cyan },
  builtin: { color: NEON_COLORS.cyan },
  url: { color: NEON_COLORS.cyan },
  'attr-value': { color: NEON_COLORS.cyan },
  regex: { color: NEON_COLORS.cyan },
  '.language-css .token.string': { color: NEON_COLORS.cyan },
  '.style .token.string': { color: NEON_COLORS.cyan },
  
  // Error states
  deleted: { color: NEON_COLORS.error },
});

const neonTheme = createNeonTheme();

const CopyButton = ({ code }: { code: string }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code:', err);
    }
  };

  return (
    <button
      onClick={handleCopy}
      className="absolute top-3 right-3 p-2 rounded-md bg-muted/50 hover:bg-muted transition-colors"
      title={copied ? 'Copied!' : 'Copy code'}
      aria-label={copied ? 'Code copied to clipboard' : 'Copy code to clipboard'}
    >
      {copied ? (
        <svg className="w-4 h-4 text-primary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
        </svg>
      ) : (
        <svg className="w-4 h-4 text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
        </svg>
      )}
    </button>
  );
};

const CodeHeader = ({ title, language }: { title?: string; language: string }) => {
  if (!title && !language) return null;

  return (
    <div className="flex items-center justify-between px-4 py-2 bg-muted/30 border-b border-border/50">
      <div className="flex items-center gap-2">
        {title && (
          <span className="text-sm font-medium text-foreground">{title}</span>
        )}
        <span className="text-xs px-2 py-1 rounded bg-primary/20 text-primary">
          {language.toUpperCase()}
        </span>
      </div>
    </div>
  );
};

export default function CodeBlock({ 
  language, 
  children, 
  title, 
  showLineNumbers = false,
  className = '' 
}: CodeBlockProps) {
  const hasHeader = title || language;
  
  return (
    <div className={`my-6 rounded-lg overflow-hidden neon-border-glow relative ${className}`}>
      {hasHeader && <CodeHeader title={title} language={language} />}
      
      <div className="relative">
        <SyntaxHighlighter
          language={language}
          style={neonTheme}
          showLineNumbers={showLineNumbers}
          customStyle={{
            margin: 0,
            background: NEON_COLORS.background,
            padding: hasHeader ? '1.5rem' : '1.5rem',
          }}
          codeTagProps={{
            style: {
              ...BASE_STYLES,
            }
          }}
        >
          {children}
        </SyntaxHighlighter>
        
        <CopyButton code={children} />
      </div>
    </div>
  );
}
