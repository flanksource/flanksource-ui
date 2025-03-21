/**
 * BlockKit to Markdown converter
 * - By Claude 3.5 Sonnet
 */

import * as nodeEmoji from "node-emoji";

// Common emoji mappings
const emojiMap: Record<string, string> = {
  red_circle: "🔴",
  green_circle: "🟢",
  blue_circle: "🔵",
  white_check_mark: "✅",
  x: "❌",
  warning: "⚠️",
  thumbsup: "👍",
  thumbsdown: "👎",
  smile: "😄",
  rocket: "🚀",
  fire: "🔥",
  bulb: "💡",
  tada: "🎉",
  heart: "❤️",
  eyes: "👀",
  thinking_face: "🤔",
  frowning_face: "😟",
  skull: "💀",
  pray: "🙏",
  point_right: "👉",
  point_left: "👈",
  hourglass: "⏳",
  stopwatch: "⏱️",
  mute: "🔇",
  sound: "🔊"
};

// Type definitions for Slack BlockKit elements
type TextObject = {
  type: string; // plain_text or mrkdwn
  text: string;
  emoji?: boolean;
  verbatim?: boolean;
};

type Element = {
  type: string;
  text?: TextObject | string;
  url?: string;
  value?: string;
  action_id?: string;
  placeholder?: TextObject;
  options?: Array<{
    text: TextObject;
    value: string;
  }>;
  accessory?: any;
  image_url?: string;
  alt_text?: string;
  elements?: Array<{
    type: string;
    text?: string;
    url?: string;
    name?: string;
    elements?: any[];
  }>;
  name?: string;
  style?: string;
};

type Block = {
  type: string;
  text?: TextObject;
  fields?: TextObject[];
  elements?: Element[];
  accessory?: Element;
  title?: TextObject;
  block_id?: string;
  image_url?: string;
  alt_text?: string;
  label?: TextObject;
  element?: {
    type: string;
    placeholder?: TextObject;
    options?: Array<{
      text: TextObject;
      value: string;
    }>;
  };
};

export type SlackMessage = {
  blocks: Block[];
  text?: string;
};

type BlockElement = Element & {
  label?: TextObject;
  element?: {
    type: string;
    placeholder?: TextObject;
    options?: Array<{
      text: TextObject;
      value: string;
    }>;
  };
};

/**
 * Converts formatted text from Slack's mrkdwn format to standard Markdown
 * Handles basic formatting like *bold*, _italic_, ~strikethrough~, etc.
 */
