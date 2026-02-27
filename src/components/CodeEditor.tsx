"use client"

import { Editor } from "@monaco-editor/react"

interface CodeEditorProps {
    code: string;
    language: string;
    onChange: (value: string | undefined) => void;
}

export default function CodeEditor({ code, language, onChange }: CodeEditorProps) {
    return (
        <Editor
            height="100%"
            language={language}
            theme="vs-dark"
            value={code}
            onChange={onChange}
            options={{
                minimap: { enabled: false },
                fontSize: 14,
                fontFamily: "var(--font-mono), monospace",
                padding: { top: 16 },
                scrollBeyondLastLine: false,
                smoothScrolling: true,
                cursorBlinking: "smooth",
                cursorSmoothCaretAnimation: "on",
            }}
        />
    )
}
