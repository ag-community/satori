export const BBCODE_TAGS: {
  tag: string
  html: string
  usePresetHandler?: boolean
}[] = [
  { tag: "b", html: "strong" },
  { tag: "i", html: "em" },
  { tag: "u", html: "u" },
  { tag: "s", html: "s" },
  { tag: "url", html: "a", usePresetHandler: true },
]
