import { Signal, createSignal, createMemo, For } from "solid-js";
import { generateAscendingArray, checkDateEquals } from "../utils";

export function Calendar({ visibility }: { visibility: Signal<boolean> }) {
  const NUMBER_OF_CELLS_IN_CALENDAR_GRID = 7 * 6;

  const monthIndex = createSignal(new Date().getMonth());
  const year = createSignal(new Date().getFullYear());
  const date = createSignal(new Date().getDate());

  const fullDate = createMemo(() => {
    return new Date(year[0](), monthIndex[0](), date[0]());
  });

  const daysInMonth = createMemo(() => {
    switch (fullDate().getMonth() + 1) {
      case 1:
        return 31;
      case 2:
        return fullDate().getFullYear() % 4 === 0 ? 29 : 28;
      case 3:
        return 31;
      case 4:
        return 30;
      case 5:
        return 31;
      case 6:
        return 30;
      case 7:
        return 31;
      case 8:
        return 31;
      case 9:
        return 30;
      case 10:
        return 31;
      case 11:
        return 30;
      case 12:
        return 31;
      default:
        return 30;
    }
  });

  const paddingDays = createMemo(() => {
    return new Date(year[0](), monthIndex[0](), 1).getDay();
  });

  const remainingCalendarGridCells = createMemo(
    () => NUMBER_OF_CELLS_IN_CALENDAR_GRID - paddingDays() - daysInMonth()
  );

  return (
    <div class={"calendar-widget " + (!visibility[0]() ? "closed " : "")}>
      <div class="header">
        <button
          onClick={() => {
            monthIndex[1]((v) => {
              if (
                v === 0 // January.
              ) {
                v = 11;
                year[1]((v) => --v);
              } else {
                v--;
              }
              return v;
            });
          }}
        >
          <span>◀</span>
        </button>
        {monthIndex[0]() + 1}/{year[0]()}
        <button
          onClick={() => {
            monthIndex[1]((v) => {
              if (
                v === 11 // December. NOT november, as it may seem.
              ) {
                v = 0;
                year[1]((v) => ++v);
              } else {
                v++;
              }
              return v;
            });
          }}
        >
          <span>▶</span>
        </button>
      </div>
      <div class="days">
        <div>S</div>
        <div>M</div>
        <div>T</div>
        <div>W</div>
        <div>T</div>
        <div>F</div>
        <div>S</div>
      </div>
      <div class="calendar-grid">
        <For each={generateAscendingArray(paddingDays())}>
          {(_) => {
            return <div></div>;
          }}
        </For>
        <For each={generateAscendingArray(daysInMonth())}>
          {(day) => {
            return (
              <div
                class={
                  checkDateEquals(
                    new Date(year[0](), monthIndex[0](), day),
                    new Date()
                  )
                    ? "today"
                    : ""
                }
              >
                {day}
              </div>
            );
          }}
        </For>
        <For each={generateAscendingArray(remainingCalendarGridCells())}>
          {(_) => <div></div>}
        </For>
      </div>
    </div>
  );
}
