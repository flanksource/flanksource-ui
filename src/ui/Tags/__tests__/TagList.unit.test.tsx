import { sortTags } from "../TagList";

import { render, screen } from "@testing-library/react";
import { TagItem } from "../TagList";

import { TagList } from "../TagList";

describe("sortTags", () => {
  it("sorts tags by key", () => {
    const tags = [
      { key: "name", value: "foo" },
      { key: "account", value: "bar" },
      { key: "namespace", value: "baz" },
      { key: "foo", value: "qux" },
      { key: "bar", value: "qux" }
    ];
    const sortedTags = sortTags(tags);
    expect(sortedTags).toMatchInlineSnapshot(`
      [
        {
          "key": "account",
          "value": "bar",
        },
        {
          "key": "namespace",
          "value": "baz",
        },
        {
          "key": "name",
          "value": "foo",
        },
        {
          "key": "bar",
          "value": "qux",
        },
        {
          "key": "foo",
          "value": "qux",
        },
      ]
    `);
  });

  it("sorts tags with same key alphabetically", () => {
    const tags = [
      { key: "name", value: "foo" },
      { key: "account", value: "bar" },
      { key: "namespace", value: "baz" },
      { key: "account", value: "qux" }
    ];
    const sortedTags = sortTags(tags);
    expect(sortedTags).toMatchInlineSnapshot(`
      [
        {
          "key": "account",
          "value": "qux",
        },
        {
          "key": "account",
          "value": "bar",
        },
        {
          "key": "namespace",
          "value": "baz",
        },
        {
          "key": "name",
          "value": "foo",
        },
      ]
    `);
  });

  it("sorts tags with same key alphabetically, ignoring case", () => {
    const tags = [
      { key: "name", value: "foo" },
      { key: "account", value: "bar" },
      { key: "Account", value: "baz" },
      { key: "account", value: "qux" }
    ];
    const sortedTags = sortTags(tags);
    expect(sortedTags).toMatchInlineSnapshot(`
      [
        {
          "key": "account",
          "value": "qux",
        },
        {
          "key": "Account",
          "value": "baz",
        },
        {
          "key": "account",
          "value": "bar",
        },
        {
          "key": "name",
          "value": "foo",
        },
      ]
    `);
  });
});

describe("TagItem", () => {
  it("renders the tag key and value", () => {
    const tag = { key: "name", value: "foo" };
    render(<TagItem tag={tag} />);
    const keyElement = screen.getByText("name:");
    const valueElement = screen.getByText("foo");
    expect(keyElement).toBeInTheDocument();
    expect(valueElement).toBeInTheDocument();
  });
});

describe("TagList", () => {
  it("renders all tags when showAll is true", () => {
    const tags = [
      { key: "name", value: "foo" },
      { key: "account", value: "bar" },
      { key: "namespace", value: "baz" }
    ];
    render(<TagList tags={tags} />);
    const nameElement = screen.getByText("name:");
    const accountElement = screen.getByText("account:");
    const namespaceElement = screen.getByText("namespace:");
    expect(nameElement).toBeInTheDocument();
    expect(accountElement).toBeInTheDocument();
    expect(namespaceElement).toBeInTheDocument();
  });
});
