import { useMemo } from "react";
import clsx from "clsx";
import { SearchSelect, OptionItem } from "../SearchSelect";

/* TODO: tests */
const compress = (total: number, ls: string[]) => {
  const evenSplit = Math.floor(total / ls.length);
  const shorts = ls
    .filter((x) => x.length < evenSplit)
    .map((x) => evenSplit - x.length);
  const longsCount = ls.length - shorts.length;

  const leftOver = shorts.reduce((acc, x) => acc + x, 0);
  const adjustedSplit = leftOver / longsCount;

  return ls.map((x) => {
    if (x.length < evenSplit) return x;
    const halfLen = Math.floor((evenSplit + adjustedSplit) / 2);
    return `${x.slice(0, halfLen)}⋯${x.slice(-halfLen)}`;
  });
};

interface TagOptionProps {
  tagKey?: string;
  value?: string;
  compressedTo?: number;
}

function TagOption({ tagKey, value, compressedTo }: TagOptionProps) {
  let [keyStr, valueStr] = [tagKey, value];
  if (compressedTo && tagKey && value) {
    [keyStr, valueStr] = compress(compressedTo, [tagKey, value]);
  }

  return (
    <div
      className={clsx(
        "rounded bg-gray-200 px-1 text-gray-600",
        compressedTo && "whitespace-nowrap font-mono"
      )}
      data-title={`${tagKey}: ${value}`}
      title={`${tagKey}: ${value}`}
      key={tagKey}
    >
      {value !== "All" ? (
        <>
          {keyStr}: <span className="font-light">{valueStr}</span>
        </>
      ) : (
        <span>All</span>
      )}
    </div>
  );
}

function RenderSelection({ label, value }: OptionItem) {
  if (value === "All") {
    return <TagOption tagKey="All" value="All" />;
  }

  const [key, val] = value?.split("__:__") || [];

  return <TagOption tagKey={key} value={val} compressedTo={28} />;
}

type Tag = [string, string];

interface SearchSelectTagProps {
  tags: Tag[];
  value: string;
  onChange: (OptionItem: any) => void;
  className?: string;
}

export function SearchSelectTag({
  tags,
  onChange,
  value = "All",
  className
}: SearchSelectTagProps) {
  const tagList = useMemo(() => {
    if (!tags)
      return [
        {
          label: "All",
          data: [],
          value: "All"
        }
      ];
    const seen = new Set();
    const tagList = tags
      .map(([key, val]) => {
        const itemVal = `${key}__:__${val}`;

        if (seen.has(itemVal)) return null;
        seen.add(itemVal);

        return {
          value: itemVal,
          data: [key, val],
          label: <TagOption tagKey={key} value={val} />
        };
      })
      .filter(Boolean) as [];

    return [
      {
        label: "All",
        data: [],
        value: "All"
      }
    ].concat(tagList);
  }, [tags]);

  const selected = useMemo(
    () => tagList.find((x) => x.value === value),
    [tagList, value]
  );

  return (
    <SearchSelect
      className={className}
      name=""
      selected={selected!}
      options={tagList}
      onChange={onChange}
      components={{
        /* @ts-expect-error */
        RenderSelection
      }}
    />
  );
}
