import NextHead from "next/head";

interface Props {
  prefix: string;
}

export function Head({ prefix }: Props) {
  return (
    <NextHead>
      <title>{prefix} | Incident Commander</title>
      <meta name="description" content={`${prefix} | Incident Commander`} />
      <meta name="theme-color" content="#000000" />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link rel="preconnect" href="https://fonts.gstatic.com" />
      <link
        href="https://fonts.googleapis.com/css2?family=Open+Sans:ital,wght@0,300;0,400;0,500;0,600;0,700;1,300;1,400;1,500;1,600&display=swap"
        rel="stylesheet"
      />
    </NextHead>
  );
}
