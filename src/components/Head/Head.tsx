import NextHead from "next/head";

interface Props {
  prefix: string;
}

export function Head({ prefix }: Props) {
  return (
    <NextHead>
      <title>{prefix} | Mission Control</title>
      <meta name="description" content={`${prefix} | Mission Control`} />
    </NextHead>
  );
}
