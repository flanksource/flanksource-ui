import NextHead from "next/head";

interface Props {
  prefix: string;
  suffix?: string;
}

export function Head({ prefix, suffix = " | Mission Control" }: Props) {
  return (
    <NextHead>
      <title>
        {prefix}
        {suffix}
      </title>
      <meta name="description" content={`${prefix}${suffix}`} />
    </NextHead>
  );
}
