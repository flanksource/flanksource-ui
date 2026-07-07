import type { Meta, StoryFn } from "@storybook/react";

declare module "@storybook/react" {
  export type ComponentMeta<TComponent> = Meta<TComponent>;
  export type ComponentStory<TComponent> = StoryFn<TComponent>;
  export type Story<TArgs = unknown> = StoryFn<TArgs>;
}
