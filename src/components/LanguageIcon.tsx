import { SiPython, SiJavascript, SiTypescript, SiC, SiCplusplus, SiGo, SiRust, SiRuby, SiPhp, SiSwift, SiKotlin } from 'react-icons/si';
import { FaJava } from 'react-icons/fa';
import { TbBrandCSharp } from 'react-icons/tb';
import { FileCode2 } from 'lucide-react';

interface LanguageIconProps {
    language: string;
    className?: string;
}

export default function LanguageIcon({ language, className = "w-5 h-5" }: LanguageIconProps) {
    if (!language) return <FileCode2 className={className} />;

    const lang = language.toLowerCase();
    switch (lang) {
        case 'python': return <SiPython className={className} />;
        case 'java': return <FaJava className={className} />;
        case 'javascript':
        case 'js':
        case 'jsx': return <SiJavascript className={className} />;
        case 'typescript':
        case 'ts':
        case 'tsx': return <SiTypescript className={className} />;
        case 'c': return <SiC className={className} />;
        case 'cpp':
        case 'c++': return <SiCplusplus className={className} />;
        case 'c#':
        case 'csharp': return <TbBrandCSharp className={className} />;
        case 'go':
        case 'golang': return <SiGo className={className} />;
        case 'rust': return <SiRust className={className} />;
        case 'ruby': return <SiRuby className={className} />;
        case 'php': return <SiPhp className={className} />;
        case 'swift': return <SiSwift className={className} />;
        case 'kotlin': return <SiKotlin className={className} />;
        default: return <FileCode2 className={className} />;
    }
}
