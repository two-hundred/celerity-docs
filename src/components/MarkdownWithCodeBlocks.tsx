import React from 'react';
import Markdown from 'react-markdown';

import CodeBlock from '@theme/CodeBlock';

type Props = {
    children: string;
}

export default function MarkdownWithCodeBlocks({ children }: Readonly<Props>) {
    return <Markdown components={{
        pre({ children }) {
            return children
        },
        code({ children, className, ...rest }) {
            // A language match would indicate that this should be a code block
            // and not inline code.
            const isBlock = /language-(\w+)/.exec(className || '');

            return isBlock ? <CodeBlock {...rest}>{children}</CodeBlock> : (
                <code {...rest} className={className}>
                    {children}
                </code>
            )
        }
    }}>{children}</Markdown>
}
