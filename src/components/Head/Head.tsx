import NextHead from "next/head";

interface Props {
  prefix: string;
}

export function Head({ prefix }: Props) {
  return (
    <NextHead>
      <title>{prefix} | Incident Commander</title>
      <meta name="description" content={`${prefix} | Incident Commander`} />
    </NextHead>
  );
}