function processMrkdwn(text: string): string {
  if (!text) return "";

  // Handle emoji shortcodes first with our custom map
  text = text.replace(/:([\w-]+):/g, (match, shortcode) => {
    // Try our custom map first
    if (emojiMap[shortcode]) {
      return emojiMap[shortcode];
    }

    // Fall back to node-emoji
    try {
      const emoji = nodeEmoji.get(shortcode);
      return emoji === `:${shortcode}:` ? match : emoji || match;
    } catch (e) {
      // If there's any error, return the original match
      return match;
    }
  });

  // Then handle all other Markdown formatting
  return (
    text
      // Code blocks (preserve multiline code blocks)
      .replace(
        /```([\s\S]*?)```/g,
        (_, code) => "```\n" + code.trim() + "\n```"
      )
      // Inline code
      .replace(/`([^`]+)`/g, "`$1`")
      // Bold
      .replace(/\*([^*]+)\*/g, "**$1**")
      // Italic - avoid matching underscores in words and emoji shortcodes
      .replace(/(?<!\S)_([^_]+)_(?!\S)/g, "*$1*")
      // Strikethrough
      .replace(/~([^~]+)~/g, "~~$1~~")
      // Block quotes
      .replace(/^&gt;(.*)$/gm, "> $1")
      // URLs
      .replace(/<(https?:\/\/[^|>]+)>/g, "$1")
      // URLs with labels
      .replace(/<(https?:\/\/[^|>]+)\|([^>]+)>/g, "[$2]($1)")
      // User mentions
      .replace(/<@([A-Z0-9]+)>/g, "@user")
      // Channel mentions
      .replace(/<#([A-Z0-9]+)\|([^>]+)>/g, "#$2")
  );
}

/**
 * Process a text object from BlockKit
 */
function processTextObject(textObj: TextObject | string | undefined): string {
  console.log("textObj", textObj);
  if (!textObj) return "";

  if (typeof textObj === "string") return textObj;

  return textObj.type === "mrkdwn" ? processMrkdwn(textObj.text) : textObj.text;
}

/**
 * Main function to convert a Slack BlockKit message to Markdown
 */
export default function blockKitToMarkdown(message: SlackMessage): string {
  if (!message || !message.blocks || !Array.isArray(message.blocks)) {
    return message?.text || "";
  }

  const mdLines: string[] = [];

  message.blocks.forEach((block, blockIndex) => {
    const blockWithElement = block as BlockElement;

    switch (block.type) {
      case "header":
        if (block.text) {
          mdLines.push(`# ${processTextObject(block.text)}`);
          mdLines.push("---");
        }
        break;

      case "section":
        if (block.fields && block.fields.length > 0) {
          // Handle multi-column layout with fields
          const fieldLines = block.fields.map(
            (field) => `- ${processTextObject(field)}`
          );
          mdLines.push(...fieldLines);
        } else if (block.text) {
          mdLines.push(processTextObject(block.text));
        }

        // Handle section with accessory (like an image or button)
        if (block.accessory) {
          handleAccessory(block.accessory, mdLines);
        }
        break;

      case "image":
        if (block.image_url && block.alt_text) {
          mdLines.push(`![${block.alt_text}](${block.image_url})`);
        }
        break;

      case "context":
        if (block.elements && block.elements.length > 0) {
          const contextLines = block.elements
            .map((element) => {
              if (element.type === "image") {
                return element.image_url && element.alt_text
                  ? `![${element.alt_text}](${element.image_url})`
                  : "";
              } else if (
                element.type === "plain_text" ||
                element.type === "mrkdwn"
              ) {
                return `*Context:* ${processTextObject(element as TextObject)}`;
              } else if (element.text) {
                // Convert the text to a TextObject if it's a string
                const textObj =
                  typeof element.text === "string"
                    ? { type: "plain_text", text: element.text }
                    : element.text;
                return `*Context:* ${processTextObject(textObj)}`;
              }
              return "";
            })
            .filter((line) => line);

          mdLines.push(...contextLines);
        }
        break;

      case "divider":
        mdLines.push("---");
        break;

      case "actions":
        if (block.elements) {
          const actionLines = block.elements
            .map((el) => {
              if (el.type === "button" && el.text && el.url) {
                // Convert the text to a TextObject if it's a string
                const textObj =
                  typeof el.text === "string"
                    ? { type: "plain_text", text: el.text }
                    : el.text;
                return `[${processTextObject(textObj)}](${el.url})`;
              } else if (el.type === "button" && el.text) {
                // Convert the text to a TextObject if it's a string
                const textObj =
                  typeof el.text === "string"
                    ? { type: "plain_text", text: el.text }
                    : el.text;
                return `- ${processTextObject(textObj)}`;
              }
              return "";
            })
            .filter((line) => line);

          mdLines.push(...actionLines);
        }
        break;

      case "input":
        if (blockWithElement.label && blockWithElement.element) {
          mdLines.push(`**${processTextObject(blockWithElement.label)}**`);

          if (
            blockWithElement.element.type === "plain_text_input" &&
            blockWithElement.element.placeholder
          ) {
            mdLines.push(
              `*Input field:* ${processTextObject(blockWithElement.element.placeholder)}`
            );
          } else if (
            blockWithElement.element.type === "select" &&
            blockWithElement.element.placeholder
          ) {
            mdLines.push(
              `*Dropdown:* ${processTextObject(blockWithElement.element.placeholder)}`
            );

            if (
              blockWithElement.element.options &&
              blockWithElement.element.options.length > 0
            ) {
              const optionLines = blockWithElement.element.options.map(
                (option) => `  - ${processTextObject(option.text)}`
              );
              mdLines.push(...optionLines);
            }
          }
        }
        break;

      case "rich_text":
        // For rich_text blocks, traverse the elements and convert them
        if (block.elements) {
          const richTextLines = processRichTextElements(block.elements);
          mdLines.push(...richTextLines);
        }
        break;

      case "file":
        mdLines.push(`*File attachment*`);
        break;

      default:
        // Handle unknown block types
        if (block.text) {
          mdLines.push(processTextObject(block.text));
        }
        break;
    }
  });

  // Clean up extra newlines
  return cleanupMarkdown(mdLines.join("\n"));
}

