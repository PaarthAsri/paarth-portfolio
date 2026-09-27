"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import { TerminalLine } from "@/lib/types";
import { getCommand, getCommandSuggestions } from "@/lib/commands";
import { generateId } from "@/lib/utils";

// Use a deterministic counter for initial render to avoid hydration mismatch.
// After mount, generateId() (Math.random-based) can be used safely.
import TerminalOutput from "./TerminalOutput";

let terminalLineCounter = 0;

function nextTerminalId(): string {
  terminalLineCounter += 1;
  return `tl-${terminalLineCounter}`;
}

export default function Terminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      id: "tl-initial",
      type: "system",
      content: "PAARTH://SEC Terminal v1.0 — Type 'help' for available commands",
    },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [suggestions, setSuggestions] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [lastExecuted, setLastExecuted] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const processingTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [lines]);

  useEffect(() => {
    return () => {
      if (processingTimeoutRef.current) {
        clearTimeout(processingTimeoutRef.current);
      }
    };
  }, []);

  const executeCommand = useCallback((cmd: string) => {
    const trimmed = cmd.trim();
    if (!trimmed || isProcessing) return;

    const [commandName, ...args] = trimmed.split(/\s+/);
    const command = getCommand(commandName.toLowerCase());

    const inputLine: TerminalLine = {
      id: generateId(),
      type: "input",
      content: `paarth@sec:~$ ${trimmed}`,
    };

    if (!command) {
      setLines((prev) => [
        ...prev,
        inputLine,
        {
          id: generateId(),
          type: "error",
          content: `command not found: ${commandName}`,
        },
        {
          id: generateId(),
          type: "info",
          content: "Type 'help' for available commands",
        },
      ]);
      return;
    }

    if (commandName.toLowerCase() === "clear") {
      setLines([]);
      return;
    }

    setIsProcessing(true);
    setLastExecuted(commandName);

    const result = command.execute(args);

    setLines((prev) => [...prev, inputLine]);

    processingTimeoutRef.current = setTimeout(() => {
      setLines((prev) => [...prev, ...result.lines]);
      setIsProcessing(false);

      if (result.navigate) {
        document.getElementById(result.navigate)?.scrollIntoView({ behavior: "smooth" });
      }
    }, 150);
  }, [isProcessing]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      executeCommand(input);
      setHistory((prev) => [...prev, input]);
      setHistoryIndex(-1);
      setInput("");
      setSuggestions([]);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      if (history.length > 0) {
        const newIndex = historyIndex < history.length - 1 ? historyIndex + 1 : historyIndex;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex] || "");
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1;
        setHistoryIndex(newIndex);
        setInput(history[history.length - 1 - newIndex] || "");
      } else {
        setHistoryIndex(-1);
        setInput("");
      }
    } else if (e.key === "Tab") {
      e.preventDefault();
      if (suggestions.length === 1) {
        setInput(suggestions[0] + " ");
        setSuggestions([]);
      }
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setInput(value);
    if (value.length > 0) {
      setSuggestions(getCommandSuggestions(value));
    } else {
      setSuggestions([]);
    }
  };

  const focusInput = () => {
    inputRef.current?.focus();
  };

  return (
    <div
      className={`terminal-panel border rounded-lg bg-panel/80 backdrop-blur-sm overflow-hidden transition-all duration-200 ${
        isFocused ? "border-cyber-cyan/50 shadow-[0_0_30px_rgba(0,240,255,0.08)]" : "border-border-dim"
      }`}
      onClick={focusInput}
      role="application"
      aria-label="Interactive terminal"
      aria-busy={isProcessing}
    >
      {/* Terminal header */}
      <div className="flex items-center gap-2 px-4 py-2 border-b border-border-dim bg-void/50">
        <div className="w-3 h-3 rounded-full bg-cyber-red/80" />
        <div className="w-3 h-3 rounded-full bg-cyber-amber/80" />
        <div className="w-3 h-3 rounded-full bg-cyber-green/80" />
        <span className="ml-2 text-xs font-mono text-text-dim">paarth@sec: ~</span>
        <div className="ml-auto flex items-center gap-2">
          {isProcessing && (
            <span className="text-xs font-mono text-cyber-amber animate-pulse">
              PROCESSING
            </span>
          )}
          <span
            className={`w-2 h-2 rounded-full transition-all duration-300 ${
              isFocused ? "bg-cyber-green shadow-[0_0_6px_var(--color-cyber-green)]" : "bg-text-dim"
            }`}
          />
        </div>
      </div>

      {/* Terminal output */}
      <div
        ref={scrollRef}
        className="h-64 overflow-y-auto p-4 font-mono text-sm"
        aria-live="polite"
      >
        <TerminalOutput lines={lines} />

        {/* Input line */}
        <div className="flex items-center gap-2 mt-1">
          <span className="text-cyber-green">paarth@sec</span>
          <span className="text-text-dim">:</span>
          <span className="text-cyber-blue">~</span>
          <span className="text-text-dim">$</span>
          <input
            ref={inputRef}
            type="text"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setIsFocused(false)}
            disabled={isProcessing}
            className="flex-1 bg-transparent outline-none text-text-primary caret-cyber-cyan disabled:opacity-50"
            aria-label="Terminal command input"
            autoComplete="off"
            autoCorrect="off"
            autoCapitalize="off"
            spellCheck={false}
          />
          {isFocused && !isProcessing && (
            <span className="w-0.5 h-4 bg-cyber-cyan animate-blink" />
          )}
        </div>

        {/* Suggestions */}
        {suggestions.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-2">
            {suggestions.map((s) => (
              <button
                key={s}
                onClick={() => {
                  setInput(s + " ");
                  setSuggestions([]);
                  inputRef.current?.focus();
                }}
                className="interactive-tag px-2 py-0.5 text-xs font-mono text-cyber-cyan bg-cyber-cyan/10 rounded"
              >
                {s}
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Command chips */}
      <div className="px-4 py-2 border-t border-border-dim bg-void/50 flex flex-wrap gap-2">
        {["help", "whoami", "about", "skills", "journey", "experience", "research", "writeups", "projects", "certifications", "github", "resume", "status", "scan", "theme", "contact", "clear"].map((cmd) => (
          <button
            key={cmd}
            onClick={() => {
              executeCommand(cmd);
              inputRef.current?.focus();
            }}
            disabled={isProcessing}
            className={`interactive-tag px-2 py-0.5 text-xs font-mono rounded transition-all duration-150 ${
              lastExecuted === cmd
                ? "text-cyber-cyan bg-cyber-cyan/20"
                : "text-text-secondary bg-panel hover:text-cyber-cyan hover:bg-cyber-cyan/10"
            } disabled:opacity-50 disabled:cursor-not-allowed`}
          >
            {cmd}
          </button>
        ))}
      </div>
    </div>
  );
}
