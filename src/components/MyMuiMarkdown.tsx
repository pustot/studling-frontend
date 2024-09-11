import MuiMarkdown from "mui-markdown";
import * as React from "react";

export default function MyMuiMarkdown(props: { markdown: string }) {
    const { markdown } = props;
    return (
        <MuiMarkdown
            options={{
                // cancel default slugify which removed all non-alphanumerical char
                slugify: str => str,
                overrides: {
                    table: {
                        props: {
                            style: {
                                marginTop: '50px',  // 设置表格上方间距
                                marginBottom: '50px',  // 设置表格下方间距
                                borderCollapse: 'collapse',  // 可选：设置表格边框样式
                            },
                        },
                    },
                    h6: { props: { style: { scrollMarginTop: "50px" } } },
                    h5: { props: { style: { scrollMarginTop: "50px" } } },
                    h4: { props: { style: { scrollMarginTop: "50px" } } },
                    h3: {
                        props: {
                            style: { fontSize: 38, scrollMarginTop: "50px" },
                        },
                    },
                    h2: {
                        props: {
                            style: { fontSize: 46, scrollMarginTop: "50px" },
                        },
                    },
                    h1: {
                        props: {
                            style: { fontSize: 56, scrollMarginTop: "50px" },
                        },
                    },
                    img: {
                        props: {
                            style: { maxWidth: "100%" },
                        },
                    },
                },
            }}
        >
            {markdown}
        </MuiMarkdown>
    );
}