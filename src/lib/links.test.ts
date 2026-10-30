import fs from "node:fs";
import path from "node:path";
import { describe, expect, it } from "vitest";
import { WHATSAPP_LINK } from "./links";

describe("WHATSAPP_LINK", () => {
  it("is the same in the counting function (api/whatsapp.ts)", () => {
    const api = fs.readFileSync(path.resolve(__dirname, "../../api/whatsapp.ts"), "utf8");
    expect(api).toContain(`"${WHATSAPP_LINK}"`);
  });
});
