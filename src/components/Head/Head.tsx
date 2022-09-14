import NextHead from "next/head";

interface Props {
  prefix: string;
}

export function Head({ prefix }: Props) {
  return (
    <NextHead>
      <title>{prefix} - Incident Manager - Flanksource</title>
      <meta
        name="description"
        content={`${prefix} - Incident Manager - Flanksource`}
      />
    </NextHead>
  );
}
