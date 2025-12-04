import { CreateTodoInput } from "../schemas/todoSchemas";

const emojiRegex = /([\u{1F300}-\u{1F9FF}\u{2700}-\u{27BF}])/u;

function parseDuration(token: string): number | undefined {
  const m = token.match(/^#(\d+)(h|m)$/i);
  if (!m) return undefined;
  const n = parseInt(m[1], 10);
  return m[2].toLowerCase() === "h" ? n*60 : n;
}

export const parseNLTodo = (text: string): (CreateTodoInput & {
  tags?: string[];
  estimatedMinutes?: number;
  dueDate?: string;
}) => {
  const raw = text.trim();
  // collect emojis and remove from text
  const emojis: string[] = [];
  let cleanedText = raw.replace(/([\u{1F300}-\u{1F9FF}\u{2700}-\u{27BF}])/gu, (m) => { emojis.push(m); return ""; });

  const tokens = cleanedText.split(/\s+/).filter(Boolean);

  const tags: string[] = [];
  let estimatedMinutes: number | undefined;
  let dueDate: string | undefined;

  tokens.forEach((t, idx) => {
    if (t.toLowerCase().startsWith("tag:")) tags.push(t.slice(4));
    const dur = parseDuration(t);
    if (dur) estimatedMinutes = dur;
  });

  const lower = tokens.map(t => t.toLowerCase());
  const byIdx = lower.indexOf("by");
  if (byIdx >= 0 && tokens[byIdx + 1]) {
    dueDate = tokens.slice(byIdx + 1, byIdx + 4).join(" ");
  }

  // build title excluding tokens
  const titleTokens = tokens.filter((t, idx) => {
    if (t.toLowerCase()==="by") return false;
    if (/^#\d+(h|m)$/i.test(t)) return false;
    if (t.toLowerCase().startsWith("tag:")) return false;
    if (byIdx !== -1 && idx > byIdx && idx <= byIdx+3) return false;
    return true;
  });

  let title = titleTokens.join(" ").trim();
  if (!title) title = "Untitled";

  // append emojis to title if any (makes UI fun)
  if (emojis.length) title = `${emojis.join(" ")} ${title}`;

  return {
    title,
    description: "",
    tags: tags.length ? tags : undefined,
    estimatedMinutes,
    dueDate
  };
};
