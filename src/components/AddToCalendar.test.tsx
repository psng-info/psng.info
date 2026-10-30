import { describe, it, expect, beforeEach, vi } from "vitest";
import { fireEvent, render, screen } from "@testing-library/react";
import { LocaleProvider, localeFromPath } from "@/i18n/locale";
import AddToCalendar from "./AddToCalendar";
import type { CalendarEvent } from "@/lib/calendar";

const lecture: CalendarEvent = {
  id: "series-2026-10-20",
  title: "PSNG Lecture",
  date: "2026-10-20",
  startTime: "19:00",
  endTime: "20:00",
  location: "Zoom",
};

function renderMenu(path = "/") {
  return render(
    <LocaleProvider locale={localeFromPath(path)}>
      <AddToCalendar event={lecture} />
    </LocaleProvider>,
  );
}

describe("AddToCalendar", () => {
  beforeEach(() => {
    URL.createObjectURL = vi.fn(() => "blob:psng");
    URL.revokeObjectURL = vi.fn();
  });

  it("keeps the menu closed until it is asked for", () => {
    renderMenu();
    expect(screen.queryByRole("menu")).toBeNull();
    expect(screen.getByRole("button")).toHaveAttribute("aria-expanded", "false");
  });

  it("offers the three ways into a calendar", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getAllByRole("menuitem")).toHaveLength(3);
    const google = screen.getByRole("menuitem", { name: "Google Kalender" });
    expect(google).toHaveAttribute(
      "href",
      expect.stringContaining("calendar.google.com"),
    );
    expect(google.getAttribute("href")).toContain(
      "20261020T170000Z%2F20261020T180000Z",
    );
  });

  it("speaks the language of the page", () => {
    renderMenu("/en");
    fireEvent.click(screen.getByRole("button"));
    expect(screen.getByRole("menuitem", { name: "Google Calendar" })).toBeTruthy();
  });

  it("hands out a file for Apple and for everything else", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button"));
    fireEvent.click(screen.getByRole("menuitem", { name: "Apple Kalender / iCloud" }));
    expect(URL.createObjectURL).toHaveBeenCalledTimes(1);
    // Nach dem Klick ist das Menü erledigt.
    expect(screen.queryByRole("menu")).toBeNull();
  });

  it("closes on Escape and gives the focus back", () => {
    renderMenu();
    const trigger = screen.getByRole("button");
    fireEvent.click(trigger);
    fireEvent.keyDown(screen.getAllByRole("menuitem")[0], { key: "Escape" });
    expect(screen.queryByRole("menu")).toBeNull();
    expect(document.activeElement).toBe(trigger);
  });

  it("walks through the entries with the arrow keys", () => {
    renderMenu();
    fireEvent.click(screen.getByRole("button"));
    const entries = screen.getAllByRole("menuitem");
    // Beim Öffnen steht der Fokus schon im ersten Eintrag.
    expect(document.activeElement).toBe(entries[0]);
    fireEvent.keyDown(entries[0], { key: "ArrowDown" });
    expect(document.activeElement).toBe(entries[1]);
    // Und läuft am Ende wieder nach vorn.
    fireEvent.keyDown(entries[1], { key: "ArrowUp" });
    fireEvent.keyDown(entries[0], { key: "ArrowUp" });
    expect(document.activeElement).toBe(entries[2]);
  });
});