/**
 * Process rich text elements (Slack's newer rich text format)
 */
function processRichTextElements(elements: Element[]): string[] {
  if (!elements || !elements.length) return [];

  const lines: string[] = [];
  let currentLine = "";

  elements.forEach((element) => {
    if (element.type === "rich_text_section" && element.elements) {
      element.elements.forEach((subElement) => {
        if (subElement.type === "text") {
          currentLine += subElement.text || "";
        } else if (subElement.type === "link" && subElement.url) {
          currentLine += `[${subElement.text || ""}](${subElement.url})`;
        } else if (subElement.type === "user") {
          currentLine += `@user`;
        } else if (subElement.type === "channel") {
          currentLine += `#channel`;
        } else if (subElement.type === "emoji") {
          currentLine += `:${subElement.name || "emoji"}:`;
        }
      });
    } else if (element.type === "rich_text_list" && element.elements) {
      element.elements.forEach((listItem, index) => {
        if (listItem.type === "rich_text_section" && listItem.elements) {
          const itemText = listItem.elements.map((e) => e.text || "").join("");
          lines.push(
            `${element.style === "ordered" ? `${index + 1}.` : "-"} ${itemText}`
          );
        }
      });
    } else if (element.type === "rich_text_quote" && element.elements) {
      const quoteText = element.elements
        .filter((e) => e.type === "rich_text_section")
        .flatMap((e) => e.elements || [])
        .map((e) => e.text || "")
        .join("");

      lines.push(`> ${quoteText}`);
    } else if (element.type === "rich_text_preformatted" && element.elements) {
      const codeText = element.elements
        .filter((e) => e.type === "rich_text_section")
        .flatMap((e) => e.elements || [])
        .map((e) => e.text || "")
        .join("");

      lines.push("```");
      lines.push(codeText);
      lines.push("```");
    }
  });

  if (currentLine) {
    lines.push(currentLine);
  }

  return lines;
}

/**
 * Handle accessory elements (images, buttons, etc.)
 */
function handleAccessory(accessory: Element, mdLines: string[]): void {
  if (!accessory) return;

  switch (accessory.type) {
    case "image":
      if (accessory.image_url && accessory.alt_text) {
        mdLines.push(`![${accessory.alt_text}](${accessory.image_url})`);
      }
      break;

    case "button":
      if (accessory.text && accessory.url) {
        const buttonText =
          typeof accessory.text === "string"
            ? { type: "plain_text", text: accessory.text }
            : accessory.text;

        mdLines.push(`[${processTextObject(buttonText)}](${accessory.url})`);
      } else if (accessory.text) {
        const buttonText =
          typeof accessory.text === "string"
            ? { type: "plain_text", text: accessory.text }
            : accessory.text;

        mdLines.push(`*Button:* ${processTextObject(buttonText)}`);
      }
      break;

    case "select":
      if (accessory.placeholder) {
        mdLines.push(`*Dropdown:* ${processTextObject(accessory.placeholder)}`);
      }
      break;
  }
}

/**
 * Clean up the final markdown to remove excessive newlines and spacing
 */
function cleanupMarkdown(markdown: string): string {
  return markdown
    .replace(/\n{2,}/g, "\n") // Replace 2+ newlines with 1
    .trim(); // Remove leading/trailing whitespace
}
